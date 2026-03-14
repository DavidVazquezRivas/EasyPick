import { useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { useAuth } from '@/core/auth/AuthContext'
import { googleProvider } from '@/core/auth/providers/google'
import { Button, Card, CardContent, CardHeader, Text } from '@/shared/components/ui'

// TODO: Remove once Google OAuth is implemented
const DEV_REFRESH_TOKEN = '11111111-1111-1111-1111-111111111111'

export default function LoginScreen() {
  const { signIn, signInWithProvider } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // TODO: Wire up once googleProvider.signIn() is implemented
  const handleGoogleLogin = async () => {
    setError(null)
    setIsSubmitting(true)
    try {
      await signInWithProvider(googleProvider)
    } catch (loginError) {
      setError('Sign in failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  // TODO: Remove once Google OAuth is implemented
  const handleDevLogin = async () => {
    setError(null)
    setIsSubmitting(true)
    try {
      await signIn(DEV_REFRESH_TOKEN)
    } catch (loginError) {
      setError('Dev login failed — check DEV_REFRESH_TOKEN in login.tsx')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <View className='flex-1 justify-center bg-background p-5'>
      <Card>
        <CardHeader>
          <Text variant='h3'>EasyPick</Text>
          <Text className='mt-2 text-muted-foreground'>Sign in to continue</Text>
        </CardHeader>

        <CardContent>
          {error ?
            <Text className='mb-3 text-destructive'>{error}</Text>
          : null}

          {isSubmitting ?
            <ActivityIndicator size='small' color='#795548' />
          : <>
              {/* TODO: Replace with provider buttons once OAuth is implemented
              <Button onPress={handleGoogleLogin}>Sign in with Google</Button>
              */}
              <Button onPress={handleDevLogin}>Dev Login</Button>
            </>
          }
        </CardContent>
      </Card>
    </View>
  )
}
