import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Image, Pressable, ScrollView, TextInput, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useGetGarmentConfigs, useGetGarmentDetail, usePatchGarment } from '@/core/query/garment'
import { CompleteGarment, Color } from '@/core/api/garment/models/CompleteGarment'
import { ConfigItem } from '@/core/api/garment/models/GarmentConfigs'
import { QueryErrorDisplay } from '@/shared/components/QueryErrorDisplay'
import { showGlobalApiError } from '@/shared/components/layout/ErrorBoundary'
import { Text } from '@/shared/components/ui'

type DetailTab = 'info' | 'outfit'

type GarmentPatchPayload = {
  name?: string
  category?: string | null
  style?: string | null
  colors?: string[]
  brand?: string | null
  status?: 'CONFIRMED'
}

const getParam = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] ?? ''
  }

  return value ?? ''
}

const normalizeGarmentIdParam = (value: string | string[] | undefined) => {
  const rawValue = getParam(value).trim()

  if (!rawValue) {
    return ''
  }

  const invalidValues = new Set(['undefined', 'null', '[garmentId]', ':garmentId'])
  if (invalidValues.has(rawValue.toLowerCase())) {
    return ''
  }

  try {
    return decodeURIComponent(rawValue)
  } catch {
    return rawValue
  }
}

const COLOR_HEX_BY_NAME: Record<string, string> = {
  blanco: '#FFFFFF',
  negro: '#1C1C1C',
  beige: '#D9CEBC',
  azul: '#3B82F6',
  marron: '#9A6A3A',
  marron2: '#9A6A3A',
  gris: '#94A3B8',
  rojo: '#EF4444',
  verde: '#22C55E',
  white: '#FFFFFF',
  black: '#1C1C1C',
  blue: '#3B82F6',
  brown: '#9A6A3A',
  gray: '#94A3B8',
  grey: '#94A3B8',
  red: '#EF4444',
  green: '#22C55E',
}

const normalizeText = (value: unknown) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const normalizeId = (value: unknown) => String(value ?? '').trim()

const resolveColorHex = (name: string) => COLOR_HEX_BY_NAME[normalizeText(name)] ?? '#B09880'

const getConfigNameById = (id: string, items: ConfigItem[]) => {
  const normalizedId = normalizeId(id)
  if (!normalizedId) {
    return ''
  }

  return items.find((item) => normalizeId(item.id) === normalizedId)?.name ?? ''
}

type RawConfigRef = { id?: unknown; name?: unknown } | string | null | undefined

const getRefId = (value: RawConfigRef) => {
  if (!value) {
    return ''
  }

  if (typeof value === 'string') {
    return normalizeId(value)
  }

  return normalizeId(value.id)
}

const getRefName = (value: RawConfigRef) => {
  if (!value) {
    return ''
  }

  if (typeof value === 'string') {
    return normalizeId(value)
  }

  return normalizeId(value.name)
}

const resolveConfigId = (value: RawConfigRef, options: ConfigItem[]) => {
  const rawId = normalizeId(getRefId(value))
  if (!rawId) {
    return ''
  }

  const matchById = options.find((option) => normalizeId(option.id) === rawId)
  if (matchById) {
    return normalizeId(matchById.id)
  }

  const matchByName = options.find((option) => normalizeText(option.name) === normalizeText(rawId))
  return normalizeId(matchByName?.id)
}

const isConfigId = (id: string, options: ConfigItem[]) => {
  const normalizedId = normalizeId(id)
  return options.some((option) => normalizeId(option.id) === normalizedId)
}

const resolveDraftConfigId = (draftId: string, options: ConfigItem[]) => {
  const normalizedDraftId = normalizeId(draftId)
  if (!normalizedDraftId) {
    return null
  }

  if (isConfigId(normalizedDraftId, options)) {
    return normalizedDraftId
  }

  const byName = options.find((option) => normalizeText(option.name) === normalizeText(normalizedDraftId))
  return normalizeId(byName?.id) || null
}

const resolveDraftColorIds = (draftIds: string[], options: ConfigItem[]) =>
  draftIds
    .map((draftId) => resolveDraftConfigId(draftId, options))
    .filter((id): id is string => Boolean(id))

const getColorIdsFromRaw = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => {
      if (typeof item === 'string') {
        return item
      }

      if (item && typeof item === 'object' && 'id' in item) {
        const idValue = (item as { id?: unknown }).id
        return normalizeId(idValue)
      }

      return ''
    })
    .filter((id) => id.length > 0)
}

export const GarmentDetailScreen = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [activeTab, setActiveTab] = useState<DetailTab>('info')
  const [isEditing, setIsEditing] = useState(false)

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
  const { mutateAsync: patchGarment, isPending: isSaving } = usePatchGarment()

  const garment = garmentData as CompleteGarment | undefined
  const configs = configsData
  const detailImageUri = garment?.imageUrl?.trim() ?? ''

  const categories = configs?.categories ?? []
  const styles = configs?.styles ?? []
  const colors = configs?.colors ?? []

  const [nameValue, setNameValue] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [styleId, setStyleId] = useState('')
  const [colorIds, setColorIds] = useState<string[]>([])
  const [brandLabel, setBrandLabel] = useState('')

  const [draftName, setDraftName] = useState('')
  const [draftCategoryId, setDraftCategoryId] = useState('')
  const [draftStyleId, setDraftStyleId] = useState('')
  const [draftColorIds, setDraftColorIds] = useState<string[]>([])

  useEffect(() => {
    if (!garment || isEditing) {
      return
    }

    const rawCategory = garment.category as unknown as RawConfigRef
    const rawStyle = garment.style as unknown as RawConfigRef
    const rawBrand = garment.brand as unknown as RawConfigRef

    const nextName = garment.name?.trim() || t('garment.detailScreen.fallback.noName')
    const nextCategoryId = resolveConfigId(rawCategory, configs?.categories ?? []) || getRefId(rawCategory)
    const nextStyleId = resolveConfigId(rawStyle, configs?.styles ?? []) || getRefId(rawStyle)
    const nextColorIds = getColorIdsFromRaw(garment.colors)
    const brandNameFromObject = getRefName(rawBrand)
    const brandIdFromRaw = getRefId(rawBrand)
    const brandNameFromConfig = getConfigNameById(brandIdFromRaw, configs?.brands ?? [])
    const nextBrandLabel = (brandNameFromObject || brandNameFromConfig || '').trim() || t('garment.detailScreen.fallback.pending')

    setNameValue(nextName)
    setCategoryId(nextCategoryId)
    setStyleId(nextStyleId)
    setColorIds(nextColorIds)
    setBrandLabel(nextBrandLabel)

    setDraftName(nextName)
    setDraftCategoryId(nextCategoryId)
    setDraftStyleId(nextStyleId)
    setDraftColorIds(nextColorIds)
  }, [configs?.brands, configs?.categories, configs?.styles, garment, isEditing, t])

  const categoryLabel = useMemo(() => {
    const rawCategory = garment?.category as unknown as RawConfigRef
    const fromGarment = getRefName(rawCategory)
    if (fromGarment) {
      return fromGarment
    }

    const fromConfigs = getConfigNameById(categoryId, categories)
    if (fromConfigs) {
      return fromConfigs
    }

    return t('garment.detailScreen.fallback.pending')
  }, [categories, categoryId, garment?.category, t])

  const styleLabel = useMemo(() => {
    const rawStyle = garment?.style as unknown as RawConfigRef
    const fromGarment = getRefName(rawStyle)
    if (fromGarment) {
      return fromGarment
    }

    const fromConfigs = getConfigNameById(styleId, styles)
    if (fromConfigs) {
      return fromConfigs
    }

    return t('garment.detailScreen.fallback.pending')
  }, [garment?.style, styleId, styles, t])

  const primaryColorLabel = useMemo(() => {
    const firstRawColor = Array.isArray(garment?.colors) ? garment?.colors[0] : null
    if (firstRawColor && typeof firstRawColor === 'object' && 'name' in firstRawColor) {
      const colorName = (firstRawColor as Color).name?.trim()
      if (colorName) {
        return colorName
      }
    }

    if (colorIds.length === 0) {
      return t('garment.detailScreen.fallback.pending')
    }

    const firstColorId = colorIds[0]
    const fromConfigs = getConfigNameById(firstColorId, colors)
    if (fromConfigs) {
      return fromConfigs
    }

    return t('garment.detailScreen.fallback.pending')
  }, [colorIds, colors, garment?.colors, t])

  const primaryColorHex = useMemo(() => resolveColorHex(primaryColorLabel), [primaryColorLabel])

  const openEditMode = () => {
    setDraftName(nameValue)
    setDraftCategoryId(categoryId)
    setDraftStyleId(styleId)
    setDraftColorIds(colorIds)
    setIsEditing(true)
  }

  const cancelEditMode = () => {
    setDraftName(nameValue)
    setDraftCategoryId(categoryId)
    setDraftStyleId(styleId)
    setDraftColorIds(colorIds)
    setIsEditing(false)
  }

  const toggleDraftColor = (id: string) => {
    setDraftColorIds((currentColors) => {
      if (currentColors.includes(id)) {
        if (currentColors.length === 1) {
          return currentColors
        }

        return currentColors.filter((colorId) => colorId !== id)
      }

      return [...currentColors, id]
    })
  }

  const handleSave = async () => {
    const normalizedName = draftName.trim()
    if (!normalizedName || !garmentId) {
      return
    }

    try {
      const patch: GarmentPatchPayload = {}

      const resolvedDraftCategoryId = resolveDraftConfigId(draftCategoryId, categories)
      const resolvedDraftStyleId = resolveDraftConfigId(draftStyleId, styles)
      const resolvedDraftColorIds = resolveDraftColorIds(draftColorIds, colors)
      
      const resolvedCurrentCategoryId = resolveDraftConfigId(categoryId, categories)
      const resolvedCurrentStyleId = resolveDraftConfigId(styleId, styles)
      const resolvedCurrentColorIds = resolveDraftColorIds(colorIds, colors)
      const resolvedBrandId = resolveDraftConfigId(getRefId(garment?.brand as unknown as RawConfigRef), configs?.brands ?? [])

      if (normalizedName !== nameValue.trim()) {
        patch.name = normalizedName
      }

      const draftColorIdsKey = resolvedDraftColorIds.join('|')
      const currentColorIdsKey = resolvedCurrentColorIds.join('|')
      
      const hasCategoryChanged = (resolvedDraftCategoryId ?? '') !== (resolvedCurrentCategoryId ?? '')
      const hasStyleChanged = (resolvedDraftStyleId ?? '') !== (resolvedCurrentStyleId ?? '')
      const hasColorsChanged = draftColorIdsKey !== currentColorIdsKey

      if (hasCategoryChanged) {
        patch.category = resolvedDraftCategoryId
      }

      if (hasStyleChanged) {
        patch.style = resolvedDraftStyleId
      }

      if (hasColorsChanged) {
        patch.colors = resolvedDraftColorIds.length > 0 ? resolvedDraftColorIds : []
      }


      patch.brand = resolvedBrandId

      patch.status = 'CONFIRMED'

      if (Object.keys(patch).length === 0) {
        setIsEditing(false)
        return
      }

      await patchGarment({
        id: garmentId,
        patch,
      })

      const refreshedGarment = await refetchGarment()
      const latestGarment = refreshedGarment.data

      if (latestGarment) {
        setNameValue(latestGarment.name?.trim() || normalizedName)

        const latestCategory = latestGarment.category as unknown as RawConfigRef
        const latestStyle = latestGarment.style as unknown as RawConfigRef

        setCategoryId(resolveConfigId(latestCategory, categories) || getRefId(latestCategory))
        setStyleId(resolveConfigId(latestStyle, styles) || getRefId(latestStyle))
        setColorIds(getColorIdsFromRaw(latestGarment.colors))

        const brandRaw = latestGarment.brand as unknown as RawConfigRef
        setBrandLabel(
          (getRefName(brandRaw) || getConfigNameById(getRefId(brandRaw), configs?.brands ?? [])).trim() ||
            t('garment.detailScreen.fallback.pending'),
        )
      } else {
        setNameValue(normalizedName)
        setCategoryId(draftCategoryId)
        setStyleId(draftStyleId)
        setColorIds(draftColorIds)
      }

      setDraftName(normalizedName)
      setDraftCategoryId(draftCategoryId)
      setDraftStyleId(draftStyleId)
      setDraftColorIds(draftColorIds)
      setIsEditing(false)

    } catch (error) {
      const parsedError = error instanceof Error ? error : new Error(t('common.global.error.unknown'))
      showGlobalApiError(parsedError)
    }
  }

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
          <View className='relative'>
            <View className='aspect-[3/4] w-full bg-muted'>
              {detailImageUri.length > 0 && (
                <Image source={{ uri: detailImageUri }} className='h-full w-full' resizeMode='cover' />
              )}
            </View>

            {isLoadingGarment && detailImageUri.length > 0 && (
              <View className='absolute inset-0 items-center justify-center bg-black/10'>
                <ActivityIndicator size='small' color='#FFFFFF' />
              </View>
            )}

            <Pressable
              className='absolute left-6 h-11 w-11 items-center justify-center rounded-full bg-white/95'
              style={{ top: insets.top + 10 }}
              onPress={() => router.back()}>
              <Ionicons name='chevron-back' size={22} color='#1C1C1C' />
            </Pressable>

            {isEditing && (
              <Pressable className='absolute inset-0 items-center justify-center bg-black/35'>
                <Ionicons name='camera-outline' size={40} color='#FFFFFF' />
                <Text className='mt-2 text-xl font-medium text-white'>{t('garment.detailScreen.actions.changeImage')}</Text>
              </Pressable>
            )}
          </View>

          <View className='bg-card'>
            <View className='flex-row border-b border-border'>
              <Pressable
                className='flex-1 items-center pb-3 pt-4'
                onPress={() => setActiveTab('info')}
                accessibilityRole='tab'
                accessibilityState={{ selected: activeTab === 'info' }}>
                <Text className={activeTab === 'info' ? 'text-md font-semibold text-foreground' : 'text-md text-muted-foreground'}>
                  {t('garment.detailScreen.tabs.info')}
                </Text>
                <View className={`mt-4 h-[2px] w-full ${activeTab === 'info' ? 'bg-foreground' : 'bg-transparent'}`} />
              </Pressable>

              <Pressable
                className='flex-1 items-center pb-3 pt-4'
                onPress={() => setActiveTab('outfit')}
                accessibilityRole='tab'
                accessibilityState={{ selected: activeTab === 'outfit' }}>
                <Text className={activeTab === 'outfit' ? 'text-md font-semibold text-foreground' : 'text-md text-muted-foreground'}>
                  {t('garment.detailScreen.tabs.outfit')}
                </Text>
                <View className={`mt-4 h-[2px] w-full ${activeTab === 'outfit' ? 'bg-foreground' : 'bg-transparent'}`} />
              </Pressable>
            </View>
          </View>

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
              <View className='flex-row items-start justify-between'>
                <Text className='max-w-[45%] text-xxs font-semibold uppercase tracking-[1.8px] text-muted-foreground'>
                  {t('garment.detailScreen.sectionTitle')}
                </Text>

                {!isEditing ?
                  <View className='flex-row gap-2'>
                    <Pressable className='flex-row items-center gap-1.5 rounded-full bg-destructive-subtle px-4 py-2'>
                      <Ionicons name='trash-outline' size={14} color='#DC2626' />
                      <Text className='text-sm font-medium text-destructive'>{t('garment.detailScreen.actions.delete')}</Text>
                    </Pressable>

                    <Pressable className='flex-row items-center gap-1.5 rounded-full bg-accent px-4 py-2' onPress={openEditMode}>
                      <Ionicons name='pencil-outline' size={14} color='#5D4037' />
                      <Text className='text-sm font-medium text-foreground'>{t('garment.detailScreen.actions.edit')}</Text>
                    </Pressable>
                  </View>
                : <View className='flex-row gap-2'>
                    <Pressable
                      className='flex-row items-center gap-1.5 rounded-full bg-accent px-4 py-2'
                      onPress={cancelEditMode}
                      disabled={isSaving}>
                      <Ionicons name='close-outline' size={16} color='#6B7280' />
                      <Text className='text-sm font-medium text-muted-foreground'>{t('garment.detailScreen.actions.cancel')}</Text>
                    </Pressable>

                    <Pressable
                      className='flex-row items-center gap-1.5 rounded-full bg-foreground px-4 py-2'
                      onPress={handleSave}
                      disabled={isSaving || draftName.trim().length === 0}>
                      <Ionicons name='checkmark-outline' size={16} color='#FFFFFF' />
                      <Text className='text-sm font-semibold text-card'>{t('garment.detailScreen.actions.save')}</Text>
                    </Pressable>
                  </View>}
              </View>

              <View className='mt-4 px-0'>
                {!isEditing ?
                  <>
                    <View className='flex-row items-center justify-between border-b border-border py-5'>
                      <Text className='text-base font-regular text-muted-foreground'>{t('garment.detailScreen.fields.name')}</Text>
                      <Text className='max-w-[58%] text-right text-xl font-semibold text-primary'>
                        {nameValue || t('garment.detailScreen.fallback.noName')}
                      </Text>
                    </View>

                    <View className='flex-row items-center justify-between border-b border-border py-5'>
                      <Text className='text-base font-regular text-muted-foreground'>{t('garment.detailScreen.fields.category')}</Text>
                      <Text className='max-w-[58%] text-right text-xl font-semibold text-primary'>{categoryLabel}</Text>
                    </View>

                    <View className='flex-row items-center justify-between border-b border-border py-5'>
                      <Text className='text-base font-regular text-muted-foreground'>{t('garment.detailScreen.fields.color')}</Text>
                      <View className='flex-row items-center gap-2'>
                        <View className='h-[18px] w-[18px] rounded-full border border-icon-inactive' style={{ backgroundColor: primaryColorHex }} />
                        <Text className='text-xl font-semibold text-primary'>{primaryColorLabel}</Text>
                      </View>
                    </View>

                    <View className='flex-row items-center justify-between border-b border-border py-5'>
                      <Text className='text-base font-regular text-muted-foreground'>{t('garment.detailScreen.fields.style')}</Text>
                      <Text className='max-w-[58%] text-right text-xl font-semibold text-primary'>{styleLabel}</Text>
                    </View>

                    <View className='flex-row items-center justify-between py-5'>
                      <Text className='text-base font-regular text-muted-foreground'>{t('garment.detailScreen.fields.brand')}</Text>
                      <Text className='max-w-[58%] text-right text-xl font-semibold text-primary'>
                        {brandLabel.trim() || t('garment.detailScreen.fallback.pending')}
                      </Text>
                    </View>
                  </>
                : <>
                    <View className='flex-row items-center justify-between border-b border-border py-5'>
                      <Text className='text-base font-regular text-muted-foreground'>{t('garment.detailScreen.fields.name')}</Text>
                      <View className='w-[57%] border-b border-icon-inactive pb-1'>
                        <TextInput
                          value={draftName}
                          onChangeText={setDraftName}
                          className='text-right text-xl font-semibold text-foreground'
                          placeholder={t('garment.detailScreen.fallback.noName')}
                          placeholderTextColor='#9CA3AF'
                        />
                      </View>
                    </View>

                    <View className='border-b border-border py-5'>
                      <View className='flex-row items-center justify-between'>
                        <Text className='text-base font-regular text-muted-foreground'>{t('garment.detailScreen.fields.category')}</Text>
                        <View className='w-[57%] flex-row flex-wrap justify-end gap-2'>
                          {categories.map((option: ConfigItem) => {
                            const isSelected = option.id === draftCategoryId
                            return (
                              <Pressable
                                key={option.id}
                                className={`rounded-full px-4 py-2 ${isSelected ? 'bg-primary' : 'bg-accent'}`}
                                onPress={() => setDraftCategoryId(option.id)}>
                                <Text className={`text-md font-medium ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                                  {option.name}
                                </Text>
                              </Pressable>
                            )
                          })}
                        </View>
                      </View>
                    </View>

                    <View className='border-b border-border py-5'>
                      <View className='flex-row items-center justify-between'>
                        <Text className='text-base font-regular text-muted-foreground'>{t('garment.detailScreen.fields.color')}</Text>
                        <View className='w-[57%] flex-row flex-wrap justify-end gap-2'>
                          {colors.map((option: ConfigItem) => {
                            const isSelected = draftColorIds.includes(option.id)
                            return (
                              <Pressable
                                key={option.id}
                                className={`flex-row items-center gap-2 rounded-full px-4 py-2 ${isSelected ? 'bg-primary' : 'bg-accent'}`}
                                onPress={() => toggleDraftColor(option.id)}>
                                <View
                                  className={`h-[14px] w-[14px] rounded-full ${isSelected ? 'border border-white/60' : ''}`}
                                  style={{ backgroundColor: resolveColorHex(option.name) }}
                                />
                                <Text className={`text-md font-medium ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                                  {option.name}
                                </Text>
                              </Pressable>
                            )
                          })}
                        </View>
                      </View>
                    </View>

                    <View className='py-5'>
                      <View className='flex-row items-center justify-between'>
                        <Text className='text-base font-regular text-muted-foreground'>{t('garment.detailScreen.fields.style')}</Text>
                        <View className='w-[57%] flex-row flex-wrap justify-end gap-2'>
                          {styles.map((option: ConfigItem) => {
                            const isSelected = option.id === draftStyleId
                            return (
                              <Pressable
                                key={option.id}
                                className={`rounded-full px-4 py-2 ${isSelected ? 'bg-primary' : 'bg-accent'}`}
                                onPress={() => setDraftStyleId(option.id)}>
                                <Text className={`text-md font-medium ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                                  {option.name}
                                </Text>
                              </Pressable>
                            )
                          })}
                        </View>
                      </View>
                    </View>
                  </>}
              </View>
            </View>
          : <View className='items-center px-6 pt-28'>
              <Ionicons name='layers-outline' size={52} color='#B8ADA3' />
              <Text className='mt-4 text-center text-xl font-regular text-muted-foreground'>{t('garment.detailScreen.outfitTodo')}</Text>
            </View>}

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
