# Data Layer

Resumen de llamadas backend y reglas de extensibilidad.

## Flujo

```txt
Screen -> core/query hook -> apiClient -> gateway -> httpClient -> backend
```

## httpClient

Responsabilidades:

- inyectar Authorization
- interceptar 401
- refresh de tokens single-flight
- reintentar request original
- emitir TokenExpired si refresh falla
- mapear errores Axios a `ApiError` (con code preservado)

## Error Handling

### Validación de ApiResponse

**Regla fundamental**: Todo gateway DEBE validar `response.data.success === true` antes de retornar data.

Si `success === false`, lanzar `ApiError` con el código y mensaje:

```typescript
if (!response.data.success) {
  const code = response.data.message?.code ?? 0
  const message = response.data.message?.message ?? 'Request failed'
  throw new ApiError(code, message, response.data.path, response.data.timestamp)
}
```

Nunca retornar datos vacíos (ej: `[] ?? []`) que silencien errores.

### Error Boundary Global

`ErrorBoundary` envuelve `AppProvider` y captura errores de la aplicación:

- Renderiza modal con el error
- Mapea `ApiError.code` a i18n key: `common.api.errors.backendCodes.{code}`
- Mapea `AppError.translationKey` directamente a i18n key
- Muestra mensaje traducido al usuario
- Visible en contextos no-render via `showGlobalApiError()`

### Error Handling por Pantalla (Override)

Para control granular, usa `<QueryErrorDisplay error={error} onRetry={() => refetch()} />` en lugar de modal global:

```typescript
const { data, error, refetch } = useGetMyGarments()
return (
  <>
    <QueryErrorDisplay error={error} onRetry={() => refetch()} />
    {data && <MyList items={data} />}
  </>
)
```

### Códigos de Error Esperados

Los códigos numéricos del backend se mapean a i18n keys:

- `1000-1003`: Errores de garments
- `2000-2001`: Errores de autenticación

Agregar traducción en `src/core/i18n/resources/{locale}/common.ts`:

```typescript
api: {
  errors: {
    backendCodes: {
      1000: 'Garment not found',
      1001: 'Invalid garment data',
      // ...
    },
  },
},
```

## Gateways

Reglas:

1. Un gateway por dominio.
2. Sin dependencias de React/UI.
3. Devuelven datos tipados listos para hooks.
4. SIEMPRE validar `response.data.success` antes de retornar.
5. Lanzar `ApiError` si `success === false` (nunca datos vacíos).

## Query layer

Reglas:

1. Keys centralizadas en core/query/QueryKeys.
2. Pantallas consumen hooks, no axios ni gateways.
3. Retry policy vive en AppProvider (no en pantallas).
4. Errores fluyen a TanStack Query `error` state.
5. UI usa `QueryErrorDisplay` o error boundary global.

## Nuevo dominio

1. Modelos -> core/api/{domain}/models
2. Gateway -> core/api/{domain}
3. Export facade -> core/api/index
4. Query keys -> core/query/QueryKeys
5. Hooks -> core/query/{domain}
6. UI -> modules/{domain}
7. Validar `success` en gateway
8. Crear tests para casos success=false

## Estado actual

- Garments es el modulo de referencia.
- mutations.ts aun es placeholder.
- API_BASE_URL sigue hardcodeado con TODO a env.
- Error handling robusto implementado (ApiError, error boundary, QueryErrorDisplay).

## Upload de imagen (frontend)

Regla cliente para evitar rechazos por limite de servidor (15MB):

1. Camara y galeria usan el mismo pipeline antes de subir.
2. La imagen se optimiza (reescalado + compresion JPEG) en cliente.
3. Se valida tamano final con margen de seguridad (`14MB`) antes de hacer request.
4. Si sigue superando el limite, no se envia request y se muestra error traducido.

Objetivo: evitar intentos de upload inviables, mejorar UX y reducir carga innecesaria al backend.
