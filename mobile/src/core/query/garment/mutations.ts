import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/core/api'
import { QueryKeys } from '@/core/query/QueryKeys'

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
