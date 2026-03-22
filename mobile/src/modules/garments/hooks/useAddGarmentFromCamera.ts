import * as ImagePicker from 'expo-image-picker'
import { AppError } from '@/core/api/global/errors'
import { useAddGarment } from '@/core/query/garment'
import { UploadImageFile } from '@/core/api/garment/GarmentGateway'
import { showGlobalApiError } from '@/shared/components/layout/ErrorBoundary'

const getCameraAssetAsFile = (asset: ImagePicker.ImagePickerAsset): UploadImageFile => {
  const name = asset.fileName ?? `camera-upload-${Date.now()}.jpg`
  const type = asset.mimeType ?? 'image/jpeg'

  // React Native FormData expects uri/name/type objects for file parts.
  return {
    uri: asset.uri,
    name,
    type,
  }
}

export const useAddGarmentFromCamera = () => {
  const { mutateAsync, isPending } = useAddGarment()

  const addGarmentFromCamera = async (): Promise<boolean> => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync()

    if (!permissionResult.granted) {
      showGlobalApiError(new AppError('garment.uploadSourceSheet.errors.cameraPermissionDenied'))
      return false
    }

    const cameraResult = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    })

    if (cameraResult.canceled) {
      return false
    }

    const asset = cameraResult.assets?.[0]

    if (!asset?.uri) {
      showGlobalApiError(new AppError('garment.uploadSourceSheet.errors.cameraAssetMissing'))
      return false
    }

    try {
      const imageFile = getCameraAssetAsFile(asset)
      await mutateAsync(imageFile)
      return true
    } catch {
      showGlobalApiError(new AppError('garment.uploadSourceSheet.errors.cameraUploadFailed'))
      return false
    }
  }

  return {
    addGarmentFromCamera,
    isUploadingFromCamera: isPending,
  }
}
