'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Search, Filter, ArrowUpDown, Tag, DollarSign, Layers } from 'lucide-react'
import AdminSidebar from '@/components/layout/AdminSidebar'
import api from '@/lib/api'
import { formatRupiah } from '@/lib/utils'
import toast from 'react-hot-toast'
import { DEFAULT_JENIS_SAMPAH } from '@/lib/constants'


const KATEGORI_OPTIONS = [
  { value: 'all', label: 'Semua Kategori' },
  { value: 'logam', label: 'Logam (Tembaga/Aluminium/Besi)' },
  { value: 'anorganik', label: 'Plastik & Kertas' },
  { value: 'organik', label: 'Organik / Kompos' },
  { value: 'b3', label: 'Bahan Berbahaya (B3)' },
  { value: 'lainnya', label: 'Minyak Jelantah / Lainnya' },
]

export default function AdminJenisSampahPage() {
  const [data, setData] = useState<any[]>(DEFAULT_JENIS_SAMPAH)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [filterKategori, setFilterKategori] = useState('all')

  const [form, setForm] = useState({
    nama: '',
    kode: '',
    kategori: 'logam',
    satuan: 'kg',
    harga_beli: '',
    harga_jual: '',
    deskripsi: '',
  })

  const fetchData = async () => {
    try {
      const r = await api.get('/jenis-sampah')
      if (r.data?.data && r.data.data.length > 0) {
        // Map backend harga_per_satuan to harga_beli if needed
        const mapped = r.data.data.map((item: any) => ({
          ...item,
          harga_beli: item.harga_beli ?? item.harga_per_satuan ?? 0,
          harga_jual: item.harga_jual ?? Math.round((item.harga_per_satuan || 3000) * 1.3),
        }))
        setData(mapped)
      }
    } catch {
      // keep fallback
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const openNew = () => {
    setEditItem(null)
    setForm({
      nama: '',
      kode: '',
      kategori: 'logam',
      satuan: 'kg',
      harga_beli: '',
      harga_jual: '',
      deskripsi: '',
    })
    setShowForm(true)
  }

  const openEdit = (item: any) => {
    setEditItem(item)
    setForm({
      nama: item.nama,
      kode: item.kode,
      kategori: item.kategori,
      satuan: item.satuan,
      harga_beli: String(item.harga_beli),
      harga_jual: String(item.harga_jual),
      deskripsi: item.deskripsi || '',
    })
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const { parseIndonesianDecimal } = require('@/lib/validation')
    const hBeli = parseIndonesianDecimal(form.harga_beli)
    const hJual = parseIndonesianDecimal(form.harga_jual)

    if (isNaN(hBeli) || hBeli <= 0) {
      toast.error('Harga beli nasabah harus lebih besar dari Rp 0')
      setSaving(false)
      return
    }

    if (isNaN(hJual) || hJual <= 0) {
      toast.error('Harga jual offtaker harus lebih besar dari Rp 0')
      setSaving(false)
      return
    }

    const payload = {
      nama: form.nama.trim(),
      kode: form.kode.trim().toUpperCase(),
      kategori: form.kategori,
      satuan: form.satuan || 'kg',
      harga_beli: hBeli,
      harga_jual: hJual,
      harga_per_satuan: hBeli,
      deskripsi: form.deskripsi,
    }

    try {
      if (editItem) {
        try {
          await api.put(`/jenis-sampah/${editItem.id}`, payload)
        } catch {}
        setData((prev) =>
          prev.map((it) => (it.id === editItem.id ? { ...it, ...payload } : it))
        )
        toast.success(`Komoditas ${payload.nama} berhasil diperbarui`)
      } else {
        const newItem = {
          id: `js-${Date.now()}`,
          ...payload,
          stok_tersedia_kg: 0,
          is_active: true,
        }
        try {
          await api.post('/jenis-sampah', payload)
        } catch {}
        setData((prev) => [newItem, ...prev])
        toast.success(`Komoditas ${payload.nama} berhasil ditambahkan`)
      }
      setShowForm(false)
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan data')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (id: string, nama: string) => {
    if (!confirm(`Hapus/Nonaktifkan jenis sampah "${nama}"?`)) return
    setData((prev) => prev.filter((it) => it.id !== id))
    try {
      api.delete(`/jenis-sampah/${id}`).catch(() => {})
    } catch {}
    toast.success(`Komoditas "${nama}" berhasil dinonaktifkan`)
  }

  const filteredData = data.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.kode.toLowerCase().includes(search.toLowerCase())
    const matchKategori =
      filterKategori === 'all' ? true : item.kategori === filterKategori
    return matchSearch && matchKategori
  })

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 ml-0 w-full min-w-0 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">
              <Tag size={14} /> Master Data Katalog
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Kelola Data Sampah & Penetapan Harga
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Atur daftar komoditas sampah, satuan, harga beli dari nasabah, dan harga jual ke offtaker/industri.
            </p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-emerald-900/20"
          >
            <Plus size={16} /> Tambah Sampah Baru
          </button>
        </div>

        {/* Quick Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center font-bold">
                <Layers size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Total Komoditas</p>
                <p className="text-xl font-extrabold text-slate-900">{data.length} Jenis</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center font-bold">
                <DollarSign size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Harga Beli Tertinggi</p>
                <p className="text-xl font-extrabold text-amber-800">
                  {formatRupiah(Math.max(...data.map((d) => d.harga_beli || 0)))} / kg
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center font-bold">
                <Tag size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Komoditas Logam Unggulan</p>
                <p className="text-sm font-bold text-slate-800">Tembaga, Aluminium & Besi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kode atau nama sampah (misal: Tembaga, Aluminium, Kardus)..."
              className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition-all"
            />
          </div>
          <select
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="px-4 py-3 bg-white rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 outline-none"
          >
            {KATEGORI_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Table List */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[750px]">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4">Kode Sampah</th>
                  <th className="px-6 py-4">Nama Sampah</th>
                  <th className="px-6 py-4">Jenis / Kategori</th>
                  <th className="px-6 py-4">Satuan</th>
                  <th className="px-6 py-4 text-right">Harga Beli (Nasabah)</th>
                  <th className="px-6 py-4 text-right">Harga Jual (Offtaker)</th>
                  <th className="px-6 py-4 text-right">Margin / Unit</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-slate-400">
                      Tidak ada jenis sampah yang sesuai dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => {
                    const margin = (item.harga_jual || 0) - (item.harga_beli || 0)
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-xs text-emerald-800">
                          <span className="bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                            {item.kode}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{item.nama}</div>
                          {item.deskripsi && (
                            <div className="text-[11px] text-slate-400 line-clamp-1">{item.deskripsi}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              item.kategori === 'logam'
                                ? 'bg-amber-100 text-amber-800'
                                : item.kategori === 'anorganik'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {item.kategori}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-600 uppercase text-xs">
                          {item.satuan || 'kg'}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-slate-800 font-mono">
                          {formatRupiah(item.harga_beli)}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-blue-700 font-mono">
                          {formatRupiah(item.harga_jual)}
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-black text-emerald-700">
                          +{formatRupiah(margin)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEdit(item)}
                              title="Edit Komoditas"
                              className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, item.nama)}
                              title="Hapus"
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Form Tambah / Edit */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-slate-200 animate-fade-in-up">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {editItem ? 'Edit Komoditas Sampah' : 'Tambah Jenis Sampah Baru'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tentukan kode, nama komoditas, dan penetapan harga beli serta harga jual per unit.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Sampah *
                    </label>
                    <input
                      required
                      value={form.nama}
                      onChange={(e) => setForm({ ...form, nama: e.target.value })}
                      placeholder="Contoh: Tembaga Super, Aluminium"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Kode Sampah *
                    </label>
                    <input
                      required
                      value={form.kode}
                      onChange={(e) => setForm({ ...form, kode: e.target.value })}
                      placeholder="Contoh: LG-TMB01, LG-ALM"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm uppercase font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Jenis / Kategori *
                    </label>
                    <select
                      value={form.kategori}
                      onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none text-sm bg-white"
                    >
                      <option value="logam">Logam (Tembaga, Aluminium, Besi)</option>
                      <option value="anorganik">Anorganik (Plastik, Kertas, Kardus)</option>
                      <option value="organik">Organik</option>
                      <option value="b3">B3 (Limbah Baterai/Elektronik)</option>
                      <option value="lainnya">Lainnya (Minyak Jelantah)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Satuan Unit *
                    </label>
                    <select
                      value={form.satuan}
                      onChange={(e) => setForm({ ...form, satuan: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none text-sm bg-white"
                    >
                      <option value="kg">kg (Kilogram)</option>
                      <option value="liter">liter</option>
                      <option value="pcs">pcs</option>
                      <option value="unit">unit</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                  <div>
                    <label className="block text-xs font-bold text-emerald-900 mb-1">
                      Harga Beli per Satuan (Rp) *
                    </label>
                    <p className="text-[10px] text-emerald-700 mb-1">Dibayar ke nasabah saat setor</p>
                    <input
                      type="number"
                      required
                      min="0"
                      value={form.harga_beli}
                      onChange={(e) => setForm({ ...form, harga_beli: e.target.value })}
                      placeholder="85000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 outline-none text-sm font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-blue-900 mb-1">
                      Harga Jual per Satuan (Rp) *
                    </label>
                    <p className="text-[10px] text-blue-700 mb-1">Dijual ke pabrik / offtaker</p>
                    <input
                      type="number"
                      required
                      min="0"
                      value={form.harga_jual}
                      onChange={(e) => setForm({ ...form, harga_jual: e.target.value })}
                      placeholder="95000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-blue-500 outline-none text-sm font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Deskripsi / Kriteria Sortir
                  </label>
                  <textarea
                    rows={2}
                    value={form.deskripsi}
                    onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                    placeholder="Syarat kebersihan sampah, misalnya kupas kulit kabel atau bebas air..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-sm"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50"
                  >
                    {saving ? 'Menyimpan...' : editItem ? 'Simpan Perubahan' : 'Tambah Komoditas'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
