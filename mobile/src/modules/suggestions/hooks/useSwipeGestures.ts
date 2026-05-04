import { useCallback, useMemo, useRef } from 'react'
import { Animated, PanResponder } from 'react-native'

type SwipeDirection = 'left' | 'right'

type UseSwipeGesturesParams = {
  outfitId: string
  onSwipe: (direction: SwipeDirection, outfitId: string) => void
}

const SWIPE_THRESHOLD = 110
const SWIPE_OUT_DURATION = 180

export const useSwipeGestures = ({ outfitId, onSwipe }: UseSwipeGesturesParams) => {
  const translateX = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(0)).current

  const rotation = translateX.interpolate({
    inputRange: [-220, 0, 220],
    outputRange: ['-8deg', '0deg', '8deg'],
    extrapolate: 'clamp',
  })

  const resetPosition = useCallback(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        tension: 70,
        friction: 8,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 70,
        friction: 8,
      }),
    ]).start()
  }, [translateX, translateY])

  const forceSwipe = useCallback(
    (direction: SwipeDirection) => {
      const toValue = direction === 'right' ? 420 : -420

      Animated.timing(translateX, {
        toValue,
        duration: SWIPE_OUT_DURATION,
        useNativeDriver: true,
      }).start(() => onSwipe(direction, outfitId))
    },
    [onSwipe, outfitId, translateX],
  )

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 8,
        onPanResponderMove: Animated.event([null, { dx: translateX, dy: translateY }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx > SWIPE_THRESHOLD) {
            forceSwipe('right')
            return
          }

          if (gestureState.dx < -SWIPE_THRESHOLD) {
            forceSwipe('left')
            return
          }

          resetPosition()
        },
      }),
    [forceSwipe, resetPosition, translateX, translateY],
  )

  return {
    translateX,
    translateY,
    rotation,
    panResponder,
    resetPosition,
  }
}
