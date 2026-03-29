# Iteration Log - 2026-03-29

## Scope
Introduce segmentation-first candidate generation and CLIP garment filtering without breaking the API contract.

## Context
The sample image shows clearly separated garments, but YOLO COCO detection only returned partial/incorrect boxes.

## Decisions
1. Implement SAM mask-generation service for candidate extraction.
2. Keep YOLO as fallback path to avoid hard failures during transition.
3. Add CLIP binary garment filter before detailed label classification.
4. Keep endpoint response model unchanged.

## Risks
- SAM can produce extra candidates that are not garments.
- Segmentation can increase latency on CPU-only execution.

## Mitigations
- CLIP garment filter with configurable score threshold and margin.
- Candidate pruning with minimum area, mask fill ratio, max bbox area ratio, IoU deduplication, and containment suppression.
- Fallback to YOLO if segmentation initialization or execution fails.

## Acceptance Criteria
1. Reference image: 5/5 garments included.
2. Reference image: camera excluded.
3. Endpoint schema remains backward compatible.

## Outcome
- Segmentation debug run produced 6 candidates total.
- 5 candidates passed garment filter and match expected garments (sweater, boots, hat, shirt, jeans).
- Camera candidate was correctly dropped as non-garment.
- Endpoint integration test returned HTTP 200 with 5 processed garments and valid PNG base64 payloads.
