import { useEffect, useMemo, useRef, useState } from 'react'
import type { SuggestedOutfit } from '@/core/api/suggestion'

export type SwipeRecord = { outfitId: string; direction: 'left' | 'right' }

export type SuggestionsFeedState = {
  currentIndex: number
  swipeHistory: SwipeRecord[]
  currentSuggestion: SuggestedOutfit | undefined
  totalCount: number
  isFinished: boolean
  swipeCount: number
  handleSwipe: (direction: 'left' | 'right', outfitId: string) => void
  reset: () => void
}

export const useSuggestionsFeed = (suggestions: SuggestedOutfit[] | undefined): SuggestionsFeedState => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeHistory, setSwipeHistory] = useState<SwipeRecord[]>([])
  const [feedSuggestions, setFeedSuggestions] = useState<SuggestedOutfit[]>([])
  const snapshotKeyRef = useRef('')
  const hasSnapshotRef = useRef(false)

  const nextSnapshotKey = useMemo(() => suggestions?.map((item) => item.id).join('|') ?? '', [suggestions])

  useEffect(() => {
    if (hasSnapshotRef.current || suggestions === undefined) return

    snapshotKeyRef.current = nextSnapshotKey
    hasSnapshotRef.current = true
    setFeedSuggestions(suggestions)
    setCurrentIndex(0)
    setSwipeHistory([])
  }, [nextSnapshotKey, suggestions])

  const currentSuggestion = feedSuggestions[currentIndex]
  const hasSuggestions = feedSuggestions.length > 0
  const isFinished = hasSuggestions && !currentSuggestion

  const handleSwipe = (direction: 'left' | 'right', outfitId: string) => {
    setSwipeHistory((prev) => [...prev, { outfitId, direction }])
    setCurrentIndex((prev) => prev + 1)
  }

  const reset = () => {
    snapshotKeyRef.current = suggestions?.map((item) => item.id).join('|') ?? ''
    hasSnapshotRef.current = true
    setFeedSuggestions(suggestions ?? [])
    setCurrentIndex(0)
    setSwipeHistory([])
  }

  return {
    currentIndex,
    swipeHistory,
    currentSuggestion,
    totalCount: feedSuggestions.length,
    isFinished,
    swipeCount: swipeHistory.length,
    handleSwipe,
    reset,
  }
}
