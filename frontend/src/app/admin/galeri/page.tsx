'use client'
import { useEffect, useState } from 'react'
import { ArrowLeft, Plus, Trash2, Upload, Loader2 } from 'lucide-react'
import Link from 'next/link'
import AdminSidebar from '@/components/layout/AdminSidebar'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminGaleriPage() {
  const [albums, setAlbums] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [cover, setCover] = useState<File | null>(null)
  const [form, setForm] = useState({ judul: '', deskripsi: '', lokasi: '', tanggal_kegiatan: '' })

  const fetchData = async () => {
    try { const r = await api.get('/galeri'); setAlbums(r.data.data || []) }
    catch { toast.error('Gagal memuat galeri') }
    finally { setLoading(false) }
  }
  useEffect(() => { fetchData() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v))
      if (cover) fd.append('cover', cover)
      await api.post('/galeri', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Album berhasil dibuat'); setShowForm(false); fetchData()
    } catch (err: any) { toast.error(err.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus album beserta semua foto?')) return
    try { await api.delete(`/galeri/${id}`); toast.success('Album dihapus'); fetchData() }
    catch (err: any) { toast.error(err.message) }
  }

  const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 lg:ml-64 ml-0 w-full min-w-0 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 mb-2"><ArrowLeft size={14} /> Dashboard</Link>
            <h1 className="text-2xl font-extrabold text-slate-900">Kelola Galeri</h1>
          </div>
          <button onClick={() => { setForm({ judul: '', deskripsi: '', lokasi: '', tanggal_kegiatan: '' }); setCover(null); setShowForm(true) }}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm">
            <Plus size={16} /> Buat Album
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-xl">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Buat Album Baru</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Album *</label>
                  <input required value={form.judul} onChange={set('judul')} placeholder="Nama kegiatan..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi</label>
                  <textarea value={form.deskripsi} onChange={set('deskripsi')} rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Lokasi</label>
                    <input value={form.lokasi} onChange={set('lokasi')} placeholder="Unit Pusat Bank Sampah"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Kegiatan</label>
                    <input type="date" value={form.tanggal_kegiatan} onChange={set('tanggal_kegiatan')}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Foto</label>
                  <input type="file" accept="image/*" onChange={e => setCover(e.target.files?.[0] || null)}
                    className="w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 file:text-xs file:font-semibold" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-2xl" />) :
            albums.map((album: any) => (
              <div key={album.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                {album.cover_url ? (
                  <img src={album.cover_url} alt={album.judul} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-emerald-50 flex items-center justify-center">
                    <Upload size={32} className="text-emerald-200" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-slate-800 mb-1">{album.judul}</h3>
                  {album.tanggal_kegiatan && <p className="text-xs text-slate-400 mb-3">{formatDate(album.tanggal_kegiatan)}</p>}
                  <div className="flex gap-2">
                    <Link href={`/admin/galeri/${album.id}/upload`}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 py-2 rounded-xl transition-colors">
                      <Upload size={13} /> Upload Foto
                    </Link>
                    <button onClick={() => handleDelete(album.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
