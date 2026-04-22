import { Environment } from '@/shared/constants/Environment'

export const API_BASE_URL = Environment.API_BASE_URL
export const ApiRoutes = {
  Auth: {
    Refresh: `${API_BASE_URL}/auth/refresh`,
    Google: `${API_BASE_URL}/auth/google`,
  },
  Garments: {
    GetAll: `${API_BASE_URL}/garments`,
    Add: `${API_BASE_URL}/garments`,
    Patch: `${API_BASE_URL}/garments/:id`,
    GetById: `${API_BASE_URL}/garments/:id`,
    GetConfigs: `${API_BASE_URL}/garments/configurations`,
  },
}
