import { ActivityIndicator, ScrollView, View, useColorScheme } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/core/auth/AuthContext'
import { useGetMyGarments } from '@/core/query/garment'
import { getThemeColor } from '@/core/theme/themeColors'
import { Button, Card, CardContent, CardHeader, Text, QueryErrorDisplay } from '@/shared/components'
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher'

export const HomePage = () => {
  const { t } = useTranslation()
  const { signOut } = useAuth()
  const colorScheme = useColorScheme()
  const { data, isLoading, error, refetch } = useGetMyGarments()
  const loaderColor = getThemeColor('primary', colorScheme)

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
            {isLoading && <ActivityIndicator size='large' color={loaderColor} />}

            <QueryErrorDisplay error={error} onRetry={() => refetch()} />

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
