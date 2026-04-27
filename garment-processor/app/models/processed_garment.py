from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field


class ProcessedGarment(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    temp_id: str = Field(
        alias="tempId",
        description="Temporary unique identifier for current processing session",
    )
    category: str | None = None
    color: str | None = None
    style: str | None = None
    brand: str | None = None
    image_base64: str = Field(alias="imageBase64")
    warmth_index: float | None = Field(default=None, alias="warmthIndex")
