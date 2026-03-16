import { useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/core/auth/AuthContext'
import { googleProvider } from '@/core/auth/providers/google'
import { Button, Card, CardContent, CardHeader, Text } from '@/shared/components/ui'

// TODO: Remove once Google OAuth is implemented
const DEV_REFRESH_TOKEN = '11111111-1111-1111-1111-111111111111'

export default function LoginScreen() {
  const { t } = useTranslation()
  const { signIn, signInWithProvider } = useAuth()
  const [errorKey, setErrorKey] = useState<
    'auth.login.errors.signInFailed' | 'auth.login.errors.devLoginFailed' | null
  >(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // TODO: Wire up once googleProvider.signIn() is implemented
  const handleGoogleLogin = async () => {
    setErrorKey(null)
    setIsSubmitting(true)
    try {
      await signInWithProvider(googleProvider)
    } catch (loginError) {
      setErrorKey('auth.login.errors.signInFailed')
    } finally {
      setIsSubmitting(false)
    }
  }

  // TODO: Remove once Google OAuth is implemented
  const handleDevLogin = async () => {
    setErrorKey(null)
    setIsSubmitting(true)
    try {
      await signIn(DEV_REFRESH_TOKEN)
    } catch (loginError) {
      setErrorKey('auth.login.errors.devLoginFailed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <View className='flex-1 justify-center bg-background p-5'>
      <Card>
        <CardHeader>
          <Text variant='h3'>{t('common.app.name')}</Text>
          <Text className='mt-2 text-muted-foreground'>{t('auth.login.subtitle')}</Text>
        </CardHeader>

        <CardContent>
          {errorKey ?
            <Text className='mb-3 text-destructive'>{t(errorKey)}</Text>
          : null}

          {isSubmitting ?
            <ActivityIndicator size='small' color='#795548' />
          : <>
              {/* TODO: Replace with provider buttons once OAuth is implemented
              <Button onPress={handleGoogleLogin}>{t('auth.login.actions.googleLogin')}</Button>
              */}
              <Button onPress={handleDevLogin}>{t('auth.login.actions.devLogin')}</Button>
            </>
          }
        </CardContent>
      </Card>
    </View>
  )
}
