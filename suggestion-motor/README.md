# suggestion-motor

Microservicio `suggestion-motor` (FastAPI) — motor de sugerencias que combina filtrado determinista y un LLM local (Gemma 4 2B).

Requisitos principales
- Python 3.11
- PyTorch con soporte CUDA 12.8 (opcional, para inferencia en GPU)
- `transformers` + `accelerate` para cargar el modelo local en CPU/GPU

Instalación (recomendada — conda)

```bash
conda create -n suggestion-motor python=3.11 -y
conda activate suggestion-motor
# Instalar PyTorch con soporte CUDA 12.8 (usar los canales oficiales)
conda install pytorch torchvision torchaudio pytorch-cuda=12.8 -c pytorch -c nvidia

# Instalar el resto de dependencias
pip install -r requirements.txt
```

Si no necesita GPU, puede omitir el paso de `pytorch-cuda` e instalar una build CPU o usar `pip`.

Uso (desarrollo)

```bash
uvicorn main:app --reload
```

Endpoints
- `POST /api/v1/suggestions/generate` — generar sugerencias (payload definido en `prompt_inicial.md`).

Notas
- La carga del modelo LLM está diseñada para ser intercambiable (vLLM / llama.cpp / adaptadores). Ver `infrastructure/llm/gemma_local_engine.py`.

LLM backend selection

- Use the environment variable `LLM_BACKEND` or the Settings `LLM_BACKEND` to choose the runtime backend.
- Allowed values: `auto` (default), `gpu`, `cpu`.
- `auto` will try to use GPU (PyTorch + CUDA) and fall back to CPU if unavailable.
- El modelo se resuelve desde `LLM_MODEL_ID` y por defecto apunta a `google/gemma-2-2b-it`.
- La clave de Hugging Face se toma de `HUGGINGFACE_ACCESS_TOKEN`, `HUGGINGFACE_HUB_TOKEN` o `HF_TOKEN`.

Example (force CPU fallback):

```bash
export LLM_BACKEND=cpu
uvicorn main:app --reload
```

If you want GPU inference ensure you installed PyTorch with CUDA 12.8 as described above and that `nvidia-smi` shows a compatible GPU.

Example (model access token):

```bash
export HUGGINGFACE_HUB_TOKEN=... 
export LLM_BACKEND=auto
uvicorn main:app --reload
```