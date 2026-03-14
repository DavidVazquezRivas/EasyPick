import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, Text, Button } from '@/shared/components/ui'

export const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <Text variant='large'>{t('common.global.language.label')}</Text>
      </CardHeader>
      <CardContent className='flex-row gap-2'>
        <Button
          variant={i18n.language.startsWith('es') ? 'default' : 'outline'}
          onPress={() => i18n.changeLanguage('es')}>
          {t('common.global.language.options.spanish')}
        </Button>
        <Button
          variant={i18n.language.startsWith('en') ? 'default' : 'outline'}
          onPress={() => i18n.changeLanguage('en')}>
          {t('common.global.language.options.english')}
        </Button>
      </CardContent>
    </Card>
  )
}
