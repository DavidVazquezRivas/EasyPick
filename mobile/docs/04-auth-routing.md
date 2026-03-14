# Auth And Routing

Este documento explica cómo funciona hoy la navegación autenticada y el ciclo de autenticación del frontend.

## Estructura de rutas

Expo Router está organizado en dos grupos:

```txt
src/app/
  (public)/
    login.tsx
  (private)/
    home/
      index.tsx
  _layout.tsx
```

Regla:

- `(public)` contiene pantallas accesibles sin sesión.
- `(private)` contiene pantallas protegidas.

## Guarda principal

La guarda vive en `src/app/_layout.tsx` dentro de `InitialLayout`.

Comportamiento actual:

1. Espera a que `AuthProvider` termine la inicialización.
2. Lee `segments[0]` para detectar si la ruta pertenece a `(public)` o `(private)`.
3. Si no hay sesión y la ruta es privada, redirige a `Routes.Public.Login`.
4. Si hay sesión y la ruta es pública, redirige a `Routes.Private.Home`.
5. Mientras `isInitialized` es `false`, devuelve `null`.

Nota:

- Hoy no hay splash screen ni loading route durante la inicialización del auth context.

## AuthProvider

`src/core/auth/AuthContext.tsx` define el estado global de autenticación.

La API pública actual del contexto es:

```ts
interface AuthContextType {
  isAuthenticated: boolean
  isInitialized: boolean
  signIn: (refreshToken: string) => Promise<void>
  signInWithProvider: (provider: OAuthProvider) => Promise<void>
  signOut: () => Promise<void>
}
```

### Inicialización

Al montar `AuthProvider`:

1. Lee el refresh token desde `tokenManager.getRefreshToken()`.
2. Si existe, marca `isAuthenticated = true`.
3. Si no existe, marca `isAuthenticated = false`.
4. Siempre termina con `isInitialized = true`.
5. Se suscribe al evento `Events.TokenExpired` para cerrar sesión automáticamente.

La inicialización no hace llamadas HTTP.

## Estrategia actual de tokens

### Refresh token

- Se persiste en SecureStore.
- Define si la app considera que existe una sesión al arrancar.

### Access token

- Vive solo en memoria.
- No se recupera al abrir la app.
- Se obtiene después de un refresh exitoso.

Esta decisión es intencional en el estado actual del proyecto.

## Flujo real al abrir la app

```txt
App start
  -> AuthProvider revisa SecureStore
  -> si hay refresh token: sesión autenticada
  -> usuario entra a una ruta privada
  -> primera petición protegida puede devolver 401
  -> httpClient hace refresh
  -> guarda nuevo access token en memoria
  -> reintenta petición original
```

Ese primer `401` esperado no debe documentarse como error; es parte del diseño actual.

## Sign in actual

La pantalla `src/app/(public)/login.tsx` hoy tiene dos caminos conceptuales:

### Dev login vigente

- Usa un `DEV_REFRESH_TOKEN` temporal.
- Llama a `signIn(refreshToken)`.
- `signIn()` limpia el access token en memoria, guarda el refresh token y marca sesión autenticada.

### OAuth preparado pero no implementado

- Existe `signInWithProvider(provider)`.
- Existe el contrato `OAuthProvider`.
- Existe `googleProvider`, pero su login real aún no está terminado.

## Sign out

`signOut()` hace lo siguiente:

1. Limpia access token en memoria.
2. Elimina el refresh token de SecureStore.
3. Marca `isAuthenticated = false`.
4. La guarda de rutas redirige de nuevo al grupo público.

## Token expiration event

Para desacoplar la capa HTTP del árbol React, el proyecto usa un event emitter.

Flujo:

1. `httpClient` detecta que el refresh falló.
2. Limpia tokens.
3. Emite `Events.TokenExpired`.
4. `AuthProvider` escucha ese evento y ejecuta `signOut()`.

Esto evita que `httpClient` dependa directamente del contexto React.

## Reglas que debemos mantener

- `app/` no debe implementar lógica auth compleja fuera de la guarda.
- La verdad de la sesión vive en `AuthContext`.
- La persistencia de tokens vive en `tokenManager`.
- La reacción técnica ante `401` vive en `httpClient`.

## TODO y roadmap

- Reemplazar el dev login por login clásico.
- Completar proveedores OAuth reales.
- Evaluar si en el futuro conviene mostrar una pantalla de inicialización en vez de devolver `null`.
- Evaluar si al hacer `signOut()` se debe limpiar también el cache de TanStack Query.
