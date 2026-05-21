import Constants from 'expo-constants'
import { Platform } from 'react-native'
import { z } from 'zod'

// Types
const AppEnvironments = ['DEV', 'PRE', 'PRO'] as const

type AppEnvironment = (typeof AppEnvironments)[number]

type EnvironmentConfig = Readonly<{
  APP_ENV: AppEnvironment
  API_HOST: string
  API_BASE_URL: string
  GOOGLE_WEB_CLIENT_ID: string
  GOOGLE_ANDROID_CLIENT_ID: string
  GOOGLE_IOS_CLIENT_ID: string
  isDevelopment: boolean
  isPreproduction: boolean
  isProduction: boolean
}>

// Validation
const EnvSchema = z.object({
  EXPO_PUBLIC_APP_ENV: z.enum(AppEnvironments),

  EXPO_PUBLIC_API_HOST: z.string().min(1),

  EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: z.string().min(1),
  EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID: z.string().optional().default(''),
  EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: z.string().optional().default(''),
})

const parsedEnv = EnvSchema.safeParse(process.env)

if (!parsedEnv.success) {
  const details = parsedEnv.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('; ')

  throw new Error(`Invalid environment variables: ${details}`)
}

const {
  EXPO_PUBLIC_APP_ENV: appEnvironment,
  EXPO_PUBLIC_API_HOST: apiHost,
  EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: googleWebClientId,
  EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID: googleAndroidClientId,
  EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: googleIosClientId,
} = parsedEnv.data

const deriveHost = () => {
  const prefersLocalhost = apiHost === 'localhost' || apiHost === '127.0.0.1'
  if (!prefersLocalhost) {
    return apiHost
  }

  if (Platform.OS === 'android') {
    return '10.0.2.2'
  }

  const debuggerHost = Constants.manifest?.debuggerHost?.split(':')[0]
  return debuggerHost ?? apiHost
}

// Derived values
const apiBaseUrl = `http://${deriveHost()}:8080/api/v1`

// Config
export const Environment: EnvironmentConfig = {
  APP_ENV: appEnvironment,
  API_HOST: apiHost,
  API_BASE_URL: apiBaseUrl,

  GOOGLE_WEB_CLIENT_ID: googleWebClientId,
  GOOGLE_ANDROID_CLIENT_ID: googleAndroidClientId,
  GOOGLE_IOS_CLIENT_ID: googleIosClientId,

  isDevelopment: appEnvironment === 'DEV',
  isPreproduction: appEnvironment === 'PRE',
  isProduction: appEnvironment === 'PRO',
}