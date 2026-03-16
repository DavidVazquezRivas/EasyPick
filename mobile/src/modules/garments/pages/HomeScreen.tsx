import { ActivityIndicator, ScrollView, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/core/auth/AuthContext'
import { useGetMyGarments } from '@/core/query/garment'
import { Button, Card, CardContent, CardHeader, Text } from '@/shared/components/ui'
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher'

export const HomePage = () => {
  const { t } = useTranslation()
  const { signOut } = useAuth()
  const { data, isLoading, isError, error } = useGetMyGarments()
  const translatedErrorMessage =
    error instanceof Error ? t(error.message, { defaultValue: error.message }) : t('common.global.error.unknown')

  return (
    <ScrollView className='flex-1 bg-background'>
      <View className='mx-4 my-8 gap-4'>
        <Text variant='h2'>{t('garment.home.title')}</Text>

        <LanguageSwitcher />

        <Card>
          <CardHeader>
            <Text variant='large'>{t('garment.home.apiState')}</Text>
          </CardHeader>

          <CardContent>
            {isLoading && <ActivityIndicator size='large' color='#795548' />}

            {isError && (
              <Text className='text-destructive'>
                {t('common.global.error.prefix')}: {translatedErrorMessage}
              </Text>
            )}

            {data && <Text className='text-muted-foreground'>{JSON.stringify(data, null, 2)}</Text>}
          </CardContent>
        </Card>

        <Button variant='destructive' onPress={signOut}>
          {t('common.actions.signOut')}
        </Button>
      </View>
    </ScrollView>
  )
}
