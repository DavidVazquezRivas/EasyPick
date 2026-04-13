from __future__ import annotations

from dataclasses import dataclass

from fastapi import UploadFile
from PIL import Image

from app.config import SETTINGS
from app.exceptions import InvalidInputError
from app.utils.image_io import InvalidImageError, load_image_from_bytes


@dataclass(frozen=True)
class ValidatedImage:
    image: Image.Image
    content_type: str
    size_bytes: int
    width: int
    height: int


class InputValidator:
    @staticmethod
    async def validate_upload(image: UploadFile) -> ValidatedImage:
        if not image.content_type or not image.content_type.startswith("image/"):
            raise InvalidInputError("File must be an image")

        content = await image.read()
        content_size = len(content)

        if content_size == 0:
            raise InvalidInputError("Image file is empty")
        if content_size > SETTINGS.max_upload_size_bytes:
            raise InvalidInputError("Image exceeds max upload size")

        try:
            pil_image = load_image_from_bytes(content)
        except InvalidImageError as exc:
            raise InvalidInputError(str(exc)) from exc

        width, height = pil_image.size
        if width < SETTINGS.min_image_width or height < SETTINGS.min_image_height:
            raise InvalidInputError(
                f"Image is too small. Minimum is {SETTINGS.min_image_width}x{SETTINGS.min_image_height}"
            )
        if width > SETTINGS.max_image_width or height > SETTINGS.max_image_height:
            raise InvalidInputError(
                f"Image is too large. Maximum is {SETTINGS.max_image_width}x{SETTINGS.max_image_height}"
            )

        return ValidatedImage(
            image=pil_image,
            content_type=image.content_type,
            size_bytes=content_size,
            width=width,
            height=height,
        )
