const garments = {
  home: {
    title: 'My Garments',
    apiState: 'API state',
  },
  uploadingScreen: {
    title: 'Uploading Garment',
    description: 'Please wait while we process your image.',
  },
  confirmationScreen: {
    title: 'Confirm Detected Garments',
    description: 'Review and confirm detected attributes before saving.',
  },
  detail: {
    form: {
      name: {
        label: 'Name',
      },
    },
  },
  uploadSourceSheet: {
    title: 'Add garment',
    subtitle: 'Choose how to upload the image',
    uploadingDescription: 'Preparing and uploading image...',
    camera: {
      title: 'Camera',
      description: 'Take a photo now',
    },
    gallery: {
      title: 'Gallery',
      description: 'Choose from your photos',
    },
    errors: {
      cameraPermissionDenied: 'Camera permission is required to take a photo.',
      cameraAssetMissing: 'No photo was captured. Please try again.',
      cameraUploadFailed: 'Failed to upload photo from camera. Please try again.',
      galleryPermissionDenied: 'Gallery permission is required to choose an image.',
      galleryAssetMissing: 'No image was selected. Please try again.',
      galleryUploadFailed: 'Failed to upload image from gallery. Please try again.',
      fileReadFailed: 'We could not read the selected image. Please try another one.',
      imageProcessingFailed: 'We could not optimize this image. Please try another one.',
      fileTooLarge: 'The selected image is too large. Please choose a smaller image.',
    },
    cancel: 'Cancel',
  },
}

export default garments
