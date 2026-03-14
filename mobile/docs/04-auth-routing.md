# Auth And Routing

Resumen corto del flujo auth + navegacion.

## Estructura de rutas

```txt
src/app/
  (public)/login.tsx
  (private)/home/index.tsx
  _layout.tsx
```

Regla: (public) sin sesion, (private) con sesion.

## Guard principal

En src/app/_layout.tsx:

1. Espera isInitialized.
2. Si no autenticado y ruta privada -> login.
3. Si autenticado y ruta publica -> home.

## AuthContext

Contrato principal:

- isAuthenticated
- isInitialized
- signIn(refreshToken)
- signInWithProvider(provider)
- signOut()

## Tokens (estado actual)

1. Refresh token persistido en SecureStore.
2. Access token solo en memoria.
3. Primer 401 tras abrir app es esperado y dispara refresh.

## Sign in/out

- Dev login temporal via DEV_REFRESH_TOKEN.
- OAuth preparado, no cerrado todavia.
- SignOut limpia tokens y fuerza vuelta a rutas publicas.

## Reglas

1. Estado de sesion vive en AuthContext.
2. Persistencia de token vive en tokenManager.
3. Manejo tecnico de 401 vive en httpClient.
