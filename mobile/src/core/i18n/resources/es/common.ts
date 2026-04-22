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
  api: {
    errors: {
      noRefreshToken: 'No hay refresh token disponible',
      emptyRefreshData: 'El refresh de auth regreso datos vacios',
      backendCodes: {
        1000: 'Ocurrio un error inesperado. Intentalo de nuevo mas tarde.',
        1001: 'La validacion de la solicitud fallo.',
        1002: 'No se encontro el recurso solicitado.',
        1003: 'La solicitud es invalida o tiene datos mal formados.',
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
