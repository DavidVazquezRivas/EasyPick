import { queryOptions, useQuery, useMutation, useQueryClient } from '@tanstack/react-query' //
import { apiClient } from '@/core/api'
import { QueryKeys } from '@/core/query/QueryKeys'
import { SimpleGarment } from '@/core/api/garment/models/SimpleGarment'
import { CompleteGarment } from '@/core/api/garment/models/CompleteGarment'
import { GarmentConfigs } from '@/core/api/garment/models/GarmentConfigs'
import { ApiError } from '@/core/api/global/errors'
import type { GetMyGarmentsParams } from '@/core/api/garment/GarmentGateway'

const normalizeGetMyGarmentsParams = (params?: GetMyGarmentsParams): GetMyGarmentsParams | undefined => {
  if (!params) return undefined

  const search = params.search?.trim()
  const categoryIds = params.categoryIds?.map((id) => id.trim()).filter(Boolean)
  const styleIds = params.styleIds?.map((id) => id.trim()).filter(Boolean)
  const colorIds = params.colorIds?.map((id) => id.trim()).filter(Boolean)

  const normalizedParams: GetMyGarmentsParams = {}

  if (search) normalizedParams.search = search
  if (categoryIds?.length) normalizedParams.categoryIds = categoryIds
  if (styleIds?.length) normalizedParams.styleIds = styleIds
  if (colorIds?.length) normalizedParams.colorIds = colorIds

  return Object.keys(normalizedParams).length ? normalizedParams : undefined
}

export const getMyGarmentsQueryOptions = (params?: GetMyGarmentsParams) =>
  {
    const normalizedParams = normalizeGetMyGarmentsParams(params)

    return queryOptions<SimpleGarment[]>({
      queryKey: [...QueryKeys.garments.list, normalizedParams],
      queryFn: () => apiClient.garment.getMyGarments(normalizedParams),
    })
  }

export const useGetMyGarments = (params?: GetMyGarmentsParams) => useQuery(getMyGarmentsQueryOptions(params))

/**
 * Central query config for GET /garments/:id.
 */
export const getGarmentDetailQueryOptions = (id: string) =>
  queryOptions<CompleteGarment>({
    queryKey: QueryKeys.garments.detail(id),
    queryFn: () => apiClient.garment.getGarmentById(id),
    enabled: id.trim().length > 0,
  })

export const useGetGarmentDetail = (id: string) => useQuery(getGarmentDetailQueryOptions(id))

/**
 * Hook to patch a garment by id. On success, it updates the garment detail cache and invalidates the garment list.
 */
export const usePatchGarment = (id: string) => {
  const queryClient = useQueryClient(); //

  return useMutation<CompleteGarment, ApiError, Record<string, any>>({ 
    mutationFn: (patch) => apiClient.garment.patchGarment(id, patch), 
    onSuccess: (updatedGarment) => {
      queryClient.setQueryData(QueryKeys.garments.detail(id), updatedGarment); 
            queryClient.invalidateQueries({ queryKey: QueryKeys.garments.list }); 
    },
  });
};

/**
 * Central query config for GET /garments/configs.
 */
export const getGarmentConfigsQueryOptions = (enabled = true) =>
  queryOptions<GarmentConfigs>({
    queryKey: QueryKeys.garments.configs,
    queryFn: apiClient.garment.getGarmentConfigs,
    staleTime: 1000 * 60 * 30,
    enabled,
  })

export const useGetGarmentConfigs = (enabled = true) => useQuery(getGarmentConfigsQueryOptions(enabled))

/**
 * Hook to get colors from garment configs.
 */
export const useGetColors = () => {
  const { data, ...rest } = useGetGarmentConfigs()
  return {
    data: data?.colors ?? [],
    ...rest,
  }
}

/**
 * Hook to get styles from garment configs.
 */
export const useGetStyles = () => {
  const { data, ...rest } = useGetGarmentConfigs()
  return {
    data: data?.styles ?? [],
    ...rest,
  }
}

/**
 * Hook to get categories from garment configs.
 */
export const useGetCategories = () => {
  const { data, ...rest } = useGetGarmentConfigs()
  return {
    data: data?.categories ?? [],
    ...rest,
  }
}
