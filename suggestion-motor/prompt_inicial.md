# Especificación Técnica: Motor de Sugerencias (AI Service)

## 1. Visión General y Alcance
Este documento define la arquitectura, el flujo de datos y los detalles de implementación del microservicio `suggestion-motor`. 
* **Objetivo:** Ingerir contexto de usuario complejo (armario, clima local, preferencias y rechazos históricos) para generar combinaciones óptimas de prendas utilizando filtrado determinista seguido de procesamiento con un LLM local (Gemma 4 2B).
* **Integración Principal:** Actúa como un servicio esclavo de la API REST principal desarrollada en Spring Boot (Java).

## 2. Arquitectura: Hexagonal Pragmática
Se adopta una estructura de puertos y adaptadores optimizada para Python (FastAPI), evitando la verbosidad extrema pero manteniendo el dominio estrictamente aislado de la infraestructura.

### 2.1. Estructura de Directorios
```text
suggestion_motor/
├── application/                  # CAPA DE DOMINIO Y CASOS DE USO (Sin dependencias externas)
│   ├── entities/                 # Modelos de dominio puros (Pydantic / Dataclasses)
│   │   ├── garment.py
│   │   ├── outfit.py
│   │   └── user_context.py
│   ├── interfaces/               # Puertos (ABCs - Abstract Base Classes)
│   │   ├── llm_provider.py       # Interfaz para el modelo de IA
│   │   ├── weather_provider.py   # Interfaz para obtener clima
│   │   └── api_gateway.py        # Interfaz para llamadas a Spring Boot
│   └── usecases/                 # Lógica de negocio orquestada
│       └── generate_outfits_usecase.py
├── infrastructure/               # CAPA DE INFRAESTRUCTURA (Adaptadores concretos)
│   ├── gateways/
│   │   ├── spring_boot_client.py # Implementa api_gateway.py (Peticiones HTTP)
│   │   └── open_meteo_client.py  # Implementa weather_provider.py
│   ├── llm/
│   │   └── gemma_local_engine.py # Implementa llm_provider.py (Carga del modelo Gemma 4 2B)
│   └── state/
│       └── memory_cache.py       # Almacén en memoria para configuraciones de arranque
├── presentation/                 # CAPA DE PRESENTACIÓN (Controladores FastAPI)
│   ├── controllers/
│   │   └── suggestion_router.py  # Endpoints de la API
│   └── schemas/                  # DTOs (Pydantic) de Request/Response HTTP
│       ├── suggestion_requests.py
│       └── suggestion_responses.py
├── core/                         # Configuraciones transversales
│   ├── config.py                 # Variables de entorno y settings
│   ├── dependencies.py           # Inyección de dependencias (FastAPI Depends)
│   └── security.py               # Gestión del Token de Refresco
└── main.py                       # Entrypoint y Lifespan Events
```

## 3. Ciclo de Vida y Conexión con API Principal (Arranque)

El servicio utiliza el manejador `lifespan` de FastAPI para ejecutar tareas críticas antes de comenzar a aceptar tráfico.

### 3.1. Proceso de Inicialización
1.  **Lectura de Entorno:** El servicio carga las variables `MAIN_API_REFRESH_TOKEN` y `MAIN_API_BASE_URL`.
2.  **Autenticación (S2S):** Realiza un `POST` a `MAIN_API_BASE_URL/api/auth/refresh` enviando el token de refresco para obtener un JWT de acceso válido y de corta duración.
3.  **Fetching de Estado Global:**
    * Consulta `/api/config/rejection-reasons` para obtener el listado maestro de razones de rechazo (mapeo `UUID -> Texto/Peso`).
    * Consulta `/api/config/system-settings` para configuraciones generales.
4.  **Carga en Memoria:** La información se almacena en un singleton dentro de `infrastructure/state/memory_cache.py`.
5.  **Carga del Modelo LLM:** Se inicializa `gemma_local_engine.py`, cargando los pesos de **Gemma 4 2B** en VRAM o RAM.
    > **💡 Aviso para el Agente:** Investigar el uso de `llama.cpp` en Python o `vLLM` para optimizar la inferencia local.

### 3.2. Gestión de Errores de Sincronización
Dado que el ecosistema se despliega en bloque, no hay polling. Si llega un `UUID` de rechazo desconocido en una petición, el sistema:
* Atrapará la excepción.
* Emitirá un log nivel `WARNING`: *"UUID de rechazo desconocido encontrado: [UUID]. Ignorando filtro temporalmente."*
* Continuará el proceso sin interrumpir el servicio.

---

## 4. Contrato de Comunicación (API Payload)

Petición esperada en el endpoint: `POST /api/v1/suggestions/generate`.

### 4.1. Estructura de Entrada Esperada (JSON)

```json
{
  "user_location": {
    "latitude": 39.5696,
    "longitude": 2.6502
  },
  "expected_outfits": 3,
  "preferences": {
    "config_uuid": "abc-123",
    "score": 0.85,
    "colors": ["neutros", "oscuros"],
    "categories": ["casual", "streetwear"],
    "brands_preferred": ["Nike", "Zara"],
    "styles": ["minimalista"]
  },
  "garments": [
    {
      "uuid": "garment-001",
      "type": "t_shirt",
      "color": "black",
      "warm_index": 2, 
      "style": "casual"
    }
  ],
  "history": {
    "rejections": [
      {
        "outfit_uuid": "outfit-999",
        "garments": ["garment-001", "garment-005"],
        "reason_uuid": "reason-color-clash",
        "custom_reason": null
      }
    ]
  }
}

```
### 4.2. Estructura de Entrada Esperada (JSON)
```json
"outfits": [
    {
        "garments_list": [
            {
                "uuid": "123e4567-e89b-12d3-a456-426614174000" 
            },
            {
                "uuid": "123e4567-e89b-12d3-a456-426614174001" 
            },
            {
                "uuid": "123e4567-e89b-12d3-a456-426614174002" 
            }
        ]
    },
    {
        "garments_list": [
            {
                "uuid": "123e4567-e89b-12d3-a456-426614174000" 
            },
            {
                "uuid": "123e4567-e89b-12d3-a456-426614174001" 
            },
            {
                "uuid": "123e4567-e89b-12d3-a456-426614174002" 
            }
        ]
    },
    {
        "garments_list": [
            {
                "uuid": "123e4567-e89b-12d3-a456-426614174000" 
            },
            {
                "uuid": "123e4567-e89b-12d3-a456-426614174001" 
            },
            {
                "uuid": "123e4567-e89b-12d3-a456-426614174002" 
            }
        ]
    }
]
```
## 5. Pipeline del Caso de Uso: `generate_outfits_usecase.py`

El proceso de generación de outfits se divide en dos fases principales para optimizar el rendimiento: una **fase determinista** (rápida) y una **fase probabilística** (costosa).

### Fase 1: Depuración Determinista (Pre-procesamiento)
Esta fase reduce el espacio de búsqueda antes de consultar al modelo de lenguaje.

* **Resolución de Clima:** Uso de `weather_provider.py` con la API de **OpenMeteo** para obtener temperatura y condiciones actuales según la ubicación del usuario.
* **Filtrado por Warm Index:** Si la temperatura es alta (ej. 30ºC), se descartan automáticamente prendas con un `warm_index` elevado (ej. > 7).
* **Aplicación de Historial (Rechazos):** Si el usuario rechazó previamente la combinación `[garment-001 + garment-005]`, se marca como "prohibida".

> [!TIP]
> **Aviso para el Agente:** Implementar lógica de grafos simples o listas de exclusión bidireccionales en memoria para filtrar combinaciones rápidamente.

---

### Fase 2: Prompting Estructurado (Gemma 4 2B)
El array de prendas pre-filtradas se transforma en un prompt estructurado para la IA:

1.  **System Prompt:** Instruye al modelo para actuar como estilista experto y devolver un formato **JSON estricto**.
2.  **Contexto Inyectado:** `"Clima: Soleado, 30ºC. Preferencias: Minimalista. Inventario: [Lista reducida]. Evita: [Exclusiones]."`
3.  **Inferencia:** Llamada a `gemma_local_engine.py` con una temperatura de **0.4** para equilibrar creatividad y coherencia estilística.

---

### Fase 3: Post-procesamiento y Respuesta
* **Validación:** Uso de esquemas de **Pydantic** para asegurar que la salida cumple con el formato esperado.
* **Control de Alucinaciones:** Si el modelo sugiere un UUID de prenda inexistente en el inventario real, se descarta ese outfit y se itera nuevamente o se devuelve solo lo validado.

---

## 6. Consideraciones Técnicas y de Rendimiento

## Instalaciones:
 - Python 3.11
 - PyTorch 2.11.0 con soporte para CUDA 12.8

### Ejecución Asíncrona
Todo el flujo en **FastAPI** debe ser `async`, especialmente las llamadas a la API meteorológica y las inferencias al modelo LLM para no bloquear el bucle de eventos.

### Manejo del Context Window
Gemma 4 2B tiene límites de tokens. Si el inventario del usuario es muy extenso, se requieren las siguientes estrategias:
* **Investigación requerida:** Implementar un **RAG ligero** (Retrieval-Augmented Generation) o **clustering previo** para enviar solo las 50 (o menos) prendas más relevantes al contexto.
