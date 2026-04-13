import axios from 'axios'
import { ApiResponse } from '@/core/api/global/ApiResponse'
import { ApiError } from '@/core/api/global/errors'

/**
 * Map Axios errors to normalized app errors.
 *
 * For API responses with success=false, extracts the error code and creates an ApiError.
 * The code is preserved so UI can map it to i18n keys (common.api.errors.backendCodes.{code}).
 *
 * For other errors, returns a generic error with i18n key for fallback.
 */
export const mapApiErrorToDisplayError = (error: unknown): Error => {
  // Preserve already-normalized app errors (including ApiError).
  if (error instanceof Error && !axios.isAxiosError(error)) {
    return error
  }

  if (axios.isAxiosError(error)) {
    const responseBody = error.response?.data as ApiResponse<unknown> | undefined
    const backendCode = responseBody?.message?.code
    const message = responseBody?.message?.message || error.message || 'common.global.error.unknown'
    const path = responseBody?.path

    // If we have a backend error code, preserve it in ApiError for UI mapping to i18n keys
    if (backendCode !== undefined) {
      return new ApiError(backendCode, message, path ?? undefined, responseBody?.timestamp ?? undefined)
    }

    // Fallback: return regular Error with message or generic i18n key
    return new Error(message)
  }

  return new Error('common.global.error.unknown')
}
