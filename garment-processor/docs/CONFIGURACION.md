# Guia de Configuracion (Practica)

Este documento resume los parametros activos en la arquitectura DINO-only.

## Parametros clave de deteccion

- segmentation_backend
	- Valor esperado: grounding_dino

- segmentation_dino_model_id
	- Modelo Grounding DINO de Hugging Face.

- segmentation_dino_text_prompt
	- Prompt de deteccion textual.
	- Conviene mantener labels concretas y evitar ruido generico.

- segmentation_dino_box_threshold y segmentation_dino_text_threshold
	- Controlan precision base del detector.

- segmentation_dino_nms_iou_threshold
	- Deduplicacion por superposicion.

- segmentation_dino_single_box_containment_threshold
	- Descarta caja si esta mayormente dentro de otra caja individual.

- segmentation_dino_max_generic_clothes_area_ratio
	- Evita cajas gigantes de escena completa.

- segmentation_dino_bbox_padding_ratio
	- Agrega contexto al crop antes del pipeline de clasificacion.

## Parametros de clasificacion posterior

- garment_filter_enabled
- garment_filter_min_score
- garment_filter_margin
- clip_min_confidence

## Orden recomendado para ajustar

1. Deteccion DINO (boxes).
2. Filtro de prenda.
3. Remocion de fondo.
4. CLIP final.

Evita ajustar varias etapas a la vez.

## Regla de oro para experimentos

1. Un cambio por corrida.
2. Misma bateria de imagenes.
3. Guardar salida JSON comparativa.
4. Si no mejora en conjunto, rollback.

## Operacion offline

Cuando los modelos ya estan cacheados localmente:
- `HF_HUB_OFFLINE=1`
- `TRANSFORMERS_OFFLINE=1`

Esto evita variaciones por red y hace las pruebas mas repetibles.
