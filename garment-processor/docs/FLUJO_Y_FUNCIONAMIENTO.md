# Flujo de Trabajo (Version Operativa)

## Para que sirve este servicio

Tomar una imagen de prendas, separarlas lo mejor posible y devolver un resultado util para negocio:
- imagen limpia por prenda
- etiquetas para catalogacion

No busca perfeccion academica. Busca consistencia y velocidad de iteracion.

## Como pensar el pipeline

1. Encontrar candidatos
- Ruta unica: Grounding DINO.
- Se aplican filtros de deduplicacion y contencion sobre las cajas detectadas.

2. Evitar basura
- Filtro de prenda/no-prenda antes de gastar tiempo en el resto.

3. Limpiar y etiquetar
- Se remueve fondo.
- Se etiquetan atributos con CLIP.

4. Responder estable
- El contrato de salida se mantiene estable aunque cambien modelos internos.

## Salud operativa y trazabilidad

- GET /health/live
	- Liveness simple del proceso HTTP.

- GET /health/ready
	- Readiness real: exige que los componentes de pipeline esten inicializados.
	- Devuelve 503 si la app todavia no esta lista.

- x-request-id
	- Si el cliente envia x-request-id, el servicio lo propaga en respuesta.
	- Si no se envia, el servicio genera uno.
	- Se usa para correlacionar logs de adapter HTTP y use case.

## Checklist mental cuando algo sale mal

1. Si faltan prendas:
- Primero revisar candidatos iniciales, no labels.
- Si no hay candidatos, el problema esta antes de CLIP.
- Sin fallback runtime: si falla DINO, la respuesta puede ser 422.

2. Si hay prendas pero mal clasificadas:
- El problema suele ser de crop/calidad visual, no solo de prompts.

3. Si el tiempo explota:
- Revisar carga de modelo DINO y cantidad de candidatos procesados.
- Revisar cantidad de candidatos que pasan al pipeline completo.

4. Si da 422 seguido:
- Validar primero el embudo: candidatos -> filtro -> rembg -> clasificacion.
- No tocar umbrales al azar: cambiar una variable por vez.

## Proceso recomendado para ajustes

1. Definir objetivo de la semana (calidad o velocidad).
2. Congelar una referencia de imagenes.
3. Hacer un solo cambio de criterio.
4. Medir antes/despues.
5. Si mejora un caso y rompe otros, rollback.

## Senales de que vas bien

- Menos cambios impulsivos de parametros.
- Menos sorpresas entre entornos.
- Mismo resultado para misma entrada en corridas repetidas.

## Nota de migracion

La ruta activa del endpoint sigue una arquitectura hexagonal pragmatica con
adapters HTTP, use case central y adaptadores de servicios concretos.
