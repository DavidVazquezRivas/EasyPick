from __future__ import annotations
import abc
from typing import Any


class LLMProvider(abc.ABC):
    """Abstract interface for an LLM backend."""

    @abc.abstractmethod
    async def load(self) -> None:
        """Load model weights or prepare backend."""

    @abc.abstractmethod
    async def generate(self, prompt: str, temperature: float = 0.4, max_tokens: int = 256) -> Any:
        """Generate text or structured output from the model."""
