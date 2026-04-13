const auth = {
  errors: {
    refreshTokenRequired: 'El refresh token es obligatorio',
    authProviderMissing: 'El hook de auth debe usarse dentro de AuthProvider',
    googleClientIdMissing: 'Falta el client ID web de Google',
    googleAndroidClientIdMissing: 'Falta el client ID Android de Google',
    googleIosClientIdMissing: 'Falta el client ID iOS de Google',
  },
  login: {
    subtitle: 'Inicia sesion para continuar',
    actions: {
      devLogin: 'Acceso Dev',
      openDevErrorPlayground: 'Abrir Playground de Errores',
      googleLogin: 'Iniciar sesion con Google',
    },
    errors: {
      signInFailed: 'Error al iniciar sesion',
      googleCancelled: 'El inicio de sesion con Google se cancelo',
      googleSignInFailed: 'Fallo el inicio de sesion con Google',
      googleMissingIdToken: 'Google no devolvio un ID token',
      googlePlayServicesUnavailable: 'Google Play Services no esta disponible en este dispositivo',
      googleNativeNotSupportedOnWeb: 'El inicio de sesion nativo con Google no esta soportado en web',
      googleExpoGoNotSupported:
        'Google no se puede usar desde Expo Go. Usa una build nativa de desarrollo (npx expo run:android o npx expo run:ios).',
      googleEmptyAuthData: 'Google devolvio datos de autenticacion vacios',
      devLoginFailed: 'Fallo de acceso Dev. Revisa DEV_REFRESH_TOKEN en login.tsx',
    },
  },
}

export default auth
