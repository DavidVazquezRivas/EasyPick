import { useRef, useState } from 'react'
import { Image, Pressable, View, Animated, useColorScheme } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@/shared/components/ui/text'
import { Card } from '@/shared/components/ui/card'
import { cn } from '@/shared/utils/tailwind.utils'
import { useTranslation } from 'react-i18next'
import HeartIcon from '@/shared/components/icons/HeartIcon'
import { getThemeColor } from '@/core/theme/themeColors'

export interface RecommendedGarment {
  id: string
  nameKey: string
  name: string
  descriptionKey?: string
  description: string | null
  imageUrl: string
  brand: string
  price: string
  matchScore: number
  badgeKey?: string
  category: { id: string; nameKey: string; name: string }
  style: { id: string; nameKey: string; name: string }
  colors: { id: string; name: string; hexCode: string }[]
  insightKey: string
  insight: string
}

interface ExploreGarmentCardProps {
  garment: RecommendedGarment
  onPress: () => void
}

export const ExploreGarmentCard = ({ garment, onPress }: ExploreGarmentCardProps) => {
  const cardScale = useRef(new Animated.Value(1)).current
  const heartScale = useRef(new Animated.Value(1)).current
  const [isLiked, setIsLiked] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { t } = useTranslation()
  const colorScheme = useColorScheme()
  const iconColor = getThemeColor('foreground', colorScheme)

  const handleCardPress = () => {
    Animated.sequence([
      Animated.timing(cardScale, {
        toValue: 0.97,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start(onPress)
  }

  const handleLikePress = () => {
    setIsLiked(!isLiked)
    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.4,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start()
  }

  return (
    <Pressable className='w-[49%] mb-4' onPress={handleCardPress}>
      <Animated.View style={{ transform: [{ scale: cardScale }] }}>
        <Card className='overflow-hidden p-0 gap-0 border-border bg-card rounded-2xl shadow-sm'>

          <View className='w-full aspect-[3/4] bg-muted relative overflow-hidden'>
            {!imageError ? (
              <Image
                source={{ uri: garment.imageUrl }}
                className='w-full h-full'
                resizeMode='cover'
                onError={() => setImageError(true)}
              />
            ) : (
              <View className='w-full h-full items-center justify-center bg-muted/30 p-2'>
                <Text variant='muted' className='text-center text-xs font-semibold'>
                  {t(garment.nameKey)}
                </Text>
              </View>
            )}

            <View className='absolute top-2 left-2 flex-row flex-wrap gap-1 items-start'>
              {garment.badgeKey && (
                <View className='bg-primary px-2 py-0.5 rounded-full shadow-sm'>
                  <Text className='text-[10px] font-bold text-primary-foreground uppercase tracking-wider'>
                    {t(`garment.exploreScreen.badges.${garment.badgeKey}`)}
                  </Text>
                </View>
              )}
            </View>

            <Pressable
              className='absolute top-2 right-2 h-9 w-9 items-center justify-center rounded-full bg-secondary shadow-sm active:opacity-85'
              onPress={handleLikePress}
              hitSlop={8}
            >
              <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                <HeartIcon
                  size={20}
                  color={isLiked ? '#ef4444' : iconColor}
                  fill={isLiked ? '#ef4444' : 'none'}
                  strokeWidth={2}
                />
              </Animated.View>
            </Pressable>
          </View>

          <View className='p-3 flex flex-col gap-1'>
            <View className='flex-row justify-between items-center'>
              <Text className='text-xs text-muted-foreground font-semibold uppercase tracking-wider'>
                {garment.brand}
              </Text>
              <Text className='text-sm font-bold text-foreground'>
                {garment.matchScore}%
              </Text>
            </View>

            <Text className='text-sm font-bold text-foreground truncate' numberOfLines={1}>
              {t(garment.nameKey)}
            </Text>

            <View className='flex-row justify-between items-center mt-1'>
              <Text className='text-sm font-bold text-foreground'>
                {garment.price}
              </Text>
              <View className='flex-row gap-1 items-center'>
                {garment.colors.slice(0, 3).map((col) => (
                  <View
                    key={col.id}
                    className='w-3 h-3 rounded-full border border-border/50'
                    style={{ backgroundColor: col.hexCode }}
                  />
                ))}
              </View>
            </View>
          </View>

        </Card>
      </Animated.View>
    </Pressable>
  )
}
