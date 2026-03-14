# UI System

Resumen del sistema UI para uso diario del equipo.

## Stack

- nativewind
- tailwindcss
- class-variance-authority
- clsx
- tailwind-merge

## Tokens

Tokens semanticos en src/core/theme/global.css y mapeo en tailwind.config.ts.

- Tema claro activo en producto.
- Tema oscuro definido a nivel tecnico, no completado como experiencia.

## Componentes base

Ubicacion: src/shared/components/ui

1. Button: variantes y tamanos estandar.
2. Card: layout base por secciones.
3. Text: variantes tipograficas.
4. Input: estados base de formulario.

Regla: reutilizar estos componentes antes de crear componentes ad hoc.

## Reglas practicas

1. Usar cn() para clases dinamicas.
2. Resolver diferencias web/native dentro del componente compartido.
3. Evitar hex inline salvo casos heredados.

## Limites actuales

- Sin escala cerrada de spacing/radius/shadow.
- Sin componentes globales para empty/loading/error.
- Dark mode aun no productizado.
