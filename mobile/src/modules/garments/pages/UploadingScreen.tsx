import { ActivityIndicator, View, useColorScheme } from 'react-native'
import { useTranslation } from 'react-i18next'
import { getThemeColor } from '@/core/theme/themeColors'
import { Text } from '@/shared/components/ui'

export const UploadingScreen = () => {
  const { t } = useTranslation()
  const colorScheme = useColorScheme()
  const spinnerColor = getThemeColor('primary', colorScheme)

  const title = t('garment.uploadingScreen.title')
  const description = t('garment.uploadingScreen.description')

  return (
    <View className='flex-1 items-center justify-center bg-background px-6'>
      <ActivityIndicator size='large' color={spinnerColor} />
      <Text variant='h4' className='mt-5 border-b-0 pb-0 text-center'>
        {title}
      </Text>
      <Text className='mt-2 text-center text-muted-foreground'>{description}</Text>
    </View>
  )
}
