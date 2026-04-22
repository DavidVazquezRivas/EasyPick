import { Ionicons } from '@expo/vector-icons'
import { ActivityIndicator, Image, Pressable, View } from 'react-native'
import { Text } from '@/shared/components/ui'

type GarmentDetailHeroProps = {
  detailImageUri: string
  isLoadingGarment: boolean
  isEditing: boolean
  topInset: number
  onBackPress: () => void
  changeImageLabel: string
}

export const GarmentDetailHero = ({
  detailImageUri,
  isLoadingGarment,
  isEditing,
  topInset,
  onBackPress,
  changeImageLabel,
}: GarmentDetailHeroProps) => {
  return (
    <View className='relative'>
      <View className='aspect-[3/4] w-full bg-muted'>
        {detailImageUri.length > 0 && <Image source={{ uri: detailImageUri }} className='h-full w-full' resizeMode='cover' />}
      </View>

      {isLoadingGarment && detailImageUri.length > 0 && (
        <View className='absolute inset-0 items-center justify-center bg-black/10'>
          <ActivityIndicator size='small' color='#FFFFFF' />
        </View>
      )}

      <Pressable
        className='absolute left-6 h-11 w-11 items-center justify-center rounded-full bg-white/95'
        style={{ top: topInset + 10 }}
        onPress={onBackPress}>
        <Ionicons name='chevron-back' size={22} color='#1C1C1C' />
      </Pressable>

      {isEditing && (
        <Pressable className='absolute inset-0 items-center justify-center bg-black/35'>
          <Ionicons name='camera-outline' size={40} color='#FFFFFF' />
          <Text className='mt-2 text-xl font-medium text-white'>{changeImageLabel}</Text>
        </Pressable>
      )}
    </View>
  )
}
