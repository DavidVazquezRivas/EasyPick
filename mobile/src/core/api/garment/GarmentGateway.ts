import { httpClient } from '@/core/api/global/httpClient'
import { ApiRoutes } from '@/shared/constants/ApiRoutes'
import { ApiResponse } from '@/core/api/global/ApiResponse'
import { Garment } from '@/core/api/garment/models/Garment'

export const GarmentGateway = {
  getMyGarments: async (): Promise<Garment[]> => {
    const response = await httpClient.get<ApiResponse<Garment[]>>(ApiRoutes.Garments.GetAll)
    return response.data.data ?? []
  },
}
