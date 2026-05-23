import { ApiResponse } from '@/core/api/global/ApiResponse'
import { ApiError } from '@/core/api/global/errors'
import { httpClient } from '@/core/api/global/httpClient'
import { ApiRoutes } from '@/shared/constants/ApiRoutes'
import { PatchSuggestionRequest } from './models/PatchSuggestionRequest'
import { RejectionReason } from './models/RejectionReason'
import { SuggestedOutfit } from './models/SuggestedOutfit'

export type SuggestionLocation = {
  lat: number
  lng: number
}

export const SuggestionGateway = {
  getSuggestions: async ({ lat, lng }: SuggestionLocation): Promise<SuggestedOutfit[]> => {
    const response = await httpClient.get<ApiResponse<SuggestedOutfit[]>>(ApiRoutes.Suggestions.List, {
      params: { lat, lng },
    })

    if (!response.data.success) {
      const code = response.data.message?.code ?? 0
      const message = response.data.message?.message ?? 'Failed to fetch suggestions'
      throw new ApiError(code, message, response.data.path ?? undefined, response.data.timestamp ?? undefined)
    }

    return response.data.data ?? []
  },

  getUserOutfits: async (): Promise<SuggestedOutfit[]> => {
    const response = await httpClient.get<ApiResponse<SuggestedOutfit[]>>(ApiRoutes.Suggestions.Me)

    if (!response.data.success) {
      const code = response.data.message?.code ?? 0
      const message = response.data.message?.message ?? 'Failed to fetch user outfits'
      throw new ApiError(code, message, response.data.path ?? undefined, response.data.timestamp ?? undefined)
    }

    return response.data.data ?? []
  },

  getRejectionReasons: async (): Promise<RejectionReason[]> => {
    const response = await httpClient.get<ApiResponse<RejectionReason[]>>(ApiRoutes.Suggestions.RejectionReasons)

    if (!response.data.success) {
      const code = response.data.message?.code ?? 0
      const message = response.data.message?.message ?? 'Failed to fetch rejection reasons'
      throw new ApiError(code, message, response.data.path ?? undefined, response.data.timestamp ?? undefined)
    }

    return response.data.data ?? []
  },

  patchSuggestion: async (id: string, patch: PatchSuggestionRequest): Promise<void> => {
    const url = ApiRoutes.Suggestions.Patch.replace(':id', id)
    const response = await httpClient.patch<ApiResponse<null>>(url, patch)

    if (!response.data.success) {
      const code = response.data.message?.code ?? 0
      const message = response.data.message?.message ?? 'Failed to patch suggestion'
      throw new ApiError(code, message, response.data.path ?? undefined, response.data.timestamp ?? undefined)
    }
  },
}
