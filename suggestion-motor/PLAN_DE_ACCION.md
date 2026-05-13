# Plan de Acción - Integración suggestion-motor con API Java

**Estado actual:** 12 mayo 2026 | Contratos definidos ✅ | Mapeos bidireccionales ✅

---

## 📋 Resumen Ejecutivo

La integración Core (DTOs, mapeos, endpoint) está **COMPLETA**. Quedan **5 fases** de endurecimiento, validación, y endpoints complementarios para llevar a producción.

| Fase | Duración | Bloqueante | Estado |
|------|----------|-----------|--------|
| 1. Validación básica | 1h | ❌ No | 🟡 Iniciada |
| 2. Infraestructura | 2h | ❌ No | ⏳ Pendiente |
| 3. Endpoints config | 1.5h | ❌ No | ⏳ Pendiente |
| 4. Feedback + Analytics | 1h | ❌ No | ⏳ Pendiente |
| 5. Observabilidad | 1h | ❌ No | ⏳ Pendiente |

**Tiempo total estimado:** 6.5 horas

---

## Fase 1️⃣: Validación Básica (1h)

**Objetivo:** Confirmar que la integración funciona end-to-end con contratos reales.

### 1.1 Instalar dependencias de test
```bash
cd suggestion-motor
pip install pytest pytest-asyncio httpx
```

**Qué hace:**
- Habilita ejecutar test suite
- Valida syntax de Python
- Verifica imports

**Salida esperada:** Tests ejecutables

**Tiempo:** 5 min

---

### 1.2 Ejecutar tests de integración
```bash
pytest tests/test_generate_outfits.py -v
```

**Qué valida:**
- ✅ SuggestionContextRequest → SuggestionRequest mapping
- ✅ Garment mapping con warm_index=5 default
- ✅ History mapping (nullable)
- ✅ Preference formatting
- ✅ LLM prompting con contexto enriquecido
- ✅ Response mapping (SuggestionGatewayResponse)

**Salida esperada:** 
- Todos los tests PASS
- Sin warnings de deprecation
- Cobertura > 80%

**Tiempo:** 15 min

---

### 1.3 Test manual con curl (opcional)
```bash
# Terminal 1: Start suggestion-motor
cd suggestion-motor
PORT=8083 python main.py

# Terminal 2: Send request
curl -X POST http://localhost:8083/suggest \
  -H "Content-Type: application/json" \
  -d @dtos/from_api/SuggestionContextRequest.json
```

**Qué valida:**
- Endpoint accesible y responde 200
- Payload real se deserializa correctamente
- Response tiene formato correcto (garmentIds, camelCase)

**Salida esperada:** Response con 2-3 outfits

**Tiempo:** 10 min

---

### ✅ Fase 1 COMPLETADA cuando:
- [ ] Tests ejecutables (pytest instalado)
- [ ] 100% tests PASS
- [ ] Respuesta manual correcta con payload real

---

## Fase 2️⃣: Infraestructura (2h)

**Objetivo:** Preparar despliegue en contenedores y ambientes.

### 2.1 Dockerfile optimizado
**Archivo:** `Dockerfile` (ya existe, pero revisar)

**Qué incluir:**
- Base image: `python:3.11-slim`
- Multi-stage build (opcional, para reducir tamaño)
- Pip cache layer caching
- Health check endpoint
- Non-root user (security)
- Reproducible builds (pinned versions)

**Checklist:**
```dockerfile
# Stage 1: Builder
FROM python:3.11-slim AS builder
WORKDIR /tmp
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Stage 2: Runtime
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /root/.local /home/appuser/.local
COPY . .
USER appuser
ENV PATH=/home/appuser/.local/bin:$PATH
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:8083/health')"
CMD ["python", "main.py"]
```

**Tiempo:** 20 min

---

### 2.2 docker-compose.yml (integración local)
**Archivo:** Actualizar `docker-compose.yml` en raíz

**Servicios:**
- `suggestion-motor`: Port 8083, env vars configurables
- Vinculación con `api` (Java) si es necesario

**Qué agregar:**
```yaml
services:
  suggestion-motor:
    build: ./suggestion-motor
    ports:
      - "8083:8083"
    environment:
      PORT: 8083
      EASYPICK_API_BASE_URL: http://api:8080
      LLM_BACKEND: cpu  # O 'gpu' si hay NVIDIA
      LLM_MODEL_ID: google/gemma-2-2b-it
    depends_on:
      - api
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8083/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

**Tiempo:** 15 min

---

### 2.3 Healthcheck + Readiness endpoints
**Archivos:** `presentation/controllers/health_router.py` (nuevo)

**Qué incluir:**
```python
@router.get("/health", tags=["Health"])
async def health():
    """Health check: service is alive"""
    return {"status": "ok"}

@router.get("/readiness", tags=["Health"])
async def readiness():
    """Readiness check: service is ready to accept requests"""
    # Verificar: LLM model loaded, config fetched, connections ok
    return {
        "ready": True,
        "llm_loaded": llm is not None,
        "config_loaded": settings is not None
    }
```

**Dónde incluir:** 
- `main.py`: `include_router(health_router, prefix="/health")`
- Update docker HEALTHCHECK a `/health`

**Tiempo:** 10 min

---

### 2.4 Variables de entorno para staging/prod
**Archivo:** `.env.example` (crear)

```bash
# API Configuration
EASYPICK_API_BASE_URL=http://localhost:8080
SUGGESTION_PROCESS_ENDPOINT=/suggest

# LLM Configuration
LLM_BACKEND=auto          # auto|gpu|cpu
LLM_MODEL_ID=google/gemma-2-2b-it
LLM_MODEL_PATH=~/.cache/huggingface/hub

# Server
PORT=8083
LOG_LEVEL=INFO

# Security (comentados por defecto)
# SUGGESTION_API_KEY=<tu-key-aqui>
```

**Tiempo:** 5 min

---

### ✅ Fase 2 COMPLETADA cuando:
- [ ] Dockerfile build sin errores
- [ ] docker-compose up levanta suggestion-motor + deps
- [ ] /health retorna 200
- [ ] /readiness retorna {"ready": true}
- [ ] .env.example documentado y funciona

---

## Fase 3️⃣: Endpoints de Configuración (1.5h)

**Objetivo:** Integrar sistema de config dinámico desde API Java.

### 3.1 Consumir `/api/config/rejection-reasons`
**Propósito:** Obtener razones predefinidas para rechazos (p.ej., "Demasiado formal", "Mal clima")

**Archivo:** `infrastructure/gateways/config_gateway.py` (actualizar)

**Qué hacer:**
```python
class ConfigGateway:
    async def fetch_rejection_reasons(self) -> Dict[str, str]:
        """Fetch predefined rejection reason templates from API Java"""
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{settings.EASYPICK_API_BASE_URL}/api/config/rejection-reasons"
            )
            resp.raise_for_status()
            return resp.json()  # {uuid: reason_text}
```

**Dónde usar:**
- Lifespan event: cargar en startup
- Endpoint `POST /suggest/feedback`: validar reason_uuid contra este catálogo

**Tiempo:** 20 min

---

### 3.2 Consumir `/api/config/system-settings`
**Propósito:** Obtener settings globales (temp thresholds, token limits, etc.)

**Archivo:** `infrastructure/gateways/config_gateway.py` (extender)

**Qué hacer:**
```python
async def fetch_system_settings(self) -> Dict:
    """Fetch system settings (temperature thresholds, token limits, etc.)"""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{settings.EASYPICK_API_BASE_URL}/api/config/system-settings"
        )
        resp.raise_for_status()
        settings_dict = resp.json()  
        # Cache y usar en generate_outfits_usecase
        return settings_dict
```

**Settings a extraer:**
- `TEMPERATURE_COLD_THRESHOLD`: override de 10°C
- `TEMPERATURE_HOT_THRESHOLD`: override de 30°C
- `LLM_TOKEN_BUDGET`: límite de tokens para contexto
- `MAX_OUTFITS_BATCH`: máximo outfits por request

**Dónde usar:**
- Lifespan: cargar en startup
- `generate_outfits_usecase.py`: usar settings en lugar de hardcoded constants

**Tiempo:** 25 min

---

### 3.3 Manejo de errores en fetch de config
**Archivo:** `infrastructure/gateways/config_gateway.py`

**Qué hacer:**
```python
async def fetch_rejection_reasons(self) -> Dict[str, str]:
    try:
        # ... fetch ...
    except httpx.HTTPError as e:
        logger.warning(f"Failed to fetch rejection reasons: {e}")
        # Return default fallback
        return {"default": "User preference"}
    except Exception as e:
        logger.error(f"Unexpected error fetching config: {e}")
        raise  # Fatal, no fallback

```

**Fallbacks:**
- rejection_reasons: `{"default": "User preference"}`
- system_settings: default constants en `core/config.py`

**Tiempo:** 10 min

---

### ✅ Fase 3 COMPLETADA cuando:
- [ ] ConfigGateway obtiene rejection-reasons en startup
- [ ] ConfigGateway obtiene system-settings en startup
- [ ] Settings dinámicos se aplican en generate_outfits_usecase
- [ ] Fallbacks funcionan si API Java está down
- [ ] Logs muestran configuración cargada

---

## Fase 4️⃣: Endpoint Feedback + Analytics (1h)

**Objetivo:** Capturar feedback post-sugerencia y mejorar sugerencias futuras.

### 4.1 Endpoint `POST /suggest/feedback`
**Contrato:**

Request:
```json
{
  "suggestionId": "uuid-del-request-anterior",
  "outfitIndex": 0,
  "feedback": "ACCEPTED" | "REJECTED",
  "rejectionReason": "uuid-de-razon-o-null",
  "customReason": "string-optional"
}
```

Response:
```json
{
  "status": "feedback_recorded",
  "suggestionsUpdated": 1
}
```

**Archivo:** `presentation/controllers/suggestion_router.py`

```python
@router.post("/feedback")
async def submit_feedback(feedback: SuggestionFeedbackDto):
    """Record user feedback on suggested outfits"""
    # 1. Validar feedback.rejectionReason contra catálogo
    # 2. Guardar en DB via API Java (POST /api/suggestions/{id}/feedback)
    # 3. Si REJECTED, actualizar rejection history para próximo suggest
    # 4. Return status ok
    return {"status": "feedback_recorded"}
```

**Qué hace:**
- Captura aceptación/rechazo de outfits
- Mejora historial de rechazos
- Retroalimentación para LLM en próximo request

**Tiempo:** 25 min

---

### 4.2 Schema de feedback
**Archivo:** `presentation/schemas/feedback.py` (nuevo)

```python
class SuggestionFeedbackDto(BaseModel):
    suggestion_id: str = Field(alias="suggestionId")
    outfit_index: int = Field(alias="outfitIndex")
    feedback: str  # "ACCEPTED" | "REJECTED"
    rejection_reason: Optional[str] = Field(default=None, alias="rejectionReason")
    custom_reason: Optional[str] = Field(default=None, alias="customReason")
```

**Tiempo:** 5 min

---

### 4.3 Analytics básicos
**Archivo:** `infrastructure/gateways/analytics_gateway.py` (nuevo)

```python
async def track_suggestion_generated(request_id, outfit_count, generation_time_ms):
    """Track suggestion generation event"""
    event = {
        "event": "suggestion_generated",
        "request_id": request_id,
        "outfit_count": outfit_count,
        "generation_time_ms": generation_time_ms,
        "timestamp": datetime.utcnow().isoformat()
    }
    # Log a archivo / enviar a observability service
    logger.info(f"Analytics: {event}")

async def track_feedback_submitted(request_id, feedback, reason):
    """Track feedback event"""
    event = {
        "event": "feedback_submitted",
        "request_id": request_id,
        "feedback": feedback,
        "reason": reason,
        "timestamp": datetime.utcnow().isoformat()
    }
    logger.info(f"Analytics: {event}")
```

**Qué rastrear:**
- Sugerencias generadas (count, tiempo)
- Feedback recibido (aceptados vs rechazados, razones top)
- Errores por tipo

**Tiempo:** 15 min

---

### ✅ Fase 4 COMPLETADA cuando:
- [ ] POST /suggest/feedback recibe request y retorna 200
- [ ] Validación de rejectionReason funciona
- [ ] Analytics logged para suggestion_generated
- [ ] Analytics logged para feedback_submitted
- [ ] Historial actualizado para próximo request

---

## Fase 5️⃣: Observabilidad (1h)

**Objetivo:** Monitoreo, logging estructurado, y debugging en producción.

### 5.1 Logging estructurado
**Archivo:** `core/logging_config.py` (crear)

```python
import logging
import json
from pythonjsonlogger import jsonlogger

def setup_logging():
    """Configure structured JSON logging"""
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    
    # Console handler con JSON format
    console_handler = logging.StreamHandler()
    formatter = jsonlogger.JsonFormatter()
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    return logger
```

**Instalación:**
```bash
pip install python-json-logger
```

**Uso en código:**
```python
logger.info("Outfit generated", extra={
    "request_id": request_id,
    "outfit_count": len(outfits),
    "temperature": temperature,
    "generation_ms": elapsed_ms
})
```

**Beneficio:** Logs legibles en producción + parseable por observability tools

**Tiempo:** 15 min

---

### 5.2 Request tracing (request ID)
**Archivo:** `core/middleware.py` (crear)

```python
import uuid
from fastapi import Request

async def add_request_id(request: Request, call_next):
    """Add X-Request-ID header for tracing"""
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response
```

**En main.py:**
```python
app.middleware("http")(add_request_id)
```

**Beneficio:** Rastrear requests end-to-end en logs distribuidos

**Tiempo:** 10 min

---

### 5.3 Prometheus metrics (opcional)
**Archivo:** `infrastructure/metrics/prometheus_metrics.py` (crear)

```python
from prometheus_client import Counter, Histogram, generate_latest

suggestions_counter = Counter(
    'suggestions_generated_total',
    'Total suggestions generated',
    ['status']  # status: success, error, llm_fallback
)

generation_time = Histogram(
    'suggestion_generation_seconds',
    'Time to generate suggestions'
)

# En main.py:
@app.get("/metrics")
async def metrics():
    return generate_latest()
```

**Instalación:**
```bash
pip install prometheus-client
```

**Beneficio:** Métricas exportables a Prometheus/Grafana

**Tiempo:** 20 min (opcional)

---

### ✅ Fase 5 COMPLETADA cuando:
- [ ] Logs estructurados en JSON
- [ ] Request ID en todos los logs
- [ ] /metrics endpoint funciona (Prometheus)
- [ ] Observability stack pronto para producción

---

## 🎯 Checklist de Finalización

### Antes de desplegar a producción:

- [ ] **Fase 1:** Tests ✅ 100% PASS
- [ ] **Fase 2:** Docker builds y running
- [ ] **Fase 3:** Config dinámico desde API Java funcionando
- [ ] **Fase 4:** Feedback endpoint validado
- [ ] **Fase 5:** Logging observável en producción

### Validaciones finales:

- [ ] End-to-end: `curl POST /suggest` → outfits generados → feedback registrado
- [ ] Fallbacks: API Java down → suggestion-motor sigue funcionando
- [ ] Performance: Generación < 5s por request
- [ ] Error handling: Todos los caminos de error manejan gracefully
- [ ] Docs: README actualizado con ejemplos curl/payload

---

## 📊 Timeline

```
Semana 1:
  Día 1: Fase 1 (validación básica) - 1h
  Día 2: Fase 2 (infraestructura) - 2h
  Día 3: Fase 3 (endpoints config) - 1.5h

Semana 2:
  Día 4: Fase 4 (feedback) - 1h
  Día 5: Fase 5 (observabilidad) - 1h
  
Producción: ~6.5 horas totales
```

---

## 🚀 Siguiente Paso Inmediato

**Iniciar Fase 1 ahora:**

```bash
cd suggestion-motor
pip install pytest pytest-asyncio httpx
pytest tests/test_generate_outfits.py -v
```

**Si todos los tests pasan:** Fases 2-5 proceden sin bloqueos ✅

**Si tests fallan:** Debug + reportar errores, corregir mapeos.

---

*Última actualización: 12 mayo 2026*
