# Garment Processor - Manuales utiles

Esta carpeta describe el estado operativo actual del servicio.
La arquitectura runtime es Grounding DINO + garment filter + rembg + CLIP.

## Que leer segun tu necesidad

1. FLUJO_Y_FUNCIONAMIENTO.md
- Flujo del endpoint /process-garments de punta a punta.
- Checklist rapido para diagnosticar 422, latencia o baja calidad de recorte.

2. CONFIGURACION.md
- Parametros activos para backend Grounding DINO.
- Recomendaciones de tuning por etapas.

3. DECISIONS.md
- Criterios de decision para cambios de umbrales y despliegues.

4. ARQUITECTURA.md
- Mapa de capas y responsabilidades por carpeta.
- Flujo runtime de FastAPI -> adapters -> use case -> servicios.

5. QUICKSTART.md
- Arranque rapido con comandos minimos para testear y levantar la API.
- Incluye flujo para levantar el modulo con Docker Compose.

## Scripts operativos

- scripts/run_endpoint_examples.py
	- Ejecuta example.jpg y example2.jpg contra /process-garments y guarda JSON en debug_output.

- scripts/profile_services.py
	- Perfilado por etapa para pipeline DINO-only (deteccion, filtro, remocion de fondo y CLIP).

## Estado de arquitectura

- Migracion principal completada a arquitectura hexagonal pragmatica.
- Capas activas:
	- app/domain (modelos y puertos)
	- app/use_cases (casos de uso)
	- app/adapters/services (adaptadores de implementaciones actuales)
	- app/adapters/http (ruteo HTTP y mapeo de errores)
	- app/infra (bootstrap de runtime)
- El endpoint y health no usan orchestrator.
- `app/processing` se mantiene solo para `response_builder`.

## Regla de mantenimiento

Si un documento no ayuda a operar o decidir, se simplifica o se elimina.
