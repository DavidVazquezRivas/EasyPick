import { queryOptions, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/core/api'
import { QueryKeys } from '@/core/query/QueryKeys'

/**
 * Central query config for GET /garments/me.
 *
 * All TanStack config lives here so feature modules only consume the hook.
 * This keeps retry policy, cache keys, and queryFn hidden from screens.
 */
export const getMyGarmentsQueryOptions = () =>
  queryOptions({
    queryKey: QueryKeys.garments.me,
    queryFn: apiClient.garment.getMyGarments,
  })

export const useGetMyGarments = () => useQuery(getMyGarmentsQueryOptions())
