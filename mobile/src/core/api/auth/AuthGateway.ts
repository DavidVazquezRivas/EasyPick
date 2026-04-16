import axios from 'axios'
import { ApiRoutes } from '@/shared/constants/ApiRoutes'
import { ApiResponse } from '@/core/api/global/ApiResponse'
import { ApiError } from '@/core/api/global/errors'
import { AuthTokens } from '@/core/auth/models/AuthTokens'

type GoogleSignInResponse = AuthTokens

export const AuthGateway = {
  signInWithGoogle: async (idToken: string): Promise<GoogleSignInResponse> => {
    const response = await axios.post<ApiResponse<GoogleSignInResponse>>(ApiRoutes.Auth.Google, { idToken })

    if (!response.data.success) {
      const code = response.data.message?.code ?? 0
      const message = response.data.message?.message ?? 'Failed to sign in with Google'
      throw new ApiError(code, message, response.data.path ?? undefined, response.data.timestamp ?? undefined)
    }

    const tokens = response.data.data
    if (!tokens?.refreshToken) {
      throw new ApiError(0, 'Google sign in returned empty authentication data', response.data.path ?? undefined, response.data.timestamp ?? undefined)
    }

    return tokens
  },
}