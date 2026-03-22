import * as ImagePicker from 'expo-image-picker'
import { AppError } from '@/core/api/global/errors'
import { useAddGarment } from '@/core/query/garment'
import { prepareImageForUpload } from '@/modules/garments/utils/prepareImageForUpload'
import { showGlobalApiError } from '@/shared/components/layout/ErrorBoundary'

export const useAddGarmentFromGallery = () => {
  const { mutateAsync, isPending } = useAddGarment()

  const selectImageFromGallery = async (): Promise<ImagePicker.ImagePickerAsset | null> => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!permissionResult.granted) {
      showGlobalApiError(new AppError('garment.uploadSourceSheet.errors.galleryPermissionDenied'))
      return null
    }

    try {
      const galleryResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
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
    } catch {
      showGlobalApiError(new AppError('garment.uploadSourceSheet.errors.galleryUploadFailed'))
      return null
    }
  }

  const uploadGarmentFromGalleryAsset = async (asset: ImagePicker.ImagePickerAsset): Promise<boolean> => {
    if (!asset.uri) {
      showGlobalApiError(new AppError('garment.uploadSourceSheet.errors.galleryAssetMissing'))
      return false
    }

    try {
      const preparedImage = await prepareImageForUpload(asset)

      if (!preparedImage.ok) {
        showGlobalApiError(new AppError(preparedImage.errorKey))
        return false
      }

      await mutateAsync(preparedImage.imageFile)
      return true
    } catch {
      showGlobalApiError(new AppError('garment.uploadSourceSheet.errors.galleryUploadFailed'))
      return false
    }
  }

  return {
    selectImageFromGallery,
    uploadGarmentFromGalleryAsset,
    isUploadingFromGallery: isPending,
  }
}
