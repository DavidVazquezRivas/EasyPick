import { Environment } from '@/shared/constants/Environment'

export const API_BASE_URL = Environment.API_BASE_URL
export const ApiRoutes = {
  Auth: {
    Refresh: `${API_BASE_URL}/auth/refresh`,
  },
  Garments: {
    GetAll: `${API_BASE_URL}/garments`,
  },
}
