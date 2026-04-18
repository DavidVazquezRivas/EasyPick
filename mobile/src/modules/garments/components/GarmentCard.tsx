import { useRef } from 'react'
import { Image, Pressable, View, Animated } from 'react-native'
import { Text } from '@/shared/components/ui/text'
import { Card } from '@/shared/components/ui/card'
import { SimpleGarment } from '@/core/api/garment/models/SimpleGarment'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

export const GarmentCard = ({ garment }: { garment: SimpleGarment }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const { t } = useTranslation();
  const [error, setError] = useState(false);

  const handlePress = () => {

    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.98,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 70,
        useNativeDriver: true,
      })
    ]).start(() => {
      // TODO: Ejecutar la acción o navegación aquí
    });
  };

  return (
    <Pressable
      className="w-[49%] mb-2"
      delayLongPress={200}
      onPress={handlePress}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Card className="overflow-hidden p-0 gap-2">
          <View className="w-full aspect-[3/4] bg-muted">
            {!error ? (
              <Image
                source={{ uri: garment.imageUrl }}
                className="w-full h-full"
                resizeMode="cover"
                onError={() => setError(true)}
              />
            ) : (
              <View className="w-full h-full items-center justify-center bg-muted">
                <Text variant="muted" className="text-center px-2">
                  {garment.name || t("garment.closetScreen.fallback.noName")}
                </Text>
              </View>
            )}
          </View>
        </Card>
      </Animated.View>
    </Pressable>
  )
}