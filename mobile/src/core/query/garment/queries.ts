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
    queryKey: QueryKeys.garments.list,
    queryFn: apiClient.garment.getMyGarments,
  })

export const useGetMyGarments = () => useQuery(getMyGarmentsQueryOptions())

/**
 * Query options for GET /colors
 */
export const getColorsQueryOptions = () =>
  queryOptions({
    queryKey: QueryKeys.colors.list,
    queryFn: apiClient.garment.getColors,
    staleTime: 1000 * 60 * 60, // 1 hour
  })

export const useGetColors = () => useQuery(getColorsQueryOptions())

/**
 * Query options for GET /styles
 */
export const getStylesQueryOptions = () =>
  queryOptions({
    queryKey: QueryKeys.styles.list,
    queryFn: apiClient.garment.getStyles,
    staleTime: 1000 * 60 * 60, // 1 hour
  })

export const useGetStyles = () => useQuery(getStylesQueryOptions())

/**
 * Query options for GET /categories
 */
export const getCategoriesQueryOptions = () =>
  queryOptions({
    queryKey: QueryKeys.categories.list,
    queryFn: apiClient.garment.getCategories,
    staleTime: 1000 * 60 * 60, // 1 hour
  })

export const useGetCategories = () => useQuery(getCategoriesQueryOptions())
