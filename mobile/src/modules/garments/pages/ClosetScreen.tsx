import { View, ActivityIndicator, useColorScheme } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useMemo, useState } from 'react'
import { Text } from '@/shared/components/ui'
import { SettingsMenuButton } from '@/shared/components/SettingsMenuButton'
import { QueryErrorDisplay } from '@/shared/components/QueryErrorDisplay'
import { GarmentGrid } from '../components/GarmentGrid'
import { FilterButton } from '../components/FilterButton'
import { FilterSheet } from '../components/FilterSheet'
import { useGetMyGarments } from '@/core/query/garment'
import { useGarmentFilterState } from '@/modules/garments/context/GarmentFiltersContext'
import { useGarmentFilters } from '../hooks/useGarmentFilters'
import { getThemeColor } from '@/core/theme/themeColors'


export const ClosetScreen = () => {
  const { t } = useTranslation()
  const colorScheme = useColorScheme()
  const foreground = getThemeColor('foreground', colorScheme)
  const [filterSheetVisible, setFilterSheetVisible] = useState(false)

  const {
    filters,
    updateFilter,
    toggleColorFilter,
    toggleStyleFilter,
    toggleCategoryFilter,
    clearFilters,
    hasActiveFilters,
  } = useGarmentFilterState()

  const filterParams = useMemo(
    () => ({
      search: filters.searchText,
      categoryIds: filters.selectedCategories,
      styleIds: filters.selectedStyles,
      colorIds: filters.selectedColors,
    }),
    [
      filters.searchText,
      filters.selectedCategories,
      filters.selectedStyles,
      filters.selectedColors,
    ],
  )

  const { data: garments, isLoading, isError, error, refetch } = useGetMyGarments(filterParams)

  const { filteredGarments } = useGarmentFilters(garments)

  const getFilterCount = () => {
    let count = 0
    if (filters.searchText.trim()) count++
    if (filters.selectedColors.length > 0) count += filters.selectedColors.length
    if (filters.selectedStyles.length > 0) count += filters.selectedStyles.length
    if (filters.selectedCategories.length > 0) count += filters.selectedCategories.length
    return count
  }

  return (
    <View className='flex-1 bg-background pt-[12%]'>
      <View className='px-[6%] pb-[5%] flex-row justify-between items-center'>
        <Text className="text-5xl font-bold tracking-tight text-foreground">
          {t('garment.closetScreen.title')}
        </Text>
        <SettingsMenuButton />
      </View>

      <View className='px-[6%] pb-[3%]'>
        <FilterButton
          hasActiveFilters={hasActiveFilters}
          onPress={() => setFilterSheetVisible(true)}
          filterCount={getFilterCount()}
        />
      </View>

      <View className='flex-1'>
        {isLoading && (
          <View className='flex-1 items-center justify-center'>
            <ActivityIndicator size="large" color={foreground} />
          </View>
        )}

        <QueryErrorDisplay error={error} onRetry={() => refetch()} />

        {garments && !isError && !isLoading && (
          <GarmentGrid
            garments={filteredGarments}
            emptyMessage={t('garment.closetScreen.empty') || 'No se encontraron resultados'}
          />
        )}
      </View>

      <FilterSheet
        visible={filterSheetVisible}
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onUpdateFilter={updateFilter}
        onToggleColor={toggleColorFilter}
        onToggleStyle={toggleStyleFilter}
        onToggleCategory={toggleCategoryFilter}
        onClearFilters={clearFilters}
        onClose={() => setFilterSheetVisible(false)}
      />
    </View>
  )
}