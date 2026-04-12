import { useState } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Text } from '@/shared/components/ui'
import { GarmentGrid } from '../components/GarmentGrid'
import { FilterSheet, FilterButton } from '../components'
import { useGetMyGarments } from '@/core/query/garment'
import { useGarmentFilters } from '../hooks/useGarmentFilters'
import { QueryErrorDisplay } from '@/shared/components/QueryErrorDisplay'
import { useColorScheme } from 'react-native'
import { getThemeColor } from '@/core/theme/themeColors'


export const ClosetScreen = () => {
  const { t } = useTranslation()
  const colorScheme = useColorScheme()
  const loaderColor = getThemeColor('primary', colorScheme)
  const [filterModalVisible, setFilterModalVisible] = useState(false)

  const { data: garments, isLoading, isError, error, refetch } = useGetMyGarments()
  const {
    filters,
    filteredGarments,
    updateFilter,
    toggleColorFilter,
    toggleStyleFilter,
    toggleCategoryFilter,
    clearFilters,
    hasActiveFilters,
  } = useGarmentFilters(garments)

  const filterCount =
    filters.selectedColors.length +
    filters.selectedStyles.length +
    filters.selectedCategories.length +
    (filters.searchText.trim() ? 1 : 0)

  return (
    <View className='flex-1 bg-background pt-[10%]'>
      <View className='px-6 pb-4'>
        <View className='pb-4'>
          <Text className="text-5xl font-bold tracking-tight text-primary">
            {t('garment.closetScreen.title')}
          </Text>
        </View>
        <FilterButton
          hasActiveFilters={hasActiveFilters}
          filterCount={filterCount}
          onPress={() => setFilterModalVisible(true)}
        />
      </View>

      <View className='flex-1'>
        {isLoading && (
          <View className='flex-1 items-center justify-center'>
            <ActivityIndicator size="large" color={loaderColor} />
          </View>
        )}

        <QueryErrorDisplay error={error} onRetry={() => refetch()} />

        {garments && !isError && !isLoading && (
          <>
            <GarmentGrid garments={filteredGarments} />
            {filteredGarments.length === 0 && garments.length > 0 && (
              <View className='flex-1 items-center justify-center px-6'>
                <Text className="text-center text-muted-foreground">
                  {t('garment.closetScreen.noResults') || 'No se encontraron prendas con estas características'}
                </Text>
              </View>
            )}
          </>
        )}
      </View>

      <FilterSheet
        visible={filterModalVisible}
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onUpdateFilter={updateFilter}
        onToggleColor={toggleColorFilter}
        onToggleStyle={toggleStyleFilter}
        onToggleCategory={toggleCategoryFilter}
        onClearFilters={clearFilters}
        onClose={() => setFilterModalVisible(false)}
      />
    </View>
  )
}
