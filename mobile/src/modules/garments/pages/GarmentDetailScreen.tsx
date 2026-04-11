import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Image, Pressable, ScrollView, TextInput, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useGetGarmentConfigs, useGetGarmentDetail, usePatchGarment } from '@/core/query/garment'
import { CompleteGarment, Color } from '@/core/api/garment/models/CompleteGarment'
import { PatchGarmentRequest } from '@/core/api/garment/models/PatchGarmentRequest'
import { ConfigItem } from '@/core/api/garment/models/GarmentConfigs'
import { QueryErrorDisplay } from '@/shared/components/QueryErrorDisplay'
import { showGlobalApiError } from '@/shared/components/layout/ErrorBoundary'
import { Text } from '@/shared/components/ui'

type DetailTab = 'info' | 'outfit'

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
  marfil: '#F8F4E3',
  crema: '#FFF6D6',
  negro: '#1C1C1C',
  carbon: '#2A2A2A',
  beige: '#D9CEBC',
  camel: '#C19A6B',
  nude: '#D2B48C',
  azul: '#3B82F6',
  azulmarino: '#1E3A8A',
  navy: '#1E3A8A',
  celeste: '#7DD3FC',
  turquesa: '#14B8A6',
  cian: '#06B6D4',
  marron: '#9A6A3A',
  marron2: '#9A6A3A',
  cafe: '#7C4A21',
  chocolate: '#5A381E',
  gris: '#94A3B8',
  plateado: '#BFC7CF',
  rojo: '#EF4444',
  granate: '#7F1D1D',
  burdeos: '#7F1D1D',
  rosa: '#EC4899',
  fucsia: '#D946EF',
  morado: '#7C3AED',
  violeta: '#8B5CF6',
  verde: '#22C55E',
  oliva: '#6B8E23',
  amarillo: '#FACC15',
  naranja: '#F97316',
  white: '#FFFFFF',
  black: '#1C1C1C',
  blue: '#3B82F6',
  navyblue: '#1E3A8A',
  lightblue: '#7DD3FC',
  brown: '#9A6A3A',
  tan: '#D2B48C',
  gray: '#94A3B8',
  grey: '#94A3B8',
  silver: '#BFC7CF',
  red: '#EF4444',
  pink: '#EC4899',
  purple: '#7C3AED',
  yellow: '#FACC15',
  orange: '#F97316',
  green: '#22C55E',
}

const normalizeText = (value: unknown) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const normalizeId = (value: unknown) => String(value ?? '').trim()

const isHexColor = (value: string) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)

const isRgbColor = (value: string) => /^rgba?\(/i.test(value)

const stringToStableHue = (value: string) => {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }

  return Math.abs(hash) % 360
}

const resolveColorHex = (name: string) => {
  const normalizedName = normalizeText(name)

  if (isHexColor(normalizedName) || isRgbColor(normalizedName)) {
    return normalizedName
  }

  const byName = COLOR_HEX_BY_NAME[normalizedName]
  if (byName) {
    return byName
  }

  const semanticColorMatchers: Array<{ tokens: string[]; hex: string }> = [
    { tokens: ['gris', 'gray', 'grey', 'ceniza', 'graphite', 'grafito'], hex: '#94A3B8' },
    { tokens: ['negro', 'black', 'carbon'], hex: '#1C1C1C' },
    { tokens: ['blanco', 'white', 'ivory', 'marfil', 'crema'], hex: '#FFFFFF' },
    { tokens: ['azul', 'blue', 'navy', 'marino', 'celeste', 'cian', 'turquesa'], hex: '#3B82F6' },
    { tokens: ['verde', 'green', 'oliva', 'olive'], hex: '#22C55E' },
    { tokens: ['rojo', 'red', 'granate', 'burgundy', 'burdeos'], hex: '#EF4444' },
    { tokens: ['rosa', 'pink', 'fucsia', 'fuchsia'], hex: '#EC4899' },
    { tokens: ['morado', 'violeta', 'purple'], hex: '#7C3AED' },
    { tokens: ['marron', 'brown', 'cafe', 'camel', 'beige', 'tan', 'nude'], hex: '#9A6A3A' },
    { tokens: ['amarillo', 'yellow', 'mostaza'], hex: '#FACC15' },
    { tokens: ['naranja', 'orange', 'coral'], hex: '#F97316' },
  ]

  const semanticMatch = semanticColorMatchers.find(({ tokens }) => tokens.some((token) => normalizedName.includes(token)))
  if (semanticMatch) {
    return semanticMatch.hex
  }

  // Fallback deterministic color so unknown names do not collapse to a single swatch.
  const hue = stringToStableHue(normalizedName || 'unknown')
  return `hsl(${hue} 55% 58%)`
}

const getChipStyle = (isSelected: boolean) => ({
  borderWidth: 1,
  borderColor: isSelected ? '#5D4037' : '#D4CEC7',
  backgroundColor: isSelected ? '#5D4037' : '#F6F1EB',
  borderRadius: 999,
  paddingHorizontal: 16,
  paddingVertical: 9,
})

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

const unwrapBrandValue = (rawBrand: unknown): unknown => {
  if (Array.isArray(rawBrand)) {
    return rawBrand[0] ?? null
  }

  if (rawBrand && typeof rawBrand === 'object') {
    const brandObject = rawBrand as Record<string, unknown>
    if (Array.isArray(brandObject.brands)) {
      return brandObject.brands[0] ?? rawBrand
    }
    if (Array.isArray(brandObject.brand)) {
      return brandObject.brand[0] ?? rawBrand
    }
  }

  return rawBrand
}

const resolveBrandLabel = (rawBrand: unknown, brandOptions: ConfigItem[]) => {
  const unwrappedBrand = unwrapBrandValue(rawBrand)
  if (!unwrappedBrand) {
    return ''
  }

  if (typeof unwrappedBrand === 'string') {
    const normalizedRawBrand = normalizeId(unwrappedBrand)
    return getConfigNameById(normalizedRawBrand, brandOptions) || normalizedRawBrand
  }

  if (typeof unwrappedBrand !== 'object') {
    return ''
  }

  const brandObject = unwrappedBrand as Record<string, unknown>
  const nameKeys = ['name', 'label', 'brandName', 'displayName', 'title']
  for (const key of nameKeys) {
    const candidate = normalizeId(brandObject[key])
    if (candidate) {
      return candidate
    }
  }

  const idKeys = ['id', 'brandId', '_id']
  for (const key of idKeys) {
    const candidateId = normalizeId(brandObject[key])
    if (!candidateId) {
      continue
    }

    return getConfigNameById(candidateId, brandOptions) || candidateId
  }

  return ''
}

const resolveBrandId = (rawBrand: unknown, brandOptions: ConfigItem[]) => {
  const unwrappedBrand = unwrapBrandValue(rawBrand)
  if (!unwrappedBrand) {
    return ''
  }

  if (typeof unwrappedBrand === 'string') {
    const normalizedRawBrand = normalizeId(unwrappedBrand)
    const byId = brandOptions.find((option) => normalizeId(option.id) === normalizedRawBrand)
    if (byId) {
      return normalizeId(byId.id)
    }

    const byName = brandOptions.find((option) => normalizeText(option.name) === normalizeText(normalizedRawBrand))
    return normalizeId(byName?.id)
  }

  if (typeof unwrappedBrand !== 'object') {
    return ''
  }

  const brandObject = unwrappedBrand as Record<string, unknown>
  const idKeys = ['id', 'brandId', '_id']
  for (const key of idKeys) {
    const candidateId = normalizeId(brandObject[key])
    if (candidateId) {
      return candidateId
    }
  }

  const nameKeys = ['name', 'label', 'brandName', 'displayName', 'title']
  for (const key of nameKeys) {
    const candidateName = normalizeId(brandObject[key])
    if (!candidateName) {
      continue
    }

    const byName = brandOptions.find((option) => normalizeText(option.name) === normalizeText(candidateName))
    if (byName) {
      return normalizeId(byName.id)
    }
  }

  return ''
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

const splitColorLabel = (value: unknown) =>
  String(value ?? '')
    .split(/,|\/|\+|\s+y\s|\s+and\s|\s*&\s*/gi)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0)

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
  const brands = configs?.brands ?? []

  const [nameValue, setNameValue] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [styleId, setStyleId] = useState('')
  const [colorIds, setColorIds] = useState<string[]>([])
  const [brandId, setBrandId] = useState('')
  const [brandLabel, setBrandLabel] = useState('')

  const [draftName, setDraftName] = useState('')
  const [draftCategoryId, setDraftCategoryId] = useState('')
  const [draftStyleId, setDraftStyleId] = useState('')
  const [draftBrandId, setDraftBrandId] = useState('')
  const [draftColorIds, setDraftColorIds] = useState<string[]>([])

  useEffect(() => {
    if (!garment || isEditing) {
      return
    }

    const rawCategory = garment.category as unknown as RawConfigRef
    const rawStyle = garment.style as unknown as RawConfigRef
    const rawBrandEntity = garment.brand as unknown as { id?: unknown; name?: unknown } | null
    const rawBrand = ((garment as unknown as { brand?: unknown; brands?: unknown }).brand ??
      (garment as unknown as { brand?: unknown; brands?: unknown }).brands) as unknown as RawConfigRef

    const nextName = garment.name?.trim() || t('garment.detailScreen.fallback.noName')
    const nextCategoryId = resolveConfigId(rawCategory, configs?.categories ?? []) || getRefId(rawCategory)
    const nextStyleId = resolveConfigId(rawStyle, configs?.styles ?? []) || getRefId(rawStyle)
    const nextColorIds = getColorIdsFromRaw(garment.colors)
    const currentBrandId = rawBrandEntity?.id ? normalizeId(rawBrandEntity.id) : normalizeId(getRefId(rawBrand))
    const brandNameFromEntity = normalizeId(rawBrandEntity?.name)
    const brandNameFromRaw = resolveBrandLabel(rawBrand, brands)
    const nextBrandLabel = (brandNameFromEntity || brandNameFromRaw || getConfigNameById(currentBrandId, brands)).trim() ||
      t('garment.detailScreen.fallback.pending')

    setNameValue(nextName)
    setCategoryId(nextCategoryId)
    setStyleId(nextStyleId)
    setColorIds(nextColorIds)
    setBrandId(currentBrandId)
    setBrandLabel(nextBrandLabel)

    setDraftName(nextName)
    setDraftCategoryId(nextCategoryId)
    setDraftStyleId(nextStyleId)
    setDraftBrandId(currentBrandId)
    setDraftColorIds(nextColorIds)
  }, [brands, configs?.categories, configs?.styles, garment, isEditing, t])

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

  const allColorsLabels = useMemo(() => {
    const labelsFromGarment = Array.isArray(garment?.colors) ?
      garment.colors.flatMap((color) => splitColorLabel(color?.name))
    : []

    const labelsFromConfigIds = colorIds
      .flatMap((colorId) => splitColorLabel(getConfigNameById(colorId, colors)))
      .filter((label) => label.length > 0)

    const mergedUnique = [...labelsFromConfigIds, ...labelsFromGarment].reduce<string[]>((acc, label) => {
      const exists = acc.some((current) => normalizeText(current) === normalizeText(label))
      if (!exists) {
        acc.push(label)
      }

      return acc
    }, [])

    return mergedUnique
  }, [colorIds, colors, garment?.colors])

  const displayedColorLabels = allColorsLabels.length > 0 ? allColorsLabels : [t('garment.detailScreen.fallback.pending')]
  const shouldStackColors = displayedColorLabels.length > 1

  const brandLabelView = useMemo(() => {
    const name = getConfigNameById(draftBrandId, brands)
    return name || brandLabel.trim() || t('garment.detailScreen.fallback.pending')
  }, [draftBrandId, brands, brandLabel, t])

  const colorHexById = useMemo(() => {
    const pairs = Array.isArray(garment?.colors) ? garment.colors : []
    return pairs.reduce<Record<string, string>>((acc, color) => {
      const colorId = normalizeId(color?.id)
      const colorHex = normalizeId(color?.hexCode)
      if (colorId && colorHex) {
        acc[colorId] = colorHex
      }

      return acc
    }, {})
  }, [garment?.colors])

  const getOptionColorHex = (option: ConfigItem) => {
    const optionId = normalizeId(option.id)
    const optionHexCode = normalizeId((option as unknown as { hexCode?: unknown }).hexCode)

    if (optionHexCode && (isHexColor(optionHexCode) || isRgbColor(optionHexCode))) {
      return optionHexCode
    }

    return colorHexById[optionId] ?? resolveColorHex(option.name)
  }

  const openEditMode = () => {
    setDraftName(nameValue)
    setDraftCategoryId(categoryId)
    setDraftStyleId(styleId)
    setDraftBrandId(brandId)
    setDraftColorIds(colorIds)
    setIsEditing(true)
  }

  const cancelEditMode = () => {
    setDraftName(nameValue)
    setDraftCategoryId(categoryId)
    setDraftStyleId(styleId)
    setDraftBrandId(brandId)
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
      const patch: PatchGarmentRequest & {
        category?: string | null
        style?: string | null
        colors?: string[]
        brand?: string | null
      } = {
        name: normalizedName,
        category: draftCategoryId || null,
        style: draftStyleId || null,
        colors: draftColorIds,
        brand: draftBrandId || null,
        status: 'CONFIRMED',
      }

      const resolvedDraftCategoryId = resolveDraftConfigId(draftCategoryId, categories)
      const resolvedDraftStyleId = resolveDraftConfigId(draftStyleId, styles)
      const resolvedDraftColorIds = resolveDraftColorIds(draftColorIds, colors)
      
      const resolvedCurrentCategoryId = resolveDraftConfigId(categoryId, categories)
      const resolvedCurrentStyleId = resolveDraftConfigId(styleId, styles)
      const resolvedCurrentColorIds = resolveDraftColorIds(colorIds, colors)
      const resolvedBrandId = resolveDraftConfigId(draftBrandId, brands)

      const draftColorIdsKey = resolvedDraftColorIds.join('|')
      const currentColorIdsKey = resolvedCurrentColorIds.join('|')
      const hasCategoryChanged = (resolvedDraftCategoryId ?? '') !== (resolvedCurrentCategoryId ?? '')
      const hasStyleChanged = (resolvedDraftStyleId ?? '') !== (resolvedCurrentStyleId ?? '')
      const hasColorsChanged = draftColorIdsKey !== currentColorIdsKey

      if (!hasCategoryChanged) {
        delete patch.category
      }

      if (!hasStyleChanged) {
        delete patch.style
      }

      if (!hasColorsChanged) {
        delete patch.colors
      }

      if (resolvedBrandId === normalizeId(brandId)) {
        delete patch.brand
      }

      if (normalizedName === nameValue.trim()) {
        delete patch.name
      }

      if (Object.keys(patch).length === 1 && patch.status) {
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
        
        const brandRaw = ((latestGarment as unknown as { brand?: unknown; brands?: unknown }).brand ??
          (latestGarment as unknown as { brand?: unknown; brands?: unknown }).brands) as unknown as RawConfigRef
        const latestBrandName =
          resolveBrandLabel(brandRaw, brands) ||
          normalizeId((latestGarment as unknown as { brandName?: unknown }).brandName)

        setBrandId(resolveBrandId(brandRaw, brands))
        setBrandLabel(latestBrandName.trim() || t('garment.detailScreen.fallback.pending'))
      } else {
        setNameValue(normalizedName)
        setCategoryId(draftCategoryId)
        setStyleId(draftStyleId)
        setColorIds(draftColorIds)
      }

      setDraftName(normalizedName)
      setDraftCategoryId(draftCategoryId)
      setDraftStyleId(draftStyleId)
      setDraftBrandId(resolvedBrandId ?? '')
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
                      <View className={shouldStackColors ? 'max-w-[60%] items-end gap-2' : 'flex-row max-w-[60%] flex-wrap justify-end gap-2'}>
                        {displayedColorLabels.map((label, index) => (
                          <View key={`${label}-${index}`} className='flex-row items-center gap-1.5 rounded-full bg-accent/30 px-2 py-1'>
                            <View
                              className='h-[12px] w-[12px] rounded-full border border-icon-inactive'
                              style={{ backgroundColor: resolveColorHex(label) }}
                            />
                            <Text className='text-lg font-semibold text-primary'>{label}</Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    <View className='flex-row items-center justify-between border-b border-border py-5'>
                      <Text className='text-base font-regular text-muted-foreground'>{t('garment.detailScreen.fields.style')}</Text>
                      <Text className='max-w-[58%] text-right text-xl font-semibold text-primary'>{styleLabel}</Text>
                    </View>

                    <View className='flex-row items-center justify-between py-5'>
                      <Text className='text-base font-regular text-muted-foreground'>{t('garment.detailScreen.fields.brand')}</Text>
                      <Text className='max-w-[58%] text-right text-xl font-semibold text-primary'>{brandLabelView}</Text>
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
                      <Text className='text-base font-regular text-muted-foreground'>{t('garment.detailScreen.fields.category')}</Text>
                      <View className='mt-3 flex-row flex-wrap gap-2'>
                        {categories.map((option: ConfigItem) => {
                          const isSelected = option.id === draftCategoryId
                          return (
                            <Pressable
                              key={option.id}
                              style={getChipStyle(isSelected)}
                              onPress={() => setDraftCategoryId(option.id)}>
                              <Text className={`text-sm font-medium ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                                {option.name}
                              </Text>
                            </Pressable>
                          )
                        })}
                      </View>
                    </View>

                    <View className='border-b border-border py-5'>
                      <Text className='text-base font-regular text-muted-foreground'>{t('garment.detailScreen.fields.color')}</Text>
                      <View className='mt-3 flex-row flex-wrap gap-2'>
                        {colors.map((option: ConfigItem) => {
                          const isSelected = draftColorIds.includes(option.id)
                          return (
                            <Pressable
                              key={option.id}
                              style={getChipStyle(isSelected)}
                              className='flex-row items-center gap-2'
                              onPress={() => toggleDraftColor(option.id)}>
                              <View
                                className={`h-[16px] w-[16px] rounded-full border ${isSelected ? 'border-white/70' : 'border-black/10'}`}
                                style={{ backgroundColor: getOptionColorHex(option) }}
                              />
                              <Text className={`text-sm font-medium ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                                {option.name}
                              </Text>
                            </Pressable>
                          )
                        })}
                      </View>
                    </View>

                    <View className='py-5'>
                      <Text className='text-base font-regular text-muted-foreground'>{t('garment.detailScreen.fields.style')}</Text>
                      <View className='mt-3 flex-row flex-wrap gap-2'>
                        {styles.map((option: ConfigItem) => {
                          const isSelected = option.id === draftStyleId
                          return (
                            <Pressable
                              key={option.id}
                              style={getChipStyle(isSelected)}
                              onPress={() => setDraftStyleId(option.id)}>
                              <Text className={`text-sm font-medium ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                                {option.name}
                              </Text>
                            </Pressable>
                          )
                        })}
                      </View>
                    </View>

                    <View className='py-5'>
                      <Text className='text-base font-regular text-muted-foreground'>{t('garment.detailScreen.fields.brand')}</Text>
                      <View className='mt-3 flex-row flex-wrap gap-2'>
                        {brands.map((option: ConfigItem) => {
                          const isSelected = option.id === draftBrandId
                          return (
                            <Pressable
                              key={option.id}
                              style={getChipStyle(isSelected)}
                              onPress={() => setDraftBrandId(option.id)}>
                              <Text className={`text-sm font-medium ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                                {option.name}
                              </Text>
                            </Pressable>
                          )
                        })}
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
