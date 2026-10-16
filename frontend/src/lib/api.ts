import axios from 'axios'
import { createClient } from '@/lib/supabase/client'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
})

// Interceptor: inject JWT token ke setiap request (dari localStorage atau Supabase)
api.interceptors.request.use(async (config) => {
  try {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('simba_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        return config
      }
    }

    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`
    }
  } catch {}
  return config
})

// Interceptor: handle error global & normalisasi error jaringan
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isNetwork =
      !err.response ||
      err.code === 'ECONNABORTED' ||
      err.code === 'ERR_NETWORK' ||
      err.message === 'Network Error' ||
      err.message?.includes('Failed to fetch')

    const message = isNetwork
      ? 'Tidak dapat terhubung ke server. Periksa koneksi Anda lalu coba lagi'
      : (err.response?.data?.message || 'Terjadi kesalahan, coba lagi.')

    const normalizedError = new Error(message)
    ;(normalizedError as any).isNetworkError = isNetwork
    ;(normalizedError as any).status = err.response?.status
    ;(normalizedError as any).response = err.response

    return Promise.reject(normalizedError)
  }
)

export default api
