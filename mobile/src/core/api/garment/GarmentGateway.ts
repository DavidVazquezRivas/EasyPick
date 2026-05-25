import { httpClient } from '@/core/api/global/httpClient'
import { ApiRoutes } from '@/shared/constants/ApiRoutes'
import { ApiResponse } from '@/core/api/global/ApiResponse'
import { ApiError } from '@/core/api/global/errors'
import { SimpleGarment } from '@/core/api/garment/models/SimpleGarment'
import { CompleteGarment } from './models/CompleteGarment'
import { PatchGarmentRequest } from '@/core/api/garment/models/PatchGarmentRequest'
import { GarmentConfigs } from '@/core/api/garment/models/GarmentConfigs'

export type UploadImageFile = {
  uri: string
  name: string
  type: string
}

export type GetMyGarmentsParams = {
  search?: string
  categoryIds?: string[]
  styleIds?: string[]
  colorIds?: string[]
}

const serializeGarmentFilters = (params: GetMyGarmentsParams) => {
  const searchParams = new URLSearchParams()

  if (params.search?.trim()) {
    searchParams.append('search', params.search.trim())
  }

  params.categoryIds?.forEach((id) => {
    if (id?.trim()) searchParams.append('categoryIds', id.trim())
  })

  params.styleIds?.forEach((id) => {
    if (id?.trim()) searchParams.append('styleIds', id.trim())
  })

  params.colorIds?.forEach((id) => {
    if (id?.trim()) searchParams.append('colorIds', id.trim())
  })

  return searchParams.toString()
}

export const GarmentGateway = {
  /**
   * Fetches all garments for the authenticated user.
   */
  getMyGarments: async (params?: GetMyGarmentsParams): Promise<SimpleGarment[]> => {
    const queryString = params ? serializeGarmentFilters(params) : ''
    const url = queryString ? `${ApiRoutes.Garments.GetAll}?${queryString}` : ApiRoutes.Garments.GetAll

    const response = await httpClient.get<ApiResponse<SimpleGarment[]>>(url)

    if (!response.data.success) {
      const code = response.data.message?.code ?? 0
      const message = response.data.message?.message ?? 'Failed to fetch garments'
      throw new ApiError(code, message, response.data.path ?? undefined, response.data.timestamp ?? undefined)
    }

    return response.data.data ?? []
  },

  /**
   * Fetches a single garment by its id.
   */
  getGarmentById: async (id: string): Promise<CompleteGarment> => {
    const url = ApiRoutes.Garments.GetById.replace(':id', id)

    const response = await httpClient.get<ApiResponse<CompleteGarment>>(url)

    if (!response.data.success || !response.data.data) {
      throw new ApiError(
        response.data.message?.code ?? 0,
        response.data.message?.message ?? 'Error loading garment',
      )
    }

    return response.data.data
  },

  getGarmentConfigs: async (): Promise<GarmentConfigs> => {
    const response = await httpClient.get<ApiResponse<GarmentConfigs>>(ApiRoutes.Garments.GetConfigs)

    if (!response.data.success || response.data.data === null) {
      const code = response.data.message?.code ?? 0
      const msg = response.data.message?.message ?? 'Failed to fetch configs'
      throw new ApiError(code, msg, response.data.path ?? undefined, response.data.timestamp)
    }

    return response.data.data
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
  patchGarment: async (id: string, patch: PatchGarmentRequest): Promise<CompleteGarment> => {
    const url = ApiRoutes.Garments.Patch.replace(':id', id)

    const response = await httpClient.patch<ApiResponse<CompleteGarment>>(url, patch)

    if (!response.data.success || !response.data.data) {
      throw new ApiError(response.data.message?.code ?? 0, 'Error al actualizar')
    }

    return response.data.data
  },
}
