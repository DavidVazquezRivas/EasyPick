import { queryOptions, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/core/api'
import { AppError } from '@/core/api/global/errors'
import { RejectionReason, SuggestionLocation, SuggestedOutfit } from '@/core/api/suggestion'
import { QueryKeys } from '@/core/query/QueryKeys'

export const getSuggestionsQueryOptions = (location: SuggestionLocation | null) =>
  queryOptions<SuggestedOutfit[]>({
    queryKey: location ? QueryKeys.suggestions.list(location.lat, location.lng) : QueryKeys.suggestions.all,
    queryFn: () => {
      if (!location) {
        throw new AppError('Location is required to fetch suggestions')
      }

      return apiClient.suggestion.getSuggestions(location)
    },
    enabled: Boolean(location),
    staleTime: 1000 * 60 * 5,
  })

export const useGetSuggestions = (location: SuggestionLocation | null) => useQuery(getSuggestionsQueryOptions(location))

export const getUserOutfitsQueryOptions = () =>
  queryOptions<SuggestedOutfit[]>({
    queryKey: QueryKeys.suggestions.library,
    queryFn: apiClient.suggestion.getUserOutfits,
    staleTime: 1000 * 60 * 5,
  })

export const useGetUserOutfits = () => useQuery(getUserOutfitsQueryOptions())

export const getSuggestionRejectionReasonsQueryOptions = () =>
  queryOptions<RejectionReason[]>({
    queryKey: QueryKeys.suggestions.rejectionReasons,
    queryFn: apiClient.suggestion.getRejectionReasons,
    staleTime: 1000 * 60 * 30,
  })

export const useGetSuggestionRejectionReasons = () => useQuery(getSuggestionRejectionReasonsQueryOptions())
