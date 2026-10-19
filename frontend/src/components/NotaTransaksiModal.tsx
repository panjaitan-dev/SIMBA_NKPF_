'use client'

import React from 'react'
import { Printer, X, Leaf, CheckCircle2 } from 'lucide-react'
import { formatRupiah, formatDate } from '@/lib/utils'

export interface NotaItem {
  kode?: string
  nama: string
  berat_kg: number
  satuan?: string
  harga_satuan: number
  subtotal: number
}

export interface NotaData {
  tipe: 'pembelian' | 'penjualan'
  type?: 'pembelian' | 'penjualan'
  nomor_transaksi: string
  nomor?: string
  tanggal: string
  nama_pihak: string // Nama Nasabah atau Nama Klien
  identitas_pihak?: string // NIK / No. Nasabah atau ID Klien
  id_pihak?: string
  alamat_pihak?: string
  nomor_hp?: string
  nama_petugas?: string
  unit_nama?: string
  items: NotaItem[]
  total_nilai: number
  total_berat_kg?: number
  catatan?: string
  metode_pembayaran?: string
  saldo_sebelum?: number
  saldo_sesudah?: number
}

interface NotaModalProps {
  data: NotaData | null
  isOpen: boolean
  onClose: () => void
}

export default function NotaTransaksiModal({ data, isOpen, onClose }: NotaModalProps) {
  if (!isOpen || !data) return null

  const handlePrint = () => {
    window.print()
  }

  const isBeli = data.tipe === 'pembelian'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 border border-slate-200">
        {/* Header Modal Toolbar (Hidden during print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isBeli ? 'bg-emerald-400' : 'bg-blue-400'}`} />
            <h3 className="font-bold text-sm tracking-wide">
              {isBeli ? 'Preview Nota Pembelian (Setoran)' : 'Preview Faktur Penjualan (Offtaker)'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              <Printer size={15} /> Cetak Nota / PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div id="printable-receipt" className="p-8 sm:p-10 text-slate-800 font-sans bg-white">
          {/* Header Kop Nota Transaksi */}
          <div className="border-b-2 border-slate-900 pb-5 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-700 text-white rounded-2xl flex items-center justify-center shadow-md">
                  <Leaf size={24} />
                </div>
                <div>
                  <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">
                    SIMBA Indonesia
                  </h1>
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest">
                    Sistem Informasi Bank Sampah Indonesia
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Layanan Transaksi Ekonomi Sirkular & Pengelolaan Sampah Terpadu
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block px-3 py-1 text-xs font-extrabold uppercase rounded-lg tracking-wider ${
                    isBeli ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {isBeli ? 'NOTA PEMBELIAN (SETORAN)' : 'FAKTUR PENJUALAN KOMODITAS'}
                </span>
                <p className="font-mono text-xs font-bold text-slate-900 mt-2">
                  No: {data.nomor_transaksi}
                </p>
                <p className="text-[11px] text-slate-500">
                  Tanggal: {formatDate(data.tanggal)}
                </p>
              </div>
            </div>
          </div>

          {/* Info Pihak / Nasabah / Pembeli */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-200">
            <div>
              <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                {isBeli ? 'Informasi Nasabah / Penyetor' : 'Informasi Client / Pembeli'}
              </p>
              <p className="font-bold text-slate-900 text-sm mt-1">{data.nama_pihak}</p>
              {data.identitas_pihak && (
                <p className="text-slate-600 mt-0.5">ID/NIK: {data.identitas_pihak}</p>
              )}
              {data.nomor_hp && (
                <p className="text-slate-600 mt-0.5">Kontak: {data.nomor_hp}</p>
              )}
              {data.alamat_pihak && (
                <p className="text-slate-500 text-[11px] mt-0.5 max-w-xs">{data.alamat_pihak}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                Lokasi & Petugas
              </p>
              <p className="font-semibold text-slate-800 mt-1">
                Unit: {data.unit_nama || 'Bank Sampah Induk Pusat'}
              </p>
              <p className="text-slate-600 mt-0.5">
                Kasir/Teller: {data.nama_petugas || 'Petugas Loket'}
              </p>
              <p className="text-slate-600 mt-0.5">
                Metode: {data.metode_pembayaran || (isBeli ? 'Saldo Tabungan' : 'Tunai / Transfer')}
              </p>
            </div>
          </div>

          {/* Tabel Rincian Item */}
          <div className="overflow-hidden border border-slate-200 rounded-2xl mb-6">
            <table className="w-full text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="py-2.5 px-3 text-left font-bold w-8">#</th>
                  <th className="py-2.5 px-3 text-left font-bold">Komoditas Sampah</th>
                  <th className="py-2.5 px-3 text-right font-bold">Kuantitas</th>
                  <th className="py-2.5 px-3 text-right font-bold">
                    {isBeli ? 'Harga Beli (Rp)' : 'Harga Jual (Rp)'}
                  </th>
                  <th className="py-2.5 px-3 text-right font-bold">Subtotal (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {item.nama}
                      {item.kode && (
                        <span className="ml-1 text-[10px] font-mono text-slate-400">
                          ({item.kode})
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium">
                      {Number(item.berat_kg).toFixed(2)} {item.satuan || 'kg'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      {formatRupiah(item.harga_satuan)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {formatRupiah(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                <tr>
                  <td colSpan={2} className="py-3 px-3 text-left font-bold text-slate-700 uppercase">
                    Total Keseluruhan
                  </td>
                  <td className="py-3 px-3 text-right font-bold font-mono text-slate-800">
                    {data.items.reduce((acc, i) => acc + Number(i.berat_kg), 0).toFixed(2)} kg
                  </td>
                  <td colSpan={2} className="py-3 px-3 text-right font-black font-mono text-emerald-800 text-sm">
                    {formatRupiah(data.total_nilai)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Catatan & Tanda Tangan */}
          <div className="grid grid-cols-2 gap-8 text-xs pt-4 border-t border-slate-200">
            <div>
              <p className="font-semibold text-slate-700">Catatan:</p>
              <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                {data.catatan ||
                  (isBeli
                    ? 'Nilai setoran sampah telah dikonversi dan dibukukan ke saldo tabungan nasabah. Simpan nota ini sebagai bukti transaksi simulasi.'
                    : 'Faktur penjualan komoditas daur ulang dari Bank Sampah ke industri mitra (Data Simulasi).')}
              </p>
              <div className="flex items-center gap-1.5 text-emerald-700 text-[11px] font-semibold mt-3">
                <CheckCircle2 size={13} /> Tercatat di Sistem SIMBA (Simulasi)
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-slate-600 mb-12">
                  {isBeli ? 'Nasabah / Penyetor' : 'Client / Pembeli'}
                </p>
                <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">
                  ( {data.nama_pihak} )
                </div>
              </div>
              <div>
                <p className="text-slate-600 mb-12">Kasir / Teller</p>
                <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">
                  ( {data.nama_petugas || 'Petugas'} )
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 px-8 py-4 bg-slate-50 border-t border-slate-200 print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md"
          >
            <Printer size={15} /> Cetak Sekarang (Printer / PDF)
          </button>
        </div>
      </div>
    </div>
  )
}
