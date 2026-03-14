# Frontend Architecture

Resumen operativo de arquitectura para desarrollo diario.

## Capas

```txt
src/
  app/
  core/
  modules/
  shared/
```

## Responsabilidades

1. src/app: rutas Expo Router y guards.
2. src/modules: pantallas y componentes de dominio.
3. src/core: infraestructura transversal (api, auth, query, providers, i18n).
4. src/shared: utilidades, constantes y componentes base reutilizables.

## Flujo de imports permitido

```txt
app -> modules o core
modules -> core y shared
core -> shared
shared -> sin dependencias de dominio
```

Evitar:

- pantallas importando httpClient directo
- logica de negocio en archivos de app
- shared importando modules

## Patron obligatorio de datos

1. Pantalla -> hook query.
2. Hook -> apiClient.
3. apiClient -> gateway.
4. gateway -> httpClient.

## Como anadir una feature

1. Crear modelos API en core/api/{domain}/models.
2. Crear gateway de dominio.
3. Exportar en core/api/index.
4. Crear keys en core/query/QueryKeys.
5. Crear queries/mutations en core/query/{domain}.
6. Crear UI en modules/{domain}.
7. Exponer ruta fina desde app.

Ver detalle por tema en [04-auth-routing.md](d:/Workspace/EasyPick/mobile/docs/04-auth-routing.md), [05-data-layer.md](d:/Workspace/EasyPick/mobile/docs/05-data-layer.md), [06-ui-system.md](d:/Workspace/EasyPick/mobile/docs/06-ui-system.md) y [08-i18n.md](d:/Workspace/EasyPick/mobile/docs/08-i18n.md).
