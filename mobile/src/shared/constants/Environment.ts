import { z } from 'zod'

// Types
const AppEnvironments = ['DEV', 'PRE', 'PRO'] as const

type AppEnvironment = (typeof AppEnvironments)[number]

type EnvironmentConfig = Readonly<{
  APP_ENV: AppEnvironment
  API_BASE_URL: string
  isDevelopment: boolean
  isPreproduction: boolean
  isProduction: boolean
}>

// Validation
const EnvSchema = z.object({
  EXPO_PUBLIC_APP_ENV: z.enum(AppEnvironments),
  EXPO_PUBLIC_API_BASE_URL: z.string().min(1),
})

const parsedEnv = EnvSchema.safeParse(process.env)

if (!parsedEnv.success) {
  const details = parsedEnv.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')
  throw new Error(`Invalid environment variables: ${details}`)
}

const { EXPO_PUBLIC_APP_ENV: appEnvironment, EXPO_PUBLIC_API_BASE_URL: apiBaseUrl } = parsedEnv.data

// Config
export const Environment: EnvironmentConfig = {
  APP_ENV: appEnvironment,
  API_BASE_URL: apiBaseUrl,
  isDevelopment: appEnvironment === 'DEV',
  isPreproduction: appEnvironment === 'PRE',
  isProduction: appEnvironment === 'PRO',
}
