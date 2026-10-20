
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Stempel } from '@/components/ui/stempel';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { STATISTIK_NASIONAL } from '@/lib/provinsi-data';

// Simple mock data for transaksi (could be replaced by real API later)
interface Transaksi {
  id: string;
  tanggal: string;
  jenis: string;
  beratKg: number;
  nilai: number;
}

const mockTransaksi: Transaksi[] = [
  { id: 'TRX001', tanggal: '2026-10-18', jenis: 'Botol PET', beratKg: 5.0, nilai: 24000 },
  { id: 'TRX002', tanggal: '2026-10-19', jenis: 'Kardus', beratKg: 8.5, nilai: 21250 },
  { id: 'TRX003', tanggal: '2026-10-20', jenis: 'Minyak Jelantah', beratKg: 2.0, nilai: 18000 },
];

export default function DashboardPage() {
  const [stats, setStats] = useState({
    nasabah: STATISTIK_NASIONAL.total_nasabah,
    sampahTon: STATISTIK_NASIONAL.total_ton,
    nilaiMilyar: Math.round(STATISTIK_NASIONAL.total_rupiah / 1_000_000_000),
    unit: STATISTIK_NASIONAL.total_bsu,
  });

  // In real app this could fetch from API; kept sync for now.
  useEffect(() => {
    // placeholder for future side‑effects
  }, []);

  return (
    <section className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1E4D3B]">Dashboard Nasabah</h1>
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-[#1E4D3B] hover:underline">
          <ArrowRight size={14} /> Kembali ke Beranda
        </Link>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-[#F4EFE4] p-4 border border-[#1E4D3B]/20">
          <div className="text-sm font-medium text-[#1E4D3B]">Nasabah Terdaftar</div>
          <div className="text-2xl font-bold text-[#1E4D3B]">{stats.nasabah.toLocaleString('id-ID')}</div>
        </Card>
        <Card className="bg-[#F4EFE4] p-4 border border-[#1E4D3B]/20">
          <div className="text-sm font-medium text-[#1E4D3B]">Sampah Terkelola (Ton)</div>
          <div className="text-2xl font-bold text-[#1E4D3B]">{stats.sampahTon.toLocaleString('id-ID')}</div>
        </Card>
        <Card className="bg-[#F4EFE4] p-4 border border-[#1E4D3B]/20">
          <div className="text-sm font-medium text-[#1E4D3B]">Nilai Tabungan (Miliar)</div>
          <div className="text-2xl font-bold text-[#1E4D3B]">Rp {stats.nilaiMilyar} M</div>
        </Card>
        <Card className="bg-[#F4EFE4] p-4 border border-[#1E4D3B]/20">
          <div className="text-sm font-medium text-[#1E4D3B]">Unit Percontohan</div>
          <div className="text-2xl font-bold text-[#1E4D3B]">{stats.unit}</div>
        </Card>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <header className="px-4 py-2 bg-[#1E4D3B] text-white flex justify-between items-center">
          <h2 className="font-semibold">Riwayat Transaksi Terbaru</h2>
          <Badge variant="simulation">Data Simulasi</Badge>
        </header>
        <Table>
          <thead>
            <tr className="bg-[#E2DACB]">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Tanggal</th>
              <th className="px-4 py-2 text-left">Jenis Sampah</th>
              <th className="px-4 py-2 text-right">Berat (kg)</th>
              <th className="px-4 py-2 text-right">Nilai (Rp)</th>
            </tr>
          </thead>
          <tbody>
            {mockTransaksi.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="px-4 py-2">{t.id}</td>
                <td className="px-4 py-2">{t.tanggal}</td>
                <td className="px-4 py-2">{t.jenis}</td>
                <td className="px-4 py-2 text-right">{t.beratKg}</td>
                <td className="px-4 py-2 text-right">{t.nilai.toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Footer note with Stempel */}
      <div className="mt-6 flex items-center justify-end gap-2 text-sm text-[#66635B]">
        <Stempel variant="verified" label="VERIFIKASI DATA" size="sm" />
        <span>Data terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</span>
      </div>
    </section>
  );
}
