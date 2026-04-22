import { useRouter } from 'expo-router'
import { useEffect, useMemo } from 'react'
import { ActivityIndicator, Image, ScrollView, View } from 'react-native'
import { showGlobalApiError } from '@/shared/components/layout/ErrorBoundary'
import { useTranslation } from 'react-i18next'
import { useGetGarmentConfigs, usePatchGarment } from '@/core/query/garment'
import { GarmentDetailInfoEditor } from '@/modules/garments/components/detail/GarmentDetailInfoEditor'
import { useConfirmationFlow } from '@/modules/garments/context/ConfirmationFlowContext'
import { useGarmentDetailForm } from '@/modules/garments/hooks'
import { getChipStyle, resolveDraftColorIds, resolveDraftConfigId } from '@/modules/garments/utils/garmentDetail.utils'
import { QueryErrorDisplay } from '@/shared/components/QueryErrorDisplay'
import { Routes } from '@/shared/constants/Routes'
import { Button, Text } from '@/shared/components/ui'

export const ConfirmationScreen = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { flow, currentGarment, progress, advanceConfirmationFlow, clearConfirmationFlow } = useConfirmationFlow()
  const { mutateAsync: patchGarment, isPending: isPatching } = usePatchGarment()
  const {
    data: configsData,
    isLoading: isLoadingConfigs,
    error: configsError,
    refetch: refetchConfigs,
  } = useGetGarmentConfigs(Boolean(flow))

  const categories = configsData?.categories ?? []
  const styles = configsData?.styles ?? []
  const colors = configsData?.colors ?? []
  const brands = configsData?.brands ?? []

  const fallbackNoName = t('garment.confirmationScreen.fallback.noName')
  const fallbackPending = t('garment.confirmationScreen.fallback.pending')

  const form = useGarmentDetailForm({
    garment: currentGarment ?? undefined,
    categories,
    styles,
    colors,
    brands,
    fallbackNoName,
    fallbackPending,
  })

  useEffect(() => {
    if (!flow || !currentGarment || !progress) {
      router.replace(Routes.Private.Garments.Closet)
    }
  }, [flow, currentGarment, progress, router])

  const processCurrentGarment = async (status: 'CONFIRMED' | 'DELETED') => {
    if (!currentGarment || !progress) {
      return
    }

    try {
      const normalizedName = form.draftName.trim()

      const patch: {
        status: 'CONFIRMED' | 'DELETED'
        name?: string
        category?: string | null
        style?: string | null
        colors?: string[]
        brand?: string | null
      } = {
        status,
      }

      if (status === 'CONFIRMED') {
        patch.name = normalizedName || fallbackNoName
        patch.category = resolveDraftConfigId(form.draftCategoryId, categories)
        patch.style = resolveDraftConfigId(form.draftStyleId, styles)
        patch.colors = resolveDraftColorIds(form.draftColorIds, colors)
        patch.brand = resolveDraftConfigId(form.draftBrandId, brands)
      }

      await patchGarment({
        id: currentGarment.id,
        patch,
      })

      const isLastGarment = progress.current >= progress.total

      if (isLastGarment) {
        clearConfirmationFlow()
        router.replace(Routes.Private.Garments.Closet)
        return
      }

      advanceConfirmationFlow()
    } catch (error) {
      const parsedError = error instanceof Error ? error : new Error(t('common.global.error.unknown'))
      showGlobalApiError(parsedError)
    }
  }

  const handleDiscard = async () => {
    await processCurrentGarment('DELETED')
  }

  const handleConfirm = async () => {
    await processCurrentGarment('CONFIRMED')
  }

  const indicatorDots = useMemo(() => {
    if (!progress) {
      return []
    }

    return Array.from({ length: progress.total }, (_, index) => {
      const isActive = index === progress.current - 1
      const dotClassName = isActive ? 'h-2.5 w-2.5 bg-primary' : 'h-2.5 w-2.5 bg-muted'

      return <View key={`confirmation-dot-${index}`} className={`${dotClassName} rounded-full`} />
    })
  }, [progress])

  if (!flow || !currentGarment || !progress) {
    return null
  }

  const progressLabel = t('garment.confirmationScreen.progress', {
    current: progress.current,
    total: progress.total,
  })
  const isActionDisabled = isPatching || isLoadingConfigs

  return (
    <View className='flex-1 bg-background px-5 pt-6'>
      <View className='flex-row items-center'>
        <Text variant='h4' className='border-b-0 pb-0'>
          {t('garment.confirmationScreen.headerTitle')}
        </Text>
      </View>

      <ScrollView className='mt-5 flex-1' contentContainerClassName='pb-6'>
        <View className='overflow-hidden rounded-2xl border border-border bg-card'>
          <Image source={{ uri: currentGarment.imageUrl }} className='aspect-[4/5] w-full' resizeMode='cover' />
        </View>

        <View className='mt-4 items-center gap-2'>
          <Text variant='small' className='uppercase tracking-[1px] text-muted-foreground'>
            {progressLabel}
          </Text>
          <View className='flex-row items-center gap-2'>{indicatorDots}</View>
        </View>

        <View className='mt-6'>
          <Text variant='small' className='uppercase tracking-[1px] text-muted-foreground'>
            {t('garment.confirmationScreen.attributes.title')}
          </Text>

          <QueryErrorDisplay
            error={configsError}
            onRetry={() => {
              void refetchConfigs()
            }}
            className='mt-3'
          />

          <View className='mt-3 rounded-2xl border border-border bg-card p-4'>
            {isLoadingConfigs ?
              <View className='items-center py-8'>
                <ActivityIndicator size='small' color='#5D4037' />
              </View>
            : <GarmentDetailInfoEditor
                nameLabel={t('garment.confirmationScreen.attributes.name')}
                categoryLabel={t('garment.confirmationScreen.attributes.category')}
                colorLabel={t('garment.confirmationScreen.attributes.colors')}
                styleLabel={t('garment.confirmationScreen.attributes.style')}
                brandLabel={t('garment.confirmationScreen.attributes.brand')}
                noNamePlaceholder={fallbackNoName}
                draftName={form.draftName}
                draftCategoryId={form.draftCategoryId}
                draftStyleId={form.draftStyleId}
                draftBrandId={form.draftBrandId}
                draftColorIds={form.draftColorIds}
                categories={categories}
                styles={styles}
                colors={colors}
                brands={brands}
                onDraftNameChange={form.setDraftName}
                onDraftCategoryChange={form.setDraftCategoryId}
                onDraftStyleChange={form.setDraftStyleId}
                onDraftBrandChange={form.setDraftBrandId}
                onDraftColorToggle={form.toggleDraftColor}
                getChipStyle={getChipStyle}
                getOptionColorHex={form.getOptionColorHex}
              />}
          </View>

          <Text className='mt-3 text-sm text-muted-foreground'>{t('garment.confirmationScreen.editHint')}</Text>
        </View>
      </ScrollView>

      <View className='flex-row items-center gap-3 pb-5 pt-3'>
        <Button
          size='lg'
          variant='outline'
          className='flex-1 rounded-full'
          onPress={handleDiscard}
          disabled={isActionDisabled}>
          {t('garment.confirmationScreen.discard')}
        </Button>

        <Button size='lg' className='flex-1 rounded-full' onPress={handleConfirm} disabled={isActionDisabled}>
          {t('garment.confirmationScreen.create')}
        </Button>
      </View>
    </View>
  )
}
