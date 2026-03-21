import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Text } from '@/shared/components/ui'
import { View } from 'react-native'
import { ApiError } from '@/core/api/global/errors'

interface QueryErrorDisplayProps {
  error: Error | null | undefined
  onRetry?: () => void
  className?: string
}

/**
 * Inline error display component for TanStack Query errors.
 *
 * Maps ApiError codes to i18n keys: common.api.errors.backendCodes.{code}
 * Provides optional retry button.
 *
 * Usage in screens:
 *   const { data, error, refetch } = useGetMyGarments()
 *   return (
 *     <>
 *       <QueryErrorDisplay error={error} onRetry={() => refetch()} />
 *       {data && <ListComponent items={data} />}
 *     </>
 *   )
 */
export const QueryErrorDisplay: React.FC<QueryErrorDisplayProps> = ({ error, onRetry, className }) => {
  const { t } = useTranslation()

  if (!error) return null

  let displayMessage = error.message
  let errorCode: number | null = null

  // Extract code and try to get i18n translation
  if (error instanceof ApiError) {
    errorCode = error.code
    const i18nKey = `common.api.errors.backendCodes.${errorCode}`
    const translatedMessage = t(i18nKey, { defaultValue: error.message })
    displayMessage = translatedMessage
  }

  return (
    <View className={`rounded-lg border border-destructive bg-destructive/10 p-4 gap-3 ${className || ''}`}>
      <View>
        <Text variant='large' className='text-destructive font-semibold'>
          {t('common.global.error.prefix')}
          {errorCode && ` (${errorCode})`}
        </Text>
        <Text className='text-destructive/80 mt-1'>{displayMessage}</Text>
      </View>

      {onRetry && (
        <Button onPress={onRetry} variant='outline' className='self-start'>
          {t('common.actions.retry')}
        </Button>
      )}
    </View>
  )
}
