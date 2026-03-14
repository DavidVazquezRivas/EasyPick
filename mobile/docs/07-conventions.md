# Frontend Conventions

Estas convenciones consolidan lo que el proyecto ya hace y fijan reglas mínimas para seguir creciendo sin introducir deuda evitable.

## Idioma de código

- Identificadores, comentarios y literales técnicos en código: inglés.
- Documentación de `docs/`: español.

## Naming

### Archivos

- Componentes React: `PascalCase.tsx`
- Pantallas de Expo Router: `index.tsx` o nombre de segmento de ruta
- Gateways: `PascalCase.ts`
- Utilidades: `camelCase.ts`
- Constantes agrupadas: `PascalCase.ts`

### Símbolos

- Componentes: `PascalCase`
- Funciones y variables: `camelCase`
- Objetos constantes: `PascalCase`
- Constantes primitivas: `UPPER_SNAKE_CASE`
- Hooks: `useXxx`

Ejemplos reales:

- `GarmentGateway`
- `useGetMyGarments`
- `QueryKeys`
- `DEV_REFRESH_TOKEN`

## Convenciones de imports por capa

- `app/` puede importar de `modules/`, `core/` y `shared/`.
- `modules/` puede importar de `core/` y `shared/`.
- `core/` puede importar de `shared/`.
- `shared/` no debe importar de dominios ni de `app/`.

Evitar especialmente:

- `modules/` importando `httpClient`
- `shared/` importando elementos de `modules/`
- rutas con lógica de fetch inline

## Convenciones para la capa de datos

- Todas las query keys viven en `core/query/QueryKeys.ts`.
- Las pantallas consumen hooks, no gateways ni `axios`.
- Los gateways devuelven datos tipados y simplificados.
- Los detalles de refresh y retry viven en infraestructura, no en la UI.

## Convenciones para la UI

- Reutilizar primero componentes en `shared/components/ui/`.
- Usar `Text` para variantes tipográficas y `Button` para acciones estándar.
- Usar `cn()` si hay composición dinámica de clases.
- Evitar hexadecimales inline salvo casos muy puntuales heredados del estado actual.

## Convenciones para auth

- La verdad de la sesión vive en `AuthContext`.
- La persistencia de refresh token vive en `tokenManager`.
- Un `401` inicial después de arrancar la app es comportamiento esperado hoy.
- Si el refresh falla, el cierre de sesión debe originarse desde el evento `TokenExpired`.

## Convenciones de comentarios

- Comentarios breves y solo cuando aporten contexto no obvio.
- Evitar comentarios que solo repiten la línea de código.
- Si un comportamiento es temporal, dejar `TODO` explícito con causa concreta.

Ejemplo aceptable:

```ts
// TODO: Remove once Google OAuth is implemented
```

## Checklist para cambios frontend

Antes de cerrar una feature, revisar:

1. La ruta en `app/` sigue siendo fina y delega correctamente.
2. La pantalla usa hooks desde `core/query/` y no clientes HTTP directos.
3. Las query keys nuevas quedaron centralizadas.
4. Los componentes repetibles se movieron a `shared/components/ui/` si ya son genéricos.
5. Si cambió una regla arquitectónica, también cambió esta documentación.

## Casos donde conviene abrir discusión

- Cuando una feature necesita saltarse un límite entre capas.
- Cuando aparezca un nuevo patrón visual repetido y no esté claro si debe ser shared o local al módulo.
- Cuando una mutation requiera una política de invalidación no cubierta todavía.
- Cuando el login clásico u OAuth cambien el flujo de auth descrito en esta guía.
