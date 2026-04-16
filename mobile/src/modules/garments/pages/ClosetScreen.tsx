import { View, ActivityIndicator, Pressable } from 'react-native'
import { useState } from 'react';
import { useColorScheme } from 'react-native'
import Svg, { Path, Circle } from 'react-native-svg';
import { useTranslation } from 'react-i18next'
import { Text } from '@/shared/components/ui'
import { Button } from '@/shared/components/ui/button'
import { QueryErrorDisplay } from '@/shared/components/QueryErrorDisplay'
import { GarmentGrid } from '../components/GarmentGrid'
import { SettingsDropdown } from '../components'
import { useGetMyGarments } from '@/core/query/garment'
import { getThemeColor } from '@/core/theme/themeColors'


export const ClosetScreen = () => {
  const { t } = useTranslation()
  const colorScheme = useColorScheme()
  const foreground = getThemeColor('foreground', colorScheme)
  const [isSettingsOn, setSettingsOn] = useState(false);

  const { data: garments, isLoading, isError, error, refetch } = useGetMyGarments()

  return (
    <View className='flex-1 bg-background pt-[12%]'>
      <View className='px-[6%] pb-[5%] flex-row justify-between'>
        <Text className="text-5xl font-bold tracking-tight text-foreground">
          {t('garment.closetScreen.title')}
        </Text>
        <Button onPress={() => setSettingsOn(!isSettingsOn)} variant="secondary" size="icon" className='active:scale-90 rounded-full'>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={foreground} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <Circle cx="12" cy="12" r="3" />
          </Svg>
        </Button>
      </View>

      {isSettingsOn && (
        <>
          <Pressable 
            className="absolute top-0 bottom-0 left-0 right-0 z-40 bg-transparent"
            onPress={() => setSettingsOn(false)}
          />
          <SettingsDropdown />
        </>
      )}

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