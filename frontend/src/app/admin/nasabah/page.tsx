'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Search, Users, Plus, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import AdminSidebar from '@/components/layout/AdminSidebar'
import api from '@/lib/api'
import { formatRupiah, formatDate } from '@/lib/utils'
import { DEFAULT_NASABAH } from '@/lib/constants'
import toast from 'react-hot-toast'

export default function AdminNasabahPage() {
  const [data, setData] = useState<any[]>(
    DEFAULT_NASABAH.map((n, i) => ({
      ...n,
      saldo: [245000, 185000, 92500, 310000][i % 4],
      total_setoran_kg: [42.5, 31.0, 15.2, 58.0][i % 4],
      is_active: true,
      joined_at: '2026-09-01',
      unit_nama: 'Bank Sampah Unit Pusat',
      nik: `1209${100000000000 + i * 4321}`,
    }))
  )
  const [search, setSearch] = useState('')
  const [total, setTotal] = useState(DEFAULT_NASABAH.length)

  const fetchData = async (q = '') => {
    try {
      const r = await api.get(`/nasabah?search=${q}&limit=50`)
      if (r.data?.data && r.data.data.length > 0) {
        setData(r.data.data)
        setTotal(r.data.meta?.total || r.data.data.length)
      }
    } catch {}
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchData(search)
  }

  const filtered = data.filter((n) => {
    const q = search.toLowerCase()
    return (
      n.nama_lengkap.toLowerCase().includes(q) ||
      n.nomor_nasabah.toLowerCase().includes(q) ||
      (n.nik && n.nik.includes(q))
    )
  })

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 ml-0 w-full min-w-0 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-widest mb-1">
                <Users size={14} /> Masyarakat & Partisipasi Warga
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Data Nasabah Bank Sampah
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Total: <strong>{total}</strong> nasabah terdaftar dengan buku tabungan digital aktif.
              </p>
            </div>
            <Link
              href="/admin/setoran/baru"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-emerald-900/20"
            >
              <Plus size={16} /> Input Setoran Nasabah
            </Link>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, nomor nasabah, atau NIK..."
              className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl text-sm transition-colors shadow-sm"
          >
            Cari Nasabah
          </button>
        </form>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[700px]">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4">No. Nasabah</th>
                  <th className="px-6 py-4">Nama Lengkap</th>
                  <th className="px-6 py-4">NIK</th>
                  <th className="px-6 py-4">Unit Pelayanan</th>
                  <th className="px-6 py-4 text-right">Saldo Tabungan (Rp)</th>
                  <th className="px-6 py-4 text-right">Total Setoran</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-slate-400">
                      <Users size={40} className="mx-auto mb-3 text-slate-200" />
                      Tidak ada nasabah ditemukan.
                    </td>
                  </tr>
                ) : (
                  filtered.map((n: any) => (
                    <tr key={n.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-emerald-800 font-bold">
                        <span className="bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                          {n.nomor_nasabah}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{n.nama_lengkap}</div>
                        {n.alamat && <div className="text-[11px] text-slate-400">{n.alamat}</div>}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs font-mono">{n.nik || '-'}</td>
                      <td className="px-6 py-4 text-slate-600 text-xs font-medium">
                        {n.unit_nama || 'Unit Pusat'}
                      </td>
                      <td className="px-6 py-4 text-right font-black font-mono text-emerald-800 text-sm">
                        {formatRupiah(n.saldo || 0)}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-semibold text-slate-700">
                        {n.total_setoran_kg ? `${Number(n.total_setoran_kg).toFixed(2)} kg` : '0 kg'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            n.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-600'
                          }`}
                        >
                          <ShieldCheck size={12} />
                          {n.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
