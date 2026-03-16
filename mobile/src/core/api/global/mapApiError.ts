import axios from 'axios'
import { ApiResponse } from '@/core/api/global/ApiResponse'

const backendErrorCodeToI18nKey: Record<number, string> = {
  1000: 'common.api.errors.backendCodes.1000',
  1001: 'common.api.errors.backendCodes.1001',
  1002: 'common.api.errors.backendCodes.1002',
  1003: 'common.api.errors.backendCodes.1003',
  2000: 'common.api.errors.backendCodes.2000',
  2001: 'common.api.errors.backendCodes.2001',
}

const getI18nKeyFromBackendCode = (code: number | undefined): string | null => {
  if (!code) return null
  return backendErrorCodeToI18nKey[code] ?? null
}

export const mapApiErrorToDisplayError = (error: unknown): Error => {
  // Preserve already-normalized app errors.
  if (error instanceof Error && !axios.isAxiosError(error)) {
    return error
  }

  if (axios.isAxiosError(error)) {
    const responseBody = error.response?.data as ApiResponse<unknown> | undefined
    const backendCode = responseBody?.message?.code
    const i18nKey = getI18nKeyFromBackendCode(backendCode)

    if (i18nKey) {
      return new Error(i18nKey)
    }

    if (responseBody?.message?.message) {
      return new Error(responseBody.message.message)
    }

    if (error.message) {
      return new Error(error.message)
    }
  }

  return new Error('common.global.error.unknown')
}
