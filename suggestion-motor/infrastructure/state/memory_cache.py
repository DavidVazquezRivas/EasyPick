from __future__ import annotations
from typing import Any


class MemoryCache:
    _store: dict[str, Any] = {}

    @classmethod
    def get(cls, key: str, default: Any = None) -> Any:
        return cls._store.get(key, default)

    @classmethod
    def set(cls, key: str, value: Any) -> None:
        cls._store[key] = value

    @classmethod
    def clear(cls) -> None:
        cls._store.clear()
