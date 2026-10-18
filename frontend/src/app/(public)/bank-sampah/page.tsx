'use client'

import { useState, useEffect, useTransition, Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  MapPin,
  Clock,
  Recycle,
  Filter,
  Navigation,
  CheckCircle2,
  Building2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ExternalLink,
  Sparkles,
  AlertCircle,
} from 'lucide-react'
import {
  KABUPATEN_KOTA_SUMUT,
  JENIS_SAMPAH_OPTIONS,
  FALLBACK_VERIFIED_UNITS,
  UnitBankSampah,
} from '@/lib/sumut-constants'
import api from '@/lib/api'
import UsulkanUnitModal from '@/components/modals/UsulkanUnitModal'
import AjukanProvinsiModal from '@/components/modals/AjukanProvinsiModal'

function BankSampahDirectoryContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Ambil state dari URL Search Parameters agar tautan bisa dibagikan (shareable)
  const initialQ = searchParams.get('q') || ''
  const initialKab = searchParams.get('kab') || ''
  const initialJenis = searchParams.get('jenis') || ''
  const initialBuka = searchParams.get('buka') === 'true'
  const initialSort = searchParams.get('sort') || 'nama'
  const initialPage = parseInt(searchParams.get('page') || '1', 10)

  const [q, setQ] = useState(initialQ)
  const [kab, setKab] = useState(initialKab)
  const [jenis, setJenis] = useState(initialJenis)
  const [bukaSekarang, setBukaSekarang] = useState(initialBuka)
  const [sort, setSort] = useState(initialSort)
  const [page, setPage] = useState(initialPage)

  // Geolocation state
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [locating, setLocating] = useState(false)

  // Data fetching state
  const [units, setUnits] = useState<UnitBankSampah[]>(FALLBACK_VERIFIED_UNITS)
  const [pagination, setPagination] = useState({
    total: FALLBACK_VERIFIED_UNITS.length,
    page: 1,
    limit: 9,
    totalPages: 1,
  })
  const [loading, setLoading] = useState(false)

  // Modals state
  const [isUsulModalOpen, setIsUsulModalOpen] = useState(false)
  const [isAjukanProvModalOpen, setIsAjukanProvModalOpen] = useState(false)

  // Sinkronkan state ke URL
  const updateUrlParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === '' || (key === 'page' && val === '1')) {
        params.delete(key)
      } else {
        params.set(key, val)
      }
    })
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  // Request Geolocation pengguna dengan fallback ramah
  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Peramban Anda tidak mendukung penentuan lokasi otomatis.')
      return
    }
    setLocating(true)
    setGeoError(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setUserCoords(coords)
        setSort('terdekat')
        setLocating(false)
        updateUrlParams({
          lat: coords.lat.toString(),
          lng: coords.lng.toString(),
          sort: 'terdekat',
          page: '1',
        })
      },
      (err) => {
        setLocating(false)
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError('Izin akses lokasi ditolak. Urutan kembali ke alfabetis.')
        } else {
          setGeoError('Gagal mendeteksi lokasi otomatis. Anda tetap dapat memfilter per kab/kota.')
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  // Fetch data dari API Backend dengan query terstruktur
  useEffect(() => {
    let isSubscribed = true
    setLoading(true)

    const params: Record<string, any> = {
      page,
      limit: 9,
      sort,
    }
    if (q.trim()) params.q = q.trim()
    if (kab) params.kabupaten_kota = kab
    if (jenis && jenis !== 'Semua Jenis') params.jenis_sampah = jenis
    if (bukaSekarang) params.buka_sekarang = 'true'
    if (userCoords) {
      params.lat = userCoords.lat
      params.lng = userCoords.lng
    }

    api
      .get('/unit', { params })
      .then((res) => {
        if (!isSubscribed) return
        if (res.data?.success && Array.isArray(res.data.data)) {
          setUnits(res.data.data)
          if (res.data.pagination) {
            setPagination({
              total: res.data.pagination.total,
              page: res.data.pagination.page,
              limit: res.data.pagination.limit,
              totalPages: res.data.pagination.total_pages,
            })
          }
        }
      })
      .catch(() => {
        if (!isSubscribed) return
        // Fallback filter lokal jika API offline
        let filtered = [...FALLBACK_VERIFIED_UNITS]
        if (q.trim()) {
          const t = q.toLowerCase()
          filtered = filtered.filter(
            (u) =>
              u.nama.toLowerCase().includes(t) ||
              u.alamat_lengkap.toLowerCase().includes(t) ||
              u.kabupaten_kota_nama.toLowerCase().includes(t)
          )
        }
        if (kab) {
          filtered = filtered.filter((u) => u.kabupaten_kota_kode === kab)
        }
        if (jenis && jenis !== 'Semua Jenis') {
          filtered = filtered.filter((u) =>
            u.jenis_sampah_diterima.some((j) => j.toLowerCase().includes(jenis.toLowerCase()))
          )
        }
        setUnits(filtered)
        setPagination({
          total: filtered.length,
          page: 1,
          limit: 9,
          totalPages: Math.ceil(filtered.length / 9) || 1,
        })
      })
      .finally(() => {
        if (isSubscribed) setLoading(false)
      })

    return () => {
      isSubscribed = false
    }
  }, [q, kab, jenis, bukaSekarang, sort, page, userCoords])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    updateUrlParams({ q, page: '1' })
  }

  const handleKabChange = (val: string) => {
    setKab(val)
    setPage(1)
    updateUrlParams({ kab: val, page: '1' })
  }

  const handleJenisChange = (val: string) => {
    setJenis(val)
    setPage(1)
    updateUrlParams({ jenis: val === 'Semua Jenis' ? null : val, page: '1' })
  }

  const handleBukaToggle = () => {
    const nextVal = !bukaSekarang
    setBukaSekarang(nextVal)
    setPage(1)
    updateUrlParams({ buka: nextVal ? 'true' : null, page: '1' })
  }

  const handleSortChange = (newSort: string) => {
    setSort(newSort)
    setPage(1)
    updateUrlParams({ sort: newSort, page: '1' })
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return
    setPage(newPage)
    updateUrlParams({ page: newPage.toString() })
    window.scrollTo({ top: 380, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      {/* Hero Header */}
      <div className="bg-emerald-950 text-white border-b border-emerald-900 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-800/80 text-emerald-200 text-xs font-semibold rounded-full mb-4 border border-emerald-700/60">
              <Sparkles size={14} />
              <span>Pilot Sumatera Utara — 33 Kabupaten & Kota</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
              Direktori Resmi Bank Sampah
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
              Temukan unit bank sampah terverifikasi di sekitarmu. Dilengkapi jam operasional riil,
              transparansi harga komoditas daur ulang, petunjuk arah langsung, dan integrasi WhatsApp.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsUsulModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs md:text-sm font-semibold rounded-xl transition-all shadow-sm"
              >
                <Building2 size={16} />
                <span>Usulkan Bank Sampah Baru</span>
              </button>
              <button
                onClick={() => setIsAjukanProvModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-emerald-200 hover:text-white text-xs md:text-sm font-semibold rounded-xl border border-white/15 transition-all"
              >
                <MapPin size={16} />
                <span>Ajukan Provinsi Saya (37 Provinsi)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-6">
        {/* Filter Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 mb-8">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Text Search */}
              <div className="md:col-span-5 relative">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Cari nama unit, alamat, atau kecamatan..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Kabupaten / Kota Filter */}
              <div className="md:col-span-4">
                <select
                  value={kab}
                  onChange={(e) => handleKabChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white"
                >
                  <option value="">Semua Kab/Kota (33 Sumatera Utara)</option>
                  {KABUPATEN_KOTA_SUMUT.map((k) => (
                    <option key={k.kode} value={k.kode}>
                      {k.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit & GPS Buttons */}
              <div className="md:col-span-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Filter size={16} />
                  <span>Cari</span>
                </button>
                <button
                  type="button"
                  onClick={requestUserLocation}
                  disabled={locating}
                  title="Urutkan bank sampah terdekat dari lokasi saya"
                  className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    userCoords
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Navigation size={14} className={locating ? 'animate-spin' : ''} />
                  <span className="hidden sm:inline">
                    {userCoords ? 'Lokasi Aktif' : 'Terdekat'}
                  </span>
                </button>
              </div>
            </div>

            {/* Sub-Filters: Jenis Sampah & Buka Sekarang Toggle */}
            <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                <span className="text-xs font-semibold text-slate-500 shrink-0 flex items-center gap-1">
                  <Recycle size={14} /> Jenis:
                </span>
                {JENIS_SAMPAH_OPTIONS.slice(0, 6).map((item) => {
                  const isSelected = (!jenis && item === 'Semua Jenis') || jenis === item
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => handleJenisChange(item)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
                        isSelected
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {item}
                    </button>
                  )
                })}
              </div>

              {/* Buka Sekarang & Sorting */}
              <div className="flex items-center gap-4 shrink-0">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={bukaSekarang}
                    onChange={handleBukaToggle}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <span>Buka Sekarang</span>
                </label>

                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <ArrowUpDown size={14} />
                  <select
                    value={sort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer"
                  >
                    <option value="nama">Urut: Nama (A-Z)</option>
                    {userCoords && <option value="terdekat">Urut: Terdekat</option>}
                    <option value="terbaru">Urut: Verifikasi Terbaru</option>
                  </select>
                </div>
              </div>
            </div>
          </form>

          {geoError && (
            <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{geoError}</span>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-600">
            Menampilkan <strong className="text-slate-900 font-bold">{pagination.total}</strong>{' '}
            bank sampah terverifikasi di Sumatera Utara (Pilot)
          </p>
          {isPending && <span className="text-xs text-emerald-600 animate-pulse">Memuat...</span>}
        </div>

        {/* Unit Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-4"
              >
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
                <div className="h-16 bg-slate-100 rounded" />
                <div className="h-8 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        ) : units.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Tidak Ada Bank Sampah yang Sesuai
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Tidak ditemukan unit bank sampah untuk kriteria pencarian Anda. Anda dapat mengusulkan
              bank sampah baru atau mengajukan provinsi lain.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setQ('')
                  setKab('')
                  setJenis('')
                  setBukaSekarang(false)
                  updateUrlParams({ q: null, kab: null, jenis: null, buka: null, page: '1' })
                }}
                className="w-full sm:w-auto px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Reset Semua Filter
              </button>
              <button
                onClick={() => setIsUsulModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-xl hover:bg-emerald-800 transition-colors"
              >
                Usulkan Bank Sampah
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {units.map((unit) => (
              <div
                key={unit.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6">
                  {/* Status & Verification Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 size={12} />
                      Terverifikasi
                    </span>

                    {unit.is_buka_sekarang ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Buka
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        Tutup
                      </span>
                    )}
                  </div>

                  {/* Title & Regency */}
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 mb-1">
                    <Link href={`/bank-sampah/${unit.slug}`}>{unit.nama}</Link>
                  </h2>
                  <p className="text-xs font-semibold text-emerald-800 mb-3">
                    {unit.kabupaten_kota_nama}
                  </p>

                  {/* Address */}
                  <div className="flex items-start gap-2 text-xs text-slate-500 mb-4 line-clamp-2">
                    <MapPin size={14} className="shrink-0 mt-0.5 text-slate-400" />
                    <span>{unit.alamat_lengkap}</span>
                  </div>

                  {/* Distance (if available) */}
                  {typeof unit.jarak_km === 'number' && (
                    <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200">
                      <Navigation size={12} className="text-emerald-600" />
                      <span>{unit.jarak_km} km dari lokasi Anda</span>
                    </div>
                  )}

                  {/* Waste types tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {unit.jenis_sampah_diterima?.slice(0, 4).map((j) => (
                      <span
                        key={j}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-md"
                      >
                        {j}
                      </span>
                    ))}
                    {(unit.jenis_sampah_diterima?.length || 0) > 4 && (
                      <span className="px-1.5 py-0.5 bg-slate-50 text-slate-400 text-[10px] rounded-md">
                        +{(unit.jenis_sampah_diterima?.length || 0) - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Action Card */}
                <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Clock size={13} />
                    <span className="text-[11px] truncate max-w-[140px]">
                      {unit.jam_operasional?.senin ||
                        unit.jam_operasional?.senin_jumat ||
                        'Jadwal Rutin'}
                    </span>
                  </div>
                  <Link
                    href={`/bank-sampah/${unit.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                  >
                    <span>Detail & Harga</span>
                    <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              aria-label="Halaman sebelumnya"
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pNum) => (
              <button
                key={pNum}
                onClick={() => handlePageChange(pNum)}
                className={`w-9 h-9 rounded-xl text-xs font-semibold transition-all ${
                  page === pNum
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {pNum}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= pagination.totalPages}
              aria-label="Halaman berikutnya"
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <UsulkanUnitModal
        isOpen={isUsulModalOpen}
        onClose={() => setIsUsulModalOpen(false)}
      />
      <AjukanProvinsiModal
        isOpen={isAjukanProvModalOpen}
        onClose={() => setIsAjukanProvModalOpen(false)}
      />
    </div>
  )
}

export default function BankSampahDirectoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 pt-28 pb-20 text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Memuat direktori bank sampah...</p>
        </div>
      }
    >
      <BankSampahDirectoryContent />
    </Suspense>
  )
}
