'use client'

import { useState } from 'react'
import { X, Send, Building2, CheckCircle2, AlertCircle } from 'lucide-react'
import { KABUPATEN_KOTA_SUMUT } from '@/lib/sumut-constants'
import api from '@/lib/api'

interface UsulkanUnitModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function UsulkanUnitModal({ isOpen, onClose }: UsulkanUnitModalProps) {
  const [formData, setFormData] = useState({
    nama: '',
    kabupaten_kota_kode: '',
    alamat_lengkap: '',
    telepon: '',
    nama_pengusul: '',
    email_pengusul: '',
    catatan: '',
    website_trap: '', // Honeypot anti-spam
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.nama.trim().length < 3) {
      setError('Nama bank sampah minimal 3 karakter.')
      return
    }
    if (!formData.kabupaten_kota_kode) {
      setError('Pilih kabupaten/kota di Sumatera Utara.')
      return
    }
    if (formData.alamat_lengkap.trim().length < 10) {
      setError('Alamat lengkap minimal 10 karakter.')
      return
    }
    if (formData.nama_pengusul.trim().length < 2) {
      setError('Nama pengusul wajib diisi.')
      return
    }

    setLoading(true)
    try {
      await api.post('/unit/usulkan', formData)
      setSuccess(true)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Gagal mengirim usulan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      nama: '',
      kabupaten_kota_kode: '',
      alamat_lengkap: '',
      telepon: '',
      nama_pengusul: '',
      email_pengusul: '',
      catatan: '',
      website_trap: '',
    })
    setSuccess(false)
    setError(null)
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="usulkan-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-emerald-800 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/60 flex items-center justify-center text-emerald-200">
              <Building2 size={20} />
            </div>
            <div>
              <h2 id="usulkan-title" className="text-lg font-bold">Usulkan Bank Sampah Baru</h2>
              <p className="text-xs text-emerald-100">Bantu petakan bank sampah aktif di Sumatera Utara</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup formulir usulan"
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Usulan Berhasil Dikirim!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                Terima kasih atas kontribusi Anda. Sesuai aturan transparansi data SIMBA, tim verifikator kami akan melakukan peninjauan dan konfirmasi ke pihak bank sampah / DLH setempat sebelum diterbitkan ke publik.
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
              >
                Tutup Jendela
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Honeypot anti-spam field */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="website_trap">Jangan isi bagian ini jika Anda manusia</label>
                <input
                  id="website_trap"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website_trap}
                  onChange={(e) => setFormData({ ...formData, website_trap: e.target.value })}
                />
              </div>

              {/* Nama Bank Sampah */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Bank Sampah <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bank Sampah Berkah Lestari"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Kabupaten / Kota */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kabupaten / Kota (Sumatera Utara) <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.kabupaten_kota_kode}
                  onChange={(e) => setFormData({ ...formData, kabupaten_kota_kode: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white"
                >
                  <option value="">-- Pilih Kabupaten / Kota --</option>
                  {KABUPATEN_KOTA_SUMUT.map((k) => (
                    <option key={k.kode} value={k.kode}>
                      {k.nama} ({k.kode})
                    </option>
                  ))}
                </select>
              </div>

              {/* Alamat Lengkap */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Lengkap <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Jl. Nama Jalan No. XX, Kelurahan, Kecamatan"
                  value={formData.alamat_lengkap}
                  onChange={(e) => setFormData({ ...formData, alamat_lengkap: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 resize-none"
                />
              </div>

              {/* Telepon / WA Unit */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kontak Publik Unit / WhatsApp (Opsional)
                </label>
                <input
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={formData.telepon}
                  onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Profil Pengusul */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Anda (Pengusul) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap"
                    value={formData.nama_pengusul}
                    onChange={(e) => setFormData({ ...formData, nama_pengusul: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Anda (Opsional)
                  </label>
                  <input
                    type="email"
                    placeholder="email@domain.com"
                    value={formData.email_pengusul}
                    onChange={(e) => setFormData({ ...formData, email_pengusul: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              {/* Catatan Tambahan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Tambahan / Jadwal Rutin (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Misal: Buka tiap Sabtu minggu ke-2, binaan DLH"
                  value={formData.catatan}
                  onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50"
                >
                  <Send size={15} />
                  <span>{loading ? 'Mengirim...' : 'Kirim Usulan'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
