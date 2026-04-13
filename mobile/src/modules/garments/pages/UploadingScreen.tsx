import { useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useRef } from 'react'
import { ActivityIndicator, Animated, Easing, Image, StyleSheet, View, useColorScheme } from 'react-native'
import { useTranslation } from 'react-i18next'
import { getThemeColor } from '@/core/theme/themeColors'
import { Text } from '@/shared/components/ui'
import { toRgba } from '@/shared/utils/color.utils'

const UploadingUi = {
  previewSize: 228,
  previewRadius: 28,
  previewMarginTop: 24,
  scanCoreHeight: 4,
  scanGlowHeight: 14,
  scanInset: 0,
  scanDurationMs: 1600,
  frameShadowOffsetY: 10,
  frameShadowOpacity: 0.08,
  frameShadowRadius: 18,
  frameElevation: 6,
  glowShadowOpacity: 0.92,
  glowShadowRadius: 10,
  glowElevation: 12,
} as const

const normalizePreviewUri = (previewUriParam?: string | string[]) => {
  if (typeof previewUriParam === 'string') {
    return previewUriParam
  }

  if (Array.isArray(previewUriParam)) {
    return previewUriParam[0]
  }

  return undefined
}

export const UploadingScreen = () => {
  const { previewUri: previewUriParam } = useLocalSearchParams<{ previewUri?: string | string[] }>()
  const { t } = useTranslation()
  const colorScheme = useColorScheme()
  const spinnerColor = getThemeColor('success', colorScheme)
  const scanCoreColor = getThemeColor('successStrong', colorScheme)
  const frameBorderColor = getThemeColor('border', colorScheme)
  const frameShadowColor = getThemeColor('foreground', colorScheme)
  const frameBackgroundColor = toRgba(getThemeColor('cardForeground', colorScheme), 0.06)
  const scanOverlayColor = toRgba(getThemeColor('muted', colorScheme), 0.2)
  const scanGlowColor = toRgba(getThemeColor('success', colorScheme), 0.36)
  const scanShadowColor = toRgba(getThemeColor('success', colorScheme), 0.6)
  const scanProgress = useRef(new Animated.Value(0)).current

  const previewUri = useMemo(() => normalizePreviewUri(previewUriParam), [previewUriParam])
  const hasPreview = Boolean(previewUri)

  useEffect(() => {
    if (!hasPreview) {
      return
    }

    scanProgress.setValue(0)

    const scanningLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanProgress, {
          toValue: 1,
          duration: UploadingUi.scanDurationMs,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanProgress, {
          toValue: 0,
          duration: UploadingUi.scanDurationMs,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    )

    scanningLoop.start()

    return () => {
      scanningLoop.stop()
    }
  }, [hasPreview, scanProgress])

  const scanLineTranslateY = scanProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, UploadingUi.previewSize - UploadingUi.scanGlowHeight],
  })

  const previewContent =
    hasPreview ?
      <Image source={{ uri: previewUri }} style={styles.previewImage} resizeMode='cover' />
    : <View style={styles.previewFallback}>
        <ActivityIndicator size='large' color={spinnerColor} />
      </View>

  const scanLine =
    hasPreview ?
      <Animated.View
        pointerEvents='none'
        style={[
          styles.scanLineContainer,
          {
            transform: [{ translateY: scanLineTranslateY }],
          },
        ]}>
        <View
          style={[
            styles.scanLineGlow,
            {
              backgroundColor: scanGlowColor,
              shadowColor: scanShadowColor,
            },
          ]}
        />
        <View style={[styles.scanLineCore, { backgroundColor: scanCoreColor }]} />
      </Animated.View>
    : null

  const scanOverlay =
    hasPreview ?
      <View pointerEvents='none' style={[styles.scanOverlay, { backgroundColor: scanOverlayColor }]} />
    : null

  const title = t('garment.uploadingScreen.title')
  const description = t('garment.uploadingScreen.description')
  const status = t('garment.uploadingScreen.status')

  return (
    <View className='flex-1 items-center justify-center bg-background px-6'>
      <Text variant='h4' className='border-b-0 pb-0 text-center'>
        {title}
      </Text>

      <View
        style={[
          styles.previewFrame,
          {
            borderColor: frameBorderColor,
            backgroundColor: frameBackgroundColor,
            shadowColor: frameShadowColor,
          },
        ]}>
        {previewContent}
        {scanOverlay}
        {scanLine}
      </View>

      <View className='mt-6 flex-row items-center'>
        <ActivityIndicator size='small' color={spinnerColor} />
        <Text className='ml-2 text-muted-foreground'>{status}</Text>
      </View>

      <Text className='mt-2 text-center text-muted-foreground'>{description}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  previewFrame: {
    width: UploadingUi.previewSize,
    height: UploadingUi.previewSize,
    marginTop: UploadingUi.previewMarginTop,
    borderRadius: UploadingUi.previewRadius,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: UploadingUi.frameShadowOffsetY },
    shadowOpacity: UploadingUi.frameShadowOpacity,
    shadowRadius: UploadingUi.frameShadowRadius,
    elevation: UploadingUi.frameElevation,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  scanLineContainer: {
    position: 'absolute',
    left: UploadingUi.scanInset,
    right: UploadingUi.scanInset,
    height: UploadingUi.scanGlowHeight,
    justifyContent: 'center',
  },
  scanLineGlow: {
    width: '100%',
    height: UploadingUi.scanGlowHeight,
    borderRadius: UploadingUi.scanGlowHeight / 2,
    shadowOpacity: UploadingUi.glowShadowOpacity,
    shadowRadius: UploadingUi.glowShadowRadius,
    elevation: UploadingUi.glowElevation,
  },
  scanLineCore: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: UploadingUi.scanCoreHeight,
    borderRadius: UploadingUi.scanCoreHeight / 2,
  },
})
