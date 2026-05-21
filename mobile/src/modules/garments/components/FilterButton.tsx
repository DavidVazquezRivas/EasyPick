import { Pressable, View } from 'react-native'
import { Text } from '@/shared/components/ui'
import { useTranslation } from 'react-i18next'

interface FilterButtonProps {
  hasActiveFilters: boolean
  onPress: () => void
  filterCount?: number
}

export const FilterButton = ({ hasActiveFilters, onPress, filterCount = 0 }: FilterButtonProps) => {
  const { t } = useTranslation()

  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-2 px-4 py-2 rounded-lg ${
        hasActiveFilters ? 'bg-primary/20 border border-primary' : 'bg-muted border border-border'
      }`}
    >
      <Text className={`font-medium ${hasActiveFilters ? 'text-primary' : 'text-foreground'}`}>
        {t('garment.filters.filters') || 'Filtros'}
      </Text>
      {hasActiveFilters && filterCount > 0 && (
        <View className="ml-2 bg-primary rounded-full w-6 h-6 items-center justify-center">
          <Text className="text-xs font-bold text-primary-foreground">{filterCount}</Text>
        </View>
      )}
    </Pressable>
  )
}
