import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Text } from '@/shared/components/ui'

export const ConfirmationScreen = () => {
  const { t } = useTranslation()

  return (
    <View className='flex-1 items-center justify-center bg-background px-6'>
      <Text variant='h4' className='border-b-0 pb-0'>
        {t('garment.confirmationScreen.title')}
      </Text>
      <Text className='mt-2 text-center text-muted-foreground'>{t('garment.confirmationScreen.description')}</Text>
    </View>
  )
}
