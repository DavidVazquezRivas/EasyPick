import { useState } from 'react'
import { View, Text, Button, ActivityIndicator } from 'react-native'
import { useAuth } from '@/core/auth/AuthContext'
import { googleProvider } from '@/core/auth/providers/google'

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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>EasyPick</Text>
      <Text style={{ fontSize: 16, marginBottom: 30, color: '#666' }}>Sign in to continue</Text>

      {error ?
        <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text>
      : null}

      {isSubmitting ?
        <ActivityIndicator size='small' color='blue' />
      : <>
          {/* TODO: Replace with provider buttons once OAuth is implemented
          <Button title='Sign in with Google' onPress={handleGoogleLogin} />
          */}
          <Button title='Dev Login' onPress={handleDevLogin} />
        </>
      }
    </View>
  )
}
