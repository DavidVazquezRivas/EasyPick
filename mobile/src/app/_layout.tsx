import '@/core/theme/global.css'
import { Slot } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { AppProvider } from '@/core/providers/AppProvider'
import { useAuthRoutingGuard } from '@/core/auth/hooks/useAuthRoutingGuard'

void WebBrowser.maybeCompleteAuthSession()

const InitialLayout = () => {
  const isInitialized = useAuthRoutingGuard()

  if (!isInitialized) {
    return null
  }

  return <Slot />
}

export default function RootLayout() {
  return (
    <AppProvider>
      <InitialLayout />
    </AppProvider>
  )
}
