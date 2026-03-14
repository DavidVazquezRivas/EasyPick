import AsyncStorage from '@react-native-async-storage/async-storage'
import { getLocales } from 'expo-localization'
import i18next, { type LanguageDetectorAsyncModule } from 'i18next'
import { initReactI18next } from 'react-i18next'
import authEn from '@/core/i18n/resources/en/auth'
import commonEn from '@/core/i18n/resources/en/common'
import garmentsEn from '@/core/i18n/resources/en/garments'
import authEs from '@/core/i18n/resources/es/auth'
import commonEs from '@/core/i18n/resources/es/common'
import garmentsEs from '@/core/i18n/resources/es/garments'

const LANGUAGE_STORAGE_KEY = 'easypick_language'
const SUPPORTED_LANGUAGES = ['en', 'es'] as const

const normalizeLanguage = (language: string | undefined): 'en' | 'es' => {
  const baseLanguage = language?.split('-')[0]
  if (baseLanguage === 'es') return 'es'
  return 'en'
}

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  init: () => {},
  detect: async (callback) => {
    try {
      const persistedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
      if (persistedLanguage && SUPPORTED_LANGUAGES.includes(persistedLanguage as 'en' | 'es')) {
        const language = normalizeLanguage(persistedLanguage)
        callback(language)
        return language
      }

      const [deviceLocale] = getLocales()
      const language = normalizeLanguage(deviceLocale?.languageTag ?? deviceLocale?.languageCode)
      callback(language)
      return language
    } catch {
      callback('en')
      return 'en'
    }
  },
  cacheUserLanguage: async (language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, normalizeLanguage(language))
    } catch {
      // Ignore persistence errors to avoid blocking UI language updates.
    }
  },
}

void i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES,
    defaultNS: 'translation',
    ns: ['translation'],
    resources: {
      en: {
        translation: {
          common: commonEn,
          auth: authEn,
          garment: garmentsEn,
        },
      },
      es: {
        translation: {
          common: commonEs,
          auth: authEs,
          garment: garmentsEs,
        },
      },
    },
    interpolation: {
      escapeValue: false,
    },
  })

export { LANGUAGE_STORAGE_KEY }
export default i18next
