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
        english: 'Ingles',
        spanish: 'Espanol',
      },
    },
  },
  actions: {
    signOut: 'Cerrar sesion',
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
}

export default common
