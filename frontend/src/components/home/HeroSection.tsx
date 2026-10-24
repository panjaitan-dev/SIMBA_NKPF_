
'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { STATISTIK_NASIONAL } from '@/lib/provinsi-data';

interface StatItem {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  target: number;
}

export default function HeroSection() {
  // Data statistik awal diambil dari data nasional
  const [stats, setStats] = useState<StatItem[]>([
    {
      label: 'Nasabah Aktif',
      value: 0,
      target: STATISTIK_NASIONAL.total_nasabah,
    },
    {
      label: 'Sampah Terkumpul',
      value: 0,
      target: STATISTIK_NASIONAL.total_ton,
      suffix: ' ton',
    },
    {
      label: 'Rupiah Dibayarkan',
      value: 0,
      prefix: 'Rp ',
      target: Math.round(
        STATISTIK_NASIONAL.total_rupiah / 1_000_000_000
      ),
      suffix: ' M',
    },
    {
      label: 'Unit Bank Sampah',
      value: 0,
      target: STATISTIK_NASIONAL.total_bsu,
    },
  ]);

  // Mengambil statistik terbaru dari API nasional
  useEffect(() => {
    api
      .get('/stats/nasional')
      .then((r) => {
        const d = r.data.data;

        // Memperbarui statistik jika data nasabah tersedia
        if (d?.total_nasabah != null) {
          setStats([
            {
              label: 'Nasabah Aktif',
              value: 0,
              target: d.total_nasabah,
            },
            {
              label: 'Sampah Terkumpul',
              value: 0,
              target: Math.round(d.total_kg / 1000),
              suffix: ' ton',
            },
            {
              label: 'Rupiah Dibayarkan',
              value: 0,
              prefix: 'Rp ',
              target: Math.round(
                d.total_rupiah / 1_000_000_000
              ),
              suffix: ' M',
            },
            {
              label: 'Unit Bank Sampah',
              value: 0,
              target: d.total_bsu,
            },
          ]);
        }
      })
      .catch((error) => {
        // Jika API gagal, statistik awal tetap digunakan
        console.error('Gagal mengambil statistik nasional:', error);
      });
  }, []);

  // Animasi angka statistik dari 0 menuju nilai target
  useEffect(() => {
    const duration = 1500;
    const steps = 30;
    let step = 0;

    const interval = setInterval(() => {
      step++;

      // Menghitung perkembangan animasi angka
      const progress = Math.min(step / steps, 1);

      setStats((prev) =>
        prev.map((s) => ({
          ...s,
          value: Math.round(s.target * progress),
        }))
      );

      // Menghentikan animasi setelah selesai
      if (step >= steps) {
        clearInterval(interval);
      }
    }, duration / steps);

    // Membersihkan interval ketika komponen diperbarui
    return () => clearInterval(interval);
  }, [stats.map((s) => s.target).join(',')]);

  // Mengarahkan pengguna ke bagian halaman yang dituju
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-slate-900 py-16 md:py-20 text-white">
        {/* Background video */}
        <video src="/images/animasi.mp4" autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover -z-10" />
      {/* Wadah utama Hero Section */}
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">

        {/* Bagian kiri: judul, deskripsi, dan tombol */}
        <div className="flex-1 min-w-0 space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Bank Sampah{' '}
            <span className="text-emerald-300">
              Lebih Mudah
            </span>{' '}
            &amp; Digital
          </h1>

          <p className="text-lg text-slate-200 max-w-lg">
            Prototipe platform digital pelayanan publik untuk
            pencatatan transaksi bank sampah, transparansi saldo
            nasabah, dan pemodelan data ekonomi sirkular secara
            real-time.
          </p>

          {/* Tombol navigasi ke bagian kalkulator dan pencarian */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => scrollTo('kalkulator')}
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-emerald-950/40 hover:-translate-y-0.5 cursor-pointer"
            >
              Hitung Setoran Saya
            </button>

            <button
              onClick={() => scrollTo('finder')}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-all backdrop-blur-sm hover:-translate-y-0.5 cursor-pointer"
            >
              Cari Bank Sampah
            </button>
          </div>
        </div>

        {/* Bagian kanan: video animasi dan statistik */}
        <div className="flex-1 min-w-0 w-full space-y-6">

          {/* Wadah video animasi.mp4 */}
          <div className="relative w-full aspect-video overflow-hidden rounded-2xl border border-white/20 bg-slate-950/30 shadow-xl">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              
              src="public/images/animasi.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Video animasi Bank Sampah"
            >
              Browser kamu tidak mendukung pemutaran video.
            </video>
          </div>

          {/* Grid statistik nasional */}
          <div className="grid grid-cols-2 gap-4 md:gap-5">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 md:p-5 text-center shadow-sm transition-all duration-300 hover:bg-white/15 hover:-translate-y-1"
              >
                {/* Angka statistik dengan format Indonesia */}
                <div className="text-xl md:text-2xl font-bold text-emerald-300">
                  {s.prefix}
                  {s.value.toLocaleString('id-ID')}
                  {s.suffix}
                </div>

                {/* Label statistik */}
                <p className="text-sm text-slate-300 mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    
</section>
  );
}
