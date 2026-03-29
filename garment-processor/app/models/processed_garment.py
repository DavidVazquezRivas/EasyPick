from __future__ import annotations

from pydantic import BaseModel, Field

from app.models.garment_labels import GarmentLabels


class ProcessedGarment(BaseModel):
    temp_id: str = Field(description="Temporary unique identifier for current processing session")
    detection_confidence: float
    labels: GarmentLabels
    image_index: int = Field(description="Index in ProcessGarmentsResponse.garment_pngs_base64")
    image_base64: str
    mime_type: str = "image/png"
