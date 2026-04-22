import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Text } from '@/shared/components/ui'


export const SettingsScreen = () => {
    const { t } = useTranslation()

    return (
        <View className='flex-1 bg-background pt-[12%]'>
            <View className='px-[6%] pb-[5%] flex-row justify-between'>
                <Text className="text-5xl font-bold tracking-tight text-foreground">
                    {t('settings.screen.title')}
                </Text>
            </View>
        </View>
    )
}
