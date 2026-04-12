# Quickstart

Esta guia cubre el arranque minimo del proyecto. Para entender como se organiza el frontend, continua despues con [02-frontend-guide.md](d:/Workspace/EasyPick/mobile/docs/02-frontend-guide.md) y [03-architecture.md](d:/Workspace/EasyPick/mobile/docs/03-architecture.md).

## Stack actual

Versiones relevantes segun package.json:

- expo: ~54.0.33
- react: 19.1.0
- react-native: 0.81.5
- expo-router: ~6.0.23
- @tanstack/react-query: ^5.90.21
- nativewind: ^4.2.2

## Instalacion

```bash
npm install
```

## Arranque en desarrollo

```bash
npx expo start
```

## Requisitos practicos

- Backend accesible desde src/shared/constants/ApiRoutes.ts.
- Login actual usa DEV_REFRESH_TOKEN temporal.
- Auth depende de refresh token en SecureStore.

## Primer arranque esperado

1. App revisa refresh token en SecureStore.
2. Si existe, marca sesion autenticada.
3. Access token aun no esta en memoria.
4. Primera request privada puede devolver 401.
5. httpClient hace refresh y reintenta.

## Siguientes lecturas

1. [03-architecture.md](d:/Workspace/EasyPick/mobile/docs/03-architecture.md)
2. [04-auth-routing.md](d:/Workspace/EasyPick/mobile/docs/04-auth-routing.md)
3. [05-data-layer.md](d:/Workspace/EasyPick/mobile/docs/05-data-layer.md)
4. [08-i18n.md](d:/Workspace/EasyPick/mobile/docs/08-i18n.md)
