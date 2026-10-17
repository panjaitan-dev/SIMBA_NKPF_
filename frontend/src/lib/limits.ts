/**
 * SUMBER KEBENARAN TUNGGAL — Batas input seluruh field SIMBA Nusantara
 * Dipakai oleh: maxLength HTML, skema Zod frontend, skema Zod backend, CHECK constraint DB
 * JANGAN duplikasi nilai ini di tempat lain.
 */

// === REGISTER ===
export const NAMA_MIN = 3
export const NAMA_MAX = 100

export const EMAIL_MAX = 100

export const NIK_LENGTH = 16

export const PHONE_MIN = 10
export const PHONE_MAX = 13

export const ALAMAT_MAX = 255

export const PASSWORD_MIN = 8
export const PASSWORD_MAX = 64

// === LAPOR (Aduan Lingkungan) ===
export const LAPOR_JUDUL_MIN = 5
export const LAPOR_JUDUL_MAX = 100

export const LAPOR_DESKRIPSI_MIN = 20
export const LAPOR_DESKRIPSI_MAX = 1000

export const LAPOR_LOKASI_MIN = 5
export const LAPOR_LOKASI_MAX = 200

export const LAPOR_NAMA_MIN = 3
export const LAPOR_NAMA_MAX = 100

export const LAPOR_TIKET_LENGTH = 15

// === FOTO ===
export const FOTO_MAX_COUNT = 5
export const FOTO_MAX_SIZE_BYTES = 2 * 1024 * 1024 // 2 MB per file
export const FOTO_MAX_TOTAL_BYTES = 8 * 1024 * 1024 // 8 MB total
export const FOTO_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const FOTO_MAX_DIMENSION = 1600
export const FOTO_QUALITY = 0.8
