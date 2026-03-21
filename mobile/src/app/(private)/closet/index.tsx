import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Text } from '@/shared/components/ui'

export default function ClosetPage() {
  const { t } = useTranslation()

  return (
    <View className='flex-1 items-center justify-center bg-background px-6'>
      <Text variant='h4' className='border-b-0 pb-0'>
        {t('common.navigation.tabs.closet')}
      </Text>
      <Text className='mt-2 text-center text-muted-foreground'>{t('common.navigation.placeholder')}</Text>
    </View>
  )
}
