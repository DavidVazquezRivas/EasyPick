const garments = {
  home: {
    title: 'Mis prendas',
    apiState: 'Estado API',
  },
  uploadingScreen: {
    title: 'Analizando prenda',
    status: 'Identificando tipo, color y ocasión...',
    description: 'Estamos procesando los detalles de tu imagen.',
  },
  confirmationScreen: {
    title: 'Confirmar prendas detectadas',
    description: 'Revisa y confirma los atributos detectados antes de guardar.',
    headerTitle: 'Nueva prenda',
    discard: 'Descartar',
    create: 'Añadir prenda',
    progress: '{{current}} de {{total}}',
    attributes: {
      title: 'Información de prenda',
      name: 'Nombre',
      category: 'Categoría',
      brand: 'Marca',
      style: 'Estilo',
      colors: 'Colores',
    },
    todo: {
      attributes: 'TODO: permitir edición manual de atributos.',
    },
    fallback: {
      noName: 'Prenda sin nombre',
      pending: 'Pendiente',
    },
  },
  detail: {
    form: {
      name: {
        label: 'Nombre',
      },
    },
  },
  uploadSourceSheet: {
    title: 'Añadir prenda',
    subtitle: 'Elige cómo subir la imagen',
    uploadingDescription: 'Preparando y subiendo imagen...',
    camera: {
      title: 'Cámara',
      description: 'Toma una foto ahora',
    },
    gallery: {
      title: 'Galería',
      description: 'Elige desde tus fotos',
    },
    errors: {
      cameraPermissionDenied: 'Se requiere permiso de cámara para tomar una foto.',
      cameraAssetMissing: 'No se capturó ninguna foto. Inténtalo de nuevo.',
      cameraUploadFailed: 'No se pudo subir la foto desde la cámara. Inténtalo de nuevo.',
      galleryPermissionDenied: 'Se requiere permiso de galería para elegir una imagen.',
      galleryAssetMissing: 'No se seleccionó ninguna imagen. Inténtalo de nuevo.',
      galleryUploadFailed: 'No se pudo subir la imagen desde la galería. Inténtalo de nuevo.',
      fileReadFailed: 'No se pudo leer la imagen seleccionada. Prueba con otra.',
      imageProcessingFailed: 'No se pudo optimizar esta imagen. Prueba con otra.',
      fileTooLarge: 'La imagen seleccionada es demasiado grande. Elige una imagen más pequeña.',
    },
    cancel: 'Cancelar',
  },
}

export default garments
