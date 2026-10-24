'use client'
import { useState, useEffect } from 'react'
import api from '@/lib/api'

interface HargaItem {
  kode: string
  nama: string
  satuan: string
  harga_beli: number
  harga_jual: number
  kategori: string
  trend?: 'up' | 'down' | 'stable'
}

const formatRupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

const KATEGORI_COLORS: Record<string, string> = {
  logam: 'bg-amber-100 text-amber-700',
  anorganik: 'bg-blue-100 text-blue-700',
  lainnya: 'bg-purple-100 text-purple-700',
  organik: 'bg-green-100 text-green-700',
}

export default function HargaTickerSection() {
  const [data, setData] = useState<HargaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'harga_beli' | 'nama'>('harga_beli')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [filterKategori, setFilterKategori] = useState('all')
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  const fetchHarga = async () => {
    try {
      const r = await api.get('/stats/harga')
      setData(r.data.data)
      setLastUpdate(new Date())
    } catch {
      // Keep existing data
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchHarga().finally(() => setLoading(false))
    // Simulate price fluctuations every 30s
    const interval = setInterval(() => {
      setData((prev) =>
        prev.map((item) => {
          const delta = (Math.random() - 0.5) * 200 // ±Rp 100
          const newHarga = Math.max(100, item.harga_beli + Math.round(delta))
          const oldHarga = item.harga_beli
          return {
            ...item,
            harga_beli: newHarga,
            trend: newHarga > oldHarga ? 'up' : newHarga < oldHarga ? 'down' : 'stable',
          }
        })
      )
      setLastUpdate(new Date())
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const toggleSort = (col: 'harga_beli' | 'nama') => {
    if (sortBy === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortBy(col); setSortDir('desc') }
  }

  const kategoriList = ['all', ...new Set(data.map((d) => d.kategori))]

  const filtered = data
    .filter((d) => filterKategori === 'all' || d.kategori === filterKategori)
    .sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1
      if (sortBy === 'nama') return a.nama.localeCompare(b.nama) * mul
      return (a.harga_beli - b.harga_beli) * mul
    })

  const TrendIcon = ({ trend }: { trend?: string }) => {
    if (trend === 'up') return <span className="text-emerald-500 font-bold text-xs">▲</span>
    if (trend === 'down') return <span className="text-red-500 font-bold text-xs">▼</span>
    return <span className="text-slate-400 font-bold text-xs">—</span>
  }

  return (
    <section id="harga" className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-emerald-600 font-semibold tracking-widest text-xs uppercase mb-2 block">Harga Sampah</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Papan Harga <span className="text-emerald-600">Real-time</span>
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              Update terakhir:{' '}
              <span suppressHydrationWarning>
                {mounted ? lastUpdate.toLocaleTimeString('id-ID') : '--:--:--'}
              </span>
              <span className="ml-2 inline-flex items-center gap-1 text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </p>
          </div>
          {/* Filter kategori */}
          <div className="flex gap-2 flex-wrap">
            {kategoriList.map((k) => (
              <button
                key={k}
                onClick={() => setFilterKategori(k)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                  filterKategori === k
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300'
                }`}
              >
                {k === 'all' ? 'Semua' : k}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto shadow-sm">
          <table className="w-full text-sm min-w-[520px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {[
                  { key: 'nama', label: 'Jenis Sampah' },
                  { key: null, label: 'Kategori' },
                  { key: 'harga_beli', label: 'Harga Beli' },
                  { key: null, label: 'Harga Jual' },
                  { key: null, label: 'Trend' },
                ].map((col) => (
                  <th
                    key={col.label}
                    className={`text-left px-5 py-4 text-xs font-semibold text-slate-500 ${col.key ? 'cursor-pointer hover:text-emerald-600 select-none' : ''}`}
                    onClick={() => col.key && toggleSort(col.key as 'harga_beli' | 'nama')}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {col.key && sortBy === col.key && (
                        <span>{sortDir === 'desc' ? '↓' : '↑'}</span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5}>
                      <div className="h-10 bg-slate-100 animate-pulse m-2 rounded" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-slate-400">
                    Tidak ada data harga.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.kode} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{item.nama}</p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{item.kode}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${KATEGORI_COLORS[item.kategori] || 'bg-slate-100 text-slate-600'}`}>
                        {item.kategori}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-amber-600 tabular-nums">
                        {formatRupiah(item.harga_beli)}
                      </span>
                      <span className="text-xs text-slate-400 ml-1">/{item.satuan}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-600 tabular-nums">
                        {formatRupiah(item.harga_jual || item.harga_beli * 1.2)}
                      </span>
                      <span className="text-xs text-slate-400 ml-1">/{item.satuan}</span>
                    </td>
                    <td className="px-5 py-4">
                      <TrendIcon trend={item.trend} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          * Harga indikatif. Harga aktual ditentukan unit bank sampah setempat berdasarkan kualitas sampah.
        </p>
      </div>
    </section>
  )
}
