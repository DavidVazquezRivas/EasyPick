# Guia de Configuracion

La configuracion principal esta en app/config.py, clase Settings.

## Validacion de entrada
- max_upload_size_bytes: tamano maximo de archivo
- min_image_width, min_image_height: limites minimos
- max_image_width, max_image_height: limites maximos

## Deteccion YOLO
- yolo_model_name: archivo/modelo YOLO (actual: yolov8n.pt)
- yolo_confidence_threshold: umbral minimo de deteccion
- yolo_allowed_class_names: clases YOLO candidatas para recorte

## Ejecucion CPU/GPU
- use_gpu:
  - False: fuerza CPU
  - True: usa CUDA si disponible; si no, fallback a CPU

## Segmentacion (SAM)
- segmentation_enabled: activa/desactiva ruta SAM
- segmentation_fallback_to_yolo: fallback a YOLO si SAM falla o no devuelve candidatos
- segmentation_model_name: modelo SAM
- segmentation_top_k_masks: numero de mascaras consideradas
- segmentation_min_mask_area_px: descarta regiones pequenas
- segmentation_max_mask_area_ratio: descarta regiones demasiado grandes
- segmentation_max_bbox_area_ratio: controla cajas muy grandes
- segmentation_min_mask_fill_ratio: calidad minima de mascara
- segmentation_bbox_iou_dedup_threshold: deduplicacion por IoU
- segmentation_containment_threshold: deduplicacion por contencion

## CLIP y filtro de prenda
- clip_model_name: modelo CLIP
- clip_top_k: top-k interno para clasificacion
- clip_min_confidence: umbral minimo de confianza

Filtro binario de prenda:
- garment_filter_enabled: activa filtro prenda/no-prenda
- garment_filter_min_score: score minimo para aceptar prenda
- garment_filter_margin: margen frente a clase no-prenda

## Etiquetas disponibles
- CATEGORY_LABELS
- COLOR_LABELS
- STYLE_LABELS
- MATERIAL_LABELS
- SEASON_LABELS

## Operacion sin internet (offline)
Si los modelos ya estan cacheados localmente, el servicio funciona sin Wi-Fi.

Recomendado para forzar modo offline:
- HF_HUB_OFFLINE=1
- TRANSFORMERS_OFFLINE=1

En PowerShell (sesion actual):
- $env:HF_HUB_OFFLINE='1'
- $env:TRANSFORMERS_OFFLINE='1'

Importante:
- Primer arranque en una maquina nueva puede requerir internet para descargar modelos de Hugging Face (CLIP y SAM).
- YOLO local (yolov8n.pt) no requiere descarga adicional si el archivo ya existe.

## Estado verificado
Se ejecuto test_phase_b.py en modo offline forzado (HF_HUB_OFFLINE + TRANSFORMERS_OFFLINE) con exit code 0.
