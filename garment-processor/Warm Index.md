# Algoritmo de Cálculo: Warm Index

El cálculo del *Warm Index* (Índice de Calidez) determina el nivel térmico de una prenda en una escala del 1 (ropa muy fresca/veraniega) al 10 (ropa muy abrigada/invernal). 

## 1. Fórmula Principal

El algoritmo se basa en una suma ponderada de los atributos físicos principales (Material y Categoría) y el contexto previsto (Temporada). A este valor base se le suma un modificador constante derivado del Color.

WI = (0.45 * Mat) + (0.45 * Cat) + (0.10 * Sea) + Mod_col

Donde:
* **WI**: Warm Index resultante.
* **Mat**: Índice de calidez del Material.
* **Cat**: Índice de calidez de la Categoría.
* **Sea**: Índice de calidez de la Temporada.
* **Mod_col**: Modificador térmico por absorción/reflexión de luz del Color.

---

## 2. Diccionarios de Valores

### 2.1 Materiales (Peso: 45%)
Evalúa la transpirabilidad y retención térmica del tejido.

| ID Material (`DEFAULT_MATERIAL_LABELS`) | Valor (Mat) | 
| :--- | :--- |
| `linen` (Lino) | 1 |
| `silk` (Seda) | 2 |
| `cotton` (Algodón) | 4 |
| `polyester` (Poliéster) | 5 |
| `denim` (Vaquero) | 6 |
| `leather` (Cuero) | 7 |
| `knit` (Punto) | 7 |
| `wool` (Lana) | 9 |
| `fleece` (Forro polar) | 10 |

### 2.2 Categorías (Peso: 45%)
Evalúa la cobertura corporal y el propósito general de la prenda.

| Categoría | Valor (Cat) |
| :--- | :--- |
| Ropa de baño | 1 |
| Tops, Shorts | 2 |
| Faldas, Polos, Blusas | 3 |
| Camisas, Vestidos | 4 |
| Vaqueros, Leggings | 5 |
| Deporte, Accesorios, Ropa interior, Pijamas | 5 (Neutro) |
| Trajes | 6 |
| Sudaderas, Chándales, Jerséis | 8 |
| Abrigos | 10 |

### 2.3 Temporadas (Peso: 10%)
Metadato de apoyo que ajusta la intención de diseño de la prenda.

| ID Temporada (`DEFAULT_SEASON_LABELS`) | Valor (Sea) |
| :--- | :--- |
| `summer` | 1 |
| `spring` | 4 |
| `autumn` | 7 |
| `winter` | 10 |

### 2.4 Modificadores de Color
Basado en la albedo (reflexión de la radiación solar).

| Grupo de Color | Modificador (Mod_col) | Colores Mapeados (`colors`) |
| :--- | :--- | :--- |
| **Claros** | -0.2 | Blanco, Gris Claro, Azul Claro, Beige, Rosa Pastel, Amarillo |
| **Neutros / Vivos** | 0.0 | Turquesa, Rojo, Verde Esmeralda, Verde Oliva, Mostaza, Naranja, Caqui, Fucsia, Lila |
| **Oscuros** | +0.2 | Negro, Azul Denim, Gris Oscuro, Azul Marino, Burdeos/Vino, Marrón, Morado |

---

## 3. Reglas de Ejecución y Casos Borde

1. **Atributos Faltantes (Null Safety):** Si una prenda carece de Material, Temporada o Categoría asignada, el algoritmo debe inyectar un valor neutro constante (5) en la variable correspondiente de la ecuación para evitar errores de cálculo o sesgos extremos.
2. **Sin Color:** Si la prenda no tiene color asignado, Mod_col = 0.
3. **Límites (Clamping):** Al sumar el modificador de color, el resultado final puede exceder ligeramente los límites teóricos. El sistema debe asegurar que el índice resultante siempre se mantenga dentro del rango válido:
   * Si WI < 1, entonces WI = 1.
   * Si WI > 10, entonces WI = 10.
4. **Redondeo:** Es recomendable redondear el `WarmIndex` final a un máximo de dos decimales para optimizar el almacenamiento en la base de datos y facilitar la lógica condicional en el motor de sugerencias.