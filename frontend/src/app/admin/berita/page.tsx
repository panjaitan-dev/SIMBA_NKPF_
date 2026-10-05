'use client'
import { useEffect, useState } from 'react'
import { ArrowLeft, Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminBeritaPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [form, setForm] = useState({ judul: '', konten: '', ringkasan: '', kategori: 'umum', is_published: 'false' })

  const fetchData = async () => {
    try { const r = await api.get('/berita/admin/all'); setData(r.data.data || []) }
    catch { toast.error('Gagal memuat berita') }
    finally { setLoading(false) }
  }
  useEffect(() => { fetchData() }, [])

  const openNew = () => { setEditItem(null); setForm({ judul: '', konten: '', ringkasan: '', kategori: 'umum', is_published: 'false' }); setThumbnail(null); setShowForm(true) }
  const openEdit = (item: any) => { setEditItem(item); setForm({ judul: item.judul, konten: item.konten, ringkasan: item.ringkasan || '', kategori: item.kategori, is_published: String(item.is_published) }); setThumbnail(null); setShowForm(true) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (thumbnail) fd.append('thumbnail', thumbnail)
      if (editItem) { await api.put(`/berita/${editItem.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }); toast.success('Berita diperbarui') }
      else { await api.post('/berita', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); toast.success('Berita berhasil dibuat') }
      setShowForm(false); fetchData()
    } catch (err: any) { toast.error(err.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus berita ini?')) return
    try { await api.delete(`/berita/${id}`); toast.success('Berita dihapus'); fetchData() }
    catch (err: any) { toast.error(err.message) }
  }

  const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="min-h-screen bg-slate-50 ml-60 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 mb-2"><ArrowLeft size={14} /> Dashboard</Link>
          <h1 className="text-2xl font-extrabold text-slate-900">Kelola Berita</h1>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm">
          <Plus size={16} /> Tulis Berita
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-xl my-4">
            <h2 className="text-xl font-bold text-slate-900 mb-6">{editItem ? 'Edit Berita' : 'Tulis Berita Baru'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul *</label>
                <input required value={form.judul} onChange={set('judul')} placeholder="Judul berita..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ringkasan</label>
                <textarea value={form.ringkasan} onChange={set('ringkasan')} rows={2} placeholder="Ringkasan singkat..." className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Konten *</label>
                <textarea required value={form.konten} onChange={set('konten')} rows={8} placeholder="Isi berita lengkap..." className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm resize-none" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                  <select value={form.kategori} onChange={set('kategori')} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none text-sm bg-white">
                    {['umum', 'kegiatan', 'pengumuman', 'program'].map(k => <option key={k} value={k} className="capitalize">{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select value={form.is_published} onChange={set('is_published')} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none text-sm bg-white">
                    <option value="false">Draft</option>
                    <option value="true">Publish</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Thumbnail</label>
                  <input type="file" accept="image/*" onChange={e => setThumbnail(e.target.files?.[0] || null)}
                    className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700" />
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
              {['Judul', 'Kategori', 'Status', 'Views', 'Tanggal', 'Aksi'].map(h => (
                <th key={h} className="text-left px-5 py-3.5 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <tr key={i}><td colSpan={6}><div className="h-10 bg-slate-100 animate-pulse m-2 rounded" /></td></tr>)
            ) : data.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-16 text-slate-400">Belum ada berita.</td></tr>
            ) : data.map((item: any) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-5 py-3.5 font-semibold text-slate-800 max-w-xs">
                  <p className="truncate">{item.judul}</p>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">/berita/{item.slug}</p>
                </td>
                <td className="px-5 py-3.5 capitalize text-slate-500">{item.kategori}</td>
                <td className="px-5 py-3.5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${item.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {item.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-500">{item.view_count || 0}</td>
                <td className="px-5 py-3.5 text-slate-500">{item.created_at ? formatDate(item.created_at) : '-'}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1">
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
