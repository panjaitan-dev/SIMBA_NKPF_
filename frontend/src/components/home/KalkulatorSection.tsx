'use client'

import { useState, useCallback, useMemo } from 'react'
import {
  ArrowRight,
  TrendingUp,
  Sparkles,
  TreePine,
  DollarSign,
  CloudSun,
  Weight,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react'

const JENIS_SAMPAH = [
  { id: 'pet', nama: 'Botol PET Bening', harga: 4800, co2PerKg: 2.1, satuan: 'kg', kategori: 'Plastik' },
  { id: 'hdpe', nama: 'Plastik HDPE / Emberan', harga: 4000, co2PerKg: 1.8, satuan: 'kg', kategori: 'Plastik' },
  { id: 'kardus', nama: 'Kardus Box Cokelat', harga: 2500, co2PerKg: 1.1, satuan: 'kg', kategori: 'Kertas' },
  { id: 'hvs', nama: 'Kertas HVS / Koran', harga: 1800, co2PerKg: 0.9, satuan: 'kg', kategori: 'Kertas' },
  { id: 'aluminium', nama: 'Kaleng Aluminium', harga: 18000, co2PerKg: 9.0, satuan: 'kg', kategori: 'Logam' },
  { id: 'besi', nama: 'Besi Padu / Bangunan', harga: 6000, co2PerKg: 1.5, satuan: 'kg', kategori: 'Logam' },
  { id: 'tembaga', nama: 'Tembaga Super', harga: 85000, co2PerKg: 4.5, satuan: 'kg', kategori: 'Logam' },
  { id: 'kaca', nama: 'Kaca / Botol Bening', harga: 500, co2PerKg: 0.5, satuan: 'kg', kategori: 'Lainnya' },
  { id: 'jelantah', nama: 'Minyak Jelantah', harga: 9000, co2PerKg: 2.8, satuan: 'liter', kategori: 'Lainnya' },
]

const POHON_CO2_PER_TAHUN = 21 // kg CO2 per pohon per tahun

// Format Rupiah Indonesia Standar: "Rp 125.000"
const formatRupiah = (n: number) => `Rp ${Math.round(n).toLocaleString('id-ID')}`

// Format Desimal Indonesia Standar (koma EYD): "2,5 kg"
const formatDesimalId = (n: number, maxDec = 1) =>
  n.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: maxDec })

export default function KalkulatorSection() {
  // Awalnya kosong (0) sesuai permintaan pengguna: tidak langsung terisi data simulasi
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [berat, setBerat] = useState<Record<string, string>>({})

  const toggleItem = (id: string) => {
    setSelected((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      // Jika baru dicentang dan belum ada bobot, isi default 1 agar mempermudah pengguna
      if (next[id] && !berat[id]) {
        setBerat((b) => ({ ...b, [id]: '1' }))
      }
      return next
    })
  }

  const setBobotItem = useCallback((id: string, val: string) => {
    // Dukung input koma maupun titik dari pengguna Indonesia
    const clean = val.replace(',', '.')
    setBerat((prev) => ({ ...prev, [id]: clean }))
  }, [])

  const selectedItems = useMemo(
    () => JENIS_SAMPAH.filter((j) => selected[j.id]),
    [selected]
  )

  const results = useMemo(() => {
    return selectedItems.reduce(
      (acc, item) => {
        const kg = parseFloat(berat[item.id] || '0') || 0
        acc.rupiah += kg * item.harga
        acc.co2 += kg * item.co2PerKg
        acc.beratTotal += kg
        return acc
      },
      { rupiah: 0, co2: 0, beratTotal: 0 }
    )
  }, [selectedItems, berat])

  const pohon = useMemo(
    () => Math.round((results.co2 / POHON_CO2_PER_TAHUN) * 10) / 10,
    [results.co2]
  )

  const kategoriList = useMemo(() => [...new Set(JENIS_SAMPAH.map((j) => j.kategori))], [])

  return (
    <section id="kalkulator" className="py-20 sm:py-24 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-emerald-700 font-bold tracking-widest text-xs uppercase mb-2 block">
            Kalkulator Dampak Ekonomi & Lingkungan
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Berapa Nilai Tabungan dari <span className="text-emerald-600">Sampah Rumah Tanggamu?</span>
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
            Pilih komoditas sampah terpilah di rumah Anda, isi taksiran berat, dan amati langsung konversi
            rupiah ke buku tabungan serta kontribusi pengurangan jejak karbon bumi.
          </p>
        </div>

        {/* DIAGRAM ALIR HORIZONTAL DAMPAK LINGKUNGAN HIDUP */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/90 mb-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sparkles size={14} className="text-emerald-600" />
              Alur Manfaat Ekonomi Sirkular (Siklus Daur Ulang)
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Kalkulasi Dinamis
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative">
            {/* Step 1: Berat Sampah */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between relative group hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-between text-slate-500 mb-3">
                <span className="text-xs font-semibold">1. Sampah Terpilah</span>
                <Weight size={18} className="text-slate-700" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">
                  {formatDesimalId(results.beratTotal)}{' '}
                  <span className="text-xs font-normal text-slate-500">kg</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Material siap setor</p>
              </div>
              <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                <ChevronRight size={22} />
              </div>
            </div>

            {/* Step 2: Saldo Rupiah */}
            <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200 flex flex-col justify-between relative group hover:border-emerald-400 transition-colors">
              <div className="flex items-center justify-between text-emerald-800 mb-3">
                <span className="text-xs font-semibold">2. Nilai Saldo Kas</span>
                <DollarSign size={18} className="text-emerald-700" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-800">
                  {formatRupiah(results.rupiah)}
                </div>
                <p className="text-xs text-emerald-700 mt-1">Langsung masuk tabungan</p>
              </div>
              <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-emerald-300">
                <ChevronRight size={22} />
              </div>
            </div>

            {/* Step 3: Emisi CO2 Dicegah */}
            <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-200 flex flex-col justify-between relative group hover:border-blue-400 transition-colors">
              <div className="flex items-center justify-between text-blue-800 mb-3">
                <span className="text-xs font-semibold">3. Emisi Karbon Dicegah</span>
                <CloudSun size={18} className="text-blue-700" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-blue-900">
                  {formatDesimalId(results.co2)}{' '}
                  <span className="text-xs font-normal text-blue-600">kg CO₂</span>
                </div>
                <p className="text-xs text-blue-700 mt-1">Mencegah efek rumah kaca</p>
              </div>
              <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-blue-300">
                <ChevronRight size={22} />
              </div>
            </div>

            {/* Step 4: Setara Pohon Ditanam */}
            <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200 flex flex-col justify-between group hover:border-amber-400 transition-colors">
              <div className="flex items-center justify-between text-amber-800 mb-3">
                <span className="text-xs font-semibold">4. Daya Serap Pohon</span>
                <TreePine size={18} className="text-amber-700" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-amber-900">
                  {formatDesimalId(pohon)}{' '}
                  <span className="text-xs font-normal text-amber-700">Pohon</span>
                </div>
                <p className="text-xs text-amber-700 mt-1">Setara serapan pohon / tahun</p>
              </div>
            </div>
          </div>
        </div>

        {/* Input Selector & Kotak Ringkasan */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Pilihan Komoditas Sampah (Kolom Kiri) */}
          <div className="lg:col-span-7 space-y-6">
            {kategoriList.map((kategori) => (
              <div key={kategori} className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span>Kategori {kategori}</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    Pilih & tentukan berat (kg/liter)
                  </span>
                </h3>

                <div className="space-y-3">
                  {JENIS_SAMPAH.filter((j) => j.kategori === kategori).map((item) => {
                    const isChecked = Boolean(selected[item.id])
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={`rounded-xl border p-3.5 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isChecked
                            ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleItem(item.id)
                            }}
                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                              isChecked
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isChecked && <CheckCircle2 size={16} />}
                          </button>
                          <div className="truncate">
                            <p className="font-semibold text-slate-900 text-sm truncate">{item.nama}</p>
                            <p className="text-xs text-emerald-700 font-bold">
                              {formatRupiah(item.harga)} / {item.satuan}
                            </p>
                          </div>
                        </div>

                        {isChecked && (
                          <div
                            className="flex items-center gap-2 flex-shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <label className="sr-only" htmlFor={`input-berat-${item.id}`}>
                              Berat {item.nama}
                            </label>
                            <input
                              id={`input-berat-${item.id}`}
                              type="number"
                              min="0"
                              step="0.5"
                              value={berat[item.id] || ''}
                              onChange={(e) => setBobotItem(item.id, e.target.value)}
                              placeholder="0"
                              className="w-20 px-3 py-1.5 text-right font-bold text-slate-800 bg-white border border-emerald-400 rounded-lg text-sm focus:ring-2 focus:ring-emerald-200 outline-none"
                            />
                            <span className="text-xs text-slate-500 font-medium w-6">{item.satuan}</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Rincian Finansial & Dampak (Kolom Kanan) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                <div>
                  <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">
                    Buku Rekening Simulasi
                  </span>
                  <h3 className="text-xl font-black text-white">Ringkasan Nilai Sampah</h3>
                </div>
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <TrendingUp size={20} />
                </div>
              </div>

              <div className="space-y-4">
                {/* Estimasi Saldo Kasir */}
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4">
                  <span className="text-xs text-emerald-300 font-semibold block mb-1">
                    Estimasi Nilai Tukar Tunai / Tabungan
                  </span>
                  <div className="text-3xl font-extrabold text-emerald-400 tabular-nums">
                    {formatRupiah(results.rupiah)}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Dihitung dari {formatDesimalId(results.beratTotal)} kg komoditas terpilah
                  </span>
                </div>

                {/* List Item Rincian */}
                <div className="space-y-2 border-y border-slate-800 py-3 max-h-48 overflow-y-auto pr-1">
                  {selectedItems.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">
                      Belum ada komoditas dipilih. Silakan centang jenis sampah di sebelah kiri untuk mulai menghitung estimasi nilai tabungan.
                    </p>
                  ) : (
                    selectedItems.map((item) => {
                      const kg = parseFloat(berat[item.id] || '0') || 0
                      const subtotal = kg * item.harga
                      return (
                        <div key={item.id} className="flex items-center justify-between text-xs py-1">
                          <span className="text-slate-300 truncate max-w-[170px]">
                            {item.nama} ({formatDesimalId(kg)} {item.satuan})
                          </span>
                          <span className="font-bold text-slate-100 ml-2">
                            {formatRupiah(subtotal)}
                          </span>
                        </div>
                      )
                    })
                  )}
                </div>

                {/* Metrik Emisi & Pohon */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
                    <span className="text-[11px] text-slate-400 block mb-0.5">Emisi Dicegah:</span>
                    <span className="font-bold text-blue-400 text-sm">
                      {formatDesimalId(results.co2)} kg CO₂
                    </span>
                  </div>
                  <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
                    <span className="text-[11px] text-slate-400 block mb-0.5">Setara Serapan:</span>
                    <span className="font-bold text-amber-400 text-sm">
                      {formatDesimalId(pohon)} Pohon/Thn
                    </span>
                  </div>
                </div>

                {/* CTA Link Pendaftaran */}
                <div className="pt-2">
                  <a
                    href="/register"
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-emerald-900/40"
                  >
                    <span>Buka Tabungan & Setor Sekarang</span>
                    <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
