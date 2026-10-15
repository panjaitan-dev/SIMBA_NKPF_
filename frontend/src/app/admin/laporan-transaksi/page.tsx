'use client'

import { useState } from 'react'
import {
  Calendar,
  Filter,
  Printer,
  FileSpreadsheet,
  Leaf,
  Scale,
  TrendingUp,
  ReceiptText,
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react'
import AdminSidebar from '@/components/layout/AdminSidebar'
import { DEFAULT_SETORAN, DEFAULT_PENJUALAN } from '@/lib/constants'
import { formatRupiah, formatDate } from '@/lib/utils'
import { exportToCSV } from '@/lib/exportUtils'
import toast from 'react-hot-toast'

export default function AdminLaporanTransaksiPage() {
  const [startDate, setStartDate] = useState('2026-10-01')
  const [endDate, setEndDate] = useState('2026-10-07')
  const [jenisTransaksi, setJenisTransaksi] = useState('semua') // semua, beli, jual

  // Format combined transaction dataset
  const combinedTransactions = [
    ...DEFAULT_SETORAN.map((s) => ({
      id: s.id,
      tipe: 'beli' as const,
      no_faktur: s.nomor_setoran,
      tanggal: s.tanggal_setoran,
      nama_pihak: s.nama_nasabah,
      identitas: s.nomor_nasabah,
      berat_kg: s.items ? s.items.reduce((acc: number, it: any) => acc + (it.berat_kg || 0), 0) : 10,
      nominal: s.total_nilai,
      status: s.status === 'diverifikasi' ? 'Selesai' : 'Pending',
      keterangan: s.catatan || 'Setoran sampah nasabah',
    })),
    ...DEFAULT_PENJUALAN.map((pj) => ({
      id: pj.id,
      tipe: 'jual' as const,
      no_faktur: pj.nomor_faktur,
      tanggal: pj.tanggal_penjualan,
      nama_pihak: pj.nama_client,
      identitas: pj.kode_client,
      berat_kg: pj.total_berat_kg,
      nominal: pj.total_nominal,
      status: pj.status_pembayaran,
      keterangan: `Offtaker: ${pj.nama_client} (Truk: ${pj.nomor_truk})`,
    })),
  ].sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())

  // Filter based on dates and type
  const filteredTransactions = combinedTransactions.filter((tr) => {
    const trDate = tr.tanggal
    const matchDate = (!startDate || trDate >= startDate) && (!endDate || trDate <= endDate)
    const matchType =
      jenisTransaksi === 'semua'
        ? true
        : jenisTransaksi === 'beli'
        ? tr.tipe === 'beli'
        : tr.tipe === 'jual'
    return matchDate && matchType
  })

  // Summary Metrics
  const totalBeli = filteredTransactions
    .filter((t) => t.tipe === 'beli')
    .reduce((acc, t) => acc + t.nominal, 0)

  const totalJual = filteredTransactions
    .filter((t) => t.tipe === 'jual')
    .reduce((acc, t) => acc + t.nominal, 0)

  const marginLaba = totalJual - totalBeli

  const totalTonaseBeli = filteredTransactions
    .filter((t) => t.tipe === 'beli')
    .reduce((acc, t) => acc + t.berat_kg, 0)

  const totalTonaseJual = filteredTransactions
    .filter((t) => t.tipe === 'jual')
    .reduce((acc, t) => acc + t.berat_kg, 0)

  const handlePrint = () => {
    window.print()
  }

  const handleExportExcel = () => {
    if (!filteredTransactions.length) {
      toast.error('Tidak ada data transaksi pada periode yang dipilih')
      return
    }
    const headers = ['No', 'Tipe Transaksi', 'Nomor Transaksi', 'Tanggal', 'Pihak Terkait', 'Berat (kg)', 'Total Nilai (Rp)', 'Status']
    const rows = filteredTransactions.map((t, idx) => [
      idx + 1,
      t.tipe === 'beli' ? 'Pembelian (Setoran)' : 'Penjualan (Offtaker)',
      t.no_faktur,
      t.tanggal,
      t.nama_pihak,
      t.berat_kg,
      t.nominal,
      t.status,
    ])
    exportToCSV(`SIMBA_Laporan_Transaksi_${startDate}_sd_${endDate}`, headers, rows)
    toast.success('Laporan transaksi berhasil diunduh ke Excel / CSV')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 ml-0 w-full min-w-0 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        {/* Screen Header (Hidden during print) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 print:hidden">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-widest mb-1">
              <ReceiptText size={14} /> Modul Audit & Pelaporan
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Laporan Transaksi Jual Beli Sampah
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Filter transaksi berdasarkan rentang tanggal, evaluasi perputaran dana, tonase komoditas, dan cetak laporan resmi.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold px-5 py-3 rounded-2xl text-xs transition-all shadow-sm"
            >
              <FileSpreadsheet size={16} className="text-emerald-600" /> Unduh Excel (CSV)
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl text-xs transition-all shadow-md shadow-emerald-900/20"
            >
              <Printer size={16} /> Cetak Laporan (Printer / PDF)
            </button>
          </div>
        </div>

        {/* Date Filter Bar (Hidden during print) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-8 print:hidden">
          <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Filter size={14} /> Filter Periode & Jenis Transaksi
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tanggal Mulai
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tanggal Selesai
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Jenis Transaksi
              </label>
              <select
                value={jenisTransaksi}
                onChange={(e) => setJenisTransaksi(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none bg-white"
              >
                <option value="semua">Semua Transaksi (Jual & Beli)</option>
                <option value="beli">Hanya Pembelian (Setoran Masuk)</option>
                <option value="jual">Hanya Penjualan (Offtaker Keluar)</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setStartDate('2026-10-01')
                  setEndDate('2026-10-07')
                  setJenisTransaksi('semua')
                }}
                className="w-full py-2.5 px-4 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>

        {/* Printable Report Container */}
        <div id="printable-report" className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-10">
          {/* Official Document Header */}
          <div className="border-b-2 border-slate-900 pb-6 mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-700 text-white rounded-2xl flex items-center justify-center shadow-md">
                <Leaf size={30} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                  SISTEM INFORMASI BANK SAMPAH INDONESIA (SIMBA)
                </h2>
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  LAPORAN REKAPITULASI TRANSAKSI JUAL BELI & EKONOMI SIRKULAR
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Sekretariat Nasional Pengelolaan Bank Sampah Terpadu
                </p>
              </div>
            </div>

            <div className="text-right border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Periode Laporan
              </p>
              <p className="text-xs font-extrabold text-slate-800 mt-0.5">
                {formatDate(startDate)} s/d {formatDate(endDate)}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Dicetak pada: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
              </p>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase mb-1">
                <ArrowDownLeft size={16} /> Total Pembelian (Beli)
              </div>
              <p className="text-lg font-black text-emerald-950 font-mono">
                {formatRupiah(totalBeli)}
              </p>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">
                Tonase: {totalTonaseBeli.toFixed(2)} kg
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <div className="flex items-center gap-2 text-blue-800 text-xs font-bold uppercase mb-1">
                <ArrowUpRight size={16} /> Total Penjualan (Jual)
              </div>
              <p className="text-lg font-black text-blue-950 font-mono">
                {formatRupiah(totalJual)}
              </p>
              <p className="text-[11px] text-blue-700 font-medium mt-1">
                Tonase: {totalTonaseJual.toFixed(2)} kg
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
              <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase mb-1">
                <TrendingUp size={16} /> Selisih Margin Bersih
              </div>
              <p className="text-lg font-black text-amber-950 font-mono">
                {formatRupiah(marginLaba)}
              </p>
              <p className="text-[11px] text-amber-700 font-medium mt-1">
                Laba kotor operasional bank
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200">
              <div className="flex items-center gap-2 text-slate-700 text-xs font-bold uppercase mb-1">
                <ReceiptText size={16} /> Total Volume Transaksi
              </div>
              <p className="text-lg font-black text-slate-900 font-mono">
                {filteredTransactions.length} Kali
              </p>
              <p className="text-[11px] text-slate-600 font-medium mt-1">
                Periode terpilih
              </p>
            </div>
          </div>

          {/* Rekap Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden mb-8 shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left min-w-[750px]">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase">
                <tr>
                  <th className="py-3 px-3 w-8">#</th>
                  <th className="py-3 px-3">Tanggal</th>
                  <th className="py-3 px-3">No. Transaksi</th>
                  <th className="py-3 px-3">Tipe</th>
                  <th className="py-3 px-3">Nama Pihak (Nasabah / Client)</th>
                  <th className="py-3 px-3 text-right">Berat (Kg)</th>
                  <th className="py-3 px-3 text-right">Nominal (Rp)</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-slate-400">
                      Tidak ada transaksi pada rentang tanggal terpilih.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tr, index) => {
                    const isBeli = tr.tipe === 'beli'
                    return (
                      <tr key={tr.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-mono text-slate-400">{index + 1}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-700">
                          {formatDate(tr.tanggal)}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                          {tr.no_faktur}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                              isBeli
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {isBeli ? 'Beli (Masuk)' : 'Jual (Keluar)'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900">{tr.nama_pihak}</div>
                          <div className="text-[10px] text-slate-400">{tr.keterangan}</div>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold">
                          {Number(tr.berat_kg).toFixed(2)} kg
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          {formatRupiah(tr.nominal)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="text-[10px] font-bold text-slate-600">
                            {tr.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
              <tfoot className="bg-slate-50 border-t-2 border-slate-300 font-bold">
                <tr>
                  <td colSpan={5} className="py-3 px-3 uppercase text-slate-700">
                    Total Rekapitulasi Periode Terpilih
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-900">
                    {(totalTonaseBeli + totalTonaseJual).toFixed(2)} kg
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-900 text-sm font-black">
                    {formatRupiah(totalBeli + totalJual)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
            </div>
          </div>

          {/* Signatures for Official Audit Report */}
          <div className="grid grid-cols-2 gap-12 text-xs pt-8 border-t border-slate-200 text-center">
            <div>
              <p className="text-slate-500 mb-1">Dibuat oleh,</p>
              <p className="font-bold text-slate-800 mb-14">Petugas / Teller Kasir</p>
              <p className="font-bold text-slate-900 underline">( Staff Administrasi SIMBA )</p>
              <p className="text-[10px] text-slate-400">NIP / ID: 2026.ADM.011</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Mengetahui & Menyetujui,</p>
              <p className="font-bold text-slate-800 mb-14">Koordinator Bank Sampah Indonesia</p>
              <p className="font-bold text-slate-900 underline">( Direktur Operasional )</p>
              <p className="text-[10px] text-slate-400">Sistem Informasi Bank Sampah Indonesia</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
