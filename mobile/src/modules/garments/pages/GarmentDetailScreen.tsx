import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useGetGarmentConfigs, useGetGarmentDetail } from '@/core/query/garment'
import { GarmentDetailActions } from '@/modules/garments/components/detail/GarmentDetailActions'
import { GarmentDetailHero } from '@/modules/garments/components/detail/GarmentDetailHero'
import { GarmentDetailInfoEditor } from '@/modules/garments/components/detail/GarmentDetailInfoEditor'
import { GarmentDetailInfoView } from '@/modules/garments/components/detail/GarmentDetailInfoView'
import { GarmentDetailOutfitPlaceholder } from '@/modules/garments/components/detail/GarmentDetailOutfitPlaceholder'
import { GarmentDetailTab, GarmentDetailTabs } from '@/modules/garments/components/detail/GarmentDetailTabs'
import { useGarmentDetailForm, useGarmentDetailSave } from '@/modules/garments/hooks'
import { getChipStyle, normalizeGarmentIdParam, resolveColorHex } from '@/modules/garments/utils/garmentDetail.utils'
import { QueryErrorDisplay } from '@/shared/components/QueryErrorDisplay'

export const GarmentDetailScreen = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [activeTab, setActiveTab] = useState<GarmentDetailTab>('info')

  const params = useLocalSearchParams<{ garmentId?: string | string[] }>()
  const garmentId = normalizeGarmentIdParam(params.garmentId)

  const {
    data: garmentData,
    isLoading: isLoadingGarment,
    error: garmentError,
    refetch: refetchGarment,
  } = useGetGarmentDetail(garmentId)
  const {
    data: configsData,
    isLoading: isLoadingConfigs,
    error: configsError,
    refetch: refetchConfigs,
  } = useGetGarmentConfigs(garmentId.length > 0)
  const garment = garmentData
  const configs = configsData
  const detailImageUri = garment?.imageUrl?.trim() ?? ''
  const fallbackNoName = t('garment.detailScreen.fallback.noName')
  const fallbackPending = t('garment.detailScreen.fallback.pending')

  const categories = configs?.categories ?? []
  const styles = configs?.styles ?? []
  const colors = configs?.colors ?? []
  const brands = configs?.brands ?? []

  const form = useGarmentDetailForm({
    garment,
    categories,
    styles,
    colors,
    brands,
    fallbackNoName,
    fallbackPending,
  })

  const { handleSave, isSaving } = useGarmentDetailSave({
    garmentId,
    categories,
    styles,
    colors,
    brands,
    form: {
      nameValue: form.nameValue,
      categoryId: form.categoryId,
      styleId: form.styleId,
      colorIds: form.colorIds,
      brandId: form.brandId,
      draftName: form.draftName,
      draftCategoryId: form.draftCategoryId,
      draftStyleId: form.draftStyleId,
      draftColorIds: form.draftColorIds,
      draftBrandId: form.draftBrandId,
      setDraftBrandId: form.setDraftBrandId,
      setIsEditing: form.setIsEditing,
      hydrateFromGarment: form.hydrateFromGarment,
      commitDraftToCurrent: form.commitDraftToCurrent,
    },
    refetchGarment,
    unknownErrorMessage: t('common.global.error.unknown'),
  })

  if (!garmentId) {
    return null
  }

  if (isLoadingGarment) {
    return (
      <View className='flex-1 items-center justify-center bg-background'>
        <ActivityIndicator size='large' color='#5D4037' />
      </View>
    )
  }

  return (
    <View className='flex-1 bg-background'>
      <View className='flex-1 overflow-hidden rounded-t-[36px] bg-card'>
        <ScrollView className='flex-1' contentContainerClassName='pb-10'>
          <GarmentDetailHero
            detailImageUri={detailImageUri}
            isLoadingGarment={isLoadingGarment}
            isEditing={form.isEditing}
            topInset={insets.top}
            onBackPress={() => router.back()}
            changeImageLabel={t('garment.detailScreen.actions.changeImage')}
          />

          <GarmentDetailTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            infoLabel={t('garment.detailScreen.tabs.info')}
            outfitLabel={t('garment.detailScreen.tabs.outfit')}
          />

          <QueryErrorDisplay
            error={garmentError || configsError}
            onRetry={() => {
              void refetchGarment()
              void refetchConfigs()
            }}
            className='mx-6 mt-4'
          />

          {activeTab === 'info' ?
            <View className='px-6 pb-6 pt-6'>
              <GarmentDetailActions
                isEditing={form.isEditing}
                isSaving={isSaving}
                canSave={form.draftName.trim().length > 0}
                sectionTitle={t('garment.detailScreen.sectionTitle')}
                deleteLabel={t('garment.detailScreen.actions.delete')}
                editLabel={t('garment.detailScreen.actions.edit')}
                cancelLabel={t('garment.detailScreen.actions.cancel')}
                saveLabel={t('garment.detailScreen.actions.save')}
                onEdit={form.openEditMode}
                onCancel={form.cancelEditMode}
                onSave={handleSave}
              />

              <View className='mt-4 px-0'>
                {!form.isEditing ?
                  <GarmentDetailInfoView
                    nameFieldLabel={t('garment.detailScreen.fields.name')}
                    categoryFieldLabel={t('garment.detailScreen.fields.category')}
                    styleFieldLabel={t('garment.detailScreen.fields.style')}
                    brandFieldLabel={t('garment.detailScreen.fields.brand')}
                    colorFieldLabel={t('garment.detailScreen.fields.color')}
                    nameValue={form.nameValue || fallbackNoName}
                    categoryValue={form.categoryLabel}
                    styleValue={form.styleLabel}
                    brandValue={form.brandLabelView}
                    displayedColorLabels={form.displayedColorLabels}
                    shouldStackColors={form.shouldStackColors}
                    resolveColorHex={resolveColorHex}
                  />
                : <GarmentDetailInfoEditor
                    nameLabel={t('garment.detailScreen.fields.name')}
                    categoryLabel={t('garment.detailScreen.fields.category')}
                    colorLabel={t('garment.detailScreen.fields.color')}
                    styleLabel={t('garment.detailScreen.fields.style')}
                    brandLabel={t('garment.detailScreen.fields.brand')}
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
            </View>
          : <GarmentDetailOutfitPlaceholder label={t('garment.detailScreen.outfitTodo')} />}

          {isLoadingConfigs && (
            <View className='items-center py-6'>
              <ActivityIndicator size='small' color='#5D4037' />
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  )
}
