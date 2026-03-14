# UI System

Esta guía explica el sistema visual actual del frontend. Documenta el estado real del proyecto y también deja visibles los huecos que todavía no están estandarizados.

## Stack visual

La UI actual se apoya en:

- `nativewind`
- `tailwindcss`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`

La combinación se usa así:

- `global.css` define tokens semánticos como CSS variables.
- `tailwind.config.ts` expone esos tokens al sistema de clases.
- `cva()` define variantes para componentes reutilizables.
- `cn()` compone clases y resuelve conflictos.

## Tokens visuales actuales

Los tokens viven en `src/core/theme/global.css`.

### Tema claro actual

- `background`: beige cálido
- `foreground`: marrón oscuro
- `card`: blanco
- `primary`: marrón principal
- `secondary`: beige suave
- `accent`: marrón desaturado
- `muted`: tonos intermedios de beige
- `destructive`: rojo
- `border`: borde semitransparente derivado del primary
- `ring`: color de foco

### Tema oscuro

Existe una variante `.dark` ya definida a nivel de tokens.

Importante:

- El proyecto hoy está orientado a `light` en la configuración general.
- Hay clases `dark:` en los componentes base, pero el modo oscuro no está todavía activado como experiencia cerrada.

## Componentes base compartidos

Los componentes comunes viven en `src/shared/components/ui/`.

### Button

Archivo: `button.tsx`

Características:

- Basado en `Pressable`.
- Variantes: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`.
- Tamaños: `default`, `sm`, `lg`, `icon`.
- Usa `TextClassContext` para aplicar automáticamente el estilo del texto interno.
- Resuelve diferencias `web` y `native` con `Platform.select()`.

Regla:

- Si el uso encaja con un botón estándar, reutilizar `Button` antes que crear un `Pressable` ad hoc.

### Card

Archivo: `card.tsx`

Características:

- Contenedor base para bloques de contenido.
- Subcomponentes: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
- También inyecta `TextClassContext` para heredar color correcto dentro de la card.

### Text

Archivo: `text.tsx`

Características:

- Define variantes tipográficas: `h1`, `h2`, `h3`, `h4`, `p`, `blockquote`, `code`, `lead`, `large`, `small`, `muted`.
- Añade roles semánticos en web para headings.
- Permite `asChild`.

Regla:

- Para texto con intención tipográfica clara, usar `Text` con variante antes que clases sueltas sobre `RNText`.

### Input

Archivo: `input.tsx`

Características:

- Basado en `TextInput`.
- Incluye estados visuales de foco y error para web.
- Gestiona diferencias entre placeholder web y native.

## Utilidad `cn()`

`src/shared/utils/tailwind.utils.ts` exporta `cn()`.

Regla:

- Usar `cn()` para componer clases dinámicas y evitar duplicados/conflictos de Tailwind.

## Patrón de estilo actual en pantallas

Las pantallas actuales usan:

- `View`, `ScrollView`, `ActivityIndicator` de React Native
- clases NativeWind para layout
- componentes de `shared/components/ui` para composición base

Ejemplo actual:

- `HomeScreen.tsx` usa `Text`, `Card` y `Button` para estructurar la vista.
- `login.tsx` reutiliza `Card`, `Text` y `Button` para el flujo de entrada.

## Diferencias web vs native

Los componentes base ya contemplan diferencias de plataforma:

- `hover`, `focus-visible` y `aria-*` en web
- placeholders simplificados y estados `active` en native
- roles semánticos adicionales para headings en web

Regla:

- Si un componente compartido necesita comportamiento distinto por plataforma, resolverlo dentro del propio componente antes que duplicar UI en las pantallas.

## Límites actuales del sistema visual

Esto todavía no está formalizado como design system cerrado:

- no hay escala documentada de spacing
- no hay escala documentada de radius
- no hay sistema de elevation/shadow definido
- no hay componentes compartidos para loading, empty state o error state
- no hay guía cerrada de formularios todavía

## TODOs reconocidos

- Definir escalas de spacing, radius y shadow cuando el diseño esté más estable.
- Extraer componentes compartidos para estados de carga, vacío y error.
- Definir patrón para componentes de dominio encima de los componentes base.
- Decidir si el dark mode será parte del producto o solo capacidad técnica latente.

## Qué mantener mientras tanto

- Reutilizar componentes base antes de crear variantes locales.
- Mantener los colores semánticos en lugar de hexadecimales dispersos.
- Preferir clases de layout simples y composición de bloques con `Card`, `Text` y `Button`.
- Si se añade un nuevo patrón visual repetido, moverlo a `shared/components/ui` o documentar por qué sigue local al módulo.
