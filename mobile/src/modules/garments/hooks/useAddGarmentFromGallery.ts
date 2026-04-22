import * as ImagePicker from 'expo-image-picker'
import { CompleteGarment } from '@/core/api/garment/models/CompleteGarment'
import { AppError } from '@/core/api/global/errors'
import { useAddGarment } from '@/core/query/garment'
import { prepareImageForUpload } from '@/modules/garments/utils/prepareImageForUpload'
import { showGlobalApiError } from '@/shared/components/layout/ErrorBoundary'

export const useAddGarmentFromGallery = () => {
  const { mutateAsync, isPending } = useAddGarment()

  const selectImageFromGallery = async (): Promise<ImagePicker.ImagePickerAsset | null> => {
    const { status: existingStatus } = await ImagePicker.getMediaLibraryPermissionsAsync()
    
    let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== 'granted') {
      showGlobalApiError(new AppError('garment.uploadSourceSheet.errors.galleryPermissionDenied'))
      return null
    }

    try {
      const galleryResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.7,
      })

      if (galleryResult.canceled) {
        return null
      }

      const asset = galleryResult.assets?.[0]

      if (!asset?.uri) {
        showGlobalApiError(new AppError('garment.uploadSourceSheet.errors.galleryAssetMissing'))
        return null
      }

      return asset
    } catch (error) {
      showGlobalApiError(new AppError('garment.uploadSourceSheet.errors.galleryUploadFailed'))
      return null
    }
  }

  const uploadGarmentFromGalleryAsset = async (
    asset: ImagePicker.ImagePickerAsset,
  ): Promise<CompleteGarment[] | null> => {
    if (!asset.uri) {
      showGlobalApiError(new AppError('garment.uploadSourceSheet.errors.galleryAssetMissing'))
      return null
    }

    try {
      const preparedImage = await prepareImageForUpload(asset)

      if (!preparedImage.ok) {
        showGlobalApiError(new AppError(preparedImage.errorKey))
        return null
      }

      const createdGarments = await mutateAsync(preparedImage.imageFile)
      return createdGarments
    } catch {
      showGlobalApiError(new AppError('garment.uploadSourceSheet.errors.galleryUploadFailed'))
      return null
    }
  }

  return {
    selectImageFromGallery,
    uploadGarmentFromGalleryAsset,
    isUploadingFromGallery: isPending,
  }
}