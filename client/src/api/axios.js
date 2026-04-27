// src/api/axios.js
// Axios instance — attaches JWT token to every request automatically
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: '/api',          // Vite proxy forwards /api → http://localhost:5000/api
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// ── Request interceptor: inject Authorization header ─────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor: handle 401 globally ────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage
      localStorage.removeItem('token')
      // Only redirect if not already on auth pages
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
