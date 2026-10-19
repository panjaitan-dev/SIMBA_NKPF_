'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { ShieldAlert, ArrowLeft, LogIn, Loader2 } from 'lucide-react'
import { getClientAuthToken, getClientAuthRole, clearAuthCookies } from '@/lib/auth-client'

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles: string[]
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const token = getClientAuthToken()
    const role = getClientAuthRole()

    // 1. Tanpa Login -> Redirect ke /login
    if (!token) {
      setAuthorized(false)
      const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`
      router.replace(redirectUrl)
      return
    }

    setUserRole(role)

    // 2. Cek Role Sesuai
    if (role && allowedRoles.includes(role)) {
      setAuthorized(true)
    } else {
      setAuthorized(false)
    }
  }, [pathname, allowedRoles, router])

  // Saat memeriksa autentikasi
  if (authorized === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 p-6">
        <Loader2 size={36} className="animate-spin text-emerald-500 mb-3" />
        <p className="text-sm font-medium">Memeriksa izin dan sesi autentikasi...</p>
      </div>
    )
  }

  // Jika Role Tidak Sesuai -> Tampilkan 403 Forbidden
  if (!authorized) {
    const token = getClientAuthToken()
    // Jika tidak ada token, sedang diarahkan ke /login
    if (!token) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 p-6">
          <Loader2 size={36} className="animate-spin text-emerald-500 mb-3" />
          <p className="text-sm font-medium">Mengarahkan ke halaman login...</p>
        </div>
      )
    }

    const handleSwitch = () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('simba_token')
        localStorage.removeItem('simba_user')
        localStorage.removeItem('simba_role')
      }
      clearAuthCookies()
      router.push('/login')
    }

    const getDashboardHref = () => {
      if (!userRole) return '/login'
      if (userRole === 'admin') return '/admin'
      if (userRole === 'admin_klh') return '/admin/klh'
      if (userRole === 'petugas') return '/petugas'
      return '/nasabah'
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6 text-white">
        <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <ShieldAlert size={34} />
          </div>

          <span className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 mb-4">
            Status 403 • Akses Ditolak
          </span>

          <h2 className="text-2xl font-extrabold text-white mb-3 tracking-tight">
            Izin Akses Tidak Memadai
          </h2>

          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            Halaman ini dikhususkan untuk akun dengan wewenang{' '}
            <strong className="text-rose-400 font-semibold">{allowedRoles.join(' / ')}</strong>.
            Akun Anda saat ini memiliki wewenang <strong className="text-white font-semibold">{userRole || 'Anonim'}</strong>.
          </p>

          <div className="space-y-3">
            <Link
              href={getDashboardHref()}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-5 rounded-xl transition-all shadow-lg shadow-emerald-900/40 text-sm"
            >
              <ArrowLeft size={16} />
              <span>Buka Dashboard Saya ({userRole || 'Pengguna'})</span>
            </Link>

            <button
              onClick={handleSwitch}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold py-3 px-5 rounded-xl border border-slate-700 transition-colors text-sm"
            >
              <LogIn size={16} />
              <span>Ganti Akun / Login Ulang</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Jika Authorized
  return <>{children}</>
}
