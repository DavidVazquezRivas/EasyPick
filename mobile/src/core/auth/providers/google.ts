import Constants from 'expo-constants'
import { Platform } from 'react-native'
import { AppError } from '@/core/api/global/errors'
import { AuthGateway } from '@/core/api/auth/AuthGateway'
import { AuthTokens } from '@/core/auth/models/AuthTokens'
import { Environment } from '@/shared/constants/Environment'
import { OAuthProvider } from './types'

const GOOGLE_SCOPES = ['openid', 'email', 'profile'] as const
let isGoogleSigninConfigured = false

type GoogleSigninModule = {
  GoogleSignin: {
    configure: (config: {
      webClientId: string
      iosClientId?: string
      scopes: string[]
    }) => void
    hasPlayServices: (options: { showPlayServicesUpdateDialog: boolean }) => Promise<void>
    signIn: () => Promise<{
      type: string
      data: {
        idToken: string | null
      }
    }>
  }
  isErrorWithCode: (error: unknown) => error is { code: string }
  statusCodes: {
    SIGN_IN_CANCELLED: string
    PLAY_SERVICES_NOT_AVAILABLE: string
  }
}

let googleSigninModule: GoogleSigninModule | null = null

const getGoogleSigninModule = (): GoogleSigninModule => {
  if (googleSigninModule) {
    return googleSigninModule
  }

  try {
    googleSigninModule = require('@react-native-google-signin/google-signin') as GoogleSigninModule
    return googleSigninModule
  } catch {
    throw new AppError('auth.login.errors.googleExpoGoNotSupported')
  }
}

const configureGoogleSignin = () => {
  if (isGoogleSigninConfigured) {
    return
  }

  const { GoogleSignin } = getGoogleSigninModule()

  GoogleSignin.configure({
    webClientId: Environment.GOOGLE_WEB_CLIENT_ID,
    iosClientId: Environment.GOOGLE_IOS_CLIENT_ID || undefined,
    scopes: [...GOOGLE_SCOPES],
  })

  isGoogleSigninConfigured = true
}

const resolveNativeIdToken = async () => {
  const { GoogleSignin, isErrorWithCode, statusCodes } = getGoogleSigninModule()

  try {
    if (Platform.OS === 'android') {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
    }

    const response = await GoogleSignin.signIn()
    if (response.type === 'cancelled') {
      throw new AppError('auth.login.errors.googleCancelled')
    }

    const idToken = response.data.idToken
    if (typeof idToken !== 'string' || !idToken.trim()) {
      throw new AppError('auth.login.errors.googleMissingIdToken')
    }

    return idToken
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }

    if (isErrorWithCode(error)) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new AppError('auth.login.errors.googleCancelled')
      }

      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new AppError('auth.login.errors.googlePlayServicesUnavailable')
      }
    }

    throw new AppError('auth.login.errors.googleSignInFailed')
  }
}

export const googleProvider: OAuthProvider = {
  id: 'google',
  displayName: 'Google',
  signIn: async (): Promise<string | AuthTokens> => {
    if (Constants.appOwnership === 'expo') {
      throw new AppError('auth.login.errors.googleExpoGoNotSupported')
    }

    if (Platform.OS === 'web') {
      throw new AppError('auth.login.errors.googleNativeNotSupportedOnWeb')
    }

    if (!Environment.GOOGLE_WEB_CLIENT_ID.trim()) {
      throw new AppError('auth.errors.googleClientIdMissing')
    }

    if (Platform.OS === 'android' && !Environment.GOOGLE_ANDROID_CLIENT_ID.trim()) {
      throw new AppError('auth.errors.googleAndroidClientIdMissing')
    }

    if (Platform.OS === 'ios' && !Environment.GOOGLE_IOS_CLIENT_ID.trim()) {
      throw new AppError('auth.errors.googleIosClientIdMissing')
    }

    configureGoogleSignin()
    const idToken = await resolveNativeIdToken()
    return AuthGateway.signInWithGoogle(idToken)
  },
}
