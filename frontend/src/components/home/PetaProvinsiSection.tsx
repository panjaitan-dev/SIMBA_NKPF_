'use client'

import { useState, useMemo } from 'react'
import {
  MapPin,
  Building2,
  Users,
  Recycle,
  Search,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Table as TableIcon,
  Map as MapIcon,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Phone,
  UserCheck,
} from 'lucide-react'
import { DATA_38_PROVINSI, DAFTAR_PULAU, ProvinsiItem, hitungAgregasiNasional } from '@/lib/provinsi-data'
import { exportToCSV } from '@/lib/exportUtils'
import toast from 'react-hot-toast'

// Proyeksi Koordinat Geografis Indonesia ke SVG Canvas (1000 x 480)
// Longitude: 94.5°E s/d 141.5°E
// Latitude: +6.5°N s/d -11.5°S
function geoToSvg(lat: number, lng: number): { x: number; y: number } {
  const minLng = 94.5
  const maxLng = 141.5
  const maxLat = 6.5
  const minLat = -11.5

  const width = 1000
  const height = 480

  const x = ((lng - minLng) / (maxLng - minLng)) * (width - 80) + 40
  const y = ((maxLat - lat) / (maxLat - minLat)) * (height - 80) + 40

  return { x: Math.round(x), y: Math.round(y) }
}

export default function PetaProvinsiSection() {
  const [selectedPulau, setSelectedPulau] = useState<string>('Semua')
  const [selectedKode, setSelectedKode] = useState<string | null>('31') // Default DKI Jakarta
  const [hoveredKode, setHoveredKode] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [viewMode, setViewMode] = useState<'peta' | 'tabel'>('peta')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortField, setSortField] = useState<keyof ProvinsiItem>('total_sampah_kg')
  const [sortAsc, setSortAsc] = useState<boolean>(false)

  // Agregasi Ringkasan
  const agregasi = useMemo(() => hitungAgregasiNasional(selectedPulau), [selectedPulau])

  // Filter Data
  const filteredProvinsi = useMemo(() => {
    let list = DATA_38_PROVINSI
    if (selectedPulau !== 'Semua') {
      list = list.filter((p) => p.pulau === selectedPulau)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (p) =>
          p.nama.toLowerCase().includes(q) ||
          p.ibukota.toLowerCase().includes(q) ||
          p.kode_bps.includes(q) ||
          p.kode_iso.toLowerCase().includes(q)
      )
    }
    return list
  }, [selectedPulau, searchQuery])

  // Sorting Data untuk Tabel
  const sortedProvinsi = useMemo(() => {
    return [...filteredProvinsi].sort((a, b) => {
      const vA = a[sortField]
      const vB = b[sortField]
      if (typeof vA === 'string' && typeof vB === 'string') {
        return sortAsc ? vA.localeCompare(vB) : vB.localeCompare(vA)
      }
      return sortAsc ? (vA as number) - (vB as number) : (vB as number) - (vA as number)
    })
  }, [filteredProvinsi, sortField, sortAsc])

  // Provinsi yang sedang terpilih atau di-hover
  const activeKode = hoveredKode || selectedKode
  const activeProv = useMemo(
    () => DATA_38_PROVINSI.find((p) => p.kode_iso === activeKode) || DATA_38_PROVINSI[0],
    [activeKode]
  )

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(Math.max(prev + delta, 0.9), 2.2))
  }

  const handleResetZoom = () => {
    setZoomLevel(1)
    setPanOffset({ x: 0, y: 0 })
  }

  const handleExportCSV = () => {
    const headers = [
      'Kode BPS',
      'Provinsi',
      'Ibu Kota',
      'Kepulauan',
      'Populasi',
      'BSU Aktif',
      'Sampah Terkelola (Kg)',
      'Sampah (Ton)',
      'Nasabah',
      'Partisipasi (%)',
      'Bank Sampah Percontohan',
      'Koordinator',
    ]
    const rows = sortedProvinsi.map((p) => [
      p.kode_bps,
      p.nama,
      p.ibukota,
      p.pulau,
      p.populasi,
      p.bsu_aktif,
      p.total_sampah_kg,
      p.ton,
      p.total_nasabah,
      `${p.partisipasi_persen}%`,
      p.unit_percontohan.nama,
      p.unit_percontohan.koordinator,
    ])
    exportToCSV(`SIMBA_38_Provinsi_${selectedPulau.replace(/\s+/g, '_')}`, headers, rows)
    toast.success('Data 38 provinsi berhasil diunduh (CSV)')
  }

  return (
    <section id="peta" className="py-20 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <ShieldCheck size={14} />
            <span>Cakupan Skala Besar Nasional</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Sebaran 38 Provinsi di Seluruh <span className="text-emerald-400">Indonesia</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Platform SIMBA terhubung langsung dengan Bank Sampah di 38 provinsi dari Sabang sampai Merauke,
            termasuk 4 Daerah Otonom Baru (DOB) Papua dan Maluku.
          </p>
        </div>

        {/* KPI Ringkasan Nasional / Pulau */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
              <span>Provinsi Tercakup</span>
              <Building2 size={16} className="text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {agregasi.total_provinsi} <span className="text-xs text-slate-500 font-normal">/ 38</span>
            </div>
            <p className="text-[11px] text-emerald-400 mt-1">100% Terintegrasi BPS</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
              <span>Bank Sampah Unit (BSU)</span>
              <Recycle size={16} className="text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {agregasi.total_bsu.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-blue-400 mt-1">Unit Aktif Terdaftar</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
              <span>Sampah Terkelola</span>
              <Recycle size={16} className="text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {(agregasi.total_kg / 1000).toLocaleString('id-ID', { maximumFractionDigits: 0 })}{' '}
              <span className="text-xs text-slate-500 font-normal">Ton</span>
            </div>
            <p className="text-[11px] text-amber-400 mt-1">Reduksi TPA Nasional</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
              <span>Nasabah & Partisipasi</span>
              <Users size={16} className="text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {(agregasi.total_nasabah / 1000).toFixed(0)}k{' '}
              <span className="text-xs text-slate-500 font-normal">({agregasi.avg_partisipasi}%)</span>
            </div>
            <p className="text-[11px] text-purple-400 mt-1">Warga Terberdayakan</p>
          </div>
        </div>

        {/* Filter Tab Pulau & Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-full sm:w-auto">
            {DAFTAR_PULAU.map((pulau) => {
              const active = selectedPulau === pulau
              return (
                <button
                  key={pulau}
                  onClick={() => setSelectedPulau(pulau)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {pulau}
                </button>
              )
            })}
          </div>

          {/* Toggle View Mode: Peta vs Tabel */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setViewMode('peta')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                viewMode === 'peta'
                  ? 'bg-slate-800 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <MapIcon size={14} />
              <span>Peta Interaktif</span>
            </button>
            <button
              onClick={() => setViewMode('tabel')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                viewMode === 'tabel'
                  ? 'bg-slate-800 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <TableIcon size={14} />
              <span>Tabel 38 Provinsi</span>
            </button>
            {viewMode === 'tabel' && (
              <button
                onClick={handleExportCSV}
                title="Download CSV"
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
              >
                <Download size={14} />
              </button>
            )}
          </div>
        </div>

        {/* VIEW MODE 1: PETA INTERAKTIF SVG RESIK */}
        {viewMode === 'peta' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Canvas Peta SVG */}
            <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 relative overflow-hidden shadow-2xl">
              {/* Control Buttons */}
              <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-md">
                <button
                  onClick={() => handleZoom(0.2)}
                  title="Perbesar Peta"
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  onClick={() => handleZoom(-0.2)}
                  title="Perkecil Peta"
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <ZoomOut size={16} />
                </button>
                <button
                  onClick={handleResetZoom}
                  title="Reset Tampilan"
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <RotateCcw size={16} />
                </button>
              </div>

              {/* Status Indicator */}
              <div className="absolute bottom-4 left-4 z-20 text-[11px] text-slate-500 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800 backdrop-blur-md flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>38 Provinsi Aktif Terverifikasi</span>
              </div>

              {/* Viewport SVG Container */}
              <div
                className="w-full aspect-[2/1] relative flex items-center justify-center select-none"
                style={{ touchAction: 'pan-y' }}
              >
                <svg
                  viewBox="0 0 1000 480"
                  className="w-full h-full transition-transform duration-200 ease-out"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                  }}
                >
                  {/* Grid Geografis Garis Lintang/Bujur Halus */}
                  <g stroke="#334155" strokeWidth="0.5" strokeDasharray="3 6" opacity="0.4">
                    <line x1="40" y1="120" x2="960" y2="120" />
                    <line x1="40" y1="240" x2="960" y2="240" />
                    <line x1="40" y1="360" x2="960" y2="360" />
                    <line x1="200" y1="40" x2="200" y2="440" />
                    <line x1="400" y1="40" x2="400" y2="440" />
                    <line x1="600" y1="40" x2="600" y2="440" />
                    <line x1="800" y1="40" x2="800" y2="440" />
                  </g>

                  {/* Siluet Kepulauan Utama Indonesia (Vector Simplified Shapes) */}
                  <g fill="#1e293b" stroke="#334155" strokeWidth="1" opacity="0.6">
                    {/* Sumatera */}
                    <path d="M 60 70 L 120 110 L 190 200 L 260 280 L 240 310 L 200 300 L 140 220 L 70 120 Z" />
                    {/* Jawa */}
                    <path d="M 270 340 L 340 345 L 430 355 L 500 365 L 490 380 L 400 375 L 320 365 L 265 355 Z" />
                    {/* Bali & Nusa Tenggara */}
                    <path d="M 515 365 L 545 365 L 590 370 L 640 375 L 680 395 L 660 410 L 600 385 L 530 380 Z" />
                    {/* Kalimantan */}
                    <path d="M 330 180 L 410 160 L 470 190 L 475 270 L 410 290 L 340 270 L 325 210 Z" />
                    {/* Sulawesi */}
                    <path d="M 520 220 L 560 180 L 585 240 L 560 330 L 535 320 L 545 260 L 515 250 Z" />
                    {/* Maluku */}
                    <path d="M 680 200 L 720 185 L 725 240 L 685 270 Z" />
                    <path d="M 700 290 L 740 300 L 730 340 L 690 330 Z" />
                    {/* Papua (Barat, Tengah, Timur, Selatan) */}
                    <path d="M 770 210 L 840 215 L 940 225 L 950 360 L 910 380 L 860 320 L 800 275 L 755 245 Z" />
                  </g>

                  {/* Marker 38 Provinsi */}
                  {DATA_38_PROVINSI.map((prov) => {
                    const { x, y } = geoToSvg(prov.lat, prov.lng)
                    const isSelected = selectedKode === prov.kode_iso
                    const isHovered = hoveredKode === prov.kode_iso
                    const isFiltered =
                      selectedPulau === 'Semua' || prov.pulau === selectedPulau

                    return (
                      <g
                        key={prov.kode_bps}
                        className="cursor-pointer transition-all duration-200"
                        onClick={() => setSelectedKode(prov.kode_iso)}
                        onMouseEnter={() => setHoveredKode(prov.kode_iso)}
                        onMouseLeave={() => setHoveredKode(null)}
                        opacity={isFiltered ? 1 : 0.25}
                      >
                        {/* Lingkaran Pulsing jika terpilih */}
                        {(isSelected || isHovered) && (
                          <circle
                            cx={x}
                            cy={y}
                            r={16}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="1.5"
                            className="animate-ping"
                            opacity="0.6"
                          />
                        )}

                        {/* Lingkaran Luar */}
                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? 9 : 7}
                          fill={isSelected ? '#10b981' : isHovered ? '#34d399' : '#059669'}
                          stroke="#ffffff"
                          strokeWidth={isSelected ? 2 : 1}
                          className="drop-shadow-md"
                        />

                        {/* Titik Inti */}
                        <circle cx={x} cy={y} r={2.5} fill="#ffffff" />

                        {/* Label Kode Provinsi */}
                        <text
                          x={x}
                          y={y - 11}
                          textAnchor="middle"
                          fill={isSelected ? '#34d399' : '#cbd5e1'}
                          fontSize="9"
                          fontWeight={isSelected ? '800' : '600'}
                          className="pointer-events-none drop-shadow"
                        >
                          {prov.kode_iso}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </div>
            </div>

            {/* Panel Detail Provinsi Terpilih */}
            <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
              <div className="flex items-start justify-between mb-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    {activeProv.pulau} • Kode BPS {activeProv.kode_bps}
                  </span>
                  <h3 className="text-2xl font-black text-white mt-0.5">{activeProv.nama}</h3>
                  <p className="text-xs text-slate-400">Ibu Kota: {activeProv.ibukota}</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-sm">
                  {activeProv.kode_iso}
                </div>
              </div>

              {/* Grid Metrik Utama */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                    <Building2 size={13} className="text-emerald-400" />
                    <span>Unit BSU</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    {activeProv.bsu_aktif.toLocaleString('id-ID')}
                  </div>
                  <span className="text-[10px] text-slate-500">Bank Sampah Unit</span>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                    <Recycle size={13} className="text-blue-400" />
                    <span>Terkelola</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    {activeProv.ton.toLocaleString('id-ID')} Ton
                  </div>
                  <span className="text-[10px] text-slate-500">
                    ({activeProv.total_sampah_kg.toLocaleString('id-ID')} kg)
                  </span>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                    <Users size={13} className="text-purple-400" />
                    <span>Nasabah</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    {activeProv.total_nasabah.toLocaleString('id-ID')}
                  </div>
                  <span className="text-[10px] text-slate-500">Warga Aktif</span>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                    <UserCheck size={13} className="text-amber-400" />
                    <span>Partisipasi</span>
                  </div>
                  <div className="text-lg font-bold text-emerald-400">
                    {activeProv.partisipasi_persen}%
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Target Reduksi {activeProv.target_reduksi_persen}%
                  </span>
                </div>
              </div>

              {/* Unit Bank Sampah Percontohan Realistis */}
              <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck size={14} />
                    Unit Percontohan Resmi
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    {activeProv.unit_percontohan.kode}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">
                  {activeProv.unit_percontohan.nama}
                </h4>
                <p className="text-xs text-slate-400 mt-1 flex items-start gap-1.5">
                  <MapPin size={13} className="text-slate-500 flex-shrink-0 mt-0.5" />
                  <span>{activeProv.unit_percontohan.alamat}</span>
                </p>

                <div className="mt-3 pt-3 border-t border-emerald-500/15 flex items-center justify-between text-xs text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Koordinator:</span>
                    <span className="font-medium">{activeProv.unit_percontohan.koordinator}</span>
                  </div>
                  <a
                    href={`tel:${activeProv.unit_percontohan.nomor_hp.replace(/\D/g, '')}`}
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-xs font-semibold"
                  >
                    <Phone size={12} />
                    <span>{activeProv.unit_percontohan.nomor_hp}</span>
                  </a>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 text-center">
                Disinkronisasi dengan Sistem Informasi Bank Sampah Nasional (SIMBA — KLH)
              </p>
            </div>
          </div>
        )}

        {/* VIEW MODE 2: TABEL INTERAKTIF 38 PROVINSI (FALLBACK ANGGUN & AUDIT) */}
        {viewMode === 'tabel' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-sm">
            {/* Search and Table Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari provinsi, ibu kota, atau kode BPS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="text-xs text-slate-400 self-end sm:self-auto">
                Menampilkan <span className="font-bold text-white">{sortedProvinsi.length}</span> dari 38 Provinsi
              </div>
            </div>

            {/* Table Responsive Container */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3">BPS</th>
                    <th
                      className="py-3 px-3 cursor-pointer hover:text-white"
                      onClick={() => {
                        setSortField('nama')
                        setSortAsc(!sortAsc)
                      }}
                    >
                      Provinsi & Ibu Kota {sortField === 'nama' && (sortAsc ? '▲' : '▼')}
                    </th>
                    <th className="py-3 px-3">Kepulauan</th>
                    <th
                      className="py-3 px-3 cursor-pointer hover:text-white text-right"
                      onClick={() => {
                        setSortField('bsu_aktif')
                        setSortAsc(!sortAsc)
                      }}
                    >
                      BSU Aktif {sortField === 'bsu_aktif' && (sortAsc ? '▲' : '▼')}
                    </th>
                    <th
                      className="py-3 px-3 cursor-pointer hover:text-white text-right"
                      onClick={() => {
                        setSortField('total_sampah_kg')
                        setSortAsc(!sortAsc)
                      }}
                    >
                      Sampah (Ton) {sortField === 'total_sampah_kg' && (sortAsc ? '▲' : '▼')}
                    </th>
                    <th
                      className="py-3 px-3 cursor-pointer hover:text-white text-right"
                      onClick={() => {
                        setSortField('total_nasabah')
                        setSortAsc(!sortAsc)
                      }}
                    >
                      Nasabah {sortField === 'total_nasabah' && (sortAsc ? '▲' : '▼')}
                    </th>
                    <th className="py-3 px-3 text-right">Partisipasi</th>
                    <th className="py-3 px-3">Unit Percontohan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {sortedProvinsi.map((p) => {
                    return (
                      <tr
                        key={p.kode_bps}
                        onClick={() => setSelectedKode(p.kode_iso)}
                        className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                          selectedKode === p.kode_iso ? 'bg-emerald-950/20' : ''
                        }`}
                      >
                        <td className="py-3 px-3 font-mono text-slate-500">{p.kode_bps}</td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{p.nama}</span>
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                              {p.kode_iso}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">{p.ibukota}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-400">{p.pulau}</td>
                        <td className="py-3 px-3 text-right font-bold text-white">
                          {p.bsu_aktif.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-emerald-400">
                          {p.ton.toLocaleString('id-ID')} Ton
                        </td>
                        <td className="py-3 px-3 text-right text-slate-300">
                          {p.total_nasabah.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="text-emerald-400 font-semibold">{p.partisipasi_persen}%</span>
                        </td>
                        <td className="py-3 px-3 text-slate-300">
                          <div className="font-medium truncate max-w-[200px]" title={p.unit_percontohan.nama}>
                            {p.unit_percontohan.nama}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            PIC: {p.unit_percontohan.koordinator}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
