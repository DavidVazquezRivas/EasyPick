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

## Gateways

Reglas:

1. Un gateway por dominio.
2. Sin dependencias de React/UI.
3. Devuelven datos tipados listos para hooks.

## Query layer

Reglas:

1. Keys centralizadas en core/query/QueryKeys.
2. Pantallas consumen hooks, no axios ni gateways.
3. Retry policy vive en AppProvider (no en pantallas).

## Nuevo dominio

1. Modelos -> core/api/{domain}/models
2. Gateway -> core/api/{domain}
3. Export facade -> core/api/index
4. Query keys -> core/query/QueryKeys
5. Hooks -> core/query/{domain}
6. UI -> modules/{domain}

## Estado actual

- Garments es el modulo de referencia.
- mutations.ts aun es placeholder.
- API_BASE_URL sigue hardcodeado con TODO a env.
