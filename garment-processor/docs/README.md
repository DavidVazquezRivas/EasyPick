# Garment Processor Docs

This folder tracks architecture decisions, implementation changes, and test evidence for the garment separation roadmap.

## Documents
- `FLUJO_Y_FUNCIONAMIENTO.md`: Flujo end-to-end del servicio y comportamiento general.
- `CONFIGURACION.md`: Guia practica de todos los parametros de `app/config.py`.
- `PHASE_A_ENDPOINT_CONTRACT.md`: Contrato del endpoint.
- `PHASE_B_SEGMENTATION.md`: Arquitectura de segmentacion y fallback.
- `CHANGELOG.md`: Cambios tecnicos por iteracion.
- `DECISIONS.md`: Decisiones y rationale.

## Workflow
1. Cada iteracion de codigo debe actualizar `CHANGELOG.md`.
2. Cualquier cambio arquitectonico debe actualizar `DECISIONS.md`.
3. Si cambia el contrato o la salida, actualizar tambien `PHASE_A_ENDPOINT_CONTRACT.md` y `FLUJO_Y_FUNCIONAMIENTO.md`.
4. Si cambian parametros, actualizar `CONFIGURACION.md`.
