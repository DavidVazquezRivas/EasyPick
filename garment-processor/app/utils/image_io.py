from __future__ import annotations

import base64
from io import BytesIO

from PIL import Image, ImageOps


class InvalidImageError(Exception):
    pass


def load_image_from_bytes(raw_bytes: bytes) -> Image.Image:
    try:
        image = Image.open(BytesIO(raw_bytes))
        image = ImageOps.exif_transpose(image)
        if image.mode != "RGB":
            image = image.convert("RGB")
        return image
    except Exception as exc:
        raise InvalidImageError("Invalid or unsupported image file") from exc


def image_to_png_bytes(image: Image.Image) -> bytes:
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()


def bytes_to_base64(raw_bytes: bytes) -> str:
    return base64.b64encode(raw_bytes).decode("utf-8")


def image_to_base64_png(image: Image.Image) -> str:
    return bytes_to_base64(image_to_png_bytes(image))
