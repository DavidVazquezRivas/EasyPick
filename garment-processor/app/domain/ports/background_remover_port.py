from __future__ import annotations

from typing import Protocol

from PIL import Image


class BackgroundRemoverPort(Protocol):
    def remove_background(self, image: Image.Image) -> Image.Image:
        ...