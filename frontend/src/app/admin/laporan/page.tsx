'use client'
import { useEffect, useState } from 'react'
import { ArrowLeft, Eye, CheckCircle, XCircle, Loader2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import AdminSidebar from '@/components/layout/AdminSidebar'
import api from '@/lib/api'
import { formatDate, STATUS_COLORS, STATUS_LABELS } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminLaporanPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [processing, setProcessing] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const r = await api.get(`/laporan?status=${filter}&limit=50`)
      setData(r.data.data || [])
    } catch { toast.error('Gagal memuat laporan') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [filter])

  const handleStatus = async (id: string, status: string) => {
    setProcessing(id)
    try {
      await api.put(`/laporan/${id}/status`, { status })
      toast.success('Status laporan diperbarui')
      fetchData()
    } catch (err: any) { toast.error(err.message) }
    finally { setProcessing(null) }
  }

  const handleDelete = async (id: string, judul: string) => {
    if (!confirm(`Hapus aduan lingkungan "${judul}"?`)) return
    try {
      await api.delete(`/laporan/${id}`)
      setData((prev) => prev.filter((item) => item.id !== id))
      toast.success('Laporan aduan berhasil dihapus')
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Gagal menghapus laporan')
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 lg:ml-64 ml-0 w-full min-w-0 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        <div className="mb-8">
          <Link href="/admin" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 mb-2"><ArrowLeft size={14} /> Dashboard</Link>
          <h1 className="text-2xl font-extrabold text-slate-900">Aduan Masalah Lingkungan</h1>
        </div>

        <div className="flex gap-2 mb-6">
          {['pending', 'diproses', 'selesai', 'ditolak'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-colors ${filter === s ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300'}`}>
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[650px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-xs text-slate-500">
                  {['Judul', 'Pelapor', 'Lokasi', 'Tanggal', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => <tr key={i}><td colSpan={6}><div className="h-12 bg-slate-100 animate-pulse m-2 rounded" /></td></tr>)
                ) : data.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-16 text-slate-400">Tidak ada laporan.</td></tr>
                ) : data.map((l: any) => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-slate-800 max-w-xs truncate">{l.judul}</td>
                    <td className="px-5 py-4 text-slate-500">{l.nama_pelapor || 'Anonim'}</td>
                    <td className="px-5 py-4 text-slate-500 text-xs max-w-xs truncate">{l.lokasi}</td>
                    <td className="px-5 py-4 text-slate-500">{formatDate(l.created_at)}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[l.status]}`}>{STATUS_LABELS[l.status]}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/laporan/${l.id}`} className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg min-w-[36px] min-h-[36px] flex items-center justify-center"><Eye size={15} /></Link>
                        {l.status === 'pending' && (
                          <button onClick={() => handleStatus(l.id, 'diproses')} disabled={processing === l.id}
                            className="text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg min-h-[36px]">
                            {processing === l.id ? <Loader2 size={13} className="animate-spin inline" /> : 'Proses'}
                          </button>
                        )}
                        {l.status === 'diproses' && (
                          <button onClick={() => handleStatus(l.id, 'selesai')} disabled={processing === l.id}
                            className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg min-h-[36px]">
                            <CheckCircle size={13} className="inline mr-1" />Selesai
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(l.id, l.judul)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                          title="Hapus Aduan"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
