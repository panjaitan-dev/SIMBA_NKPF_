'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Scale,
  ArrowRight,
  MapPin,
  TrendingUp,
  CheckCircle2,
  FileSpreadsheet,
  Coins,
} from 'lucide-react'
import { STATISTIK_NASIONAL } from '@/lib/provinsi-data'
import { Badge } from '@/components/ui/badge'
import { Stempel } from '@/components/ui/stempel'

interface StatItem {
  label: string
  keterangan: string
  target: number
  prefix?: string
  suffix?: string
}

const STATS_DATA: StatItem[] = [
  {
    label: 'Nasabah Terdaftar',
    keterangan: 'Keluarga mitra binaan di Sumut',
    target: STATISTIK_NASIONAL.total_nasabah,
  },
  {
    label: 'Sampah Terkelola',
    keterangan: 'Komoditas terpilah masuk unit',
    target: STATISTIK_NASIONAL.total_ton,
    suffix: ' Ton',
  },
  {
    label: 'Nilai Tabungan',
    keterangan: 'Rupiah tercatat di buku warga',
    target: Math.round(STATISTIK_NASIONAL.total_rupiah / 1_000_000_000),
    prefix: 'Rp ',
    suffix: ' M',
  },
  {
    label: 'Unit Percontohan',
    keterangan: 'Bank sampah aktif terverifikasi',
    target: STATISTIK_NASIONAL.total_bsu,
  },
]

export default function HeroSection() {
  const [animatedValues, setAnimatedValues] = useState<number[]>(() =>
    STATS_DATA.map((s) => s.target)
  )
  const statsRef = useRef<HTMLDivElement>(null)
  const hasAnimatedRef = useRef(false)

  // Animasi hitung hanya saat masuk viewport dan hormati prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Cek preferensi aksesibilitas pengurangan gerak
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      // Pertahankan nilai akhir langsung
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true

          // Mulai animasi hitung naik dari 0 ke target
          const duration = 1200 // ms
          const frames = 30
          let currentFrame = 0

          const interval = setInterval(() => {
            currentFrame++
            const progress = currentFrame / frames
            // Ease-out quad
            const easeOut = 1 - (1 - progress) * (1 - progress)

            setAnimatedValues(
              STATS_DATA.map((s) => Math.round(s.target * easeOut))
            )

            if (currentFrame >= frames) {
              clearInterval(interval)
              setAnimatedValues(STATS_DATA.map((s) => s.target))
            }
          }, duration / frames)
        }
      },
      { threshold: 0.2 }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative bg-[#143528] text-[#FAF7F2] pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden">
      {/* Background Subtle Paper Texture Grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#FAF7F2 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      {/* Decorative Warm Terracotta Accent Circle (Lightweight SVG blur) */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#D8572A]/15 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Kolom Teks Nilai Utama (7 Kolom) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="pilot">Fase Percontohan: Sumatera Utara</Badge>
              <Badge variant="simulation">Data Simulasi IT Fest 2026</Badge>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.4rem] font-bold tracking-tight text-[#FAF7F2] leading-[1.15]">
              Ubah Pilahan Sampah Rumah Jadi{' '}
              <span className="text-[#D8572A] underline decoration-[#D8572A]/40 decoration-wavy underline-offset-6">
                Saldo Tabungan Nyata
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#FAF7F2]/85 max-w-2xl leading-relaxed">
              Catat setoran sampah pilahan keluarga Anda secara transparan. Timbang dengan nota bertanda cap,
              pantau saldo rupiah di buku rekening digital, dan cairkan langsung di Bank Sampah Unit terdekat.
            </p>

            {/* Dua Tombol CTA Utama */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => scrollToSection('kalkulator')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#D8572A] hover:bg-[#B8431A] text-white font-bold text-base shadow-[3px_3px_0px_#1B1B18] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer min-h-[48px]"
              >
                <Coins size={18} />
                <span>Hitung Setoran Saya</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('peta-dan-unit')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#FAF7F2] hover:bg-white text-[#1E4D3B] font-bold text-base border border-[#E2DACB] shadow-[2px_2px_0px_#143528] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer min-h-[48px]"
              >
                <MapPin size={18} />
                <span>Cari Bank Sampah</span>
              </button>
            </div>

            {/* Catatan Jaminan Transparansi Fisik */}
            <div className="pt-3 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#FAF7F2]/75">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#D8572A]" />
                Timbangan digital tertera di nota cetak
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#D8572A]" />
                Harga acuan terstandardisasi transparan
              </span>
            </div>
          </div>

          {/* Kolom Visual Khas: Mockup Nota Fisik Setoran (5 Kolom) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm rotate-1 hover:rotate-0 transition-transform duration-300">
              {/* Nota Fisik */}
              <div className="bg-[#FAF7F2] text-[#1B1B18] p-6 rounded-2xl shadow-[6px_6px_0px_rgba(20,53,40,0.6)] border-2 border-[#E2DACB] relative">
                {/* Header Nota */}
                <div className="text-center border-b-2 border-dashed border-[#D4CABA] pb-4 mb-4">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Scale size={16} className="text-[#1E4D3B]" />
                    <span className="font-serif font-black text-sm tracking-tight text-[#1E4D3B]">
                      NOTA TABUNGAN SAMPAH
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-[#66635B]">
                    Unit Percontohan: BSI New Normal Medan
                  </p>
                  <p className="text-[10px] font-mono text-[#66635B]">
                    No. Seri: NOTA-MDN-2026-0814
                  </p>
                </div>

                {/* Baris Rincian Timbangan */}
                <div className="space-y-2 text-xs font-mono pb-4 border-b-2 border-dashed border-[#D4CABA]">
                  <div className="flex justify-between items-center text-[#66635B] text-[10px] uppercase font-bold">
                    <span>Komoditas / Berat</span>
                    <span>Subtotal</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>5,0 kg Botol PET Bening</span>
                    <span className="font-bold">Rp 24.000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>8,5 kg Kardus Box Cokelat</span>
                    <span className="font-bold">Rp 21.250</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>2,0 liter Minyak Jelantah</span>
                    <span className="font-bold">Rp 18.000</span>
                  </div>
                </div>

                {/* Total Finansial */}
                <div className="pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#66635B] block">
                      Total Nilai Disetor
                    </span>
                    <span className="font-mono text-2xl font-black text-[#1E4D3B]">
                      Rp 63.250
                    </span>
                  </div>

                  {/* Stempel Fisik Autentik */}
                  <Stempel variant="verified" label="TERVERIFIKASI" size="sm" />
                </div>

                {/* Footer Kertas Nota */}
                <div className="mt-4 pt-3 border-t border-[#E2DACB] flex items-center justify-between text-[10px] font-mono text-[#66635B]">
                  <span>Petugas: Kasir BSU Unit 01</span>
                  <span>10 Okt 2026 • 09:42 WIB</span>
                </div>
              </div>

              {/* Tag Penjelas Stiker Kecil */}
              <div className="absolute -bottom-3 -right-2 bg-[#D8572A] text-white px-3 py-1 rounded-lg text-[11px] font-mono font-bold shadow-md transform -rotate-3">
                Simulasi Nota Riil
              </div>
            </div>
          </div>
        </div>

        {/* Baris Statistik Hero: 4 Kartu KPI Jujur */}
        <div ref={statsRef} className="mt-16 sm:mt-20 pt-10 border-t border-[#1E4D3B]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {STATS_DATA.map((item, index) => {
              const val = animatedValues[index]
              return (
                <div
                  key={item.label}
                  className="bg-[#1E4D3B]/40 border border-[#FAF7F2]/10 rounded-2xl p-4 sm:p-5 backdrop-blur-xs"
                >
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF7F2] font-mono">
                    {item.prefix}
                    {val.toLocaleString('id-ID')}
                    {item.suffix}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-[#FAF7F2] mt-1">
                    {item.label}
                  </div>
                  <p className="text-[11px] text-[#FAF7F2]/65 mt-0.5 leading-snug">
                    {item.keterangan}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
