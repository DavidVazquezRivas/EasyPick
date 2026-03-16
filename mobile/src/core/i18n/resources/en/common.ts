const common = {
  app: {
    name: 'EasyPick',
  },
  global: {
    error: {
      prefix: 'Error',
      unknown: 'Unknown error',
    },
    language: {
      label: 'Language',
      options: {
        english: 'English',
        spanish: 'Spanish',
      },
    },
  },
  actions: {
    signOut: 'Sign Out',
  },
  api: {
    errors: {
      noRefreshToken: 'No refresh token available',
      emptyRefreshData: 'Auth refresh returned empty data',
      backendCodes: {
        1000: 'An unexpected error occurred. Please try again later.',
        1001: 'Validation failed for the request.',
        1002: 'The requested resource was not found.',
        1003: 'The request was malformed or contains invalid data.',
        2000: 'Authentication is required to access this resource.',
        2001: 'You do not have permission to access this resource.',
      },
    },
  },
}

export default common
