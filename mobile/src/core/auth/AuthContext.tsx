import React, { createContext, useContext, useState, useEffect } from 'react'
import { tokenManager } from '@/core/api/global/tokenManager'
import { eventEmitter } from '@/shared/utils/eventEmitter'
import { Events } from '@/shared/constants/Events'
import { OAuthProvider } from '@/core/auth/providers/types'

interface AuthContextType {
  isAuthenticated: boolean
  isInitialized: boolean
  signIn: (refreshToken: string) => Promise<void>
  signInWithProvider: (provider: OAuthProvider) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeAuth = async () => {
      const storedRefreshToken = await tokenManager.getRefreshToken()
      setIsAuthenticated(Boolean(storedRefreshToken))
      setIsInitialized(true)
    }

    initializeAuth()

    // Listen for token expiration events to auto-logout
    const handleTokenExpired = async () => {
      await signOut()
    }
    eventEmitter.on(Events.TokenExpired, handleTokenExpired)

    return () => {
      eventEmitter.off(Events.TokenExpired, handleTokenExpired)
    }
  }, [])

  const signIn = async (refreshToken: string) => {
    const normalizedRefreshToken = refreshToken.trim()
    if (!normalizedRefreshToken) {
      throw new Error('Refresh token is required')
    }

    tokenManager.setAccessToken(null)
    await tokenManager.setRefreshToken(normalizedRefreshToken)
    setIsAuthenticated(true)
  }

  const signInWithProvider = async (provider: OAuthProvider) => {
    const refreshToken = await provider.signIn()
    await signIn(refreshToken)
  }

  const signOut = async () => {
    await tokenManager.clearTokens()
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isInitialized, signIn, signInWithProvider, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider')
  return context
}
