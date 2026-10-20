'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Leaf, Menu, X, LogIn, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/bank-sampah', label: 'Cari Unit' },
  { href: '/#kalkulator', label: 'Kalkulator' },
  { href: '/#harga', label: 'Papan Harga' },
  { href: '/edukasi', label: 'Edukasi' },
  { href: '/lapor', label: 'Lapor' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<{ role?: string; nama?: string } | null>(null)

  const isDarkHero = pathname === '/' && !isScrolled

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
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
      if (session) setUser(session.user.user_metadata as any)
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
      aria-label="Navigasi Utama"
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-200',
        isDarkHero
          ? 'bg-[#143528]/95 backdrop-blur-md text-[#FAF7F2] border-b border-[#1E4D3B]/60 py-3.5'
          : 'bg-[#FAF7F2]/95 backdrop-blur-md text-[#1B1B18] shadow-xs border-b border-[#E2DACB] py-3'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Identitas Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8572A] rounded-xl"
          >
            <div className="w-9 h-9 bg-[#1E4D3B] text-[#FAF7F2] border border-[#143528] rounded-xl flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <Leaf size={18} className="text-[#FAF7F2]" />
            </div>
            <div className="flex flex-col">
              <span className={cn(
                'font-serif font-black text-base tracking-tight leading-none',
                isDarkHero ? 'text-[#FAF7F2]' : 'text-[#1E4D3B]'
              )}>
                SIMBA <span className="font-sans text-xs font-semibold tracking-normal text-[#D8572A]">Nusantara</span>
              </span>
              <span className={cn(
                'text-[10px] font-mono tracking-wider uppercase mt-0.5',
                isDarkHero ? 'text-[#FAF7F2]/70' : 'text-[#66635B]'
              )}>
                Pilot Sumut • IT Fest 2026
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8572A]',
                    isDarkHero
                      ? isActive
                        ? 'bg-[#1E4D3B] text-white font-semibold'
                        : 'text-[#FAF7F2]/85 hover:text-white hover:bg-white/10'
                      : isActive
                        ? 'bg-[#EBF2EE] text-[#1E4D3B] font-semibold'
                        : 'text-[#66635B] hover:text-[#1B1B18] hover:bg-[#F4EFE4]'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Desktop CTA (Login / Dashboard) */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link
                href={getDashboardHref()}
                className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2 bg-[#1E4D3B] text-white rounded-xl shadow-[2px_2px_0px_#143528] hover:-translate-y-0.5 transition-transform"
              >
                <LayoutDashboard size={15} />
                <span>Dashboard</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className={cn(
                    'inline-flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-xl transition-colors',
                    isDarkHero
                      ? 'text-[#FAF7F2] hover:bg-white/10'
                      : 'text-[#1B1B18] hover:bg-[#F4EFE4]'
                  )}
                >
                  <LogIn size={15} />
                  <span>Masuk</span>
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 bg-[#D8572A] hover:bg-[#B8431A] text-white rounded-xl shadow-[2px_2px_0px_#1E4D3B] hover:-translate-y-0.5 transition-transform"
                >
                  <span>Daftar Nasabah</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={cn(
                'min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl transition-colors',
                isDarkHero ? 'text-[#FAF7F2] hover:bg-white/10' : 'text-[#1B1B18] hover:bg-[#F4EFE4]'
              )}
              aria-expanded={menuOpen}
              aria-label="Buka menu navigasi"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-t border-[#E2DACB] px-4 py-4 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center min-h-[44px] px-3 rounded-xl text-sm font-semibold text-[#1B1B18] hover:bg-[#EBF2EE] hover:text-[#1E4D3B] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#E2DACB] flex flex-col gap-2">
            <Link
              href={user ? getDashboardHref() : '/login'}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-xl text-sm font-bold bg-[#EBF2EE] text-[#1E4D3B] transition-colors"
            >
              <LogIn size={16} />
              <span>{user ? 'Buka Dashboard' : 'Masuk ke Akun'}</span>
            </Link>
            {!user && (
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center min-h-[44px] px-4 rounded-xl text-sm font-bold bg-[#D8572A] text-white shadow-[2px_2px_0px_#1E4D3B] transition-colors"
              >
                Daftar Nasabah Baru
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
