const auth = {
  errors: {
    refreshTokenRequired: 'El refresh token es obligatorio',
    authProviderMissing: 'El hook de auth debe usarse dentro de AuthProvider',
    googleNotImplemented: 'Google OAuth aun no esta implementado',
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
      devLoginFailed: 'Fallo de acceso Dev. Revisa DEV_REFRESH_TOKEN en login.tsx',
    },
  },
}

export default auth
