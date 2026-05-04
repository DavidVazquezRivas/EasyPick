import { queryOptions, useQuery, useMutation, useQueryClient } from '@tanstack/react-query' //
import { apiClient } from '@/core/api'
import { QueryKeys } from '@/core/query/QueryKeys'
import { SimpleGarment } from '@/core/api/garment/models/SimpleGarment'
import { CompleteGarment } from '@/core/api/garment/models/CompleteGarment'
import { GarmentConfigs } from '@/core/api/garment/models/GarmentConfigs'
import { ApiError } from '@/core/api/global/errors'
/**
 * Central query config for GET /garments.
 */
export const getMyGarmentsQueryOptions = () =>
  queryOptions<SimpleGarment[]>({
    queryKey: QueryKeys.garments.list,
    queryFn: apiClient.garment.getMyGarments,
  })

export const useGetMyGarments = () => useQuery(getMyGarmentsQueryOptions())

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