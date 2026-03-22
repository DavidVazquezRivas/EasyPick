import { Slot, usePathname, useRouter } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'
import { UploadSourceSheet } from '@/modules/garments/components'
import { useAddGarmentFromCamera } from '@/modules/garments/hooks'
import { BottomTabBar, GlobalModalHost } from '@/shared/components/layout'
import { PRIVATE_BOTTOM_TABS } from '@/shared/constants/BottomTabs'
import { Routes } from '@/shared/constants/Routes'

export default function PrivateLayout() {
  const router = useRouter()
  const pathname = usePathname()
  const [isUploadSourceOpen, setIsUploadSourceOpen] = useState(false)
  const { addGarmentFromCamera, isUploadingFromCamera } = useAddGarmentFromCamera()

  const openUploadSource = () => setIsUploadSourceOpen(true)
  const closeUploadSource = () => setIsUploadSourceOpen(false)

  const handleCameraPress = async () => {
    closeUploadSource()
    router.push(Routes.Private.Garments.Uploading)

    try {
      await addGarmentFromCamera()
    } finally {
      if (router.canGoBack()) {
        router.back()
      } else {
        router.replace(Routes.Private.Home)
      }
    }
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
      isUploadingFromCamera={isUploadingFromCamera}
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
