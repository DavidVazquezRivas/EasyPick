import * as ImagePicker from 'expo-image-picker'
import { CompleteGarment } from '@/core/api/garment/models/CompleteGarment'
import { AppError } from '@/core/api/global/errors'
import { useAddGarment } from '@/core/query/garment'
import { showGlobalApiError } from '@/shared/components/layout/ErrorBoundary'
import { prepareImageForUpload } from '@/modules/garments/utils/prepareImageForUpload'

export const useAddGarmentFromCamera = () => {
  const { mutateAsync, isPending } = useAddGarment()

  const selectImageFromCamera = async (): Promise<ImagePicker.ImagePickerAsset | null> => {
    const { status: existingStatus } = await ImagePicker.getCameraPermissionsAsync()
    
    let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== 'granted') {
      showGlobalApiError(new AppError('garment.uploadSourceSheet.errors.cameraPermissionDenied'))
      return null
    }

    try {
      const cameraResult = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.7,
      })

      if (cameraResult.canceled) {
        return null
      }

      const asset = cameraResult.assets?.[0]

      if (!asset?.uri) {
        showGlobalApiError(new AppError('garment.uploadSourceSheet.errors.cameraAssetMissing'))
        return null
      }

      return asset
    } catch (error) {
      showGlobalApiError(new AppError('garment.uploadSourceSheet.errors.cameraUploadFailed'))
      return null
    }
  }

  const uploadGarmentFromCameraAsset = async (
    asset: ImagePicker.ImagePickerAsset,
  ): Promise<CompleteGarment[] | null> => {
    if (!asset.uri) {
      showGlobalApiError(new AppError('garment.uploadSourceSheet.errors.cameraAssetMissing'))
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
      showGlobalApiError(new AppError('garment.uploadSourceSheet.errors.cameraUploadFailed'))
      return null
    }
  }

  return {
    selectImageFromCamera,
    uploadGarmentFromCameraAsset,
    isUploadingFromCamera: isPending,
  }
}