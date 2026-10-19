import { z } from 'zod'
import {
  NAMA_MIN, NAMA_MAX, EMAIL_MAX, PASSWORD_MIN, PASSWORD_MAX,
  ALAMAT_MAX, PHONE_MIN, PHONE_MAX,
  LAPOR_JUDUL_MIN, LAPOR_JUDUL_MAX, LAPOR_DESKRIPSI_MIN, LAPOR_DESKRIPSI_MAX,
  LAPOR_LOKASI_MIN, LAPOR_LOKASI_MAX, LAPOR_NAMA_MIN, LAPOR_NAMA_MAX,
  LAPOR_TIKET_LENGTH,
} from './limits'

// Daftar 38 Kode Wilayah BPS Provinsi Indonesia
export const VALID_PROVINCE_CODES = [
  // Sumatera (10)
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '21',
  // Jawa (6)
  '31', '32', '33', '34', '35', '36',
  // Bali & Nusa Tenggara (3)
  '51', '52', '53',
  // Kalimantan (5)
  '61', '62', '63', '64', '65',
  // Sulawesi (6)
  '71', '72', '73', '74', '75', '76',
  // Maluku & Papua (8)
  '81', '82', '91', '92', '93', '94', '95', '96'
]

/**
 * Sanitasi teks bebas: buang karakter kontrol & zero-width, trim, padatkan spasi ganda
 */
export function sanitizeText(str: string): string {
  if (typeof str !== 'string') return ''
  return str
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
}

/**
 * Cek validitas NIK 16 digit (kode provinsi & tanggal lahir)
 */
export function isValidNik(nik: string): boolean {
  if (!nik || typeof nik !== 'string') return false
  const clean = nik.trim()
  if (!/^\d{16}$/.test(clean)) return false

  // 1. Cek kode provinsi valid
  const prov = clean.slice(0, 2)
  if (!VALID_PROVINCE_CODES.includes(prov)) return false

  // 2. Cek tanggal lahir (digit 7-12: DDMMYY)
  const dayStr = clean.slice(6, 8)
  const monthStr = clean.slice(8, 10)
  let day = parseInt(dayStr, 10)
  const month = parseInt(monthStr, 10)

  if (month < 1 || month > 12) return false

  // Perempuan: tanggal lahir + 40 (41-71), Laki-laki: 01-31
  if (day >= 41 && day <= 71) {
    day -= 40
  }
  if (day < 1 || day > 31) return false

  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (day > daysInMonth[month - 1]) return false

  return true
}

/**
 * Masking NIK: menampilkan 4 digit awal dan sisanya bintang (mis. 1204************)
 */
export function maskNik(nik: string): string {
  if (!nik || typeof nik !== 'string' || nik.length < 4) return nik
  const clean = nik.trim()
  return clean.slice(0, 4) + '*'.repeat(Math.max(0, clean.length - 4))
}

/**
 * Normalisasi nomor HP Indonesia ke format 62xxxxxxxxxx
 */
export function normalizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return ''
  let clean = phone.trim().replace(/[^\d+]/g, '')
  if (clean.startsWith('+62')) clean = '62' + clean.slice(3)
  else if (clean.startsWith('08')) clean = '628' + clean.slice(2)
  else if (clean.startsWith('8')) clean = '628' + clean.slice(1)
  return clean
}

/**
 * Format nomor HP untuk tampilan UI (0812-3456-7890)
 */
export function formatPhoneDisplay(phone: string): string {
  if (!phone) return ''
  let norm = normalizePhone(phone)
  if (norm.startsWith('62')) norm = '0' + norm.slice(2)
  if (norm.length <= 4) return norm
  if (norm.length <= 8) return `${norm.slice(0, 4)}-${norm.slice(4)}`
  return `${norm.slice(0, 4)}-${norm.slice(4, 8)}-${norm.slice(8)}`
}

/** Strip non-digit, convert +62/62 → 0, hard stop at 13 digits */
export function cleanPhoneInput(raw: string): string {
  let clean = raw.replace(/\D/g, '')
  if (clean.startsWith('62') && clean.length > 2) clean = '0' + clean.slice(2)
  return clean.slice(0, 13)
}

/**
 * Parsing angka desimal format Indonesia (mendukung koma dan titik)
 */
export function parseIndonesianDecimal(val: string | number): number {
  if (typeof val === 'number') return val
  if (typeof val !== 'string') return NaN
  let str = val.trim()
  str = str.replace(',', '.')
  return parseFloat(str)
}

/**
 * Evaluasi kekuatan password (0 - 4)
 */
export function calculatePasswordStrength(password: string): {
  score: number
  label: 'Sangat Lemah' | 'Lemah' | 'Sedang' | 'Kuat'
  color: string
} {
  if (!password) return { score: 0, label: 'Sangat Lemah', color: 'bg-slate-200 text-slate-500' }
  
  let score = 0
  
  // Panjang
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 0.5
  
  // Variasi karakter
  if (/[A-Z]/.test(password)) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 0.5
  
  // PENALTI: karakter berulang 3+ kali berturut (misal "jjjj", "1111")
  const repeats = password.match(/(.)\1{2,}/g)
  if (repeats) {
    score -= repeats.length * 1.5
  }
  
  // PENALTI: urutan keyboard/alfabet 3+ karakter (misal "abc", "123", "qwerty")
  const sequences = ['abcdefghijklmnopqrstuvwxyz', '0123456789', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm']
  const lower = password.toLowerCase()
  for (const seq of sequences) {
    for (let i = 0; i <= lower.length - 3; i++) {
      const chunk = lower.slice(i, i + 3)
      if (seq.includes(chunk)) {
        score -= 1
        break
      }
    }
  }
  
  // Jumlah karakter unik
  const uniqueChars = new Set(password).size
  if (uniqueChars <= 3) score -= 1
  
  // Clamp ke 1-4
  const finalScore = Math.max(1, Math.min(4, Math.round(score)))
  
  if (finalScore <= 1) return { score: 1, label: 'Sangat Lemah', color: 'bg-rose-500 text-rose-700' }
  if (finalScore === 2) return { score: 2, label: 'Lemah', color: 'bg-amber-500 text-amber-700' }
  if (finalScore === 3) return { score: 3, label: 'Sedang', color: 'bg-blue-500 text-blue-700' }
  return { score: 4, label: 'Kuat', color: 'bg-emerald-500 text-emerald-700' }
}

// ============================================================
// SKEMA ZOD FRONTEND (MIRROR DARI BACKEND)
// ============================================================

export const namaLengkapSchema = z
  .string()
  .transform((v) => sanitizeText(v))
  .refine((v) => v.length >= NAMA_MIN, `Nama lengkap minimal ${NAMA_MIN} karakter`)
  .refine((v) => v.length <= NAMA_MAX, `Nama lengkap maksimal ${NAMA_MAX} karakter`)
  .refine(
    (v) => /^[\p{L}\s'.\-]+$/u.test(v),
    'Nama lengkap hanya boleh memuat huruf, spasi, apostrof, titik, dan tanda hubung'
  )
  .refine(
    (v) => !/(.)\1{4,}/.test(v),
    'Nama lengkap tidak boleh memuat karakter berulang 5 kali berturut-turut'
  )

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
export const emailSchema = z
  .string()
  .transform((v) => sanitizeText(v).toLowerCase())
  .refine((v) => v.length > 0, 'Email wajib diisi')
  .refine((v) => v.length <= EMAIL_MAX, `Email maksimal ${EMAIL_MAX} karakter`)
  .refine((v) => emailRegex.test(v), 'Format email tidak valid')
  .refine((v) => {
    const parts = v.split('@')
    if (parts.length !== 2) return false
    const domain = parts[1]
    const tld = domain.split('.').pop()
    return Boolean(tld && tld.length >= 2 && /^[a-z]+$/.test(tld))
  }, 'Domain email harus memiliki TLD valid (contoh: .com, .id, .org)')

export const nikSchema = z
  .string()
  .optional()
  .or(z.literal(''))
  .transform((v) => (v ? v.trim() : ''))
  .refine(
    (v) => !v || isValidNik(v),
    'NIK harus tepat 16 digit angka dengan kode provinsi dan tanggal lahir yang valid'
  )

export const nomorHpSchema = z
  .string()
  .optional()
  .or(z.literal(''))
  .transform((v) => (v ? normalizePhone(v) : ''))
  .refine(
    (v) => !v || /^628[1-9][0-9]{7,10}$/.test(v),
    'Nomor HP harus berupa nomor seluler Indonesia yang valid (contoh: 081234567890)'
  )

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN, 'Password minimal 8 karakter')
  .max(PASSWORD_MAX, 'Password maksimal 64 karakter')
  .refine((v) => /[A-Z]/.test(v), 'Password harus memuat minimal 1 huruf besar (A-Z)')
  .refine((v) => /[a-z]/.test(v), 'Password harus memuat minimal 1 huruf kecil (a-z)')
  .refine((v) => /[0-9]/.test(v), 'Password harus memuat minimal 1 angka (0-9)')

export const alamatSchema = z
  .string()
  .optional()
  .or(z.literal(''))
  .transform((v) => sanitizeText(v || ''))
  .refine((v) => !v || v.length <= ALAMAT_MAX, `Alamat maksimal ${ALAMAT_MAX} karakter`)

export const registerSchema = z.object({
  nama_lengkap: namaLengkapSchema,
  email: emailSchema,
  password: passwordSchema,
  nik: nikSchema,
  nomor_hp: nomorHpSchema,
  alamat: alamatSchema,
  unit_id: z.string().optional().or(z.literal('')),
})

export const laporJudulSchema = z
  .string()
  .transform((v) => sanitizeText(v))
  .refine((v) => v.length >= LAPOR_JUDUL_MIN, `Judul laporan minimal ${LAPOR_JUDUL_MIN} karakter`)
  .refine((v) => v.length <= LAPOR_JUDUL_MAX, `Judul laporan maksimal ${LAPOR_JUDUL_MAX} karakter`)

export const laporDeskripsiSchema = z
  .string()
  .transform((v) => sanitizeText(v))
  .refine((v) => v.length >= LAPOR_DESKRIPSI_MIN, `Deskripsi minimal ${LAPOR_DESKRIPSI_MIN} karakter`)
  .refine((v) => v.length <= LAPOR_DESKRIPSI_MAX, `Deskripsi maksimal ${LAPOR_DESKRIPSI_MAX} karakter`)

export const laporLokasiSchema = z
  .string()
  .transform((v) => sanitizeText(v))
  .refine((v) => v.length >= LAPOR_LOKASI_MIN, `Lokasi minimal ${LAPOR_LOKASI_MIN} karakter`)
  .refine((v) => v.length <= LAPOR_LOKASI_MAX, `Lokasi maksimal ${LAPOR_LOKASI_MAX} karakter`)

export const laporNamaSchema = z
  .string()
  .optional()
  .or(z.literal(''))
  .transform((v) => sanitizeText(v || ''))
  .refine((v) => !v || v.length >= LAPOR_NAMA_MIN, `Nama pelapor minimal ${LAPOR_NAMA_MIN} karakter`)
  .refine((v) => !v || v.length <= LAPOR_NAMA_MAX, `Nama pelapor maksimal ${LAPOR_NAMA_MAX} karakter`)
  .refine(
    (v) => !v || /^[\p{L}\s'.\-]+$/u.test(v),
    'Nama pelapor hanya boleh memuat huruf, spasi, apostrof, titik, dan tanda hubung'
  )

export const laporSchema = z.object({
  judul: laporJudulSchema,
  deskripsi: laporDeskripsiSchema,
  lokasi: laporLokasiSchema,
  nama_pelapor: laporNamaSchema,
  nomor_hp: nomorHpSchema,
})

