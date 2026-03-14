# Quickstart

Esta guía cubre el arranque mínimo del proyecto. Para entender cómo se organiza el frontend, continúa después con [02-frontend-guide.md](d:/Workspace/EasyPick/mobile/docs/02-frontend-guide.md) y [03-architecture.md](d:/Workspace/EasyPick/mobile/docs/03-architecture.md).

## Stack actual

Versiones relevantes del proyecto según `package.json`:

- `expo`: `~54.0.33`
- `react`: `19.1.0`
- `react-native`: `0.81.5`
- `expo-router`: `~6.0.23`
- `@tanstack/react-query`: `^5.90.21`
- `nativewind`: `^4.2.2`

## Instalación

Desde la raíz del proyecto:

```bash
npm install
```

No hace falta instalar `expo-status-bar` por separado: ya está declarada en `package.json`.

## Arranque en desarrollo

Servidor Expo:

```bash
npm run start
```

Atajos disponibles:

```bash
npm run android
npm run ios
npm run web
```

## Requisitos prácticos para desarrollar

- El backend debe estar accesible desde la URL definida en `src/shared/constants/ApiRoutes.ts`.
- El login actual usa un `DEV_REFRESH_TOKEN` temporal en `src/app/(public)/login.tsx`.
- El flujo de auth real hoy depende de SecureStore para persistir el refresh token.

## Primer arranque esperado

El comportamiento actual de autenticación es intencional:

1. La app arranca y revisa si existe refresh token en SecureStore.
2. Si existe, marca la sesión como autenticada.
3. El access token todavía no está en memoria.
4. La primera petición protegida puede devolver `401`.
5. `httpClient` hace refresh, obtiene nuevos tokens y reintenta la petición original.

Ese primer `401` no es un bug; forma parte del flujo actual documentado.

## Siguientes lecturas recomendadas

1. [03-architecture.md](d:/Workspace/EasyPick/mobile/docs/03-architecture.md)
2. [04-auth-routing.md](d:/Workspace/EasyPick/mobile/docs/04-auth-routing.md)
3. [05-data-layer.md](d:/Workspace/EasyPick/mobile/docs/05-data-layer.md)