import { GarmentGateway } from '@/core/api/garment/GarmentGateway'
import { AuthGateway } from '@/core/api/auth/AuthGateway'

// Facade: apiClient.{domain}.{endpoint}
// Add more gateways here as new modules are introduced.
export const apiClient = {
  auth: AuthGateway,
  garment: GarmentGateway,
}
