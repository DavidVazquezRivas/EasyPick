import type { ColorSchemeName } from 'react-native'

export type ThemeColorToken =
  | 'background'
  | 'foreground'
  | 'card'
  | 'cardForeground'
  | 'primary'
  | 'primaryForeground'
  | 'secondary'
  | 'secondaryForeground'
  | 'accent'
  | 'accentForeground'
  | 'muted'
  | 'mutedForeground'
  | 'placeholder'
  | 'iconInactive'
  | 'destructive'
  | 'destructiveForeground'
  | 'destructiveSubtle'
  | 'success'
  | 'successStrong'
  | 'border'
  | 'input'
  | 'ring'
  | 'navbar'
  | 'btnAiBg'
  | 'btnAiFg'

type ThemeColorPalette = Readonly<Record<ThemeColorToken, string>>

export const ThemeColors: Readonly<{ light: ThemeColorPalette; dark: ThemeColorPalette }> = {
  light: {
    background: '#f8f9fa',
    foreground: '#1c1c1c',
    card: '#ffffff',
    cardForeground: '#1c1c1c',
    primary: '#5d4037',
    primaryForeground: '#ffffff',
    secondary: '#f0ece8',
    secondaryForeground: '#1c1c1c',
    accent: '#e6dfd7',
    accentForeground: '#1c1c1c',
    muted: '#e6dfd7',
    mutedForeground: '#6b7280',
    placeholder: '#9ca3af',
    iconInactive: '#c4b8b0',
    destructive: '#dc2626',
    destructiveForeground: '#ffffff',
    destructiveSubtle: '#fee2e2',
    success: '#22c55e',
    successStrong: '#16a34a',
    border: '#e6dfd7',
    input: '#ffffff',
    ring: '#5d4037',
    navbar: '#ffffff',
    btnAiBg: '#5d4037',
    btnAiFg: '#ffffff',
  },
  dark: {
    background: '#1a1410',
    foreground: '#ede0d0',
    card: '#261e17',
    cardForeground: '#ede0d0',
    primary: '#5d4037',
    primaryForeground: '#ede0d0',
    secondary: '#32261e',
    secondaryForeground: '#ede0d0',
    accent: '#4a3728',
    accentForeground: '#ede0d0',
    muted: '#4a3728',
    mutedForeground: '#b09880',
    placeholder: '#7a6455',
    iconInactive: '#5c4a3a',
    destructive: '#f87171',
    destructiveForeground: '#1a1410',
    destructiveSubtle: '#3a1818',
    success: '#22c55e',
    successStrong: '#16a34a',
    border: '#3d2e22',
    input: '#261e17',
    ring: '#ede0d0',
    navbar: '#211812',
    btnAiBg: '#f0ece8',
    btnAiFg: '#1a1410',
  },
} as const

const normalizeColorScheme = (scheme: ColorSchemeName): 'light' | 'dark' => (scheme === 'dark' ? 'dark' : 'light')

export const getThemeColorPalette = (scheme: ColorSchemeName) => ThemeColors[normalizeColorScheme(scheme)]

export const getThemeColor = (token: ThemeColorToken, scheme: ColorSchemeName) =>
  getThemeColorPalette(scheme)[token]
