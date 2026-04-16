import { z } from 'zod'

// Types
const AppEnvironments = ['DEV', 'PRE', 'PRO'] as const

type AppEnvironment = (typeof AppEnvironments)[number]

type EnvironmentConfig = Readonly<{
  APP_ENV: AppEnvironment
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
  EXPO_PUBLIC_API_BASE_URL: z.string().min(1),
  EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: z.string().min(1),
  EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID: z.string().optional().default(''),
  EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: z.string().optional().default(''),
})

const parsedEnv = EnvSchema.safeParse(process.env)

if (!parsedEnv.success) {
  const details = parsedEnv.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')
  throw new Error(`Invalid environment variables: ${details}`)
}

const {
  EXPO_PUBLIC_APP_ENV: appEnvironment,
  EXPO_PUBLIC_API_BASE_URL: apiBaseUrl,
  EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: googleWebClientId,
  EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID: googleAndroidClientId,
  EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: googleIosClientId,
} = parsedEnv.data

// Config
export const Environment: EnvironmentConfig = {
  APP_ENV: appEnvironment,
  API_BASE_URL: apiBaseUrl,
  GOOGLE_WEB_CLIENT_ID: googleWebClientId,
  GOOGLE_ANDROID_CLIENT_ID: googleAndroidClientId,
  GOOGLE_IOS_CLIENT_ID: googleIosClientId,
  isDevelopment: appEnvironment === 'DEV',
  isPreproduction: appEnvironment === 'PRE',
  isProduction: appEnvironment === 'PRO',
}
