import { useRef } from 'react'
import { Image, Pressable, View, Animated } from 'react-native'
import { Card, CardTitle } from '@/shared/components/ui/card'
import { SimpleGarment } from '@/core/api/garment/models/SimpleGarment'

export const GarmentCard = ({ garment }: { garment: SimpleGarment }) => {
  const scale = useRef(new Animated.Value(1)).current;

  // Realizamos la escala ÚNICAMENTE cuando se confirma que es un tap válido
  const handlePress = () => {

    // Animación de "latido" rápido para dar confirmación visual
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
      console.log("tap rápido válido");
      // TODO: Ejecutar la acción o navegación aquí
    });
  };

  return (
    <Pressable
      className="w-[49%] mb-2"
      // Si aprietas por 200ms, se dispara onLongPress y React Native mata silenciosamente el evento onPress
      delayLongPress={200}
      onLongPress={() => {
        console.log("long press excedió 200ms, anulado");
      }}
      onPress={handlePress}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Card className="overflow-hidden p-0 gap-2">
          <View className="w-full aspect-[3/4] bg-muted">
            <Image
              source={{ uri: garment.imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          {/* 2. Información básica */}
          <View className="mb-4 px-2">
            <CardTitle className="text-sm" numberOfLines={3}>
              {garment.name || 'Sin nombre'}
            </CardTitle>
          </View>
        </Card>
      </Animated.View>
    </Pressable>
  )
}