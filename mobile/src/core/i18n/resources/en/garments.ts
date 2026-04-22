const garments = {
  home: {
    title: 'My Garments',
    apiState: 'API state',
  },
  uploadingScreen: {
    title: 'Analyzing Garment',
    status: 'Identifying type, color, and occasion...',
    description: 'We are processing your image details.',
  },
  confirmationScreen: {
    title: 'Confirm Detected Garments',
    description: 'Review and confirm detected attributes before saving.',
    headerTitle: 'New Garment',
    discard: 'Discard',
    create: 'Add garment',
    progress: '{{current}} of {{total}}',
    attributes: {
      title: 'Garment information',
      name: 'Name',
      category: 'Category',
      brand: 'Brand',
      style: 'Style',
      colors: 'Colors',
    },
    editHint: 'You can adjust the detected attributes before adding the garment.',
    fallback: {
      noName: 'Unnamed garment',
      pending: 'Pending',
    },
  },
  closetScreen: {
    title: 'My Closet',
    fallback: {
      noName: 'Unnamed garment',
    }
  },
  detailScreen: {
    tabs: {
      info: 'Information',
      outfit: 'Outfit',
    },
    sectionTitle: 'Garment information',
    actions: {
      delete: 'Delete',
      edit: 'Edit',
      cancel: 'Cancel',
      save: 'Save',
      changeImage: 'Change image',
    },
    fields: {
      name: 'Name',
      category: 'Category',
      color: 'Color',
      style: 'Occasion',
      brand: 'Brand',
    },
    options: {
      categories: {
        tops: 'Tops',
        pants: 'Pants',
        shoes: 'Shoes',
        accessories: 'Accessories',
        dresses: 'Dresses',
        coats: 'Coats',
      },
      styles: {
        casual: 'Casual',
        sport: 'Sport',
        formal: 'Formal',
        work: 'Work',
        party: 'Party',
      },
      colors: {
        white: 'White',
        black: 'Black',
        beige: 'Beige',
        blue: 'Blue',
        brown: 'Brown',
        gray: 'Gray',
        red: 'Red',
        green: 'Green',
      },
    },
    outfitTodo: 'Coming soon: outfit recommendations for this garment.',
    fallback: {
      noName: 'Unnamed garment',
      pending: 'Pending',
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
