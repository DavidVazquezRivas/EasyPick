"""Run example images through /process-garments and store JSON output."""
from __future__ import annotations

import json
import mimetypes
from datetime import datetime
from pathlib import Path
from typing import Any

from fastapi.testclient import TestClient

from app.application import create_app

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "debug_output"
AVIF_SIGNATURE_OFFSET = 4
AVIF_SIGNATURE_END = 12
AVIF_SIGNATURE = b"ftypavif"


def _detect_mime_type(image_path: Path) -> str:
    with image_path.open("rb") as image_file:
        signature = image_file.read(32)

    if signature.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if signature.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if signature.startswith((b"GIF87a", b"GIF89a")):
        return "image/gif"
    if signature[0:4] == b"RIFF" and signature[8:12] == b"WEBP":
        return "image/webp"
    if len(signature) >= AVIF_SIGNATURE_END and signature[AVIF_SIGNATURE_OFFSET:AVIF_SIGNATURE_END] == AVIF_SIGNATURE:
        return "image/avif"

    guessed_mime, _ = mimetypes.guess_type(image_path.name)
    return guessed_mime or "application/octet-stream"


def run_examples() -> dict[str, Any]:
    app = create_app()

    images = [
        ROOT / "example.jpg",
        ROOT / "example2.jpg",
    ]

    report: dict[str, Any] = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "endpoint": "/process-garments",
        "results": {},
    }
    results: dict[str, Any] = report["results"]

    with TestClient(app) as client:
        for image_path in images:
            key = image_path.stem
            if not image_path.exists():
                results[key] = {
                    "image": image_path.name,
                    "status_code": None,
                    "error": "image_not_found",
                }
                continue

            with image_path.open("rb") as image_file:
                response = client.post(
                    "/process-garments",
                    files={"image": (image_path.name, image_file, _detect_mime_type(image_path))},
                )

            payload: dict[str, Any]
            try:
                payload = response.json()
            except Exception:
                payload = {"raw_text": response.text}

            garments_raw = payload.get("garments")
            garments_count = len(garments_raw) if isinstance(garments_raw, list) else 0

            results[key] = {
                "image": image_path.name,
                "status_code": response.status_code,
                "garments_count": garments_count,
                "response": payload,
            }

    return report


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    report = run_examples()

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = OUTPUT_DIR / f"endpoint_examples_output_{timestamp}.json"
    latest_path = OUTPUT_DIR / "endpoint_examples_output_latest.json"

    output_path.write_text(
        json.dumps(report, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    latest_path.write_text(
        json.dumps(report, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    print(f"Saved output to: {output_path}")
    print(f"Updated latest output: {latest_path}")


if __name__ == "__main__":
    main()
