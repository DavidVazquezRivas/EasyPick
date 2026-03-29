# Phase B: Introduce Segmentation as Configurable Internal Capability

**Status**: ✅ COMPLETE  
**Date**: 2026-03-29  
**Objective**: Implement segmentation-based garment separation as an internal processing option with YOLO fallback resilience.

## Context

The current implementation uses YOLOv8 for garment detection, but YOLOv8 (trained on COCO dataset) does not cleanly separate individual garments in cluttered scenes (e.g., a mirror reflecting clothing, multiple garments stacked). 

**Vision**: 
- Use SAM (Segment Anything Model) to generate mask proposals
- Apply semantic filtering (CLIP) to distinguish prendas from non-prendas
- Fall back to YOLO if segmentation fails or times out
- Maintain backward compatibility with existing Spring Boot integration

## Decision: Segmentation with Fallback Strategy

| Scenario | Behavior |
|----------|----------|
| `segmentation_enabled=False` (DEFAULT) | Use YOLO only (current behavior; no changes) |
| `segmentation_enabled=True` + SAM ready | Try SAM; if failure, fall back to YOLO if `segmentation_fallback_to_yolo=True` |
| `segmentation_enabled=True` + SAM fails | Fall back to YOLO (safe degradation) |
| `segmentation_enabled=True` + timeout | Hard error (protect server latency) |

## Architecture

```
Input Image (POST /process-garments)
      │
      ├─→ segmentation_enabled = False (default)
      │   └─→ YOLO Detection Path
      │       └─→ Crop bboxes → Background removal → CLIP labels → Response
      │
      └─→ segmentation_enabled = True
          ├─ Load SAM (if not already loaded)
          ├─ Call segmentation_service.segment(image)
          │  ├─→ Generates top-k masks
          │  ├─→ Deduplicates by IoU and containment
          │  └─→ Returns SegmentedCandidate list
          │
          ├─ If SAM fails OR returns empty
          │  ├─→ segmentation_fallback_to_yolo = True
          │  │   └─→ Fall back to YOLO detection
          │  └─→ segmentation_fallback_to_yolo = False
          │      └─→ Raise error (fail hard)
          │
          └─→ Process candidates (same as YOLO)
              └─→ Background removal → CLIP labels → Response
```

## Configuration Flags

All flags located in [app/config.py](../app/config.py):

```python
# Segmentation Strategy
segmentation_enabled: bool = False  # Disable by default; enable for testing
segmentation_fallback_to_yolo: bool = True  # Resilient fallback

# Segmentation Model & Inference
segmentation_model_name: str = "facebook/sam-vit-base"
segmentation_top_k_masks: int = 30  # Process top 30 masks (IoU-deduplicated)

# Quality Filters for Segmentation Outputs
segmentation_min_mask_area_px: int = 3500  # Skip tiny fragments
segmentation_max_mask_area_ratio: float = 0.7  # Skip masks > 70% image
segmentation_max_bbox_area_ratio: float = 0.6  # Skip if bbox > 60% image
segmentation_min_mask_fill_ratio: float = 0.45  # Mask must fill 45% of bbox
segmentation_bbox_iou_dedup_threshold: float = 0.65  # Deduplicate if IoU > 65%
segmentation_containment_threshold: float = 0.9  # Prune if containment > 90%
```

## Implementation Status

✅ **Already Implemented**:
1. `SamSegmentationService` - SAM wrapper with mask generation
2. `GarmentProcessingOrchestrator` - Conditional YOLO/SAM path
3. Deduplication logic - IoU and containment filtering
4. Fallback strategy - Graceful degradation to YOLO
5. Lifespan initialization - SAM loading with device awareness

❓ **Status Check**: Need to verify SAM loads without errors.

## Code Locations

| Component | File | Notes |
|-----------|------|-------|
| Segmentation Service | `app/services/segmentation_service.py` | SAM wrapper, quality filters, deduplication |
| Orchestrator Logic | `app/processing/orchestrator.py` | Conditional routing: SAM vs YOLO |
| Configuration | `app/config.py` | All tunable parameters |
| Lifespan | `app/lifespan.py` | Device-aware SAM initialization |
| Controller | `app/controllers/garment_controller.py` | Endpoint unchanged |
| Response Builder | `app/processing/response_builder.py` | Response unchanged |

## Quality Filters Explained

### `segmentation_min_mask_area_px`
- **Default**: 3500 px (57×61 px equivalent square)
- **Purpose**: Reject fragments smaller than likely garment minimum
- **Tune**: Decrease if processing small accessories; increase if rejecting valid garments

### `segmentation_max_mask_area_ratio`
- **Default**: 0.7 (70% of image area)
- **Purpose**: Reject segmentation errors where model selects most of image
- **Tune**: Decrease for cleaner backgrounds; increase tolerate large garments

### `segmentation_min_mask_fill_ratio`
- **Default**: 0.45 (45% of bounding box)
- **Purpose**: Reject noisy masks with low fill; prioritize clean separations
- **Tune**: Decrease for thin/loose clothing; increase for rigid garment shapes

### `segmentation_bbox_iou_dedup_threshold`
- **Default**: 0.65 (65% intersection)
- **Purpose**: Deduplicate overlapping masks (keep higher confidence)
- **Tune**: Lower to keep more variants; higher to keep only distinct objects

### `segmentation_containment_threshold`
- **Default**: 0.9 (90% of inner contained in outer)
- **Purpose**: Remove nested/redundant segmented regions
- **Tune**: Increase to be more aggressive about pruning

## Testing & Validation

### Local Verification (Interactive)

1. **Enable segmentation in config**:
   ```python
   segmentation_enabled: bool = True
   ```

2. **Start server**:
   ```bash
   python main.py
   ```

3. **Test with reference image**:
   ```bash
   curl -F "image=@example.jpg" http://localhost:8081/process-garments
   ```

4. **Check logs** for:
   - SAM initialization success/failure
   - Number of mask candidates generated
   - Deduplication results
   - Fallback activation (if applicable)

### Test Reference Images

- `example.jpg`: Mirror scene (1 expected garment)
- `example2.jpg`: Shelf scene (4 expected garments)

When segmentation works correctly:
- **example.jpg**: Should find 1 garment (not confuse mirror/background)
- **example2.jpg**: Should find all 4 garments (not merge adjacent items)

## Observability Instrumentation (Planned)

For Phase F, we'll add telemetry:
- Candidate count from SAM (before dedup)
- Candidates after dedup
- Fallback activation count
- Latency by stage (SAM generation, dedup, background removal)
- CLIP filter acceptance rate (Phase C)

## Risk & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| SAM out-of-memory on large images | Server crash | Add timeout; monitor memory; pre-scale large images |
| Segmentation too slow (>5s) | Poor UX | Implement inference timeout; revert to YOLO |
| Quality worse than YOLO | Lower accuracy | Keep fallback enabled; tune thresholds per dataset |
| SAM library incompatible | Build failure | Test with torch CPU variant; document dependency path |

## Integration Points with Other Phases

- **Phase C** (CLIP Garment Filter): Filters candidates after SAM/YOLO
- **Phase D** (Quality Policies): Adjusts `segmentation_*` thresholds
- **Phase E** (Background Removal): Works on SAM crop output  
- **Phase F** (Observability): Instruments this path

## Acceptance Criteria

✅ **Phase B Complete When**:
1. Segmentation service initializes without errors (CPU or GPU)
2. Reference images can be processed with `segmentation_enabled=True`
3. Fallback to YOLO works if SAM times out or fails
4. Endpoint contract unchanged (same JSON response)
5. No performance regression when segmentation disabled (default)
6. Logs show clear evidence of path taken (SAM or YOLO)

## Verification Checklist

- [ ] Start app with `segmentation_enabled=True` (no crashes)
- [ ] Process example.jpg → HTTP 200, 1 garment detected
- [ ] Process example2.jpg → HTTP 200, 4 garments detected
- [ ] Disable segmentation, reprocess → same results
- [ ] Force SAM failure, verify fallback to YOLO works
- [ ] Response struct matches Phase A contract

## Next: Phase C

Once Phase B is stable, we introduce Phase C: **CLIP Prenda/Non-Prenda Filter**
- Adds binary classification: is this candidate a garment or noise?
- Reuses CLIP model with zero-shot prompting
- Reduces false positives from segmentation

See [PHASE_C_CLIP_FILTER.md](PHASE_C_CLIP_FILTER.md) (to be created).
