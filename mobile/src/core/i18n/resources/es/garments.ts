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
    editHint: 'Puedes ajustar los atributos detectados antes de añadir la prenda.',
    fallback: {
      noName: 'Prenda sin nombre',
      pending: 'Pendiente',
    },
  },
  closetScreen: {
    title: 'Mi Armario',
    empty: 'No se encontraron resultados',
    fallback: {
      noName: 'Prenda sin nombre',
    }
  },
  detailScreen: {
    tabs: {
      info: 'Información',
      outfit: 'Outfit',
    },
    sectionTitle: 'Información de prenda',
    actions: {
      delete: 'Eliminar',
      edit: 'Editar',
      cancel: 'Cancelar',
      save: 'Guardar',
      changeImage: 'Cambiar imagen',
    },
    fields: {
      name: 'Nombre',
      category: 'Categoría',
      color: 'Color',
      style: 'Ocasión',
      brand: 'Marca',
    },
    options: {
      categories: {
        tops: 'Tops',
        pants: 'Pantalones',
        shoes: 'Calzado',
        accessories: 'Accesorios',
        dresses: 'Vestidos',
        coats: 'Abrigos',
      },
      styles: {
        casual: 'Casual',
        sport: 'Sport',
        formal: 'Formal',
        work: 'Trabajo',
        party: 'Fiesta',
      },
      colors: {
        white: 'Blanco',
        black: 'Negro',
        beige: 'Beige',
        blue: 'Azul',
        brown: 'Marrón',
        gray: 'Gris',
        red: 'Rojo',
        green: 'Verde',
      },
    },
    outfitTodo: 'Aún no hay outfits con esta prenda',
    fallback: {
      noName: 'Prenda sin nombre',
      pending: 'Pendiente',
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
  filters: {
    title: 'Filtros',
    search: 'Buscar',
    searchPlaceholder: 'Nombre de prenda...',
    color: 'Color',
    style: 'Estilo',
    category: 'Tipo',
    filters: 'Filtros',
    noOptions: 'No hay opciones',
    clear: 'Limpiar',
    apply: 'Aplicar',
    loadError: 'Error al cargar filtros',
  },
}

export default garments
