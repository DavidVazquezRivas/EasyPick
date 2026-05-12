import { ActivityIndicator, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useGetSuggestionRejectionReasons, useGetSuggestions, usePatchSuggestion } from '@/core/query/suggestion'
import { QueryErrorDisplay } from '@/shared/components/QueryErrorDisplay'
import { Button, Text } from '@/shared/components/ui'
import { getThemeColor } from '@/core/theme/themeColors'
import { useColorScheme } from 'react-native'
import { GlobalModalHost, showGlobalApiError } from '@/shared/components/layout'
import { useCurrentLocation, useSuggestionSwipeFlow, useSuggestionsFeed, useSuggestionsState } from '../hooks'
import { SuggestionOutfitCard, SuggestionRejectReasonSheet } from '../components'
import { SettingsMenuButton } from '@/shared/components/SettingsMenuButton'

export default function SuggestionsScreen() {
  const { t } = useTranslation()
  const colorScheme = useColorScheme()
  const foreground = getThemeColor('foreground', colorScheme)
  const { location, isLoading: isLocationLoading, hasPermission, error: locationError, requestLocation } =
    useCurrentLocation()
  const { data: suggestions, isLoading, error, refetch } = useGetSuggestions(location)
  const {
    data: rejectionReasons = [],
    isLoading: isLoadingRejectionReasons,
    error: rejectionReasonsError,
    refetch: refetchRejectionReasons,
  } = useGetSuggestionRejectionReasons()
  const { mutateAsync: patchSuggestion, isPending: isPatchingSuggestion } = usePatchSuggestion()
  const { currentIndex, swipeCount, currentSuggestion, totalCount, isFinished, handleSwipe } = useSuggestionsFeed(suggestions)
  const swipeFlow = useSuggestionSwipeFlow({
    patchSuggestion,
    advanceSwipe: handleSwipe,
    onError: showGlobalApiError,
  })
  const state = useSuggestionsState(
    hasPermission,
    isLocationLoading,
    isLoading,
    Boolean(error),
    totalCount,
    isFinished,
  )

  return (
    <View className='flex-1 bg-background pb-2 px-4 pt-12'>
      <View className='mb-4 flex-row items-end justify-between px-1'>
        <View>
          <Text variant='h1' className='text-left text-4xl'>
            {t('common.navigation.tabs.suggestions')}
          </Text>
          <Text variant='muted' className='mt-1'>
            {new Date().toLocaleDateString()}
          </Text>
        </View>
        <View className='flex-row items-center gap-3'>
          <View className='rounded-full bg-muted px-3 py-2'>
            <Text className='text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
              {swipeCount === 1
                ? t('common.suggestions.swipe', { count: swipeCount })
                : t('common.suggestions.swipes', { count: swipeCount })}
            </Text>
          </View>
          <SettingsMenuButton />
        </View>
      </View>

      <View className='mb-3'>
        <Text className='text-sm text-muted-foreground'>
          {t('common.suggestions.swipeHint')}
        </Text>
      </View>

      <View className='flex-1'>
        {state.showPermissionState && (
          <View className='flex-1 items-center justify-center rounded-[32px] border border-border bg-card px-6 py-10'>
            <Text variant='h4' className='border-b-0 text-center pb-0'>
              {t('common.suggestions.permissionTitle')}
            </Text>
            <Text className='mt-2 text-center text-muted-foreground'>
              {t('common.suggestions.permissionBody')}
            </Text>
            <Button onPress={() => void requestLocation()} className='mt-6 self-stretch'>
              {t('common.suggestions.permissionAction')}
            </Button>
            {locationError && (
              <Text className='mt-4 text-center text-sm text-destructive'>{locationError}</Text>
            )}
          </View>
        )}

        {state.showLoadingState && (
          <View className='flex-1 items-center justify-center rounded-[32px] border border-border bg-card'>
            <ActivityIndicator size='large' color={foreground} />
            <Text className='mt-4 text-center text-muted-foreground'>{t('common.suggestions.loading')}</Text>
          </View>
        )}

        {state.showErrorState && (
          <QueryErrorDisplay error={error} onRetry={() => refetch()} className='mx-0 flex-1' />
        )}

        {state.showCardState && currentSuggestion && (
          <SuggestionOutfitCard
            key={currentSuggestion.id}
            outfit={currentSuggestion}
            index={currentIndex}
            total={totalCount}
            onSwipe={(direction, outfitId) => {
              void swipeFlow.onCardSwipe(direction, outfitId)
            }}
          />
        )}

        {state.showFinishedState && (
          <View className='flex-1 items-center justify-center rounded-[32px] border border-border bg-card px-6 py-10'>
            <Text variant='h4' className='border-b-0 text-center pb-0'>
              {t('common.suggestions.exhausted')}
            </Text>
          </View>
        )}

        {state.showEmptyState && (
          <View className='flex-1 items-center justify-center rounded-[32px] border border-border bg-card px-6 py-10'>
            <Text variant='h4' className='border-b-0 text-center pb-0'>
              {t('common.suggestions.exhausted')}
            </Text>
          </View>
        )}
      </View>

      <GlobalModalHost
        visible={swipeFlow.rejectModalVisible}
        onClose={() => {
          void swipeFlow.onRejectSkip()
        }}>
        <SuggestionRejectReasonSheet
          reasons={rejectionReasons}
          isLoading={isLoadingRejectionReasons}
          isSubmitting={isPatchingSuggestion}
          hasError={Boolean(rejectionReasonsError)}
          onRetryLoad={() => {
            void refetchRejectionReasons()
          }}
          onSelectReason={({ reasonId, customReason }) => {
            void swipeFlow.onRejectSubmit({ reasonId, customReason })
          }}
          onSkip={() => {
            void swipeFlow.onRejectSkip()
          }}
        />
      </GlobalModalHost>
    </View>
  )
}
