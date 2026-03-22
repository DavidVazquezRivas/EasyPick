const garments = {
  home: {
    title: 'Mis prendas',
    apiState: 'Estado API',
  },
  uploadingScreen: {
    title: 'Subiendo prenda',
    description: 'Espera mientras procesamos tu imagen.',
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
    camera: {
      title: 'Camara',
      description: 'Toma una foto ahora',
      uploadingDescription: 'Subiendo foto...',
    },
    gallery: {
      title: 'Galeria',
      description: 'Elige desde tus fotos',
    },
    errors: {
      cameraPermissionDenied: 'Se requiere permiso de camara para tomar una foto.',
      cameraAssetMissing: 'No se capturo ninguna foto. Intentalo de nuevo.',
      cameraUploadFailed: 'No se pudo subir la foto desde la camara. Intentalo de nuevo.',
    },
    cancel: 'Cancelar',
  },
}

export default garments
