'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, Eye, Loader2, Plus } from 'lucide-react'
import api from '@/lib/api'
import { formatRupiah, formatDate, STATUS_COLORS, STATUS_LABELS } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminSetoranPage() {
  const [setoran, setSetoran] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [processing, setProcessing] = useState<string | null>(null)

  const fetchSetoran = async () => {
    setLoading(true)
    try {
      const r = await api.get(`/setoran?status=${filter}&limit=50`)
      setSetoran(r.data.data || [])
    } catch { toast.error('Gagal memuat setoran') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchSetoran() }, [filter])

  const handleStatus = async (id: string, status: 'diverifikasi' | 'ditolak') => {
    setProcessing(id)
    try {
      await api.put(`/setoran/${id}/status`, { status })
      toast.success(`Setoran berhasil ${status === 'diverifikasi' ? 'diverifikasi' : 'ditolak'}`)
      fetchSetoran()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 ml-60 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 mb-2"><ArrowLeft size={14} /> Dashboard</Link>
          <h1 className="text-2xl font-extrabold text-slate-900">Kelola Setoran</h1>
        </div>
        <Link href="/admin/setoran/baru" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
          <Plus size={16} /> Input Setoran Baru
        </Link>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {['pending', 'diverifikasi', 'ditolak'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-colors ${filter === s ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300'}`}>
            {STATUS_LABELS[s]} {s === 'pending' && setoran.filter(x => x.status === 'pending').length > 0 && `(${setoran.length})`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-xs text-slate-500">
              {['No. Setoran', 'Nasabah', 'Unit', 'Tanggal', 'Nilai', 'Status', 'Aksi'].map(h => (
                <th key={h} className="text-left px-5 py-3.5 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={7} className="px-5 py-4"><div className="h-5 bg-slate-100 animate-pulse rounded" /></td></tr>
              ))
            ) : setoran.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-16 text-slate-400">Tidak ada data setoran.</td></tr>
            ) : setoran.map(s => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4 font-mono text-xs text-slate-600">{s.nomor_setoran}</td>
                <td className="px-5 py-4 font-semibold text-slate-800">{s.nama_nasabah}</td>
                <td className="px-5 py-4 text-slate-500 text-xs">{s.unit_nama || '-'}</td>
                <td className="px-5 py-4 text-slate-500">{formatDate(s.tanggal_setoran)}</td>
                <td className="px-5 py-4 font-bold text-emerald-700">{formatRupiah(s.total_nilai)}</td>
                <td className="px-5 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[s.status]}`}>{STATUS_LABELS[s.status]}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/setoran/${s.id}`} className="p-1.5 text-slate-500 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">
                      <Eye size={15} />
                    </Link>
                    {s.status === 'pending' && (
                      <>
                        <button onClick={() => handleStatus(s.id, 'diverifikasi')} disabled={processing === s.id}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50">
                          {processing === s.id ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
                        </button>
                        <button onClick={() => handleStatus(s.id, 'ditolak')} disabled={processing === s.id}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                          <XCircle size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
