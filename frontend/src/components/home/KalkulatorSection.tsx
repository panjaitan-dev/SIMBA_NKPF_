'use client'
import { useState, useCallback } from 'react'

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

const formatRupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

export default function KalkulatorSection() {
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [berat, setBerat] = useState<Record<string, string>>({})

  const toggleItem = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const setBobotItem = useCallback((id: string, val: string) => {
    setBerat((prev) => ({ ...prev, [id]: val }))
  }, [])

  const selectedItems = JENIS_SAMPAH.filter((j) => selected[j.id])

  const results = selectedItems.reduce(
    (acc, item) => {
      const kg = parseFloat(berat[item.id] || '0') || 0
      acc.rupiah += kg * item.harga
      acc.co2 += kg * item.co2PerKg
      acc.beratTotal += kg
      return acc
    },
    { rupiah: 0, co2: 0, beratTotal: 0 }
  )

  const pohon = Math.round(results.co2 / POHON_CO2_PER_TAHUN * 10) / 10

  const kategoriList = [...new Set(JENIS_SAMPAH.map((j) => j.kategori))]

  return (
    <section id="kalkulator" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-emerald-600 font-semibold tracking-widest text-xs uppercase mb-3 block">Kalkulator Setoran</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Berapa Nilai <span className="text-emerald-600">Sampahmu?</span>
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            Pilih jenis sampah, isi berat, dan lihat estimasi rupiah yang akan kamu dapatkan beserta dampak lingkungannya.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pilihan Jenis Sampah */}
          <div className="lg:col-span-2 space-y-6">
            {kategoriList.map((kategori) => (
              <div key={kategori}>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="h-px flex-1 bg-slate-100" />
                  {kategori}
                  <span className="h-px flex-1 bg-slate-100" />
                </h3>
                <div className="space-y-2">
                  {JENIS_SAMPAH.filter((j) => j.kategori === kategori).map((item) => (
                    <div
                      key={item.id}
                      className={`border rounded-xl transition-all ${
                        selected[item.id]
                          ? 'border-emerald-400 bg-emerald-50'
                          : 'border-slate-200 hover:border-emerald-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-4 p-4">
                        <button
                          onClick={() => toggleItem(item.id)}
                          className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors ${
                            selected[item.id]
                              ? 'bg-emerald-600 border-emerald-600'
                              : 'border-slate-300'
                          }`}
                        >
                          {selected[item.id] && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 text-sm">{item.nama}</p>
                          <p className="text-xs text-amber-600 font-bold mt-0.5">
                            {formatRupiah(item.harga)}/{item.satuan}
                          </p>
                        </div>
                        {selected[item.id] && (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={berat[item.id] || ''}
                              onChange={(e) => setBobotItem(item.id, e.target.value)}
                              placeholder="0"
                              min="0"
                              step="0.1"
                              className="w-24 px-3 py-1.5 border border-emerald-300 rounded-lg text-sm text-right outline-none focus:border-emerald-500 bg-white"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className="text-xs text-slate-500 w-8">{item.satuan}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Hasil Kalkulasi */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-2xl p-6 text-white">
                <h3 className="text-sm font-semibold text-emerald-300 uppercase tracking-widest mb-6">Estimasi Setoran</h3>

                {selectedItems.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400">
                        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/>
                      </svg>
                    </div>
                    <p className="text-slate-400 text-sm">Pilih jenis sampah dan isi berat untuk melihat estimasi.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Total Rupiah */}
                    <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4">
                      <p className="text-xs text-amber-300 font-semibold mb-1">💰 Estimasi Rupiah</p>
                      <p className="text-3xl font-extrabold text-amber-400 tabular-nums">
                        {formatRupiah(results.rupiah)}
                      </p>
                    </div>

                    {/* CO2 */}
                    <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4">
                      <p className="text-xs text-emerald-300 font-semibold mb-1">🌿 CO₂ Dihemat</p>
                      <p className="text-2xl font-extrabold text-emerald-300 tabular-nums">
                        {results.co2.toFixed(1)} <span className="text-sm font-normal">kg CO₂</span>
                      </p>
                    </div>

                    {/* Pohon */}
                    <div className="bg-white/10 border border-white/20 rounded-xl p-4">
                      <p className="text-xs text-slate-300 font-semibold mb-1">🌳 Setara Pohon</p>
                      <p className="text-2xl font-extrabold tabular-nums">
                        {pohon} <span className="text-sm font-normal text-slate-400">pohon/tahun</span>
                      </p>
                    </div>

                    {/* Detail per jenis */}
                    <div className="border-t border-white/10 pt-4 space-y-2">
                      {selectedItems.map((item) => {
                        const kg = parseFloat(berat[item.id] || '0') || 0
                        return (
                          <div key={item.id} className="flex justify-between text-xs">
                            <span className="text-slate-400 truncate max-w-[140px]">{item.nama}</span>
                            <span className="text-white font-semibold ml-2">{formatRupiah(kg * item.harga)}</span>
                          </div>
                        )
                      })}
                      <div className="flex justify-between text-sm font-bold border-t border-white/10 pt-2 mt-2">
                        <span className="text-slate-300">Total Berat</span>
                        <span className="text-white">{results.beratTotal.toFixed(1)} kg</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      * Harga estimasi berdasarkan harga beli rata-rata bank sampah. Harga aktual dapat berbeda sesuai kondisi sampah.
                    </p>
                  </div>
                )}
              </div>

              {results.rupiah > 0 && (
                <a
                  href="/register"
                  className="mt-4 flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
                >
                  Daftar Sekarang & Mulai Menabung
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
