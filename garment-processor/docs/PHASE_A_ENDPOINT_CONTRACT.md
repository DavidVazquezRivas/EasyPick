# Phase A: Endpoint Contract Freeze

**Status**: ✅ COMPLETE  
**Date**: 2026-03-29  
**Objective**: Establish and document the immutable endpoint contract before introducing internal architectural changes.

## Context

The garment processor microservice exposes a REST API for image processing. As we migrate internal implementation from YOLO-only to segmentation-based garment separation, we need to ensure the external contract remains stable for Spring Boot integration.

**Constraints**:
- Cannot modify response structure (JSON schema) without coordinating with Spring Boot backend
- Cannot change HTTP status codes or error responses
- Cannot remove or rename existing fields
- Can add fields if Spring Boot integration ignores unknown fields

## Decision

Freeze the endpoint contract to ensure backward compatibility:

1. **Endpoint**: `POST /process-garments`
2. **Request**: Multipart form with `image` field (JPG/PNG)
3. **Response**: Immutable JSON structure (detailed below)
4. **All internal improvements** will work within this contract

## Response Contract (Immutable)

### Success Response (HTTP 200)

```json
{
  "garments": [
    {
      "temp_id": "uuid-string",
      "detection_confidence": 0.85,
      "labels": {
        "category": {
          "label": "t-shirt",
          "score": 0.92
        },
        "color": {
          "label": "blue",
          "score": 0.88
        },
        "style": {
          "label": "casual",
          "score": 0.77
        },
        "material": {
          "label": "cotton",
          "score": 0.81
        },
        "season": {
          "label": "summer",
          "score": 0.79
        }
      },
      "image_base64": "(PNG bytes in base64)",
      "mime_type": "image/png"
    }
  ]
}
```

**Field Definitions**:
- `garments[]`: Array of detected garments (can be empty if HTTP 422)
- `temp_id`: Unique identifier (UUID v4) for this garment in this batch
- `detection_confidence`: Float [0.0, 1.0]; source depends on internal path (YOLO or SAM)
- `labels`: 5 fixed classification attributes, each with:
  - `label`: String; category value (e.g., "t-shirt", "blue", "casual", "cotton", "summer")
  - `score`: Float [0.0, 1.0]; CLIP confidence for this prediction
- `image_base64`: PNG-encoded image as base64 string (no newlines)
- `mime_type`: Always "image/png" (rembg output format)

### Error Responses

**HTTP 400** - Input validation failed (invalid image format, too large, too small)
```json
{"detail": "Image must be JPEG or PNG and 32×32px minimum"}
```

**HTTP 422** - Processing failed or no garments detected
```json
{"detail": "No garments detected in image"}
```
OR
```json
{"detail": "Processing failed"}
```

**HTTP 500** - Server error (unexpected exception)
```json
{"detail": "Processing failed"}
```

## Validation Constraints (Frozen)

From `app/config.py`:

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `max_upload_size_bytes` | 15 MB | Request validation |
| `min_image_width` | 32 px | Request validation |
| `min_image_height` | 32 px | Request validation |
| `max_image_width` | 8192 px | Request validation |
| `max_image_height` | 8192 px | Request validation |

## Controller Implementation (Frozen)

See [app/controllers/garment_controller.py](../app/controllers/garment_controller.py):
- Endpoint: `/process-garments` (POST)
- Response model: `ProcessGarmentsResponse` (Pydantic)
- Error handling: Stable HTTP status codes
- Logging: Instrument at key decision points

## Response Builder Implementation (Frozen)

See [app/processing/response_builder.py](../app/processing/response_builder.py):
- Method: `build_many(garments: list[OrchestratedGarment]) → list[ProcessedGarment]`
- Transforms internal `OrchestratedGarment` to external `ProcessedGarment`
- CLIP labels: Always 5 categories (category, color, style, material, season)
- Image encoding: Always PNG base64
- UUID generation: Fresh UUID for each garment in response

## Internal Orchestration (Can Evolve)

Behind this frozen contract, improvements are possible:

1. **Garment Detection Path**: Can switch between YOLO and SAM (internal)
2. **Filtering**: Can introduce CLIP prenda/no-prenda filter (internal)
3. **Background Removal**: Fallback strategy by configuration (internal)
4. **Labeling**: CLIP prompts can be tuned without changing schema (internal)
5. **Device Usage**: CPU ↔ GPU can be toggled (internal config)

The orchestrator (`GarmentProcessingOrchestrator`) abstracts all these internal variations.

## Verification Checklist

- [x] Response fields match Spring Boot expectations
- [x] HTTP status codes align with error handling
- [x] Image encoding is platform-agnostic (PNG base64)
- [x] UUIDs are stable per batch per garment
- [x] Five CLIP labels are always present
- [x] No assumptions about detection confidence source
- [x] Error messages are user-friendly

## Further Considerations

1. **Spring Boot Integration**: Confirm consumed correctly by backend
2. **Version Header**: Consider adding API version to response if future breaking changes needed
3. **Pagination**: If batch processing needed, design separately (not in Phase A)
4. **Confidence Calibration**: Monitor if YOLO vs SAM confidence scores differ significantly
5. **Failure Modes**: Document graceful degradation strategy in ops runbook
