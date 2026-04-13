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
    retry: 'Retry',
    dismiss: 'Dismiss',
  },
  navigation: {
    tabs: {
      closet: 'Closet',
      explore: 'Explore',
      create: 'Add',
      suggestions: 'Suggestions',
      outfits: 'Outfits',
    },
    placeholder: 'Placeholder screen',
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
  devErrorTest: {
    title: 'Error Handling Playground',
    description: 'Temporary page to force handled and generic errors for UI validation.',
    sectionInline: 'Inline error (QueryErrorDisplay)',
    sectionGlobal: 'Global error boundary (ErrorBoundary)',
    globalHint: 'Tap to throw a runtime error and verify the global modal behavior.',
    handledFallbackMessage: 'Handled error fallback message',
    genericInlineMessage: 'Generic inline error without backend code',
    genericRuntimeMessage: 'Generic runtime error thrown on purpose',
    actions: {
      forceHandled: 'Force handled error (ApiError code)',
      forceGenericInline: 'Force generic inline error',
      forceGenericBoundary: 'Force generic global error',
      reset: 'Reset test state',
      backToLogin: 'Back to Login',
    },
  },
}

export default common
