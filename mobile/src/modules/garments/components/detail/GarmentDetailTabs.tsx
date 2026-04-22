import { Pressable, View } from 'react-native'
import { Text } from '@/shared/components/ui'

export type GarmentDetailTab = 'info' | 'outfit'

type GarmentDetailTabsProps = {
  activeTab: GarmentDetailTab
  onTabChange: (tab: GarmentDetailTab) => void
  infoLabel: string
  outfitLabel: string
}

export const GarmentDetailTabs = ({ activeTab, onTabChange, infoLabel, outfitLabel }: GarmentDetailTabsProps) => {
  return (
    <View className='bg-card'>
      <View className='flex-row border-b border-border'>
        <Pressable
          className='flex-1 items-center pb-3 pt-4'
          onPress={() => onTabChange('info')}
          accessibilityRole='tab'
          accessibilityState={{ selected: activeTab === 'info' }}>
          <Text className={activeTab === 'info' ? 'text-md font-semibold text-foreground' : 'text-md text-muted-foreground'}>
            {infoLabel}
          </Text>
          <View className={`mt-4 h-[2px] w-full ${activeTab === 'info' ? 'bg-foreground' : 'bg-transparent'}`} />
        </Pressable>

        <Pressable
          className='flex-1 items-center pb-3 pt-4'
          onPress={() => onTabChange('outfit')}
          accessibilityRole='tab'
          accessibilityState={{ selected: activeTab === 'outfit' }}>
          <Text className={activeTab === 'outfit' ? 'text-md font-semibold text-foreground' : 'text-md text-muted-foreground'}>
            {outfitLabel}
          </Text>
          <View className={`mt-4 h-[2px] w-full ${activeTab === 'outfit' ? 'bg-foreground' : 'bg-transparent'}`} />
        </Pressable>
      </View>
    </View>
  )
}
