import { GarmentGateway } from '@/core/api/garment/GarmentGateway'

// Facade: apiClient.{domain}.{endpoint}
// Add more gateways here as new modules are introduced.
export const apiClient = {
  garment: GarmentGateway,
}
