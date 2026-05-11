import HeartIcon from '@/shared/components/icons/HeartIcon'
import ChevronUpIcon from '@/shared/components/icons/ChevronUpIcon'
import { BlurView } from 'expo-blur'
import { Animated, Image, Pressable, View, useColorScheme } from 'react-native'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { SuggestedOutfit } from '@/core/api/suggestion'
import { getThemeColor } from '@/core/theme/themeColors'
import { Text, Button } from '@/shared/components/ui'
import { cn } from '@/shared/utils/tailwind.utils'
import { useSwipeGestures } from '../hooks'
import { SuggestionOutfitGarments } from './SuggestionOutfitGarments'

type SuggestionOutfitCardProps = {
  outfit: SuggestedOutfit
  index: number
  total: number
  onSwipe: (direction: 'left' | 'right', outfitId: string) => void
}

type SwipeIndicatorProps = {
  type: 'LIKE' | 'NOPE'
  opacity: Animated.AnimatedInterpolation<number | string>
}

const SwipeIndicator = ({ type, opacity }: SwipeIndicatorProps) => {
  const isLike = type === 'LIKE'
  const color = isLike ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
  const rotation = isLike ? '-12deg' : '12deg'
  const position = isLike ? { left: 24 } : { right: 24 }

  return (
    <Animated.View
      pointerEvents='none'
      style={{
        position: 'absolute',
        top: 64,
        ...position,
        zIndex: 30,
        borderWidth: 3,
        borderColor: color,
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 12,
        transform: [{ rotate: rotation }],
        opacity,
      }}>
      <Text style={{ fontSize: 24, fontWeight: '800', color, letterSpacing: 2 }}>
        {type}
      </Text>
    </Animated.View>
  )
}

const renderGarmentImage = (imageUrl: string, className?: string) => (
  <View className={cn('overflow-hidden bg-muted', className)}>
    <Image source={{ uri: imageUrl }} className='h-full w-full' resizeMode='cover' />
  </View>
)

const renderEmptyGarmentCard = (title: string) => (
  <View className='flex-1 items-center justify-center bg-card px-8'>
    <Text variant='h3' className='border-b-0 pb-0 text-center text-foreground'>
      {title}
    </Text>
  </View>
)

export const SuggestionOutfitCard = ({ outfit, index, total, onSwipe }: SuggestionOutfitCardProps) => {
  const { t } = useTranslation()
  const [showGarments, setShowGarments] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const colorScheme = useColorScheme()
  const iconColor = getThemeColor('foreground', colorScheme)
  const garments = outfit.garments ?? []
  const visibleGarments = garments.slice(0, 4)
  const { translateX, translateY, rotation, panResponder, resetPosition } = useSwipeGestures({ outfitId: outfit.id, onSwipe })

  // Reset animations when outfit changes
  useEffect(() => {
    resetPosition()
  }, [outfit.id, resetPosition])

  const likeOpacity = translateX.interpolate({
    inputRange: [20, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  })

  const nopeOpacity = translateX.interpolate({
    inputRange: [-100, -20],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  })

  const pieceLabel =
    garments.length === 1
      ? t('common.suggestions.piece', { count: garments.length })
      : t('common.suggestions.pieces', { count: garments.length })

  const topBar = (
    <View className='absolute left-0 right-0 top-0 z-20 flex-row items-center justify-between px-4 pt-4'>
      <View className='rounded-full bg-black/40 px-3 py-1.5'>
        <Text className='text-xs font-semibold uppercase tracking-[0.18em] text-white'>
          {t('common.suggestions.cardLabel')} {index + 1}/{total}
        </Text>
      </View>
      <View className='flex-row items-center gap-2'>
        <View className='rounded-full bg-secondary px-3 py-1.5'>
          <Text className='text-xs font-semibold uppercase tracking-[0.18em] text-foreground'>
            {pieceLabel}
          </Text>
        </View>
        <Button className='h-9 w-9 items-center justify-center rounded-full bg-secondary' onPress={() => setIsLiked(!isLiked)}>
          <HeartIcon size={20} color={isLiked ? '#ef4444' : iconColor} fill={isLiked ? '#ef4444' : 'none'} strokeWidth={2} />
        </Button>
      </View>
    </View>
  )

  const content = (() => {
    if (garments.length === 0) {
      return renderEmptyGarmentCard(outfit.name)
    }

    if (visibleGarments.length === 1) {
      return renderGarmentImage(visibleGarments[0].imageUrl, 'flex-1')
    }

    if (visibleGarments.length === 2) {
      return (
        <View className='flex-1 gap-px bg-border'>
          <View className='flex-1'>{renderGarmentImage(visibleGarments[0].imageUrl, 'flex-1')}</View>
          <View className='flex-1'>{renderGarmentImage(visibleGarments[1].imageUrl, 'flex-1')}</View>
        </View>
      )
    }

    if (visibleGarments.length === 3) {
      return (
        <View className='flex-1 gap-px bg-border'>
          <View className='flex-[1.15]'>{renderGarmentImage(visibleGarments[0].imageUrl, 'flex-1')}</View>
          <View className='flex-1 flex-row gap-px'>
            <View className='flex-1'>{renderGarmentImage(visibleGarments[1].imageUrl, 'flex-1')}</View>
            <View className='flex-1'>{renderGarmentImage(visibleGarments[2].imageUrl, 'flex-1')}</View>
          </View>
        </View>
      )
    }

    return (
      <View className='flex-1 gap-px bg-border'>
        <View className='flex-1 flex-row gap-px'>
          <View className='flex-1'>{renderGarmentImage(visibleGarments[0].imageUrl, 'flex-1')}</View>
          <View className='flex-1'>{renderGarmentImage(visibleGarments[1].imageUrl, 'flex-1')}</View>
        </View>
        <View className='flex-1 flex-row gap-px'>
          <View className='flex-1'>{renderGarmentImage(visibleGarments[2].imageUrl, 'flex-1')}</View>
          <View className='flex-1'>{renderGarmentImage(visibleGarments[3].imageUrl, 'flex-1')}</View>
        </View>
      </View>
    )
  })()

  return (
    <View className='flex-1 rounded-[32px] bg-card shadow-2xl shadow-black/20 z-10'>
      <View className='flex-1' {...panResponder.panHandlers}>
        <Animated.View
          className='flex-1'
          style={{
            transform: [{ translateX }, { translateY }, { rotate: rotation }],
          }}>
          {topBar}
          <SwipeIndicator type='LIKE' opacity={likeOpacity} />
          <SwipeIndicator type='NOPE' opacity={nopeOpacity} />
          <View className='flex-1 overflow-hidden rounded-[32px] bg-muted'>
            {content}
            <Animated.View
              pointerEvents='none'
              className='absolute inset-0 z-10 bg-green-500/20'
              style={{ opacity: likeOpacity }}
            />
            <Animated.View
              pointerEvents='none'
              className='absolute inset-0 z-10 bg-red-500/20'
              style={{ opacity: nopeOpacity }}
            />
          </View>
          <View className='absolute bottom-6 left-4 right-4 z-20'>
            <Pressable onPress={() => setShowGarments(true)}>
              <BlurView
                intensity={90}
                tint='dark'
                className='flex-row items-center justify-center gap-1.5 overflow-hidden rounded-[14px] border border-white/20 bg-white/10 p-4'>
                <ChevronUpIcon size={14} color='rgba(255, 255, 255)' strokeWidth={2.5} />
                <Text className='font-medium text-white'>
                  {t('common.suggestions.viewGarments')}
                </Text>
              </BlurView>
            </Pressable>
          </View>
        </Animated.View>
      </View>
      {showGarments && (
        <>
          <Pressable
            className="absolute w-[3000px] h-[3000px] -top-[1000px] -right-[1000px] z-40"
            onPress={() => setShowGarments(false)}
          />
          <SuggestionOutfitGarments garments={outfit.garments} onClose={() => setShowGarments(false)} />
        </>
      )}
    </View>
  )
}
