'use client'

import { useState, useEffect } from 'react'
import { X, MapPin, Send, CheckCircle2, AlertCircle, Users } from 'lucide-react'
import { DATA_38_PROVINSI } from '@/lib/provinsi-data'
import api from '@/lib/api'

interface AjukanProvinsiModalProps {
  isOpen: boolean
  onClose: () => void
  defaultProvinsiKode?: string
}

export default function AjukanProvinsiModal({
  isOpen,
  onClose,
  defaultProvinsiKode,
}: AjukanProvinsiModalProps) {
  // 37 provinsi yang belum tersedia di SIMBA (selain Sumatera Utara kode '12' / 'SU')
  const daftarProvinsiBelumTersedia = DATA_38_PROVINSI.filter(
    (p) => p.kode_bps !== '12' && p.kode_iso !== 'SU'
  )

  const [provinsiKode, setProvinsiKode] = useState(defaultProvinsiKode || '')
  const [peran, setPeran] = useState('warga')
  const [email, setEmail] = useState('')
  const [catatan, setCatatan] = useState('')
  const [websiteTrap, setWebsiteTrap] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [minatCounts, setMinatCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    if (defaultProvinsiKode) {
      setProvinsiKode(defaultProvinsiKode)
    }
  }, [defaultProvinsiKode])

  // Ambil agregasi minat nyata dari backend
  useEffect(() => {
    if (!isOpen) return
    api
      .get('/provinsi/minat')
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.data)) {
          const map: Record<string, number> = {}
          res.data.data.forEach((item: any) => {
            map[item.kode] = item.jumlah_minat || 0
          })
          setMinatCounts(map)
        }
      })
      .catch(() => {})
  }, [isOpen])

  if (!isOpen) return null

  const selectedProvinsiObj = DATA_38_PROVINSI.find(
    (p) => p.kode_bps === provinsiKode || p.kode_iso === provinsiKode
  )

  const curCount = selectedProvinsiObj
    ? minatCounts[selectedProvinsiObj.kode_bps] || 0
    : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!provinsiKode) {
      setError('Silakan pilih provinsi Anda.')
      return
    }

    setLoading(true)
    try {
      await api.post('/provinsi/minat', {
        provinsi_kode: selectedProvinsiObj?.kode_bps || provinsiKode,
        peran,
        email: email ? email.trim() : null,
        catatan: catatan ? catatan.trim() : null,
        website_trap: websiteTrap,
      })
      setSuccess(true)
      // Perbarui counter lokal
      if (selectedProvinsiObj) {
        setMinatCounts((prev) => ({
          ...prev,
          [selectedProvinsiObj.kode_bps]: (prev[selectedProvinsiObj.kode_bps] || 0) + 1,
        }))
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Gagal mengirimkan pengajuan minat. Silakan coba lagi.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setProvinsiKode('')
    setPeran('warga')
    setEmail('')
    setCatatan('')
    setWebsiteTrap('')
    setSuccess(false)
    setError(null)
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ajukan-provinsi-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-emerald-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/60 flex items-center justify-center text-emerald-200">
              <MapPin size={20} />
            </div>
            <div>
              <h2 id="ajukan-provinsi-title" className="text-lg font-bold">
                Ajukan Provinsi Saya
              </h2>
              <p className="text-xs text-emerald-200">
                Bantu tentukan prioritas ekspansi SIMBA Nusantara berikutnya
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup formulir pengajuan provinsi"
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Aspirasi Anda Berhasil Dicatat!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                Terima kasih! Dukungan Anda untuk{' '}
                <span className="font-semibold text-emerald-700">
                  {selectedProvinsiObj?.nama}
                </span>{' '}
                sangat berharga. Data permintaan ini kami jadikan dasar roadmap kerja sama dengan
                Dinas Lingkungan Hidup daerah Anda.
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
              >
                Selesai
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                <strong>Status Pilot:</strong> Saat ini SIMBA beroperasi penuh dengan pilot data riil di{' '}
                <strong>Sumatera Utara</strong> (33 kab/kota). 37 provinsi lain berstatus{' '}
                <em>"Belum tersedia di SIMBA"</em>.
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Honeypot anti-spam */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="trap_prov">Jangan isi bagian ini jika Anda manusia</label>
                <input
                  id="trap_prov"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={websiteTrap}
                  onChange={(e) => setWebsiteTrap(e.target.value)}
                />
              </div>

              {/* Pilih Provinsi */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilih Provinsi Anda <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={provinsiKode}
                  onChange={(e) => setProvinsiKode(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white"
                >
                  <option value="">-- Pilih salah satu dari 37 Provinsi --</option>
                  {daftarProvinsiBelumTersedia.map((p) => {
                    const count = minatCounts[p.kode_bps] || 0
                    return (
                      <option key={p.kode_bps} value={p.kode_bps}>
                        {p.nama} ({count} warga mengajukan)
                      </option>
                    )
                  })}
                </select>
              </div>

              {/* Live Count Indicator */}
              {selectedProvinsiObj && (
                <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                  <Users size={16} className="text-emerald-600 shrink-0" />
                  <span>
                    Saat ini telah ada{' '}
                    <strong className="text-emerald-700 font-bold">{curCount}</strong> permintaan
                    nyata warga dari <strong>{selectedProvinsiObj.nama}</strong>.
                  </span>
                </div>
              )}

              {/* Peran Pengusul */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Peran / Kategori Anda <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'warga', label: 'Warga / Nasabah' },
                    { id: 'pengelola', label: 'Pengelola Bank Sampah' },
                    { id: 'pemda', label: 'Pemerintah Daerah / DLH' },
                    { id: 'lainnya', label: 'Lainnya / Komunitas' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setPeran(item.id)}
                      className={`p-2.5 text-xs font-semibold rounded-xl border text-center transition-all ${
                        peran === item.id
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Pengusul */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Anda (Opsional — untuk notifikasi saat provinsi aktif)
                </label>
                <input
                  type="email"
                  placeholder="email.anda@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Catatan / Aspirasi */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan / Aspirasi Tambahan (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Sebutkan kota/kabupaten spesifik atau potensi unit bank sampah di daerah Anda"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 resize-none"
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
                  <span>{loading ? 'Mengirim...' : 'Ajukan Provinsi'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
