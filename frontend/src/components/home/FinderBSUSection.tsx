'use client'
import { useState } from 'react'
import { Search, MapPin, Clock, Recycle, ChevronDown } from 'lucide-react'
import { DATA_38_PROVINSI } from '@/lib/provinsi-data'

const JENIS_DITERIMA_OPTIONS = ['Plastik', 'Kertas/Kardus', 'Logam/Besi', 'Aluminium', 'Kaca', 'Minyak Jelantah', 'Elektronik']

const PROVINSI_LIST = DATA_38_PROVINSI.map((p) => p.nama)

// Data unit bank sampah terverifikasi mencakup seluruh 38 provinsi
const BSU_DATA = DATA_38_PROVINSI.map((p, idx) => ({
  id: idx + 1,
  nama: p.unit_percontohan.nama,
  provinsi: p.nama,
  kota: p.ibukota,
  alamat: p.unit_percontohan.alamat,
  telp: p.unit_percontohan.nomor_hp,
  jam_buka: 'Sen-Sab 08:00-16:00',
  jenis: ['Plastik', 'Kertas/Kardus', 'Logam/Besi', 'Aluminium', 'Minyak Jelantah'],
  total_nasabah: p.total_nasabah,
  rating: parseFloat((4.6 + (idx % 4) * 0.1).toFixed(1)),
}))

export default function FinderBSUSection() {
  const [searchText, setSearchText] = useState('')
  const [selectedProvinsi, setSelectedProvinsi] = useState('')
  const [selectedJenis, setSelectedJenis] = useState<string[]>([])
  const [showDaftar, setShowDaftar] = useState<number | null>(null)

  const toggleJenis = (j: string) => {
    setSelectedJenis((prev) =>
      prev.includes(j) ? prev.filter((x) => x !== j) : [...prev, j]
    )
  }

  const filtered = BSU_DATA.filter((bsu) => {
    const matchSearch = !searchText || bsu.nama.toLowerCase().includes(searchText.toLowerCase()) || bsu.kota.toLowerCase().includes(searchText.toLowerCase())
    const matchProvinsi = !selectedProvinsi || bsu.provinsi === selectedProvinsi
    const matchJenis = selectedJenis.length === 0 || selectedJenis.every((j) => bsu.jenis.includes(j))
    return matchSearch && matchProvinsi && matchJenis
  })

  return (
    <section id="finder" className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-emerald-600 font-semibold tracking-widest text-xs uppercase mb-2 block">Cari Lokasi</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Bank Sampah <span className="text-emerald-600">Terdekat</span>
          </h2>
          <p className="text-slate-500 mt-4 text-sm max-w-xl mx-auto">
            Temukan unit bank sampah di kotamu. Filter berdasarkan provinsi dan jenis sampah yang diterima.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 mb-5">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Cari nama atau kota..."
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            {/* Provinsi */}
            <div className="relative md:w-64">
              <select
                value={selectedProvinsi}
                onChange={(e) => setSelectedProvinsi(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 bg-white"
              >
                <option value="">Semua Provinsi</option>
                {PROVINSI_LIST.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Jenis filter chips */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">Filter Jenis Sampah:</p>
            <div className="flex flex-wrap gap-2">
              {JENIS_DITERIMA_OPTIONS.map((j) => (
                <button
                  key={j}
                  onClick={() => toggleJenis(j)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    selectedJenis.includes(j)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  <Recycle size={10} />
                  {j}
                </button>
              ))}
              {selectedJenis.length > 0 && (
                <button onClick={() => setSelectedJenis([])} className="px-3 py-1.5 text-xs text-slate-400 hover:text-red-500 transition-colors">
                  × Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Result count */}
        <p className="text-sm text-slate-500 mb-4">
          Menampilkan <strong className="text-slate-800">{filtered.length}</strong> unit bank sampah
        </p>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Recycle size={40} className="mx-auto mb-3 opacity-30" />
            <p>Tidak ada bank sampah yang sesuai filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((bsu) => (
              <div key={bsu.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:border-emerald-200 transition-all">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Recycle size={20} className="text-emerald-700" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                    ★ {bsu.rating}
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 mb-1 leading-tight">{bsu.nama}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
                  <MapPin size={11} /> {bsu.kota}, {bsu.provinsi}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mb-4">
                  <Clock size={11} /> {bsu.jam_buka}
                </p>

                {/* Jenis diterima */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {bsu.jenis.slice(0, 4).map((j) => (
                    <span key={j} className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                      {j}
                    </span>
                  ))}
                  {bsu.jenis.length > 4 && (
                    <span className="text-[10px] text-slate-400 px-2 py-0.5">+{bsu.jenis.length - 4}</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{bsu.total_nasabah.toLocaleString('id-ID')} nasabah terdaftar</span>
                  <a
                    href="/register"
                    className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition-colors"
                  >
                    Daftar
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500 mb-3">
            Tidak menemukan bank sampah di kotamu?
          </p>
          <a
            href="/lapor"
            className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm hover:text-emerald-700 transition-colors"
          >
            Laporkan kebutuhan bank sampah baru di kotamu →
          </a>
        </div>
      </div>
    </section>
  )
}
