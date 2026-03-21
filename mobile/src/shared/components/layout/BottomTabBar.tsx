import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import type { ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { BottomTabItem, BottomTabKey } from '@/shared/constants/BottomTabs'
import { cn } from '@/shared/utils/tailwind.utils'
import { Text } from '@/shared/components/ui/text'

type BottomTabBarProps = {
  items: ReadonlyArray<BottomTabItem>
  pathname: string
  onCenterPress: () => void
}

const ACTIVE_ICON_COLOR = '#3e2723'
const INACTIVE_ICON_COLOR = '#8d6e63'
const REGULAR_ICON_SIZE = 20

// TODO: Style the bar and icons according to the design, probably using a custom SVG for controlling the stroke and fill of the icons,
// and adding the animation for the center button when it's active. Otherwise, explore different icon libraries

const getIconColor = (active: boolean) => (active ? ACTIVE_ICON_COLOR : INACTIVE_ICON_COLOR)

const IconCloset = ({ active }: { active: boolean }) => (
  <MaterialCommunityIcons name='tshirt-crew-outline' size={REGULAR_ICON_SIZE} color={getIconColor(active)} />
)

const IconExplore = ({ active }: { active: boolean }) => (
  <Ionicons name='search-outline' size={REGULAR_ICON_SIZE} color={getIconColor(active)} />
)

const IconSuggestions = ({ active }: { active: boolean }) => (
  <MaterialCommunityIcons name='magic-staff' size={REGULAR_ICON_SIZE} color={getIconColor(active)} />
)

const IconOutfits = ({ active }: { active: boolean }) => (
  <Ionicons name='layers-outline' size={REGULAR_ICON_SIZE} color={getIconColor(active)} />
)

const CenterPlus = () => (
  <View className='h-20 w-20 items-center justify-center rounded-full bg-foreground shadow-sm shadow-black/40'>
    <View className='absolute h-0.5 w-5 rounded-full bg-background' />
    <View className='absolute h-5 w-0.5 rounded-full bg-background' />
  </View>
)

const getRegularIcon = (key: BottomTabKey, active: boolean): ReactNode => {
  switch (key) {
    case 'closet':
      return <IconCloset active={active} />
    case 'explore':
      return <IconExplore active={active} />
    case 'suggestions':
      return <IconSuggestions active={active} />
    case 'outfits':
      return <IconOutfits active={active} />
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
  item.activeOn.some((route) => pathname.startsWith(route))

const renderCenterTab = (item: BottomTabItem, onPress: () => void) => (
  <View key={item.key} className='min-w-[72px] items-center'>
    <Pressable className='-mt-7 items-center justify-center' hitSlop={12} onPress={onPress}>
      <CenterPlus />
    </Pressable>
  </View>
)

const renderRegularTab = (item: BottomTabItem, pathname: string, label: string) => {
  const isActive = getIsActive(item, pathname)
  const icon = getRegularIcon(item.key, isActive)

  return (
    <View key={item.key} className='min-w-[72px] items-center'>
      <Link href={item.href} asChild>
        <Pressable className='items-center justify-center px-2 py-1.5'>
          {icon}
          <Text
            className={cn(
              'mt-1 text-[11px] leading-4',
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

  const closetTab = getTabByKey(items, 'closet')
  const exploreTab = getTabByKey(items, 'explore')
  const createTab = getTabByKey(items, 'create')
  const suggestionsTab = getTabByKey(items, 'suggestions')
  const outfitsTab = getTabByKey(items, 'outfits')

  const closetLabel = t(closetTab.labelKey)
  const exploreLabel = t(exploreTab.labelKey)
  const suggestionsLabel = t(suggestionsTab.labelKey)
  const outfitsLabel = t(outfitsTab.labelKey)

  const closetNode = renderRegularTab(closetTab, pathname, closetLabel)
  const exploreNode = renderRegularTab(exploreTab, pathname, exploreLabel)
  const createNode = renderCenterTab(createTab, onCenterPress)
  const suggestionsNode = renderRegularTab(suggestionsTab, pathname, suggestionsLabel)
  const outfitsNode = renderRegularTab(outfitsTab, pathname, outfitsLabel)

  return (
    <View className='border-border bg-card border-t px-1 pt-2' style={{ paddingBottom: Math.max(insets.bottom, 8) }}>
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
