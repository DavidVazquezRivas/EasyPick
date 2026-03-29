from __future__ import annotations

from pydantic import BaseModel

from app.models.processed_garment import ProcessedGarment


class ProcessGarmentsResponse(BaseModel):
    garment_pngs_base64: list[str]
    garments: list[ProcessedGarment]
    mime_type: str = "image/png"
