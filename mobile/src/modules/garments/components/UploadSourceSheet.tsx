import { Ionicons } from '@expo/vector-icons'
import type { ReactNode } from 'react'
import { Pressable, View, useColorScheme } from 'react-native'
import { useTranslation } from 'react-i18next'
import { getThemeColor } from '@/core/theme/themeColors'
import { Text } from '@/shared/components/ui'
import { cn } from '@/shared/utils/tailwind.utils'

type UploadSourceSheetProps = {
  onCameraPress: () => void
  onGalleryPress: () => void
  onCancelPress: () => void
}

const ICON_SIZE = 20

const ActionRow = ({
  icon,
  title,
  description,
  onPress,
}: {
  icon: ReactNode
  title: string
  description: string
  onPress: () => void
}) => (
  <Pressable className='flex-row items-center gap-3 px-4 py-3' onPress={onPress}>
    <View className='bg-secondary h-11 w-11 items-center justify-center rounded-full'>{icon}</View>
    <View className='flex-1'>
      <Text className='text-base font-semibold text-foreground'>{title}</Text>
      <Text className='text-sm text-muted-foreground'>{description}</Text>
    </View>
  </Pressable>
)

export const UploadSourceSheet = ({ onCameraPress, onGalleryPress, onCancelPress }: UploadSourceSheetProps) => {
  const { t } = useTranslation()
  const colorScheme = useColorScheme()
  const iconColor = getThemeColor('primary', colorScheme)

  const title = t('garment.uploadSourceSheet.title')
  const subtitle = t('garment.uploadSourceSheet.subtitle')

  const cameraTitle = t('garment.uploadSourceSheet.camera.title')
  const cameraDescription = t('garment.uploadSourceSheet.camera.description')

  const galleryTitle = t('garment.uploadSourceSheet.gallery.title')
  const galleryDescription = t('garment.uploadSourceSheet.gallery.description')

  const cancelLabel = t('garment.uploadSourceSheet.cancel')

  const cameraIcon = <Ionicons name='camera-outline' size={ICON_SIZE} color={iconColor} />
  const galleryIcon = <Ionicons name='images-outline' size={ICON_SIZE} color={iconColor} />

  const cameraRow = (
    <ActionRow icon={cameraIcon} title={cameraTitle} description={cameraDescription} onPress={onCameraPress} />
  )

  const galleryRow = (
    <ActionRow icon={galleryIcon} title={galleryTitle} description={galleryDescription} onPress={onGalleryPress} />
  )

  return (
    <View className='px-4'>
      <View className='bg-card overflow-hidden rounded-3xl'>
        <View className='px-5 pb-3 pt-6'>
          <Text className='text-center text-2xl font-bold text-foreground'>{title}</Text>
          <Text className='mt-1 text-center text-base text-muted-foreground'>{subtitle}</Text>
        </View>

        <View className='border-border border-t'>
          {cameraRow}
          <View className='border-border border-t'>{galleryRow}</View>
        </View>
      </View>

      <Pressable
        className={cn('bg-card mt-4 items-center justify-center rounded-2xl px-4 py-4')}
        onPress={onCancelPress}>
        <Text className='text-lg font-semibold text-foreground'>{cancelLabel}</Text>
      </Pressable>
    </View>
  )
}
