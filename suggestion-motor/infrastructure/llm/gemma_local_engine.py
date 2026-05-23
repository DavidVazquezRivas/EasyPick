from __future__ import annotations

import asyncio
import logging
import os
from typing import Any, Optional

from application.interfaces.llm_provider import LLMProvider
from core.config import Settings

logger = logging.getLogger("gemma_local_engine")


class GemmaLocalEngine(LLMProvider):
    def __init__(self, model_path: Optional[str] = None, backend: Optional[str] = None, model_id: Optional[str] = None):
        self.model_path = model_path
        self.model_id = model_id or os.getenv("LLM_MODEL_ID", "google/gemma-2-2b-it")
        self.requested_backend = (backend or os.getenv("LLM_BACKEND", "auto")).lower()
        self.effective_backend: str = "cpu"
        self.device: str = "cpu"
        self.loaded = False
        self._tokenizer = None
        self._model = None
        self._torch = None

    def _resolve_hf_token(self) -> Optional[str]:
        settings = Settings()
        return (
            settings.HUGGINGFACE_ACCESS_TOKEN
            or settings.HUGGINGFACE_HUB_TOKEN
            or settings.HF_TOKEN
            or os.getenv("HUGGINGFACE_ACCESS_TOKEN")
            or os.getenv("HUGGINGFACE_HUB_TOKEN")
            or os.getenv("HF_TOKEN")
        )

    def _resolve_model_name(self) -> str:
        return self.model_path or self.model_id

    async def load(self) -> None:
        if self.loaded:
            return

        try:
            import torch
            from transformers import AutoModelForCausalLM, AutoTokenizer
        except Exception as exc:
            raise RuntimeError("transformers/torch are required for GemmaLocalEngine") from exc

        self._torch = torch

        backend = self.requested_backend
        cuda_available = bool(getattr(torch, "cuda", None) and torch.cuda.is_available())

        if backend == "gpu":
            if not cuda_available:
                logger.warning("LLM_BACKEND=gpu requested but CUDA is unavailable; falling back to cpu")
                backend = "cpu"
        elif backend == "auto":
            backend = "gpu" if cuda_available else "cpu"

        self.effective_backend = backend
        self.device = "cuda" if backend == "gpu" else "cpu"

        model_name = self._resolve_model_name()
        token = self._resolve_hf_token()

        tokenizer_kwargs: dict[str, Any] = {}
        model_kwargs: dict[str, Any] = {"trust_remote_code": True}

        if token:
            tokenizer_kwargs["token"] = token
            model_kwargs["token"] = token

        if self.device == "cuda":
            dtype = torch.float16
            if hasattr(torch, "bfloat16") and torch.cuda.is_bf16_supported():
                dtype = torch.bfloat16
            model_kwargs.update({
                "device_map": "auto",
                "torch_dtype": dtype,
                "low_cpu_mem_usage": True,
            })
        else:
            model_kwargs.update({
                "device_map": {"": "cpu"},
                "torch_dtype": torch.float32,
                "low_cpu_mem_usage": True,
            })

        logger.info("Loading LLM model=%s backend=%s device=%s", model_name, self.effective_backend, self.device)
        self._tokenizer = AutoTokenizer.from_pretrained(model_name, **tokenizer_kwargs)
        self._model = AutoModelForCausalLM.from_pretrained(model_name, **model_kwargs)

        if self._tokenizer.pad_token_id is None and self._tokenizer.eos_token_id is not None:
            self._tokenizer.pad_token = self._tokenizer.eos_token

        self.loaded = True
        logger.info("GemmaLocalEngine loaded (model=%s, backend=%s, device=%s)", model_name, self.effective_backend, self.device)

    async def generate(self, prompt: str, temperature: float = 0.4, max_tokens: int = 256) -> Any:
        if not self.loaded or self._tokenizer is None or self._model is None or self._torch is None:
            await self.load()

        assert self._tokenizer is not None
        assert self._model is not None
        assert self._torch is not None

        return await asyncio.to_thread(self._generate_sync, prompt, temperature, max_tokens)

    def _generate_sync(self, prompt: str, temperature: float, max_tokens: int) -> dict[str, Any]:
        torch = self._torch
        tokenizer = self._tokenizer
        model = self._model

        inputs = tokenizer(prompt, return_tensors="pt")
        if self.device == "cuda":
            inputs = {key: value.to("cuda") for key, value in inputs.items()}

        do_sample = temperature > 0
        generation_kwargs = {
            "max_new_tokens": max_tokens,
            "do_sample": do_sample,
            "temperature": temperature if do_sample else None,
            "pad_token_id": tokenizer.eos_token_id,
        }
        generation_kwargs = {key: value for key, value in generation_kwargs.items() if value is not None}

        with torch.inference_mode():
            output_ids = model.generate(**inputs, **generation_kwargs)

        decoded = tokenizer.decode(output_ids[0], skip_special_tokens=True)
        return {
            "generated": True,
            "backend": self.effective_backend,
            "device": self.device,
            "text": decoded,
        }


_DEFAULT_ENGINE: Optional[GemmaLocalEngine] = None


def get_default_engine(model_path: Optional[str] = None, backend: Optional[str] = None, model_id: Optional[str] = None) -> GemmaLocalEngine:
    global _DEFAULT_ENGINE
    if _DEFAULT_ENGINE is None:
        _DEFAULT_ENGINE = GemmaLocalEngine(model_path=model_path, backend=backend, model_id=model_id)
    return _DEFAULT_ENGINE