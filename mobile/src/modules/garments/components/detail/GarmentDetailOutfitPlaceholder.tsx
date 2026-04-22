import { Ionicons } from '@expo/vector-icons'
import { View } from 'react-native'
import { Text } from '@/shared/components/ui'

type GarmentDetailOutfitPlaceholderProps = {
  label: string
}

export const GarmentDetailOutfitPlaceholder = ({ label }: GarmentDetailOutfitPlaceholderProps) => {
  return (
    <View className='items-center px-6 pt-28'>
      <Ionicons name='layers-outline' size={52} color='#B8ADA3' />
      <Text className='mt-4 text-center text-xl font-regular text-muted-foreground'>{label}</Text>
    </View>
  )
}
