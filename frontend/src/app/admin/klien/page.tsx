'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Search, Building2, MapPin, Phone, CheckCircle2, XCircle } from 'lucide-react'
import AdminSidebar from '@/components/layout/AdminSidebar'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { DEFAULT_CLIENTS } from '@/lib/constants'

export default function AdminKlienPage() {
  const [clients, setClients] = useState<any[]>(DEFAULT_CLIENTS)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    kode_client: '',
    nama_client: '',
    perusahaan: '',
    komoditas: '',
    alamat: '',
    nomor_hp: '',
    status_aktif: true,
  })

  const fetchClients = async () => {
    try {
      const res = await api.get('/klien')
      if (res.data?.data && res.data.data.length > 0) {
        setClients(res.data.data)
      }
    } catch {
      // keep default mock
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const openNew = () => {
    const nextCode = `CLN-00${clients.length + 1}`
    setEditItem(null)
    setForm({
      kode_client: nextCode,
      nama_client: '',
      perusahaan: '',
      komoditas: 'Logam (Tembaga, Aluminium)',
      alamat: '',
      nomor_hp: '',
      status_aktif: true,
    })
    setShowForm(true)
  }

  const openEdit = (c: any) => {
    setEditItem(c)
    setForm({
      kode_client: c.kode_client,
      nama_client: c.nama_client,
      perusahaan: c.perusahaan || '',
      komoditas: c.komoditas || '',
      alamat: c.alamat,
      nomor_hp: c.nomor_hp,
      status_aktif: c.status_aktif ?? true,
    })
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (editItem) {
        try {
          await api.put(`/klien/${editItem.id}`, form)
        } catch {}
        setClients((prev) =>
          prev.map((c) => (c.id === editItem.id ? { ...c, ...form } : c))
        )
        toast.success(`Data klien "${form.nama_client}" berhasil diperbarui`)
      } else {
        const newItem = {
          id: `cl-${Date.now()}`,
          ...form,
        }
        try {
          await api.post('/klien', form)
        } catch {}
        setClients((prev) => [newItem, ...prev])
        toast.success(`Client baru "${form.nama_client}" berhasil ditambahkan`)
      }
      setShowForm(false)
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan data client')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (id: string, nama: string) => {
    if (!confirm(`Hapus data client/pembeli "${nama}"?`)) return
    setClients((prev) => prev.filter((c) => c.id !== id))
    try {
      api.delete(`/klien/${id}`).catch(() => {})
    } catch {}
    toast.success(`Client "${nama}" berhasil dihapus`)
  }

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase()
    return (
      c.nama_client.toLowerCase().includes(q) ||
      c.kode_client.toLowerCase().includes(q) ||
      c.alamat.toLowerCase().includes(q)
    )
  })

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 ml-0 w-full min-w-0 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-widest mb-1">
              <Building2 size={14} /> Pihak Ketiga & Industri Offtaker
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Kelola Data Client / Pembeli
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Data identitas pembeli, pengepul, dan industri daur ulang penampung komoditas Bank Sampah.
            </p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-blue-900/20"
          >
            <Plus size={16} /> Tambah Client / Pembeli
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari ID Client, nama pembeli, atau alamat industri..."
            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all shadow-sm"
          />
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[750px]">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4">ID Client</th>
                  <th className="px-6 py-4">Nama Pelanggan / Pabrik</th>
                  <th className="px-6 py-4">Komoditas yang Ditampung</th>
                  <th className="px-6 py-4">Nomor HP / WhatsApp</th>
                  <th className="px-6 py-4">Alamat Gudang / Industri</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-slate-400">
                      Tidak ada data client / pembeli ditemukan.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-xs text-blue-700">
                        <span className="bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                          {c.kode_client}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{c.nama_client}</div>
                        {c.perusahaan && (
                          <div className="text-[11px] text-slate-400">{c.perusahaan}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                          {c.komoditas || 'Semua Komoditas'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Phone size={13} className="text-slate-400" />
                          <span>{c.nomor_hp}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 max-w-xs">
                        <div className="flex items-start gap-1.5">
                          <MapPin size={13} className="text-slate-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{c.alamat}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            c.status_aktif
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {c.status_aktif ? (
                            <>
                              <CheckCircle2 size={12} /> Aktif
                            </>
                          ) : (
                            <>
                              <XCircle size={12} /> Nonaktif
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEdit(c)}
                            title="Edit Data Client"
                            className="p-2 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id, c.nama_client)}
                            title="Hapus"
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-slate-200 animate-fade-in-up">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {editItem ? 'Edit Data Client / Pembeli' : 'Tambah Client / Pembeli Baru'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Masukkan rincian identitas pelanggan/offtaker yang membeli sampah daur ulang.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ID Client *
                    </label>
                    <input
                      required
                      value={form.kode_client}
                      onChange={(e) => setForm({ ...form, kode_client: e.target.value.toUpperCase() })}
                      placeholder="CLN-001"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm font-mono font-bold uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nomor HP / WhatsApp *
                    </label>
                    <input
                      required
                      value={form.nomor_hp}
                      onChange={(e) => setForm({ ...form, nomor_hp: e.target.value })}
                      placeholder="08123456789"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Pelanggan / Pabrik *
                  </label>
                  <input
                    required
                    value={form.nama_client}
                    onChange={(e) => setForm({ ...form, nama_client: e.target.value })}
                    placeholder="Contoh: PT Daur Logam Nusantara"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Jenis Usaha / Kategori
                    </label>
                    <input
                      value={form.perusahaan}
                      onChange={(e) => setForm({ ...form, perusahaan: e.target.value })}
                      placeholder="Peleburan Logam / Pengepul"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Komoditas Utama
                    </label>
                    <input
                      value={form.komoditas}
                      onChange={(e) => setForm({ ...form, komoditas: e.target.value })}
                      placeholder="Tembaga, Aluminium, PET"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alamat Lengkap Pabrik / Gudang *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={form.alamat}
                    onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                    placeholder="Jl. Raya Industri No. XX, Kota / Kabupaten..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="status_aktif"
                    checked={form.status_aktif}
                    onChange={(e) => setForm({ ...form, status_aktif: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <label htmlFor="status_aktif" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Status Klien Aktif (Siap Bertransaksi)
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
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
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50"
                  >
                    {saving ? 'Menyimpan...' : editItem ? 'Simpan Perubahan' : 'Tambah Client'}
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
