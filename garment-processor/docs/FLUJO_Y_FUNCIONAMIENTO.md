# Flujo y Funcionamiento General

## Objetivo del servicio
El servicio recibe una imagen, detecta prendas, elimina fondo por prenda, clasifica atributos con CLIP y devuelve:
- Lista de PNGs en base64
- Lista de objetos prenda con metadatos y etiquetas

## Entrada y salida
- Endpoint: POST /process-garments
- Entrada: multipart/form-data con campo image (jpg/png)
- Salida (HTTP 200):
  - garment_pngs_base64: list[str]
  - garments: list[ProcessedGarment]
  - mime_type: image/png

Cada elemento de garments incluye:
- temp_id
- detection_confidence
- labels: category, color, style, material, season
- image_index
- image_base64
- mime_type

## Flujo interno
1. Validacion de input
- Se valida tamano y formato de imagen en app/api/input_validator.py.

2. Inicializacion de modelos (lifespan)
- YOLO se carga desde yolov8n.pt.
- CLIP se carga desde openai/clip-vit-base-patch32.
- SAM se carga si segmentation_enabled=True.

3. Seleccion de ruta de deteccion
- Si segmentation_enabled=True y SAM disponible:
  - Se generan candidatos por segmentacion.
- Si no hay candidatos y segmentation_fallback_to_yolo=True:
  - Se usa deteccion YOLO y recorte por bbox.

4. Filtrado de candidatos (garment_filter)
- Se decide si cada candidato es prenda/no-prenda.
- Si garment_filter_enabled=True, se descartan no-prendas.

5. Limpieza de fondo
- Se aplica BackgroundRemover por candidato aceptado.

6. Clasificacion CLIP
- Se etiquetan: category, color, style, material, season.

7. Construccion de respuesta
- Cada imagen de prenda se convierte a PNG y base64.
- Se devuelve:
  - garment_pngs_base64 (lista global)
  - garments (cada objeto incluye image_base64 e image_index)

## Errores y codigos HTTP
- 400: validacion de input
- 422: fallo de proceso o sin prendas detectadas
- 500: error inesperado

## Prueba end-to-end recomendada
Comando:
- .venv/Scripts/python.exe test_phase_b.py

Resultado esperado:
- example.jpg: 1 prenda
- example2.jpg: 4 prendas
