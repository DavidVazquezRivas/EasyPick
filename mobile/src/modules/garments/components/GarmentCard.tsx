import { useRef } from 'react'
import { Image, Pressable, View, Animated } from 'react-native'
import { useRouter } from 'expo-router'
import { Card, CardTitle } from '@/shared/components/ui/card'
import { SimpleGarment } from '@/core/api/garment/models/SimpleGarment'
import { useTranslation } from 'react-i18next'
import { Routes } from '@/shared/constants/Routes'

export const GarmentCard = ({ garment }: { garment: SimpleGarment }) => {
  const scale = useRef(new Animated.Value(1)).current
  const { t } = useTranslation()
  const router = useRouter()

  const imageUri = garment.imageUrl?.trim() ?? ''
  const garmentId = garment.id

  const handlePress = () => {
    Animated.timing(scale, {
      toValue: 0.95,
      duration: 70,
      useNativeDriver: true,
    }).start(() => {
      if (!garmentId) return

      router.push(Routes.Private.Garments.Detail(garmentId))

      Animated.timing(scale, {
        toValue: 1,
        duration: 70,
        useNativeDriver: true,
      }).start()
    })
  }

  return (
    <Pressable
      className="w-[49%] mb-2"
      onPress={handlePress}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Card className="overflow-hidden p-0 gap-2">
          <View className="w-full aspect-[3/4] bg-muted">
            {imageUri.length > 0 && (
              <Image
                source={{ uri: imageUri }}
                className="w-full h-full"
                resizeMode="cover"
              />
            )}
          </View>
          <View className="mb-4 px-2">
            <CardTitle className="text-sm" numberOfLines={3}>
              {garment.name || t('garment.closetScreen.fallback.noName')}
            </CardTitle>
          </View>
        </Card>
      </Animated.View>
    </Pressable>
  )
}