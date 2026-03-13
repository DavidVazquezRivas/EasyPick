import { OAuthProvider } from './types'

// TODO: Implement Google OAuth
//
// Steps:
// 1. Install deps:
//      npx expo install expo-auth-session expo-crypto
//
// 2. Register OAuth credentials in Google Cloud Console:
//      - Create an OAuth 2.0 client (type: "iOS" for native, or "Web" for Expo Go)
//      - Note the client ID(s) and add them to a .env file
//
// 3. Register a URI scheme in app.json:
//      "scheme": "easypick"
//
// 4. Implement signIn():
//      - Build redirect URI with AuthSession.makeRedirectUri({ scheme: 'easypick' })
//      - Use useAuthRequest / promptAsync from expo-auth-session/providers/google
//      - Exchange the authorization code for tokens via AuthSession.exchangeCodeAsync
//      - POST the Google id_token or access_token to your backend endpoint
//        (e.g. POST /auth/google) which validates it and returns { refreshToken }
//      - Return that refreshToken
//
// 5. Backend side:
//      - Validate the Google token with Google's tokeninfo endpoint or google-auth-library
//      - Find or create the user
//      - Return { refreshToken } (same shape as /auth/refresh)

export const googleProvider: OAuthProvider = {
  id: 'google',
  displayName: 'Google',
  signIn: async () => {
    throw new Error('Google OAuth is not yet implemented')
  },
}
