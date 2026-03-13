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
    /** GET /garments/me — authenticated user's garments */
    me: ['garments', 'me'] as const,
  },
} as const
