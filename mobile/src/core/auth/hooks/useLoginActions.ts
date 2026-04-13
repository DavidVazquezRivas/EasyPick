import { useState } from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from '@/core/auth/AuthContext'
import { googleProvider } from '@/core/auth/providers/google'
import { ApiError, AppError } from '@/core/api/global/errors'
import { Routes } from '@/shared/constants/Routes'

const DEV_REFRESH_TOKEN = '11111111-1111-1111-1111-111111111111'

const resolveLoginErrorKey = (error: unknown) => {
  if (error instanceof AppError) {
    return error.translationKey
  }

  if (error instanceof ApiError) {
    return `common.api.errors.backendCodes.${error.code}`
  }

  if (error instanceof Error && error.message.startsWith('auth.')) {
    return error.message
  }

  return 'auth.login.errors.signInFailed'
}

export const useLoginActions = () => {
  const router = useRouter()
  const { signIn, signInWithProvider } = useAuth()
  const [errorKey, setErrorKey] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleGoogleLogin = async () => {
    setErrorKey(null)
    setIsSubmitting(true)
    try {
      await signInWithProvider(googleProvider)
    } catch (error) {
      setErrorKey(resolveLoginErrorKey(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDevLogin = async () => {
    setErrorKey(null)
    setIsSubmitting(true)
    try {
      await signIn(DEV_REFRESH_TOKEN)
    } catch (error) {
      setErrorKey(resolveLoginErrorKey(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenDevErrorPlayground = () => {
    router.push(Routes.Public.DevErrorPlayground)
  }

  return {
    errorKey,
    isSubmitting,
    handleGoogleLogin,
    handleDevLogin,
    handleOpenDevErrorPlayground,
  }
}