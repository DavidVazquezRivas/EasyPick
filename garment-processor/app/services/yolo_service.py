from __future__ import annotations

from dataclasses import dataclass

from PIL import Image
from ultralytics import YOLO

from app.config import SETTINGS
from app.exceptions import YoloDetectionError


@dataclass
class DetectedCrop:
    image: Image.Image
    confidence: float


class YoloGarmentDetector:
    def __init__(self, model: YOLO) -> None:
        self._model = model

    def detect_and_crop(self, image: Image.Image) -> list[DetectedCrop]:
        try:
            results = self._model.predict(
                source=image,
                conf=SETTINGS.yolo_confidence_threshold,
                verbose=False,
            )
        except Exception as exc:
            raise YoloDetectionError("YOLO detection failed") from exc

        if not results:
            return []

        result = results[0]
        if result.boxes is None or len(result.boxes) == 0:
            return []

        names = result.names
        width, height = image.size
        detected: list[DetectedCrop] = []

        for box in result.boxes:
            class_id = int(box.cls.item())
            class_name = self._class_name_from_id(names, class_id)
            if class_name not in SETTINGS.yolo_allowed_class_names:
                continue

            confidence = float(box.conf.item())
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            left = max(0, int(x1))
            top = max(0, int(y1))
            right = min(width, int(x2))
            bottom = min(height, int(y2))

            if right <= left or bottom <= top:
                continue

            crop = image.crop((left, top, right, bottom))
            detected.append(DetectedCrop(image=crop, confidence=confidence))

        detected.sort(key=lambda item: item.confidence, reverse=True)
        return detected

    @staticmethod
    def _class_name_from_id(names: dict[int, str] | list[str], class_id: int) -> str:
        if isinstance(names, dict):
            return str(names.get(class_id, ""))
        if 0 <= class_id < len(names):
            return str(names[class_id])
        return ""
