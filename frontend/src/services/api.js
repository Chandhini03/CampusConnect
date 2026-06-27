import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campus_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/')) {
      localStorage.removeItem('campus_token')
      localStorage.removeItem('campus_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export const errorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  const data = error.response?.data
  return data?.error || data?.message || (typeof data === 'string' ? data : null) || fallback
}

export default api
