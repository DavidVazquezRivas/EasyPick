/**
 * Token pair returned by POST /auth/refresh.
 * The backend rotates refresh tokens on every call — both fields are always present.
 */
export interface AuthTokens {
  accessToken: string
  refreshToken: string
}
