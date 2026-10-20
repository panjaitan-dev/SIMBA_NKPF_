'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Leaf, Menu, X, LogIn } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/#tentang', label: 'Tentang' },
  { href: '/bank-sampah', label: 'Bank Sampah' },
  { href: '/berita', label: 'Berita' },
  { href: '/edukasi', label: 'Edukasi' },
  { href: '/galeri', label: 'Galeri' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<{ role?: string } | null>(null)

  // Halaman dengan hero latar belakang gelap hanya Beranda ('/')
  const isDarkPage = pathname === '/'
  // Jika di halaman terang (seperti /login atau /lapor) ATAU saat di-scroll, gunakan teks gelap & background putih
  const showDarkText = !isDarkPage || isScrolled

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    // Set posisi awal saat mount
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Cek sesi dari localStorage (proxy auth)
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('simba_user')
        const storedRole = localStorage.getItem('simba_role')
        if (storedUser) {
          const parsed = JSON.parse(storedUser)
          setUser({ ...parsed, role: storedRole || parsed.role })
          return
        }
      } catch {}
    }

    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUser(session.user.user_metadata)
    }).catch(() => {})
  }, [])

  const getDashboardHref = () => {
    if (!user) return '/login'
    const role = (user as any)?.role
    if (role === 'admin') return '/admin'
    if (role === 'admin_klh') return '/admin/klh'
    if (role === 'petugas') return '/petugas'
    return '/nasabah'
  }

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out',
        showDarkText
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-slate-100'
          : 'bg-[#06140d]/40 backdrop-blur-[2px] py-4'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Identitas Brand */}
          <div className="flex flex-col">
            <Link
              href="/"
              className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"
            >
              <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm shrink-0 transition-transform group-hover:scale-105">
                <Leaf size={18} className="text-white" />
              </div>
              <div className="flex flex-col">
                <h1
                  className={cn(
                    'font-extrabold text-sm tracking-tight transition-colors duration-300',
                    showDarkText ? 'text-slate-800' : 'text-white'
                  )}
                >
                  SIMBA
                </h1>
                <p className="text-[10px] font-bold tracking-widest uppercase text-emerald-500">
                  Bank Sampah Indonesia
                </p>
              </div>
            </Link>

            {/* Badge Pill "SISTEM INFORMASI BANK SAMPAH INDONESIA"
                Hanya tampil di Top / Unscrolled pada Halaman Beranda */}
            <div
              className={cn(
                'transition-all duration-300 ease-in-out overflow-hidden',
                isDarkPage && !isScrolled
                  ? 'max-h-8 opacity-100 mt-2'
                  : 'max-h-0 opacity-0 mt-0 pointer-events-none'
              )}
            >
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Sistem Informasi Bank Sampah Indonesia</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-emerald-500',
                  showDarkText
                    ? 'text-slate-800 hover:text-emerald-600 hover:bg-slate-100'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Call-to-Action (Login & Lapor) */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <Link
                href={getDashboardHref()}
                className="text-sm font-semibold px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-sm"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className={cn(
                  'flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-colors duration-300',
                  showDarkText
                    ? 'text-slate-800 hover:text-emerald-700 hover:bg-slate-100'
                    : 'text-white hover:bg-white/10'
                )}
              >
                <LogIn size={16} />
                <span>Login</span>
              </Link>
            )}

            <Link
              href="/lapor"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              <Leaf size={15} aria-hidden="true" className="text-white" />
              <span className="text-white">Lapor</span>
            </Link>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/lapor"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 min-h-[40px] rounded-xl transition-all shadow-sm"
            >
              <Leaf size={14} className="text-white" />
              <span>Lapor</span>
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={cn(
                'min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl transition-colors duration-300',
                showDarkText
                  ? 'text-slate-800 hover:bg-slate-100'
                  : 'text-white hover:bg-white/10'
              )}
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-md border-t border-slate-100 px-6 py-4 space-y-1 shadow-xl animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center min-h-[44px] px-4 rounded-xl text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100">
            <Link
              href={user ? getDashboardHref() : '/login'}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 min-h-[44px] px-4 rounded-xl text-sm font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              <LogIn size={16} />
              <span>{user ? 'Buka Dashboard' : 'Masuk / Login Akun'}</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
