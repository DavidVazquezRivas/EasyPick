import { View, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Text } from '@/shared/components/ui'
import { GarmentGrid } from '../components/GarmentGrid'
import { useGetMyGarments } from '@/core/query/garment'
import { QueryErrorDisplay } from '@/shared/components/QueryErrorDisplay'
import { useColorScheme } from 'react-native'
import { getThemeColor } from '@/core/theme/themeColors'


export const ClosetScreen = () => {
  const { t } = useTranslation()
  const colorScheme = useColorScheme()
  const loaderColor = getThemeColor('primary', colorScheme)

  const { data: garments, isLoading, isError, error, refetch } = useGetMyGarments()

  return (
    <View className='flex-1 bg-background pt-[10%]'>
      <View className='px-6 pb-[5%]'>
        <Text className="text-5xl font-bold tracking-tight text-primary">
          {t('garment.closetScreen.title')}
        </Text>
      </View>

      <View className='flex-1'>
        {isLoading && (
          <View className='flex-1 items-center justify-center'>
            <ActivityIndicator size="large" color={loaderColor} />
          </View>
        )}

        <QueryErrorDisplay error={error} onRetry={() => refetch()} />

        {garments && !isError && !isLoading && (
          <GarmentGrid garments={garments} />
        )}
      </View>
    </View>
  )
}
