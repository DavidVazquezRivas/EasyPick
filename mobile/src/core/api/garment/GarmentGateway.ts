import { httpClient } from '@/core/api/global/httpClient'
import { ApiRoutes } from '@/shared/constants/ApiRoutes'
import { ApiResponse } from '@/core/api/global/ApiResponse'
import { ApiError } from '@/core/api/global/errors'
import { SimpleGarment } from '@/core/api/garment/models/SimpleGarment'

export const GarmentGateway = {
  /**
   * Fetches all garments for the authenticated user.
   */
  getMyGarments: async (): Promise<SimpleGarment[]> => {
    const response = await httpClient.get<ApiResponse<SimpleGarment[]>>(ApiRoutes.Garments.GetAll)

    if (!response.data.success) {
      const code = response.data.message?.code ?? 0
      const message = response.data.message?.message ?? 'Failed to fetch garments'
      throw new ApiError(code, message, response.data.path ?? undefined, response.data.timestamp ?? undefined)
    }

    return response.data.data ?? []
  },
}
