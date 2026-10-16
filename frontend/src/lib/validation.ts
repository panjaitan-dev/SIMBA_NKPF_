import { z } from 'zod'

// Daftar resmi 38 Kode Wilayah Provinsi Indonesia (Kemendagri / BPS)
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
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { score: 1, label: 'Sangat Lemah', color: 'bg-rose-500 text-rose-700' }
  if (score === 2) return { score: 2, label: 'Lemah', color: 'bg-amber-500 text-amber-700' }
  if (score === 3) return { score: 3, label: 'Sedang', color: 'bg-blue-500 text-blue-700' }
  return { score: 4, label: 'Kuat', color: 'bg-emerald-500 text-emerald-700' }
}

// ============================================================
// SKEMA ZOD FRONTEND (MIRROR DARI BACKEND)
// ============================================================

export const namaLengkapSchema = z
  .string()
  .transform((v) => sanitizeText(v))
  .refine((v) => v.length >= 3, 'Nama lengkap minimal 3 karakter')
  .refine((v) => v.length <= 100, 'Nama lengkap maksimal 100 karakter')
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
  .refine((v) => v.length <= 254, 'Email maksimal 254 karakter')
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
  .min(8, 'Password minimal 8 karakter')
  .max(128, 'Password maksimal 128 karakter')
  .refine((v) => /[A-Z]/.test(v), 'Password harus memuat minimal 1 huruf besar (A-Z)')
  .refine((v) => /[a-z]/.test(v), 'Password harus memuat minimal 1 huruf kecil (a-z)')
  .refine((v) => /[0-9]/.test(v), 'Password harus memuat minimal 1 angka (0-9)')

export const alamatSchema = z
  .string()
  .optional()
  .or(z.literal(''))
  .transform((v) => sanitizeText(v || ''))
  .refine((v) => !v || v.length <= 500, 'Alamat maksimal 500 karakter')

export const registerSchema = z.object({
  nama_lengkap: namaLengkapSchema,
  email: emailSchema,
  password: passwordSchema,
  nik: nikSchema,
  nomor_hp: nomorHpSchema,
  alamat: alamatSchema,
  unit_id: z.string().optional().or(z.literal('')),
})
