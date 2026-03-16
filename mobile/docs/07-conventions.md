# Frontend Conventions

Checklist corto de convenciones para PRs frontend.

## Naming

- Componentes: PascalCase
- Funciones/variables: camelCase
- Constantes primitivas: UPPER_SNAKE_CASE
- Objetos constantes: PascalCase
- Hooks: useXxx

## Imports por capa

- app -> modules/core/shared
- modules -> core/shared
- core -> shared
- shared -> sin dependencias de dominio

## Reglas de datos

1. Keys de query solo en core/query/QueryKeys.
2. Pantallas no llaman axios directo.
3. Gateways sin logica de UI.

## Reglas de UI

1. Reutilizar shared/components/ui.
2. Usar Text y Button base cuando aplique.
3. Usar cn() en composicion dinamica.

## Reglas de auth

1. Fuente de verdad: AuthContext.
2. Persistencia token: tokenManager.
3. Manejo tecnico de 401: httpClient.

## Checklist PR

1. Ruta en app sigue siendo fina.
2. Pantalla usa hooks de core/query.
3. Query keys nuevas estan centralizadas.
4. Componente repetido se extrae a shared.
5. Si cambia una regla, se actualiza docs.
