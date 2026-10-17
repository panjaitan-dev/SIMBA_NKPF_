/**
 * SUMBER KEBENARAN TUNGGAL — Batas input seluruh field SIMBA Nusantara
 * Mirror dari frontend/src/lib/limits.ts
 * Dipakai oleh: skema Zod backend, multer config, CHECK constraint DB
 */

module.exports = {
  // Register
  NAMA_MIN: 3,
  NAMA_MAX: 100,
  EMAIL_MAX: 100,
  NIK_LENGTH: 16,
  PHONE_MIN: 10,
  PHONE_MAX: 13,
  ALAMAT_MAX: 255,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 64,

  // Lapor (Aduan Lingkungan)
  LAPOR_JUDUL_MIN: 5,
  LAPOR_JUDUL_MAX: 100,
  LAPOR_DESKRIPSI_MIN: 20,
  LAPOR_DESKRIPSI_MAX: 1000,
  LAPOR_LOKASI_MIN: 5,
  LAPOR_LOKASI_MAX: 200,
  LAPOR_NAMA_MIN: 3,
  LAPOR_NAMA_MAX: 100,
  LAPOR_TIKET_LENGTH: 15,

  // Foto
  FOTO_MAX_COUNT: 5,
  FOTO_MAX_SIZE_BYTES: 2 * 1024 * 1024,
  FOTO_MAX_TOTAL_BYTES: 8 * 1024 * 1024,
  FOTO_ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
}
