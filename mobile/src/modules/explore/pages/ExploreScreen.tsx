import { useMemo, useState } from 'react'
import { FlatList, View, useColorScheme } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@/shared/components'
import { SettingsMenuButton } from '@/shared/components/SettingsMenuButton'
import { ExploreGarmentCard, RecommendedGarment } from '@/modules/explore/components/ExploreGarmentCard'
import { ExploreDetailsSheet } from '@/modules/explore/components/ExploreDetailsSheet'
import { FilterButton } from '@/modules/garments/components/FilterButton'
import { FilterSheet } from '@/modules/garments/components/FilterSheet'
import { getThemeColor } from '@/core/theme/themeColors'

const MOCK_RECOMMENDED_GARMENTS: RecommendedGarment[] = [
  {
    id: 'rec_1',
    nameKey: 'garment.exploreScreen.garments.rec_1.name',
    name: 'Jaqueta Bomber Swell',
    descriptionKey: 'garment.exploreScreen.garments.rec_1.description',
    description: 'Una jaqueta bomber en to teixit beige neutre de tall ampli.',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop',
    brand: 'Zara',
    price: '49,99 €',
    matchScore: 98,
    badgeKey: 'trending',
    category: { id: 'coats', nameKey: 'garment.exploreScreen.categories.coats', name: 'Abrics' },
    style: { id: 'casual', nameKey: 'garment.detailScreen.options.styles.casual', name: 'Casual' },
    colors: [
      { id: 'beige', name: 'Beige', hexCode: '#d7ccc8' },
      { id: 'white', name: 'Blanco', hexCode: '#ffffff' },
    ],
    insightKey: 'garment.exploreScreen.garments.rec_1.insight',
    insight: 'Combina amb un 98% del teu armari actual.',
  },
  {
    id: 'rec_2',
    nameKey: 'garment.exploreScreen.garments.rec_2.name',
    name: 'Texans Rectes Classic 501',
    descriptionKey: 'garment.exploreScreen.garments.rec_2.description',
    description: 'Els texans rectes originals que van començar tot.',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop',
    brand: "Levi's",
    price: '79,90 €',
    matchScore: 95,
    badgeKey: 'new',
    category: { id: 'pants', nameKey: 'garment.exploreScreen.categories.pants', name: 'Pantalons' },
    style: { id: 'casual', nameKey: 'garment.detailScreen.options.styles.casual', name: 'Casual' },
    colors: [
      { id: 'blue', name: 'Azul', hexCode: '#bbdefb' },
    ],
    insightKey: 'garment.exploreScreen.garments.rec_2.insight',
    insight: 'Completa la silueta del teu armari.',
  },
  {
    id: 'rec_3',
    nameKey: 'garment.exploreScreen.garments.rec_3.name',
    name: 'Mocasins d\'Ante Soft',
    descriptionKey: 'garment.exploreScreen.garments.rec_3.description',
    description: 'Mocasins clàssics confeccionats en pell d\'ant suau i flexible.',
    imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600&auto=format&fit=crop',
    brand: 'Massimo Dutti',
    price: '89,95 €',
    matchScore: 92,
    badgeKey: 'recommended',
    category: { id: 'shoes', nameKey: 'garment.exploreScreen.categories.shoes', name: 'Calçat' },
    style: { id: 'formal', nameKey: 'garment.detailScreen.options.styles.formal', name: 'Formal' },
    colors: [
      { id: 'brown', name: 'Marrón', hexCode: '#8d6e63' },
    ],
    insightKey: 'garment.exploreScreen.garments.rec_3.insight',
    insight: 'Un calçat clau de transició.',
  },
  {
    id: 'rec_4',
    nameKey: 'garment.exploreScreen.garments.rec_4.name',
    name: 'Top de Punt Oversized',
    descriptionKey: 'garment.exploreScreen.garments.rec_4.description',
    description: 'Top ampli de teixit de punt fi i caigut de color blanc trencat.',
    imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop',
    brand: 'Mango',
    price: '29,99 €',
    matchScore: 88,
    badgeKey: undefined,
    category: { id: 'tops', nameKey: 'garment.exploreScreen.categories.tops', name: 'Tops' },
    style: { id: 'casual', nameKey: 'garment.detailScreen.options.styles.casual', name: 'Casual' },
    colors: [
      { id: 'white', name: 'Blanco', hexCode: '#f5f5f5' },
      { id: 'beige', name: 'Beige', hexCode: '#efebe9' },
    ],
    insightKey: 'garment.exploreScreen.garments.rec_4.insight',
    insight: 'La teva base perfecta.',
  },
  {
    id: 'rec_5',
    nameKey: 'garment.exploreScreen.garments.rec_5.name',
    name: 'Gavardina Clàssica Camel',
    descriptionKey: 'garment.exploreScreen.garments.rec_5.description',
    description: 'Gavardina creuada de teixit tècnic resistent a l\'aigua en color camel clàssic.',
    imageUrl: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=600&auto=format&fit=crop',
    brand: 'H&M Premium',
    price: '99,00 €',
    matchScore: 96,
    badgeKey: 'bestSeller',
    category: { id: 'coats', nameKey: 'garment.exploreScreen.categories.coats', name: 'Abrics' },
    style: { id: 'work', nameKey: 'garment.detailScreen.options.styles.work', name: 'Treball' },
    colors: [
      { id: 'beige', name: 'Beige', hexCode: '#d7ccc8' },
    ],
    insightKey: 'garment.exploreScreen.garments.rec_5.insight',
    insight: 'Ideal per al teu estil d\'oficina.',
  },
  {
    id: 'rec_6',
    nameKey: 'garment.exploreScreen.garments.rec_6.name',
    name: 'Vestit Plissat Midi',
    descriptionKey: 'garment.exploreScreen.garments.rec_6.description',
    description: 'Vestit llarg de punt plissat fi de color negre carbó.',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop',
    brand: 'Zara',
    price: '39,95 €',
    matchScore: 94,
    badgeKey: 'trending',
    category: { id: 'dresses', nameKey: 'garment.exploreScreen.categories.dresses', name: 'Vestits' },
    style: { id: 'party', nameKey: 'garment.detailScreen.options.styles.party', name: 'Fiesta' },
    colors: [
      { id: 'black', name: 'Negro', hexCode: '#212121' },
    ],
    insightKey: 'garment.exploreScreen.garments.rec_6.insight',
    insight: 'Ideal per als teus plans de cap de setmana o sopars de gala.',
  },
  {
    id: 'rec_7',
    nameKey: 'garment.exploreScreen.garments.rec_7.name',
    name: 'Mossa de Pell Minimal',
    descriptionKey: 'garment.exploreScreen.garments.rec_7.description',
    description: 'Bossa de disseny minimalista de pell d\'alta qualitat de color negre setinat.',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop',
    brand: 'Sandqvist',
    price: '120,00 €',
    matchScore: 91,
    badgeKey: 'basic',
    category: { id: 'accessories', nameKey: 'garment.exploreScreen.categories.accessories', name: 'Accessoris' },
    style: { id: 'work', nameKey: 'garment.detailScreen.options.styles.work', name: 'Treball' },
    colors: [
      { id: 'black', name: 'Negro', hexCode: '#1a1a1a' },
    ],
    insightKey: 'garment.exploreScreen.garments.rec_7.insight',
    insight: 'L\'accessori versàtil ideal.',
  },
  {
    id: 'rec_8',
    nameKey: 'garment.exploreScreen.garments.rec_8.name',
    name: 'Sneakers Sporty Active',
    descriptionKey: 'garment.exploreScreen.garments.rec_8.description',
    description: 'Sneakers de disseny retro-running minimalista amb panells combinats.',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop',
    brand: 'Nike',
    price: '119,99 €',
    matchScore: 89,
    badgeKey: 'new',
    category: { id: 'shoes', nameKey: 'garment.exploreScreen.categories.shoes', name: 'Calçat' },
    style: { id: 'sport', nameKey: 'garment.detailScreen.options.styles.sport', name: 'Sport' },
    colors: [
      { id: 'gray', name: 'Gris', hexCode: '#cfd8dc' },
      { id: 'white', name: 'Blanco', hexCode: '#ffffff' },
    ],
    insightKey: 'garment.exploreScreen.garments.rec_8.insight',
    insight: 'La comoditat més desitjada.',
  },
]

export const ExploreScreen = () => {
  const { t } = useTranslation()
  const colorScheme = useColorScheme()
  const primaryColor = getThemeColor('primary', colorScheme)

  const [filterSheetVisible, setFilterSheetVisible] = useState(false)
  const [selectedGarment, setSelectedGarment] = useState<RecommendedGarment | null>(null)
  const [detailsVisible, setDetailsVisible] = useState(false)

  const [filters, setFilters] = useState({
    searchText: '',
    selectedCategories: [] as string[],
    selectedStyles: [] as string[],
    selectedColors: [] as string[],
  })

  const updateFilter = <K extends keyof typeof filters>(key: K, value: typeof filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const toggleColorFilter = (colorId: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedColors: prev.selectedColors.includes(colorId)
        ? prev.selectedColors.filter((id) => id !== colorId)
        : [...prev.selectedColors, colorId],
    }))
  }

  const toggleStyleFilter = (styleId: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedStyles: prev.selectedStyles.includes(styleId)
        ? prev.selectedStyles.filter((id) => id !== styleId)
        : [...prev.selectedStyles, styleId],
    }))
  }

  const toggleCategoryFilter = (categoryId: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(categoryId)
        ? prev.selectedCategories.filter((id) => id !== categoryId)
        : [...prev.selectedCategories, categoryId],
    }))
  }

  const clearFilters = () => {
    setFilters({
      searchText: '',
      selectedCategories: [],
      selectedStyles: [],
      selectedColors: [],
    })
  }

  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchText.trim().length > 0 ||
      filters.selectedCategories.length > 0 ||
      filters.selectedStyles.length > 0 ||
      filters.selectedColors.length > 0
    )
  }, [filters])

  const getFilterCount = () => {
    let count = 0
    if (filters.searchText.trim()) count++
    if (filters.selectedColors.length > 0) count += filters.selectedColors.length
    if (filters.selectedStyles.length > 0) count += filters.selectedStyles.length
    if (filters.selectedCategories.length > 0) count += filters.selectedCategories.length
    return count
  }

  const filteredGarments = useMemo(() => {
    return MOCK_RECOMMENDED_GARMENTS.filter((item) => {
      const translatedName = t(item.nameKey).toLowerCase()
      const searchLower = filters.searchText.toLowerCase().trim()
      const matchesSearch = !searchLower ||
        translatedName.includes(searchLower) ||
        item.brand.toLowerCase().includes(searchLower)

      const matchesCategory = filters.selectedCategories.length === 0 ||
        filters.selectedCategories.includes(item.category.id)

      const matchesStyle = filters.selectedStyles.length === 0 ||
        filters.selectedStyles.includes(item.style.id)

      const matchesColor = filters.selectedColors.length === 0 ||
        item.colors.some((col) => filters.selectedColors.includes(col.id))

      return matchesSearch && matchesCategory && matchesStyle && matchesColor
    })
  }, [filters, t])

  const handleCardPress = (garment: RecommendedGarment) => {
    setSelectedGarment(garment)
    setDetailsVisible(true)
  }

  const handleAddToCloset = (garment: RecommendedGarment) => {
    console.log(`Garment added to closet: ${t(garment.nameKey)}`)
  }

  return (
    <View className='flex-1 bg-background pt-[12%]'>

      <View className='px-[6%] pb-[4%] flex-row justify-between items-center'>
        <View className='flex-1 pr-4'>
          <Text className='text-5xl font-bold tracking-tight text-foreground'>
            {t('garment.exploreScreen.title')}
          </Text>
          <Text className='text-sm text-muted-foreground mt-1'>
            {t('garment.exploreScreen.subtitle')}
          </Text>
        </View>
        <SettingsMenuButton />
      </View>

      <View className='px-[6%] pb-[4%]'>
        <FilterButton
          hasActiveFilters={hasActiveFilters}
          onPress={() => setFilterSheetVisible(true)}
          filterCount={getFilterCount()}
        />
      </View>

      <View className='flex-1 mt-2'>
        <FlatList
          data={filteredGarments}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <ExploreGarmentCard
              garment={item}
              onPress={() => handleCardPress(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View className='flex-1 items-center justify-center py-20 px-6'>
              <Ionicons name='shirt-outline' size={48} color={primaryColor} className='opacity-40' />
              <Text className='text-center text-base text-muted-foreground mt-4 font-semibold'>
                {t('garment.exploreScreen.emptyTitle')}
              </Text>
              <Text className='text-center text-xs text-muted-foreground/60 mt-1 px-4'>
                {t('garment.exploreScreen.emptySubtitle')}
              </Text>
            </View>
          )}
        />
      </View>

      <ExploreDetailsSheet
        visible={detailsVisible}
        garment={selectedGarment}
        onClose={() => setDetailsVisible(false)}
        onAddToCloset={handleAddToCloset}
      />

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
export default ExploreScreen
