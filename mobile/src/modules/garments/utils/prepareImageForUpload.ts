import { ImagePickerAsset } from 'expo-image-picker'
import { File as ExpoFile } from 'expo-file-system'
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator'
import { UploadImageFile } from '@/core/api/garment/GarmentGateway'
import { ImageUploadLimits } from '@/shared/constants/ImageUpload'

type PrepareImageSuccess = {
  ok: true
  imageFile: UploadImageFile
}

type PrepareImageFailure = {
  ok: false
  errorKey: string
}

type PrepareImageResult = PrepareImageSuccess | PrepareImageFailure

const getFileSizeBytes = async (uri: string): Promise<number | null> => {
  const file = new ExpoFile(uri)
  const fileInfo = file.info()

  if (!fileInfo.exists) {
    return null
  }

  return typeof fileInfo.size === 'number' ? fileInfo.size : null
}

const getResizeAction = (asset: ImagePickerAsset) => {
  const { width, height } = asset

  if (!width || !height) {
    return null
  }

  const maxDimension = ImageUploadLimits.MAX_DIMENSION_PX
  if (width <= maxDimension && height <= maxDimension) {
    return null
  }

  if (width >= height) {
    return { resize: { width: maxDimension } }
  }

  return { resize: { height: maxDimension } }
}

const createUploadImageFile = (uri: string, originalName?: string): UploadImageFile => {
  const hasJpegExtension = originalName?.toLowerCase().endsWith('.jpg') || originalName?.toLowerCase().endsWith('.jpeg')
  const name = hasJpegExtension && originalName ? originalName : `upload-${Date.now()}.jpg`

  return {
    uri,
    name,
    type: 'image/jpeg',
  }
}

const optimizeImage = async (asset: ImagePickerAsset): Promise<string> => {
  const resizeAction = getResizeAction(asset)

  const firstPassContext = ImageManipulator.manipulate(asset.uri)
  if (resizeAction) {
    firstPassContext.resize(resizeAction.resize)
  }

  const firstPassImage = await firstPassContext.renderAsync()
  const firstPass = await firstPassImage.saveAsync({
    compress: ImageUploadLimits.INITIAL_COMPRESSION_QUALITY,
    format: SaveFormat.JPEG,
  })

  const firstPassSize = await getFileSizeBytes(firstPass.uri)
  if (firstPassSize !== null && firstPassSize <= ImageUploadLimits.CLIENT_MAX_FILE_SIZE_BYTES) {
    return firstPass.uri
  }

  const secondPassContext = ImageManipulator.manipulate(firstPass.uri)
  secondPassContext.resize({ width: 1920 })
  const secondPassImage = await secondPassContext.renderAsync()
  const secondPass = await secondPassImage.saveAsync({
    compress: ImageUploadLimits.SECOND_PASS_COMPRESSION_QUALITY,
    format: SaveFormat.JPEG,
  })

  return secondPass.uri
}

export const prepareImageForUpload = async (asset: ImagePickerAsset): Promise<PrepareImageResult> => {
  try {
    const optimizedUri = await optimizeImage(asset)
    const optimizedSize = await getFileSizeBytes(optimizedUri)

    if (optimizedSize === null) {
      return {
        ok: false,
        errorKey: 'garment.uploadSourceSheet.errors.fileReadFailed',
      }
    }

    if (optimizedSize > ImageUploadLimits.CLIENT_MAX_FILE_SIZE_BYTES) {
      return {
        ok: false,
        errorKey: 'garment.uploadSourceSheet.errors.fileTooLarge',
      }
    }

    return {
      ok: true,
      imageFile: createUploadImageFile(optimizedUri, asset.fileName ?? undefined),
    }
  } catch {
    return {
      ok: false,
      errorKey: 'garment.uploadSourceSheet.errors.imageProcessingFailed',
    }
  }
}
