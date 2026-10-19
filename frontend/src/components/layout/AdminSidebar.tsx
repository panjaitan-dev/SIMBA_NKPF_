'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  Leaf,
  LayoutDashboard,
  Users,
  Building2,
  Recycle,
  ShoppingCart,
  ReceiptText,
  Settings,
  ArrowDownToLine,
  FileText,
  Megaphone,
  BookOpen,
  Images,
  Globe,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { clearAuthCookies } from '@/lib/auth-client'

export const adminNavItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/klh', icon: Globe, label: 'Statistik Nasional' },
  { href: '/admin/nasabah', icon: Users, label: 'Data Nasabah' },
  { href: '/admin/klien', icon: Building2, label: 'Data Client / Pembeli' },
  { href: '/admin/jenis-sampah', icon: Settings, label: 'Kelola Data Sampah' },
  { href: '/admin/setoran', icon: Recycle, label: 'Transaksi Pembelian' },
  { href: '/admin/penjualan', icon: ShoppingCart, label: 'Transaksi Penjualan' },
  { href: '/admin/laporan-transaksi', icon: ReceiptText, label: 'Laporan Jual Beli' },
  { href: '/admin/penarikan', icon: ArrowDownToLine, label: 'Penarikan Tabungan' },
  { href: '/admin/laporan', icon: FileText, label: 'Aduan Lingkungan' },
  { href: '/admin/berita', icon: Megaphone, label: 'Berita & Info' },
  { href: '/admin/edukasi', icon: BookOpen, label: 'Edukasi 3R' },
  { href: '/admin/galeri', icon: Images, label: 'Galeri Kegiatan' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Auto-close drawer on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('simba_token')
        localStorage.removeItem('simba_user')
        localStorage.removeItem('simba_role')
        clearAuthCookies()
      }
      const supabase = createClient()
      await supabase.auth.signOut().catch(() => {})
    } catch {}
    router.push('/login')
  }

  return (
    <>
      {/* Mobile Top Header (Visible on < lg screens) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 z-30 px-4 flex items-center justify-between shadow-md">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
            <Leaf size={16} className="text-white" />
          </div>
          <div>
            <p className="font-extrabold text-white text-sm tracking-tight leading-none">SIMBA</p>
            <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Admin Panel</p>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Admin Sidebar Navigation Drawer */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-slate-900 z-50 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/40">
              <Leaf size={18} className="text-white" />
            </div>
            <div>
              <p className="font-extrabold text-white text-base tracking-tight leading-tight">SIMBA</p>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                Bank Sampah Indonesia
              </p>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="Tutup menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-3 pt-2 pb-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Menu Operasional
          </p>
          {adminNavItems.slice(0, 7).map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
                  active
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon size={17} className={active ? 'text-white' : 'text-slate-400'} />
                <span>{item.label}</span>
              </Link>
            )
          })}

          <p className="px-3 pt-4 pb-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Pelayanan & Konten
          </p>
          {adminNavItems.slice(7).map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
                  active
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon size={17} className={active ? 'text-white' : 'text-slate-400'} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors min-h-[44px]"
          >
            <LogOut size={17} />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>
    </>
  )
}
