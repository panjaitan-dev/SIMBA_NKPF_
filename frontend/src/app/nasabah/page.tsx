'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Leaf, PiggyBank, Recycle, ArrowDownToLine, LogOut, User, ClipboardList } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { formatRupiah, formatWeight, formatDate, STATUS_COLORS, STATUS_LABELS } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function NasabahDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [penarikanAmt, setPenarikanAmt] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get('/dashboard/nasabah')
      .then(r => setStats(r.data.data))
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const handlePenarikan = async () => {
    const jumlah = parseFloat(penarikanAmt)
    if (!jumlah || jumlah <= 0) { toast.error('Masukkan jumlah yang valid'); return }
    setSubmitting(true)
    try {
      await api.post('/penarikan', { jumlah })
      toast.success('Permintaan penarikan berhasil diajukan!')
      setPenarikanAmt('')
      const r = await api.get('/dashboard/nasabah')
      setStats(r.data.data)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 z-40 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Leaf size={16} className="text-white" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-sm">SIMBA</p>
              <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-widest">Nasabah</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: '/nasabah', icon: <PiggyBank size={17} />, label: 'Dashboard' },
            { href: '/nasabah/setoran', icon: <Recycle size={17} />, label: 'Riwayat Setoran' },
            { href: '/nasabah/penarikan', icon: <ArrowDownToLine size={17} />, label: 'Riwayat Penarikan' },
            { href: '/nasabah/profil', icon: <User size={17} />, label: 'Profil Saya' },
          ].map(l => (
            <Link key={l.href} href={l.href} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
              {l.icon} {l.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors">
            <LogOut size={17} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900">Selamat Datang, {stats?.nama_lengkap?.split(' ')[0]}!</h1>
          <p className="text-slate-500 text-sm mt-1">No. Nasabah: <span className="font-semibold text-slate-700">{stats?.nomor_nasabah}</span></p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Saldo Tabungan', value: formatRupiah(stats?.saldo || 0), icon: <PiggyBank size={22} />, color: 'text-emerald-700 bg-emerald-100' },
            { label: 'Total Setoran', value: formatWeight(stats?.total_setoran_kg || 0), icon: <Recycle size={22} />, color: 'text-blue-700 bg-blue-100' },
            { label: 'Jumlah Transaksi', value: `${stats?.total_setoran_count || 0}x`, icon: <ClipboardList size={22} />, color: 'text-violet-700 bg-violet-100' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-5">
              <div className={`w-13 h-13 rounded-xl flex items-center justify-center ${s.color} p-3`}>{s.icon}</div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-0.5">{s.label}</p>
                <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ajukan Penarikan */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2"><ArrowDownToLine size={18} className="text-emerald-600" /> Ajukan Penarikan</h2>
            <p className="text-sm text-slate-500 mb-4">Saldo tersedia: <strong className="text-slate-800">{formatRupiah(stats?.saldo || 0)}</strong></p>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">Rp</span>
                <input type="number" value={penarikanAmt} onChange={e => setPenarikanAmt(e.target.value)}
                  placeholder="0" min="1000" max={stats?.saldo}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm" />
              </div>
              <button onClick={handlePenarikan} disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold px-5 py-3 rounded-xl transition-colors text-sm whitespace-nowrap">
                {submitting ? 'Memproses...' : 'Ajukan'}
              </button>
            </div>
          </div>

          {/* Riwayat Setoran Terakhir */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2"><Recycle size={18} className="text-emerald-600" /> Setoran Terakhir</h2>
            <div className="space-y-3">
              {!stats?.last_setoran?.length ? (
                <p className="text-sm text-slate-400 text-center py-6">Belum ada setoran.</p>
              ) : stats.last_setoran.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{s.nomor_setoran}</p>
                    <p className="text-xs text-slate-500">{formatDate(s.tanggal_setoran)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-700">{formatRupiah(s.total_nilai)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[s.status]}`}>{STATUS_LABELS[s.status]}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/nasabah/setoran" className="mt-4 text-sm text-emerald-600 font-semibold block text-center">Lihat Semua →</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
