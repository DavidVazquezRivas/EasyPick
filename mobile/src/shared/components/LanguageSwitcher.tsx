import { useTranslation } from 'react-i18next'
import { Text, Button } from '@/shared/components/ui'
import { View } from 'react-native'

export const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation()

  return (
    < View className="px-4 pt-2 pb-2.5" >
      <Text className="text-xs font-semibold uppercase tracking-widest mb-2 text-muted-foreground">{t('settings.dropdown.language')}</Text>
      <View className="flex-row gap-2">
        <Button
          variant={i18n.language.startsWith('es') ? 'default' : 'outline'}
          onPress={() => i18n.changeLanguage('es')}>
          {<Text>🇪🇸</Text>}{t('common.global.language.options.spanish')}
        </Button>
        <Button
          variant={i18n.language.startsWith('en') ? 'default' : 'outline'}
          onPress={() => i18n.changeLanguage('en')}>
          {<Text>🇬🇧</Text>}{t('common.global.language.options.english')}
        </Button>
      </View>
    </View >
  )
}
