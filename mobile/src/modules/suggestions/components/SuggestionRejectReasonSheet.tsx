import { ActivityIndicator, Pressable, View } from 'react-native'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { RejectionReason } from '@/core/api/suggestion'
import { Button, Input, Text } from '@/shared/components/ui'
import { cn } from '@/shared/utils/tailwind.utils'

type SuggestionRejectReasonSheetProps = {
  reasons: RejectionReason[]
  isLoading: boolean
  isSubmitting: boolean
  hasError: boolean
  onRetryLoad: () => void
  onSelectReason: (payload: { reasonId?: string; customReason?: string }) => void
  onSkip: () => void
}

export const SuggestionRejectReasonSheet = ({
  reasons,
  isLoading,
  isSubmitting,
  hasError,
  onRetryLoad,
  onSelectReason,
  onSkip,
}: SuggestionRejectReasonSheetProps) => {
  const { t } = useTranslation()
  const [customReason, setCustomReason] = useState('')

  const trimmedCustomReason = useMemo(() => {
    const value = customReason.trim()
    return value.length > 0 ? value : undefined
  }, [customReason])

  const sendCustomReason = () => {
    if (!trimmedCustomReason || isSubmitting) return

    onSelectReason({ customReason: trimmedCustomReason })
  }

  const handleSelectReason = (reasonId: string) => {
    if (isSubmitting) return

    onSelectReason({ reasonId, customReason: trimmedCustomReason })
  }

  return (
    <View className='px-4'>
      <View className='bg-card overflow-hidden rounded-3xl px-4 pb-4 pt-3'>
        <View className='items-center pb-3 pt-1'>
          <View className='bg-muted h-1 w-12 rounded-full' />
        </View>

        <View className='px-1'>
          <Text className='text-lg font-bold text-foreground'>{t('common.suggestions.rejectSheet.title')}</Text>
          <Text className='mt-1 text-sm text-muted-foreground'>{t('common.suggestions.rejectSheet.subtitle')}</Text>
        </View>

        <View className='mt-4 gap-2'>
          {isLoading && (
            <View className='items-center justify-center py-4'>
              <ActivityIndicator />
            </View>
          )}

          {!isLoading && hasError && (
            <View className='gap-2'>
              <Text className='text-sm text-muted-foreground'>{t('common.suggestions.rejectSheet.loadError')}</Text>
              <Button variant='outline' onPress={onRetryLoad} disabled={isSubmitting} className='self-stretch'>
                {t('common.actions.retry')}
              </Button>
            </View>
          )}

          {!isLoading && !hasError && reasons.map((reason) => (
            <Pressable
              key={reason.id}
              className={cn('rounded-xl border border-border bg-muted/70 px-4 py-3', isSubmitting && 'opacity-60')}
              onPress={() => handleSelectReason(reason.id)}
              disabled={isSubmitting}>
              <Text className='text-sm font-medium text-foreground'>{reason.name}</Text>
            </Pressable>
          ))}
        </View>

        <Input
          className='mt-3 h-11 rounded-xl border-border bg-muted/60'
          placeholder={t('common.suggestions.rejectSheet.customReasonPlaceholder')}
          value={customReason}
          onChangeText={setCustomReason}
          onSubmitEditing={sendCustomReason}
          returnKeyType='send'
          blurOnSubmit
          editable={!isSubmitting}
          maxLength={180}
        />

        <Button
          className='mt-2 self-stretch'
          onPress={sendCustomReason}
          disabled={!trimmedCustomReason || isSubmitting}>
          {t('common.suggestions.rejectSheet.send')}
        </Button>
      </View>

      <Button
        variant='ghost'
        className='mt-2 self-stretch'
        onPress={onSkip}
        disabled={isSubmitting}>
        {t('common.suggestions.rejectSheet.skip')}
      </Button>
    </View>
  )
}
