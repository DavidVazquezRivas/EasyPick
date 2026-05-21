import { useMemo } from 'react'

export type SuggestionsScreenState = {
  permissionDenied: boolean
  isBusy: boolean
  hasSuggestions: boolean
  showPermissionState: boolean
  showLoadingState: boolean
  showErrorState: boolean
  showCardState: boolean
  showFinishedState: boolean
  showEmptyState: boolean
}

export const useSuggestionsState = (
  hasPermission: boolean | null,
  isLocationLoading: boolean,
  isQueryLoading: boolean,
  hasError: boolean,
  suggestionCount: number,
  isFinished: boolean,
): SuggestionsScreenState => {
  const permissionDenied = useMemo(() => hasPermission === false, [hasPermission])
  const isBusy = useMemo(() => isLocationLoading || isQueryLoading, [isLocationLoading, isQueryLoading])
  const hasSuggestions = useMemo(() => suggestionCount > 0, [suggestionCount])

  return {
    permissionDenied,
    isBusy,
    hasSuggestions,
    showPermissionState: permissionDenied,
    showLoadingState: !permissionDenied && isBusy,
    showErrorState: !permissionDenied && !isBusy && hasError,
    showCardState: !permissionDenied && !isBusy && !hasError && hasSuggestions && !isFinished,
    showFinishedState: !permissionDenied && !isBusy && !hasError && hasSuggestions && isFinished,
    showEmptyState: !permissionDenied && !isBusy && !hasError && !hasSuggestions,
  }
}
