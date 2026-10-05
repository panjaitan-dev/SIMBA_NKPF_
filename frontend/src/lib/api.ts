import axios from 'axios'
import { createClient } from '@/lib/supabase/client'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
})

// Interceptor: inject Supabase JWT ke setiap request
api.interceptors.request.use(async (config) => {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`
    }
  } catch {}
  return config
})

// Interceptor: handle error global
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || 'Terjadi kesalahan, coba lagi.'
    return Promise.reject(new Error(message))
  }
)

export default api
