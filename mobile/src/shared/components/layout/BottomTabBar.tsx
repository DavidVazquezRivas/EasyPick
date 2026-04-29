import ClosetIcon from '@/shared/components/icons/ClosetIcon'
import ExploreIcon from '@/shared/components/icons/ExploreIcon'
import OutfitsIcon from '@/shared/components/icons/OutfitsIcon'
import SuggestionIcon from '@/shared/components/icons/SuggestionIcon'
import { Link } from 'expo-router'
import type { ReactNode } from 'react'
import { Pressable, View, useColorScheme } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { getThemeColor } from '@/core/theme/themeColors'
import type { BottomTabItem, BottomTabKey } from '@/shared/constants/BottomTabs'
import { cn } from '@/shared/utils/tailwind.utils'
import { Text } from '@/shared/components/ui/text'

type BottomTabBarProps = {
  items: ReadonlyArray<BottomTabItem>
  pathname: string
  onCenterPress: () => void
}

const MIN_BOTTOM_PADDING = 8
const REGULAR_ICON_SIZE = 20

const getIconColor = (active: boolean, colorScheme: 'light' | 'dark') =>
  active ? getThemeColor('foreground', colorScheme) : getThemeColor('iconInactive', colorScheme)

const CenterPlus = () => (
  <View className='h-20 w-20 items-center justify-center rounded-full bg-foreground shadow-sm shadow-black/40'>
    <View className='absolute h-0.5 w-5 rounded-full bg-background' />
    <View className='absolute h-5 w-0.5 rounded-full bg-background' />
  </View>
)

const getRegularIcon = (key: BottomTabKey, active: boolean, colorScheme: 'light' | 'dark'): ReactNode => {
  const color = getIconColor(active, colorScheme)

  switch (key) {
    case 'closet':
      return <ClosetIcon size={REGULAR_ICON_SIZE} color={color} strokeWidth={active ? 2.8 : 1.8} />
    case 'explore':
      return <ExploreIcon size={REGULAR_ICON_SIZE} color={color} strokeWidth={active ? 2.8 : 1.8} />
    case 'suggestions':
      return <SuggestionIcon size={REGULAR_ICON_SIZE} color={color} strokeWidth={active ? 2.8 : 1.8} />
    case 'outfits':
      return <OutfitsIcon size={REGULAR_ICON_SIZE} color={color} strokeWidth={active ? 2.8 : 1.8} />
    default:
      return null
  }
}

const getTabByKey = (items: ReadonlyArray<BottomTabItem>, key: BottomTabKey): BottomTabItem => {
  const tab = items.find((item) => item.key === key)
  if (!tab) throw new Error(`BottomTabBar is missing tab with key: ${key}`)

  return tab
}

const getIsActive = (item: BottomTabItem, pathname: string): boolean =>
  item.activeOn.some((route) =>
    pathname.includes(route.replace('/(private)', ''))
  )

const renderCenterTab = (item: BottomTabItem, onPress: () => void) => (
  <View key={item.key} className='min-w-20 items-center'>
    <Pressable className='-mt-7 items-center justify-center' hitSlop={12} onPress={onPress}>
      <CenterPlus />
    </Pressable>
  </View>
)

const renderRegularTab = (item: BottomTabItem, pathname: string, label: string, colorScheme: 'light' | 'dark') => {
  const isActive = getIsActive(item, pathname)
  const icon = getRegularIcon(item.key, isActive, colorScheme)

  return (
    <View key={item.key} className='min-w-20 items-center'>
      <Link href={item.href} asChild>
        <Pressable className='items-center justify-center px-2 py-1.5'>
          {icon}
          <Text
            className={cn(
              'mt-1 text-xxs',
              isActive ? 'font-semibold text-foreground' : 'text-muted-foreground',
            )}>
            {label}
          </Text>
        </Pressable>
      </Link>
    </View>
  )
}

export const BottomTabBar = ({ items, pathname, onCenterPress }: BottomTabBarProps) => {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light'

  const closetTab = getTabByKey(items, 'closet')
  const exploreTab = getTabByKey(items, 'explore')
  const createTab = getTabByKey(items, 'create')
  const suggestionsTab = getTabByKey(items, 'suggestions')
  const outfitsTab = getTabByKey(items, 'outfits')

  const closetLabel = t(closetTab.labelKey)
  const exploreLabel = t(exploreTab.labelKey)
  const suggestionsLabel = t(suggestionsTab.labelKey)
  const outfitsLabel = t(outfitsTab.labelKey)

  const closetNode = renderRegularTab(closetTab, pathname, closetLabel, colorScheme)
  const exploreNode = renderRegularTab(exploreTab, pathname, exploreLabel, colorScheme)
  const createNode = renderCenterTab(createTab, onCenterPress)
  const suggestionsNode = renderRegularTab(suggestionsTab, pathname, suggestionsLabel, colorScheme)
  const outfitsNode = renderRegularTab(outfitsTab, pathname, outfitsLabel, colorScheme)

  return (
    <View
      className='border-border bg-card border-t px-1 pt-2 pb-2'
      style={{ paddingBottom: insets.bottom > MIN_BOTTOM_PADDING ? insets.bottom : undefined }}>
      <View className='flex-row items-end justify-between'>
        {closetNode}
        {exploreNode}
        {createNode}
        {suggestionsNode}
        {outfitsNode}
      </View>
    </View>
  )
}
