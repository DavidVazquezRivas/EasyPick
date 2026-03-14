const auth = {
  errors: {
    refreshTokenRequired: 'Refresh token is required',
    authProviderMissing: 'Auth hook must be used inside AuthProvider',
    googleNotImplemented: 'Google OAuth is not yet implemented',
  },
  login: {
    subtitle: 'Sign in to continue',
    actions: {
      devLogin: 'Dev Login',
      googleLogin: 'Sign in with Google',
    },
    errors: {
      signInFailed: 'Sign in failed',
      devLoginFailed: 'Dev login failed. Check DEV_REFRESH_TOKEN in login.tsx',
    },
  },
}

export default auth
