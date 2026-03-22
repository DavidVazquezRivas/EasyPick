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
    camera: {
      title: 'Camera',
      description: 'Take a photo now',
      uploadingDescription: 'Uploading photo...',
    },
    gallery: {
      title: 'Gallery',
      description: 'Choose from your photos',
    },
    errors: {
      cameraPermissionDenied: 'Camera permission is required to take a photo.',
      cameraAssetMissing: 'No photo was captured. Please try again.',
      cameraUploadFailed: 'Failed to upload photo from camera. Please try again.',
    },
    cancel: 'Cancel',
  },
}

export default garments
