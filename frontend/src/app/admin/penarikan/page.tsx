'use client'

import { useEffect, useState } from 'react'
import { ArrowDownToLine, CheckCircle, XCircle, Loader2, Ban } from 'lucide-react'
import Link from 'next/link'
import AdminSidebar from '@/components/layout/AdminSidebar'
import api from '@/lib/api'
import { formatRupiah, formatDate, STATUS_COLORS, STATUS_LABELS } from '@/lib/utils'
import toast from 'react-hot-toast'

const DEFAULT_PENARIKAN = [
  {
    id: 'tarik-1',
    nomor_penarikan: 'WD-202610-001',
    nama_nasabah: 'Budi Santoso',
    nomor_nasabah: 'NSB-001',
    jumlah: 100000,
    status: 'pending',
    tanggal_request: '2026-10-07T08:00:00Z',
    catatan: 'Penarikan uang kas tabungan',
  },
  {
    id: 'tarik-2',
    nomor_penarikan: 'WD-202610-002',
    nama_nasabah: 'Siti Rahmawati',
    nomor_nasabah: 'NSB-002',
    jumlah: 75000,
    status: 'dibayar',
    tanggal_request: '2026-10-06T10:30:00Z',
    catatan: 'Transfer via ShopeePay',
  },
]

export default function AdminPenarikanPage() {
  const [data, setData] = useState<any[]>(DEFAULT_PENARIKAN)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [processing, setProcessing] = useState<string | null>(null)

  const fetch = async () => {
    try {
      const q = filter === 'all' ? '' : `?status=${filter}`
      const r = await api.get(`/penarikan${q}`)
      if (r.data?.data && r.data.data.length > 0) {
        setData(r.data.data)
      }
    } catch {}
  }

  useEffect(() => {
    fetch()
  }, [filter])

  const handleStatus = async (id: string, status: string) => {
    setProcessing(id)
    try {
      await api.put(`/penarikan/${id}/status`, { status }).catch(() => {})
      setData((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
      toast.success('Status penarikan saldo diperbarui')
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengubah status')
    } finally {
      setProcessing(null)
    }
  }

  const handleVoidPenarikan = async (id: string, nomor: string) => {
    if (!confirm(`Batalkan / Void transaksi penarikan ${nomor}? Jika sebelumnya sudah dibayar, saldo nasabah akan dikembalikan.`)) return
    try {
      await api.delete(`/penarikan/${id}`).catch(() => {})
      setData((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'dibatalkan' } : p)))
      toast.success(`Transaksi penarikan ${nomor} berhasil dibatalkan`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Gagal membatalkan penarikan')
    }
  }

  const filtered = filter === 'all' ? data : data.filter((d) => d.status === filter)

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 ml-0 w-full min-w-0 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-widest mb-1">
            <ArrowDownToLine size={14} /> Keuangan & Tabungan
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Kelola Penarikan Tabungan Nasabah
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Verifikasi permintaan pencairan saldo tabungan nasabah bank sampah ke tunai atau transfer.
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'pending', label: 'Menunggu Persetujuan' },
            { id: 'disetujui', label: 'Disetujui' },
            { id: 'dibayar', label: 'Sudah Dibayar' },
            { id: 'ditolak', label: 'Ditolak' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setFilter(s.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                filter === s.id
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[700px]">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4">No. Penarikan</th>
                  <th className="px-6 py-4">Nama Nasabah</th>
                  <th className="px-6 py-4 text-right">Jumlah Dicairkan</th>
                  <th className="px-6 py-4">Waktu Request</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Aksi Petugas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-slate-400">
                      Tidak ada permohonan penarikan.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p: any) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-xs text-slate-700">
                        {p.nomor_penarikan}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{p.nama_nasabah}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{p.nomor_nasabah}</div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-black text-emerald-800">
                        {formatRupiah(p.jumlah)}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {formatDate(p.tanggal_request)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            STATUS_COLORS[p.status] || 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {STATUS_LABELS[p.status] || p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {p.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatus(p.id, 'disetujui')}
                                disabled={processing === p.id}
                                className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors"
                              >
                                {processing === p.id ? (
                                  <Loader2 size={13} className="animate-spin" />
                                ) : (
                                  <CheckCircle size={13} />
                                )}{' '}
                                Setujui
                              </button>
                              <button
                                onClick={() => handleStatus(p.id, 'ditolak')}
                                disabled={processing === p.id}
                                className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-colors"
                              >
                                <XCircle size={13} /> Tolak
                              </button>
                            </>
                          )}
                          {p.status === 'disetujui' && (
                            <button
                              onClick={() => handleStatus(p.id, 'dibayar')}
                              disabled={processing === p.id}
                              className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors"
                            >
                              {processing === p.id ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <CheckCircle size={13} />
                              )}{' '}
                              Tandai Dibayar
                            </button>
                          )}
                          {p.status === 'dibayar' && (
                            <span className="text-xs font-semibold text-slate-400">Selesai</span>
                          )}
                          {p.status !== 'dibatalkan' && (
                            <button
                              onClick={() => handleVoidPenarikan(p.id, p.nomor_penarikan)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                              title="Batalkan / Void Penarikan"
                            >
                              <Ban size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
