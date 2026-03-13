import React from 'react'
import axios from 'axios'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/core/auth/AuthContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
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
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  )
}
