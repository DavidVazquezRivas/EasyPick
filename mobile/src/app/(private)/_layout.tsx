import { Slot, useSegments } from 'expo-router'
import { View } from 'react-native'
import { UploadSourceSheet } from '@/modules/garments/components'
import { useGarmentUploadFlow } from '@/modules/garments/hooks'
import { ConfirmationFlowProvider } from '@/modules/garments/context/ConfirmationFlowContext'
import { BottomTabBar, GlobalModalHost } from '@/shared/components/layout'
import { PRIVATE_BOTTOM_TABS } from '@/shared/constants/BottomTabs'

function PrivateLayoutContent() {
  const segments = useSegments()
  const normalizedSegments = [...segments] as string[]
  const section = normalizedSegments[1] ?? ''
  const garmentSubRoute = normalizedSegments[2] ?? ''
  const isKnownGarmentListRoute = garmentSubRoute === 'closet' || garmentSubRoute === 'uploading' || garmentSubRoute === 'confirmation'
  const isGarmentDetailRoute = section === 'garments' && Boolean(garmentSubRoute) && !isKnownGarmentListRoute
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

      {!isGarmentDetailRoute && (
        <BottomTabBar items={PRIVATE_BOTTOM_TABS} pathname={`/${normalizedSegments.join('/')}`} onCenterPress={openUploadSource} />
      )}

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
