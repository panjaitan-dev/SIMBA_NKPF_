'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShieldAlert, ArrowLeft, LogIn, Home } from 'lucide-react'
import { clearAuthCookies, getClientAuthRole } from '@/lib/auth-client'

export default function ForbiddenPage() {
  const router = useRouter()
  const role = getClientAuthRole()

  const handleSwitchAccount = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('simba_token')
      localStorage.removeItem('simba_user')
      localStorage.removeItem('simba_role')
    }
    clearAuthCookies()
    router.push('/login')
  }

  const getDashboardHref = () => {
    if (!role) return '/login'
    if (role === 'admin') return '/admin'
    if (role === 'admin_klh') return '/admin/klh'
    if (role === 'petugas') return '/petugas'
    return '/nasabah'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6 text-white">
      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <ShieldAlert size={34} />
        </div>

        <span className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 mb-4">
          Status 403 • Akses Terlarang
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight">
          Akses Ditolak
        </h1>

        <p className="text-sm text-slate-400 leading-relaxed mb-8">
          Akun Anda {role ? `(Role: ${role})` : ''} tidak memiliki izin akses untuk membuka modul ini.
          Silakan hubungi administrator sistem atau masuk menggunakan akun dengan wewenang yang sesuai.
        </p>

        <div className="space-y-3">
          <Link
            href={getDashboardHref()}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-5 rounded-xl transition-all shadow-lg shadow-emerald-900/40 text-sm"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Dashboard Saya</span>
          </Link>

          <button
            onClick={handleSwitchAccount}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold py-3 px-5 rounded-xl border border-slate-700 transition-colors text-sm"
          >
            <LogIn size={16} />
            <span>Masuk dengan Akun Lain</span>
          </button>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-slate-400 pt-2 transition-colors"
          >
            <Home size={14} />
            <span>Kembali ke Halaman Beranda Publik</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
