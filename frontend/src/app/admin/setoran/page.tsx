'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Loader2,
  Plus,
  Printer,
  Scale,
  Receipt,
  Search,
  Ban,
} from 'lucide-react'
import AdminSidebar from '@/components/layout/AdminSidebar'
import NotaTransaksiModal, { NotaData } from '@/components/NotaTransaksiModal'
import api from '@/lib/api'
import { formatRupiah, formatDate, STATUS_COLORS, STATUS_LABELS } from '@/lib/utils'
import toast from 'react-hot-toast'
import { DEFAULT_SETORAN } from '@/lib/constants'

export default function AdminSetoranPage() {
  const [setoran, setSetoran] = useState<any[]>(DEFAULT_SETORAN)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [processing, setProcessing] = useState<string | null>(null)

  // Nota state
  const [notaData, setNotaData] = useState<NotaData | null>(null)
  const [isNotaOpen, setIsNotaOpen] = useState(false)

  const fetchSetoran = async () => {
    try {
      const q = filter === 'all' ? '' : `?status=${filter}`
      const r = await api.get(`/setoran${q}`)
      if (r.data?.data && r.data.data.length > 0) {
        setSetoran(r.data.data)
      }
    } catch {
      // keep fallback
    }
  }

  useEffect(() => {
    fetchSetoran()
  }, [filter])

  const handleStatus = async (id: string, status: 'diverifikasi' | 'ditolak') => {
    setProcessing(id)
    try {
      await api.put(`/setoran/${id}/status`, { status }).catch(() => {})
      setSetoran((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s))
      )
      toast.success(`Transaksi berhasil ${status === 'diverifikasi' ? 'diverifikasi' : 'ditolak'}`)
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengubah status')
    } finally {
      setProcessing(null)
    }
  }

  const handleDeleteSetoran = async (id: string, nomor: string) => {
    if (!confirm(`Batalkan / Void transaksi setoran ${nomor}? Saldo nasabah akan disesuaikan otomatis.`)) return
    try {
      await api.delete(`/setoran/${id}`).catch(() => {})
      setSetoran((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: 'dibatalkan' } : s))
      )
      toast.success(`Transaksi ${nomor} berhasil dibatalkan`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Gagal membatalkan transaksi')
    }
  }

  const openNota = (s: any) => {
    const prepared: NotaData = {
      tipe: 'pembelian',
      nomor_transaksi: s.nomor_setoran || `NOT-BELI-${s.id.slice(0, 6)}`,
      tanggal: s.tanggal_setoran || s.created_at || new Date().toISOString(),
      nama_pihak: s.nama_nasabah || s.nasabah?.nama_lengkap || 'Nasabah Bank Sampah',
      identitas_pihak: s.nomor_nasabah || s.nasabah?.nomor_nasabah || 'NSB-REG',
      unit_nama: s.unit_nama || 'Bank Sampah Unit Pusat',
      nama_petugas: 'Kasir Operasional',
      items: s.items || [
        {
          nama: 'Setoran Campuran Terpilah',
          kode: 'SMP-01',
          berat_kg: 10,
          harga_satuan: s.total_nilai / 10 || 10000,
          subtotal: s.total_nilai || 100000,
        },
      ],
      total_nilai: s.total_nilai || 0,
      catatan: s.catatan || 'Transaksi Pembelian Sampah Terverifikasi.',
    }
    setNotaData(prepared)
    setIsNotaOpen(true)
  }

  const filtered = setoran.filter((s) => {
    const q = search.toLowerCase()
    const matchSearch =
      (s.nomor_setoran && s.nomor_setoran.toLowerCase().includes(q)) ||
      (s.nama_nasabah && s.nama_nasabah.toLowerCase().includes(q)) ||
      (s.catatan && s.catatan.toLowerCase().includes(q))
    const matchStatus = filter === 'all' ? true : s.status === filter
    return matchSearch && matchStatus
  })

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 ml-0 w-full min-w-0 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-widest mb-1">
              <Scale size={14} /> Transaksi Masuk
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Transaksi Pembelian (Setoran Nasabah)
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Kelola pencatatan pembelian sampah dari nasabah, verifikasi timbangan, dan cetak nota kasir.
            </p>
          </div>
          <Link
            href="/admin/setoran/baru"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-emerald-900/20"
          >
            <Plus size={16} /> Input Pembelian Baru
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nomor nota, nama nasabah, atau catatan..."
              className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'diverifikasi', label: 'Diverifikasi' },
              { id: 'pending', label: 'Pending' },
              { id: 'ditolak', label: 'Ditolak' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setFilter(st.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  filter === st.id
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[750px]">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4">No. Transaksi</th>
                  <th className="px-6 py-4">Nama Nasabah</th>
                  <th className="px-6 py-4">Tanggal Setor</th>
                  <th className="px-6 py-4">Rincian Komoditas</th>
                  <th className="px-6 py-4 text-right">Total Nilai (Rp)</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Aksi & Nota</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-slate-400">
                      Tidak ada transaksi pembelian yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-xs text-emerald-800">
                        <span className="bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                          {s.nomor_setoran}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{s.nama_nasabah}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {s.nomor_nasabah || 'NSB-001'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                        {formatDate(s.tanggal_setoran)}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-700 max-w-xs">
                        <span className="line-clamp-1">{s.catatan || 'Komoditas anorganik'}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-black text-slate-900">
                        {formatRupiah(s.total_nilai)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            STATUS_COLORS[s.status] || 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {STATUS_LABELS[s.status] || s.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openNota(s)}
                            title="Cetak Nota Pembelian"
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-all border border-emerald-200 shadow-sm"
                          >
                            <Printer size={13} />
                            <span>Cetak Nota</span>
                          </button>
                          {s.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatus(s.id, 'diverifikasi')}
                                disabled={processing === s.id}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                                title="Verifikasi"
                              >
                                <CheckCircle size={16} />
                              </button>
                              <button
                                onClick={() => handleStatus(s.id, 'ditolak')}
                                disabled={processing === s.id}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                title="Tolak"
                              >
                                <XCircle size={16} />
                              </button>
                            </>
                          )}
                          {s.status !== 'dibatalkan' && (
                            <button
                              onClick={() => handleDeleteSetoran(s.id, s.nomor_setoran || s.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                              title="Batalkan / Void Transaksi"
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

        {/* Modal Nota Transaksi */}
        <NotaTransaksiModal
          isOpen={isNotaOpen}
          data={notaData}
          onClose={() => setIsNotaOpen(false)}
        />
      </main>
    </div>
  )
}
