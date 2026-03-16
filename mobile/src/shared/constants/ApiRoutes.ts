export const API_BASE_URL = 'http://192.168.1.134:8080/api/v1' // TODO: move to .env
export const ApiRoutes = {
  Auth: {
    Refresh: `${API_BASE_URL}/auth/refresh`,
  },
  Garments: {
    GetAll: `${API_BASE_URL}/garments`,
  },
}
