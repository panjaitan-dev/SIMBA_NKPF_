'use client'

import { useEffect, useState, useMemo } from 'react'
import { ArrowLeft, Download, TrendingUp, Users, Building2, Recycle, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import AdminSidebar from '@/components/layout/AdminSidebar'
import api from '@/lib/api'
import { formatRupiah } from '@/lib/utils'
import { exportToCSV } from '@/lib/exportUtils'
import toast from 'react-hot-toast'

const KOMPOSISI = [
  { label: 'Plastik', pct: 35, color: '#3b82f6' },
  { label: 'Kertas & Kardus', pct: 28, color: '#10b981' },
  { label: 'Logam', pct: 20, color: '#f59e0b' },
  { label: 'Organik/Jelantah', pct: 12, color: '#8b5cf6' },
  { label: 'Lainnya', pct: 5, color: '#6b7280' },
]

const MONTHLY = [
  { bln: 'Nov', bsu: 12100 }, { bln: 'Des', bsu: 12891 },
  { bln: 'Jan', bsu: 13102 }, { bln: 'Feb', bsu: 13489 },
  { bln: 'Mar', bsu: 13821 }, { bln: 'Apr', bsu: 14102 },
  { bln: 'Mei', bsu: 14356 }, { bln: 'Jun', bsu: 14589 },
  { bln: 'Jul', bsu: 14721 }, { bln: 'Agt', bsu: 14823 },
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
          <circle key={seg.label} cx="100" cy="100" r="70"
            fill="none" stroke={seg.color} strokeWidth="28"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={offset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '100px 100px' }}
          />
        )
      })}
      <text x="100" y="96" textAnchor="middle" className="text-xs" fill="#1e293b" fontSize="12" fontWeight="700">
        {(totalKg / 1000).toFixed(0)}
      </text>
      <text x="100" y="112" textAnchor="middle" fill="#64748b" fontSize="9">ton total</text>
    </svg>
  )
}

function LineChart() {
  const W = 500, H = 200, PAD = { t: 20, r: 20, b: 40, l: 20 }
  const inner = { w: W - PAD.l - PAD.r, h: H - PAD.t - PAD.b }
  const minV = Math.min(...MONTHLY.map(d => d.bsu)) - 500
  const maxV = Math.max(...MONTHLY.map(d => d.bsu)) + 500
  const xScale = (i: number) => PAD.l + (i / (MONTHLY.length - 1)) * inner.w
  const yScale = (v: number) => PAD.t + inner.h - ((v - minV) / (maxV - minV)) * inner.h
  const points = MONTHLY.map((d, i) => `${xScale(i)},${yScale(d.bsu)}`).join(' ')
  const areaPoints = `${xScale(0)},${H - PAD.b} ${points} ${xScale(MONTHLY.length-1)},${H - PAD.b}`
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
          <text x={xScale(i)} y={H - PAD.b + 14} textAnchor="middle" fill="#94a3b8" fontSize="9">{d.bln}</text>
        </g>
      ))}
    </svg>
  )
}

export default function AdminKLHDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [provinsiData, setProvinsiData] = useState<any[]>([])
  const [filterProvinsi, setFilterProvinsi] = useState('all')
  const [searchTable, setSearchTable] = useState('')
  const [tablePage, setTablePage] = useState(0)
  const [loading, setLoading] = useState(true)
  const PAGE_SIZE = 10

  useEffect(() => {
    Promise.all([
      api.get('/stats/nasional').catch(() => null),
      api.get('/stats/provinsi').catch(() => null),
    ]).then(([sRes, pRes]) => {
      if (sRes?.data?.data) setStats(sRes.data.data)
      if (pRes?.data?.data) setProvinsiData(pRes.data.data)
    }).finally(() => setLoading(false))
  }, [])

  const ds = stats || { total_bsi: 1247, total_bsu: 14823, total_nasabah: 2341891, total_kg: 89543210, total_rupiah: 178324500000 }

  const MOCK_PROV = [
    { nama: 'Jawa Barat', bsu: 2340, nasabah: 450123, kg: 15400300 },
    { nama: 'Jawa Timur', bsu: 1980, nasabah: 380500, kg: 12100400 },
    { nama: 'Jawa Tengah', bsu: 1750, nasabah: 310200, kg: 10500000 },
    { nama: 'DKI Jakarta', bsu: 1500, nasabah: 280100, kg: 9800000 },
    { nama: 'Banten', bsu: 1100, nasabah: 190400, kg: 6500000 },
    { nama: 'Sumatera Utara', bsu: 950, nasabah: 150200, kg: 5200000 },
    { nama: 'Bali', bsu: 800, nasabah: 120500, kg: 4100000 },
    { nama: 'Sulawesi Selatan', bsu: 750, nasabah: 110300, kg: 3800000 },
    { nama: 'DI Yogyakarta', bsu: 700, nasabah: 105000, kg: 3500000 },
    { nama: 'Riau', bsu: 600, nasabah: 95000, kg: 3100000 },
    { nama: 'Kalimantan Timur', bsu: 550, nasabah: 85000, kg: 2800000 },
    { nama: 'Sumatera Selatan', bsu: 500, nasabah: 75000, kg: 2500000 },
  ]
  const pData = provinsiData.length > 0 ? provinsiData : MOCK_PROV

  const top10Prov = useMemo(() => {
    return [...pData].sort((a, b) => b.kg - a.kg).slice(0, 10)
  }, [pData])
  const maxKg = Math.max(...top10Prov.map(p => p.kg))

  const filteredTable = useMemo(() => {
    let filtered = pData
    if (filterProvinsi !== 'all') {
      filtered = filtered.filter(p => p.nama === filterProvinsi)
    }
    return filtered.filter(p => p.nama.toLowerCase().includes(searchTable.toLowerCase()))
  }, [pData, searchTable, filterProvinsi])

  const totalPages = Math.ceil(filteredTable.length / PAGE_SIZE)
  const tableData = filteredTable.slice(tablePage * PAGE_SIZE, (tablePage + 1) * PAGE_SIZE)



  const handleDownload = () => {
    if (!provinsiData.length) {
      toast.error('Data rekapitulasi belum tersedia')
      return
    }
    const headers = ['No', 'Provinsi', 'Jumlah BSU', 'Jumlah Nasabah', 'Sampah Terkumpul (Kg)', 'Sampah (Ton)']
    const rows = provinsiData.map((p, idx) => [
      idx + 1,
      p.nama,
      p.bsu,
      p.nasabah,
      p.kg,
      (p.kg / 1000).toFixed(2),
    ])
    exportToCSV(`SIMBA_Rekap_Nasional_KLH_${new Date().toISOString().split('T')[0]}`, headers, rows)
    toast.success('Berkas rekapitulasi nasional berhasil diunduh')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <AdminSidebar />
        <div className="flex-1 lg:ml-64 ml-0 w-full min-w-0 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-200 rounded w-1/4"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>)}
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="flex items-center text-slate-500 hover:text-slate-900 mb-2 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Statistik Nasional Bank Sampah</h1>
            <p className="text-slate-500 mt-1">Data real-time seluruh Bank Sampah Indonesia — KLH</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={filterProvinsi}
                onChange={(e) => setFilterProvinsi(e.target.value)}
                className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none outline-none"
              >
                <option value="all">Semua Provinsi</option>
                {pData.map(p => (
                  <option key={p.nama} value={p.nama}>{p.nama}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Unduh PDF
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md text-xs font-semibold">
                <TrendingUp className="w-3 h-3" />
                +8.2%
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Total BSI</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{ds.total_bsi.toLocaleString('id-ID')}</h3>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md text-xs font-semibold">
                <TrendingUp className="w-3 h-3" />
                +12.4%
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Total BSU</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{ds.total_bsu.toLocaleString('id-ID')}</h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-violet-100 text-violet-600 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md text-xs font-semibold">
                <TrendingUp className="w-3 h-3" />
                +18.7%
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Total Nasabah</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{ds.total_nasabah.toLocaleString('id-ID')}</h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                <Recycle className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md text-xs font-semibold">
                <TrendingUp className="w-3 h-3" />
                +23.1%
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Sampah Terkumpul</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{(ds.total_kg / 1000).toFixed(0)} ton</h3>
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
                    {KOMPOSISI.map(item => (
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
            <h3 className="text-lg font-bold text-slate-900 mb-4">Top 10 Provinsi — Sampah Terkumpul</h3>
            <div className="space-y-2">
              {top10Prov.map((prov) => (
                <div key={prov.nama} className="flex items-center gap-3 py-2">
                  <span className="w-20 text-xs text-slate-500 text-right flex-shrink-0" title={prov.nama}>
                    {prov.nama.length > 8 ? prov.nama.slice(0, 8) + '...' : prov.nama}
                  </span>
                  <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${(prov.kg / maxKg) * 100}%` }} />
                  </div>
                  <span className="w-28 text-xs font-semibold text-slate-700 tabular-nums">{(prov.kg / 1000).toFixed(0)} ton</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Rekap Per Provinsi</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari provinsi..." 
                value={searchTable}
                onChange={(e) => {
                  setSearchTable(e.target.value)
                  setTablePage(0)
                }}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none w-64"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                  <th className="py-4 px-6 font-medium">No</th>
                  <th className="py-4 px-6 font-medium">Provinsi</th>
                  <th className="py-4 px-6 font-medium">BSU</th>
                  <th className="py-4 px-6 font-medium">Nasabah</th>
                  <th className="py-4 px-6 font-medium">Sampah (ton)</th>
                  <th className="py-4 px-6 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tableData.map((row, i) => (
                  <tr key={row.nama} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm text-slate-500">{tablePage * PAGE_SIZE + i + 1}</td>
                    <td className="py-4 px-6 text-sm font-medium text-slate-900">{row.nama}</td>
                    <td className="py-4 px-6 text-sm text-slate-600">{row.bsu.toLocaleString('id-ID')}</td>
                    <td className="py-4 px-6 text-sm text-slate-600">{row.nasabah.toLocaleString('id-ID')}</td>
                    <td className="py-4 px-6 text-sm text-slate-600">{(row.kg / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}</td>
                    <td className="py-4 px-6 text-sm">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700">
                        Aktif
                      </span>
                    </td>
                  </tr>
                ))}
                {tableData.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
                      Data tidak ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Menampilkan {tablePage * PAGE_SIZE + 1} - {Math.min((tablePage + 1) * PAGE_SIZE, filteredTable.length)} dari {filteredTable.length} provinsi
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTablePage(p => Math.max(0, p - 1))}
                  disabled={tablePage === 0}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  onClick={() => setTablePage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={tablePage === totalPages - 1}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
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
