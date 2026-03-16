export interface OAuthProvider {
  id: string
  displayName: string
  // Performs the provider-specific OAuth flow and returns a refresh token issued by the backend.
  signIn: () => Promise<string>
}
