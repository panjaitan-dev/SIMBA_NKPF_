'use client'

import { useState } from 'react'
import { X, AlertTriangle, Send, CheckCircle2, AlertCircle } from 'lucide-react'
import api from '@/lib/api'

interface LaporKeliruModalProps {
  isOpen: boolean
  onClose: () => void
  unitSlug: string
  unitNama: string
}

const JENIS_KEKELIRUAN_OPTIONS = [
  { id: 'alamat_salah', label: 'Alamat / Titik Peta Keliru' },
  { id: 'nomor_tidak_aktif', label: 'Nomor Kontak Tidak Aktif' },
  { id: 'jam_tutup', label: 'Jam / Hari Operasional Berbeda' },
  { id: 'harga_berbeda', label: 'Harga Beli Sampah Berbeda' },
  { id: 'lainnya', label: 'Kekeliruan Lainnya' },
]

export default function LaporKeliruModal({
  isOpen,
  onClose,
  unitSlug,
  unitNama,
}: LaporKeliruModalProps) {
  const [formData, setFormData] = useState({
    jenis_kekeliruan: 'alamat_salah',
    deskripsi: '',
    data_usulan_koreksi: '',
    nama_pelapor: '',
    kontak_pelapor: '',
    website_trap: '', // Honeypot
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.deskripsi.trim().length < 10) {
      setError('Deskripsi kekeliruan minimal 10 karakter.')
      return
    }

    setLoading(true)
    try {
      await api.post(`/unit/${unitSlug}/lapor-keliru`, formData)
      setSuccess(true)
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Gagal mengirim laporan. Silakan coba beberapa saat lagi.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      jenis_kekeliruan: 'alamat_salah',
      deskripsi: '',
      data_usulan_koreksi: '',
      nama_pelapor: '',
      kontak_pelapor: '',
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
      aria-labelledby="lapor-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-amber-600 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/60 flex items-center justify-center text-amber-100">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2 id="lapor-title" className="text-lg font-bold">Laporkan Data Keliru</h2>
              <p className="text-xs text-amber-100 truncate max-w-xs">{unitNama}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup formulir lapor keliru"
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
              <h3 className="text-xl font-bold text-slate-900 mb-2">Laporan Diterima!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                Terima kasih atas partisipasi Anda dalam menjaga validitas data di SIMBA. Tim verifikator kami akan menindaklanjuti laporan ini ke pengelola unit.
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
              >
                Tutup
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Honeypot trap */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="trap_lapor">Jangan isi ini jika Anda manusia</label>
                <input
                  id="trap_lapor"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website_trap}
                  onChange={(e) => setFormData({ ...formData, website_trap: e.target.value })}
                />
              </div>

              {/* Jenis Kekeliruan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bagian Data yang Keliru <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.jenis_kekeliruan}
                  onChange={(e) => setFormData({ ...formData, jenis_kekeliruan: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 bg-white"
                >
                  {JENIS_KEKELIRUAN_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi Kekeliruan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Jelaskan secara ringkas bagian mana yang tidak sesuai dengan kondisi riil..."
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 resize-none"
                />
              </div>

              {/* Data Usulan Koreksi */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Koreksi yang Benar (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Jam tutup yang benar adalah 14:00, atau nomor WA baru 0812..."
                  value={formData.data_usulan_koreksi}
                  onChange={(e) => setFormData({ ...formData, data_usulan_koreksi: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 resize-none"
                />
              </div>

              {/* Identitas Pelapor (Opsional) */}
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Anda (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    value={formData.nama_pelapor}
                    onChange={(e) => setFormData({ ...formData, nama_pelapor: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kontak / WhatsApp (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="08xxxxxxxxxx"
                    value={formData.kontak_pelapor}
                    onChange={(e) => setFormData({ ...formData, kontak_pelapor: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </div>
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50"
                >
                  <Send size={15} />
                  <span>{loading ? 'Mengirim...' : 'Kirim Laporan'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
