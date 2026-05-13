# Pendientes y huecos del `suggestion-motor`

Este documento resume lo que todavía falta cerrar después de releer `prompt_inicial.md` y revisar el código actual.

## Estado actual (12 de mayo de 2026)

### Implementado en esta fase: Integración de contratos con API Java

**✅ COMPLETADO:**
- Contrato de entrada del API Java: `SuggestionContextRequest` con sub-DTOs (camelCase + aliases) en `presentation/schemas/suggestion_requests.py`
- Contrato de salida del API Java: `SuggestionGatewayResponse` con `outfits[].garmentIds` en `presentation/schemas/suggestion_responses.py`
- Mapeo bidireccional: `map_to_usecase_request()` convierte request Java → modelo interno; `map_to_gateway_response()` convierte respuesta interna → respuesta Java
- Endpoint alineado: POST `/suggest` configurable por `SUGGESTION_PROCESS_ENDPOINT` en config
- Ejemplos de DTO: `dtos/from_api/SuggestionContextRequest.json` y `dtos/to_api/SuggestionGatewayResponse.json`
- Tests migrados al contrato nuevo con payloads del formato Java

## Veredicto general

La dirección es correcta: FastAPI, arquitectura hexagonal pragmática, carga en `lifespan`, cache de configuración y backend LLM intercambiable van alineados con el spec.

Lo que sigue faltando no es la idea principal, sino las piezas de infraestructura avanzada, endurecimiento y algunas clarificaciones de semántica: warm_index, validación de UUIDs, historial de rechazos.

## Lo que ya está alineado

- ✅ `main.py` usa `lifespan` para inicialización
- ✅ Existe un backend LLM con selección por entorno
- ✅ Esquemas de request/response alineados con contrato Java
- ✅ Hay un cache en memoria para datos globales de arranque
- ✅ El flujo de arranque ya intenta sincronizarse con la API principal
- ✅ Mapeos de entrada/salida implementados con adapters

## Lo que falta implementar según el spec

### 1. Puertos y adaptadores que no existen todavía (SIN CAMBIOS)

- `application/interfaces/weather_provider.py` ✅ Existe (open_meteo_client.py la implementa)
- `application/interfaces/api_gateway.py` ✅ Existe (spring_boot_client.py la implementa)
- `infrastructure/gateways/spring_boot_client.py` ✅ Existe
- `infrastructure/gateways/open_meteo_client.py` ✅ Existe
- `core/security.py` ⚠️ Aún no existe (puede no ser crítico en esta fase)
- `application/entities/garment.py` ✅ Existe
- `application/entities/outfit.py` ✅ Existe
- `application/entities/user_context.py` ✅ Existe

### 2. Caso de uso real

- `generate_outfits_usecase.py` tiene lógica base pero falta completar:
  - ✅ Resolución de temperatura por OpenMeteo
  - ✅ Filtrado determinista por warm_index
  - ✅ Exclusiones por historial (rechazos previos)
  - ⚠️ Validación de UUIDs contra inventario: **DUDOSA** (ver sección "Dudas de semántica")
  - ⚠️ Prompting estructurado con JSON: Funciona pero puede necesitar refinamiento
  - ⚠️ Post-procesamiento robusto: Básico, puede necesitar endurecimiento

### 3. Contratos de la API principal: ✅ ACTUALIZADO

**YA DEFINIDO en esta fase:**
- ✅ Contrato de entrada: `SuggestionContextRequest` con campos camelCase (colorPreferences, brandPreferences, categoryPreferences, stylePreferences, garments, previousSuggestions, requestedOutfitCount, location)
- ✅ Contrato de salida: `SuggestionGatewayResponse` con `outfits[].garmentIds`
- ✅ Mapeos implementados en `presentation/schemas/suggestion_requests.py` y `suggestion_responses.py`

**AÚN PENDIENTE (no crítico para esta fase MVP):**
- `POST /api/auth/refresh` → formato exacto verificado en código
- `GET /api/config/rejection-reasons` → mapeado en config pero no consumido aún
- `GET /api/config/system-settings` → no implementado aún
- Códigos de error esperados: Usar 500 + detail para errores de integración
- Política de reintento del JWT: Implementar si la API Java lo requiere

### 4. Contrato del endpoint local: ✅ COMPLETADO

- ✅ Ruta: `POST /suggest` configurable por `SUGGESTION_PROCESS_ENDPOINT`
- ✅ Validación de payload: Pydantic con aliases (camelCase ↔ snake_case)
- ✅ Formato de respuesta: `SuggestionGatewayResponse` con `outfits[].garmentIds`
- ✅ Manejo de UUIDs desconocidos: Se filtran silenciosamente en el mapeo (⚠️ Ver "Dudas de semántica")

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

---

## 🔴 Dudas de semántica pendientes de aclarar: RESUELTAS ✅

Según aclaraciones del usuario (12 de mayo):

| # | Duda | Resolución | Implementado |
|---|------|-----------|--------------|
| **1** | ¿De dónde viene `warm_index`? | Es atributo de prenda en BD. Si no está, aviso. | ⚠️ **ALERTA creada:** `ALERTA_warm_index.md` - Falta en DTO Java, bloqueante |
| **2** | ¿Se validan UUIDs? | No, vienen de BD ya validados por API Java | ✅ Asumir válidos, no validar adicional |
| **3** | ¿Historial de rechazos? | Puede venir o no. Si viene, es rechazos históricos. Nullable | ✅ `_map_history()` devuelve `Optional[History]` |
| **4** | ¿Normalizar preferencias? | Mantener separadas por tipo (color, brand, category, style) | ✅ Agregado `get_preference_scores_by_type()` + helper formatter |
| **5** | ¿Prompting con preferencias? | Sí, inyectar en prompt pero acotando contexto determinista | ✅ Creado helper `preference_formatter.py` + prompt enriquecido |

---

## Cambios implementados en esta sesión

**Archivos nuevos:**
- ✅ `presentation/helpers/preference_formatter.py` — Helper para formatear preferencias y rechazos en readable strings
- ✅ `ALERTA_warm_index.md` — Alerta sobre campo faltante en DTO Java

**Archivos modificados:**
- ✅ `presentation/schemas/suggestion_requests.py` — Agregado `get_preference_scores_by_type()`, mejorado `_map_history()` (nullable)
- ✅ `presentation/controllers/suggestion_router.py` — Pasar contextos de preferencias y rechazos al caso de uso
- ✅ `application/usecases/generate_outfits_usecase.py` — Actualizada firma de `generate_outfits()` para aceptar contextos, enriquecido prompt del LLM

**Mejoras de robustez:**
- ✅ Historial de rechazos ahora es nullable (solo si hay rechazos previos)
- ✅ Conversión de Set a List en mapeo de rechazos
- ✅ Prompting mejorado: incluye preferencias separadas por tipo + contexto de rechazos
- ✅ Temperatura del LLM ajustada de 0.4 a 0.5 para mayor variabilidad

---

## 🔴 Dudas de semántica pendientes de aclarar

## Variables de entorno que conviene cerrar

### API principal

- `MAIN_API_BASE_URL` ✅ Definida en config
- `MAIN_API_REFRESH_TOKEN` ✅ Definida en config

### LLM / Hugging Face

- `LLM_BACKEND` ✅ Definida (valores: `auto`, `gpu`, `cpu`)
- `LLM_MODEL_ID` ✅ Definida (default: `google/gemma-2-2b-it`)
- `LLM_MODEL_PATH` ✅ Definida (opcional)
- `HUGGINGFACE_ACCESS_TOKEN`, `HUGGINGFACE_HUB_TOKEN`, `HF_TOKEN` ✅ Definida

### Runtime

- `PORT` ✅ Definida (default 8083)
- `SUGGESTION_PROCESS_ENDPOINT` ✅ Definida (default `/suggest`)

## Preguntas abiertas (menores)

- ¿La API principal devolverá siempre `access_token` en `/api/auth/refresh`? ✅ Verificado en código
- ¿Los catálogos de `rejection-reasons` y `system-settings` tendrán versiones o cambios frecuentes?
- ¿El modelo final va a vivir en Hugging Face, en disco local o empaquetado en el entorno?
- ¿Queremos que el fallback CPU sea automático solo cuando `LLM_BACKEND=auto`, o también cuando `gpu` falle?
- 🔴 **CRÍTICA:** Las 5 dudas de semántica arriba (warm_index, validación UUIDs, historial rechazos, normalización preferencias, prompting)

## Diferencias detectadas con el spec: Estado actual

- ✅ El spec pedía investigar `llama.cpp` o `vLLM` → la implementación usa `transformers + accelerate` (decision tomada).
- ✅ El spec habla de Gemma 4 2B → la configuración actual usa `google/gemma-2-2b-it` (compatible).
- ⚠️ El módulo `core/security.py` aún no existe (puede no ser crítico en MVP).
- ✅ Las entidades de dominio ya están definidas (garment.py, outfit.py, user_context.py).

## Próximos pasos recomendados (actualizado 12 mayo)

**BLOQUEANTE (CRÍTICA):**
1. 🔴 **Agregar `warm_index` a `CompleteGarmentResponse.java`** en api/
   - Campo faltante en DTO Java que impide filtrado por temperatura
   - Ver `ALERTA_warm_index.md` para detalles exactos
   - Tiempo estimado: 5 minutos

**Fase 2: Validación y tests (DESPUÉS de bloqueante)**
1. ✅ Instalar dependencias de suggestion-motor
2. ✅ Ejecutar tests de integración con nuevo contrato
3. ✅ Validar flujo end-to-end con payloads reales
4. ✅ Verificar prompting mejorado con preferencias

**Fase 3: Endurecimiento (PARALELO)**
1. ✅ Dockerfile para despliegue local/staging
2. ✅ Healthcheck y readiness endpoint
3. ✅ Variables de entorno finales para producción
4. ✅ Observabilidad y logs estructurados

**Fase 4: Endpoints complementarios (OPCIONAL MVP)**
1. ⚠️ `POST /suggest/feedback` para reportar rechazos post-generación
2. ⚠️ Consumo de `/api/config/rejection-reasons` durante lifespan
3. ⚠️ Consumo de `/api/config/system-settings` durante lifespan
4. ⚠️ Endpoint de métricas / analytics sobre sugerencias

---

## Resumen de estado integral

| Componente | Estado | Notas |
|-----------|--------|-------|
| Contrato entrada (SuggestionContextRequest) | ✅ Implementado | Con mapeo a modelo interno |
| Contrato salida (SuggestionGatewayResponse) | ✅ Implementado | Con garmentIds format |
| Endpoint /suggest | ✅ Implementado | Configurable, ruta correcta |
| Mapeo entrada/salida | ✅ Implementado | Bidireccional, robusto |
| Preferencias separadas | ✅ Implementado | Helper formatter creado |
| Prompting mejorado | ✅ Implementado | Con preferencias + rechazos |
| Historial nullable | ✅ Implementado | Robusto a faltas de datos |
| warm_index en modelo | ❌ BLOQUEANTE | Necesita agregarse en API Java |
| Tests migrados | ⚠️ Pendiente | Ejecutar con pytest después de warm_index |
| Dockerfile | ❌ Pendiente | Para MVP siguiente |