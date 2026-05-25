import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/core/api'
import { QueryKeys } from '@/core/query/QueryKeys'
import { PatchSuggestionRequest } from '@/core/api/suggestion'

type PatchSuggestionVariables = {
  id: string
  patch: PatchSuggestionRequest
}

export const usePatchSuggestion = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, PatchSuggestionVariables>({
    mutationFn: ({ id, patch }: PatchSuggestionVariables) => apiClient.suggestion.patchSuggestion(id, patch),
    onSuccess: () => {
      // Invalidate all suggestions queries so they refetch when user returns to the page
      queryClient.invalidateQueries({ queryKey: QueryKeys.suggestions.all })
      queryClient.invalidateQueries({ queryKey: QueryKeys.suggestions.library })
    },
  })
}
