# Architecture

## Folder structure

```txt
src/
  app/        - Expo Router routes only (thin wrappers that render module pages)
  core/       - Global infrastructure (API, auth, query, providers)
  modules/    - UI/domain pages and components per module
  shared/     - Cross-cutting constants and utilities
```

Rule: `app/` must stay thin. Modules should consume APIs and query hooks from `core/`.

## API architecture

```txt
core/api/
  global/
    ApiResponse.ts
    httpClient.ts
    tokenManager.ts
  garment/
    GarmentGateway.ts
    models/
      Garment.ts
  index.ts
```

### Responsibilities

- `core/api/global/ApiResponse.ts`: standard API envelope type.
- `core/api/global/httpClient.ts`: Axios instance + interceptors + refresh flow.
- `core/api/global/tokenManager.ts`: access token in memory + refresh token in SecureStore.
- `core/api/garment/GarmentGateway.ts`: garment endpoints only, typed against garment models.
- `core/api/index.ts`: public facade used by the rest of the app.

### Standard response model

All endpoints return this envelope (nullable `data`, `message`, `path`):

```ts
interface ApiResponse<T> {
  data: T | null
  success: boolean
  timestamp: string
  message: { code: number; message: string } | null
  path: string | null
}
```

## Query architecture (TanStack Query)

```txt
core/query/
  QueryKeys.ts
  garment/
    queries.ts
    mutations.ts
    index.ts
```

### Why in core?

Query keys, retries, invalidation strategy, hydration and query options are infrastructure concerns.
Keeping them in `core/query` ensures module pages only consume ready-made hooks.

### Usage rule

Module pages do this:

```ts
import { useGetMyGarments } from '@/core/query/garment'
```

They must not define `queryKey`, `queryFn`, retries or invalidation logic locally.

### Queries and mutations

- Queries live in `core/query/{domain}/queries.ts`.
- Mutations live in `core/query/{domain}/mutations.ts`.
- Each exported hook should already include the right key strategy and invalidations.

## Naming conventions

- Gateways: `PascalCase` object names, e.g. `GarmentGateway`.
- Query hooks: `useGetX`, `useCreateX`, `useUpdateX`, `useDeleteX`.
- Query keys: centralized in `core/query/QueryKeys.ts`.
- English only for code identifiers, comments and literals.

## Auth flow summary

1. `AuthContext` checks SecureStore refresh token on app start.
2. First protected request can 401.
3. `httpClient` refreshes tokens via `/auth/refresh` (single-flight).
4. Original request is retried with new access token.
5. If refresh fails, tokens are cleared and `TokenExpired` is emitted.
