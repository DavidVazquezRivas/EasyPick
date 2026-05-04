import { useState } from 'react'
import type { PatchSuggestionRequest } from '@/core/api/suggestion'

type SwipeDirection = 'left' | 'right'

type UseSuggestionSwipeFlowParams = {
  patchSuggestion: (variables: { id: string; patch: PatchSuggestionRequest }) => Promise<void>
  advanceSwipe: (direction: SwipeDirection, outfitId: string) => void
  onError: (error: Error) => void
}

type RejectPayload = {
  reasonId?: string
  customReason?: string
}

export type SuggestionSwipeFlowState = {
  rejectModalVisible: boolean
  pendingRejectOutfitId: string | null
  onCardSwipe: (direction: SwipeDirection, outfitId: string) => Promise<void>
  onRejectSubmit: (payload: RejectPayload) => Promise<void>
  onRejectSkip: () => Promise<void>
}

const asError = (error: unknown) => (error instanceof Error ? error : new Error('Unknown suggestion patch error'))

export const useSuggestionSwipeFlow = ({ patchSuggestion, advanceSwipe, onError }: UseSuggestionSwipeFlowParams): SuggestionSwipeFlowState => {
  const [pendingRejectOutfitId, setPendingRejectOutfitId] = useState<string | null>(null)

  const onCardSwipe = async (direction: SwipeDirection, outfitId: string): Promise<void> => {
    if (direction === 'left') {
      setPendingRejectOutfitId(outfitId)
      return
    }

    advanceSwipe('right', outfitId)

    // Fire-and-forget: send patch without blocking UI
    patchSuggestion({
      id: outfitId,
      patch: { status: 'ACCEPTED' },
    }).catch((error) => {
      onError(asError(error))
    })
  }

  const onRejectSubmit = async ({ reasonId, customReason }: RejectPayload): Promise<void> => {
    if (!pendingRejectOutfitId) return

    const outfitId = pendingRejectOutfitId
    const trimmedCustomReason = customReason?.trim() ?? ''

    setPendingRejectOutfitId(null)
    advanceSwipe('left', outfitId)

    // Fire-and-forget: send patch without blocking UI
    patchSuggestion({
      id: outfitId,
      patch: {
        rejection: {
          reasonId,
          customReason: trimmedCustomReason.length > 0 ? trimmedCustomReason : undefined,
        },
      },
    }).catch((error) => {
      onError(asError(error))
    })
  }

  const onRejectSkip = async (): Promise<void> => {
    if (!pendingRejectOutfitId) return

    const outfitId = pendingRejectOutfitId

    setPendingRejectOutfitId(null)
    advanceSwipe('left', outfitId)

    // Fire-and-forget: send patch without blocking UI
    patchSuggestion({
      id: outfitId,
      patch: { rejection: {} },
    }).catch((error) => {
      onError(asError(error))
    })
  }

  return {
    rejectModalVisible: pendingRejectOutfitId !== null,
    pendingRejectOutfitId,
    onCardSwipe,
    onRejectSubmit,
    onRejectSkip,
  }
}
