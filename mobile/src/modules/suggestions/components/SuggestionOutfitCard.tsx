import { Ionicons } from '@expo/vector-icons'
import { Animated, Image, View, useColorScheme } from 'react-native'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { SuggestedOutfit } from '@/core/api/suggestion'
import { getThemeColor } from '@/core/theme/themeColors'
import { Text } from '@/shared/components/ui'
import { cn } from '@/shared/utils/tailwind.utils'
import { useSwipeGestures } from '../hooks'

type SuggestionOutfitCardProps = {
  outfit: SuggestedOutfit
  index: number
  total: number
  onSwipe: (direction: 'left' | 'right', outfitId: string) => void
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
  const colorScheme = useColorScheme()
  const iconColor = getThemeColor('foreground', colorScheme)
  const garments = outfit.garments ?? []
  const visibleGarments = garments.slice(0, 4)
  const { translateX, translateY, rotation, panResponder, resetPosition } = useSwipeGestures({ outfitId: outfit.id, onSwipe })

  // Reset animations when outfit changes
  useEffect(() => {
    resetPosition()
  }, [outfit.id, resetPosition])

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
        <View className='rounded-full bg-white/90 px-3 py-1.5'>
          <Text className='text-xs font-semibold uppercase tracking-[0.18em] text-foreground'>
            {pieceLabel}
          </Text>
        </View>
        <View className='h-9 w-9 items-center justify-center rounded-full bg-white/90'>
          <Ionicons name='heart-outline' size={17} color={iconColor} />
        </View>
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
    <View className='flex-1 overflow-hidden rounded-[32px] bg-card shadow-2xl shadow-black/20' {...panResponder.panHandlers}>
      <View className='flex-1'>
        <Animated.View
          className='flex-1'
          style={{
            transform: [{ translateX }, { translateY }, { rotate: rotation }],
          }}>
          {topBar}
          <View className='flex-1 overflow-hidden rounded-[32px] bg-muted'>{content}</View>
        </Animated.View>
      </View>
    </View>
  )
}
