'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Users,
  Building2,
  Recycle,
  ShoppingCart,
  TrendingUp,
  Scale,
  Printer,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Zap,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import AdminSidebar from '@/components/layout/AdminSidebar'
import NotaTransaksiModal, { NotaData } from '@/components/NotaTransaksiModal'
import { DEFAULT_JENIS_SAMPAH, DEFAULT_CLIENTS, DEFAULT_NASABAH, DEFAULT_SETORAN, DEFAULT_PENJUALAN } from '@/lib/constants'
import api from '@/lib/api'
import { formatRupiah, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Quick POS states
  const [activeTab, setActiveTab] = useState<'beli' | 'jual'>('beli')
  
  // Quick Beli Form
  const [qbNasabahId, setQbNasabahId] = useState(DEFAULT_NASABAH[0].id)
  const [qbJenisId, setQbJenisId] = useState(DEFAULT_JENIS_SAMPAH[0].id)
  const [qbBerat, setQbBerat] = useState('2.5')

  // Quick Jual Form
  const [qjClientId, setQjClientId] = useState(DEFAULT_CLIENTS[0].id)
  const [qjJenisId, setQjJenisId] = useState(DEFAULT_JENIS_SAMPAH[1].id)
  const [qjBerat, setQjBerat] = useState('20')

  // Nota state
  const [notaData, setNotaData] = useState<NotaData | null>(null)
  const [isNotaOpen, setIsNotaOpen] = useState(false)

  // Local activity list
  const [recentTransactions, setRecentTransactions] = useState<any[]>([
    ...DEFAULT_SETORAN.slice(0, 2).map((s) => ({
      id: s.id,
      tipe: 'beli' as const,
      no_faktur: s.nomor_setoran,
      nama: s.nama_nasabah,
      identitas: s.nomor_nasabah,
      tanggal: s.tanggal_setoran,
      nominal: s.total_nilai,
      status: s.status,
      items: s.items,
    })),
    ...DEFAULT_PENJUALAN.slice(0, 2).map((p) => ({
      id: p.id,
      tipe: 'jual' as const,
      no_faktur: p.nomor_faktur,
      nama: p.nama_client,
      identitas: p.kode_client,
      tanggal: p.tanggal_penjualan,
      nominal: p.total_nominal,
      status: p.status_pembayaran,
      items: p.items,
    })),
  ])

  useEffect(() => {
    api.get('/dashboard/admin')
      .then((r) => setStats(r.data.data))
      .catch(() => {})
  }, [])

  // Calculation for Quick Beli
  const currentQbJenis = DEFAULT_JENIS_SAMPAH.find((j) => j.id === qbJenisId) || DEFAULT_JENIS_SAMPAH[0]
  const qbSubtotal = (parseFloat(qbBerat) || 0) * (currentQbJenis.harga_beli || 0)

  // Calculation for Quick Jual
  const currentQjJenis = DEFAULT_JENIS_SAMPAH.find((j) => j.id === qjJenisId) || DEFAULT_JENIS_SAMPAH[1]
  const qjSubtotal = (parseFloat(qjBerat) || 0) * (currentQjJenis.harga_jual || 0)

  // Handle Quick Beli Submit
  const handleQuickBeli = (andPrint = true) => {
    const qty = parseFloat(qbBerat)
    if (!qty || qty <= 0) {
      toast.error('Masukkan berat sampah yang valid')
      return
    }

    const nasabah = DEFAULT_NASABAH.find((n) => n.id === qbNasabahId) || DEFAULT_NASABAH[0]
    const noTransaksi = `NOT-BELI-${Date.now().toString().slice(-6)}`

    const newTx = {
      id: `tx-${Date.now()}`,
      tipe: 'beli' as const,
      no_faktur: noTransaksi,
      nama: nasabah.nama_lengkap,
      identitas: nasabah.nomor_nasabah,
      tanggal: new Date().toISOString(),
      nominal: qbSubtotal,
      status: 'diverifikasi',
      items: [
        {
          nama: currentQbJenis.nama,
          kode: currentQbJenis.kode,
          berat_kg: qty,
          harga_satuan: currentQbJenis.harga_beli,
          subtotal: qbSubtotal,
        },
      ],
    }

    setRecentTransactions((prev) => [newTx, ...prev])
    toast.success(`Pembelian dari ${nasabah.nama_lengkap} berhasil disimpan!`)

    if (andPrint) {
      setNotaData({
        tipe: 'pembelian',
        nomor_transaksi: noTransaksi,
        tanggal: new Date().toISOString(),
        nama_pihak: nasabah.nama_lengkap,
        identitas_pihak: nasabah.nomor_nasabah,
        nomor_hp: nasabah.nomor_hp,
        alamat_pihak: nasabah.alamat,
        nama_petugas: 'Kasir Dashboard Utama',
        unit_nama: 'Bank Sampah Unit Pusat',
        items: newTx.items,
        total_nilai: qbSubtotal,
      })
      setIsNotaOpen(true)
    }
  }

  // Handle Quick Jual Submit
  const handleQuickJual = (andPrint = true) => {
    const qty = parseFloat(qjBerat)
    if (!qty || qty <= 0) {
      toast.error('Masukkan berat penjualan yang valid')
      return
    }

    const client = DEFAULT_CLIENTS.find((c) => c.id === qjClientId) || DEFAULT_CLIENTS[0]
    const noFaktur = `FAK-JUAL-${Date.now().toString().slice(-6)}`

    const newTx = {
      id: `tx-${Date.now()}`,
      tipe: 'jual' as const,
      no_faktur: noFaktur,
      nama: client.nama_client,
      identitas: client.kode_client,
      tanggal: new Date().toISOString(),
      nominal: qjSubtotal,
      status: 'Lunas / Transfer',
      items: [
        {
          nama: currentQjJenis.nama,
          kode: currentQjJenis.kode,
          berat_kg: qty,
          harga_satuan: currentQjJenis.harga_jual,
          subtotal: qjSubtotal,
        },
      ],
    }

    setRecentTransactions((prev) => [newTx, ...prev])
    toast.success(`Penjualan ke ${client.nama_client} berhasil dibukukan!`)

    if (andPrint) {
      setNotaData({
        tipe: 'penjualan',
        nomor_transaksi: noFaktur,
        tanggal: new Date().toISOString(),
        nama_pihak: client.nama_client,
        identitas_pihak: client.kode_client,
        nomor_hp: client.nomor_hp,
        alamat_pihak: client.alamat,
        nama_petugas: 'Kasir Dashboard Utama',
        unit_nama: 'Bank Sampah Induk Nasional',
        items: newTx.items,
        total_nilai: qjSubtotal,
      })
      setIsNotaOpen(true)
    }
  }

  // Aggregate stats
  const totalNominalBeli = DEFAULT_SETORAN.reduce((acc, it) => acc + it.total_nilai, 0)
  const totalNominalJual = DEFAULT_PENJUALAN.reduce((acc, it) => acc + it.total_nominal, 0)
  const totalMargin = totalNominalJual - totalNominalBeli

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 ml-0 w-full min-w-0 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-widest mb-1">
              <Sparkles size={14} /> Pusat Kendali Eksekutif
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Dashboard Operasional Bank Sampah
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Sistem Informasi Bank Sampah Indonesia — Ringkasan statistik transaksi pembelian, penjualan, dan loket kasir cepat.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/laporan-transaksi"
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-sm"
            >
              Rekap Laporan
            </Link>
            <Link
              href="/admin/setoran/baru"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/20"
            >
              <Plus size={15} /> Transaksi Baru
            </Link>
          </div>
        </div>

        {/* 1. Ringkasan Statistik Utama (KPI Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Card 1: Pembelian (Setoran Masuk) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl">
                <ArrowDownLeft size={20} />
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {DEFAULT_SETORAN.length} Transaksi
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Pembelian (Nasabah)
            </p>
            <p className="text-xl font-black text-slate-900 font-mono mt-1">
              {formatRupiah(totalNominalBeli)}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Dari <strong>{DEFAULT_NASABAH.length}</strong> nasabah aktif terdaftar
            </p>
          </div>

          {/* Card 2: Penjualan (Penyaluran Keluar) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 bg-blue-50 text-blue-700 rounded-2xl">
                <ArrowUpRight size={20} />
              </span>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                {DEFAULT_PENJUALAN.length} Penjualan
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Penjualan (Offtaker)
            </p>
            <p className="text-xl font-black text-blue-800 font-mono mt-1">
              {formatRupiah(totalNominalJual)}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Diserap oleh <strong>{DEFAULT_CLIENTS.length}</strong> mitra pabrik/klien
            </p>
          </div>

          {/* Card 3: Margin Operasional */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-amber-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 bg-amber-50 text-amber-700 rounded-2xl">
                <TrendingUp size={20} />
              </span>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
                Margin Laba
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Estimasi Surplus Bersih
            </p>
            <p className="text-xl font-black text-amber-900 font-mono mt-1">
              {formatRupiah(totalMargin)}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Selisih nilai penjualan vs pembelian
            </p>
          </div>

          {/* Card 4: Tonase Sampah */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-teal-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 bg-teal-50 text-teal-700 rounded-2xl">
                <Scale size={20} />
              </span>
              <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full">
                Ekonomi Sirkular
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Sampah Terkelola
            </p>
            <p className="text-xl font-black text-teal-900 font-mono mt-1">
              1,455.50 kg
            </p>
            <p className="text-[11px] text-teal-700 font-medium mt-1">
              Tereduksi dari timbulan TPA
            </p>
          </div>
        </div>

        {/* 2. FORM TRANSAKSI CEPAT (QUICK POS WIDGET) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                <Zap size={15} /> Kasir Cepat (Direct POS)
              </div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Form Transaksi Cepat Jual Beli
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Lakukan pencatatan transaksi masuk atau keluar instan langsung dari halaman depan tanpa berpindah menu.
              </p>
            </div>

            {/* Tab Selector */}
            <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
              <button
                onClick={() => setActiveTab('beli')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === 'beli'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowDownLeft size={14} /> Pembelian Cepat (Nasabah)
              </button>
              <button
                onClick={() => setActiveTab('jual')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === 'jual'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowUpRight size={14} /> Penjualan Cepat (Offtaker)
              </button>
            </div>
          </div>

          {/* Tab 1: Pembelian Cepat (Nasabah Menyetor) */}
          {activeTab === 'beli' && (
            <div className="animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Pilih Nasabah Penyetor
                  </label>
                  <select
                    value={qbNasabahId}
                    onChange={(e) => setQbNasabahId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 outline-none bg-white focus:border-emerald-500"
                  >
                    {DEFAULT_NASABAH.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.nomor_nasabah} — {n.nama_lengkap}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Komoditas Sampah Masuk
                  </label>
                  <select
                    value={qbJenisId}
                    onChange={(e) => setQbJenisId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 outline-none bg-white focus:border-emerald-500"
                  >
                    {DEFAULT_JENIS_SAMPAH.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.nama} ({formatRupiah(j.harga_beli)}/kg)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Berat Timbangan (Kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={qbBerat}
                    onChange={(e) => setQbBerat(e.target.value)}
                    placeholder="Contoh: 3.5"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <button
                    onClick={() => handleQuickBeli(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-900/20"
                  >
                    <Printer size={15} /> Simpan & Cetak Nota
                  </button>
                </div>
              </div>

              {/* Real-time Calculation Preview */}
              <div className="mt-4 p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-emerald-900">Perhitungan Cepat:</span>
                  <span className="font-mono text-slate-700">
                    {qbBerat || 0} kg $\times$ {formatRupiah(currentQbJenis.harga_beli)}/kg
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Total Dibayarkan ke Saldo Nasabah:</span>
                  <span className="text-base font-black font-mono text-emerald-800">
                    {formatRupiah(qbSubtotal)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Penjualan Cepat (Penyaluran ke Offtaker) */}
          {activeTab === 'jual' && (
            <div className="animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Pilih Client / Pembeli Industri
                  </label>
                  <select
                    value={qjClientId}
                    onChange={(e) => setQjClientId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 outline-none bg-white focus:border-blue-500"
                  >
                    {DEFAULT_CLIENTS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.kode_client} — {c.nama_client}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Komoditas yang Dijual
                  </label>
                  <select
                    value={qjJenisId}
                    onChange={(e) => setQjJenisId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 outline-none bg-white focus:border-blue-500"
                  >
                    {DEFAULT_JENIS_SAMPAH.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.nama} (Jual: {formatRupiah(j.harga_jual)}/kg)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Kuantitas Muatan (Kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={qjBerat}
                    onChange={(e) => setQjBerat(e.target.value)}
                    placeholder="Contoh: 50"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <button
                    onClick={() => handleQuickJual(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-900/20"
                  >
                    <Printer size={15} /> Simpan & Cetak Faktur
                  </button>
                </div>
              </div>

              {/* Real-time Calculation Preview */}
              <div className="mt-4 p-4 bg-blue-50/60 border border-blue-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-blue-900">Perhitungan Penjualan:</span>
                  <span className="font-mono text-slate-700">
                    {qjBerat || 0} kg $\times$ {formatRupiah(currentQjJenis.harga_jual)}/kg
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Pendapatan Bank Sampah:</span>
                  <span className="text-base font-black font-mono text-blue-800">
                    {formatRupiah(qjSubtotal)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Tabel Transaksi Terbaru dengan Tombol Cetak Nota */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Aktivitas Transaksi Jual Beli Terkini
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Riwayat mutasi transaksi masuk (pembelian nasabah) dan keluar (penjualan offtaker).
              </p>
            </div>
            <Link
              href="/admin/laporan-transaksi"
              className="text-xs font-bold text-emerald-800 hover:underline"
            >
              Lihat Semua Laporan $\rightarrow$
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[650px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
                <tr>
                  <th className="py-3 px-3">No. Dokumen</th>
                  <th className="py-3 px-3">Tipe</th>
                  <th className="py-3 px-3">Pihak Terkait</th>
                  <th className="py-3 px-3">Waktu</th>
                  <th className="py-3 px-3 text-right">Nominal Transaksi</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-center">Aksi Nota</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTransactions.map((tx) => {
                  const isBeli = tx.tipe === 'beli'
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {tx.no_faktur}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            isBeli
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {isBeli ? 'Beli (Setoran)' : 'Jual (Offtaker)'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-800">{tx.nama}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{tx.identitas}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {formatDate(tx.tanggal)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        {formatRupiah(tx.nominal)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => {
                            setNotaData({
                              tipe: tx.tipe,
                              nomor_transaksi: tx.no_faktur,
                              tanggal: tx.tanggal,
                              nama_pihak: tx.nama,
                              identitas_pihak: tx.identitas,
                              nama_petugas: 'Kasir Operasional',
                              unit_nama: 'Bank Sampah Unit Pusat',
                              items: tx.items || [
                                {
                                  nama: isBeli ? 'Setoran Nasabah' : 'Penjualan Komoditas',
                                  berat_kg: 5,
                                  harga_satuan: tx.nominal / 5,
                                  subtotal: tx.nominal,
                                },
                              ],
                              total_nilai: tx.nominal,
                            })
                            setIsNotaOpen(true)
                          }}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                            isBeli
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                              : 'border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100'
                          }`}
                        >
                          <Printer size={12} /> Cetak
                        </button>
                      </td>
                    </tr>
                  )
                })}
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
