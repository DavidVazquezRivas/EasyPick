from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import sys
from typing import Any

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

CRITICAL_KEYS = (
    "EASYPICK_API_BASE_URL",
    "EASYPICK_REFRESH_TOKEN",
    "EASYPICK_AUTH_REFRESH_ENDPOINT",
    "GARMENT_CONFIG_ENDPOINT",
    "GARMENT_CONFIG_TIMEOUT_SECONDS",
    "SYNC_GARMENT_LABELS_ON_STARTUP",
)

ALIAS_MAP = {
    "api_base_url": "EASYPICK_API_BASE_URL",
    "auth_refresh_token": "EASYPICK_REFRESH_TOKEN",
    "auth_refresh_endpoint": "EASYPICK_AUTH_REFRESH_ENDPOINT",
    "garment_config_endpoint": "GARMENT_CONFIG_ENDPOINT",
    "garment_config_timeout_seconds": "GARMENT_CONFIG_TIMEOUT_SECONDS",
    "sync_garment_labels_on_startup": "SYNC_GARMENT_LABELS_ON_STARTUP",
}


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


def with_aliases(raw: dict[str, str]) -> dict[str, str]:
    normalized = dict(raw)
    for alias, canonical in ALIAS_MAP.items():
        if canonical not in normalized and alias in normalized:
            normalized[canonical] = normalized[alias]
    return normalized


def merge_env(
    *,
    process_env: dict[str, str],
    global_env: dict[str, str],
    local_env: dict[str, str],
) -> tuple[dict[str, str], dict[str, str]]:
    merged = dict(process_env)
    source: dict[str, str] = {}

    for key in process_env:
        source[key] = "process"

    for key, value in global_env.items():
        if key not in merged or not merged[key]:
            merged[key] = value
            source[key] = "global"

    for key, value in local_env.items():
        if key not in merged or not merged[key]:
            merged[key] = value
            source[key] = "local"

    return merged, source


def mask_token(token: str) -> str:
    if not token:
        return "<empty>"
    if len(token) <= 8:
        return "*" * len(token)
    return f"{token[:4]}...{token[-4:]}"


def lists_snapshot(settings: Any) -> dict[str, list[str]]:
    return {
        "category_labels": list(settings.category_labels),
        "color_labels": list(settings.color_labels),
        "style_labels": list(settings.style_labels),
        "brand_labels": list(settings.brand_labels),
    }


def print_snapshot(title: str, data: dict[str, list[str]]) -> None:
    print(f"\n{title}")
    print("=" * len(title))
    for key, values in data.items():
        print(f"{key} ({len(values)}):")
        print(json.dumps(values, ensure_ascii=False, indent=2))


def print_diff(before: dict[str, list[str]], after: dict[str, list[str]]) -> None:
    print("\nCHANGES")
    print("=======")
    for key in before:
        before_set = set(before[key])
        after_set = set(after[key])
        added = sorted(after_set - before_set)
        removed = sorted(before_set - after_set)
        print(f"{key} -> +{len(added)} / -{len(removed)}")
        if added:
            print("  added:")
            print(json.dumps(added, ensure_ascii=False, indent=2))
        if removed:
            print("  removed:")
            print(json.dumps(removed, ensure_ascii=False, indent=2))


def main() -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Diagnostica la carga de configuracion: process env -> global .env -> local .env "
            "y ejecuta sync_garment_labels_from_main_api()."
        )
    )
    parser.add_argument(
        "--global-env",
        default="",
        help="Ruta a .env global (opcional).",
    )
    parser.add_argument(
        "--local-env",
        default=".env",
        help="Ruta al .env local del servicio (por defecto: .env).",
    )
    parser.add_argument(
        "--force-token",
        default="",
        help="Si se indica, fuerza EASYPICK_REFRESH_TOKEN con este valor.",
    )
    args = parser.parse_args()

    global_path = Path(args.global_env).expanduser().resolve() if args.global_env else None
    local_path = Path(args.local_env).expanduser().resolve()

    process_env = dict(os.environ)
    global_raw = parse_env_file(global_path) if global_path else {}
    local_raw = parse_env_file(local_path)

    global_env = with_aliases(global_raw)
    local_env = with_aliases(local_raw)

    merged, source = merge_env(
        process_env=process_env,
        global_env=global_env,
        local_env=local_env,
    )

    if args.force_token:
        merged["EASYPICK_REFRESH_TOKEN"] = args.force_token
        source["EASYPICK_REFRESH_TOKEN"] = "--force-token"

    for key in CRITICAL_KEYS:
        if key in merged:
            os.environ[key] = merged[key]

    from app.config import SETTINGS
    from app.infra.config_sync import sync_garment_labels_from_main_api

    print("ENV SOURCES")
    print("===========")
    print(f"global env file: {global_path if global_path else '<none>'}")
    print(f"local env file : {local_path}")
    for key in CRITICAL_KEYS:
        value = os.getenv(key, "")
        origin = source.get(key, "default/internal")
        shown = mask_token(value) if key == "EASYPICK_REFRESH_TOKEN" else value or "<empty>"
        print(f"{key} -> {shown} (source: {origin})")

    before = lists_snapshot(SETTINGS)
    print_snapshot("BEFORE SYNC", before)

    sync_garment_labels_from_main_api()

    after = lists_snapshot(SETTINGS)
    print_snapshot("AFTER SYNC", after)
    print_diff(before, after)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
