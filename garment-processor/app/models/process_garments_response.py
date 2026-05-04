from __future__ import annotations

from pydantic import BaseModel

from app.models.processed_garment import ProcessedGarment


class ProcessGarmentsResponse(BaseModel):
    garments: list[ProcessedGarment]
