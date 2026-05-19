import { useMemo, useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, View, useColorScheme } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import { useGetUserOutfits, usePatchSuggestion } from '@/core/query/suggestion'
import { QueryErrorDisplay } from '@/shared/components/QueryErrorDisplay'
import { getThemeColor } from '@/core/theme/themeColors'
import { Button, Text } from '@/shared/components/ui'
import { GlobalModalHost, showGlobalApiError } from '@/shared/components/layout'
import { SettingsMenuButton } from '@/shared/components/SettingsMenuButton'
import type { SuggestedOutfit } from '@/core/api/suggestion'
import { OutfitGridCard } from '../components/OutfitGridCard'
import { OutfitTabs, type OutfitsTabKey } from '../components/OutfitTabs'
import { SuggestionOutfitGarments } from '@/modules/suggestions/components/SuggestionOutfitGarments'

const filterOutfitsByTab = (outfits: SuggestedOutfit[], activeTab: OutfitsTabKey) => {
  if (activeTab === 'favorites') {
    return outfits.filter((outfit) => outfit.isFavorite)
  }

  return outfits.filter((outfit) => outfit.status === 'ACCEPTED')
}

export default function OutfitsScreen() {
  const { t } = useTranslation()
  const colorScheme = useColorScheme()
  const foreground = getThemeColor('foreground', colorScheme)
  const { data: outfits = [], isLoading, error, refetch } = useGetUserOutfits()
  const { mutateAsync: patchSuggestion, isPending: isPatchingSuggestion } = usePatchSuggestion()
  const [activeTab, setActiveTab] = useState<OutfitsTabKey>('saved')
  const [selectedOutfit, setSelectedOutfit] = useState<SuggestedOutfit | null>(null)

  const visibleOutfits = useMemo(() => filterOutfitsByTab(outfits, activeTab), [activeTab, outfits])

  const handleToggleFavorite = (outfit: SuggestedOutfit) => {
    void patchSuggestion({
      id: outfit.id,
      patch: { isFavorite: !outfit.isFavorite },
    }).catch(showGlobalApiError)
  }

  return (
    <View className='flex-1 bg-background px-4 pt-12'>
      <View className='mb-4 flex-row items-start justify-between px-1'>
        <View>
          <Text variant='h1' className='text-left text-4xl'>
            {t('common.navigation.tabs.outfits')}
          </Text>
          <Text variant='muted' className='mt-1'>
            {t('common.outfits.tabs.saved')} · {visibleOutfits.length}
          </Text>
        </View>

        <View className='flex-row items-center gap-3'>
          <Button variant='secondary' size='icon' className='rounded-full'>
            <Ionicons name='notifications-outline' size={18} color={foreground} />
          </Button>
          <SettingsMenuButton />
        </View>
      </View>

      <OutfitTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savedLabel={t('common.outfits.tabs.saved')}
        favoritesLabel={t('common.outfits.tabs.favorites')}
      />

      <View className='mt-4 flex-1'>
        {isLoading && (
          <View className='flex-1 items-center justify-center rounded-[32px] border border-border bg-card'>
            <ActivityIndicator size='large' color={foreground} />
            <Text className='mt-4 text-center text-muted-foreground'>{t('common.outfits.loading')}</Text>
          </View>
        )}

        {!isLoading && error && <QueryErrorDisplay error={error} onRetry={() => refetch()} className='mx-0 flex-1' />}

        {!isLoading && !error && visibleOutfits.length === 0 && (
          <View className='flex-1 items-center justify-center rounded-[32px] border border-border bg-card px-6 py-10'>
            <Text variant='h4' className='border-b-0 text-center pb-0'>
              {activeTab === 'favorites' ? t('common.outfits.empty.favorites') : t('common.outfits.empty.saved')}
            </Text>
          </View>
        )}

        {!isLoading && !error && visibleOutfits.length > 0 && (
          <FlatList
            data={visibleOutfits}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={{ paddingBottom: 24 }}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            renderItem={({ item }) => (
              <OutfitGridCard
                outfit={item}
                onToggleFavorite={handleToggleFavorite}
                onOpenDetails={setSelectedOutfit}
                disabled={isPatchingSuggestion}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <GlobalModalHost
        visible={selectedOutfit !== null}
        onClose={() => {
          setSelectedOutfit(null)
        }}>
        {selectedOutfit && (
          <SuggestionOutfitGarments
            garments={selectedOutfit.garments}
            onClose={() => {
              setSelectedOutfit(null)
            }}
            title={t('common.outfits.detailTitle')}
          />
        )}
      </GlobalModalHost>
    </View>
  )
}