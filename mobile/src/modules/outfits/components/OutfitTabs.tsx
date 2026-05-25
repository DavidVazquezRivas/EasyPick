import { Pressable, View } from 'react-native'
import { Text } from '@/shared/components/ui'

export type OutfitsTabKey = 'saved' | 'favorites'

type OutfitTabsProps = {
  activeTab: OutfitsTabKey
  onTabChange: (tab: OutfitsTabKey) => void
  savedLabel: string
  favoritesLabel: string
}

export const OutfitTabs = ({ activeTab, onTabChange, savedLabel, favoritesLabel }: OutfitTabsProps) => {
  return (
    <View className='flex-row rounded-[18px] bg-secondary p-1'>
      <Pressable
        className={`flex-1 items-center rounded-[14px] px-4 py-3 ${activeTab === 'saved' ? 'bg-foreground' : 'bg-transparent'}`}
        onPress={() => onTabChange('saved')}
        accessibilityRole='tab'
        accessibilityState={{ selected: activeTab === 'saved' }}>
        <Text className={activeTab === 'saved' ? 'text-sm font-semibold text-background' : 'text-sm text-muted-foreground'}>
          {savedLabel}
        </Text>
      </Pressable>

      <Pressable
        className={`flex-1 items-center rounded-[14px] px-4 py-3 ${activeTab === 'favorites' ? 'bg-foreground' : 'bg-transparent'}`}
        onPress={() => onTabChange('favorites')}
        accessibilityRole='tab'
        accessibilityState={{ selected: activeTab === 'favorites' }}>
        <Text className={activeTab === 'favorites' ? 'text-sm font-semibold text-background' : 'text-sm text-muted-foreground'}>
          {favoritesLabel}
        </Text>
      </Pressable>
    </View>
  )
}