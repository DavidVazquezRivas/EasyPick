from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw
from transformers import CLIPModel, CLIPProcessor

from app.config import SETTINGS
from app.services.garment_filter_service import ClipGarmentFilter
from app.services.segmentation_service import SamSegmentationService


def main() -> None:
    input_path = Path("example.jpg")
    output_dir = Path("debug_output") / "segmentation"
    output_dir.mkdir(parents=True, exist_ok=True)

    if not input_path.exists():
        raise FileNotFoundError(f"Image not found: {input_path}")

    image = Image.open(input_path).convert("RGB")
    segmenter = SamSegmentationService.create_default()

    clip_model = CLIPModel.from_pretrained(SETTINGS.clip_model_name)
    clip_model.eval()
    clip_processor = CLIPProcessor.from_pretrained(SETTINGS.clip_model_name)
    garment_filter = ClipGarmentFilter(model=clip_model, processor=clip_processor)

    candidates = segmenter.segment(image)

    annotated = image.copy()
    draw = ImageDraw.Draw(annotated)
    manifest: list[dict[str, object]] = []

    for idx, candidate in enumerate(candidates):
        decision = garment_filter.is_garment(candidate.image)
        keep = decision.is_garment

        left, top, right, bottom = candidate.bbox
        color = "lime" if keep else "red"
        draw.rectangle((left, top, right, bottom), outline=color, width=3)
        draw.text(
            (left + 4, max(0, top - 14)),
            f"#{idx} {'GARMENT' if keep else 'DROP'} {candidate.confidence:.2f}",
            fill=color,
        )

        crop_name = f"cand_{idx:02d}_{'keep' if keep else 'drop'}.png"
        crop_path = output_dir / crop_name
        candidate.image.save(crop_path)

        manifest.append(
            {
                "index": idx,
                "confidence": candidate.confidence,
                "bbox": [left, top, right, bottom],
                "area_px": candidate.area_px,
                "garment_score": decision.garment_score,
                "non_garment_score": decision.non_garment_score,
                "is_garment": keep,
                "crop_file": str(crop_path.as_posix()),
            }
        )

    annotated_path = output_dir / "annotated_segmentation.png"
    annotated.save(annotated_path)

    summary_path = output_dir / "candidates.json"
    summary_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    kept = sum(1 for item in manifest if bool(item.get("is_garment")))
    print(f"Saved annotated image: {annotated_path}")
    print(f"Saved candidates summary: {summary_path}")
    print(f"Total candidates: {len(manifest)} | Garments kept: {kept}")


if __name__ == "__main__":
    main()
