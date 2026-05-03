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
  suggestions: {
    loading: 'Finding your outfit suggestions...',
    empty: 'No suggestions are available right now.',
    exhausted: 'You have reached the end of today\'s generated outfits.',
    swipe: '{{count}} swipe',
    swipes: '{{count}} swipes',
    permissionTitle: 'Location is needed',
    permissionBody: 'Allow location access to load nearby outfit suggestions.',
    permissionAction: 'Enable location',
    swipeHint: 'Swipe left to reject or right to accept',
    cardLabel: 'Outfit',
    piece: '{{count}} piece',
    pieces: '{{count}} pieces',
    rejectSheet: {
      title: 'Why don\'t you like it?',
      subtitle: 'Your feedback improves future suggestions',
      customReasonPlaceholder: 'Tell us more (optional)...',
      send: 'Send rejection',
      skip: 'Skip',
      loadError: 'Could not load rejection reasons.',
    },
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
        3205: 'You have reached the daily limit for suggestion generations. Please try again later.',
        529: 'You have reached the daily limit for suggestion generations. Please try again later.',
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
