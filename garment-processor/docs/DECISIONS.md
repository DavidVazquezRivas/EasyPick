# Decisions

## Active Decisions

1. Separation-first architecture
- Decision: prioritize object separation quality before semantic class correctness.
- Rationale: CLIP can classify separated candidates; poor separation cannot be recovered downstream.

2. Two-stage CLIP usage
- Decision: use CLIP first as garment/non-garment filter, then as attribute classifier.
- Rationale: reduces false positives like camera/decor entering the final label pipeline.

3. Backward-compatible endpoint
- Decision: keep response schema unchanged while swapping internal detection strategy.
- Rationale: preserve Spring Boot integration stability.

4. Segmentation with fallback
- Decision: use SAM-based candidate extraction with fallback to YOLO when segmentation is unavailable.
- Rationale: maintain uptime and allow incremental rollout.

5. Initial acceptance criterion
- Decision: the reference image must reach 5/5 garments separated and camera discarded.
- Rationale: scene is clear enough to require strict acceptance at this stage.
