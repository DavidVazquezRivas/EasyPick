import { useEffect } from 'react'
import { useRouter, useSegments } from 'expo-router'
import { Routes } from '@/shared/constants/Routes'
import { useAuth } from '@/core/auth/AuthContext'

export const useAuthRoutingGuard = () => {
  const { isAuthenticated, isInitialized } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (!isInitialized) return

    const inPublicGroup = segments[0] === '(public)'

    if (!isAuthenticated && !inPublicGroup) {
      router.replace(Routes.Public.Login)
      return
    }

    if (isAuthenticated && inPublicGroup) {
      router.replace(Routes.Private.Home)
    }
  }, [isAuthenticated, isInitialized, router, segments])

  return isInitialized
}