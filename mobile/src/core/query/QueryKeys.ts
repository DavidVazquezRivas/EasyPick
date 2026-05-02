/**
 * Centralized TanStack Query key registry.
 *
 * All query keys must be defined here so they can be referenced consistently
 * across hooks, manual invalidations (queryClient.invalidateQueries),
 * and cache prefetching — without magic strings scattered across the codebase.
 *
 * Convention:
 *   QueryKeys.{module}.{endpoint}
 *
 * Each leaf value is a `readonly` tuple for type-safe key comparison.
 */
export const QueryKeys = {
  garments: {
    /** All garments queries — use to invalidate the entire module's cache */
    all: ['garments'] as const,
    /** GET /garments — list of garments */
    list: ['garments', 'list'] as const,
    /** GET /garments/<id> — detail of a specific garment */
    detail: (id: string) => ['garments', 'detail', id] as const,
    configs: ['garments', 'configs'] as const,
  },
  colors: {
    /** All colors queries */
    all: ['colors'] as const,
    /** GET /colors — list of colors */
    list: ['colors', 'list'] as const,
  },
  styles: {
    /** All styles queries */
    all: ['styles'] as const,
    /** GET /styles — list of styles */
    list: ['styles', 'list'] as const,
  },
  categories: {
    /** All categories queries */
    all: ['categories'] as const,
    /** GET /categories — list of categories */
    list: ['categories', 'list'] as const,
  },
} as const
