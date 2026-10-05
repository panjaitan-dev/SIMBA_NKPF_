'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Leaf, LayoutDashboard, Users, Recycle, ArrowDownToLine,
  FileText, BookOpen, Images, Megaphone, LogOut, Settings, Building2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import api from '@/lib/api'
import { formatRupiah, formatDate, STATUS_COLORS, STATUS_LABELS } from '@/lib/utils'

const navItems = [
  { href: '/admin', icon: <LayoutDashboard size={17} />, label: 'Dashboard' },
  { href: '/admin/nasabah', icon: <Users size={17} />, label: 'Nasabah' },
  { href: '/admin/setoran', icon: <Recycle size={17} />, label: 'Setoran' },
  { href: '/admin/penarikan', icon: <ArrowDownToLine size={17} />, label: 'Penarikan' },
  { href: '/admin/laporan', icon: <FileText size={17} />, label: 'Laporan' },
  { href: '/admin/jenis-sampah', icon: <Settings size={17} />, label: 'Jenis Sampah' },
  { href: '/admin/unit', icon: <Building2 size={17} />, label: 'Unit Bank Sampah' },
  { href: '/admin/berita', icon: <Megaphone size={17} />, label: 'Berita' },
  { href: '/admin/edukasi', icon: <BookOpen size={17} />, label: 'Edukasi' },
  { href: '/admin/galeri', icon: <Images size={17} />, label: 'Galeri' },
  { href: '/admin/pengumuman', icon: <Megaphone size={17} />, label: 'Pengumuman' },
]

function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-slate-900 z-40 flex flex-col">
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
            <Leaf size={16} className="text-white" />
          </div>
          <div>
            <p className="font-extrabold text-white text-sm">SIMBA</p>
            <p className="text-[10px] text-emerald-500 font-semibold uppercase tracking-widest">Admin</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(l => {
          const active = pathname === l.href
          return (
            <Link key={l.href} href={l.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${active ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              {l.icon} {l.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-slate-800">
        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors">
          <LogOut size={17} /> Keluar
        </button>
      </div>
    </aside>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard/admin')
      .then(r => setStats(r.data.data))
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <main className="ml-60 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900">Dashboard Admin</h1>
          <p className="text-slate-500 text-sm mt-1">Sistem Informasi Bank Sampah — Kabupaten Toba</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 bg-slate-200 animate-pulse rounded-2xl" />)}
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { label: 'Total Nasabah', value: stats?.total_nasabah, icon: <Users size={22} />, color: 'text-blue-700 bg-blue-100', suffix: 'orang' },
                { label: 'Setoran Terverifikasi', value: stats?.total_setoran_diverifikasi, icon: <Recycle size={22} />, color: 'text-emerald-700 bg-emerald-100', suffix: 'transaksi' },
                { label: 'Laporan Pending', value: stats?.laporan_pending, icon: <FileText size={22} />, color: 'text-amber-700 bg-amber-100', suffix: 'laporan' },
                { label: 'Penarikan Pending', value: stats?.penarikan_pending, icon: <ArrowDownToLine size={22} />, color: 'text-violet-700 bg-violet-100', suffix: 'permintaan' },
              ].map(s => (
                <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-6">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>{s.icon}</div>
                  <p className="text-3xl font-extrabold text-slate-900">{s.value ?? '-'}</p>
                  <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Total Nilai Setoran */}
            <div className="bg-emerald-600 rounded-2xl p-7 mb-10 text-white">
              <p className="text-emerald-200 text-sm font-semibold mb-1">Total Nilai Setoran Diverifikasi</p>
              <p className="text-4xl font-extrabold">{formatRupiah(stats?.total_nilai_setoran || 0)}</p>
            </div>

            {/* Setoran Terbaru */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-900">Setoran Terbaru</h2>
                <Link href="/admin/setoran" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">Lihat Semua →</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-slate-500 border-b border-slate-100">
                      <th className="text-left pb-3 font-semibold">No. Setoran</th>
                      <th className="text-left pb-3 font-semibold">Nasabah</th>
                      <th className="text-left pb-3 font-semibold">Tanggal</th>
                      <th className="text-left pb-3 font-semibold">Nilai</th>
                      <th className="text-left pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {stats?.recent_setoran?.map((s: any) => (
                      <tr key={s.id}>
                        <td className="py-3 font-mono text-xs text-slate-700">{s.nomor_setoran}</td>
                        <td className="py-3 font-medium text-slate-800">{s.nama_nasabah}</td>
                        <td className="py-3 text-slate-500">{formatDate(s.tanggal_setoran)}</td>
                        <td className="py-3 font-bold text-emerald-700">{formatRupiah(s.total_nilai)}</td>
                        <td className="py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[s.status]}`}>{STATUS_LABELS[s.status]}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
