# Data Layer

Esta guía documenta cómo sale una llamada desde la UI hasta el backend y qué reglas seguimos para añadir nuevos endpoints.

## Flujo estándar de una llamada

El recorrido actual es este:

```txt
Screen in modules/
  -> hook en core/query/
    -> apiClient en core/api/index.ts
      -> gateway del dominio
        -> httpClient
          -> backend
```

Ejemplo real actual:

```txt
HomeScreen
  -> useGetMyGarments()
    -> getMyGarmentsQueryOptions()
      -> apiClient.garment.getMyGarments
        -> GarmentGateway.getMyGarments()
          -> httpClient.get(ApiRoutes.Garments.GetAll)
```

## `httpClient`

`src/core/api/global/httpClient.ts` es el único cliente HTTP compartido.

Responsabilidades actuales:

- definir `baseURL`
- inyectar `Authorization` si existe access token en memoria
- interceptar `401`
- refrescar tokens una sola vez aunque lleguen varios `401` simultáneos
- reintentar la petición original después del refresh
- emitir `TokenExpired` si el refresh falla

### Single-flight refresh

El refresco de tokens usa la variable `refreshInFlight`.

Objetivo:

- evitar múltiples llamadas paralelas a `/auth/refresh`
- hacer que varios requests esperen la misma promesa de refresh

## Envelope de la API

La app asume un envelope común definido en `src/core/api/global/ApiResponse.ts`:

```ts
interface ApiResponse<T> {
  data: T | null
  success: boolean
  timestamp: string
  message: { code: number; message: string } | null
  path: string | null
}
```

Los gateways son responsables de transformar ese envelope a algo cómodo para la UI.

## Gateways por dominio

Cada dominio expone un gateway propio en `core/api/{domain}/`.

Ejemplo actual:

- `GarmentGateway.getMyGarments()` hace la llamada HTTP y devuelve `Garment[]`.

Reglas:

- Un gateway agrupa endpoints del mismo dominio.
- Un gateway no conoce nada de React ni de la UI.
- Un gateway no maneja cache ni invalidaciones de TanStack Query.
- Un gateway devuelve datos tipados y listos para consumo.

## `apiClient` como facade pública

`src/core/api/index.ts` es el punto de entrada que consumen los hooks de query.

Regla:

- El resto de la app importa desde `@/core/api`.
- No se debe importar `httpClient` directamente desde pantallas ni módulos.

## Query layer

TanStack Query vive en `src/core/query/`.

### Qué hay hoy

- `QueryKeys.ts`: registro centralizado de keys.
- `garment/queries.ts`: query options y hook `useGetMyGarments()`.
- `garment/mutations.ts`: placeholder para mutations futuras.
- `AppProvider.tsx`: configuración global de `QueryClient`.

### Regla de uso

Las pantallas consumen hooks listos:

```ts
const { data, isLoading, isError, error } = useGetMyGarments()
```

No deben definir localmente:

- `queryKey`
- `queryFn`
- política de `retry`
- invalidaciones base

## Retry policy global

`AppProvider.tsx` configura el `QueryClient` para:

- no reintentar errores `401`
- reintentar hasta 2 veces el resto de errores

Esto evita multiplicar el flujo `401 -> refresh -> retry`.

## Cómo añadir un nuevo dominio

Supongamos un dominio `orders`.

### Paso 1

Crear modelos en `src/core/api/orders/models/` si el backend devuelve entidades nuevas.

### Paso 2

Crear `src/core/api/orders/OrdersGateway.ts`.

### Paso 3

Exportar el gateway desde `src/core/api/orders/index.ts` y añadirlo a `src/core/api/index.ts`.

### Paso 4

Crear las keys en `src/core/query/QueryKeys.ts`.

### Paso 5

Crear `src/core/query/orders/queries.ts` y, cuando aplique, `mutations.ts`.

### Paso 6

Consumir esos hooks desde `src/modules/orders/`.

## Reglas de diseño para nuevas queries y mutations

- Todas las keys viven en `QueryKeys.ts`.
- Todas las queries de un dominio viven juntas.
- Las `queryOptions()` deben estar encapsuladas para reutilizarse o prefetchearse en el futuro.
- Las invalidaciones deben apoyarse en keys centralizadas.

## Estado actual y huecos conocidos

- Solo garments tiene query hook implementado.
- `mutations.ts` todavía está vacío.
- No hay todavía una política formal de invalidación por dominio.
- No existe todavía un formateador central de errores de API para la UI.
- `API_BASE_URL` sigue hardcodeada y tiene un `TODO` para moverla a `.env`.

## Qué no hacer

- No hacer llamadas `axios` desde una pantalla.
- No definir strings mágicos para query keys.
- No mezclar parsing de respuesta de backend dentro de componentes React.
- No disparar refresh manual desde la UI si ya puede resolverlo `httpClient`.
