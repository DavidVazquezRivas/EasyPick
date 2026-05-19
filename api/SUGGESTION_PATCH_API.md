## Suggestion Patch API

The Suggestion patch API allows you to update the status of suggestions and handle rejections.

### Accept a Suggestion

**Request:**
```json
{
  "status": "ACCEPTED"
}
```

### Mark a Suggestion as Favorite

Use the `isFavorite` field to toggle the favorite flag on a suggestion.

**Request:**
```json
{
  "isFavorite": true
}
```

**Example:**
```bash
PATCH /suggestions/{suggestionId}
Content-Type: application/json

{
  "isFavorite": true
}
```

**Example:**
```bash
PATCH /suggestions/{suggestionId}
Content-Type: application/json

{
  "status": "ACCEPTED"
}
```

### Reject a Suggestion

To reject a suggestion, you must provide a `rejection` object with optional:
- `reasonId` (UUID): Reference to a predefined rejection reason
- `customReason` (string): Custom text explaining the rejection

**Request with rejection reason:**
```json
{
  "rejection": {
    "reasonId": "uuid-of-reason"
  }
}
```

**Request with custom reason:**
```json
{
  "rejection": {
    "customReason": "I don't like this outfit"
  }
}
```

**Request with both reason and custom text:**
```json
{
  "rejection": {
    "reasonId": "uuid-of-reason",
    "customReason": "Additional explanation"
  }
}
```

**Example:**
```bash
PATCH /suggestions/{suggestionId}
Content-Type: application/json

{
  "rejection": {
    "reasonId": "f47ac10b-58cc-4372-a567-0e02b2c3d470",
    "customReason": "Not suitable for today"
  }
}
```

### Available Rejection Reasons

Get all available rejection reasons:
```bash
GET /rejection-reasons
```

### Get User Outfits

Get all outfits saved by the authenticated user:
```bash
GET /suggestions/me
```

### Error Handling

- `SUGGESTION_NOT_FOUND` (404): The suggestion does not exist
- `REJECTION_REASON_NOT_FOUND` (404): The specified rejection reason does not exist
- `INVALID_SUGGESTION_STATUS` (400): The status provided is invalid
- `INVALID_SUGGESTION_REJECTION` (400): The rejection data is malformed
- `INVALID_UUID_FORMAT` (400): The UUID format is invalid
