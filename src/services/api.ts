import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request interceptor untuk menyisipkan Bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('autobid_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor untuk handling unauthenticated otomatis
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('autobid_token')
      localStorage.removeItem('autobid_user')
    }
    return Promise.reject(error)
  },
)

export default api
