'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Leaf, PiggyBank, Recycle, ArrowDownToLine, User, LogOut, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/nasabah', icon: PiggyBank, label: 'Dashboard' },
  { href: '/nasabah/setoran', icon: Recycle, label: 'Riwayat Setoran' },
  { href: '/nasabah/penarikan', icon: ArrowDownToLine, label: 'Riwayat Penarikan' },
  { href: '/nasabah/profil', icon: User, label: 'Profil Saya' },
]

export default function NasabahSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Auto-close on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch {}
    router.push('/')
  }

  return (
    <>
      {/* Mobile Top Header (Visible on < lg screens) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-30 px-4 flex items-center justify-between shadow-xs">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-xs">
            <Leaf size={16} className="text-white" />
          </div>
          <div>
            <p className="font-extrabold text-slate-900 text-sm tracking-tight leading-none">SIMBA</p>
            <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">Portal Nasabah</p>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Nasabah Sidebar Drawer */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 z-50 flex flex-col shadow-sm transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
              <Leaf size={18} className="text-white" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-sm tracking-tight">SIMBA</p>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Portal Nasabah</p>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="Tutup menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 shadow-xs border border-emerald-100 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-600'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-emerald-600' : 'text-slate-400'} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout Action */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors min-h-[44px]"
          >
            <LogOut size={18} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  )
}
