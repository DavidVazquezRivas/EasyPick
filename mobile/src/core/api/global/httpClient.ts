import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { tokenManager } from '@/core/api/global/tokenManager'
import { API_BASE_URL, ApiRoutes } from '@/shared/constants/ApiRoutes'
import { eventEmitter } from '@/shared/utils/eventEmitter'
import { Events } from '@/shared/constants/Events'
import { ApiResponse } from '@/core/api/global/ApiResponse'
import { AuthTokens } from '@/core/auth/models/AuthTokens'
import { mapApiErrorToDisplayError } from '@/core/api/global/mapApiError'

// Extends the Axios config type to carry the retry flag used by the 401 interceptor.
type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean }

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
})

let refreshInFlight: Promise<AuthTokens> | null = null

const refreshTokens = async (): Promise<AuthTokens> => {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const refreshToken = await tokenManager.getRefreshToken()

      if (!refreshToken) {
        throw new Error('common.api.errors.noRefreshToken')
      }

      // Native axios call avoids entering httpClient interceptors during refresh.
      const refreshResponse = await axios.post<ApiResponse<AuthTokens>>(
        ApiRoutes.Auth.Refresh,
        { refreshToken },
        { headers: { Authorization: undefined } },
      )

      // Validate success before accessing data (per ApiResponse contract)
      if (!refreshResponse.data.success) {
        const message = refreshResponse.data.message?.message ?? 'Token refresh failed'
        throw new Error(message)
      }

      const tokens = refreshResponse.data.data
      if (!tokens) throw new Error('common.api.errors.emptyRefreshData')

      return tokens
    })().finally(() => {
      refreshInFlight = null
    })
  }

  return refreshInFlight
}

// Request Interceptor: Inject Access into every request
httpClient.interceptors.request.use(
  (config) => {
    const accessToken = tokenManager.getAccessToken()
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },

  (error) => Promise.reject(error),
)

// Response Interceptor: Handle authentication errors and token refresh
httpClient.interceptors.response.use(
  (response) => response, // If response is successful, just return it
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined

    // If error is 401 (Unauthorized) and we haven't already tried to refresh for this request
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true // Mark the request to avoid infinite loops

      try {
        const tokens = await refreshTokens()

        tokenManager.setAccessToken(tokens.accessToken)
        await tokenManager.setRefreshToken(tokens.refreshToken)

        // Retry the original request with the new access token
        originalRequest.headers = originalRequest.headers ?? {}
        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`
        return httpClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed (e.g. refresh token expired) — clear tokens and notify the app
        await tokenManager.clearTokens()
        eventEmitter.emit(Events.TokenExpired)
        return Promise.reject(mapApiErrorToDisplayError(refreshError))
      }
    }

    return Promise.reject(mapApiErrorToDisplayError(error))
  },
)
