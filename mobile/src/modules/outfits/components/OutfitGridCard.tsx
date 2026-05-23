import { Pressable, Image, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import HeartIcon from '@/shared/components/icons/HeartIcon'
import type { SuggestedOutfit } from '@/core/api/suggestion'
import { Text } from '@/shared/components/ui'
import { cn } from '@/shared/utils/tailwind.utils'

type OutfitGridCardProps = {
  outfit: SuggestedOutfit
  onToggleFavorite: (outfit: SuggestedOutfit) => void
  onOpenDetails: (outfit: SuggestedOutfit) => void
  disabled?: boolean
}

const renderGarmentImage = (imageUrl: string | undefined, className?: string) => (
  <View className={cn('overflow-hidden bg-muted', className)}>
    {imageUrl ? <Image source={{ uri: imageUrl }} className='h-full w-full' resizeMode='cover' /> : null}
  </View>
)

const renderCollage = (outfit: SuggestedOutfit) => {
  const garments = outfit.garments ?? []
  const visibleGarments = garments.slice(0, 4)

  if (visibleGarments.length === 0) {
    return (
      <View className='flex-1 items-center justify-center bg-muted px-4'>
        <Text variant='h4' className='border-b-0 pb-0 text-center text-foreground'>
          {outfit.name}
        </Text>
      </View>
    )
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
}

export const OutfitGridCard = ({ outfit, onToggleFavorite, onOpenDetails, disabled }: OutfitGridCardProps) => {
  const { t } = useTranslation()
  const garments = outfit.garments ?? []
  const pieceLabel = t('common.outfits.labels.pieces', { count: garments.length })
  const isSaved = outfit.status === 'ACCEPTED'

  return (
    <Pressable className='w-[48%]' onPress={() => onOpenDetails(outfit)} accessibilityRole='button'>
      <View className='overflow-hidden rounded-[26px] border border-border bg-card shadow-sm shadow-black/5'>
      <View className='relative h-56 bg-muted'>
        {renderCollage(outfit)}

        <View className='absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1'>
          <Text className='text-[10px] font-semibold uppercase tracking-[0.18em] text-white'>
            {isSaved ? t('common.outfits.labels.saved') : outfit.status}
          </Text>
        </View>

        <Pressable
          disabled={disabled}
          onPress={(event) => {
            event.stopPropagation()
            onToggleFavorite(outfit)
          }}
          accessibilityRole='button'
          accessibilityLabel={outfit.isFavorite ? t('common.outfits.actions.favoriteOff') : t('common.outfits.actions.favoriteOn')}
          className='absolute right-3 top-3 h-9 w-9 items-center justify-center rounded-full bg-background/90'>
          <HeartIcon
            size={17}
            color={outfit.isFavorite ? '#ef4444' : undefined}
            fill={outfit.isFavorite ? '#ef4444' : 'none'}
            strokeWidth={2}
          />
        </Pressable>

        <View className='absolute inset-x-3 bottom-3 rounded-[18px] bg-background/88 px-3 py-2.5'>
          <Text className='text-sm font-semibold text-foreground' numberOfLines={2}>
            {outfit.name}
          </Text>
          <View className='mt-1 flex-row items-center gap-2'>
            <View className={`h-2 w-2 rounded-full ${outfit.isFavorite ? 'bg-rose-500' : 'bg-emerald-500'}`} />
            <Text className='text-xs text-muted-foreground' numberOfLines={1}>
              {pieceLabel}
            </Text>
          </View>
        </View>
      </View>
      </View>
    </Pressable>
  )
}