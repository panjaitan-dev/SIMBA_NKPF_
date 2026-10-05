'use client'
import { useEffect, useState } from 'react'
import { ArrowLeft, Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import api from '@/lib/api'
import { formatRupiah } from '@/lib/utils'
import toast from 'react-hot-toast'

const KATEGORI = ['organik', 'anorganik', 'b3', 'lainnya']

export default function AdminJenisSampahPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ nama: '', kode: '', kategori: 'anorganik', satuan: 'kg', harga_per_satuan: '', deskripsi: '' })

  const fetchData = async () => {
    try { const r = await api.get('/jenis-sampah'); setData(r.data.data || []) }
    catch { toast.error('Gagal memuat data') }
    finally { setLoading(false) }
  }
  useEffect(() => { fetchData() }, [])

  const openEdit = (item: any) => {
    setEditItem(item)
    setForm({ nama: item.nama, kode: item.kode, kategori: item.kategori, satuan: item.satuan, harga_per_satuan: item.harga_per_satuan, deskripsi: item.deskripsi || '' })
    setShowForm(true)
  }

  const openNew = () => { setEditItem(null); setForm({ nama: '', kode: '', kategori: 'anorganik', satuan: 'kg', harga_per_satuan: '', deskripsi: '' }); setShowForm(true) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editItem) { await api.put(`/jenis-sampah/${editItem.id}`, { ...form, harga_per_satuan: parseFloat(form.harga_per_satuan) }); toast.success('Berhasil diperbarui') }
      else { await api.post('/jenis-sampah', { ...form, harga_per_satuan: parseFloat(form.harga_per_satuan) }); toast.success('Berhasil ditambahkan') }
      setShowForm(false); fetchData()
    } catch (err: any) { toast.error(err.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Nonaktifkan jenis sampah ini?')) return
    try { await api.delete(`/jenis-sampah/${id}`); toast.success('Berhasil dinonaktifkan'); fetchData() }
    catch (err: any) { toast.error(err.message) }
  }

  const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="min-h-screen bg-slate-50 ml-60 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 mb-2"><ArrowLeft size={14} /> Dashboard</Link>
          <h1 className="text-2xl font-extrabold text-slate-900">Jenis Sampah & Harga</h1>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm">
          <Plus size={16} /> Tambah Jenis
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 mb-6">{editItem ? 'Edit Jenis Sampah' : 'Tambah Jenis Sampah'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama *</label>
                  <input required value={form.nama} onChange={set('nama')} placeholder="Botol Plastik PET"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kode *</label>
                  <input required value={form.kode} onChange={set('kode')} placeholder="PLS-PET"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                  <select value={form.kategori} onChange={set('kategori')} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none text-sm bg-white">
                    {KATEGORI.map(k => <option key={k} value={k} className="capitalize">{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Satuan</label>
                  <select value={form.satuan} onChange={set('satuan')} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none text-sm bg-white">
                    <option value="kg">kg</option>
                    <option value="liter">liter</option>
                    <option value="unit">unit</option>
                    <option value="pcs">pcs</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Harga per Satuan (Rp) *</label>
                  <input type="number" required min="0" value={form.harga_per_satuan} onChange={set('harga_per_satuan')} placeholder="3500"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi</label>
                  <textarea value={form.deskripsi} onChange={set('deskripsi')} rows={2} placeholder="Deskripsi singkat..."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none text-sm resize-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">Batal</button>
                <button type="submit" disabled={saving} className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                  {saving ? <Loader2 size={15} className="animate-spin" /> : null} Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-xs text-slate-500">
              {['Kode', 'Nama', 'Kategori', 'Satuan', 'Harga/Satuan', 'Status', 'Aksi'].map(h => (
                <th key={h} className="text-left px-5 py-3.5 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <tr key={i}><td colSpan={7}><div className="h-10 bg-slate-100 animate-pulse m-2 rounded" /></td></tr>)
            ) : data.map((item: any) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-5 py-3.5 font-mono text-xs text-slate-600">{item.kode}</td>
                <td className="px-5 py-3.5 font-semibold text-slate-800">{item.nama}</td>
                <td className="px-5 py-3.5 capitalize text-slate-500">{item.kategori}</td>
                <td className="px-5 py-3.5 text-slate-500">{item.satuan}</td>
                <td className="px-5 py-3.5 font-bold text-emerald-700">{formatRupiah(item.harga_per_satuan)}</td>
                <td className="px-5 py-3.5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${item.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {item.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(item)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
