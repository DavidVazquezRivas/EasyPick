import { useRouter } from 'expo-router'
import { useEffect, useMemo } from 'react'
import { Image, ScrollView, View } from 'react-native'
import { showGlobalApiError } from '@/shared/components/layout/ErrorBoundary'
import { useTranslation } from 'react-i18next'
import { usePatchGarment } from '@/core/query/garment'
import { useConfirmationFlow } from '@/modules/garments/context/ConfirmationFlowContext'
import { Routes } from '@/shared/constants/Routes'
import { Button, Text } from '@/shared/components/ui'

export const ConfirmationScreen = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { flow, currentGarment, progress, advanceConfirmationFlow, clearConfirmationFlow } = useConfirmationFlow()
  const { mutateAsync: patchGarment, isPending: isPatching } = usePatchGarment()

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
      await patchGarment({
        id: currentGarment.id,
        patch: {
          status,
        },
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

  const garmentName = currentGarment?.name || t('garment.confirmationScreen.fallback.noName')
  const categoryLabel = currentGarment?.category?.name || t('garment.confirmationScreen.fallback.pending')
  const brandLabel = currentGarment?.brand?.name || t('garment.confirmationScreen.fallback.pending')
  const styleLabel = currentGarment?.style?.name || t('garment.confirmationScreen.fallback.pending')
  const colorLabels = useMemo(
    () => currentGarment?.colors?.map((color) => color.name).filter((colorName) => colorName.trim().length > 0) || [],
    [currentGarment],
  )

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

  const colorChips = useMemo(
    () =>
      colorLabels.map((colorLabel) => (
        <View key={`color-${colorLabel}`} className='rounded-full bg-muted px-3 py-1'>
          <Text variant='small' className='text-muted-foreground'>
            {colorLabel}
          </Text>
        </View>
      )),
    [colorLabels],
  )

  if (!flow || !currentGarment || !progress) {
    return null
  }

  const progressLabel = t('garment.confirmationScreen.progress', {
    current: progress.current,
    total: progress.total,
  })

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

          <View className='mt-3 rounded-2xl border border-border bg-card p-4'>
            <View className='flex-row items-center justify-between'>
              <Text className='text-muted-foreground'>{t('garment.confirmationScreen.attributes.name')}</Text>
              <Text className='font-semibold'>{garmentName}</Text>
            </View>

            <View className='mt-3 flex-row items-center justify-between'>
              <Text className='text-muted-foreground'>{t('garment.confirmationScreen.attributes.category')}</Text>
              <View className='rounded-full bg-muted px-3 py-1'>
                <Text variant='small' className='text-muted-foreground'>
                  {categoryLabel}
                </Text>
              </View>
            </View>

            <View className='mt-3 flex-row items-center justify-between'>
              <Text className='text-muted-foreground'>{t('garment.confirmationScreen.attributes.brand')}</Text>
              <View className='rounded-full bg-muted px-3 py-1'>
                <Text variant='small' className='text-muted-foreground'>
                  {brandLabel}
                </Text>
              </View>
            </View>

            <View className='mt-3 flex-row items-center justify-between'>
              <Text className='text-muted-foreground'>{t('garment.confirmationScreen.attributes.style')}</Text>
              <View className='rounded-full bg-muted px-3 py-1'>
                <Text variant='small' className='text-muted-foreground'>
                  {styleLabel}
                </Text>
              </View>
            </View>

            <View className='mt-3'>
              <Text className='text-muted-foreground'>{t('garment.confirmationScreen.attributes.colors')}</Text>
              <View className='mt-2 flex-row flex-wrap gap-2'>
                {colorChips.length > 0 ?
                  colorChips
                : <View className='rounded-full bg-muted px-3 py-1'>
                    <Text variant='small' className='text-muted-foreground'>
                      {t('garment.confirmationScreen.fallback.pending')}
                    </Text>
                  </View>
                }
              </View>
            </View>
          </View>

          <Text className='mt-3 text-sm text-muted-foreground'>{t('garment.confirmationScreen.todo.attributes')}</Text>
        </View>
      </ScrollView>

      <View className='flex-row items-center gap-3 pb-5 pt-3'>
        <Button
          size='lg'
          variant='outline'
          className='flex-1 rounded-full'
          onPress={handleDiscard}
          disabled={isPatching}>
          {t('garment.confirmationScreen.discard')}
        </Button>

        <Button size='lg' className='flex-1 rounded-full' onPress={handleConfirm} disabled={isPatching}>
          {t('garment.confirmationScreen.create')}
        </Button>
      </View>
    </View>
  )
}
