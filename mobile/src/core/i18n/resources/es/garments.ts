const garments = {
  home: {
    title: 'Mis prendas',
    apiState: 'Estado API',
  },
  uploadingScreen: {
    title: 'Analizando prenda',
    status: 'Identificando tipo, color y ocasion...',
    description: 'Estamos procesando los detalles de tu imagen.',
  },
  confirmationScreen: {
    title: 'Confirmar prendas detectadas',
    description: 'Revisa y confirma los atributos detectados antes de guardar.',
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
    subtitle: 'Elige como subir la imagen',
    uploadingDescription: 'Preparando y subiendo imagen...',
    camera: {
      title: 'Camara',
      description: 'Toma una foto ahora',
    },
    gallery: {
      title: 'Galeria',
      description: 'Elige desde tus fotos',
    },
    errors: {
      cameraPermissionDenied: 'Se requiere permiso de camara para tomar una foto.',
      cameraAssetMissing: 'No se capturo ninguna foto. Intentalo de nuevo.',
      cameraUploadFailed: 'No se pudo subir la foto desde la camara. Intentalo de nuevo.',
      galleryPermissionDenied: 'Se requiere permiso de galeria para elegir una imagen.',
      galleryAssetMissing: 'No se selecciono ninguna imagen. Intentalo de nuevo.',
      galleryUploadFailed: 'No se pudo subir la imagen desde la galeria. Intentalo de nuevo.',
      fileReadFailed: 'No se pudo leer la imagen seleccionada. Prueba con otra.',
      imageProcessingFailed: 'No se pudo optimizar esta imagen. Prueba con otra.',
      fileTooLarge: 'La imagen seleccionada es demasiado grande. Elige una imagen mas pequena.',
    },
    cancel: 'Cancelar',
  },
}

export default garments
