import * as React from 'react'
import { cn, formatRupiah } from '@/lib/utils'
import { Stempel } from './stempel'

export interface ItemNota {
  nama: string
  beratKg: number
  hargaPerKg: number
  subtotal: number
  satuan?: string
}

export interface KomponenNotaProps extends React.HTMLAttributes<HTMLDivElement> {
  nomorSeri?: string
  namaUnit?: string
  namaNasabah?: string
  nomorNasabah?: string
  tanggal?: string
  items: ItemNota[]
  totalRupiah: number
  totalKg: number
  stempelVariant?: 'verified' | 'simulation' | 'paid' | 'none'
  catatanPetugas?: string
  showStempel?: boolean
}

export function KomponenNota({
  nomorSeri = '#SMR-2026-0819',
  namaUnit = 'Bank Sampah Induk New Normal Medan',
  namaNasabah,
  nomorNasabah,
  tanggal,
  items,
  totalRupiah,
  totalKg,
  stempelVariant = 'simulation',
  catatanPetugas,
  showStempel = true,
  className,
  ...props
}: KomponenNotaProps) {
  const displayTanggal =
    tanggal ||
    new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date())

  return (
    <div
      className={cn(
        'relative bg-white text-[#1B1B18] rounded-xl border border-[#D4CABA] shadow-[3px_3px_0px_#E2DACB] p-6 sm:p-7 max-w-md w-full mx-auto font-sans',
        className
      )}
      {...props}
    >
      {/* Header Nota */}
      <div className="text-center border-b-2 border-dashed border-[#D4CABA] pb-4 mb-4">
        <p className="font-mono text-[11px] font-bold tracking-widest text-[#D8572A] uppercase">
          Tanda Terima Transaksi
        </p>
        <h4 className="font-serif text-xl sm:text-2xl font-black text-[#1E4D3B] mt-1 tracking-tight">
          SIMBA Nusantara
        </h4>
        <p className="text-xs text-[#66635B] mt-0.5 max-w-[260px] mx-auto leading-tight">
          {namaUnit}
        </p>
        <div className="flex items-center justify-between text-[11px] font-mono text-[#66635B] mt-3 pt-2 border-t border-[#E8E1D3]">
          <span>No: {nomorSeri}</span>
          <span>{displayTanggal}</span>
        </div>
      </div>

      {/* Info Nasabah (jika ada) */}
      {(namaNasabah || nomorNasabah) && (
        <div className="text-xs font-mono bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E8E1D3] mb-4 space-y-1">
          {namaNasabah && (
            <div className="flex justify-between">
              <span className="text-[#66635B]">Nasabah:</span>
              <span className="font-bold text-[#1B1B18]">{namaNasabah}</span>
            </div>
          )}
          {nomorNasabah && (
            <div className="flex justify-between">
              <span className="text-[#66635B]">ID Buku:</span>
              <span className="font-bold text-[#1E4D3B]">{nomorNasabah}</span>
            </div>
          )}
        </div>
      )}

      {/* Daftar Item / Timbangan */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-[11px] font-mono font-bold text-[#66635B] uppercase border-b border-[#E8E1D3] pb-1">
          <span>Komoditas / Berat</span>
          <span>Subtotal</span>
        </div>
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-baseline text-xs py-1 border-b border-dotted border-[#E8E1D3]">
            <div className="pr-2">
              <p className="font-semibold text-[#1B1B18]">{item.nama}</p>
              <p className="font-mono text-[11px] text-[#66635B]">
                {item.beratKg} {item.satuan || 'kg'} × Rp {item.hargaPerKg.toLocaleString('id-ID')}
              </p>
            </div>
            <span className="font-mono font-bold text-[#1B1B18] whitespace-nowrap">
              Rp {item.subtotal.toLocaleString('id-ID')}
            </span>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-center text-[#99958C] py-4 italic font-serif">
            Belum ada komoditas dipilih
          </p>
        )}
      </div>

      {/* Total Section */}
      <div className="border-t-2 border-[#1B1B18] pt-3 pb-2 mb-4">
        <div className="flex justify-between items-center text-xs text-[#66635B] mb-1">
          <span>Total Berat Terpilah</span>
          <span className="font-mono font-bold text-[#1B1B18]">{totalKg.toLocaleString('id-ID')} kg</span>
        </div>
        <div className="flex justify-between items-baseline pt-1">
          <span className="font-serif font-bold text-sm text-[#1B1B18]">NILAI DISETOR</span>
          <span className="font-mono text-2xl font-black text-[#1E4D3B]">
            {formatRupiah(totalRupiah)}
          </span>
        </div>
      </div>

      {/* Catatan Petugas */}
      {catatanPetugas && (
        <p className="text-[11px] text-[#66635B] bg-[#FAF7F2] p-2 rounded border border-[#E8E1D3] italic mb-4">
          Catatan: &ldquo;{catatanPetugas}&rdquo;
        </p>
      )}

      {/* Stempel Cap */}
      {showStempel && stempelVariant !== 'none' && (
        <div className="absolute right-4 bottom-14 opacity-90 pointer-events-none">
          <Stempel variant={stempelVariant} size="sm" tilt="left" />
        </div>
      )}

      {/* Footer Perforasi & Pesan Warga */}
      <div className="pt-3 mt-3 border-t-2 border-dashed border-[#D4CABA] text-center">
        <p className="font-mono text-[10px] text-[#66635B] uppercase tracking-wider">
          SIMBA BSI • Sumatera Utara Pilot
        </p>
        <p className="text-[11px] text-[#99958C] mt-0.5">
          Terima kasih telah memilah sampah dari rumahmu.
        </p>
      </div>
    </div>
  )
}
