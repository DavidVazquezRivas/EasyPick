import { ConfigItem } from '@/core/api/garment/models/GarmentConfigs'

const getParam = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] ?? ''
  }

  return value ?? ''
}

export const normalizeGarmentIdParam = (value: string | string[] | undefined) => {
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

export const normalizeText = (value: unknown) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

export const normalizeId = (value: unknown) => String(value ?? '').trim()

export const isHexColor = (value: string) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)

export const isRgbColor = (value: string) => /^rgba?\(/i.test(value)

const stringToStableHue = (value: string) => {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }

  return Math.abs(hash) % 360
}

export const resolveColorHex = (name: string) => {
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

  const hue = stringToStableHue(normalizedName || 'unknown')
  return `hsl(${hue} 55% 58%)`
}

export const getChipStyle = (isSelected: boolean) => ({
  borderWidth: 1,
  borderColor: isSelected ? '#5D4037' : '#D4CEC7',
  backgroundColor: isSelected ? '#5D4037' : '#F6F1EB',
  borderRadius: 999,
  paddingHorizontal: 16,
  paddingVertical: 9,
})

export const getConfigNameById = (id: string, items: ConfigItem[]) => {
  const normalizedId = normalizeId(id)
  if (!normalizedId) {
    return ''
  }

  return items.find((item) => normalizeId(item.id) === normalizedId)?.name ?? ''
}

export type RawConfigRef = { id?: unknown; name?: unknown } | string | null | undefined

export const getRefId = (value: RawConfigRef) => {
  if (!value) {
    return ''
  }

  if (typeof value === 'string') {
    return normalizeId(value)
  }

  return normalizeId(value.id)
}

export const getRefName = (value: RawConfigRef) => {
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

export const resolveBrandLabel = (rawBrand: unknown, brandOptions: ConfigItem[]) => {
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

export const resolveBrandId = (rawBrand: unknown, brandOptions: ConfigItem[]) => {
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

export const resolveConfigId = (value: RawConfigRef, options: ConfigItem[]) => {
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

export const resolveDraftConfigId = (draftId: string, options: ConfigItem[]) => {
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

export const resolveDraftColorIds = (draftIds: string[], options: ConfigItem[]) =>
  draftIds
    .map((draftId) => resolveDraftConfigId(draftId, options))
    .filter((id): id is string => Boolean(id))

export const splitColorLabel = (value: unknown) =>
  String(value ?? '')
    .split(/,|\/|\+|\s+y\s|\s+and\s|\s*&\s*/gi)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0)

export const getColorIdsFromRaw = (value: unknown): string[] => {
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
