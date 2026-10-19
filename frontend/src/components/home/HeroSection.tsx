'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { STATISTIK_NASIONAL } from '@/lib/provinsi-data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface StatItem {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  target: number;
}

export default function HeroSection() {
  const [stats, setStats] = useState<StatItem[]>([
    { label: 'Nasabah Aktif', value: 0, target: STATISTIK_NASIONAL.total_nasabah },
    { label: 'Sampah Terkumpul', value: 0, target: STATISTIK_NASIONAL.total_ton, suffix: ' ton' },
    { label: 'Rupiah Dibayarkan', value: 0, prefix: 'Rp ', target: Math.round(STATISTIK_NASIONAL.total_rupiah / 1_000_000_000), suffix: ' M' },
    { label: 'Unit Bank Sampah', value: 0, target: STATISTIK_NASIONAL.total_bsu },
  ]);

  // Fetch latest stats once
  useEffect(() => {
    api.get('/stats/nasional')
      .then(r => {
        const d = r.data.data;
        if (d?.total_nasabah) {
          setStats([
            { label: 'Nasabah Aktif', value: 0, target: d.total_nasabah },
            { label: 'Sampah Terkumpul', value: 0, target: Math.round(d.total_kg / 1000), suffix: ' ton' },
            { label: 'Rupiah Dibayarkan', value: 0, prefix: 'Rp ', target: Math.round(d.total_rupiah / 1_000_000_000), suffix: ' M' },
            { label: 'Unit Bank Sampah', value: 0, target: d.total_bsu },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  // Simple count‑up animation
  useEffect(() => {
    const duration = 1500; // ms
    const steps = 30;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      setStats(prev =>
        prev.map(s => ({ ...s, value: Math.round(s.target * progress) }))
      );
      if (step >= steps) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, [stats.map(s => s.target).join(',')]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-gradient-to-r from-emerald-600 to-slate-900 py-20 text-white">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Bank Sampah <span className="text-emerald-300">Lebih Mudah</span> &amp; Digital
          </h1>
          <p className="text-lg text-slate-200 max-w-lg">
            Prototipe platform digital pelayanan publik untuk pencatatan transaksi bank sampah, transparansi saldo nasabah, dan pemodelan data ekonomi sirkular secara real‑time.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="default" onClick={() => scrollTo('kalkulator')}>
              Hitung Setoran Saya
            </Button>
            <Button variant="secondary" onClick={() => scrollTo('finder')}>
              Cari Bank Sampah
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {stats.map(s => (
            <Card key={s.label} className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
              <CardHeader className="p-3">
                <CardTitle className="text-2xl font-bold text-emerald-300">
                  {s.prefix}{s.value.toLocaleString('id-ID')}{s.suffix}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-slate-300">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
