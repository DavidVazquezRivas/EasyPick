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
  exploreScreen: {
    title: 'Explorar',
    subtitle: 'Prendas que se ajustan a tu estilo de vida',
    searchPlaceholder: 'Busca marcas, estilos o tipo de ropa...',
    emptyTitle: 'No se encontró ninguna prenda recomendada.',
    emptySubtitle: 'Prueba a modificar tu búsqueda o cambia de categoría.',
    categories: {
      all: 'Todos',
      tops: 'Tops',
      pants: 'Pantalones',
      shoes: 'Calzado',
      coats: 'Abrigos',
      dresses: 'Vestidos',
      accessories: 'Accesorios',
    },
    badges: {
      trending: 'Tendencia',
      new: 'Nuevo',
      recommended: 'Recomendado',
      bestSeller: 'Más vendido',
      basic: 'Básico',
    },
    details: {
      back: 'Atrás',
      matchPercentage: '{{score}}% Coincidencia',
      whyRecommended: '¿Por qué te recomendamos esto?',
      detailsTitle: 'Detalles del producto',
      category: 'Categoría',
      idealStyle: 'Estilo ideal',
      brand: 'Marca asociada',
      colors: 'Colores disponibles',
      price: 'Precio de mercado',
      description: 'Descripción',
      goToStore: 'Ir a la tienda',
      addToCloset: 'Añadir al armario',
      adding: 'Añadiendo...',
      addedAlertTitle: '¡Prenda añadida!',
      addedAlertMessage: 'Hemos añadido "{{name}}" a tu armario virtual directamente.',
      addedAlertButton: 'Perfecto',
      marketingAlertTitle: 'Redirección de Marketing',
      marketingAlertMessage: 'Abriendo la tienda de {{brand}} para comprar por {{price}}...',
      marketingAlertButton: 'Aceptar',
    },
    garments: {
      rec_1: {
        name: 'Chaqueta Bomber Swell',
        description: 'Una chaqueta bomber en tono tejido beige neutro de corte holgado. Diseñada con cuello redondo de canalé, hombros caídos y cierre frontal con cremallera de metal oculta por una solapa con botones a presión. Ideal para crear capas en looks diarios de entretiempo.',
        insight: 'Combina con un 98% de tu armario actual. Ideal para llevar sobre tus tops blancos básicos y vaqueros clásicos.'
      },
      rec_2: {
        name: 'Vaqueros Rectos Classic 501',
        description: 'Los vaqueros rectos originales que lo empezaron todo. Tejido de algodón premium no elástico de grosor medio en lavado azul claro atemporal. Cuentan con cinco bolsillos, bragueta de botones patentada y corte recto de la cadera al tobillo.',
        insight: 'Completa la silueta de tu armario. Estos vaqueros combinan a la perfección con el 85% de la ropa superior que ya tienes guardada.'
      },
      rec_3: {
        name: 'Mocasines de Ante Soft',
        description: 'Mocasines clásicos confeccionados en piel de ante suave y flexible de color marrón terracota. Interior de piel transpirable con plantilla amortiguada para una comodidad excepcional. Suela de goma fina y flexible antideslizante.',
        insight: 'Un calzado clave de transición. Apto para reuniones formales o cenas de fin de semana con vaqueros o chinos marrones.'
      },
      rec_4: {
        name: 'Top de Punto Oversized',
        description: 'Top holgado de tejido de punto fino y caído de color blanco roto. Cuello redondo acanalado, manga corta caída y bajos asimétricos con aberturas laterales. Muy agradable al tacto y con muy buena transpirabilidad.',
        insight: 'Tu base perfecta. Diseñado para acoplarse debajo de cualquiera de tus chaquetas o abrigos de color café.'
      },
      rec_5: {
        name: 'Gabardina Clásica Camel',
        description: 'Gabardina cruzada de tejido técnico resistente al agua en color camel clásico. Diseñada con solapas anchas, cinturón extraíble, puños ajustables y bolsillos laterales ocultos. Ideal para días grises en la ciudad.',
        insight: 'Ideal para tu estilo de oficina. Combina a la perfección con prendas de fondo oscuro y calzado formal marrón o negro.'
      },
      rec_6: {
        name: 'Vestido Plisado Midi',
        description: 'Vestido largo de punto plisado fino de color negro carbón. Cuello cerrado y silueta ajustada muy favorecedora con caída elegante. Diseño atemporal perfecto para cenas especiales o eventos nocturnos.',
        insight: 'Ideal para tus planes de fin de semana o cenas de gala. Vístelo fácilmente con tus accesorios metalizados.'
      },
      rec_7: {
        name: 'Bolso de Piel Minimal',
        description: 'Bolso de diseño minimalista de piel de alta calidad de color negro satinado. Cierre con imán y asa de hombro regulable. Compartimento interior totalmente forrado con bolsillo de cremallera.',
        insight: 'El accesorio versátil ideal. Adecuado tanto para llevar el ordenador en el día a día como para salidas casuales.'
      },
      rec_8: {
        name: 'Sneakers Sporty Active',
        description: 'Sneakers de diseño retro-running minimalista con paneles combinados de nailon gris claro y piel de ante suave color arena. Suela de goma retro en tono caramelo antideslizante y entresuela de EVA para una amortiguación total.',
        insight: 'La comodidad más deseada. Queda increíble con tus conjuntos más deportivos o para quitar formalidad a unos pantalones rectos.'
      }
    }
  },
}

export default garments
