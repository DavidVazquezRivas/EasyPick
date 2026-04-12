const auth = {
  errors: {
    refreshTokenRequired: 'Refresh token is required',
    authProviderMissing: 'Auth hook must be used inside AuthProvider',
    googleClientIdMissing: 'Google web client ID is missing',
    googleAndroidClientIdMissing: 'Google Android client ID is missing',
    googleIosClientIdMissing: 'Google iOS client ID is missing',
  },
  login: {
    subtitle: 'Sign in to continue',
    actions: {
      devLogin: 'Dev Login',
      openDevErrorPlayground: 'Open Error Playground',
      googleLogin: 'Sign in with Google',
    },
    errors: {
      signInFailed: 'Sign in failed',
      googleCancelled: 'Google sign in was cancelled',
      googleSignInFailed: 'Google sign in failed',
      googleMissingIdToken: 'Google sign in did not return an ID token',
      googlePlayServicesUnavailable: 'Google Play Services is not available on this device',
      googleNativeNotSupportedOnWeb: 'Google native sign in is not supported on web',
      googleExpoGoNotSupported:
        'Google sign in is not supported in Expo Go. Please use a native dev build (npx expo run:android or npx expo run:ios).',
      googleEmptyAuthData: 'Google sign in returned empty authentication data',
      devLoginFailed: 'Dev login failed. Check DEV_REFRESH_TOKEN in login.tsx',
    },
  },
}

export default auth
