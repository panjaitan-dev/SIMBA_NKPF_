'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ShoppingCart,
  Plus,
  Printer,
  Search,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Ban,
  CheckCircle,
} from 'lucide-react'
import AdminSidebar from '@/components/layout/AdminSidebar'
import NotaTransaksiModal, { NotaData } from '@/components/NotaTransaksiModal'
import api from '@/lib/api'
import { formatRupiah, formatDate } from '@/lib/utils'
import { DEFAULT_PENJUALAN } from '@/lib/constants'
import toast from 'react-hot-toast'

export default function AdminPenjualanPage() {
  const [data, setData] = useState<any[]>(DEFAULT_PENJUALAN)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Nota modal state
  const [notaData, setNotaData] = useState<NotaData | null>(null)
  const [isNotaOpen, setIsNotaOpen] = useState(false)

  const fetchPenjualan = async () => {
    try {
      const res = await api.get('/penjualan')
      if (res.data?.data && res.data.data.length > 0) {
        setData(res.data.data)
      }
    } catch {
      // keep default mock
    }
  }

  useEffect(() => {
    fetchPenjualan()
  }, [])

  const openFaktur = (pj: any) => {
    const prepared: NotaData = {
      tipe: 'penjualan',
      nomor_transaksi: pj.nomor_faktur,
      tanggal: pj.tanggal_penjualan || new Date().toISOString(),
      nama_pihak: pj.nama_client,
      identitas_pihak: pj.kode_client,
      nama_petugas: 'Kasir Logistik Pusat',
      unit_nama: 'Bank Sampah Induk Nasional',
      metode_pembayaran: pj.status_pembayaran,
      items: pj.items || [
        {
          nama: 'Penyaluran Komoditas Daur Ulang',
          kode: 'KMD-OUT',
          berat_kg: pj.total_berat_kg,
          harga_satuan: Math.round(pj.total_nominal / (pj.total_berat_kg || 1)),
          subtotal: pj.total_nominal,
        },
      ],
      total_nilai: pj.total_nominal,
      catatan: `Armada Truk Pengangkut: ${pj.nomor_truk || '-'}`,
    }
    setNotaData(prepared)
    setIsNotaOpen(true)
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/penjualan/${id}`, { status_pembayaran: newStatus }).catch(() => {})
      setData((prev) =>
        prev.map((it) => (it.id === id ? { ...it, status_pembayaran: newStatus } : it))
      )
      toast.success(`Status pembayaran diperbarui ke ${newStatus}`)
    } catch {
      toast.error('Gagal memperbarui status')
    }
  }

  const handleVoidPenjualan = async (id: string, nomorFaktur: string) => {
    if (!confirm(`Batalkan / Void transaksi penjualan faktur ${nomorFaktur}?`)) return
    try {
      await api.delete(`/penjualan/${id}`).catch(() => {})
      setData((prev) =>
        prev.map((it) => (it.id === id ? { ...it, status_pembayaran: 'dibatalkan' } : it))
      )
      toast.success(`Faktur ${nomorFaktur} berhasil dibatalkan (void)`)
    } catch {
      toast.error('Gagal membatalkan transaksi')
    }
  }

  const filtered = data.filter((d) => {
    const q = search.toLowerCase()
    const matchSearch =
      d.nomor_faktur.toLowerCase().includes(q) ||
      d.nama_client.toLowerCase().includes(q) ||
      d.kode_client.toLowerCase().includes(q)
    const matchStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'lunas'
        ? d.status_pembayaran.toLowerCase().includes('lunas')
        : !d.status_pembayaran.toLowerCase().includes('lunas')
    return matchSearch && matchStatus
  })

  const totalPendapatan = data.reduce((acc, it) => acc + (it.total_nominal || 0), 0)
  const totalTonase = data.reduce((acc, it) => acc + (it.total_berat_kg || 0), 0)

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 ml-0 w-full min-w-0 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-widest mb-1">
              <ShoppingCart size={14} /> Transaksi Keluar
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Transaksi Penjualan (Penyaluran ke Pembeli)
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Pencatatan faktur komoditas sampah yang disalurkan ke mitra pabrik/offtaker, monitoring omset, dan cetak faktur PDF.
            </p>
          </div>
          <Link
            href="/admin/penjualan/baru"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-blue-900/20"
          >
            <Plus size={16} /> Input Penjualan Baru
          </Link>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Total Pendapatan Penjualan</p>
            <p className="text-2xl font-black text-blue-700 mt-1 font-mono">
              {formatRupiah(totalPendapatan)}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">{data.length} transaksi penjualan tercatat</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Total Tonase Terjual</p>
            <p className="text-2xl font-black text-slate-900 mt-1 font-mono">
              {totalTonase.toFixed(2)} kg
            </p>
            <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
              Tersalurkan ke industri daur ulang
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Status Pembayaran</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg">
                3 Lunas
              </span>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg">
                1 Tempo
              </span>
            </div>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nomor faktur atau nama pembeli..."
              className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'Semua Status' },
              { id: 'lunas', label: 'Lunas' },
              { id: 'tempo', label: 'Tempo' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setFilterStatus(st.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  filterStatus === st.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
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
                  <th className="px-6 py-4">No. Faktur</th>
                  <th className="px-6 py-4">Client / Pembeli</th>
                  <th className="px-6 py-4">Tanggal Penjualan</th>
                  <th className="px-6 py-4 text-right">Berat Terkirim</th>
                  <th className="px-6 py-4 text-right">Nilai Penjualan (Rp)</th>
                  <th className="px-6 py-4 text-center">Status Pembayaran</th>
                  <th className="px-6 py-4 text-center">Aksi & Faktur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-slate-400">
                      Tidak ada transaksi penjualan ditemukan.
                    </td>
                  </tr>
                ) : (
                  filtered.map((pj) => (
                    <tr key={pj.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-xs text-blue-700">
                        <span className="bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
                          {pj.nomor_faktur}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{pj.nama_client}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {pj.kode_client} • Truk: {pj.nomor_truk}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                        {formatDate(pj.tanggal_penjualan)}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-slate-800">
                        {Number(pj.total_berat_kg).toFixed(2)} kg
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-black text-blue-800">
                        {formatRupiah(pj.total_nominal)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                            pj.status_pembayaran.toLowerCase().includes('lunas')
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {pj.status_pembayaran.toLowerCase().includes('lunas') ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <Clock size={12} />
                          )}
                          {pj.status_pembayaran}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openFaktur(pj)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl text-xs font-bold transition-all border border-blue-200 shadow-sm"
                            title="Cetak Faktur Penjualan"
                          >
                            <Printer size={13} />
                            <span>Faktur</span>
                          </button>
                          {!pj.status_pembayaran.toLowerCase().includes('lunas') && pj.status_pembayaran !== 'dibatalkan' && (
                            <button
                              onClick={() => handleUpdateStatus(pj.id, 'lunas')}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                              title="Tandai Sudah Lunas"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          {pj.status_pembayaran !== 'dibatalkan' && (
                            <button
                              onClick={() => handleVoidPenjualan(pj.id, pj.nomor_faktur)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                              title="Batalkan / Void Faktur"
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

        {/* Modal Nota / Faktur */}
        <NotaTransaksiModal
          isOpen={isNotaOpen}
          data={notaData}
          onClose={() => setIsNotaOpen(false)}
        />
      </main>
    </div>
  )
}
