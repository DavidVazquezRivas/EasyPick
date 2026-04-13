import { useRouter } from 'expo-router'
import { useState } from 'react'
import { CompleteGarment } from '@/core/api/garment/models/CompleteGarment'
import { useAddGarmentFromCamera } from '@/modules/garments/hooks/useAddGarmentFromCamera'
import { useAddGarmentFromGallery } from '@/modules/garments/hooks/useAddGarmentFromGallery'
import { useConfirmationFlow } from '@/modules/garments/context/ConfirmationFlowContext'
import { Routes } from '@/shared/constants/Routes'

export const useGarmentUploadFlow = () => {
  const router = useRouter()
  const [isUploadSourceOpen, setIsUploadSourceOpen] = useState(false)
  const { setConfirmationFlow } = useConfirmationFlow()
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

  const closeUploadingScreen = () => {
    if (router.canGoBack()) {
      router.back()
      return
    }

    router.replace(Routes.Private.Garments.Closet)
  }

  const openConfirmationFlow = (createdGarments: CompleteGarment[]) => {
    setConfirmationFlow(createdGarments)
    router.replace(Routes.Private.Garments.Confirmation)
  }

  const handleUploadResult = (createdGarments: CompleteGarment[] | null) => {
    if (!createdGarments || createdGarments.length === 0) {
      closeUploadingScreen()
      return
    }

    openConfirmationFlow(createdGarments)
  }

  const handleCameraPress = async () => {
    closeUploadSource()
    const selectedAsset = await selectImageFromCamera()

    if (!selectedAsset?.uri) {
      return
    }

    navigateToUploading(selectedAsset.uri)

    try {
      const createdGarments = await uploadGarmentFromCameraAsset(selectedAsset)
      handleUploadResult(createdGarments)
    } catch {
      closeUploadingScreen()
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
      const createdGarments = await uploadGarmentFromGalleryAsset(selectedAsset)
      handleUploadResult(createdGarments)
    } catch {
      closeUploadingScreen()
    }
  }

  return {
    isUploadSourceOpen,
    isUploading,
    openUploadSource,
    closeUploadSource,
    handleCameraPress,
    handleGalleryPress,
  }
}
