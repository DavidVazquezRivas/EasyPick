from __future__ import annotations


class DomainError(Exception):
    """Base error type for domain/use-case failures."""


class DetectionFailure(DomainError):
    """Raised when candidate detection fails."""


class ClassificationFailure(DomainError):
    """Raised when downstream classification stages fail."""