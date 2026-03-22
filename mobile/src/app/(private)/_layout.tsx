import { Slot, usePathname, useRouter } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'
import { UploadSourceSheet } from '@/modules/garments/components'
import { useAddGarmentFromCamera, useAddGarmentFromGallery } from '@/modules/garments/hooks'
import { BottomTabBar, GlobalModalHost } from '@/shared/components/layout'
import { PRIVATE_BOTTOM_TABS } from '@/shared/constants/BottomTabs'
import { Routes } from '@/shared/constants/Routes'

export default function PrivateLayout() {
  const router = useRouter()
  const pathname = usePathname()
  const [isUploadSourceOpen, setIsUploadSourceOpen] = useState(false)
  const { selectImageFromCamera, uploadGarmentFromCameraAsset, isUploadingFromCamera } = useAddGarmentFromCamera()
  const { selectImageFromGallery, uploadGarmentFromGalleryAsset, isUploadingFromGallery } = useAddGarmentFromGallery()
  const isUploading = isUploadingFromCamera || isUploadingFromGallery

  const openUploadSource = () => setIsUploadSourceOpen(true)
  const closeUploadSource = () => setIsUploadSourceOpen(false)

  const navigateToUploading = (previewUri: string) => {
    router.push({
      pathname: Routes.Private.Garments.Uploading,
      params: { previewUri },
    })
  }

  const finishUploadingFlow = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace(Routes.Private.Home)
    }
  }

  const handleCameraPress = async () => {
    closeUploadSource()
    const selectedAsset = await selectImageFromCamera()

    if (!selectedAsset?.uri) {
      return
    }

    navigateToUploading(selectedAsset.uri)

    try {
      await uploadGarmentFromCameraAsset(selectedAsset)
    } finally {
      finishUploadingFlow()
    }
  }

  const handleGalleryPress = async () => {
    closeUploadSource()
    const selectedAsset = await selectImageFromGallery()

    if (!selectedAsset?.uri) {
      return
    }

    navigateToUploading(selectedAsset.uri)

    try {
      await uploadGarmentFromGalleryAsset(selectedAsset)
    } finally {
      finishUploadingFlow()
    }
  }

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
