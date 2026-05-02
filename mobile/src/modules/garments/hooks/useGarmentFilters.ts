import { useState, useMemo } from 'react'
import { SimpleGarment } from '@/core/api/garment/models/SimpleGarment'

export interface GarmentFilters {
  searchText: string
  selectedColors: string[]
  selectedStyles: string[]
  selectedCategories: string[]
}

export const useGarmentFilters = (garments: SimpleGarment[] | undefined) => {
  const [filters, setFilters] = useState<GarmentFilters>({
    searchText: '',
    selectedColors: [],
    selectedStyles: [],
    selectedCategories: [],
  })

  const filteredGarments = useMemo(() => {
    if (!garments) return []

    return garments.filter((garment) => {
      // Filter by search text
      if (filters.searchText.trim()) {
        const searchLower = filters.searchText.toLowerCase()
        const matchesSearch =
          garment.name?.toLowerCase().includes(searchLower) ||
          garment.description?.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      return true
    })
  }, [garments, filters])

  const updateFilter = (key: keyof GarmentFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const toggleColorFilter = (color: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedColors: prev.selectedColors.includes(color)
        ? prev.selectedColors.filter((c) => c !== color)
        : [...prev.selectedColors, color],
    }))
  }

  const toggleStyleFilter = (style: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedStyles: prev.selectedStyles.includes(style)
        ? prev.selectedStyles.filter((s) => s !== style)
        : [...prev.selectedStyles, style],
    }))
  }

  const toggleCategoryFilter = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter((c) => c !== category)
        : [...prev.selectedCategories, category],
    }))
  }

  const clearFilters = () => {
    setFilters({
      searchText: '',
      selectedColors: [],
      selectedStyles: [],
      selectedCategories: [],
    })
  }

  const hasActiveFilters = 
    filters.searchText.trim() !== '' ||
    filters.selectedColors.length > 0 ||
    filters.selectedStyles.length > 0 ||
    filters.selectedCategories.length > 0

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
