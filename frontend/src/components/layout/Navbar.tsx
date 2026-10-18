'use client'

import Link from 'next/link'
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
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<{ role?: string } | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
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
        'fixed w-full z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-slate-100'
          : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
            <Leaf size={18} className="text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className={cn('font-extrabold text-sm tracking-tight transition-colors', scrolled ? 'text-slate-900' : 'text-white')}>
              SIMBA
            </h1>
            <p className="text-[10px] font-bold tracking-widest uppercase text-emerald-500">
              Bank Sampah Indonesia
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-emerald-500',
                scrolled
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <Link
              href={getDashboardHref()}
              className="text-sm font-semibold px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className={cn(
                'flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-colors',
                scrolled ? 'text-black hover:bg-slate-100' : 'text-black hover:bg-white/10'
              )}
            >
              <LogIn size={16} /> Login
            </Link>
          )}
          <Link
            href="/lapor"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-black text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            <Leaf size={15} aria-hidden="true" /> Lapor
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/lapor"
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-black text-xs sm:text-sm font-semibold px-3 sm:px-4 min-h-[44px] rounded-xl transition-colors shadow-sm"
          >
            <Leaf size={14} /> Lapor
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={cn(
              'min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl transition-colors',
              scrolled ? 'text-black hover:bg-slate-100' : 'text-black hover:bg-white/10'
            )}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
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
              <LogIn size={16} /> {user ? 'Buka Dashboard' : 'Masuk / Login Akun'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
