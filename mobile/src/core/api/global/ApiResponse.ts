/**
 * Error/info message included in every API response.
 * Present on both success and failure responses.
 */
export interface ApiMessage {
  code: number
  message: string
}

/**
 * Standard response envelope returned by every API endpoint.
 *
 * - `data`    — The response payload. Null when the request fails.
 * - `success` — Whether the request was processed successfully.
 * - `timestamp` — ISO-8601 timestamp of when the response was generated.
 * - `message` — Optional structured message (e.g. error code + description). Nullable.
 * - `path`    — The request path that generated this response. Nullable.
 *
 * Always check `success` before accessing `data`.
 */
export interface ApiResponse<T = undefined> {
  data: T | null
  success: boolean
  timestamp: string
  message: ApiMessage | null
  path: string | null
}
