import { View, ActivityIndicator } from 'react-native'
import { useColorScheme } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Text } from '@/shared/components/ui'
import { SettingsMenuButton } from '@/shared/components/SettingsMenuButton'
import { QueryErrorDisplay } from '@/shared/components/QueryErrorDisplay'
import { GarmentGrid } from '../components/GarmentGrid'
import { useGetMyGarments } from '@/core/query/garment'
import { getThemeColor } from '@/core/theme/themeColors'


export const ClosetScreen = () => {
  const { t } = useTranslation()
  const colorScheme = useColorScheme()
  const foreground = getThemeColor('foreground', colorScheme)

  const { data: garments, isLoading, isError, error, refetch } = useGetMyGarments()

  return (
    <View className='flex-1 bg-background pt-[12%]'>
      <View className='px-[6%] pb-[5%] flex-row justify-between'>
        <Text className="text-5xl font-bold tracking-tight text-foreground">
          {t('garment.closetScreen.title')}
        </Text>
        <SettingsMenuButton />
      </View>

      <View className='flex-1'>
        {isLoading && (
          <View className='flex-1 items-center justify-center'>
            <ActivityIndicator size="large" color={foreground} />
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