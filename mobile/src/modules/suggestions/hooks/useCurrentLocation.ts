import { useCallback, useEffect, useState } from 'react'
import * as Location from 'expo-location'
import type { SuggestionLocation } from '@/core/api/suggestion'

export type CurrentLocationState = {
  location: SuggestionLocation | null
  isLoading: boolean
  hasPermission: boolean | null
  error: string | null
  requestLocation: () => Promise<void>
}

export const useCurrentLocation = (): CurrentLocationState => {
  const [location, setLocation] = useState<SuggestionLocation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadLocation = useCallback(async (shouldRequestPermission: boolean) => {
    setIsLoading(true)
    setError(null)

    try {
      const permissionResult = shouldRequestPermission
        ? await Location.requestForegroundPermissionsAsync()
        : await Location.getForegroundPermissionsAsync()

      if (permissionResult.status !== 'granted') {
        setHasPermission(false)
        setLocation(null)
        return
      }

      setHasPermission(true)
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })

      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    } catch (locationError) {
      setHasPermission(false)
      setLocation(null)
      setError(locationError instanceof Error ? locationError.message : 'Unable to get current location')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadLocation(false)
  }, [loadLocation])

  return {
    location,
    isLoading,
    hasPermission,
    error,
    requestLocation: () => loadLocation(true),
  }
}
