import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { ScrollView, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { ApiError } from '@/core/api/global/errors'
import { showGlobalApiError } from '@/shared/components/layout/ApiErrorBoundary'
import { QueryErrorDisplay } from '@/shared/components/QueryErrorDisplay'
import { Button, Card, CardContent, CardHeader, Text } from '@/shared/components/ui'
import { Environment } from '@/shared/constants/Environment'
import { Routes } from '@/shared/constants/Routes'

/**
 * Internal dev route for manual error handling tests.
 *
 * Not linked from navigation on purpose.
 */
export default function DevErrorPlaygroundScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const [forcedError, setForcedError] = useState<Error | null>(null)

  useEffect(() => {
    if (!Environment.isDevelopment) {
      router.replace(Routes.Public.Login)
    }
  }, [router])

  if (!Environment.isDevelopment) {
    return null
  }

  const forceHandledError = () => {
    setForcedError(new ApiError(1002, t('common.devErrorTest.handledFallbackMessage')))
  }

  const forceGenericInlineError = () => {
    setForcedError(new Error(t('common.devErrorTest.genericInlineMessage')))
  }

  const forceGenericGlobalError = () => {
    showGlobalApiError(new Error(t('common.devErrorTest.genericRuntimeMessage')))
  }

  const clearError = () => {
    setForcedError(null)
  }

  const goBackToLogin = () => {
    router.replace(Routes.Public.Login)
  }

  return (
    <ScrollView className='flex-1 bg-background'>
      <View className='mx-4 my-8 gap-4'>
        <Text variant='h4' className='border-b-0 pb-0'>
          {t('common.devErrorTest.title')}
        </Text>

        <Text className='text-muted-foreground'>{t('common.devErrorTest.description')}</Text>

        <Card>
          <CardHeader>
            <Text variant='large'>{t('common.devErrorTest.sectionInline')}</Text>
          </CardHeader>
          <CardContent className='gap-3'>
            <Button onPress={forceHandledError}>{t('common.devErrorTest.actions.forceHandled')}</Button>
            <Button onPress={forceGenericInlineError} variant='outline'>
              {t('common.devErrorTest.actions.forceGenericInline')}
            </Button>
            <QueryErrorDisplay error={forcedError} onRetry={clearError} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Text variant='large'>{t('common.devErrorTest.sectionGlobal')}</Text>
          </CardHeader>
          <CardContent className='gap-3'>
            <Button variant='destructive' onPress={forceGenericGlobalError}>
              {t('common.devErrorTest.actions.forceGenericBoundary')}
            </Button>
            <Text className='text-muted-foreground'>{t('common.devErrorTest.globalHint')}</Text>
          </CardContent>
        </Card>

        <Button variant='outline' onPress={clearError}>
          {t('common.devErrorTest.actions.reset')}
        </Button>

        <Button variant='secondary' onPress={goBackToLogin}>
          {t('common.devErrorTest.actions.backToLogin')}
        </Button>
      </View>
    </ScrollView>
  )
}
