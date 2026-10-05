'use client'
import { useEffect, useState } from 'react'
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import api from '@/lib/api'
import { formatRupiah, formatDate, STATUS_COLORS, STATUS_LABELS } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminPenarikanPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [processing, setProcessing] = useState<string | null>(null)

  const fetch = async () => {
    setLoading(true)
    try {
      const r = await api.get(`/penarikan?status=${filter}&limit=50`)
      setData(r.data.data || [])
    } catch { toast.error('Gagal memuat data') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [filter])

  const handleStatus = async (id: string, status: string) => {
    setProcessing(id)
    try {
      await api.put(`/penarikan/${id}/status`, { status })
      toast.success('Status penarikan diperbarui')
      fetch()
    } catch (err: any) { toast.error(err.message) }
    finally { setProcessing(null) }
  }

  return (
    <div className="min-h-screen bg-slate-50 ml-60 p-8">
      <div className="mb-8">
        <Link href="/admin" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 mb-2"><ArrowLeft size={14} /> Dashboard</Link>
        <h1 className="text-2xl font-extrabold text-slate-900">Kelola Penarikan</h1>
      </div>

      <div className="flex gap-2 mb-6">
        {['pending', 'disetujui', 'dibayar', 'ditolak'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-colors ${filter === s ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300'}`}>
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-xs text-slate-500">
              {['No. Penarikan', 'Nasabah', 'Jumlah', 'Tanggal', 'Status', 'Aksi'].map(h => (
                <th key={h} className="text-left px-5 py-3.5 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={6}><div className="h-12 bg-slate-100 animate-pulse m-2 rounded" /></td></tr>
              ))
            ) : data.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-16 text-slate-400">Tidak ada data penarikan.</td></tr>
            ) : data.map((p: any) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-5 py-4 font-mono text-xs text-slate-600">{p.nomor_penarikan}</td>
                <td className="px-5 py-4 font-semibold text-slate-800">
                  {p.nasabah?.profiles?.nama_lengkap || p.nasabah?.nomor_nasabah}
                </td>
                <td className="px-5 py-4 font-bold text-emerald-700">{formatRupiah(p.jumlah)}</td>
                <td className="px-5 py-4 text-slate-500">{formatDate(p.tanggal_request)}</td>
                <td className="px-5 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[p.status]}`}>{STATUS_LABELS[p.status]}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    {p.status === 'pending' && (
                      <button onClick={() => handleStatus(p.id, 'disetujui')} disabled={processing === p.id}
                        className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
                        {processing === p.id ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />} Setujui
                      </button>
                    )}
                    {p.status === 'disetujui' && (
                      <button onClick={() => handleStatus(p.id, 'dibayar')} disabled={processing === p.id}
                        className="flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                        {processing === p.id ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />} Tandai Dibayar
                      </button>
                    )}
                    {p.status === 'pending' && (
                      <button onClick={() => handleStatus(p.id, 'ditolak')} disabled={processing === p.id}
                        className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                        <XCircle size={13} /> Tolak
                      </button>
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
