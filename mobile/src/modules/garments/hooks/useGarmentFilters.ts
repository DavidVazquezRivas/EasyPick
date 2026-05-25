import { useMemo } from 'react'
import { SimpleGarment } from '@/core/api/garment/models/SimpleGarment'
import { useGarmentFilterState } from '@/modules/garments/context/GarmentFiltersContext'
import { normalizeText } from '@/modules/garments/utils/garmentDetail.utils'

export interface GarmentFilters {
  searchText: string
  selectedColors: string[]
  selectedStyles: string[]
  selectedCategories: string[]
}

const normalizeValue = (value: unknown) => normalizeText(String(value ?? ''))

const getEntityIdentifiers = (source: unknown): string[] => {
  if (source === null || source === undefined) return []

  if (typeof source === 'string' || typeof source === 'number' || typeof source === 'boolean') {
    return [normalizeValue(source)]
  }

  if (Array.isArray(source)) {
    return source.flatMap((item) => getEntityIdentifiers(item))
  }

  if (typeof source === 'object') {
    const typed = source as Record<string, unknown>
    const keys = ['id', '_id', 'brandId', 'styleId', 'categoryId', 'name', 'label', 'title', 'hexCode']
    return keys.flatMap((key) => getEntityIdentifiers(typed[key])).filter(Boolean)
  }

  return []
}

const matchesSelectedValues = (source: unknown, selectedValues: string[]) => {
  if (selectedValues.length === 0) return true

  const normalizedSelected = selectedValues.map(normalizeValue)
  const sourceIdentifiers = getEntityIdentifiers(source)

  return sourceIdentifiers.some((identifier) => normalizedSelected.includes(identifier))
}

export const useGarmentFilters = (garments: SimpleGarment[] | undefined) => {
  const {
    filters,
    updateFilter,
    toggleColorFilter,
    toggleStyleFilter,
    toggleCategoryFilter,
    clearFilters,
    hasActiveFilters,
  } = useGarmentFilterState()

  const filteredGarments = useMemo(() => {
  if (!garments) return []

  const searchQuery = normalizeValue(filters.searchText)

    return garments.filter((garment) => {
      if (searchQuery) {
        const matchesSearch =
          normalizeValue(garment.name).includes(searchQuery) ||
          normalizeValue(garment.description).includes(searchQuery)
        if (!matchesSearch) return false
      }

      if (!matchesSelectedValues(garment.colors, filters.selectedColors)) return false
      if (!matchesSelectedValues(garment.style, filters.selectedStyles)) return false
      if (!matchesSelectedValues(garment.category, filters.selectedCategories)) return false

      return true
    })
  }, [garments, filters])

  return {
    filters,
    filteredGarments,
    updateFilter,
    toggleColorFilter,
    toggleStyleFilter,
    toggleCategoryFilter,
    clearFilters,
    hasActiveFilters,
  }
}
