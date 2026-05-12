# Pendientes y huecos del `suggestion-motor`

Este documento resume lo que todavía falta cerrar después de releer `prompt_inicial.md` y revisar el código actual.

## Veredicto general

La dirección es correcta: FastAPI, arquitectura hexagonal pragmática, carga en `lifespan`, cache de configuración y backend LLM intercambiable van alineados con el spec.

Lo que sigue faltando no es la idea principal, sino las piezas de integración y endurecimiento: contratos exactos con la API principal, módulos de infraestructura que aún son stubs y validación estricta de entradas/salidas.

## Lo que ya está alineado

- `main.py` usa `lifespan` para inicialización.
- Existe un backend LLM con selección por entorno.
- Se creó el esquema base de request/response para el endpoint principal.
- Hay un cache en memoria para datos globales de arranque.
- El flujo de arranque ya intenta sincronizarse con la API principal.

## Lo que falta implementar según el spec

### 1. Puertos y adaptadores que no existen todavía

- `application/interfaces/weather_provider.py`
- `application/interfaces/api_gateway.py`
- `infrastructure/gateways/spring_boot_client.py`
- `infrastructure/gateways/open_meteo_client.py`
- `core/security.py`
- `application/entities/garment.py`
- `application/entities/outfit.py`
- `application/entities/user_context.py`

### 2. Caso de uso real

- `generate_outfits_usecase.py` sigue siendo un stub muy básico.
- Falta el filtrado determinista de verdad:
  - temperatura vs `warm_index`
  - exclusiones por historial
  - validación de UUIDs contra inventario real
- Falta el prompting estructurado con JSON estricto.
- Falta el post-procesamiento robusto del resultado del modelo.

### 3. Contratos de la API principal

El spec menciona llamadas a la API principal, pero aún no están cerrados los contratos exactos.

Pendiente de definir:
- formato exacto de respuesta de `POST /api/auth/refresh`
- formato exacto de `GET /api/config/rejection-reasons`
- formato exacto de `GET /api/config/system-settings`
- códigos de error esperados
- expiración del JWT y política de reintento

### 4. Contrato del endpoint local

El spec pide `POST /api/v1/suggestions/generate`, pero falta endurecer:
- validación de payload para campos obligatorios y opcionales
- respuesta final con el formato exacto de outfits
- manejo explícito de UUIDs desconocidos en historial

### 5. Backend LLM

Se decidió usar `transformers + accelerate`, pero aún faltan detalles operativos:
- estrategia final de carga de modelo grande en GPU/CPU
- si se usará `LLM_MODEL_PATH` local o `LLM_MODEL_ID` de Hugging Face
- confirmación de si el modelo final será `google/gemma-2-2b-it` o un checkpoint Gemma 4 equivalente
- política de cuantización si la RAM/VRAM no alcanza

### 6. Infraestructura y despliegue

- `Dockerfile`
- variables de entorno de producción
- healthcheck / readiness endpoint
- observabilidad y logs estructurados

## Variables de entorno que conviene cerrar

### API principal

- `MAIN_API_BASE_URL`
- `MAIN_API_REFRESH_TOKEN`

### LLM / Hugging Face

- `LLM_BACKEND` con valores `auto`, `gpu`, `cpu`
- `LLM_MODEL_ID`
- `LLM_MODEL_PATH`
- `HUGGINGFACE_ACCESS_TOKEN` o `HUGGINGFACE_HUB_TOKEN` o `HF_TOKEN`

### Runtime

- `PORT`

## Preguntas abiertas

- ¿La API principal devolverá siempre `access_token` en `/api/auth/refresh`?
- ¿Los catálogos de `rejection-reasons` y `system-settings` tendrán versiones o cambios frecuentes?
- ¿El modelo final va a vivir en Hugging Face, en disco local o empaquetado en el entorno?
- ¿Queremos que el fallback CPU sea automático solo cuando `LLM_BACKEND=auto`, o también cuando `gpu` falle?

## Diferencias detectadas con el spec

- El spec pide investigar `llama.cpp` o `vLLM`, pero la implementación actual ya apunta a `transformers + accelerate`.
- El spec habla de Gemma 4 2B; la configuración actual usa `google/gemma-2-2b-it` como valor por defecto hasta concretar el checkpoint final.
- El módulo `core/security.py` aún no existe.
- Las entidades de dominio están todavía sin separar del todo.

## Próximos pasos recomendados

1. Crear los puertos faltantes y separar entidades de dominio reales.
2. Implementar el `generate_outfits_usecase` con filtrado y validación estricta.
3. Cerrar el contrato exacto con la API principal.
4. Añadir healthcheck y pruebas de integración básicas.