import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/core/api'
import { QueryKeys } from '@/core/query/QueryKeys'
import { PatchGarmentRequest } from '@/core/api/garment/models/PatchGarmentRequest'

/**
 * Mutation hook for POST /garments.
 *
 * Uploads an image and invalidates garments cache so list queries refresh.
 */
export const useAddGarment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiClient.garment.addGarments,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QueryKeys.garments.list })
    },
  })
}

type PatchGarmentMutationVariables = {
  id: string
  patch: PatchGarmentRequest
}

/**
 * Mutation hook for PATCH /garments/:id.
 *
 * Supports partial patch payloads and invalidates list/detail caches.
 */
export const usePatchGarment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, patch }: PatchGarmentMutationVariables) => apiClient.garment.patchGarment(id, patch),
    onSuccess: async (_patchedGarment, variables) => {
      await queryClient.invalidateQueries({ queryKey: QueryKeys.garments.list })
      await queryClient.invalidateQueries({ queryKey: QueryKeys.garments.detail(variables.id) })
    },
  })
}
