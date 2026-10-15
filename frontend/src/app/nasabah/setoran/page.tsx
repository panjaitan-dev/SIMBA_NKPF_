'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Recycle, Search, Filter, Eye, Loader2, Calendar, FileText } from 'lucide-react'
import NasabahSidebar from '@/components/layout/NasabahSidebar'
import api from '@/lib/api'
import { formatRupiah, formatWeight, formatDate, STATUS_COLORS, STATUS_LABELS } from '@/lib/utils'
import { DEFAULT_SETORAN } from '@/lib/constants'
import NotaTransaksiModal, { NotaData } from '@/components/NotaTransaksiModal'
import toast from 'react-hot-toast'

export default function RiwayatSetoranNasabahPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedNota, setSelectedNota] = useState<NotaData | null>(null)
  const [isNotaOpen, setIsNotaOpen] = useState(false)

  const fetchSetoran = async () => {
    setLoading(true)
    try {
      const res = await api.get('/setoran/my')
      if (res.data?.data?.length) {
        setData(res.data.data)
      } else {
        setData(DEFAULT_SETORAN)
      }
    } catch {
      setData(DEFAULT_SETORAN)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSetoran()
  }, [])

  const filteredData = data.filter((item) => {
    const matchSearch =
      item.nomor_setoran?.toLowerCase().includes(search.toLowerCase()) ||
      item.catatan?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || item.status === statusFilter
    return matchSearch && matchStatus
  })

  const openNota = (item: any) => {
    setSelectedNota({
      tipe: 'pembelian',
      nomor_transaksi: item.nomor_setoran,
      tanggal: item.tanggal_setoran || new Date().toISOString(),
      nama_pihak: item.nama_nasabah || 'Nasabah SIMBA',
      identitas_pihak: item.nomor_nasabah || 'NSB-001',
      unit_nama: item.unit_nama || 'Bank Sampah Unit Pusat',
      items: item.details || [
        {
          nama: 'Setoran Campuran Terpilah',
          berat_kg: item.total_berat_kg || 10,
          harga_satuan: item.total_nilai ? Math.round(item.total_nilai / (item.total_berat_kg || 10)) : 3500,
          subtotal: item.total_nilai || 35000,
        },
      ],
      total_nilai: item.total_nilai || 0,
      total_berat_kg: item.total_berat_kg || 0,
      metode_pembayaran: item.metode_pembayaran || 'Saldo Tabungan',
      catatan: item.catatan || 'Setoran nasabah mandiri',
    })
    setIsNotaOpen(true)
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <NasabahSidebar />

      <main className="flex-1 lg:ml-64 ml-0 w-full min-w-0 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/nasabah" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 mb-2">
              <ArrowLeft size={14} /> Kembali ke Dashboard
            </Link>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Recycle className="text-emerald-600" size={26} /> Riwayat Setoran Sampah
            </h1>
            <p className="text-slate-500 text-sm mt-1">Daftar penimbangan komoditas daur ulang dan konversi saldo tabungan Anda</p>
          </div>
          <button
            onClick={fetchSetoran}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors"
          >
            Muat Ulang
          </button>
        </div>

        {/* Filter Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nomor setoran..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter size={16} className="text-slate-400 shrink-0" />
            <span className="text-xs font-bold text-slate-600 uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white outline-none focus:border-emerald-500"
            >
              <option value="all">Semua Status</option>
              <option value="diverifikasi">Diverifikasi (Masuk Saldo)</option>
              <option value="pending">Menunggu Verifikasi</option>
              <option value="ditolak">Ditolak</option>
              <option value="dibatalkan">Dibatalkan</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-24 text-slate-400 gap-3">
              <Loader2 size={24} className="animate-spin text-emerald-600" />
              <span>Memuat data transaksi...</span>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <Recycle size={42} className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-slate-600">Tidak ada riwayat setoran</p>
              <p className="text-xs text-slate-400 mt-1">Setoran sampah Anda akan tampil di tabel ini setelah disetor ke unit bank sampah.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[650px]">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="px-6 py-4">No. Transaksi</th>
                    <th className="px-6 py-4">Tanggal Setoran</th>
                    <th className="px-6 py-4 text-right">Total Berat</th>
                    <th className="px-6 py-4 text-right">Nilai Rupiah</th>
                    <th className="px-6 py-4">Metode</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center">Nota</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-xs text-emerald-800">
                        <span className="bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                          {item.nomor_setoran}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar size={13} className="text-slate-400" />
                          <span>{formatDate(item.tanggal_setoran)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-slate-800">
                        {formatWeight(item.total_berat_kg || 0)}
                      </td>
                      <td className="px-6 py-4 text-right font-extrabold text-emerald-700">
                        {formatRupiah(item.total_nilai || 0)}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {item.metode_pembayaran || 'Saldo Tabungan'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[item.status] || 'bg-slate-100 text-slate-600'}`}>
                          {STATUS_LABELS[item.status] || item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => openNota(item)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-xs font-semibold text-slate-600 transition-colors"
                          title="Lihat Struk Penimbangan"
                        >
                          <FileText size={13} /> Struk
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal Struk Transaksi */}
      {selectedNota && (
        <NotaTransaksiModal
          isOpen={isNotaOpen}
          onClose={() => setIsNotaOpen(false)}
          data={selectedNota}
        />
      )}
    </div>
  )
}
