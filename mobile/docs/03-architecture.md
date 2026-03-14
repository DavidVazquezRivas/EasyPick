# Frontend Architecture

Esta guía describe la arquitectura actual del frontend y sirve como referencia para mantener consistencia al añadir nuevas features.

## Capas del proyecto

```txt
src/
  app/        rutas Expo Router
  core/       infraestructura global
  modules/    pantallas y UI por dominio
  shared/     piezas reutilizables transversales
```

## Responsabilidad de cada capa

### `src/app/`

Contiene únicamente rutas de Expo Router y composición mínima para navegar.

Regla:

- Los archivos de `app/` no deben contener lógica de negocio ni llamadas API directas.
- Su trabajo es resolver la ruta y delegar en una pantalla o módulo.

Ejemplo actual:

- `src/app/_layout.tsx` monta `AppProvider`, consulta `useAuth()` y aplica la guarda entre grupos `(public)` y `(private)`.
- `src/app/(private)/home/index.tsx` reexporta la pantalla real del módulo garments.

### `src/core/`

Contiene infraestructura compartida entre dominios:

- `core/api/`: cliente HTTP, gateways, models y facade pública.
- `core/auth/`: contexto de autenticación, modelos y proveedores OAuth.
- `core/query/`: query keys, query hooks y mutations compartidas.
- `core/providers/`: composición de providers globales.
- `core/theme/`: tokens de diseño y base CSS para NativeWind.

Regla:

- `core/` no debe contener UI de dominio.
- `core/` sí puede ser consumido por `modules/` y por `app/`.

### `src/modules/`

Aquí vive la UI del dominio. En el estado actual, el módulo `garments` contiene la pantalla [HomeScreen.tsx](d:/Workspace/EasyPick/mobile/src/modules/garments/pages/HomeScreen.tsx).

Regla:

- Las pantallas del módulo consumen hooks listos desde `core/query/` y utilidades desde `shared/`.
- No importan `httpClient` ni SecureStore directamente.

### `src/shared/`

Contiene piezas reutilizables y neutrales al dominio:

- `shared/components/ui/`: componentes base reutilizables.
- `shared/constants/`: rutas, eventos, claves de SecureStore, endpoints.
- `shared/utils/`: helpers puros como `cn()` y el event emitter.

Regla:

- `shared/` no debe depender de módulos de dominio.

## Regla principal de imports

El flujo permitido es el siguiente:

```txt
app/ -> modules/ o core/
modules/ -> core/ y shared/
core/ -> shared/
shared/ -> sin dependencias de dominio
```

Evitar:

- pantallas importando `httpClient` directamente
- rutas Expo Router con lógica de negocio embebida
- componentes de `shared/` dependiendo de `modules/`

## Mapa del frontend actual

```txt
RootLayout
  -> AppProvider
    -> QueryClientProvider
    -> AuthProvider
      -> InitialLayout
        -> Slot
          -> (public)/login
          -> (private)/home/index -> modules/garments/pages/HomeScreen
```

## API y query como infraestructura

La capa de datos está en `core/` porque sus decisiones afectan a toda la app:

- interceptores HTTP
- refresh de tokens
- retries de TanStack Query
- query keys centralizadas
- invalidación y cache futura

Por eso la regla es:

- Las pantallas consumen hooks de `core/query/`.
- Los hooks consumen `apiClient`.
- `apiClient` expone gateways por dominio.
- Los gateways usan `httpClient`.

## Estado actual que debemos respetar

- El refresh token persiste en SecureStore.
- El access token vive solo en memoria.
- Al arrancar la app no se hace refresh preventivo.
- El primer `401` tras abrir la app es parte del flujo esperado.
- OAuth todavía no está implementado y existe un dev login temporal.

## Cómo añadir una nueva feature

Tomando garments como patrón actual:

1. Crear el modelo API en `core/api/{domain}/models/` si hace falta.
2. Crear el gateway en `core/api/{domain}/{Domain}Gateway.ts`.
3. Exportarlo en `core/api/index.ts`.
4. Añadir `QueryKeys` en `core/query/QueryKeys.ts`.
5. Crear `queries.ts` y, si aplica, `mutations.ts` en `core/query/{domain}/`.
6. Crear la pantalla y componentes del dominio en `modules/{domain}/`.
7. Exponer la ruta desde `app/` con un wrapper fino.

## Roadmap ya conocido

- Sustituir el dev login actual por login clásico.
- Completar proveedores OAuth.
- Formalizar más piezas de UI compartidas para loading, error y empty states.

Lee [04-auth-routing.md](d:/Workspace/EasyPick/mobile/docs/04-auth-routing.md), [05-data-layer.md](d:/Workspace/EasyPick/mobile/docs/05-data-layer.md) y [06-ui-system.md](d:/Workspace/EasyPick/mobile/docs/06-ui-system.md) para el detalle operativo de cada capa.
