'use client'
import { useState } from 'react'
import { Loader2, MapPin, Camera, Send, CheckCircle } from 'lucide-react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function LaporPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [fotos, setFotos] = useState<FileList | null>(null)
  const [form, setForm] = useState({
    judul: '', deskripsi: '', lokasi: '', nama_pelapor: '', nomor_hp: '',
  })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (fotos) Array.from(fotos).forEach(f => fd.append('fotos', f))

      await api.post('/laporan', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setSubmitted(true)
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengirim laporan')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 pt-20">
        <div className="max-w-md w-full text-center bg-white rounded-3xl border border-slate-200 p-12 shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={36} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Laporan Terkirim!</h2>
          <p className="text-slate-500 mb-8">Terima kasih telah melaporkan. Tim kami akan segera menindaklanjuti laporan Anda.</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => { setSubmitted(false); setForm({ judul: '', deskripsi: '', lokasi: '', nama_pelapor: '', nomor_hp: '' }); setFotos(null) }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors">
              Buat Laporan Baru
            </button>
            <a href="/" className="text-sm text-slate-500 hover:text-emerald-600">← Kembali ke Beranda</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-6">
        <div className="mb-10">
          <span className="text-emerald-600 font-semibold tracking-widest text-xs uppercase mb-2 block">Partisipasi Warga</span>
          <h1 className="text-3xl font-extrabold text-slate-900">Laporkan Masalah Lingkungan</h1>
          <p className="text-slate-500 mt-2">Bantu kami menjaga kebersihan lingkungan Kabupaten Toba dengan melaporkan masalah yang Anda temui.</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Judul Laporan *</label>
              <input type="text" required value={form.judul} onChange={set('judul')} placeholder="Contoh: Tumpukan sampah liar di Jl. Ahmad Yani"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi Masalah *</label>
              <textarea required value={form.deskripsi} onChange={set('deskripsi')} rows={4}
                placeholder="Jelaskan masalah yang Anda temui secara detail..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm resize-none" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"><MapPin size={14} /> Lokasi Kejadian *</label>
              <input type="text" required value={form.lokasi} onChange={set('lokasi')} placeholder="Nama jalan, kelurahan, kecamatan"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Pelapor</label>
                <input type="text" value={form.nama_pelapor} onChange={set('nama_pelapor')} placeholder="Opsional"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nomor HP</label>
                <input type="tel" value={form.nomor_hp} onChange={set('nomor_hp')} placeholder="Opsional"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"><Camera size={14} /> Foto Bukti (maks. 5 foto)</label>
              <input type="file" accept="image/*" multiple max={5} onChange={e => setFotos(e.target.files)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 file:text-xs file:font-semibold" />
              {fotos && <p className="text-xs text-slate-500 mt-1">{fotos.length} foto dipilih</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2">
              {loading ? <><Loader2 size={17} className="animate-spin" /> Mengirim...</> : <><Send size={17} /> Kirim Laporan</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
