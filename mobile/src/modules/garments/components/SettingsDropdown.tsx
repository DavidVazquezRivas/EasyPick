import { View } from 'react-native'
import { useRouter } from 'expo-router'
import { Text, Button, Card, Switch } from '@/shared/components/ui'
import { useColorScheme } from 'nativewind'
import { getThemeColor } from '@/core/theme/themeColors'
import { Routes } from '@/shared/constants/Routes'
import { LanguageSwitcher } from '@/shared/components'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Feather } from '@expo/vector-icons'

export const SettingsDropdown = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme()
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const { t } = useTranslation()

  const foreground = getThemeColor('foreground', colorScheme ?? 'light')
  const mutedForeground = getThemeColor('mutedForeground', colorScheme ?? 'light')
  const router = useRouter()

  return (
    <Card className="absolute top-28 right-5 w-72 p-0 py-0 gap-0 z-50 shadow-xl rounded-2xl border-0">
      <View className="px-4 pt-3 pb-1">
        <Text className="text-xs font-semibold uppercase tracking-widest mb-1 text-muted-foreground">{t('settings.dropdown.title')}</Text>

        <View className="flex-row items-center justify-between py-2.5">
          <View className="flex-row items-center gap-2.5">
            <Feather name="moon" size={16} color={foreground} />
            <Text className="text-sm font-medium text-card-foreground">{t('settings.dropdown.darkTheme')}</Text>
          </View>

          <Switch
            checked={colorScheme === 'dark'}
            onCheckedChange={() => toggleColorScheme()}
          />
        </View>

        <View className="flex-row items-center justify-between py-2.5">
          <View className="flex-row items-center gap-2.5">
            <Feather name="bell" size={16} color={foreground} />
            <Text className="text-sm font-medium text-foreground">{t('settings.dropdown.pushNotifications')}</Text>
          </View>
          <Switch
            checked={notificationsEnabled}
            onCheckedChange={setNotificationsEnabled}
          />
        </View>
      </View>

      <View className="h-px mx-4 bg-foreground" />

      <LanguageSwitcher />

      <View className="h-px bg-secondary" />

      <Button variant="ghost" onPress={() => router.replace(Routes.Private.Settings)} className="w-full justify-between h-auto py-3 px-4 rounded-none rounded-b-2xl">
        <Text className="text-sm font-semibold text-foreground">{t('settings.dropdown.allSettings')}</Text>
        <Feather name="chevron-right" size={16} color={mutedForeground} />
      </Button>
    </Card>
  )
}
