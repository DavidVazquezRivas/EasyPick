import { Slot, usePathname } from 'expo-router'
import { View } from 'react-native'
import { UploadSourceSheet } from '@/modules/garments/components'
import { useGarmentUploadFlow } from '@/modules/garments/hooks'
import { ConfirmationFlowProvider } from '@/modules/garments/context/ConfirmationFlowContext'
import { BottomTabBar, GlobalModalHost } from '@/shared/components/layout'
import { PRIVATE_BOTTOM_TABS } from '@/shared/constants/BottomTabs'

function PrivateLayoutContent() {
  const pathname = usePathname()
  const {
    isUploadSourceOpen,
    isUploading,
    openUploadSource,
    closeUploadSource,
    handleCameraPress,
    handleGalleryPress,
  } = useGarmentUploadFlow()

  const uploadSourceSheet = (
    <UploadSourceSheet
      onCameraPress={handleCameraPress}
      onGalleryPress={handleGalleryPress}
      onCancelPress={closeUploadSource}
      isUploading={isUploading}
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

export default function PrivateLayout() {
  return (
    <ConfirmationFlowProvider>
      <PrivateLayoutContent />
    </ConfirmationFlowProvider>
  )
}
