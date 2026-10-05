'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Leaf, Eye, EyeOff, Loader2 } from 'lucide-react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({
    nama_lengkap: '', email: '', password: '', nomor_hp: '', alamat: '', nik: '',
  })

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error('Password minimal 6 karakter'); return }
    setLoading(true)
    try {
      await api.post('/auth/register', form)
      toast.success('Pendaftaran berhasil! Silakan login.')
      router.push('/login')
    } catch (err: any) {
      toast.error(err.message || 'Pendaftaran gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Leaf size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Daftar Nasabah SIMBA</h1>
          <p className="text-slate-500 mt-1 text-sm">Bank Sampah Dinas Lingkungan Hidup Kabupaten Toba</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Lengkap *</label>
                <input
                  type="text" required value={form.nama_lengkap} onChange={set('nama_lengkap')}
                  placeholder="Nama sesuai KTP"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email *</label>
                <input
                  type="email" required value={form.email} onChange={set('email')}
                  placeholder="nama@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">NIK</label>
                <input
                  type="text" value={form.nik} onChange={set('nik')}
                  placeholder="16 digit NIK"
                  maxLength={16}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nomor HP</label>
                <input
                  type="tel" value={form.nomor_hp} onChange={set('nomor_hp')}
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Alamat</label>
                <textarea
                  value={form.alamat} onChange={set('alamat')} rows={2}
                  placeholder="Alamat lengkap"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm resize-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password *</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'} required value={form.password} onChange={set('password')}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <><Loader2 size={17} className="animate-spin" /> Mendaftar...</> : 'Daftar Sekarang'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
