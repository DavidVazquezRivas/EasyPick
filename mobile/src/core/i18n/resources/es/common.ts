const common = {
  app: {
    name: 'EasyPick',
  },
  global: {
    error: {
      prefix: 'Error',
      unknown: 'Error desconocido',
    },
    language: {
      label: 'Idioma',
      options: {
        english: 'Inglés',
        spanish: 'Español',
      },
    },
  },
  actions: {
    signOut: 'Cerrar sesion',
    retry: 'Reintentar',
    dismiss: 'Cerrar',
  },
  navigation: {
    tabs: {
      closet: 'Armario',
      explore: 'Explorar',
      create: 'Añadir',
      suggestions: 'Sugerencias',
      outfits: 'Outfits',
    },
    placeholder: 'Pantalla placeholder',
  },
  suggestions: {
    loading: 'Buscando tus sugerencias de outfit...',
    empty: 'No hay sugerencias disponibles ahora mismo.',
    exhausted: 'Se han acabado los outfits generados para hoy.',
    swipe: '{{count}} deslizamiento',
    swipes: '{{count}} deslizamientos',
    permissionTitle: 'Se necesita la ubicación',
    permissionBody: 'Permite el acceso a la ubicación para cargar sugerencias cercanas.',
    permissionAction: 'Activar ubicación',
    swipeHint: 'Desliza a la izquierda para rechazar o a la derecha para aceptar',
    cardLabel: 'Outfit',
    piece: '{{count}} prenda',
    pieces: '{{count}} prendas',
    rejectSheet: {
      title: '¿Por qué no te gusta?',
      subtitle: 'Tu feedback mejora las próximas sugerencias',
      customReasonPlaceholder: 'Cuéntanos más (opcional)...',
      send: 'Enviar rechazo',
      skip: 'Saltar',
      loadError: 'No se pudieron cargar los motivos de rechazo.',
    },
  },
  api: {
    errors: {
      noRefreshToken: 'No hay refresh token disponible',
      emptyRefreshData: 'El refresh de auth regreso datos vacios',
      backendCodes: {
        1000: 'Ocurrio un error inesperado. Intentalo de nuevo mas tarde.',
        1001: 'La validacion de la solicitud fallo.',
        1002: 'No se encontro el recurso solicitado.',
        1003: 'La solicitud es invalida o tiene datos mal formados.',
        3205: 'Ya has alcanzado el limite diario de generaciones de sugerencias. Vuelve a intentarlo mas tarde.',
        529: 'Ya has alcanzado el limite diario de generaciones de sugerencias. Vuelve a intentarlo mas tarde.',
        2000: 'Se requiere autenticacion para acceder a este recurso.',
        2001: 'No tienes permisos para acceder a este recurso.',
      },
    },
  },
  devErrorTest: {
    title: 'Playground de Errores',
    description: 'Pantalla temporal para forzar errores manejados y genericos.',
    sectionInline: 'Error inline (QueryErrorDisplay)',
    sectionGlobal: 'Error global (ErrorBoundary)',
    globalHint: 'Pulsa para lanzar un error runtime y validar la modal global.',
    handledFallbackMessage: 'Mensaje fallback de error manejado',
    genericInlineMessage: 'Error inline generico sin codigo de backend',
    genericRuntimeMessage: 'Error runtime generico lanzado a proposito',
    actions: {
      forceHandled: 'Forzar error manejado (ApiError code)',
      forceGenericInline: 'Forzar error inline generico',
      forceGenericBoundary: 'Forzar error global generico',
      reset: 'Resetear estado de prueba',
      backToLogin: 'Volver al Login',
    },
  },
}

export default common
