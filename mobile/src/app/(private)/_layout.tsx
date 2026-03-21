import { Slot, usePathname } from 'expo-router'
import { View } from 'react-native'
import { BottomTabBar } from '@/shared/components/layout'
import { PRIVATE_BOTTOM_TABS } from '@/shared/constants/BottomTabs'

export default function PrivateLayout() {
  const pathname = usePathname()

  return (
    <View className='flex-1 bg-background'>
      <View className='flex-1'>
        <Slot />
      </View>

      <BottomTabBar items={PRIVATE_BOTTOM_TABS} pathname={pathname} />
    </View>
  )
}
