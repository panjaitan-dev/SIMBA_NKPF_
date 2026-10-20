'use client'

import { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  TrendingUp,
  TreePine,
  Coins,
  Weight,
  CheckCircle2,
  Receipt,
  Scale,
  Leaf,
} from 'lucide-react'
import { Stempel } from '@/components/ui/stempel'

interface KomoditasSampah {
  id: string
  nama: string
  harga: number
  co2PerKg: number
  satuan: string
  kategori: string
}

const JENIS_SAMPAH: KomoditasSampah[] = [
  { id: 'pet', nama: 'Botol PET Bening (Air Mineral)', harga: 4800, co2PerKg: 2.1, satuan: 'kg', kategori: 'Plastik' },
  { id: 'hdpe', nama: 'Plastik HDPE / Emberan Keras', harga: 4000, co2PerKg: 1.8, satuan: 'kg', kategori: 'Plastik' },
  { id: 'kardus', nama: 'Kardus Box Cokelat', harga: 2500, co2PerKg: 1.1, satuan: 'kg', kategori: 'Kertas' },
  { id: 'hvs', nama: 'Kertas HVS / Koran Bekas', harga: 1800, co2PerKg: 0.9, satuan: 'kg', kategori: 'Kertas' },
  { id: 'aluminium', nama: 'Kaleng Minuman Aluminium', harga: 18000, co2PerKg: 9.0, satuan: 'kg', kategori: 'Logam' },
  { id: 'besi', nama: 'Besi Padu / Pipa Tua', harga: 6000, co2PerKg: 1.5, satuan: 'kg', kategori: 'Logam' },
  { id: 'tembaga', nama: 'Tembaga Kabel Kupas', harga: 85000, co2PerKg: 4.5, satuan: 'kg', kategori: 'Logam' },
  { id: 'kaca', nama: 'Botol Kaca Utuh / Beling', harga: 600, co2PerKg: 0.5, satuan: 'kg', kategori: 'Kaca' },
  { id: 'jelantah', nama: 'Minyak Jelantah Saring', harga: 7500, co2PerKg: 2.8, satuan: 'liter', kategori: 'Lainnya' },
]

const POHON_CO2_PER_TAHUN = 21 // kg CO2 serapan rata-rata per pohon per tahun

const formatRupiah = (n: number) => `Rp ${Math.round(n).toLocaleString('id-ID')}`

const formatDesimalId = (n: number, maxDec = 1) =>
  n.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: maxDec })

export default function KalkulatorSection() {
  // Pilihan awal default realistis: Botol PET 3kg & Kardus 5kg
  const [selected, setSelected] = useState<Record<string, boolean>>({
    pet: true,
    kardus: true,
  })
  const [berat, setBerat] = useState<Record<string, string>>({
    pet: '3',
    kardus: '5',
  })

  const toggleItem = (id: string) => {
    setSelected((prev) => {
      const isNowChecked = !prev[id]
      if (isNowChecked && !berat[id]) {
        setBerat((b) => ({ ...b, [id]: '1' }))
      }
      return { ...prev, [id]: isNowChecked }
    })
  }

  const setBobotItem = useCallback((id: string, val: string) => {
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
        const qty = parseFloat(berat[item.id] || '0') || 0
        acc.rupiah += qty * item.harga
        acc.co2 += qty * item.co2PerKg
        acc.beratTotal += qty
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
    <section id="kalkulator" className="py-20 sm:py-24 bg-[#F4EFE4] border-b border-[#E2DACB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#D8572A] block mb-2">
            Simulasi Buku Tabungan
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B1B18] tracking-tight">
            Kalkulator Setoran <span className="text-[#1E4D3B]">Sampah Terpilah</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#66635B] leading-relaxed">
            Centang komoditas yang siap disetor di rumah Anda, tentukan taksiran kilogram, dan amati
            langsung lembar nota penerimaan beserta estimasi saldo rupiah yang akan Anda kantongi.
          </p>
        </div>

        {/* Grid 2 Kolom: Pilihan Komoditas (Kiri) & Nota Tabungan Fisik (Kanan) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Kolom Kiri: Pemilihan Jenis Sampah & Berat (7 Kolom) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#FAF7F2] border-2 border-[#E2DACB] rounded-2xl p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2DACB]">
                <div className="flex items-center gap-2">
                  <Scale size={18} className="text-[#1E4D3B]" />
                  <span className="font-serif font-bold text-[#1B1B18] text-base">
                    Daftar Komoditas Sampah Rumah Tangga
                  </span>
                </div>
                <span className="text-xs font-mono text-[#66635B]">
                  {selectedItems.length} jenis dipilih
                </span>
              </div>

              {/* Kelompok Kategori */}
              <div className="space-y-6">
                {kategoriList.map((kat) => {
                  const itemsInKat = JENIS_SAMPAH.filter((j) => j.kategori === kat)
                  return (
                    <div key={kat} className="space-y-2.5">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1E4D3B]">
                        Kategori {kat}
                      </h4>
                      <div className="space-y-2">
                        {itemsInKat.map((item) => {
                          const isChecked = !!selected[item.id]
                          return (
                            <div
                              key={item.id}
                              onClick={() => toggleItem(item.id)}
                              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                                isChecked
                                  ? 'bg-[#EBF2EE] border-[#1E4D3B] shadow-xs'
                                  : 'bg-[#FAF7F2] border-[#E2DACB] hover:border-[#D4CABA]'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                                    isChecked
                                      ? 'bg-[#1E4D3B] border-[#1E4D3B] text-white'
                                      : 'bg-white border-[#D4CABA]'
                                  }`}
                                >
                                  {isChecked && <CheckCircle2 size={14} className="stroke-[3]" />}
                                </div>
                                <div>
                                  <span className="text-sm font-semibold text-[#1B1B18] block leading-tight">
                                    {item.nama}
                                  </span>
                                  <span className="text-xs font-mono text-[#66635B]">
                                    Acuan: {formatRupiah(item.harga)} / {item.satuan}
                                  </span>
                                </div>
                              </div>

                              {/* Input Berat (Kg) jika dipilih */}
                              {isChecked && (
                                <div
                                  className="flex items-center gap-2 self-end sm:self-center bg-white px-2.5 py-1 rounded-lg border border-[#1E4D3B]"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <label htmlFor={`berat-${item.id}`} className="text-xs font-mono text-[#66635B]">
                                    Berat:
                                  </label>
                                  <input
                                    id={`berat-${item.id}`}
                                    type="number"
                                    min="0.1"
                                    step="0.5"
                                    value={berat[item.id] || ''}
                                    onChange={(e) => setBobotItem(item.id, e.target.value)}
                                    placeholder="0"
                                    className="w-16 text-right font-mono font-bold text-sm text-[#1B1B18] outline-none"
                                  />
                                  <span className="text-xs font-mono text-[#66635B]">{item.satuan}</span>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Tampilan Fisik KomponenNota (5 Kolom) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-[#FAF7F2] border-2 border-[#1E4D3B] rounded-2xl p-6 shadow-[5px_5px_0px_#1E4D3B] relative overflow-hidden">
              {/* Header Nota */}
              <div className="text-center border-b-2 border-dashed border-[#D4CABA] pb-4 mb-4">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Receipt size={18} className="text-[#1E4D3B]" />
                  <span className="font-serif font-black text-base tracking-tight text-[#1E4D3B]">
                    LEMBAR ESTIMASI SETORAN
                  </span>
                </div>
                <p className="text-[11px] font-mono text-[#66635B]">
                  Simulasi Rekening Nasabah SIMBA Nusantara
                </p>
                <p className="text-[10px] font-mono text-[#66635B]">
                  No. Seri: SIM-EST-2026-X09
                </p>
              </div>

              {selectedItems.length === 0 ? (
                <div className="py-12 text-center text-[#66635B] space-y-2">
                  <Scale size={28} className="mx-auto text-[#D4CABA]" />
                  <p className="text-sm font-semibold text-[#1B1B18]">Belum ada komoditas dipilih</p>
                  <p className="text-xs">Centang minimal satu jenis sampah di sebelah kiri untuk melihat nota simulasi.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Ledger Rincian Tabel */}
                  <div className="space-y-2 font-mono text-xs border-b-2 border-dashed border-[#D4CABA] pb-4 max-h-56 overflow-y-auto pr-1">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-[#66635B] pb-1 border-b border-[#E2DACB]">
                      <span>Komoditas / Volume</span>
                      <span>Subtotal</span>
                    </div>

                    {selectedItems.map((item) => {
                      const qty = parseFloat(berat[item.id] || '0') || 0
                      const subtotal = qty * item.harga
                      return (
                        <div key={item.id} className="flex justify-between items-center py-1 border-b border-[#FAF7F2]">
                          <span className="text-[#1B1B18] truncate max-w-[180px]">
                            {item.nama} ({formatDesimalId(qty)} {item.satuan})
                          </span>
                          <span className="font-bold text-[#1E4D3B] whitespace-nowrap ml-2">
                            {formatRupiah(subtotal)}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Ringkasan Total & Stempel Simulasi */}
                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#66635B] block">
                        Estimasi Saldo Masuk ({formatDesimalId(results.beratTotal)} kg)
                      </span>
                      <span className="font-mono text-3xl font-black text-[#D8572A]">
                        {formatRupiah(results.rupiah)}
                      </span>
                    </div>

                    <Stempel variant="simulation" label="DATA SIMULASI" size="sm" />
                  </div>

                  {/* Nilai Dampak Lingkungan */}
                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    <div className="bg-[#EBF2EE] border border-[#1E4D3B]/20 rounded-xl p-2.5">
                      <span className="text-[10px] font-mono text-[#1E4D3B] block">Jejak Karbon Dicegah:</span>
                      <span className="font-mono font-bold text-xs text-[#1E4D3B]">
                        {formatDesimalId(results.co2)} kg CO₂
                      </span>
                    </div>
                    <div className="bg-[#FDF1EC] border border-[#D8572A]/20 rounded-xl p-2.5">
                      <span className="text-[10px] font-mono text-[#D8572A] block">Setara Serapan:</span>
                      <span className="font-mono font-bold text-xs text-[#D8572A]">
                        {formatDesimalId(pohon)} Pohon/Thn
                      </span>
                    </div>
                  </div>

                  {/* Tombol Aksi Nyata: Daftar Nasabah */}
                  <div className="pt-2">
                    <Link
                      href="/register"
                      className="w-full flex items-center justify-center gap-2 bg-[#D8572A] hover:bg-[#B8431A] text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-[2px_2px_0px_#1B1B18] active:translate-x-0.5 active:translate-y-0.5 transition-all text-center"
                    >
                      <span>Buka Tabungan & Setor ke Unit</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
