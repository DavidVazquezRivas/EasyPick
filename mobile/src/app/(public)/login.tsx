import { ActivityIndicator, View, useColorScheme } from 'react-native'
import { useTranslation } from 'react-i18next'
import { getThemeColor } from '@/core/theme/themeColors'
import { Environment } from '@/shared/constants/Environment'
import { Button, Card, CardContent, CardHeader, Text } from '@/shared/components/ui'
import { useLoginActions } from '@/core/auth/hooks/useLoginActions'

export default function LoginScreen() {
  const { t } = useTranslation()
  const colorScheme = useColorScheme()
  const { errorKey, isSubmitting, handleGoogleLogin, handleDevLogin, handleOpenDevErrorPlayground } = useLoginActions()
  const loaderColor = getThemeColor('primary', colorScheme)
  const isDevelopment = Environment.isDevelopment

  return (
    <View className='flex-1 justify-center bg-background p-5'>
      <Card>
        <CardHeader>
          <Text variant='h3'>{t('common.app.name')}</Text>
          <Text className='mt-2 text-muted-foreground'>{t('auth.login.subtitle')}</Text>
        </CardHeader>

        <CardContent>
          {errorKey ?
            <Text className='mb-3 text-destructive'>
              {t(errorKey, { defaultValue: t('auth.login.errors.signInFailed') })}
            </Text>
          : null}

          {isSubmitting ?
            <ActivityIndicator size='small' color={loaderColor} />
          : <>
              {isDevelopment ?
                <View className='gap-2'>
                  <Button onPress={handleGoogleLogin}>{t('auth.login.actions.googleLogin')}</Button>
                  <Button onPress={handleDevLogin}>{t('auth.login.actions.devLogin')}</Button>
                  <Button variant='outline' onPress={handleOpenDevErrorPlayground}>
                    {t('auth.login.actions.openDevErrorPlayground')}
                  </Button>
                </View>
              : null}
            </>
          }
        </CardContent>
      </Card>
    </View>
  )
}
