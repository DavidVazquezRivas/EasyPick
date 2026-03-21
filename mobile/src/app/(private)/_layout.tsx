import { Slot, usePathname } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'
import { UploadSourceSheet } from '@/modules/garments/components'
import { BottomTabBar, GlobalModalHost } from '@/shared/components/layout'
import { PRIVATE_BOTTOM_TABS } from '@/shared/constants/BottomTabs'

export default function PrivateLayout() {
  const pathname = usePathname()
  const [isUploadSourceOpen, setIsUploadSourceOpen] = useState(false)

  const openUploadSource = () => setIsUploadSourceOpen(true)
  const closeUploadSource = () => setIsUploadSourceOpen(false)

  const handleCameraPress = () => {
    // TODO: Integrate camera flow with permissions and picker.
    closeUploadSource()
  }

  const handleGalleryPress = () => {
    // TODO: Integrate gallery flow with media picker.
    closeUploadSource()
  }

  const uploadSourceSheet = (
    <UploadSourceSheet
      onCameraPress={handleCameraPress}
      onGalleryPress={handleGalleryPress}
      onCancelPress={closeUploadSource}
    />
  )

  return (
    <View className='flex-1 bg-background'>
      <View className='flex-1'>
        <Slot />
      </View>

      <BottomTabBar items={PRIVATE_BOTTOM_TABS} pathname={pathname} onCenterPress={openUploadSource} />

      <GlobalModalHost visible={isUploadSourceOpen} onClose={closeUploadSource}>
        {uploadSourceSheet}
      </GlobalModalHost>
    </View>
  )
}
