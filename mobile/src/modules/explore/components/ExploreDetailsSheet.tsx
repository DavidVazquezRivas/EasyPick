import { useTranslation } from 'react-i18next'
import { Image, ScrollView, View, Alert, Pressable, Modal, useColorScheme } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, Text } from '@/shared/components'
import { RecommendedGarment } from './ExploreGarmentCard'
import ChevronLeftIcon from '@/shared/components/icons/ChevronLeftIcon'
import SparklesIcon from '@/shared/components/icons/SparklesIcon'
import ShoppingBagIcon from '@/shared/components/icons/ShoppingBagIcon'
import { getThemeColor } from '@/core/theme/themeColors'

interface ExploreDetailsSheetProps {
  visible: boolean
  garment: RecommendedGarment | null
  onClose: () => void
  onAddToCloset?: (garment: RecommendedGarment) => void
}

export const ExploreDetailsSheet = ({
  visible,
  garment,
  onClose,
}: ExploreDetailsSheetProps) => {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const colorScheme = useColorScheme()
  const mutedForeground = getThemeColor('mutedForeground', colorScheme)

  if (!garment) return null

  const handleGoToStorePress = () => {
    Alert.alert(
      t('garment.exploreScreen.details.marketingAlertTitle'),
      t('garment.exploreScreen.details.marketingAlertMessage', { brand: garment.brand, price: garment.price }),
      [{ text: t('garment.exploreScreen.details.marketingAlertButton') }]
    )
  }

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType='slide'
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className='flex-1 bg-background'>
        <View className='flex-1 bg-card'>
          <ScrollView className='flex-1' contentContainerClassName='pb-10' showsVerticalScrollIndicator={false}>

            <View className='relative'>
              <View className='aspect-[3/4] w-full bg-muted'>
                <Image
                  source={{ uri: garment.imageUrl }}
                  className='h-full w-full'
                  resizeMode='cover'
                />
              </View>

              <Pressable
                className='absolute left-6 h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-md active:opacity-85'
                style={{ top: insets.top + 10 }}
                onPress={onClose}
              >
                <ChevronLeftIcon size={22} color='#1C1C1C' />
              </Pressable>

              <View
                className='absolute right-6 px-4 py-2 rounded-full bg-primary shadow-md flex-row gap-1.5 items-center'
                style={{ top: insets.top + 10 }}
              >
                <Text className='text-xs font-bold text-primary-foreground uppercase tracking-wider'>
                  {t('garment.exploreScreen.details.matchPercentage', { score: garment.matchScore })}
                </Text>
              </View>
            </View>

            <View className='px-6 pb-6 pt-2'>

              <View className='flex-row items-center justify-between border-b border-border py-5'>
                <Text className='text-base font-regular text-muted-foreground'>
                  {t('garment.detailScreen.fields.name') || 'Nombre'}
                </Text>
                <Text className='max-w-[58%] text-right text-xl font-semibold text-foreground'>
                  {t(garment.nameKey)}
                </Text>
              </View>

              <View className='flex-row items-center justify-between border-b border-border py-5'>
                <Text className='text-base font-regular text-muted-foreground'>
                  {t('garment.exploreScreen.details.category')}
                </Text>
                <Text className='max-w-[58%] text-right text-xl font-semibold text-foreground'>
                  {t(garment.category.nameKey)}
                </Text>
              </View>

              <View className='flex-row items-center justify-between border-b border-border py-5'>
                <Text className='text-base font-regular text-muted-foreground'>
                  {t('garment.exploreScreen.details.colors')}
                </Text>
                <View className='flex-row max-w-[60%] flex-wrap justify-end gap-2'>
                  {garment.colors.map((col) => (
                    <View
                      key={col.id}
                      className='flex-row items-center gap-1.5 rounded-full bg-accent/30 px-2 py-1'
                    >
                      <View
                        className='h-[12px] w-[12px] rounded-full border border-icon-inactive'
                        style={{ backgroundColor: col.hexCode }}
                      />
                      <Text className='text-sm font-semibold text-foreground'>
                        {t(`garment.detailScreen.options.colors.${col.id}`) || col.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className='flex-row items-center justify-between border-b border-border py-5'>
                <Text className='text-base font-regular text-muted-foreground'>
                  {t('garment.exploreScreen.details.idealStyle')}
                </Text>
                <Text className='max-w-[58%] text-right text-xl font-semibold text-foreground'>
                  {t(garment.style.nameKey)}
                </Text>
              </View>

              <View className='flex-row items-center justify-between border-b border-border py-5'>
                <Text className='text-base font-regular text-muted-foreground'>
                  {t('garment.exploreScreen.details.brand')}
                </Text>
                <Text className='max-w-[58%] text-right text-xl font-semibold text-foreground'>
                  {garment.brand}
                </Text>
              </View>

              <View className='flex-row items-center justify-between border-b border-border py-5'>
                <Text className='text-base font-regular text-muted-foreground'>
                  {t('garment.exploreScreen.details.price')}
                </Text>
                <Text className='max-w-[58%] text-right text-xl font-bold text-foreground'>
                  {garment.price}
                </Text>
              </View>

              <View className='bg-secondary/40 rounded-xl p-4 mt-6 border border-border/20 flex-row gap-3 items-center'>
                <View className='bg-primary/10 p-2.5 rounded-full'>
                  <SparklesIcon size={18} color={mutedForeground} />
                </View>
                <View className='flex-1'>
                  <Text className='text-xs font-bold text-muted-foreground uppercase tracking-wider'>
                    {t('garment.exploreScreen.details.whyRecommended')}
                  </Text>
                  <Text className='text-sm text-foreground mt-0.5 leading-relaxed'>
                    {t(garment.insightKey)}
                  </Text>
                </View>
              </View>

              {(garment.descriptionKey || garment.description) && (
                <View className='mt-6'>
                  <Text className='text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2'>
                    {t('garment.exploreScreen.details.description')}
                  </Text>
                  <Text className='text-sm text-muted-foreground leading-relaxed'>
                    {garment.descriptionKey ? t(garment.descriptionKey) : garment.description}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>

        <View
          className='p-4 bg-background border-t border-border/40 shadow-inner'
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <Button
            variant='default'
            className='w-full bg-primary active:bg-primary/90 rounded-xl py-3 h-12 flex-row gap-2 items-center justify-center'
            onPress={handleGoToStorePress}
          >
            <ShoppingBagIcon size={16} color='#ffffff' />
            <Text className='font-bold text-primary-foreground text-sm'>
              {t('garment.exploreScreen.details.goToStore')}
            </Text>
          </Button>
        </View>

      </View>
    </Modal>
  )
}

