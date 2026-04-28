from __future__ import annotations

import argparse
import asyncio
import json
import os
import sys
from pathlib import Path
from typing import Any

from fastapi import UploadFile
from io import BytesIO
from starlette.datastructures import Headers

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

OUTPUT_DIR = PROJECT_ROOT / "debug_output"
DEFAULT_IMAGE_PATH = PROJECT_ROOT / "example.jpg"
DEFAULT_LOCAL_ENV_PATH = PROJECT_ROOT / ".env"

CRITICAL_ENV_KEYS = (
    "EASYPICK_API_BASE_URL",
    "EASYPICK_REFRESH_TOKEN",
    "EASYPICK_API_TOKEN",
    "EASYPICK_AUTH_REFRESH_ENDPOINT",
    "GARMENT_CONFIG_ENDPOINT",
    "GARMENT_CONFIG_TIMEOUT_SECONDS",
    "SYNC_GARMENT_LABELS_ON_STARTUP",
)


def parse_env_file(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.exists() or not path.is_file():
        return values

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue

        if line.startswith("export "):
            line = line[len("export ") :].strip()

        if "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip()
        if not key:
            continue

        if (value.startswith('"') and value.endswith('"')) or (
            value.startswith("'") and value.endswith("'")
        ):
            value = value[1:-1]

        values[key] = value

    return values


def resolve_env(*, global_env_path: str | None, local_env_path: str | None) -> None:
    merged = dict(os.environ)

    global_path = Path(global_env_path).expanduser().resolve() if global_env_path else None
    local_path = Path(local_env_path).expanduser().resolve() if local_env_path else DEFAULT_LOCAL_ENV_PATH

    if global_path is not None:
        merged.update({k: v for k, v in parse_env_file(global_path).items() if v})

    local_values = parse_env_file(local_path)
    merged.update({k: v for k, v in local_values.items() if v})

    if not merged.get("EASYPICK_REFRESH_TOKEN") and merged.get("EASYPICK_API_TOKEN"):
        merged["EASYPICK_REFRESH_TOKEN"] = merged["EASYPICK_API_TOKEN"]

    for key in CRITICAL_ENV_KEYS:
        if key in merged and merged[key]:
            os.environ[key] = merged[key]

    print("ENVIRONMENT")
    print("===========")
    print(f"global env: {global_path if global_path else '<none>'}")
    print(f"local env : {local_path}")
    for key in CRITICAL_ENV_KEYS:
        value = os.getenv(key, "")
        if key in {"EASYPICK_REFRESH_TOKEN", "EASYPICK_API_TOKEN"} and value:
            shown = f"{value[:4]}...{value[-4:]}" if len(value) > 8 else "*" * len(value)
        else:
            shown = value or "<empty>"
        print(f"{key}: {shown}")


def dump_label_state(title: str) -> None:
    from app.config import SETTINGS

    print(f"\n{title}")
    print("=" * len(title))
    print("category_labels:")
    print(json.dumps(list(SETTINGS.category_labels), ensure_ascii=False, indent=2))
    print("category_label_ids_by_name:")
    print(json.dumps(SETTINGS.category_label_ids_by_name, ensure_ascii=False, indent=2))
    print("color_labels:")
    print(json.dumps(list(SETTINGS.color_labels), ensure_ascii=False, indent=2))
    print("color_label_ids_by_name:")
    print(json.dumps(SETTINGS.color_label_ids_by_name, ensure_ascii=False, indent=2))
    print("style_labels:")
    print(json.dumps(list(SETTINGS.style_labels), ensure_ascii=False, indent=2))
    print("style_label_ids_by_name:")
    print(json.dumps(SETTINGS.style_label_ids_by_name, ensure_ascii=False, indent=2))
    print("brand_labels:")
    print(json.dumps(list(SETTINGS.brand_labels), ensure_ascii=False, indent=2))
    print("brand_label_ids_by_name:")
    print(json.dumps(SETTINGS.brand_label_ids_by_name, ensure_ascii=False, indent=2))


async def validate_image(image_path: Path) -> tuple[Any, Any]:
    from app.api.input_validator import InputValidator

    image_bytes = image_path.read_bytes()
    upload = UploadFile(
        filename=image_path.name,
        file=BytesIO(image_bytes),
        headers=Headers({"content-type": "image/jpeg"}),
    )

    print("\nSTEP 2 - IMAGE VALIDATION")
    print("==========================")
    print(f"input_image: {image_path}")
    print(f"size_bytes: {len(image_bytes)}")

    validated = await InputValidator.validate_upload(upload)
    print(f"validated_size: {validated.width}x{validated.height}")
    print(f"validated_content_type: {validated.content_type}")
    return upload, validated


def print_raw_garments(garments: list[Any]) -> None:
    print("\nSTEP 4 - DOMAIN OUTPUT BEFORE RESPONSE MAPPING")
    print("=============================================")
    print(f"garments_count: {len(garments)}")
    for index, garment in enumerate(garments, start=1):
        print(f"\nGarment #{index}")
        print(f"  detection_confidence: {garment.detection_confidence}")
        for dimension in ("category", "color", "style", "material", "season", "brand"):
            prediction = garment.labels.get(dimension)
            if prediction is None:
                print(f"  {dimension}: <missing>")
                continue
            print(
                f"  {dimension}: label={prediction.label!r} score={prediction.score:.4f}"
            )


def print_final_response(response_model: Any) -> None:
    print("\nSTEP 5 - FINAL API RESPONSE")
    print("===========================")
    payload = response_model.model_dump(by_alias=True)
    print(json.dumps(payload, ensure_ascii=False, indent=2))


def save_outputs(*, report: dict[str, Any], final_response: dict[str, Any]) -> tuple[Path, Path]:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    report_path = OUTPUT_DIR / "simulate_full_api_report_latest.json"
    response_path = OUTPUT_DIR / "simulate_full_api_response_latest.json"

    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    response_path.write_text(json.dumps(final_response, ensure_ascii=False, indent=2), encoding="utf-8")

    return report_path, response_path


async def run_simulation(image_path: Path) -> dict[str, Any]:
    from app.config import SETTINGS
    from app.infra.config_sync import sync_garment_labels_from_main_api
    from app.infra.bootstrap import build_runtime_components

    print("STEP 1 - CONFIG SYNC")
    print("====================")
    dump_label_state("Before sync")
    sync_garment_labels_from_main_api()
    dump_label_state("After sync")

    upload, validated = await validate_image(image_path)

    device = "cpu"
    if SETTINGS.use_gpu:
        try:
            import torch

            if torch.cuda.is_available():
                device = "cuda"
        except Exception:
            device = "cpu"

    print("\nSTEP 3 - RUNTIME BOOTSTRAP")
    print("===========================")
    print(f"device: {device}")
    components = build_runtime_components(device)

    garments = components.process_garments_use_case.execute(validated.image)
    print_raw_garments(garments)

    warmth_garments = components.calculate_warmth_index_use_case.execute(garments)
    print("\nSTEP 4B - WARMTH INDEX")
    print("======================")
    for index, garment in enumerate(warmth_garments, start=1):
        print(f"Garment #{index}: warmth_index={garment.warmth_index}")

    response = components.response_builder.build_many(warmth_garments)

    from app.models.process_garments_response import ProcessGarmentsResponse

    final_response = ProcessGarmentsResponse(garments=response)
    print_final_response(final_response)

    report = {
        "image": image_path.name,
        "response": final_response.model_dump(by_alias=True),
    }
    report_path, response_path = save_outputs(
        report=report,
        final_response=final_response.model_dump(by_alias=True),
    )
    print("\nSTEP 6 - OUTPUT FILES")
    print("=====================")
    print(f"full_report: {report_path}")
    print(f"final_response: {response_path}")

    return {
        "upload": upload,
        "validated": validated,
        "garments": garments,
        "response": response,
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Simula el flujo completo del garment processor con example.jpg y muestra la respuesta final."
    )
    parser.add_argument(
        "--image",
        default=str(DEFAULT_IMAGE_PATH),
        help="Ruta a la imagen de entrada (por defecto: example.jpg en la raiz del servicio).",
    )
    parser.add_argument(
        "--global-env",
        default=None,
        help="Ruta a un .env global opcional.",
    )
    parser.add_argument(
        "--local-env",
        default=str(DEFAULT_LOCAL_ENV_PATH),
        help="Ruta al .env local del servicio (por defecto: .env en la raiz).",
    )
    args = parser.parse_args()

    resolve_env(global_env_path=args.global_env, local_env_path=args.local_env)

    image_path = Path(args.image).expanduser().resolve()
    if not image_path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")

    asyncio.run(run_simulation(image_path))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
