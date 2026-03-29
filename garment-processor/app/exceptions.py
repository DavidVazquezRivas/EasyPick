from __future__ import annotations


class ProcessingError(Exception):
    """Base error for processing pipeline failures."""


class InvalidInputError(ProcessingError):
    """Raised when an uploaded file fails input validation."""


class YoloDetectionError(ProcessingError):
    """Raised when YOLO inference fails."""


class BackgroundRemovalError(ProcessingError):
    """Raised when background removal fails."""


class ClipClassificationError(ProcessingError):
    """Raised when CLIP classification fails or is unreliable."""
