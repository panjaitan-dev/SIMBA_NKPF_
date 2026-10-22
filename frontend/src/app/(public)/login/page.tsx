'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Leaf, Eye, EyeOff, Loader2, AlertCircle, RefreshCw, Server, ShieldCheck, UserCheck, KeyRound } from 'lucide-react'
import api from '@/lib/api'
import { createClient } from '@/lib/supabase/client'
import { setAuthCookies } from '@/lib/auth-client'
import toast from 'react-hot-toast'
import { EMAIL_MAX, PASSWORD_MAX } from '@/lib/limits'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isColdStart, setIsColdStart] = useState(false)
  const [networkError, setNetworkError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const coldStartTimerRef = useRef<NodeJS.Timeout | null>(null)

  const performLoginRequest = async (payload: { email: string; password: string }) => {
    return await api.post('/auth/login', payload, {
      timeout: 15000, // 15 detik timeout
    })
  }

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    setErrorMsg('')
    setNetworkError(false)
    setIsColdStart(false)
    setLoading(true)

    // Indikator cold start jika respons memakan waktu > 2.5 detik
    if (coldStartTimerRef.current) clearTimeout(coldStartTimerRef.current)
    coldStartTimerRef.current = setTimeout(() => {
      setIsColdStart(true)
    }, 2500)

    let lastError: any = null

    // Retry otomatis 1x untuk mengatasi cold start / timeout jaringan sementara
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await performLoginRequest({ email, password })
        const { data } = res

        if (coldStartTimerRef.current) clearTimeout(coldStartTimerRef.current)
        setIsColdStart(false)

        if (data?.success) {
          const role = data.role || data.profile?.role || 'nasabah'
          // 1. Simpan sesi token & info akun ke localStorage & cookie
          if (data.token) {
            localStorage.setItem('simba_token', data.token)
            setAuthCookies(data.token, role)
          }
          if (data.user) {
            localStorage.setItem('simba_user', JSON.stringify(data.user))
          }
          localStorage.setItem('simba_role', role)

          // 2. Sinkronkan sesi Supabase client di browser jika tersedia token
          try {
            if (data.refresh_token && data.token) {
              const supabase = createClient()
              await supabase.auth.setSession({
                access_token: data.token,
                refresh_token: data.refresh_token,
              })
            }
          } catch {
            // Ignored if direct supabase connection unresolvable
          }

          toast.success('Login berhasil!')

          // 3. Arahkan rute: periksa parameter redirect terlebih dahulu
          if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search)
            const redirectUrl = params.get('redirect')
            if (redirectUrl && redirectUrl.startsWith('/') && !redirectUrl.startsWith('//')) {
              router.push(redirectUrl)
              return
            }
          }

          if (role === 'admin') router.push('/admin')
          else if (role === 'admin_klh') router.push('/admin/klh')
          else if (role === 'petugas') router.push('/petugas')
          else router.push('/nasabah')
          return
        }
      } catch (err: any) {
        lastError = err

        // Jika error kredensial (400 atau 401), jangan retry
        const isCredError =
          err.status === 401 ||
          err.response?.status === 401 ||
          err.message?.toLowerCase().includes('password') ||
          err.message?.toLowerCase().includes('kredensial')

        if (isCredError) {
          break
        }

        // Jika error jaringan pada percobaan pertama, tunggu 1 detik lalu retry 1x
        if (attempt === 1) {
          setIsColdStart(true)
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      }
    }

    if (coldStartTimerRef.current) clearTimeout(coldStartTimerRef.current)
    setIsColdStart(false)
    setLoading(false)

    // Analisis jenis error: Kredensial vs Jaringan
    const isCredError =
      lastError?.status === 401 ||
      lastError?.response?.status === 401 ||
      lastError?.message?.toLowerCase().includes('password') ||
      lastError?.message?.toLowerCase().includes('kredensial')

    if (isCredError) {
      setNetworkError(false)
      const msg = 'Email atau password salah'
      setErrorMsg(msg)
      toast.error(msg)
    } else {
      // Error jaringan / server mati / cold start timeout
      setNetworkError(true)
      const msg = 'Tidak dapat terhubung ke server. Periksa koneksi Anda lalu coba lagi'
      setErrorMsg(msg)
      toast.error(msg)
    }
  }

  const fillDemoAccount = (accEmail: string, accPw: string) => {
    setEmail(accEmail)
    setPassword(accPw)
    setErrorMsg('')
    setNetworkError(false)
    toast.success(`Akun demo dipilih! Silakan klik Masuk.`, { icon: '🔑' })
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-600/20">
            <Leaf size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Masuk ke SIMBA</h1>
          <p className="text-slate-500 mt-1 text-sm">Sistem Informasi Bank Sampah Indonesia</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          {/* Banner Indikator Cold Start */}
          {isColdStart && loading && (
            <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-800 text-xs animate-pulse">
              <Server size={18} className="shrink-0 mt-0.5 text-amber-600" />
              <div>
                <p className="font-bold">Server sedang disiapkan...</p>
                <p className="mt-0.5 text-amber-700">
                  Menghubungkan ke layanan cloud (cold start ~15-30 detik pada free tier). Harap tunggu sejenak.
                </p>
              </div>
            </div>
          )}

          {/* Banner Error Ramah Jaringan */}
          {errorMsg && (
            <div
              role="alert"
              aria-live="polite"
              className={`mb-5 p-4 rounded-2xl border text-sm flex flex-col gap-2.5 ${
                networkError
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={18}
                  className={`shrink-0 mt-0.5 ${networkError ? 'text-rose-600' : 'text-amber-600'}`}
                />
                <div className="flex-1">
                  <p className="font-bold">{networkError ? 'Koneksi Server Terkendala' : 'Gagal Masuk'}</p>
                  <p className="mt-0.5 text-xs opacity-90">{errorMsg}</p>
                </div>
              </div>

              {networkError && (
                <button
                  type="button"
                  onClick={() => handleLogin()}
                  disabled={loading}
                  className="self-end mt-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                  Coba Lagi
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="login-email" className="block text-sm font-semibold text-slate-700">
                  Email
                </label>
                {email.length >= EMAIL_MAX && (
                  <span aria-live="polite" className="text-[11px] text-amber-600 font-medium">
                    Batas {EMAIL_MAX} karakter tercapai
                  </span>
                )}
              </div>
              <input
                id="login-email"
                type="email"
                maxLength={EMAIL_MAX}
                value={email}
                onChange={(e) => {
                  const val = e.target.value.slice(0, EMAIL_MAX)
                  setEmail(val)
                }}
                required
                aria-invalid={!!errorMsg}
                aria-describedby={errorMsg ? 'login-error-msg' : undefined}
                placeholder="nama@email.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="login-password" className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                {password.length >= PASSWORD_MAX && (
                  <span aria-live="polite" className="text-[11px] text-amber-600 font-medium">
                    Batas {PASSWORD_MAX} karakter tercapai
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  maxLength={PASSWORD_MAX}
                  value={password}
                  onChange={(e) => {
                    const val = e.target.value.slice(0, PASSWORD_MAX)
                    setPassword(val)
                  }}
                  required
                  aria-invalid={!!errorMsg}
                  aria-describedby={errorMsg ? 'login-error-msg' : undefined}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition-all"
                />
                <button
                  type="button"
                  aria-label={showPw ? 'Sembunyikan password' : 'Lihat password'}
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  {isColdStart ? 'Menghubungkan ke Server...' : 'Memproses...'}
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          {/* Quick Demo Accounts Selection */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
              <KeyRound size={13} className="text-emerald-600" />
              <span>Pilihan Akun Demo (Klik untuk Isi Cepat)</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('admin@simba.id', 'Password123!')}
                className="p-2.5 text-left rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 bg-slate-50 transition-all text-xs"
              >
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <span>👑 Admin BSI</span>
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">admin@simba.id</div>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('admin.nasional@simba.id', 'Password123!')}
                className="p-2.5 text-left rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 bg-slate-50 transition-all text-xs"
              >
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <span>🏛️ Admin Nasional</span>
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">admin.nasional@simba.id</div>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('petugas.melati@simba.id', 'Password123!')}
                className="p-2.5 text-left rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 bg-slate-50 transition-all text-xs"
              >
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <span>👷 Petugas Unit</span>
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">petugas.melati@simba.id</div>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('nasabah.dewi@simba.id', 'Password123!')}
                className="p-2.5 text-left rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 bg-slate-50 transition-all text-xs"
              >
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <span>🌱 Nasabah Warga</span>
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">nasabah.dewi@simba.id</div>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 text-center mt-3">
              Password semua akun demo: <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Password123!</span>
            </p>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6 pt-4 border-t border-slate-100">
            Belum punya akun?{' '}
            <Link href="/register" className="font-semibold text-emerald-600 hover:text-emerald-700">
              Daftar Nasabah Baru
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
