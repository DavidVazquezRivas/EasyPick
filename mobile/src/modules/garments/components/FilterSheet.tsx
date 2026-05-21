import { useState } from 'react'
import {
  View,
  TextInput,
  Pressable,
  ScrollView,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { Text } from '@/shared/components/ui'
import { useTranslation } from 'react-i18next'
import { GarmentFilters } from '../hooks/useGarmentFilters'
import { useGetGarmentConfigs } from '@/core/query/garment'
import { normalizeText } from '@/modules/garments/utils/garmentDetail.utils'
import { useColorScheme } from 'react-native'
import { getThemeColor } from '@/core/theme/themeColors'

interface FilterSheetProps {
  visible: boolean
  filters: GarmentFilters
  hasActiveFilters: boolean
  onUpdateFilter: (key: keyof GarmentFilters, value: any) => void
  onToggleColor: (color: string) => void
  onToggleStyle: (style: string) => void
  onToggleCategory: (category: string) => void
  onClearFilters: () => void
  onClose: () => void
}

export const FilterSheet = ({
  visible,
  filters,
  hasActiveFilters,
  onUpdateFilter,
  onToggleColor,
  onToggleStyle,
  onToggleCategory,
  onClearFilters,
  onClose,
}: FilterSheetProps) => {
  const { t } = useTranslation()
  const colorScheme = useColorScheme()
  const loaderColor = getThemeColor('primary', colorScheme)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    search: true,
    color: false,
    style: false,
    category: false,
  })

  const {
    data: garmentConfigs,
    isLoading: configsLoading,
    isError: configsError,
  } = useGetGarmentConfigs()

  const colors = garmentConfigs?.colors ?? []
  const styles = garmentConfigs?.styles ?? []
  const categories = garmentConfigs?.categories ?? []

  const norm = (value: unknown) => normalizeText(value)

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <View className="flex-1 bg-background rounded-t-2xl mt-auto">
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-border">
            <Text className="text-xl font-bold">
              {t('garment.filters.title') || 'Filtros'}
            </Text>
            <Pressable onPress={onClose}>
              <Text className="text-primary text-lg">✕</Text>
            </Pressable>
          </View>

          <ScrollView className="flex-1 px-6 py-4">
            {/* Search Section */}
            <FilterSection
              title={t('garment.filters.search') || 'Buscar'}
              isExpanded={expandedSections['search']}
              onToggle={() => toggleSection('search')}
            >
              <TextInput
                placeholder={t('garment.filters.searchPlaceholder') || 'Nombre de prenda...'}
                value={filters.searchText}
                onChangeText={(text) => onUpdateFilter('searchText', text)}
                className="bg-muted rounded-lg px-4 py-3 border border-border"
                placeholderTextColor="#999"
              />
            </FilterSection>

            {/* Color Section */}
            <FilterSection
              title={t('garment.filters.color') || 'Color'}
              isExpanded={expandedSections['color']}
              onToggle={() => toggleSection('color')}
            >
              {configsLoading ? (
                <View className="py-4 items-center">
                  <ActivityIndicator size="small" color={loaderColor} />
                </View>
              ) : configsError ? (
                <Text className="text-destructive">
                  {t('garment.filters.loadError') || 'Error al cargar filtros'}
                </Text>
              ) : (
                <View className="flex-row flex-wrap gap-3">
                  {colors.length > 0 ? (
                    colors.map((color) => (
                      <FilterTag
                        key={color.id}
                        label={color.name}
                        isSelected={filters.selectedColors.map((s) => norm(s)).includes(norm(color.id))}
                        onPress={() => onToggleColor(color.id)}
                        color={color.hexCode}
                      />
                    ))
                  ) : (
                    <Text className="text-muted-foreground">
                      {t('garment.filters.noOptions') || 'No hay opciones'}
                    </Text>
                  )}
                </View>
              )}
            </FilterSection>

            {/* Style Section */}
            <FilterSection
              title={t('garment.filters.style') || 'Estilo'}
              isExpanded={expandedSections['style']}
              onToggle={() => toggleSection('style')}
            >
              {configsLoading ? (
                <View className="py-4 items-center">
                  <ActivityIndicator size="small" color={loaderColor} />
                </View>
              ) : configsError ? (
                <Text className="text-destructive">
                  {t('garment.filters.loadError') || 'Error al cargar filtros'}
                </Text>
              ) : (
                <View className="flex-row flex-wrap gap-3">
                  {styles.length > 0 ? (
                    styles.map((style) => (
                      <FilterTag
                        key={style.id}
                        label={style.name}
                        isSelected={filters.selectedStyles.map((s) => norm(s)).includes(norm(style.id))}
                        onPress={() => onToggleStyle(style.id)}
                      />
                    ))
                  ) : (
                    <Text className="text-muted-foreground">
                      {t('garment.filters.noOptions') || 'No hay opciones'}
                    </Text>
                  )}
                </View>
              )}
            </FilterSection>

            {/* Category Section */}
            <FilterSection
              title={t('garment.filters.category') || 'Tipo'}
              isExpanded={expandedSections['category']}
              onToggle={() => toggleSection('category')}
            >
              {configsLoading ? (
                <View className="py-4 items-center">
                  <ActivityIndicator size="small" color={loaderColor} />
                </View>
              ) : configsError ? (
                <Text className="text-destructive">
                  {t('garment.filters.loadError') || 'Error al cargar filtros'}
                </Text>
              ) : (
                <View className="flex-row flex-wrap gap-3">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <FilterTag
                        key={category.id}
                        label={category.name}
                        isSelected={filters.selectedCategories.map((s) => norm(s)).includes(norm(category.id))}
                        onPress={() => onToggleCategory(category.id)}
                      />
                    ))
                  ) : (
                    <Text className="text-muted-foreground">
                      {t('garment.filters.noOptions') || 'No hay opciones'}
                    </Text>
                  )}
                </View>
              )}
            </FilterSection>
          </ScrollView>

          {/* Footer Actions */}
          <View className="flex-row gap-3 px-6 py-4 border-t border-border">
            {hasActiveFilters && (
              <Pressable
                onPress={onClearFilters}
                className="flex-1 bg-muted rounded-lg py-3 items-center"
              >
                <Text className="font-semibold text-foreground">
                  {t('garment.filters.clear') || 'Limpiar'}
                </Text>
              </Pressable>
            )}
            <Pressable
              onPress={onClose}
              className="flex-1 bg-primary rounded-lg py-3 items-center"
            >
              <Text className="font-semibold text-primary-foreground">
                {t('garment.filters.apply') || 'Aplicar'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

interface FilterSectionProps {
  title: string
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

const FilterSection = ({ title, isExpanded, onToggle, children }: FilterSectionProps) => (
  <View className="mb-4">
    <Pressable onPress={onToggle} className="flex-row items-center justify-between py-3">
      <Text className="font-semibold text-base">{title}</Text>
      <Text className={`text-lg ${isExpanded ? 'text-primary' : 'text-muted-foreground'}`}>
        {isExpanded ? '−' : '+'}
      </Text>
    </Pressable>
    {isExpanded && <View className="gap-3">{children}</View>}
  </View>
)

interface FilterTagProps {
  label: string
  isSelected: boolean
  onPress: () => void
  color?: string
}

const FilterTag = ({ label, isSelected, onPress, color }: FilterTagProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={`rounded-full px-4 py-2 flex-row items-center gap-2 border ${
      isSelected
        ? 'bg-primary border-primary'
        : 'bg-muted border-border'
    }`}
  >
    {color && (
      <View
        className="w-4 h-4 rounded-full border border-muted-foreground"
        style={{ backgroundColor: color }}
      />
    )}
    <Text
      className={`text-sm font-medium ${
        isSelected ? 'text-primary-foreground' : 'text-foreground'
      }`}
    >
      {label}
    </Text>
  </TouchableOpacity>
)
