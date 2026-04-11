# Quickstart

Version minima para empezar rapido.

## 1) Activar entorno virtual (Windows PowerShell)

.\.venv\Scripts\Activate.ps1

## 2) Tests (elige uno rapido y uno completo)

- Smoke tests del flujo principal:

"c:/Users/Gastón/Documents/Proyectos Prog/EasyPick/garment-processor/.venv/Scripts/python.exe" -m pytest tests/test_health_endpoints.py tests/test_http_error_mapper.py tests/test_process_garments_use_case.py -q

- Suite completa:

"c:/Users/Gastón/Documents/Proyectos Prog/EasyPick/garment-processor/.venv/Scripts/python.exe" -m pytest -q

## 3) Arrancar API

"c:/Users/Gastón/Documents/Proyectos Prog/EasyPick/garment-processor/.venv/Scripts/python.exe" main.py

API disponible en:
- http://127.0.0.1:8082/health/live
- http://127.0.0.1:8082/health/ready
- http://127.0.0.1:8082/docs

## 4) Arranque con Docker Compose (stack completo)

Desde la raiz de EasyPick:

docker compose build garment-processor
docker compose up -d

Primer arranque:
- Puede tardar varios minutos por descarga de modelos (Grounding DINO, CLIP, rembg).
- La cache se persiste en el volumen `garment_processor_models`.

Variables usadas por el servicio en compose:
- EASYPICK_API_BASE_URL=http://api:8080
- GARMENT_CONFIG_ENDPOINT=/garments/configurations
- GARMENT_CONFIG_TIMEOUT_SECONDS=10
- SYNC_GARMENT_LABELS_ON_STARTUP=true

## 5) Verificacion rapida en Docker

Logs del servicio:

docker compose logs -f garment-processor --tail 100

Health endpoints:
- http://127.0.0.1:8082/health/live
- http://127.0.0.1:8082/health/ready

Comprobar sincronizacion de configuraciones en startup:

docker compose logs garment-processor --tail 200

Busca una linea similar a:
- Garment labels synced | categories=X colors=Y styles=Z brands=W

Si la API principal no esta lista al iniciar:
- El sync es best-effort y se mantiene el fallback local.
- Reinicia solo este servicio cuando la API ya este arriba:

docker compose restart garment-processor
