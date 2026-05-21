import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppError } from '@/core/api/global/errors'

export interface GarmentFilters {
  searchText: string
  selectedColors: string[]
  selectedStyles: string[]
  selectedCategories: string[]
}

const STORAGE_KEY = '@easypick:garment-filters'

const DEFAULT_FILTERS: GarmentFilters = {
  searchText: '',
  selectedColors: [],
  selectedStyles: [],
  selectedCategories: [],
}

type GarmentFiltersContextType = {
  filters: GarmentFilters
  updateFilter: (key: keyof GarmentFilters, value: unknown) => void
  toggleColorFilter: (color: string) => void
  toggleStyleFilter: (style: string) => void
  toggleCategoryFilter: (category: string) => void
  clearFilters: () => void
  hasActiveFilters: boolean
}

const GarmentFiltersContext = createContext<GarmentFiltersContextType | undefined>(undefined)

export const GarmentFiltersProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilters] = useState<GarmentFilters>(DEFAULT_FILTERS)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored) as GarmentFilters
          setFilters({
            ...DEFAULT_FILTERS,
            ...parsed,
          })
        }
      } catch {
        // ignore storage failures, keep defaults
      } finally {
        setIsInitialized(true)
      }
    }

    loadFilters()
  }, [])

  useEffect(() => {
    if (!isInitialized) return

    const persistFilters = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
      } catch {
        // ignore storage failures
      }
    }

    persistFilters()
  }, [filters, isInitialized])

  const updateFilter = (key: keyof GarmentFilters, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const toggleValue = (
    field: 'selectedColors' | 'selectedStyles' | 'selectedCategories',
    value: string,
  ) => {
    setFilters((prev) => {
      const currentValues = prev[field]
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value]

      return {
        ...prev,
        [field]: nextValues,
      }
    })
  }

  const toggleColorFilter = (color: string) => toggleValue('selectedColors', color)
  const toggleStyleFilter = (style: string) => toggleValue('selectedStyles', style)
  const toggleCategoryFilter = (category: string) => toggleValue('selectedCategories', category)

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS)
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {
      // ignore storage cleanup failures
    })
  }

  const hasActiveFilters = useMemo(
    () =>
      filters.searchText.trim() !== '' ||
      filters.selectedColors.length > 0 ||
      filters.selectedStyles.length > 0 ||
      filters.selectedCategories.length > 0,
    [filters],
  )

  const contextValue = useMemo(
    () => ({
      filters,
      updateFilter,
      toggleColorFilter,
      toggleStyleFilter,
      toggleCategoryFilter,
      clearFilters,
      hasActiveFilters,
    }),
    [filters, hasActiveFilters],
  )

  return <GarmentFiltersContext.Provider value={contextValue}>{children}</GarmentFiltersContext.Provider>
}

export const useGarmentFilterState = () => {
  const context = useContext(GarmentFiltersContext)

  if (!context) {
    throw new AppError('garment.errors.filtersProviderMissing')
  }

  return context
}
