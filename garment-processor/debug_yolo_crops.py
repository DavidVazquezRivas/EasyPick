from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw
from ultralytics import YOLO

from app.config import SETTINGS


def class_name_from_id(names: dict[int, str] | list[str], class_id: int) -> str:
    if isinstance(names, dict):
        return str(names.get(class_id, ""))
    if 0 <= class_id < len(names):
        return str(names[class_id])
    return ""


def main() -> None:
    input_image = Path("example.jpg")
    output_dir = Path("debug_output") / "yolo"
    output_dir.mkdir(parents=True, exist_ok=True)

    if not input_image.exists():
        raise FileNotFoundError(f"Image not found: {input_image}")

    image = Image.open(input_image).convert("RGB")
    width, height = image.size

    model = YOLO(SETTINGS.yolo_model_name)
    results = model.predict(
        source=image,
        conf=SETTINGS.yolo_confidence_threshold,
        verbose=False,
    )

    if not results:
        print("No YOLO results")
        return

    result = results[0]
    boxes = result.boxes
    names = result.names

    annotated = image.copy()
    draw = ImageDraw.Draw(annotated)

    manifest: list[dict[str, object]] = []

    if boxes is None or len(boxes) == 0:
        print("No boxes detected")
    else:
        for idx, box in enumerate(boxes):
            class_id = int(box.cls.item())
            class_name = class_name_from_id(names, class_id)
            confidence = float(box.conf.item())

            x1, y1, x2, y2 = box.xyxy[0].tolist()
            left = max(0, int(x1))
            top = max(0, int(y1))
            right = min(width, int(x2))
            bottom = min(height, int(y2))

            if right <= left or bottom <= top:
                continue

            keep = class_name in SETTINGS.yolo_allowed_class_names
            color = "lime" if keep else "red"
            draw.rectangle((left, top, right, bottom), outline=color, width=3)
            draw.text((left + 4, max(0, top - 14)), f"{class_name} {confidence:.2f}", fill=color)

            crop = image.crop((left, top, right, bottom))
            crop_name = f"crop_{idx:02d}_{class_name or 'unknown'}_{'kept' if keep else 'ignored'}.png"
            crop_path = output_dir / crop_name
            crop.save(crop_path)

            manifest.append(
                {
                    "index": idx,
                    "class_name": class_name,
                    "confidence": confidence,
                    "keep": keep,
                    "bbox": [left, top, right, bottom],
                    "crop_file": str(crop_path.as_posix()),
                }
            )

    annotated_path = output_dir / "annotated_detections.png"
    annotated.save(annotated_path)

    summary_path = output_dir / "detections.json"
    summary_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    kept_count = sum(1 for item in manifest if bool(item.get("keep")))
    print(f"Saved annotated image: {annotated_path}")
    print(f"Saved detections summary: {summary_path}")
    print(f"Total detections: {len(manifest)} | Kept by current filter: {kept_count}")


if __name__ == "__main__":
    main()
