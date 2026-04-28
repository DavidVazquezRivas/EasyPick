import { useEffect, useMemo, useState } from 'react'
import { CompleteGarment } from '@/core/api/garment/models/CompleteGarment'
import { ConfigItem } from '@/core/api/garment/models/GarmentConfigs'
import {
  getColorIdsFromRaw,
  getConfigNameById,
  getRefId,
  getRefName,
  isHexColor,
  isRgbColor,
  normalizeId,
  normalizeText,
  RawConfigRef,
  resolveBrandLabel,
  resolveColorHex,
  resolveConfigId,
  splitColorLabel,
} from '@/modules/garments/utils/garmentDetail.utils'

type UseGarmentDetailFormParams = {
  garment?: CompleteGarment
  categories: ConfigItem[]
  styles: ConfigItem[]
  colors: ConfigItem[]
  brands: ConfigItem[]
  fallbackNoName: string
  fallbackPending: string
}

type FormMappedValues = {
  nameValue: string
  categoryId: string
  styleId: string
  colorIds: string[]
  brandId: string
  brandLabel: string
}

const mapGarmentToFormValues = (
  garment: CompleteGarment,
  categories: ConfigItem[],
  styles: ConfigItem[],
  brands: ConfigItem[],
  fallbackNoName: string,
  fallbackPending: string,
): FormMappedValues => {
  const rawCategory = garment.category as unknown as RawConfigRef
  const rawStyle = garment.style as unknown as RawConfigRef
  const rawBrandEntity = garment.brand as unknown as { id?: unknown; name?: unknown } | null
  const rawBrand = ((garment as unknown as { brand?: unknown; brands?: unknown }).brand ??
    (garment as unknown as { brand?: unknown; brands?: unknown }).brands) as unknown as RawConfigRef

  const nextName = garment.name?.trim() || fallbackNoName
  const nextCategoryId = resolveConfigId(rawCategory, categories) || getRefId(rawCategory)
  const nextStyleId = resolveConfigId(rawStyle, styles) || getRefId(rawStyle)
  const nextColorIds = getColorIdsFromRaw(garment.colors)
  const currentBrandId = rawBrandEntity?.id ? normalizeId(rawBrandEntity.id) : normalizeId(getRefId(rawBrand))
  const brandNameFromEntity = normalizeId(rawBrandEntity?.name)
  const brandNameFromRaw = resolveBrandLabel(rawBrand, brands)
  const nextBrandLabel = (brandNameFromEntity || brandNameFromRaw || getConfigNameById(currentBrandId, brands)).trim() ||
    fallbackPending

  return {
    nameValue: nextName,
    categoryId: nextCategoryId,
    styleId: nextStyleId,
    colorIds: nextColorIds,
    brandId: currentBrandId,
    brandLabel: nextBrandLabel,
  }
}

export const useGarmentDetailForm = ({
  garment,
  categories,
  styles,
  colors,
  brands,
  fallbackNoName,
  fallbackPending,
}: UseGarmentDetailFormParams) => {
  const [isEditing, setIsEditing] = useState(false)

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

  const applyMappedValues = (nextValues: FormMappedValues) => {
    setNameValue(nextValues.nameValue)
    setCategoryId(nextValues.categoryId)
    setStyleId(nextValues.styleId)
    setColorIds(nextValues.colorIds)
    setBrandId(nextValues.brandId)
    setBrandLabel(nextValues.brandLabel)

    setDraftName(nextValues.nameValue)
    setDraftCategoryId(nextValues.categoryId)
    setDraftStyleId(nextValues.styleId)
    setDraftBrandId(nextValues.brandId)
    setDraftColorIds(nextValues.colorIds)
  }

  const hydrateFromGarment = (nextGarment: CompleteGarment) => {
    const nextValues = mapGarmentToFormValues(nextGarment, categories, styles, brands, fallbackNoName, fallbackPending)
    applyMappedValues(nextValues)
  }

  useEffect(() => {
    if (!garment || isEditing) {
      return
    }

    hydrateFromGarment(garment)
  }, [garment, isEditing, categories, styles, brands, fallbackNoName, fallbackPending])

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

  const commitDraftToCurrent = ({ nameOverride }: { nameOverride?: string } = {}) => {
    const nextName = nameOverride ?? draftName.trim()

    setNameValue(nextName)
    setCategoryId(draftCategoryId)
    setStyleId(draftStyleId)
    setColorIds(draftColorIds)

    setDraftName(nextName)
    setDraftCategoryId(draftCategoryId)
    setDraftStyleId(draftStyleId)
    setDraftColorIds(draftColorIds)
  }

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

    return fallbackPending
  }, [garment?.category, categoryId, categories, fallbackPending])

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

    return fallbackPending
  }, [garment?.style, styleId, styles, fallbackPending])

  const allColorsLabels = useMemo(() => {
    const labelsFromGarment = Array.isArray(garment?.colors) ?
      garment.colors.flatMap((color) => splitColorLabel(color?.name))
    : []

    const labelsFromConfigIds = colorIds
      .flatMap((colorId) => splitColorLabel(getConfigNameById(colorId, colors)))
      .filter((label) => label.length > 0)

    return [...labelsFromConfigIds, ...labelsFromGarment].reduce<string[]>((acc, label) => {
      const exists = acc.some((current) => normalizeText(current) === normalizeText(label))
      if (!exists) {
        acc.push(label)
      }

      return acc
    }, [])
  }, [garment?.colors, colorIds, colors])

  const displayedColorLabels = allColorsLabels.length > 0 ? allColorsLabels : [fallbackPending]
  const shouldStackColors = displayedColorLabels.length > 1

  const brandLabelView = useMemo(() => {
    const name = getConfigNameById(draftBrandId, brands)
    return name || brandLabel.trim() || fallbackPending
  }, [draftBrandId, brands, brandLabel, fallbackPending])

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

  return {
    isEditing,
    setIsEditing,
    openEditMode,
    cancelEditMode,
    toggleDraftColor,
    hydrateFromGarment,
    commitDraftToCurrent,
    nameValue,
    categoryId,
    styleId,
    colorIds,
    brandId,
    brandLabel,
    draftName,
    draftCategoryId,
    draftStyleId,
    draftBrandId,
    draftColorIds,
    setDraftName,
    setDraftCategoryId,
    setDraftStyleId,
    setDraftBrandId,
    displayedColorLabels,
    shouldStackColors,
    categoryLabel,
    styleLabel,
    brandLabelView,
    getOptionColorHex,
  }
}
