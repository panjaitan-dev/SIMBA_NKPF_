'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  MapPin,
  Building2,
  Clock,
  Recycle,
  Search,
  CheckCircle2,
  ChevronRight,
  Info,
  ExternalLink,
  Filter,
} from 'lucide-react'
import { FALLBACK_VERIFIED_UNITS, UnitBankSampah, JENIS_SAMPAH_OPTIONS } from '@/lib/sumut-constants'
import { Badge } from '@/components/ui/badge'
import { Stempel } from '@/components/ui/stempel'

const ITEMS_PER_PAGE = 3

export default function PetaDanUnitSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedKategori, setSelectedKategori] = useState('Semua Jenis')
  const [selectedUnitId, setSelectedUnitId] = useState<string>(FALLBACK_VERIFIED_UNITS[0].id)
  const [currentPage, setCurrentPage] = useState(1)

  // Filter unit hanya berdasarkan data pilot Sumut terverifikasi
  const filteredUnits = useMemo(() => {
    return FALLBACK_VERIFIED_UNITS.filter((unit) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        unit.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.kabupaten_kota_nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.alamat_lengkap.toLowerCase().includes(searchQuery.toLowerCase())

      const matchKategori =
        selectedKategori === 'Semua Jenis' ||
        unit.jenis_sampah_diterima.some((j) =>
          j.toLowerCase().includes(selectedKategori.toLowerCase())
        )

      return matchSearch && matchKategori
    })
  }, [searchQuery, selectedKategori])

  // Pagination unit: 3 unit per halaman
  const totalPages = Math.ceil(filteredUnits.length / ITEMS_PER_PAGE) || 1
  const displayedUnits = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredUnits.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredUnits, currentPage])

  // Unit yang aktif dipilih untuk pratinjau peta/detail
  const activeUnit = useMemo(() => {
    return (
      filteredUnits.find((u) => u.id === selectedUnitId) ||
      displayedUnits[0] ||
      FALLBACK_VERIFIED_UNITS[0]
    )
  }, [filteredUnits, selectedUnitId, displayedUnits])

  return (
    <section id="peta-dan-unit" className="py-20 sm:py-24 bg-[#FAF7F2] border-b border-[#E2DACB]">
      {/* Anchors for smooth scroll compatibility */}
      <div id="finder" className="sr-only" />
      <div id="peta" className="sr-only" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#D8572A] block mb-2">
            Direktori Unit Terverifikasi
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B1B18] tracking-tight">
            Peta Sebaran & <span className="text-[#1E4D3B]">Bank Sampah Terdekat</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#66635B] leading-relaxed">
            Data autentik percontohan Sumatera Utara. Setiap unit diverifikasi langsung berdasarkan koordinat,
            jadwal timbang terbuka, dan kesiapan menerima komoditas pilahan warga.
          </p>
        </div>

        {/* Filter & Kotak Pencarian */}
        <div className="bg-[#F4EFE4] border-2 border-[#E2DACB] rounded-2xl p-4 sm:p-5 mb-8 shadow-xs">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            {/* Input Cari */}
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#66635B]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Cari nama unit, kota/kabupaten, atau jalan di Sumut..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#E2DACB] bg-white text-sm text-[#1B1B18] placeholder-[#66635B] focus:border-[#1E4D3B] focus:ring-1 focus:ring-[#1E4D3B] outline-none"
              />
            </div>

            {/* Filter Jenis Sampah */}
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-[#1E4D3B] shrink-0" />
              <select
                value={selectedKategori}
                onChange={(e) => {
                  setSelectedKategori(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-3 py-2.5 rounded-xl border-2 border-[#E2DACB] bg-white text-xs sm:text-sm font-semibold text-[#1B1B18] focus:border-[#1E4D3B] outline-none"
              >
                {JENIS_SAMPAH_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Konten Utama: 2 Kolom (Daftar Unit Kiri, Peta Interaktif Kanan) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Kolom Kiri: Daftar Kartu Unit dengan Pagination (6 Kolom) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#66635B] px-1">
              <span>Menampilkan {filteredUnits.length} unit percontohan terverifikasi</span>
              <span>Halaman {currentPage} dari {totalPages}</span>
            </div>

            {displayedUnits.length === 0 ? (
              <div className="bg-[#FAF7F2] border-2 border-dashed border-[#D4CABA] rounded-2xl p-8 text-center text-[#66635B]">
                <Building2 size={32} className="mx-auto mb-2 text-[#D4CABA]" />
                <p className="font-semibold text-[#1B1B18] text-sm">Tidak ditemukan unit yang sesuai</p>
                <p className="text-xs mt-1">Coba kurangi kata kunci pencarian atau ganti filter jenis sampah.</p>
              </div>
            ) : (
              displayedUnits.map((unit) => {
                const isSelected = activeUnit.id === unit.id
                return (
                  <div
                    key={unit.id}
                    onClick={() => setSelectedUnitId(unit.id)}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-white border-[#1E4D3B] shadow-[4px_4px_0px_#1E4D3B]'
                        : 'bg-[#FAF7F2] border-[#E2DACB] hover:border-[#D4CABA]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D8572A] bg-[#FDF1EC] px-2 py-0.5 rounded-md border border-[#D8572A]/20">
                          {unit.kabupaten_kota_nama} • {unit.kode}
                        </span>
                        <h3 className="font-serif font-bold text-base text-[#1B1B18] mt-1.5 leading-snug">
                          {unit.nama}
                        </h3>
                      </div>
                      <Badge variant="verified" className="shrink-0">
                        Terverifikasi
                      </Badge>
                    </div>

                    <p className="text-xs text-[#66635B] flex items-start gap-1.5 mb-3 leading-relaxed">
                      <MapPin size={14} className="text-[#1E4D3B] shrink-0 mt-0.5" />
                      <span>{unit.alamat_lengkap}</span>
                    </p>

                    {/* Jam Operasional Variatif Riil */}
                    <div className="text-xs font-mono text-[#66635B] flex items-center gap-2 mb-3 bg-[#F4EFE4] px-3 py-1.5 rounded-lg border border-[#E2DACB]">
                      <Clock size={13} className="text-[#1E4D3B] shrink-0" />
                      <span>Senin–Jumat: {unit.jam_operasional.senin} | Sabtu: {unit.jam_operasional.sabtu}</span>
                    </div>

                    {/* Komoditas yang diterima */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E2DACB]">
                      <div className="flex flex-wrap gap-1.5">
                        {unit.jenis_sampah_diterima.map((j) => (
                          <span
                            key={j}
                            className="text-[10px] font-mono font-semibold bg-[#EBF2EE] text-[#1E4D3B] px-2 py-0.5 rounded-md border border-[#1E4D3B]/20"
                          >
                            {j}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/bank-sampah/${unit.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-bold text-[#D8572A] hover:text-[#B8431A] inline-flex items-center gap-1 group"
                      >
                        <span>Katalog Harga</span>
                        <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                )
              })
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 rounded-xl border border-[#E2DACB] bg-white text-xs font-bold text-[#1B1B18] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF7F2] transition-colors"
                >
                  ← Halaman Sebelumnya
                </button>
                <span className="text-xs font-mono text-[#66635B]">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-4 py-2 rounded-xl border border-[#E2DACB] bg-white text-xs font-bold text-[#1B1B18] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF7F2] transition-colors"
                >
                  Halaman Berikutnya →
                </button>
              </div>
            )}
          </div>

          {/* Kolom Kanan: Pratinjau Detail Lokasi & Geospasial Pilot (6 Kolom) */}
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <div className="bg-[#FAF7F2] border-2 border-[#1E4D3B] rounded-2xl p-6 shadow-[5px_5px_0px_#1E4D3B]">
              <div className="flex items-center justify-between border-b border-[#E2DACB] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-[#1E4D3B]" />
                  <span className="font-serif font-bold text-base text-[#1B1B18]">
                    Pratinjau Koordinat & Verifikasi
                  </span>
                </div>
                <Stempel variant="verified" label="TERVALIDASI DLH" size="sm" />
              </div>

              {activeUnit && (
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-mono text-[#D8572A] font-bold uppercase tracking-wider block">
                      {activeUnit.kabupaten_kota_nama}
                    </span>
                    <h4 className="font-serif font-bold text-lg text-[#1B1B18]">
                      {activeUnit.nama}
                    </h4>
                    <p className="text-xs text-[#66635B] mt-1 leading-relaxed">
                      {activeUnit.alamat_lengkap}
                    </p>
                  </div>

                  {/* Panel Geografis Mini */}
                  <div className="bg-[#EBF2EE] border border-[#1E4D3B]/20 rounded-xl p-4 font-mono text-xs space-y-2">
                    <div className="flex justify-between text-[#1E4D3B]">
                      <span>Koordinat Presisi:</span>
                      <span className="font-bold">{activeUnit.lat.toFixed(6)}, {activeUnit.lng.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between text-[#66635B]">
                      <span>Basis Data Verifikasi:</span>
                      <span className="text-right truncate max-w-[200px]">{activeUnit.sumber_data}</span>
                    </div>
                    <div className="flex justify-between text-[#66635B]">
                      <span>Tanggal Audit Lapangan:</span>
                      <span>{activeUnit.tanggal_verifikasi}</span>
                    </div>
                  </div>

                  {/* Narasi Kejujuran Data Pilot */}
                  <div className="bg-[#FAF7F2] border border-[#E2DACB] rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-[#66635B]">
                    <Info size={16} className="text-[#1E4D3B] shrink-0 mt-0.5" />
                    <span>
                      Unit ini beroperasi dengan timbangan digital terstandarisasi. Saldo yang diperoleh
                      dapat langsung diverifikasi lewat buku tabungan nasabah digital SIMBA.
                    </span>
                  </div>

                  {/* CTA Navigasi Peta Eksternal & Detail Lengkap */}
                  <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${activeUnit.lat},${activeUnit.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl border-2 border-[#1E4D3B] bg-white text-[#1E4D3B] font-bold text-xs hover:bg-[#EBF2EE] transition-colors"
                    >
                      <span>Buka Rute Google Maps</span>
                      <ExternalLink size={13} />
                    </a>

                    <Link
                      href={`/bank-sampah/${activeUnit.slug}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-[#1E4D3B] hover:bg-[#143528] text-white font-bold text-xs shadow-[2px_2px_0px_#143528] transition-all"
                    >
                      <span>Katalog & Jam Operasional</span>
                      <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Banner Keterbukaan Provinsi Lain */}
        <div className="mt-14 bg-[#FAF7F2] border-2 border-dashed border-[#D4CABA] rounded-2xl p-6 text-center max-w-3xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1E4D3B] block mb-1">
            Status Ekspansi Nasional Pasca-Pilot
          </span>
          <h4 className="font-serif font-bold text-base text-[#1B1B18] mb-1">
            Ingin Mendaftarkan Bank Sampah Unit di Provinsi Lain?
          </h4>
          <p className="text-xs text-[#66635B] max-w-xl mx-auto mb-4 leading-relaxed">
            SIMBA saat ini menguji coba validasi transaksi di Sumatera Utara (5 unit percontohan).
            Pengelola unit bank sampah dari 37 provinsi lain dapat mengusulkan unit baru melalui form registrasi.
          </p>
          <Link
            href="/bank-sampah"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FAF7F2] hover:bg-white text-[#1E4D3B] font-bold text-xs border border-[#1E4D3B] rounded-xl shadow-xs"
          >
            <span>Buka Direktori Lengkap & Usulkan Unit</span>
            <ChevronRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  )
}
