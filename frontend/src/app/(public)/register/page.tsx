'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Leaf, Eye, EyeOff, Loader2, Building2, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import {
  NAMA_MAX,
  EMAIL_MAX,
  NIK_LENGTH,
  PHONE_MAX,
  ALAMAT_MAX,
  PASSWORD_MAX,
} from '@/lib/limits'
import {
  registerSchema,
  calculatePasswordStrength,
  formatPhoneDisplay,
  cleanPhoneInput,
  maskNik,
} from '@/lib/validation'

const DEFAULT_UNITS = [
  { id: '11111111-1111-1111-1111-111111111111', nama: 'Bank Sampah Induk Medan Bersih', kode: 'BSI-MDN01', alamat: 'Kota Medan, Sumatera Utara' },
  { id: '22222222-2222-2222-2222-222222222222', nama: 'Bank Sampah Unit Deli Lestari', kode: 'BSU-MDN02', alamat: 'Kec. Medan Barat, Kota Medan' },
]

const DOMAIN_SUGGESTIONS = ['gmail.com', 'yahoo.com', 'outlook.com']

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [showMaskedNik, setShowMaskedNik] = useState(false)
  const [units, setUnits] = useState<any[]>(DEFAULT_UNITS)

  // Form State
  const [form, setForm] = useState({
    nama_lengkap: '',
    email: '',
    password: '',
    nomor_hp: '',
    alamat: '',
    nik: '',
    unit_id: '',
  })

  // Validation States
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Individual field refs for autofocusing errors
  const namaRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const nikRef = useRef<HTMLInputElement>(null);
  const hpRef = useRef<HTMLInputElement>(null);
  const unitRef = useRef<HTMLSelectElement>(null);
  const alamatRef = useRef<HTMLTextAreaElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api
      .get('/unit')
      .then((res) => {
        if (res.data?.data?.length) {
          setUnits(res.data.data)
          setForm((f) => ({ ...f, unit_id: res.data.data[0].id }))
        } else {
          setForm((f) => ({ ...f, unit_id: DEFAULT_UNITS[0].id }))
        }
      })
      .catch(() => {
        setForm((f) => ({ ...f, unit_id: DEFAULT_UNITS[0].id }))
      })
  }, [])

  // Validasi per-field saat blur
  const validateField = (field: string, value: any) => {
    try {
      const partialObj = { ...form, [field]: value }
      const res = registerSchema.safeParse(partialObj)
      if (!res.success) {
        const issues = (res.error.issues || (res.error as any).errors || []) as any[]
        const fieldError = issues.find((e: any) => e.path.join('.') === field)
        if (fieldError) {
          setErrors((prev) => ({ ...prev, [field]: fieldError.message }))
          return fieldError.message
        }
      }
      setErrors((prev) => {
        const copy = { ...prev }
        delete copy[field]
        return copy
      })
      return ''
    } catch {
      return ''
    }
  }

  const handleBlur = (field: string) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    validateField(field, form[field as keyof typeof form])
  }

  // Input change handlers
  const handleNamaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.slice(0, NAMA_MAX)
    setForm((f) => ({ ...f, nama_lengkap: val }))
    if (touched.nama_lengkap) validateField('nama_lengkap', val)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim().toLowerCase().slice(0, EMAIL_MAX)
    setForm((f) => ({ ...f, email: val }))
    if (touched.email) validateField('email', val)
  }

  const handleChipClick = (domain: string) => {
    const parts = form.email.split('@')
    const username = parts[0] || ''
    const newEmail = `${username}@${domain}`
    setForm((f) => ({ ...f, email: newEmail }))
    setTouched((prev) => ({ ...prev, email: true }))
    validateField('email', newEmail)
    fieldRefs.email.current?.focus()
  }

  const handleNikChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Buang non-digit saat ketik & paste, maks NIK_LENGTH
    const clean = e.target.value.replace(/\D/g, '').slice(0, NIK_LENGTH)
    setForm((f) => ({ ...f, nik: clean }))
    if (touched.nik) validateField('nik', clean)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = cleanPhoneInput(e.target.value)
    setForm((f) => ({ ...f, nomor_hp: clean }))
    if (touched.nomor_hp) validateField('nomor_hp', clean)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.slice(0, PASSWORD_MAX)
    setForm((f) => ({ ...f, password: val }))
    if (touched.password) validateField('password', val)
  }

  const pwStrength = calculatePasswordStrength(form.password)

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 1. Validasi Zod Lengkap di Frontend
    const parseResult = registerSchema.safeParse(form)
    if (!parseResult.success) {
      const issues = (parseResult.error.issues || (parseResult.error as any).errors || []) as any[]
      const newErrors: Record<string, string> = {}
      let firstErrorKey = ''
      for (const err of issues) {
        const key = err.path.join('.') || 'form'
        if (!newErrors[key]) newErrors[key] = err.message
        if (!firstErrorKey) firstErrorKey = key
      }
      setErrors(newErrors)
      setTouched({
        nama_lengkap: true,
        email: true,
        password: true,
        nik: true,
        nomor_hp: true,
        alamat: true,
        unit_id: true,
      })

      // Fokuskan kursor ke field error pertama
      if (firstErrorKey && fieldRefs[firstErrorKey as keyof typeof fieldRefs]?.current) {
        fieldRefs[firstErrorKey as keyof typeof fieldRefs].current?.focus()
      }

      toast.error(issues[0]?.message || 'Periksa kembali formulir pendaftaran')
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...parseResult.data,
        nomor_hp: parseResult.data.nomor_hp || form.nomor_hp,
      }
      const res = await api.post('/auth/register', payload)

      toast.success(res.data?.message || 'Pendaftaran berhasil! Silakan masuk.')
      router.push('/login')
    } catch (err: any) {
      const serverErrors = err.response?.data?.errors
      if (Array.isArray(serverErrors) && serverErrors.length > 0) {
        const sErrors: Record<string, string> = {}
        for (const se of serverErrors) {
          sErrors[se.field] = se.message
        }
        setErrors((prev) => ({ ...prev, ...sErrors }))
        toast.error(serverErrors[0]?.message || err.message)
      } else {
        toast.error(err.message || 'Pendaftaran gagal')
      }
    } finally {
      setLoading(false)
    }
  }

  const emailHasNoDomain = form.email.length > 0 && !form.email.includes('@')

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-600/20">
            <Leaf size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Daftar Nasabah SIMBA</h1>
          <p className="text-slate-500 mt-1 text-sm">Sistem Informasi Bank Sampah Indonesia</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nama Lengkap */}
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="reg-nama" className="text-sm font-semibold text-slate-700">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {form.nama_lengkap.length}/{NAMA_MAX}
                  </span>
                </div>
                <input
                  id="reg-nama"
                  ref={fieldRefs.nama_lengkap}
                  type="text"
                  required maxLength={NAMA_MAX}
                  value={form.nama_lengkap}
                  onChange={handleNamaChange}
                  onBlur={handleBlur('nama_lengkap')}
                  aria-invalid={!!errors.nama_lengkap}
                  aria-describedby={errors.nama_lengkap ? 'err-nama' : 'help-nama'}
                  placeholder="Nama sesuai KTP (contoh: Dewi Lestari)"
                  className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all ${
                    errors.nama_lengkap
                      ? 'border-rose-400 focus:ring-2 focus:ring-rose-100'
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
                  }`}
                />
                  {form.nama_lengkap.length >= NAMA_MAX && (
                    <span aria-live="polite" className="text-[11px] text-amber-600 font-medium">
                      Batas {NAMA_MAX} karakter tercapai
                    </span>
                  )}
                {errors.nama_lengkap ? (
                  <p id="err-nama" className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle size={13} className="shrink-0" /> {errors.nama_lengkap}
                  </p>
                ) : (
                  <p id="help-nama" className="text-[11px] text-slate-400 mt-1">
                    Gunakan huruf sesuai kartu identitas (KTP), tanpa angka atau simbol.
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label htmlFor="reg-email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email <span className="text-rose-500">*</span>
                </label>
                <input
                  id="reg-email"
                  ref={fieldRefs.email}
                  type="email"
                  required
                  maxLength={EMAIL_MAX}
                  value={form.email}
                  onChange={(e) => {
                    const val = e.target.value.trim().toLowerCase().slice(0, EMAIL_MAX)
                    setForm((f) => ({ ...f, email: val }))
                  }}
                  onBlur={handleBlur('email')}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'err-email' : 'help-email'}
                  placeholder="nama@contoh.com"
                  className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all ${
                    errors.email
                      ? 'border-rose-400 focus:ring-2 focus:ring-rose-100'
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
                  }`}
                />
                


                

  
  
    

      


  




                  


                      


                {errors.email ? (
                  <p id="err-email" className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle size={13} className="shrink-0" /> {errors.email}
                  </p>
                ) : (
                  <p id="help-email" className="text-[11px] text-slate-400 mt-1">
                    Digunakan untuk login dan verifikasi akun portal Anda.
                  </p>
                )}
              </div>

              {/* NIK */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="reg-nik" className="text-sm font-semibold text-slate-700">
                    NIK <span className="text-slate-400 font-normal text-xs">(Opsional)</span>
                  </label>
                  {form.nik.length >= 4 && (
                    <button
                      type="button"
                      onClick={() => setShowMaskedNik(!showMaskedNik)}
                      className="text-[11px] text-emerald-600 hover:underline font-medium"
                    >
                      {showMaskedNik ? 'Tampilkan' : 'Masking'}
                    </button>
                  )}
                </div>
                <input
                  id="reg-nik"
                  ref={fieldRefs.nik}
                  type="text"
                  inputMode="numeric"
                  maxLength={16}
                  value={showMaskedNik ? maskNik(form.nik) : form.nik}
                  onChange={handleNikChange}
                  onBlur={handleBlur('nik')}
                  aria-invalid={!!errors.nik}
                  aria-describedby={errors.nik ? 'err-nik' : 'help-nik'}
                  placeholder="16 digit angka KTP"
                  className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all ${
                    errors.nik
                      ? 'border-rose-400 focus:ring-2 focus:ring-rose-100'
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
                  }`}
                />
                 {form.nik.length >= NIK_LENGTH && (
                   <span aria-live="polite" className="text-[11px] text-amber-600 font-medium">
                     Batas {NIK_LENGTH} digit tercapai
                   </span>
                 )}
                {errors.nik ? (
                  <p id="err-nik" className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle size={13} className="shrink-0" /> {errors.nik}
                  </p>
                ) : (
                  <p id="help-nik" className="text-[11px] text-slate-400 mt-1">
                    Dilindungi UU PDP No. 27/2022. Wajib 16 digit valid.
                  </p>
                )}
              </div>

              {/* Nomor HP */}
              <div>
                <label htmlFor="reg-hp" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Nomor HP <span className="text-slate-400 font-normal text-xs">(Opsional)</span>
                </label>
                <input
                  id="reg-hp"
                  ref={fieldRefs.nomor_hp}
                  type="text"
                  inputMode="numeric" maxLength={PHONE_MAX}
                  value={form.nomor_hp ? formatPhoneDisplay(form.nomor_hp) : ''}
                  onChange={handlePhoneChange}
                  onBlur={handleBlur('nomor_hp')}
                  aria-invalid={!!errors.nomor_hp}
                  aria-describedby={errors.nomor_hp ? 'err-hp' : 'help-hp'}
                  placeholder="0812-3456-7890"
                  className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all ${
                    errors.nomor_hp
                      ? 'border-rose-400 focus:ring-2 focus:ring-rose-100'
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
                  }`}
                />
                 {form.nomor_hp.length >= PHONE_MAX && (
                   <span aria-live="polite" className="text-[11px] text-amber-600 font-medium">
                     Batas {PHONE_MAX} digit tercapai
                   </span>
                 )}
                {errors.nomor_hp ? (
                  <p id="err-hp" className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle size={13} className="shrink-0" /> {errors.nomor_hp}
                  </p>
                ) : (
                  <p id="help-hp" className="text-[11px] text-slate-400 mt-1">
                    Format otomatis dinormalisasi ke awalan 62.
                  </p>
                )}
              </div>

              {/* Unit Bank Sampah */}
              <div className="md:col-span-2">
                <label htmlFor="reg-unit" className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Building2 size={16} className="text-emerald-600" />
                  Unit Bank Sampah Terdaftar <span className="text-rose-500">*</span>
                </label>
                <select
                  id="reg-unit"
                  ref={fieldRefs.unit_id}
                  required
                  value={form.unit_id}
                  onChange={(e) => setForm((f) => ({ ...f, unit_id: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm bg-white"
                >
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nama} {u.kode ? `(${u.kode})` : ''} — {u.alamat || 'Unit Bank Sampah'}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Pilih unit bank sampah terdekat untuk penyetoran sampah dan pencairan saldo Anda.
                </p>
              </div>

              {/* Alamat */}
              <div className="md:col-span-2">
                <label htmlFor="reg-alamat" className="flex justify-between items-center mb-1.5">
                  Alamat Tempat Tinggal
                  <span className="text-[11px] text-slate-400 font-mono">{form.alamat.length}/{ALAMAT_MAX}</span>
                </label>
                <textarea
                  id="reg-alamat"
                  ref={fieldRefs.alamat}
                  rows={2}
                  maxLength={ALAMAT_MAX}
                  value={form.alamat}
                  onChange={(e) => setForm((f) => ({ ...f, alamat: e.target.value.slice(0, ALAMAT_MAX) }))}
                  onBlur={handleBlur('alamat')}
                  aria-invalid={!!errors.alamat}
                  aria-describedby={errors.alamat ? 'err-alamat' : undefined}
                  placeholder="Alamat lengkap (RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten)"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm resize-none"
                />
                {form.alamat.length >= ALAMAT_MAX && (
                  <span aria-live="polite" className="text-[11px] text-amber-600 font-medium">Batas {ALAMAT_MAX} karakter tercapai</span>
                )}
                {errors.alamat && (
                  <p id="err-alamat" className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle size={13} className="shrink-0" /> {errors.alamat}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="md:col-span-2">
                <label htmlFor="reg-password" className="flex justify-between items-center mb-1.5">
                  Password <span className="text-rose-500">*</span>
                  <span className="text-[11px] text-slate-400 font-mono">{form.password.length}/{PASSWORD_MAX}</span>
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    ref={fieldRefs.password}
                    type={showPw ? 'text' : 'password'}
                    required maxLength={PASSWORD_MAX}
                    value={form.password}
                    onChange={handlePasswordChange}
                    onBlur={handleBlur('password')}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'err-pw' : 'help-pw'}
                    placeholder="Minimal 8 karakter (huruf besar, kecil, angka)"
                    className={`w-full px-4 py-3 pr-11 rounded-xl border outline-none text-sm transition-all ${
                      errors.password
                        ? 'border-rose-400 focus:ring-2 focus:ring-rose-100'
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
                    }`}
                  />
                  <button
                    type="button"
                    aria-label={showPw ? 'Sembunyikan password' : 'Lihat password'}
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                {/* Indikator Kekuatan Password */}
                {form.password && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Kekuatan password:</span>
                      <span className="font-semibold text-xs">{pwStrength.label}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 h-1.5">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`rounded-full transition-all ${
                            pwStrength.score >= step ? pwStrength.color : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {errors.password ? (
                  <p id="err-pw" className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                    <AlertCircle size={13} className="shrink-0" /> {errors.password}
                  </p>
                ) : (
                  <p id="help-pw" className="text-[11px] text-slate-400 mt-1.5">
                    Kombinasi minimal 8 karakter dengan huruf besar (A-Z), huruf kecil (a-z), dan angka (0-9).
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-4 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" /> Mendaftarkan Akun...
                </>
              ) : (
                'Daftar Sekarang'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
