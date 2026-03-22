import { httpClient } from '@/core/api/global/httpClient'
import { ApiRoutes } from '@/shared/constants/ApiRoutes'
import { ApiResponse } from '@/core/api/global/ApiResponse'
import { ApiError } from '@/core/api/global/errors'
import { SimpleGarment } from '@/core/api/garment/models/SimpleGarment'
import { CompleteGarment } from './models/CompleteGarment'
import { PatchGarmentRequest } from '@/core/api/garment/models/PatchGarmentRequest'

export type UploadImageFile = {
  uri: string
  name: string
  type: string
}

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

  /**
   * Adds one or more garments based on an uploaded image.
   */
  addGarments: async (image: UploadImageFile): Promise<CompleteGarment[]> => {
    const formData = new FormData()
    formData.append('image', image as unknown as Blob)

    const response = await httpClient.post<ApiResponse<CompleteGarment[]>>(ApiRoutes.Garments.Add, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (!response.data.success) {
      const code = response.data.message?.code ?? 0
      const message = response.data.message?.message ?? 'Failed to add garments'
      throw new ApiError(code, message, response.data.path ?? undefined, response.data.timestamp ?? undefined)
    }

    return response.data.data ?? []
  },

  /**
   * Patches a garment by id.
   */
  patchGarment: async (id: string, patch: PatchGarmentRequest): Promise<CompleteGarment | null> => {
    const route = ApiRoutes.Garments.Patch.replace(':id', id)
    const response = await httpClient.patch<ApiResponse<CompleteGarment>>(route, patch)

    if (!response.data.success) {
      const code = response.data.message?.code ?? 0
      const message = response.data.message?.message ?? 'Failed to patch garment'
      throw new ApiError(code, message, response.data.path ?? undefined, response.data.timestamp ?? undefined)
    }

    return response.data.data ?? null
  },
}
