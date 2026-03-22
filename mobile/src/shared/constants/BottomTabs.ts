import type { Href } from 'expo-router'
import { Routes } from '@/shared/constants/Routes'

export type BottomTabKey = 'closet' | 'explore' | 'create' | 'suggestions' | 'outfits'

export type BottomTabItem = {
  key: BottomTabKey
  labelKey: string
  href: Href
  activeOn: string[]
  center?: boolean
}

export const PRIVATE_BOTTOM_TABS: ReadonlyArray<BottomTabItem> = [
  {
    key: 'closet',
    labelKey: 'common.navigation.tabs.closet',
    href: Routes.Private.Garments.Closet,
    activeOn: [Routes.Private.Garments.Closet, Routes.Private.Garments.Uploading, Routes.Private.Garments.Confirmation],
  },
  {
    key: 'explore',
    labelKey: 'common.navigation.tabs.explore',
    href: Routes.Private.Explore,
    activeOn: [Routes.Private.Explore],
  },
  {
    key: 'create',
    labelKey: 'common.navigation.tabs.create',
    href: Routes.Private.Home,
    activeOn: [Routes.Private.Home],
    center: true,
  },
  {
    key: 'suggestions',
    labelKey: 'common.navigation.tabs.suggestions',
    href: Routes.Private.Suggestions,
    activeOn: [Routes.Private.Suggestions],
  },
  {
    key: 'outfits',
    labelKey: 'common.navigation.tabs.outfits',
    href: Routes.Private.Outfits,
    activeOn: [Routes.Private.Outfits],
  },
]
