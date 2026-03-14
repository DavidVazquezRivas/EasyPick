# Frontend Guide

Guia corta para trabajar en frontend sin romper arquitectura.

## Orden de lectura

1. [01-quickstart.md](d:/Workspace/EasyPick/mobile/docs/01-quickstart.md)
2. [03-architecture.md](d:/Workspace/EasyPick/mobile/docs/03-architecture.md)
3. [04-auth-routing.md](d:/Workspace/EasyPick/mobile/docs/04-auth-routing.md)
4. [05-data-layer.md](d:/Workspace/EasyPick/mobile/docs/05-data-layer.md)
5. [06-ui-system.md](d:/Workspace/EasyPick/mobile/docs/06-ui-system.md)
6. [07-conventions.md](d:/Workspace/EasyPick/mobile/docs/07-conventions.md)
7. [08-i18n.md](d:/Workspace/EasyPick/mobile/docs/08-i18n.md)

## Reglas de oro

1. app solo enruta.
2. modules pinta UI de negocio.
3. core resuelve infraestructura (api, auth, query, i18n).
4. shared contiene piezas reutilizables sin logica de dominio.

## Estado actual

- Auth por refresh token persistido en SecureStore.
- Primer 401 esperado al iniciar app y refresh automatico.
- Router separado en grupos (public) y (private).
- UI con NativeWind + Tailwind + tokens semanticos.
- Data layer con axios + TanStack Query.
- i18n activo para es/en con deteccion por dispositivo.
