from __future__ import annotations

from io import BytesIO

from PIL import Image
from rembg import remove


class BackgroundRemover:
    def remove_background(self, image: Image.Image) -> Image.Image:
        input_buffer = BytesIO()
        image.save(input_buffer, format="PNG")

        output_bytes = remove(input_buffer.getvalue())
        output_image = Image.open(BytesIO(output_bytes))
        if output_image.mode != "RGBA":
            output_image = output_image.convert("RGBA")
        return output_image
