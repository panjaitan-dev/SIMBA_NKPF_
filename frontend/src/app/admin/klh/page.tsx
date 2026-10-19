'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  ArrowLeft,
  Download,
  TrendingUp,
  Users,
  Building2,
  Recycle,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  MapPin,
} from 'lucide-react'
import Link from 'next/link'
import AdminSidebar from '@/components/layout/AdminSidebar'
import api from '@/lib/api'
import { exportToCSV } from '@/lib/exportUtils'
import { DATA_38_PROVINSI, DAFTAR_PULAU, hitungAgregasiNasional, ProvinsiItem } from '@/lib/provinsi-data'
import toast from 'react-hot-toast'

const KOMPOSISI = [
  { label: 'Plastik', pct: 35, color: '#3b82f6' },
  { label: 'Kertas & Kardus', pct: 28, color: '#10b981' },
  { label: 'Logam', pct: 20, color: '#f59e0b' },
  { label: 'Organik/Jelantah', pct: 12, color: '#8b5cf6' },
  { label: 'Lainnya', pct: 5, color: '#6b7280' },
]

const MONTHLY = [
  { bln: 'Jan', bsu: 13102 }, { bln: 'Feb', bsu: 13489 },
  { bln: 'Mar', bsu: 13821 }, { bln: 'Apr', bsu: 14102 },
  { bln: 'Mei', bsu: 14856 }, { bln: 'Jun', bsu: 15389 },
  { bln: 'Jul', bsu: 15921 }, { bln: 'Agt', bsu: 16423 },
  { bln: 'Sep', bsu: 16950 }, { bln: 'Okt', bsu: 17379 },
]

function DonutChart({ totalKg }: { totalKg: number }) {
  const circumference = 2 * Math.PI * 70
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48">
      {KOMPOSISI.map((seg, idx) => {
        const dash = (seg.pct / 100) * circumference
        const gap = circumference - dash
        const prevSum = KOMPOSISI.slice(0, idx).reduce((sum, item) => sum + item.pct, 0)
        const offset = circumference - (prevSum / 100) * circumference
        return (
          <circle
            key={seg.label}
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke={seg.color}
            strokeWidth="28"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={offset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '100px 100px' }}
          />
        )
      })}
      <text
        x="100"
        y="96"
        textAnchor="middle"
        className="text-xs"
        fill="#1e293b"
        fontSize="12"
        fontWeight="700"
      >
        {(totalKg / 1000).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
      </text>
      <text x="100" y="112" textAnchor="middle" fill="#64748b" fontSize="9">
        ton total
      </text>
    </svg>
  )
}

function LineChart() {
  const W = 500
  const H = 200
  const PAD = { t: 20, r: 20, b: 40, l: 20 }
  const inner = { w: W - PAD.l - PAD.r, h: H - PAD.t - PAD.b }
  const minV = Math.min(...MONTHLY.map((d) => d.bsu)) - 500
  const maxV = Math.max(...MONTHLY.map((d) => d.bsu)) + 500
  const xScale = (i: number) => PAD.l + (i / (MONTHLY.length - 1)) * inner.w
  const yScale = (v: number) => PAD.t + inner.h - ((v - minV) / (maxV - minV)) * inner.h
  const points = MONTHLY.map((d, i) => `${xScale(i)},${yScale(d.bsu)}`).join(' ')
  const areaPoints = `${xScale(0)},${H - PAD.b} ${points} ${xScale(MONTHLY.length - 1)},${H - PAD.b}`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-44">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#059669" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#areaGrad)" />
      <polyline points={points} fill="none" stroke="#059669" strokeWidth="2.5" strokeLinejoin="round" />
      {MONTHLY.map((d, i) => (
        <g key={d.bln}>
          <circle cx={xScale(i)} cy={yScale(d.bsu)} r="4" fill="#059669" />
          <text x={xScale(i)} y={H - PAD.b + 14} textAnchor="middle" fill="#94a3b8" fontSize="9">
            {d.bln}
          </text>
        </g>
      ))}
    </svg>
  )
}

export default function AdminKLHDashboard() {
  const [provinsiList, setProvinsiList] = useState<ProvinsiItem[]>(DATA_38_PROVINSI)
  const [filterPulau, setFilterPulau] = useState<string>('Semua')
  const [filterProvinsi, setFilterProvinsi] = useState<string>('all')
  const [searchTable, setSearchTable] = useState('')
  const [tablePage, setTablePage] = useState(0)
  const [loading, setLoading] = useState(true)
  const PAGE_SIZE = 10

  useEffect(() => {
    // Ambil data dari backend API
    api.get('/stats/provinsi')
      .then((res) => {
        if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length >= 34) {
          setProvinsiList(res.data.data)
        }
      })
      .catch(() => {
        // Fallback anggun ke modul terpercaya DATA_38_PROVINSI
        setProvinsiList(DATA_38_PROVINSI)
      })
      .finally(() => setLoading(false))
  }, [])

  // Filter List Provinsi Berdasarkan Pulau & Dropdown Provinsi
  const availableProvinces = useMemo(() => {
    if (filterPulau === 'Semua') return provinsiList
    return provinsiList.filter((p) => p.pulau === filterPulau)
  }, [provinsiList, filterPulau])

  const selectedProvinces = useMemo(() => {
    let list = availableProvinces
    if (filterProvinsi !== 'all') {
      list = list.filter((p) => p.nama === filterProvinsi)
    }
    return list
  }, [availableProvinces, filterProvinsi])

  // Agregasi Matematika Murni
  const ds = useMemo(() => {
    const total_bsi = selectedProvinces.length
    const total_bsu = selectedProvinces.reduce((sum, p) => sum + (p.bsu || p.bsu_aktif || 0), 0)
    const total_nasabah = selectedProvinces.reduce((sum, p) => sum + (p.nasabah || p.total_nasabah || 0), 0)
    const total_kg = selectedProvinces.reduce((sum, p) => sum + (p.kg || p.total_sampah_kg || 0), 0)
    const total_rupiah = total_kg * 2500

    return {
      total_bsi,
      total_bsu,
      total_nasabah,
      total_kg,
      total_rupiah,
    }
  }, [selectedProvinces])

  // Top 10 Provinsi untuk Chart
  const top10Prov = useMemo(() => {
    return [...selectedProvinces]
      .sort((a, b) => (b.kg || b.total_sampah_kg) - (a.kg || a.total_sampah_kg))
      .slice(0, 10)
  }, [selectedProvinces])

  const maxKg = Math.max(1, ...top10Prov.map((p) => p.kg || p.total_sampah_kg || 0))

  // Data Tabel Terfilter & Pencarian
  const filteredTable = useMemo(() => {
    let list = selectedProvinces
    if (searchTable.trim()) {
      const q = searchTable.toLowerCase().trim()
      list = list.filter(
        (p) =>
          p.nama.toLowerCase().includes(q) ||
          p.ibukota.toLowerCase().includes(q) ||
          p.kode_bps.includes(q) ||
          (p.pulau && p.pulau.toLowerCase().includes(q))
      )
    }
    return list
  }, [selectedProvinces, searchTable])

  const totalPages = Math.ceil(filteredTable.length / PAGE_SIZE)
  const tableData = filteredTable.slice(tablePage * PAGE_SIZE, (tablePage + 1) * PAGE_SIZE)

  const handleDownload = () => {
    if (!filteredTable.length) {
      toast.error('Data rekapitulasi belum tersedia')
      return
    }
    const headers = [
      'No',
      'Kode BPS',
      'Provinsi',
      'Ibu Kota',
      'Kepulauan',
      'Jumlah BSU',
      'Jumlah Nasabah',
      'Sampah Terkumpul (Kg)',
      'Sampah (Ton)',
      'Partisipasi (%)',
      'Bank Sampah Percontohan',
      'Koordinator',
      'Kontak',
    ]
    const rows = filteredTable.map((p, idx) => [
      idx + 1,
      p.kode_bps,
      p.nama,
      p.ibukota,
      p.pulau,
      p.bsu || p.bsu_aktif,
      p.nasabah || p.total_nasabah,
      p.kg || p.total_sampah_kg,
      ((p.kg || p.total_sampah_kg) / 1000).toFixed(2),
      `${p.partisipasi_persen}%`,
      p.unit_percontohan?.nama || '-',
      p.unit_percontohan?.koordinator || '-',
      p.unit_percontohan?.nomor_hp || '-',
    ])
    exportToCSV(`SIMBA_Rekap_KLH_38_Provinsi_${new Date().toISOString().split('T')[0]}`, headers, rows)
    toast.success('Berkas rekapitulasi 38 provinsi berhasil diunduh (CSV)')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <AdminSidebar />
        <div className="flex-1 lg:ml-64 ml-0 w-full min-w-0 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-200 rounded w-1/4"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-slate-200 rounded-2xl"></div>
              <div className="h-64 bg-slate-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 lg:ml-64 ml-0 w-full min-w-0 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
          <div>
            <Link
              href="/admin"
              className="flex items-center text-slate-500 hover:text-slate-900 mb-2 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Dashboard Admin
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">
                Statistik Nasional Bank Sampah Indonesia
              </h1>
              <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                Model Data Simulasi
              </span>
            </div>
            <p className="text-slate-500 mt-1 text-sm">
              Cakupan agregasi data pemodelan 38 provinsi di seluruh Indonesia (Karya Lomba IT Fest 2026)
            </p>
          </div>

          {/* Filter Controls: Pulau & Provinsi */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Pulau */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={filterPulau}
                onChange={(e) => {
                  setFilterPulau(e.target.value)
                  setFilterProvinsi('all')
                  setTablePage(0)
                }}
                className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-sm cursor-pointer"
              >
                {DAFTAR_PULAU.map((pulau) => (
                  <option key={pulau} value={pulau}>
                    {pulau === 'Semua' ? 'Seluruh Indonesia (38)' : `Pulau ${pulau}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Provinsi Spesifik */}
            <div className="relative">
              <select
                value={filterProvinsi}
                onChange={(e) => {
                  setFilterProvinsi(e.target.value)
                  setTablePage(0)
                }}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-sm cursor-pointer"
              >
                <option value="all">Semua Provinsi ({availableProvinces.length})</option>
                {availableProvinces.map((p) => (
                  <option key={p.nama} value={p.nama}>
                    {p.nama}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Unduh CSV
            </button>
          </div>
        </div>

        {/* KPI Cards — Agregasi Matematika Murni */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md text-xs font-semibold">
                <ShieldCheck className="w-3 h-3" />
                Percontohan
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Bank Sampah Induk (BSI)</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {ds.total_bsi.toLocaleString('id-ID')}
              <span className="text-xs text-slate-400 font-normal ml-1">Provinsi</span>
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-semibold">
                <TrendingUp className="w-3 h-3" />
                Aktif
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Bank Sampah Unit (BSU)</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {ds.total_bsu.toLocaleString('id-ID')}
              <span className="text-xs text-slate-400 font-normal ml-1">Unit</span>
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-violet-100 text-violet-600 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 bg-violet-50 text-violet-600 px-2 py-1 rounded-md text-xs font-semibold">
                <TrendingUp className="w-3 h-3" />
                Warga
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Total Nasabah Terdaftar</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {ds.total_nasabah.toLocaleString('id-ID')}
              <span className="text-xs text-slate-400 font-normal ml-1">Orang</span>
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                <Recycle className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-md text-xs font-semibold">
                <TrendingUp className="w-3 h-3" />
                Terkelola
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Sampah Terkelola</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {(ds.total_kg / 1000).toLocaleString('id-ID', { maximumFractionDigits: 0 })}{' '}
              <span className="text-xs text-slate-400 font-normal">Ton</span>
            </h3>
          </div>
        </div>

        {/* Charts & Top 10 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 xl:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Donut Chart */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-6">Komposisi Jenis Sampah</h3>
                <div className="flex items-center justify-center gap-6">
                  <DonutChart totalKg={ds.total_kg} />
                  <div className="space-y-3">
                    {KOMPOSISI.map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-slate-600">{item.label}</span>
                        <span className="text-sm font-bold text-slate-900 ml-auto">{item.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Line Chart */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-6">Pertumbuhan BSU per Bulan</h3>
                <LineChart />
              </div>
            </div>
          </div>

          {/* Top 10 Provinsi */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Top Provinsi — Sampah Terkelola ({filterPulau})
            </h3>
            <div className="space-y-2">
              {top10Prov.map((prov) => {
                const kg = prov.kg || prov.total_sampah_kg || 0
                return (
                  <div key={prov.nama} className="flex items-center gap-3 py-2">
                    <span className="w-24 text-xs text-slate-600 text-right flex-shrink-0 truncate" title={prov.nama}>
                      {prov.nama}
                    </span>
                    <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (kg / maxKg) * 100)}%` }}
                      />
                    </div>
                    <span className="w-20 text-xs font-semibold text-slate-700 tabular-nums text-right">
                      {(kg / 1000).toLocaleString('id-ID', { maximumFractionDigits: 0 })} ton
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tabel Rekap 38 Provinsi */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Rekapitulasi Provinsi ({filteredTable.length} Wilayah)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Wilayah filter: <span className="font-semibold text-emerald-600">{filterPulau}</span>
              </p>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari provinsi, ibu kota, atau BPS..."
                value={searchTable}
                onChange={(e) => {
                  setSearchTable(e.target.value)
                  setTablePage(0)
                }}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none w-full sm:w-64"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100 font-semibold">
                  <th className="py-3 px-4">No</th>
                  <th className="py-3 px-4">BPS</th>
                  <th className="py-3 px-4">Provinsi & Ibu Kota</th>
                  <th className="py-3 px-4">Kepulauan</th>
                  <th className="py-3 px-4 text-right">BSU Aktif</th>
                  <th className="py-3 px-4 text-right">Nasabah</th>
                  <th className="py-3 px-4 text-right">Sampah (Ton)</th>
                  <th className="py-3 px-4 text-center">Partisipasi</th>
                  <th className="py-3 px-4">Unit Percontohan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {tableData.map((row, i) => {
                  const bsu = row.bsu || row.bsu_aktif || 0
                  const nasabah = row.nasabah || row.total_nasabah || 0
                  const kg = row.kg || row.total_sampah_kg || 0
                  return (
                    <tr key={row.kode_bps} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        {tablePage * PAGE_SIZE + i + 1}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-500 font-semibold">
                        {row.kode_bps}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <span>{row.nama}</span>
                          <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {row.kode_iso}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">{row.ibukota}</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">{row.pulau}</td>
                      <td className="py-3.5 px-4 text-right font-medium text-slate-900">
                        {bsu.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-600">
                        {nasabah.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-600">
                        {(kg / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                          {row.partisipasi_persen}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">
                        <div className="font-medium text-slate-800 truncate max-w-[220px]" title={row.unit_percontohan?.nama}>
                          {row.unit_percontohan?.nama || '-'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          PIC: {row.unit_percontohan?.koordinator || '-'}
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {tableData.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-slate-400 text-sm">
                      Tidak ada data provinsi yang sesuai dengan filter pencarian
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Menampilkan {tablePage * PAGE_SIZE + 1} -{' '}
                {Math.min((tablePage + 1) * PAGE_SIZE, filteredTable.length)} dari {filteredTable.length}{' '}
                provinsi
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTablePage((p) => Math.max(0, p - 1))}
                  disabled={tablePage === 0}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>
                <span className="text-xs font-medium text-slate-700">
                  Halaman {tablePage + 1} dari {totalPages}
                </span>
                <button
                  onClick={() => setTablePage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={tablePage === totalPages - 1}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
