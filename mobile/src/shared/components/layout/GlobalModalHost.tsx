import { BlurView } from 'expo-blur'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Animated, Modal, Platform, Pressable, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { cn } from '@/shared/utils/tailwind.utils'

type GlobalModalHostProps = {
  visible: boolean
  onClose: () => void
  children: ReactNode
  animationDurationMs?: number | null
  initialTranslateY?: number | null
  finalTranslateY?: number | null
  hiddenBackdropOpacity?: number | null
  visibleBackdropOpacity?: number | null
  backdropTint?: string | null
  blurIntensity?: number | null
  blurTint?: 'light' | 'dark' | 'default' | null
  minBottomPadding?: number | null
  androidExtraBottomPadding?: number | null
}

const DEFAULT_ANIMATION_DURATION_MS = 240
const DEFAULT_INITIAL_TRANSLATE_Y = 320
const DEFAULT_FINAL_TRANSLATE_Y = 0
const DEFAULT_BACKDROP_OPACITY_HIDDEN = 0
const DEFAULT_BACKDROP_OPACITY_VISIBLE = 1
const DEFAULT_BLUR_INTENSITY = 80
const DEFAULT_BLUR_TINT = 'default' as const
const DEFAULT_MIN_BOTTOM_PADDING = 12
const DEFAULT_ANDROID_EXTRA_BOTTOM_PADDING = 14

const withNumberFallback = (value: number | null | undefined, fallback: number) => value ?? fallback
const withBlurTintFallback = (value: 'light' | 'dark' | 'default' | null | undefined): 'light' | 'dark' | 'default' =>
  value ?? DEFAULT_BLUR_TINT

export const GlobalModalHost = ({
  visible,
  onClose,
  children,
  animationDurationMs,
  initialTranslateY,
  finalTranslateY,
  hiddenBackdropOpacity,
  visibleBackdropOpacity,
  backdropTint,
  blurIntensity,
  blurTint,
  minBottomPadding,
  androidExtraBottomPadding,
}: GlobalModalHostProps) => {
  const insets = useSafeAreaInsets()
  const [isMounted, setIsMounted] = useState(visible)

  const resolvedAnimationDuration = withNumberFallback(animationDurationMs, DEFAULT_ANIMATION_DURATION_MS)
  const resolvedInitialTranslateY = withNumberFallback(initialTranslateY, DEFAULT_INITIAL_TRANSLATE_Y)
  const resolvedFinalTranslateY = withNumberFallback(finalTranslateY, DEFAULT_FINAL_TRANSLATE_Y)
  const resolvedHiddenBackdropOpacity = withNumberFallback(hiddenBackdropOpacity, DEFAULT_BACKDROP_OPACITY_HIDDEN)
  const resolvedVisibleBackdropOpacity = withNumberFallback(visibleBackdropOpacity, DEFAULT_BACKDROP_OPACITY_VISIBLE)
  const hasCustomBackdropTint = typeof backdropTint === 'string' && backdropTint.length > 0
  const resolvedBlurIntensity = withNumberFallback(blurIntensity, DEFAULT_BLUR_INTENSITY)
  const resolvedBlurTint = withBlurTintFallback(blurTint)
  const resolvedMinBottomPadding = withNumberFallback(minBottomPadding, DEFAULT_MIN_BOTTOM_PADDING)
  const resolvedAndroidExtraBottomPadding = withNumberFallback(
    androidExtraBottomPadding,
    DEFAULT_ANDROID_EXTRA_BOTTOM_PADDING,
  )
  const modalBottomPadding =
    Math.max(insets.bottom, resolvedMinBottomPadding) +
    (Platform.OS === 'android' ? resolvedAndroidExtraBottomPadding : 0)

  const translateY = useRef(new Animated.Value(resolvedInitialTranslateY)).current
  const backdropOpacity = useRef(new Animated.Value(resolvedHiddenBackdropOpacity)).current

  useEffect(() => {
    const openAnimation = Animated.parallel([
      Animated.timing(translateY, {
        toValue: resolvedFinalTranslateY,
        duration: resolvedAnimationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: resolvedVisibleBackdropOpacity,
        duration: resolvedAnimationDuration,
        useNativeDriver: true,
      }),
    ])

    const closeAnimation = Animated.parallel([
      Animated.timing(translateY, {
        toValue: resolvedInitialTranslateY,
        duration: resolvedAnimationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: resolvedHiddenBackdropOpacity,
        duration: resolvedAnimationDuration,
        useNativeDriver: true,
      }),
    ])

    if (visible) {
      setIsMounted(true)
      openAnimation.start()
    } else {
      closeAnimation.start(({ finished }) => {
        if (finished) {
          setIsMounted(false)
        }
      })
    }

    return () => {
      openAnimation.stop()
      closeAnimation.stop()
    }
  }, [
    backdropOpacity,
    resolvedAnimationDuration,
    resolvedFinalTranslateY,
    resolvedHiddenBackdropOpacity,
    resolvedInitialTranslateY,
    resolvedVisibleBackdropOpacity,
    translateY,
    visible,
  ])

  if (!isMounted) return null

  return (
    <Modal transparent animationType='none' onRequestClose={onClose} visible statusBarTranslucent>
      <View className='flex-1 justify-end'>
        <Animated.View className='absolute inset-0' style={{ opacity: backdropOpacity }}>
          <BlurView className='absolute inset-0' intensity={resolvedBlurIntensity} tint={resolvedBlurTint} />
          <Pressable
            className={cn('absolute inset-0 bg-foreground/80', hasCustomBackdropTint && 'bg-transparent')}
            onPress={onClose}
            style={hasCustomBackdropTint ? { backgroundColor: backdropTint } : undefined}
          />
        </Animated.View>

        <Animated.View style={{ transform: [{ translateY }], paddingBottom: modalBottomPadding }}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  )
}
