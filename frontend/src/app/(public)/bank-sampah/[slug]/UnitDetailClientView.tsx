'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  MapPin,
  Clock,
  CheckCircle2,
  Phone,
  MessageCircle,
  Navigation,
  ArrowLeft,
  AlertTriangle,
  UserPlus,
  Coins,
  ShieldCheck,
  Calendar,
  FileCheck,
  ExternalLink,
} from 'lucide-react'
import { UnitBankSampah } from '@/lib/sumut-constants'
import LaporKeliruModal from '@/components/modals/LaporKeliruModal'

interface UnitDetailClientViewProps {
  unit: UnitBankSampah
}

export default function UnitDetailClientView({ unit }: UnitDetailClientViewProps) {
  const [isLaporModalOpen, setIsLaporModalOpen] = useState(false)

  // Format nomor WhatsApp & Telepon
  const rawWa = unit.whatsapp_publik || unit.telepon_publik || ''
  const cleanWa = rawWa.replace(/\D/g, '').replace(/^0/, '62')
  const cleanTel = rawWa.replace(/\D/g, '')

  // Google Maps Directions URL
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${unit.lat},${unit.lng}`

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      {/* Breadcrumbs & Navigation */}
      <div className="bg-white border-b border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/bank-sampah"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Direktori</span>
          </Link>

          <button
            onClick={() => setIsLaporModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors"
          >
            <AlertTriangle size={14} />
            <span>Laporkan Data Keliru</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Unit Header Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  Terverifikasi — {unit.tanggal_verifikasi}
                </span>

                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  {unit.kode}
                </span>

                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900 text-emerald-200">
                  {unit.kabupaten_kota_nama}
                </span>
              </div>

              <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                {unit.nama}
              </h1>

              <div className="flex items-start gap-2 text-sm text-slate-600 max-w-2xl">
                <MapPin size={18} className="text-slate-400 shrink-0 mt-0.5" />
                <span>{unit.alamat_lengkap}</span>
              </div>
            </div>

            {/* Quick Action CTA Bar */}
            <div className="flex flex-wrap sm:flex-nowrap gap-2.5 shrink-0">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs md:text-sm font-semibold rounded-xl transition-all shadow-sm"
              >
                <Navigation size={16} />
                <span>Petunjuk Arah</span>
              </a>

              {cleanWa && (
                <a
                  href={`https://wa.me/${cleanWa}?text=Halo%20${encodeURIComponent(unit.nama)},%20saya%20ingin%20bertanya%20mengenai%20layanan%20penyetoran%20sampah.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs md:text-sm font-semibold rounded-xl transition-all"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp</span>
                </a>
              )}

              {cleanTel && (
                <a
                  href={`tel:${cleanTel}`}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs md:text-sm font-semibold rounded-xl transition-all"
                >
                  <Phone size={16} />
                  <span>Telepon</span>
                </a>
              )}

              <Link
                href={`/register?unit=${unit.slug}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs md:text-sm font-semibold rounded-xl transition-all shadow-sm"
              >
                <UserPlus size={16} />
                <span>Daftar di Unit Ini</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Jam Operasional & Jenis Sampah */}
          <div className="lg:col-span-5 space-y-8">
            {/* Jam Operasional Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <Clock size={18} className="text-emerald-700" />
                <h2 className="text-base font-bold text-slate-900">Jam Operasional Unit</h2>
              </div>

              <div className="space-y-2.5 text-xs md:text-sm">
                {[
                  { hari: 'Senin', key: 'senin' },
                  { hari: 'Selasa', key: 'selasa' },
                  { hari: 'Rabu', key: 'rabu' },
                  { hari: 'Kamis', key: 'kamis' },
                  { hari: 'Jumat', key: 'jumat' },
                  { hari: 'Sabtu', key: 'sabtu' },
                  { hari: 'Minggu', key: 'minggu' },
                ].map(({ hari, key }) => {
                  const jam =
                    unit.jam_operasional?.[key] ||
                    unit.jam_operasional?.senin_jumat ||
                    (key === 'minggu' ? 'Tutup' : '08:00 - 16:00')
                  const isTutup = jam.toLowerCase().includes('tutup')

                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-semibold text-slate-700">{hari}</span>
                      <span
                        className={`font-mono text-xs ${
                          isTutup ? 'text-rose-500 font-semibold' : 'text-slate-600'
                        }`}
                      >
                        {jam}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Jenis Sampah Diterima */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <FileCheck size={18} className="text-emerald-700" />
                <h2 className="text-base font-bold text-slate-900">Jenis Sampah Diterima</h2>
              </div>

              <p className="text-xs text-slate-500 mb-4">
                Pastikan sampah sudah dipilah dalam keadaan bersih dan kering sebelum disetorkan.
              </p>

              <div className="flex flex-wrap gap-2">
                {unit.jenis_sampah_diterima?.map((jenis) => (
                  <span
                    key={jenis}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-100"
                  >
                    {jenis}
                  </span>
                ))}
              </div>
            </div>

            {/* Transparansi & Audit Badge */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-emerald-400">
                <ShieldCheck size={20} />
                <h3 className="text-sm font-bold">Integritas Data SIMBA (Aturan R1)</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Data unit ini telah diverifikasi keabsahannya oleh tim verifikator SIMBA. Kami tidak
                memublikasikan unit fiktif atau nomor kontak pribadi.
              </p>
              <div className="space-y-2 text-xs border-t border-slate-800 pt-3 text-slate-400">
                <div className="flex justify-between">
                  <span>Sumber Data:</span>
                  <span className="font-semibold text-slate-200 text-right max-w-[200px]">
                    {unit.sumber_data}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tanggal Audit:</span>
                  <span className="font-semibold text-slate-200">{unit.tanggal_verifikasi}</span>
                </div>
                <div className="flex justify-between">
                  <span>Verifikator:</span>
                  <span className="font-semibold text-slate-200">{unit.diverifikasi_oleh}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Daftar Harga Pembelian Sampah */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Coins size={20} className="text-emerald-700" />
                    <h2 className="text-lg font-bold text-slate-900">
                      Katalog Harga Pembelian Sampah
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500">
                    Nilai rupiah per kilogram/liter yang disetorkan ke saldo nasabah
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <Calendar size={12} />
                    Berlaku {unit.tanggal_verifikasi}
                  </span>
                </div>
              </div>

              {/* Tabel Harga */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs md:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                      <th className="pb-3 pr-4">Komoditas / Jenis</th>
                      <th className="pb-3 px-3">Kategori</th>
                      <th className="pb-3 px-3 text-right">Harga Beli</th>
                      <th className="pb-3 pl-4 text-right">Sumber Acuan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {unit.harga_katalog && unit.harga_katalog.length > 0 ? (
                      unit.harga_katalog.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 pr-4 font-semibold text-slate-800">
                            {item.jenis}
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px]">
                              {item.kategori}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-700">
                            Rp {item.harga_beli.toLocaleString('id-ID')}/{item.satuan}
                          </td>
                          <td className="py-3.5 pl-4 text-right text-slate-400 text-[11px] truncate max-w-[140px]">
                            {item.sumber}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400">
                          Katalog harga detail sedang dimutakhirkan dengan pengelola unit.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Harga pembelian dapat berfluktuasi mengikuti pasar offtaker daur ulang. Untuk
                  setoran dalam tonase besar, silakan hubungi pengelola unit melalui WhatsApp
                  terlebih dahulu.
                </span>
              </div>
            </div>

            {/* Lokasi & Koordinat Map Box */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-2">Koordinat & Navigasi</h3>
              <p className="text-xs text-slate-500 mb-4">
                Titik koordinat resmi:{' '}
                <span className="font-mono text-slate-700">
                  {unit.lat}, {unit.lng}
                </span>{' '}
                (Sumber: {unit.sumber_koordinat})
              </p>

              <div className="rounded-2xl bg-slate-100 border border-slate-200 p-8 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center">
                  <Navigation size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Buka di Aplikasi Peta</p>
                  <p className="text-xs text-slate-500 max-w-sm mt-0.5">
                    Dapatkan rute navigasi akurat dari posisi Anda saat ini menuju lokasi bank sampah
                  </p>
                </div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
                >
                  <span>Mulai Navigasi Google Maps</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Lapor Keliru */}
      <LaporKeliruModal
        isOpen={isLaporModalOpen}
        onClose={() => setIsLaporModalOpen(false)}
        unitSlug={unit.slug}
        unitNama={unit.nama}
      />
    </div>
  )
}
