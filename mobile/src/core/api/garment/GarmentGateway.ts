import { httpClient } from '@/core/api/global/httpClient'
import { ApiRoutes } from '@/shared/constants/ApiRoutes'
import { ApiResponse } from '@/core/api/global/ApiResponse'
import { ApiError } from '@/core/api/global/errors'
import { SimpleGarment } from '@/core/api/garment/models/SimpleGarment'
import { CompleteGarment } from './models/CompleteGarment'
import { PatchGarmentRequest } from '@/core/api/garment/models/PatchGarmentRequest'
import { Color, Style, Category } from './models/FilterOptions'

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

  /**
   * Fetches all available colors.
   */
  getColors: async (): Promise<Color[]> => {
    const response = await httpClient.get<ApiResponse<Color[]>>(ApiRoutes.Colors.GetAll)

    if (!response.data.success) {
      const code = response.data.message?.code ?? 0
      const message = response.data.message?.message ?? 'Failed to fetch colors'
      throw new ApiError(code, message, response.data.path ?? undefined, response.data.timestamp ?? undefined)
    }

    return response.data.data ?? []
  },

  /**
   * Fetches all available styles.
   */
  getStyles: async (): Promise<Style[]> => {
    const response = await httpClient.get<ApiResponse<Style[]>>(ApiRoutes.Styles.GetAll)

    if (!response.data.success) {
      const code = response.data.message?.code ?? 0
      const message = response.data.message?.message ?? 'Failed to fetch styles'
      throw new ApiError(code, message, response.data.path ?? undefined, response.data.timestamp ?? undefined)
    }

    return response.data.data ?? []
  },

  /**
   * Fetches all available categories.
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await httpClient.get<ApiResponse<Category[]>>(ApiRoutes.Categories.GetAll)

    if (!response.data.success) {
      const code = response.data.message?.code ?? 0
      const message = response.data.message?.message ?? 'Failed to fetch categories'
      throw new ApiError(code, message, response.data.path ?? undefined, response.data.timestamp ?? undefined)
    }

    return response.data.data ?? []
  },
}
