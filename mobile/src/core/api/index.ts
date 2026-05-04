import { GarmentGateway } from '@/core/api/garment/GarmentGateway'
import { AuthGateway } from '@/core/api/auth/AuthGateway'
import { SuggestionGateway } from '@/core/api/suggestion/SuggestionGateway'

// Facade: apiClient.{domain}.{endpoint}
// Add more gateways here as new modules are introduced.
export const apiClient = {
  auth: AuthGateway,
  garment: GarmentGateway,
  suggestion: SuggestionGateway,
}
