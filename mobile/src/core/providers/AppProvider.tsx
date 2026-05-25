import React, { useEffect } from 'react'
import axios from 'axios'
import { AppState, Platform } from 'react-native'
import { focusManager, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { AuthProvider } from '@/core/auth/AuthContext'
import { ErrorBoundary } from '@/shared/components/layout/ErrorBoundary'
import i18next from '@/core/i18n'
import { useColorScheme } from 'nativewind'
import AsyncStorage from '@react-native-async-storage/async-storage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // React Native needs AppState + focusManager to trigger this reliably.
      refetchOnWindowFocus: true,
      // Do not retry unauthorized requests, otherwise each retry can trigger refresh again.
      retry: (failureCount, error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return false
        }

        return failureCount < 2
      },
    },
  },
})

interface AppProviderProps {
  children: React.ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const { setColorScheme } = useColorScheme()

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('app_theme')
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setColorScheme(savedTheme)
        }
      } catch (error) {
        console.error('Error loading theme:', error)
      }
    }
    loadTheme()
  }, [setColorScheme])

  useEffect(() => {
    if (Platform.OS === 'web') {
      return
    }

    const subscription = AppState.addEventListener('change', (state) => {
      focusManager.setFocused(state === 'active')
    })

    return () => {
      subscription.remove()
    }
  }, [])

  return (
    <ErrorBoundary>
      <I18nextProvider i18n={i18next}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      </I18nextProvider>
    </ErrorBoundary>
  )
}
