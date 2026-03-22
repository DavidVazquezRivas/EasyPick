import '@/core/theme/global.css'
import '@/core/theme/custom.css'
import { Slot, useRouter, useSegments } from 'expo-router'
import { useEffect } from 'react'
import { AppProvider } from '@/core/providers/AppProvider'
import { useAuth } from '@/core/auth/AuthContext'
import { Routes } from '@/shared/constants/Routes'

// AuthGuard must be a child of AppProvider so it can consume useAuth

const InitialLayout = () => {
  const { isAuthenticated, isInitialized } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    // Do nothing until the context has checked the SecureStore
    if (!isInitialized) return

    // segments[0] tells us if we are in the (public) or (private) folder
    const inPublicGroup = segments[0] === '(public)'

    if (!isAuthenticated && !inPublicGroup) {
      // Guard: If not authenticated and trying to access private route -> Go to Login
      router.replace(Routes.Public.Login)
    } else if (isAuthenticated && inPublicGroup) {
      // Guard: Authenticated and trying to access public route -> Go to Home
      router.replace(Routes.Private.Home)
    }
  }, [isAuthenticated, isInitialized, segments])

  if (!isInitialized) {
    return null
  }

  // Slot will render the child route (either public or private) once the guards have done their job
  return <Slot />
}

export default function RootLayout() {
  return (
    <AppProvider>
      <InitialLayout />
    </AppProvider>
  )
}
