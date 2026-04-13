export const Routes = {
  Public: {
    Base: '/(public)',
    Login: '/(public)/login',
    DevErrorPlayground: '/(public)/dev-error-playground',
  },
  Private: {
    Base: '/(private)',
    Home: '/(private)/home',
    Garments: {
      Base: '/(private)/garments',
      Closet: '/(private)/garments/closet',
      Uploading: '/(private)/garments/uploading',
      Confirmation: '/(private)/garments/confirmation',
    },
    Explore: '/(private)/explore',
    Suggestions: '/(private)/suggestions',
    Outfits: '/(private)/outfits',
  },
}
