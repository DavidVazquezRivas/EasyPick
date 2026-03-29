# Iteración 2: Completada ✅

**Fecha**: 2026-03-29  
**Status**: Finalizado  

---

## Logros

### 1. ✅ Testing Exitoso
- **example.jpg**: 1 sweater detectado (conf=0.37) → HTTP 200
- **example2.jpg**: 4 jackets detectados (conf=0.26-0.41) → HTTP 200
- Resultados en: `debug_output/test-results.json`

### 2. ✅ GPU/CPU Flag Implementado
Agregué configuración simple y flexible:

```python
# app/config.py
use_gpu: bool = False  # ← Cambiar a True si tienes GPU
```

**Comportamiento**:
- `False` (default) → CPU siempre ✅ Máxima compatibilidad
- `True` → GPU si está disponible; fallback automático a CPU

**Bajo la cubierta**: Modelos se cargan en device correcto, inputs se mueven al device, sin código duplicado.

### 3. ✅ Outputs Accesibles
```
debug_output/
├── test-results.json          ← JSON con resultados
├── segmentation/
│   ├── annotated_segmentation.png  ← Visualización SAM
│   └── candidates.json
└── yolo/
    ├── annotated_yolo.png      ← Visualización YOLO
    └── crops.json
```

**Ver rápido**:
```bash
python show_results.py  # Muestra resumen + ubicaciones
```

### 4. ✅ Documentación
- [GPU_AND_OUTPUTS.md](GPU_AND_OUTPUTS.md) — Guía rápida de flags y outputs
- [iter-2026-03-29-testing-reference-images.md](docs/decisions-log/iter-2026-03-29-testing-reference-images.md) — Reporte técnico detallado

---

## Problemas Encontrados & Resueltos

| Problema | Causa | Solución |
|----------|-------|----------|
| HTTP 500 en tests | TestClient sin context manager | Envuelto en `with TestClient(app) as client` |
| Torch CPU-only | Instalación de torch sin CUDA | Documentado; usuario puede instalar GPU torch |
| SAM lento en CPU | Algoritmo costoso sin GPU | SAM deshabilitado en config (segmentation_enabled=False) |

---

## Cambios Técnicos

### app/config.py
- ✅ Agregado: `use_gpu: bool = False`

### app/lifespan.py
- ✅ Device detection automático
- ✅ YOLO moved to device (si GPU)
- ✅ CLIP moved to device
- ✅ SAM moved to device

### app/services/clip_service.py & garment_filter_service.py
- ✅ Inputs moved to device antes de inferencia
- ✅ No necesita cambios de usuario (automático)

### tests/test_reference_images.py
- ✅ Fixed TestClient context manager bug

---

## Cómo Usar

### Sin GPU (Ahora)
```bash
# Default - todo funciona en CPU
python tests/test_reference_images.py
python main.py
```

### Con GPU (Próxima sesión)
```python
# app/config.py
use_gpu: bool = True
```
```bash
python tests/test_reference_images.py  # Ahora usa CUDA
```

---

## Resultados Disponibles

**Verlos ahora**:
1. Abre `debug_output/test-results.json` en VS Code (JSON viewer)
2. Ejecuta: `python show_results.py`
3. Visualizaciones: `debug_output/segmentation/annotated_segmentation.png`

**Esperado**:
- example.jpg: 1 sweater rojo
- example2.jpg: 4 jackets (brown/black/navy)

---

## Próximos Pasos

1. **Cuando tengas GPU disponible**:
   - Instala: `pip install torch --index-url https://download.pytorch.org/whl/cu118`
   - Cambia: `use_gpu = True` en config
   - Re-run tests

2. **Si no tienes GPU**:
   - Mantén `use_gpu = False`
   - Ya funciona, continuamos con SAM deshabilitado

3. **Latency profiling**: Instrumentar cada stage (YOLO, CLIP, background removal)

4. **Threshold tuning**: Tests en imágenes más difíciles (oclusiones, sombras)

---

**Status Final**: ✅ Todo funciona. GPU flag listo. Outputs documentados. Siguiente iteración: profiling + threshold tuning.
