# Frontend Guide

Este directorio documenta cómo está construido el frontend de EasyPick Mobile hoy y cómo extenderlo sin romper los límites entre capas.

## Qué leer primero

1. [01-quickstart.md](d:/Workspace/EasyPick/mobile/docs/01-quickstart.md): instalación, arranque y contexto mínimo para levantar el proyecto.
2. [03-architecture.md](d:/Workspace/EasyPick/mobile/docs/03-architecture.md): visión general de capas, estructura y reglas de importación.
3. [04-auth-routing.md](d:/Workspace/EasyPick/mobile/docs/04-auth-routing.md): guardas de rutas, contexto de autenticación y flujo de tokens.
4. [05-data-layer.md](d:/Workspace/EasyPick/mobile/docs/05-data-layer.md): llamadas HTTP, gateways, TanStack Query y patrón para nuevos dominios.
5. [06-ui-system.md](d:/Workspace/EasyPick/mobile/docs/06-ui-system.md): tokens visuales, NativeWind, componentes compartidos y límites actuales.
6. [07-conventions.md](d:/Workspace/EasyPick/mobile/docs/07-conventions.md): naming, imports, comentarios y checklist de cambios frontend.

## Mapa rápido

- `src/app/`: rutas Expo Router. Deben ser finas y delegar la lógica en módulos o en `core/`.
- `src/core/`: infraestructura global. Aquí viven auth, client HTTP, query hooks compartidos y providers.
- `src/modules/`: pantallas y UI por dominio.
- `src/shared/`: componentes UI reutilizables, constantes y utilidades puras.

## Estado actual del frontend

- El acceso autenticado se resuelve desde un refresh token persistido en SecureStore.
- El access token no se restaura al arrancar la app; el primer `401` es esperado y dispara el refresh.
- La navegación está separada en grupos `(public)` y `(private)` dentro de Expo Router.
- La UI usa NativeWind + Tailwind + CSS variables semánticas en `src/core/theme/global.css`.
- La capa de datos usa `axios` con interceptores y `@tanstack/react-query` para consultas.

## Cómo mantener esta guía

- Si cambias una regla de arquitectura, actualiza primero `03-architecture.md` y el documento temático afectado.
- Si agregas un nuevo patrón de UI o un nuevo gateway, documenta el ejemplo real en el archivo correspondiente.
- Si un documento describe intención futura, márcalo como `TODO` o `Roadmap`; no mezclarlo con comportamiento ya implementado.