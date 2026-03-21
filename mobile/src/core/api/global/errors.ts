/**
 * Custom error class for API responses.
 *
 * Preserves the backend error code and additional context for proper error handling
 * and user-facing error messages via i18n.
 *
 * Example:
 *   throw new ApiError(1000, 'Garment not found', '/api/v1/garments/123')
 *
 * The code is used to map to i18n keys: common.api.errors.backendCodes.{code}
 */
export class ApiError extends Error {
  readonly code: number
  readonly path?: string | null
  readonly timestamp?: string | null

  constructor(code: number, message: string, path?: string | null, timestamp?: string | null) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.path = path ?? undefined
    this.timestamp = timestamp ?? undefined

    // Maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}
