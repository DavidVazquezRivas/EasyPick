import React, { useState, useRef, useEffect } from 'react'
import { ActivityIndicator, ScrollView, View, useColorScheme, KeyboardAvoidingView, Platform, Pressable } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'
import ChevronLeftIcon from '@/shared/components/icons/ChevronLeftIcon'
import CheckCircleIcon from '@/shared/components/icons/CheckCircleIcon'
import NotificationsIcon from '@/shared/components/icons/NotificationsIcon'
import ChevronUpIcon from '@/shared/components/icons/ChevronUpIcon'
import ChevronDownIcon from '@/shared/components/icons/ChevronDownIcon'
import SaveIcon from '@/shared/components/icons/SaveIcon'
import AlertCircleIcon from '@/shared/components/icons/AlertCircleIcon'
import {
    Text,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    Switch,
    Input
} from '@/shared/components/ui'
import { getThemeColor } from '@/core/theme/themeColors'

export const SettingsScreen = () => {
    const { t } = useTranslation()
    const router = useRouter()
    const colorScheme = useColorScheme()

    const foreground = getThemeColor('foreground', colorScheme)
    const mutedForeground = getThemeColor('mutedForeground', colorScheme)
    const primary = getThemeColor('primary', colorScheme)
    const successColor = getThemeColor('success', colorScheme)
    const successStrong = getThemeColor('successStrong', colorScheme)

    const scrollViewRef = useRef<ScrollView>(null)

    const [notificationsEnabled, setNotificationsEnabled] = useState(false)
    const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily')
    const [selectedDays, setSelectedDays] = useState<string[]>(['mon', 'wed'])
    const [selectedMonthlyDay, setSelectedMonthlyDay] = useState<number>(1)
    const [hour, setHour] = useState('09')
    const [minute, setMinute] = useState('00')
    const [customMessage, setCustomMessage] = useState('')

    const [isSaving, setIsSaving] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const storedSettings = await AsyncStorage.getItem('notification_settings')
                if (storedSettings) {
                    const parsed = JSON.parse(storedSettings)
                    if (parsed.notificationsEnabled !== undefined) setNotificationsEnabled(parsed.notificationsEnabled)
                    if (parsed.frequency !== undefined) setFrequency(parsed.frequency)
                    if (parsed.selectedDays !== undefined) setSelectedDays(parsed.selectedDays)
                    if (parsed.selectedMonthlyDay !== undefined) setSelectedMonthlyDay(parsed.selectedMonthlyDay)
                    if (parsed.hour !== undefined) setHour(parsed.hour)
                    if (parsed.minute !== undefined) setMinute(parsed.minute)
                    if (parsed.customMessage !== undefined) setCustomMessage(parsed.customMessage)
                }
            } catch (error) {
                console.error('Error loading settings', error)
            } finally {
                setIsLoading(false)
            }
        }
        loadSettings()
    }, [])

    const handleSave = async () => {
        setIsSaving(true)
        setShowSuccess(false)

        try {
            const settingsToSave = {
                notificationsEnabled,
                frequency,
                selectedDays,
                selectedMonthlyDay,
                hour,
                minute,
                customMessage
            }
            await AsyncStorage.setItem('notification_settings', JSON.stringify(settingsToSave))
        } catch (error) {
            console.error('Error saving settings', error)
        }

        setTimeout(() => {
            setIsSaving(false)
            setShowSuccess(true)
            setTimeout(() => {
                scrollViewRef.current?.scrollTo({ y: 0, animated: true })
            }, 100)
        }, 1200)
    }

    const formatNumber = (num: number): string => {
        return num.toString().padStart(2, '0')
    }

    const handleHourChange = (text: string) => {
        const numeric = text.replace(/[^0-9]/g, '')
        if (numeric === '') {
            setHour('')
            return
        }
        const val = parseInt(numeric)
        if (val >= 0 && val <= 23) {
            setHour(numeric.slice(-2))
        }
    }

    const handleHourBlur = () => {
        if (hour === '') {
            setHour('09')
        } else {
            setHour(formatNumber(parseInt(hour, 10)))
        }
    }

    const handleMinuteChange = (text: string) => {
        const numeric = text.replace(/[^0-9]/g, '')
        if (numeric === '') {
            setMinute('')
            return
        }
        const val = parseInt(numeric)
        if (val >= 0 && val <= 59) {
            setMinute(numeric.slice(-2))
        }
    }

    const handleMinuteBlur = () => {
        if (minute === '') {
            setMinute('00')
        } else {
            setMinute(formatNumber(parseInt(minute)))
        }
    }

    const incrementHour = () => {
        const val = hour === '' ? 9 : parseInt(hour)
        const nextVal = (val + 1) % 24
        setHour(formatNumber(nextVal))
    }

    const decrementHour = () => {
        const val = hour === '' ? 9 : parseInt(hour)
        const nextVal = (val + 23) % 24
        setHour(formatNumber(nextVal))
    }

    const incrementMinute = () => {
        const val = minute === '' ? 0 : parseInt(minute)
        const nextVal = (val + 5) % 60
        setMinute(formatNumber(nextVal))
    }

    const decrementMinute = () => {
        const val = minute === '' ? 0 : parseInt(minute)
        const nextVal = (val + 55) % 60
        setMinute(formatNumber(nextVal))
    }

    const weekdayIds = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

    const toggleDay = (dayId: string) => {
        if (selectedDays.includes(dayId)) {
            if (selectedDays.length > 1) {
                setSelectedDays(selectedDays.filter(d => d !== dayId))
            }
        } else {
            setSelectedDays([...selectedDays, dayId].sort((a, b) => {
                const order = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
                return order.indexOf(a) - order.indexOf(b)
            }))
        }
    }

    const getSelectedDaysText = () => {
        if (selectedDays.length === 7) {
            return t('settings.screen.notifications.daysTextAll')
        }

        const dayNames = selectedDays.map(d => t(`settings.screen.notifications.days.${d}`))

        if (dayNames.length === 1) {
            return t('settings.screen.notifications.daysTextPrefixSingle', { day: dayNames[0] })
        }

        const lastDay = dayNames.pop()
        const separator = t('settings.screen.notifications.daysTextSeparator')
        const joinedDays = dayNames.join(', ') + separator + lastDay

        return t('settings.screen.notifications.daysTextPrefixMultiple', { days: joinedDays })
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className='flex-1 bg-background'
        >
            <View className='flex-1 pt-[12%]'>
                <View className='px-[6%] pb-[5%] flex-row items-center gap-4'>
                    <Button
                        variant="ghost"
                        size="icon"
                        onPress={() => router.back()}
                        className="-ml-2 rounded-full"
                    >
                        <ChevronLeftIcon size={24} color={foreground} />
                    </Button>
                    <Text className="text-4xl font-bold tracking-tight text-foreground">
                        {t('settings.screen.title')}
                    </Text>
                </View>

                {isLoading ? (
                    <View className="flex-1 justify-center items-center bg-background">
                        <ActivityIndicator size="large" color={primary} />
                    </View>
                ) : (
                    <ScrollView
                        ref={scrollViewRef}
                        className='flex-1'
                        contentContainerClassName='px-[6%] pb-12 gap-6'
                        showsVerticalScrollIndicator={false}
                    >
                    {showSuccess && (
                        <View
                            style={{ borderColor: successColor }}
                            className="flex-row items-start gap-3 bg-card border px-4 py-3.5 rounded-2xl shadow-md"
                        >
                            <CheckCircleIcon size={20} color={successStrong} />
                            <Text className='font-semibold text-foreground flex-1'>
                                {t('settings.screen.notifications.success')}
                            </Text>
                        </View>
                    )}

                    <Card className="border-0 shadow-sm">
                        <CardHeader className="px-5 pt-5 pb-3">
                            <View className="flex-row items-center gap-3">
                                <View className="p-2.5 rounded-xl">
                                    <NotificationsIcon size={30} color={foreground} />
                                </View>
                                <View className="flex-1">
                                    <CardTitle className="text-xl font-bold">
                                        {t('settings.screen.notifications.title')}
                                    </CardTitle>
                                    <CardDescription className="text-sm">
                                        {t('settings.screen.notifications.description')}
                                    </CardDescription>
                                </View>
                            </View>
                        </CardHeader>

                        <CardContent className="px-5 pb-5 pt-1 gap-5">
                            <View className="flex-row items-center justify-between py-3">
                                <Text className="text-base font-semibold text-foreground">
                                    {t('settings.screen.notifications.enable')}
                                </Text>
                                <Switch
                                    checked={notificationsEnabled}
                                    onCheckedChange={setNotificationsEnabled}
                                />
                            </View>

                            {notificationsEnabled && (
                                <View className="gap-6 pt-4 border-t border-border/40">
                                    <View className="gap-2.5">
                                        <Text className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                            {t('settings.screen.notifications.frequency')}
                                        </Text>

                                        <View className="flex-row gap-2">
                                            <Button
                                                variant={frequency === 'daily' ? 'default' : 'outline'}
                                                onPress={() => setFrequency('daily')}
                                                className="flex-1 rounded-xl h-11"
                                            >
                                                <Text className={`font-semibold text-sm ${frequency === 'daily' ? 'text-primary-foreground' : 'text-foreground'}`}>
                                                    {t('settings.screen.notifications.frequencyDaily')}
                                                </Text>
                                            </Button>
                                            <Button
                                                variant={frequency === 'weekly' ? 'default' : 'outline'}
                                                onPress={() => setFrequency('weekly')}
                                                className="flex-1 rounded-xl h-11"
                                            >
                                                <Text className={`font-semibold text-sm ${frequency === 'weekly' ? 'text-primary-foreground' : 'text-foreground'}`}>
                                                    {t('settings.screen.notifications.frequencyWeekly')}
                                                </Text>
                                            </Button>
                                            <Button
                                                variant={frequency === 'monthly' ? 'default' : 'outline'}
                                                onPress={() => setFrequency('monthly')}
                                                className="flex-1 rounded-xl h-11"
                                            >
                                                <Text className={`font-semibold text-sm ${frequency === 'monthly' ? 'text-primary-foreground' : 'text-foreground'}`}>
                                                    {t('settings.screen.notifications.frequencyMonthly')}
                                                </Text>
                                            </Button>
                                        </View>

                                        <Text className="text-sm text-muted-foreground mt-1">
                                            {frequency === 'daily' && t('settings.screen.notifications.frequencyDescDaily')}
                                            {frequency === 'weekly' && t('settings.screen.notifications.frequencyDescWeekly')}
                                            {frequency === 'monthly' && t('settings.screen.notifications.frequencyDescMonthly')}
                                        </Text>
                                    </View>

                                    {frequency === 'weekly' && (
                                        <View className="gap-3">
                                            <View>
                                                <Text className="text-md font-bold uppercase tracking-wider text-muted-foreground">
                                                    {t('settings.screen.notifications.weekdays')}
                                                </Text>
                                                <Text className="text-sm text-muted-foreground mt-0.5">
                                                    {t('settings.screen.notifications.weekdaysDesc')}
                                                </Text>
                                            </View>

                                            <View className="bg-muted/10 dark:bg-secondary/10 rounded-2xl border border-border/50 overflow-hidden px-4 py-1 mt-1">
                                                {weekdayIds.map((dayId, index) => {
                                                    const isSelected = selectedDays.includes(dayId)
                                                    const name = t(`settings.screen.notifications.days.${dayId}`)
                                                    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1)
                                                    return (
                                                        <View
                                                            key={dayId}
                                                            className={`flex-row justify-between items-center py-2.5 ${index > 0 ? 'border-t border-border/30' : ''}`}
                                                        >
                                                            <Text className="text-sm font-semibold text-foreground">
                                                                {capitalizedName}
                                                            </Text>
                                                            <Switch
                                                                checked={isSelected}
                                                                onCheckedChange={() => toggleDay(dayId)}
                                                            />
                                                        </View>
                                                    )
                                                })}
                                            </View>

                                            <Text className="text-sm text-muted-foreground mt-0.5">
                                                {getSelectedDaysText()}
                                            </Text>
                                        </View>
                                    )}

                                    {frequency === 'monthly' && (
                                        <View className="gap-3">
                                            <View>
                                                <Text className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                                    {t('settings.screen.notifications.monthlyDayTitle')}
                                                </Text>
                                                <Text className="text-sm text-muted-foreground mt-0.5">
                                                    {t('settings.screen.notifications.monthlyDayDesc')}
                                                </Text>
                                            </View>

                                            <View className="flex-row flex-wrap gap-2 justify-start mt-2">
                                                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                                                    const isSelected = selectedMonthlyDay === day
                                                    return (
                                                        <Pressable
                                                            key={day}
                                                            onPress={() => setSelectedMonthlyDay(day)}
                                                            className={`items-center justify-center rounded-2xl border ${isSelected
                                                                ? 'bg-primary border-foreground'
                                                                : 'border-primary bg-muted/50'
                                                                }`}
                                                        >
                                                            <Text className={`font-semibold m-1.5 ${day.toString().length == 1 ? 'mx-4' : 'mx-3'} text-sm ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                                                                {day}
                                                            </Text>
                                                        </Pressable>
                                                    )
                                                })}
                                            </View>

                                            {selectedMonthlyDay >= 29 && (
                                                <View
                                                    className="flex-row items-start gap-3 border border-yellow-500 bg-yellow-500/10 px-4 py-3.5 rounded-2xl mt-2"
                                                >
                                                    <View className="mt-0.5">
                                                        <AlertCircleIcon size={20} color="#EAB308" />
                                                    </View>
                                                    <Text className="text-sm text-foreground flex-1 font-semibold leading-5">
                                                        {t('settings.screen.notifications.monthlyDayWarning')}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    )}

                                    <View className="gap-2.5">
                                        <Text className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                            {t('settings.screen.notifications.time')}
                                        </Text>

                                        <View className="flex-row items-center gap-4">
                                            <View className="flex-row items-center bg-muted/30 rounded-2xl border border-border px-3 py-1.5 flex-1 justify-between h-14">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onPress={decrementHour}
                                                    className="h-8 w-8 rounded-lg"
                                                >
                                                    <ChevronDownIcon size={18} color={foreground} />
                                                </Button>

                                                <Input
                                                    className="border-0 bg-transparent text-center font-bold text-xl h-10 w-12 p-0 text-foreground"
                                                    value={hour}
                                                    onChangeText={handleHourChange}
                                                    onBlur={handleHourBlur}
                                                    keyboardType="number-pad"
                                                    maxLength={2}
                                                />

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onPress={incrementHour}
                                                    className="h-8 w-8 rounded-lg"
                                                >
                                                    <ChevronUpIcon size={18} color={foreground} />
                                                </Button>
                                            </View>

                                            <Text className="text-2xl font-bold text-foreground">:</Text>
                                            <View className="flex-row items-center bg-muted/30 rounded-2xl border border-border px-3 py-1.5 flex-1 justify-between h-14">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onPress={decrementMinute}
                                                    className="h-8 w-8 rounded-lg"
                                                >
                                                    <ChevronDownIcon size={18} color={foreground} />
                                                </Button>

                                                <Input
                                                    className="border-0 bg-transparent text-center font-bold text-xl h-10 w-12 p-0 text-foreground"
                                                    value={minute}
                                                    onChangeText={handleMinuteChange}
                                                    onBlur={handleMinuteBlur}
                                                    keyboardType="number-pad"
                                                    maxLength={2}
                                                />

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onPress={incrementMinute}
                                                    className="h-8 w-8 rounded-lg"
                                                >
                                                    <ChevronUpIcon size={18} color={foreground} />
                                                </Button>
                                            </View>
                                        </View>
                                    </View>
                                    <View className="gap-2.5">
                                        <Text className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                            {t('settings.screen.notifications.message')}
                                        </Text>

                                        <Input
                                            className="h-12 rounded-xl border-border bg-muted/20 px-4 text-foreground placeholder:text-muted-foreground/40"
                                            placeholder={t('settings.screen.notifications.messagePlaceholder')}
                                            placeholderTextColor={mutedForeground}
                                            value={customMessage}
                                            onChangeText={setCustomMessage}
                                            maxLength={80}
                                        />

                                        <Text className="text-xs text-muted-foreground">
                                            {t('settings.screen.notifications.messageHelp')}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </CardContent>
                    </Card>
                    <Button
                        onPress={handleSave}
                        disabled={isSaving}
                        className="w-full h-12 rounded-xl flex-row items-center justify-center gap-2 shadow-sm"
                    >
                        {isSaving ? (
                            <>
                                <ActivityIndicator size="small" color="#ffffff" />
                                <Text className="font-semibold text-primary-foreground">
                                    {t('settings.screen.notifications.saving')}
                                </Text>
                            </>
                        ) : (
                            <>
                                <SaveIcon size={18} color="#ffffff" />
                                <Text className="font-semibold text-primary-foreground">
                                    {t('settings.screen.notifications.save')}
                                </Text>
                            </>
                        )}
                    </Button>
                </ScrollView>
            )}
            </View>
        </KeyboardAvoidingView>
    )
}
