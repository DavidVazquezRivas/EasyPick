# Changelog

## 2026-03-29 - Iteration: Segmentation + Garment Filter Foundation

### Added
- Internal segmentation service based on SAM mask generation with candidate extraction and deduplication.
- CLIP binary garment filter (`garment` vs `non-garment`) before detailed labeling.
- Documentation baseline in `docs/` for decisions and evolution tracking.

### Changed
- Orchestrator now supports segmentation-first candidate generation with fallback to YOLO crops.
- Startup lifecycle initializes segmentation service with safe fallback if model loading fails.
- Configuration now includes segmentation and garment-filter thresholds.
- Candidate pruning now applies mask fill ratio, max bbox area ratio, IoU deduplication, and containment suppression.

### Why
- YOLO COCO detection was not separating all garments in the reference image despite clear scene conditions.
- The project goal prioritizes correct garment separation over detector class semantics.

### Validation Goal
- Reference image acceptance target: 5/5 garments detected as garments and camera discarded as non-garment.

### Validation Result (2026-03-29)
- Segmentation debug output: 6 total candidates, 5 kept as garments, 1 dropped (camera).
- Endpoint test `/process-garments`: HTTP 200 with 5 garments in response.
- All returned images decode as valid PNG base64 payloads.
