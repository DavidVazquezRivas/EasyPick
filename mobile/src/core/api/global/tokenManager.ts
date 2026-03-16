import { SecureStoreKeys } from '@/shared/constants/SecureStoreKeys'
import * as SecureStore from 'expo-secure-store'

let inMemoryAccessToken: string | null = null

export const tokenManager = {
  // --- ACCESS TOKEN (Memory stored) ---
  getAccessToken: () => inMemoryAccessToken,
  setAccessToken: (token: string | null) => {
    inMemoryAccessToken = token
  },

  // --- REFRESH TOKEN (SecureStore) ---
  getRefreshToken: async () => {
    try {
      return await SecureStore.getItemAsync(SecureStoreKeys.RefreshTokenKey)
    } catch (error) {
      return null
    }
  },
  setRefreshToken: async (token: string) => {
    await SecureStore.setItemAsync(SecureStoreKeys.RefreshTokenKey, token)
  },

  // --- Total cleanup ---
  clearTokens: async () => {
    inMemoryAccessToken = null
    await SecureStore.deleteItemAsync(SecureStoreKeys.RefreshTokenKey)
  },
}
