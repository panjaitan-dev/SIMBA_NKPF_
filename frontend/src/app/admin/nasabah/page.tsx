'use client'
import { useEffect, useState } from 'react'
import { ArrowLeft, Search, Users } from 'lucide-react'
import Link from 'next/link'
import api from '@/lib/api'
import { formatRupiah, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminNasabahPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [total, setTotal] = useState(0)

  const fetchData = async (q = '') => {
    setLoading(true)
    try {
      const r = await api.get(`/nasabah?search=${q}&limit=50`)
      setData(r.data.data || [])
      setTotal(r.data.meta?.total || 0)
    } catch { toast.error('Gagal memuat nasabah') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchData(search) }

  return (
    <div className="min-h-screen bg-slate-50 ml-60 p-8">
      <div className="mb-8">
        <Link href="/admin" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 mb-2"><ArrowLeft size={14} /> Dashboard</Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Daftar Nasabah</h1>
            <p className="text-slate-500 text-sm mt-1">Total: <strong>{total}</strong> nasabah terdaftar</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama, nomor nasabah, NIK..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm" />
        </div>
        <button type="submit" className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-colors">Cari</button>
      </form>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-xs text-slate-500">
              {['No. Nasabah', 'Nama Lengkap', 'NIK', 'Unit', 'Saldo', 'Total Setoran', 'Bergabung', 'Status'].map(h => (
                <th key={h} className="text-left px-5 py-3.5 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <tr key={i}><td colSpan={8}><div className="h-12 bg-slate-100 animate-pulse m-2 rounded" /></td></tr>)
            ) : data.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-16 text-slate-400">
                <Users size={40} className="mx-auto mb-3 text-slate-200" />
                Tidak ada nasabah ditemukan.
              </td></tr>
            ) : data.map((n: any) => (
              <tr key={n.id} className="hover:bg-slate-50">
                <td className="px-5 py-4 font-mono text-xs text-slate-600 font-semibold">{n.nomor_nasabah}</td>
                <td className="px-5 py-4 font-semibold text-slate-800">{n.nama_lengkap}</td>
                <td className="px-5 py-4 text-slate-500 text-xs">{n.nik || '-'}</td>
                <td className="px-5 py-4 text-slate-500 text-xs">{n.unit_nama || '-'}</td>
                <td className="px-5 py-4 font-bold text-emerald-700">{formatRupiah(n.saldo || 0)}</td>
                <td className="px-5 py-4 text-slate-600">{n.total_setoran_kg ? `${Number(n.total_setoran_kg).toFixed(2)} kg` : '0 kg'}</td>
                <td className="px-5 py-4 text-slate-500 text-xs">{formatDate(n.joined_at)}</td>
                <td className="px-5 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${n.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                    {n.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
