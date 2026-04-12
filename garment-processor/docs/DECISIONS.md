# Marco de Decisiones

## Que priorizamos

1. Separacion util antes que etiqueta perfecta
- Si el recorte es malo, ninguna clasificacion lo salva.

2. Separador unico en runtime
- El endpoint usa Grounding DINO como separador oficial.
- No hay fallback a YOLO.

3. Estabilidad externa antes que cambios internos
- El contrato de salida no se negocia por experimentar modelos.

## Como decidimos cambios

1. Definir que dolor resolvemos
- Falta de prendas, latencia o ruido.

2. Elegir una hipotesis concreta
- Ejemplo: ajustar umbrales DINO o garment filter.

3. Medir con el mismo set
- Nunca comparar con imagenes distintas.

4. Evaluar impacto total
- No vale mejorar un caso y romper otros dos.

5. Aplicar o revertir rapido
- Si no hay mejora clara, rollback sin drama.

## Reglas para evitar autoenganarnos

1. No ajustar 5 parametros juntos.
2. No sacar conclusiones con una sola imagen.
3. No promocionar un experimento sin benchmark reproducible.
4. No mezclar codigo experimental con ruta principal sin aislamiento.

## Estado actual de arquitectura

1. Runtime del endpoint
- Grounding DINO -> garment filter -> rembg -> CLIP.

2. Contrato externo
- Se mantiene estable: no cambia schema de respuesta por cambiar backend interno.

## Criterio de aceptacion operativo

Un cambio entra solo si cumple todo esto:
- mantiene o mejora recall en las imagenes de referencia
- no dispara tiempos de forma descontrolada
- no aumenta fallos 422 en escenario normal
- se puede explicar en 3 lineas de por que se hizo
