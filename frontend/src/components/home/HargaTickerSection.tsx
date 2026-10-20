'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowUpDown,
  Filter,
  Receipt,
  Scale,
  Calendar,
  Info,
  ChevronRight,
  TrendingUp,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface HargaAcuanItem {
  kode: string
  nama: string
  kategori: string
  harga_beli: number
  satuan: string
  keterangan: string
  tanggal_acuan: string
}

const KATALOG_HARGA_SIMULASI: HargaAcuanItem[] = [
  {
    kode: 'PL-01',
    nama: 'Botol Plastik PET Bening Bersih',
    kategori: 'Plastik',
    harga_beli: 4800,
    satuan: 'kg',
    keterangan: 'Tanpa tutup & label, kondisi kering kempa',
    tanggal_acuan: '10 Okt 2026',
  },
  {
    kode: 'PL-02',
    nama: 'Plastik HDPE Keras / Emberan',
    kategori: 'Plastik',
    harga_beli: 4000,
    satuan: 'kg',
    keterangan: 'Wadah detergen, jeriken, ember pecah',
    tanggal_acuan: '10 Okt 2026',
  },
  {
    kode: 'KT-01',
    nama: 'Kardus Box Cokelat Bergelombang',
    kategori: 'Kertas',
    harga_beli: 2500,
    satuan: 'kg',
    keterangan: 'Kering, lipat rapi, bebas lakban tebal',
    tanggal_acuan: '10 Okt 2026',
  },
  {
    kode: 'KT-02',
    nama: 'Kertas Arsip HVS Putih / Buku',
    kategori: 'Kertas',
    harga_beli: 2200,
    satuan: 'kg',
    keterangan: 'Bebas sampul plastik dan staples besi',
    tanggal_acuan: '10 Okt 2026',
  },
  {
    kode: 'LG-01',
    nama: 'Tembaga Kabel Kupas Super',
    kategori: 'Logam',
    harga_beli: 85000,
    satuan: 'kg',
    keterangan: 'Kawat tembaga murni tanpa isolator',
    tanggal_acuan: '10 Okt 2026',
  },
  {
    kode: 'LG-02',
    nama: 'Kaleng Minuman Aluminium Ringan',
    kategori: 'Logam',
    harga_beli: 18000,
    satuan: 'kg',
    keterangan: 'Kering, kempeskan untuk efisiensi ruang',
    tanggal_acuan: '10 Okt 2026',
  },
  {
    kode: 'LG-03',
    nama: 'Besi Padu / Pipa Konstruksi',
    kategori: 'Logam',
    harga_beli: 6000,
    satuan: 'kg',
    keterangan: 'Besi tebal padat bebas karat rapuh',
    tanggal_acuan: '10 Okt 2026',
  },
  {
    kode: 'KC-01',
    nama: 'Botol Beling Utuh / Kaca Bening',
    kategori: 'Kaca',
    harga_beli: 600,
    satuan: 'kg',
    keterangan: 'Kondisi utuh tidak pecah berantakan',
    tanggal_acuan: '10 Okt 2026',
  },
  {
    kode: 'LN-01',
    nama: 'Minyak Jelantah Rumah Tangga',
    kategori: 'Lainnya',
    harga_beli: 7500,
    satuan: 'liter',
    keterangan: 'Sudah disaring dari sisa remah makanan',
    tanggal_acuan: '10 Okt 2026',
  },
]

const formatRupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`

export default function HargaTickerSection() {
  const [filterKategori, setFilterKategori] = useState('Semua')
  const [sortBy, setSortBy] = useState<'harga_beli' | 'nama'>('harga_beli')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const kategoriList = ['Semua', 'Plastik', 'Kertas', 'Logam', 'Kaca', 'Lainnya']

  const toggleSort = (field: 'harga_beli' | 'nama') => {
    if (sortBy === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortDir('desc')
    }
  }

  const filteredData = useMemo(() => {
    return KATALOG_HARGA_SIMULASI.filter(
      (item) => filterKategori === 'Semua' || item.kategori === filterKategori
    ).sort((a, b) => {
      const multiplier = sortDir === 'asc' ? 1 : -1
      if (sortBy === 'nama') {
        return a.nama.localeCompare(b.nama) * multiplier
      }
      return (a.harga_beli - b.harga_beli) * multiplier
    })
  }, [filterKategori, sortBy, sortDir])

  return (
    <section id="harga" className="py-20 sm:py-24 bg-[#F4EFE4] border-b border-[#E2DACB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#D8572A]">
                Papan Harga Acuan
              </span>
              <Badge variant="simulation">Data Simulasi</Badge>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B1B18] tracking-tight">
              Bursa Komoditas <span className="text-[#1E4D3B]">Bank Sampah</span>
            </h2>
            <p className="mt-2 text-sm text-[#66635B] max-w-xl">
              Harga acuan simulasi transaksi penyetoran nasabah di tingkat unit percontohan.
              Diperbarui berkala mengikuti harga pasar daur ulang.
            </p>
          </div>

          {/* Tanggal Pembaruan yang Jujur & Tanpa Label "Live" */}
          <div className="bg-[#FAF7F2] border border-[#E2DACB] rounded-2xl px-4 py-3 flex items-center gap-3 shrink-0 shadow-xs">
            <Calendar size={18} className="text-[#1E4D3B]" />
            <div className="text-xs font-mono">
              <span className="text-[#66635B] block">Katalog Berlaku:</span>
              <strong className="text-[#1B1B18]">10 Oktober 2026</strong>
            </div>
          </div>
        </div>

        {/* Filter Kategori & Pengendali */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Pill Kategori */}
          <div className="flex flex-wrap gap-2">
            {kategoriList.map((kat) => {
              const isActive = filterKategori === kat
              return (
                <button
                  key={kat}
                  type="button"
                  onClick={() => setFilterKategori(kat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1E4D3B] text-white shadow-xs'
                      : 'bg-[#FAF7F2] border border-[#E2DACB] text-[#66635B] hover:text-[#1B1B18]'
                  }`}
                >
                  {kat}
                </button>
              )
            })}
          </div>

          {/* Info Jumlah */}
          <span className="text-xs font-mono text-[#66635B]">
            {filteredData.length} komoditas terdaftar
          </span>
        </div>

        {/* Tabel Ledger Harga Kertas / Buku Kas */}
        <div className="bg-[#FAF7F2] border-2 border-[#1E4D3B] rounded-2xl shadow-[4px_4px_0px_#1E4D3B] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#EBF2EE] border-b-2 border-[#1E4D3B] font-mono text-[11px] uppercase tracking-wider text-[#1E4D3B]">
                <tr>
                  <th className="py-3 px-4 font-bold">Kode</th>
                  <th
                    className="py-3 px-4 font-bold cursor-pointer hover:bg-[#FAF7F2] transition-colors"
                    onClick={() => toggleSort('nama')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Komoditas Sampah</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-bold hidden sm:table-cell">Kategori</th>
                  <th className="py-3 px-4 font-bold hidden md:table-cell">Kriteria Sortir</th>
                  <th
                    className="py-3 px-4 font-bold text-right cursor-pointer hover:bg-[#FAF7F2] transition-colors"
                    onClick={() => toggleSort('harga_beli')}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Harga Beli (Tunai/Saldo)</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DACB] font-mono">
                {filteredData.map((item) => (
                  <tr key={item.kode} className="hover:bg-[#F4EFE4] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#66635B] whitespace-nowrap">
                      {item.kode}
                    </td>
                    <td className="py-3.5 px-4 font-sans font-bold text-[#1B1B18]">
                      {item.nama}
                      <span className="block sm:hidden text-[10px] font-mono text-[#66635B] mt-0.5">
                        {item.kategori} • {item.satuan}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 hidden sm:table-cell text-[#1E4D3B] font-semibold">
                      {item.kategori}
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell text-[#66635B] font-sans text-xs">
                      {item.keterangan}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className="text-sm sm:text-base font-black text-[#D8572A]">
                        {formatRupiah(item.harga_beli)}
                      </span>
                      <span className="text-[11px] text-[#66635B] ml-1">/ {item.satuan}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Keterangan Tabel */}
          <div className="p-4 bg-[#FAF7F2] border-t border-[#E2DACB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#66635B]">
            <div className="flex items-center gap-1.5">
              <Info size={14} className="text-[#1E4D3B] shrink-0" />
              <span>Harga akhir ditentukan saat penimbangan oleh petugas unit berdasarkan kebersihan komoditas.</span>
            </div>
            <Link
              href="#kalkulator"
              className="font-bold text-[#1E4D3B] hover:text-[#D8572A] inline-flex items-center gap-1 shrink-0"
            >
              <span>Hitung Nilai di Kalkulator</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
