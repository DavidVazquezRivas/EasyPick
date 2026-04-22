# Arquitectura del Servicio

Este servicio sigue una arquitectura hexagonal pragmatica.

## Objetivo

Separar reglas de negocio del framework HTTP y de librerias concretas
(transformers, rembg, etc.) para poder evolucionar componentes sin romper
el contrato externo.

## Flujo de ejecucion

1. `app/application.py` crea la app FastAPI, middleware y routers.
2. `app/lifespan.py` inicializa runtime y delega wiring en `app/infra/bootstrap.py`.
3. El endpoint HTTP (`app/adapters/http`) valida entrada y llama al use case.
4. `app/use_cases/process_garments_use_case.py` orquesta el flujo de negocio.
5. El use case usa puertos de dominio (`app/domain/ports`) y adapters de servicios.
6. Se construye la respuesta HTTP con modelos de salida existentes.

## Carpetas principales

- `app/adapters/http`
  - Frontera web: routers FastAPI y mapeo de errores a HTTP.

- `app/adapters/services`
  - Adaptadores que conectan interfaces de dominio con implementaciones reales.

- `app/domain`
  - Nucleo: modelos de negocio, puertos y excepciones de dominio.

- `app/use_cases`
  - Casos de uso y reglas de orquestacion del flujo principal.

- `app/infra`
  - Composition root: construccion de dependencias runtime.

- `app/services`
  - Implementaciones concretas (Grounding DINO, CLIP, rembg, filtros).

- `app/api`
  - Validacion de entrada HTTP antes de entrar al caso de uso.

- `app/models`
  - Modelos de contrato API de salida/entrada (schemas de respuesta).

- `app/processing`
  - Utilidades de construccion de respuesta actualmente usadas en runtime.

- `app/utils`
  - Utilidades transversales (request-id, I/O de imagen, etc.).

## Nota sobre `app/controllers`

`app/controllers` fue eliminado porque ya no era una capa real de ejecucion.
Los routers ahora viven en `app/adapters/http`, que representa claramente
la frontera de entrada de la arquitectura hexagonal.

## Regla de mantenimiento

Si aparece una integracion nueva, debe entrar por puerto/adapter y no acoplarse
al use case con llamadas directas a librerias concretas.
