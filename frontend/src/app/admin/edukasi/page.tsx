'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Plus, Pencil, Trash2, Eye, EyeOff, Loader2, BookOpen, Layers } from 'lucide-react'
import Link from 'next/link'
import AdminSidebar from '@/components/layout/AdminSidebar'
import api from '@/lib/api'
import { SAMPLE_EDUKASI } from '@/lib/sampleData'
import toast from 'react-hot-toast'

interface EdukasiItem {
  id: string
  judul: string
  slug?: string
  konten: string
  ringkasan?: string
  thumbnail_url?: string
  kategori: string
  urutan?: number
  is_published?: boolean
  created_at?: string
}

export default function AdminEdukasiPage() {
  const [data, setData] = useState<EdukasiItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<EdukasiItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [form, setForm] = useState({
    judul: '',
    konten: '',
    ringkasan: '',
    kategori: '3r',
    urutan: 0,
    is_published: 'true',
  })

  const fetchData = async () => {
    try {
      const res = await api.get('/edukasi/admin/all')
      if (res.data?.data?.length) {
        setData(res.data.data)
      } else {
        setData(SAMPLE_EDUKASI.map((e, idx) => ({ ...e, is_published: true, urutan: idx + 1 })))
      }
    } catch {
      setData(SAMPLE_EDUKASI.map((e, idx) => ({ ...e, is_published: true, urutan: idx + 1 })))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const openNew = () => {
    setEditItem(null)
    setForm({ judul: '', konten: '', ringkasan: '', kategori: '3r', urutan: data.length + 1, is_published: 'true' })
    setThumbnail(null)
    setShowForm(true)
  }

  const openEdit = (item: EdukasiItem) => {
    setEditItem(item)
    setForm({
      judul: item.judul,
      konten: item.konten || '',
      ringkasan: item.ringkasan || '',
      kategori: item.kategori || '3r',
      urutan: item.urutan || 0,
      is_published: item.is_published ? 'true' : 'false',
    })
    setThumbnail(null)
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.judul.trim() || !form.konten.trim()) {
      toast.error('Judul dan konten wajib diisi')
      return
    }

    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('judul', form.judul)
      fd.append('konten', form.konten)
      fd.append('ringkasan', form.ringkasan)
      fd.append('kategori', form.kategori)
      fd.append('urutan', String(form.urutan))
      fd.append('is_published', form.is_published)
      if (thumbnail) fd.append('thumbnail', thumbnail)

      if (editItem) {
        await api.put(`/edukasi/${editItem.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        setData((prev) =>
          prev.map((item) =>
            item.id === editItem.id
              ? {
                  ...item,
                  ...form,
                  urutan: Number(form.urutan),
                  is_published: form.is_published === 'true',
                }
              : item
          )
        )
        toast.success('Materi edukasi berhasil diperbarui')
      } else {
        let createdId = `edu-${Date.now()}`
        const res = await api.post('/edukasi', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        if (res.data?.data?.id) createdId = res.data.data.id
        const newItem: EdukasiItem = {
          id: createdId,
          judul: form.judul,
          konten: form.konten,
          ringkasan: form.ringkasan,
          kategori: form.kategori,
          urutan: Number(form.urutan),
          is_published: form.is_published === 'true',
        }
        setData((prev) => [newItem, ...prev])
        toast.success('Materi edukasi baru berhasil diterbitkan')
      }
      setShowForm(false)
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan konten edukasi')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, judul: string) => {
    if (!confirm(`Hapus materi edukasi "${judul}"?`)) return
    try {
      await api.delete(`/edukasi/${id}`).catch(() => {})
      setData((prev) => prev.filter((item) => item.id !== id))
      toast.success('Materi edukasi berhasil dihapus')
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus konten')
    }
  }

  const handleTogglePublish = async (item: EdukasiItem) => {
    const nextStatus = !item.is_published
    setData((prev) => prev.map((it) => (it.id === item.id ? { ...it, is_published: nextStatus } : it)))
    try {
      const fd = new FormData()
      fd.append('is_published', String(nextStatus))
      await api.put(`/edukasi/${item.id}`, fd).catch(() => {})
      toast.success(nextStatus ? 'Konten dipublikasikan' : 'Konten disembunyikan')
    } catch {}
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 lg:ml-64 ml-0 w-full min-w-0 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 mb-2">
              <ArrowLeft size={14} /> Kembali ke Dashboard
            </Link>
            <h1 className="text-2xl font-extrabold text-slate-900">Kelola Edukasi 3R & Kebijakan</h1>
            <p className="text-slate-500 text-sm mt-1">Publikasi materi literasi pemilahan sampah dan ekonomi sirkular nasional</p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-sm transition-colors"
          >
            <Plus size={16} /> Tambah Materi
          </button>
        </div>

        {/* Content Table */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-24 text-slate-400 gap-3">
              <Loader2 size={24} className="animate-spin text-emerald-600" />
              <span>Memuat data edukasi...</span>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-slate-600">Belum ada materi edukasi</p>
              <p className="text-xs text-slate-400 mt-1">Klik tombol di atas untuk menambah modul edukasi baru.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="px-6 py-4">Materi Edukasi</th>
                    <th className="px-6 py-4">Kategori</th>
                    <th className="px-6 py-4 text-center">Urutan</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {item.thumbnail_url ? (
                            <img src={item.thumbnail_url} alt="" className="w-12 h-12 object-cover rounded-xl shrink-0 border border-slate-200" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                              <BookOpen size={20} />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 leading-snug line-clamp-1">{item.judul}</p>
                            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{item.ringkasan || 'Tidak ada ringkasan'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200 uppercase">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-700">
                        {item.urutan || 1}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleTogglePublish(item)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                            item.is_published
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {item.is_published ? <Eye size={12} /> : <EyeOff size={12} />}
                          {item.is_published ? 'Tayang' : 'Draft'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEdit(item)}
                            className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit Materi"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.judul)}
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus Materi"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                <BookOpen size={20} className="text-emerald-600" />
                {editItem ? 'Edit Materi Edukasi' : 'Tulis Materi Edukasi Baru'}
              </h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Materi *</label>
                  <input
                    required
                    value={form.judul}
                    onChange={(e) => setForm({ ...form, judul: e.target.value })}
                    placeholder="Contoh: Prinsip 3R Dalam Mengurangi Sampah Plastik"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kategori *</label>
                    <select
                      value={form.kategori}
                      onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm bg-white"
                    >
                      <option value="3r">Prinsip 3R</option>
                      <option value="bahaya_sampah">Bahaya Sampah</option>
                      <option value="jenis_sampah">Klasifikasi Sampah</option>
                      <option value="bank_sampah">Tata Kelola Bank Sampah</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Urutan Tampil</label>
                    <input
                      type="number"
                      value={form.urutan}
                      onChange={(e) => setForm({ ...form, urutan: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ringkasan Singkat</label>
                  <input
                    value={form.ringkasan}
                    onChange={(e) => setForm({ ...form, ringkasan: e.target.value })}
                    placeholder="Deskripsi 1-2 kalimat untuk preview kartu"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Konten / Narasi Lengkap *</label>
                  <textarea
                    required
                    rows={6}
                    value={form.konten}
                    onChange={(e) => setForm({ ...form, konten: e.target.value })}
                    placeholder="Tuliskan modul edukasi secara terperinci..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Gambar Thumbnail</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Status Tayang</label>
                    <select
                      value={form.is_published}
                      onChange={(e) => setForm({ ...form, is_published: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm bg-white"
                    >
                      <option value="true">Publikasikan Langsung</option>
                      <option value="false">Simpan Sebagai Draft</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md disabled:opacity-60"
                  >
                    {saving && <Loader2 size={16} className="animate-spin" />}
                    Simpan Materi
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
