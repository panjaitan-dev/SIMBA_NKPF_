const { z } = require('zod');

// Daftar resmi 38 Kode Wilayah Provinsi Indonesia (Kemendagri / BPS)
const VALID_PROVINCE_CODES = [
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
];

/**
 * Sanitasi teks bebas: buang karakter kontrol & zero-width, trim, padatkan spasi ganda
 */
function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Cek validitas NIK 16 digit (kode provinsi & tanggal lahir)
 */
function isValidNik(nik) {
  if (!nik || typeof nik !== 'string') return false;
  const clean = nik.trim();
  if (!/^\d{16}$/.test(clean)) return false;

  // 1. Cek kode provinsi valid
  const prov = clean.slice(0, 2);
  if (!VALID_PROVINCE_CODES.includes(prov)) return false;

  // 2. Cek tanggal lahir (digit 7-12: DDMMYY)
  const dayStr = clean.slice(6, 8);
  const monthStr = clean.slice(8, 10);
  let day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);

  if (month < 1 || month > 12) return false;

  // Perempuan: tanggal lahir + 40 (41-71), Laki-laki: 01-31
  if (day >= 41 && day <= 71) {
    day -= 40;
  }
  if (day < 1 || day > 31) return false;

  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day > daysInMonth[month - 1]) return false;

  return true;
}

/**
 * Masking NIK: menampilkan 4 digit awal dan sisanya bintang (mis. 1204************)
 */
function maskNik(nik) {
  if (!nik || typeof nik !== 'string' || nik.length < 4) return nik;
  const clean = nik.trim();
  return clean.slice(0, 4) + '*'.repeat(Math.max(0, clean.length - 4));
}

/**
 * Normalisasi nomor HP Indonesia ke format 62xxxxxxxxxx
 */
function normalizePhone(phone) {
  if (!phone || typeof phone !== 'string') return '';
  let clean = phone.trim().replace(/[^\d+]/g, '');
  if (clean.startsWith('+62')) clean = '62' + clean.slice(3);
  else if (clean.startsWith('08')) clean = '628' + clean.slice(2);
  else if (clean.startsWith('8')) clean = '628' + clean.slice(1);
  return clean;
}

/**
 * Format nomor HP untuk tampilan UI (0812-3456-7890)
 */
function formatPhoneDisplay(phone) {
  if (!phone) return '';
  let norm = normalizePhone(phone);
  if (norm.startsWith('62')) norm = '0' + norm.slice(2);
  if (norm.length <= 4) return norm;
  if (norm.length <= 8) return `${norm.slice(0, 4)}-${norm.slice(4)}`;
  return `${norm.slice(0, 4)}-${norm.slice(4, 8)}-${norm.slice(8)}`;
}

/**
 * Parsing angka desimal format Indonesia (mendukung koma dan titik)
 */
function parseIndonesianDecimal(val) {
  if (typeof val === 'number') return val;
  if (typeof val !== 'string') return NaN;
  let str = val.trim();
  // Jika ada koma, ubah ke titik
  str = str.replace(',', '.');
  return parseFloat(str);
}

// ============================================================
// SKEMA ZOD FIELD REUSABLE
// ============================================================

// Nama Lengkap: wajib, trim, spasi ganda dipadatkan, 3-100 karakter, hanya huruf Unicode, spasi, apostrof, titik, tanda hubung. Tolak angka/simbol & repetisi >= 5x.
const namaLengkapSchema = z
  .string({ required_error: 'Nama lengkap wajib diisi' })
  .transform((v) => sanitizeText(v))
  .refine((v) => v.length >= 3, 'Nama lengkap minimal 3 karakter')
  .refine((v) => v.length <= 100, 'Nama lengkap maksimal 100 karakter')
  .refine(
    (v) => /^[\p{L}\s'.\-]+$/u.test(v),
    'Nama lengkap hanya boleh memuat huruf, spasi, apostrof, titik, dan tanda hubung'
  )
  .refine(
    (v) => !/(.)\1{4,}/.test(v),
    'Nama lengkap tidak boleh memuat karakter berulang 5 kali atau lebih berturut-turut'
  );

// Email: wajib, trim, lowercase, maks 254, format TLD ketat
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const emailSchema = z
  .string({ required_error: 'Email wajib diisi' })
  .transform((v) => sanitizeText(v).toLowerCase())
  .refine((v) => v.length > 0, 'Email wajib diisi')
  .refine((v) => v.length <= 254, 'Email maksimal 254 karakter')
  .refine((v) => emailRegex.test(v), 'Format email tidak valid')
  .refine((v) => {
    const parts = v.split('@');
    if (parts.length !== 2) return false;
    const domain = parts[1];
    const tld = domain.split('.').pop();
    return tld && tld.length >= 2 && /^[a-z]+$/.test(tld);
  }, 'Domain email harus memiliki TLD valid (contoh: .com, .id, .org)');

// NIK: opsional, tapi jika diisi tepat 16 digit, kode provinsi valid, tanggal lahir valid
const nikSchema = z
  .string()
  .optional()
  .or(z.literal(''))
  .transform((v) => (v ? v.trim() : ''))
  .refine(
    (v) => !v || isValidNik(v),
    'NIK harus tepat 16 digit angka dengan kode provinsi dan tanggal lahir yang valid'
  );

// Nomor HP: opsional saat register/profil tapi jika diisi wajib valid format Indonesia
const phoneRegex = /^(?:\+62|62|0)8[1-9][0-9]{7,10}$/;
const nomorHpSchema = z
  .string()
  .optional()
  .or(z.literal(''))
  .transform((v) => (v ? normalizePhone(v) : ''))
  .refine(
    (v) => !v || /^628[1-9][0-9]{7,10}$/.test(v),
    'Nomor HP harus berupa nomor seluler Indonesia yang valid (contoh: 081234567890)'
  );

// Password: min 8, ada huruf besar, huruf kecil, dan angka
const passwordSchema = z
  .string({ required_error: 'Password wajib diisi' })
  .min(8, 'Password minimal 8 karakter')
  .max(128, 'Password maksimal 128 karakter')
  .refine((v) => /[A-Z]/.test(v), 'Password harus memuat minimal 1 huruf besar (A-Z)')
  .refine((v) => /[a-z]/.test(v), 'Password harus memuat minimal 1 huruf kecil (a-z)')
  .refine((v) => /[0-9]/.test(v), 'Password harus memuat minimal 1 angka (0-9)');

// Alamat bebas: trim & sanitasi
const alamatSchema = z
  .string()
  .optional()
  .or(z.literal(''))
  .transform((v) => sanitizeText(v))
  .refine((v) => !v || v.length <= 500, 'Alamat maksimal 500 karakter');

// ============================================================
// SKEMA ENDPOINT UTAMA
// ============================================================

// 1. Register Nasabah
const registerSchema = z.object({
  nama_lengkap: namaLengkapSchema,
  email: emailSchema,
  password: passwordSchema,
  nik: nikSchema,
  nomor_hp: nomorHpSchema,
  alamat: alamatSchema,
  unit_id: z.string().optional().or(z.literal('')),
});

// 2. Login
const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password wajib diisi'),
});

// 3. Edit Profil
const updateProfileSchema = z.object({
  nama_lengkap: namaLengkapSchema,
  nomor_hp: nomorHpSchema,
  alamat: alamatSchema,
});

// 4. Setoran Sampah (Berat desimal > 0 dan wajar <= 10.000 kg per item)
const itemSetoranSchema = z.object({
  jenis_sampah_id: z.string().optional(),
  nama: z.string().optional(),
  kode: z.string().optional(),
  berat_kg: z
    .union([z.number(), z.string()])
    .transform((v) => parseIndonesianDecimal(v))
    .refine((v) => !isNaN(v) && v > 0, 'Berat sampah harus lebih besar dari 0 kg')
    .refine((v) => v <= 10000, 'Berat sampah per item maksimal 10.000 kg'),
  harga_satuan: z
    .union([z.number(), z.string()])
    .optional()
    .transform((v) => (v !== undefined ? parseIndonesianDecimal(v) : 0))
    .refine((v) => v >= 0, 'Harga satuan tidak boleh negatif'),
});

const createSetoranSchema = z.object({
  nasabah_id: z.string({ required_error: 'ID nasabah wajib diisi' }).min(1, 'ID nasabah wajib diisi'),
  items: z.array(itemSetoranSchema).min(1, 'Minimal sertakan 1 item sampah'),
  catatan: z.string().optional().transform((v) => sanitizeText(v)),
  tanggal_setoran: z.string().optional(),
  metode_pembayaran: z.string().optional(),
});

// 5. Penarikan Saldo (Min Rp 10.000, > 0)
const createPenarikanSchema = z.object({
  jumlah: z
    .union([z.number(), z.string()])
    .transform((v) => parseIndonesianDecimal(v))
    .refine((v) => !isNaN(v) && v > 0, 'Nominal penarikan harus lebih dari 0')
    .refine((v) => v >= 10000, 'Minimal penarikan saldo adalah Rp 10.000'),
  catatan: z.string().optional().transform((v) => sanitizeText(v)),
});

// 6. Jenis Sampah (Harga Beli & Harga Jual > 0)
const createJenisSampahSchema = z.object({
  nama: z
    .string({ required_error: 'Nama jenis sampah wajib diisi' })
    .transform((v) => sanitizeText(v))
    .refine((v) => v.length >= 2, 'Nama komoditas minimal 2 karakter')
    .refine((v) => v.length <= 100, 'Nama komoditas maksimal 100 karakter'),
  kode: z
    .string({ required_error: 'Kode jenis sampah wajib diisi' })
    .transform((v) => sanitizeText(v).toUpperCase())
    .refine((v) => v.length >= 2, 'Kode komoditas minimal 2 karakter')
    .refine((v) => v.length <= 20, 'Kode komoditas maksimal 20 karakter'),
  kategori: z.enum(['organik', 'anorganik', 'b3', 'logam', 'lainnya'], {
    errorMap: () => ({ message: 'Kategori harus salah satu dari: organik, anorganik, b3, logam, lainnya' }),
  }),
  satuan: z.string().default('kg').transform((v) => sanitizeText(v)),
  harga_beli: z
    .union([z.number(), z.string()])
    .transform((v) => parseIndonesianDecimal(v))
    .refine((v) => !isNaN(v) && v > 0, 'Harga beli harus lebih besar dari Rp 0'),
  harga_jual: z
    .union([z.number(), z.string()])
    .transform((v) => parseIndonesianDecimal(v))
    .refine((v) => !isNaN(v) && v > 0, 'Harga jual harus lebih besar dari Rp 0'),
  deskripsi: z.string().optional().transform((v) => sanitizeText(v)),
});

// 7. Klien Pembeli Industri (Offtaker)
const createKlienSchema = z.object({
  nama_client: z
    .string({ required_error: 'Nama klien wajib diisi' })
    .transform((v) => sanitizeText(v))
    .refine((v) => v.length >= 3, 'Nama klien minimal 3 karakter'),
  perusahaan: z.string().optional().transform((v) => sanitizeText(v)),
  komoditas: z.string().optional().transform((v) => sanitizeText(v)),
  alamat: z
    .string({ required_error: 'Alamat klien wajib diisi' })
    .transform((v) => sanitizeText(v))
    .refine((v) => v.length >= 5, 'Alamat klien minimal 5 karakter'),
  nomor_hp: z
    .string({ required_error: 'Nomor HP klien wajib diisi' })
    .transform((v) => normalizePhone(v))
    .refine((v) => /^628[1-9][0-9]{7,10}$/.test(v), 'Nomor telepon klien harus berupa nomor seluler Indonesia yang valid'),
  email: emailSchema.optional().or(z.literal('')),
});

// 8. Transaksi Penjualan ke Offtaker
const createPenjualanSchema = z.object({
  klien_id: z.string({ required_error: 'Klien pembeli wajib dipilih' }).min(1, 'Klien pembeli wajib dipilih'),
  nomor_faktur: z.string({ required_error: 'Nomor faktur wajib diisi' }).min(1, 'Nomor faktur wajib diisi'),
  tanggal_penjualan: z.string().optional(),
  nomor_truk: z.string().optional().transform((v) => (v ? sanitizeText(v).toUpperCase() : '')),
  status_pembayaran: z.string().optional(),
  catatan: z.string().optional().transform((v) => sanitizeText(v)),
  items: z
    .array(
      z.object({
        jenis_sampah_id: z.string().min(1, 'Jenis sampah wajib dipilih'),
        berat_kg: z
          .union([z.number(), z.string()])
          .transform((v) => parseIndonesianDecimal(v))
          .refine((v) => !isNaN(v) && v > 0, 'Berat penjualan harus lebih dari 0 kg'),
        harga_satuan_jual: z
          .union([z.number(), z.string()])
          .transform((v) => parseIndonesianDecimal(v))
          .refine((v) => !isNaN(v) && v > 0, 'Harga jual per kg harus lebih besar dari Rp 0'),
      })
    )
    .min(1, 'Minimal sertakan 1 item komoditas yang dijual'),
});

// 9. Laporan Masalah Lingkungan (Pengaduan Publik)
const createLaporanSchema = z.object({
  judul: z
    .string({ required_error: 'Judul laporan wajib diisi' })
    .transform((v) => sanitizeText(v))
    .refine((v) => v.length >= 3, 'Judul aduan minimal 3 karakter')
    .refine((v) => v.length <= 150, 'Judul aduan maksimal 150 karakter'),
  deskripsi: z
    .string({ required_error: 'Deskripsi laporan wajib diisi' })
    .transform((v) => sanitizeText(v))
    .refine((v) => v.length >= 10, 'Deskripsi aduan minimal 10 karakter')
    .refine((v) => v.length <= 2000, 'Deskripsi aduan maksimal 2.000 karakter'),
  lokasi: z
    .string({ required_error: 'Lokasi kejadian wajib diisi' })
    .transform((v) => sanitizeText(v))
    .refine((v) => v.length >= 3, 'Lokasi kejadian minimal 3 karakter'),
  nama_pelapor: z.string().optional().transform((v) => sanitizeText(v)),
  nomor_hp: nomorHpSchema,
});

// 10. CMS Berita & Artikel
const createBeritaSchema = z.object({
  judul: z
    .string({ required_error: 'Judul berita wajib diisi' })
    .transform((v) => sanitizeText(v))
    .refine((v) => v.length >= 5, 'Judul berita minimal 5 karakter')
    .refine((v) => v.length <= 200, 'Judul berita maksimal 200 karakter'),
  ringkasan: z
    .string()
    .optional()
    .transform((v) => sanitizeText(v)),
  konten: z
    .string({ required_error: 'Konten berita wajib diisi' })
    .transform((v) => sanitizeText(v))
    .refine((v) => v.length >= 20, 'Konten berita minimal 20 karakter'),
  kategori: z.string().optional().default('umum'),
  thumbnail_url: z.string().url('URL thumbnail harus valid').optional().or(z.literal('')),
});

// 11. CMS Modul Edukasi 3R
const createEdukasiSchema = z.object({
  judul: z
    .string({ required_error: 'Judul materi edukasi wajib diisi' })
    .transform((v) => sanitizeText(v))
    .refine((v) => v.length >= 5, 'Judul materi minimal 5 karakter')
    .refine((v) => v.length <= 200, 'Judul materi maksimal 200 karakter'),
  ringkasan: z
    .string()
    .optional()
    .transform((v) => sanitizeText(v)),
  konten: z
    .string({ required_error: 'Konten edukasi wajib diisi' })
    .transform((v) => sanitizeText(v))
    .refine((v) => v.length >= 20, 'Konten edukasi minimal 20 karakter'),
  kategori: z.string().optional().default('3r'),
  thumbnail_url: z.string().url('URL thumbnail harus valid').optional().or(z.literal('')),
});

// 12. CMS Galeri Kegiatan
const createGaleriSchema = z.object({
  judul: z
    .string({ required_error: 'Judul galeri wajib diisi' })
    .transform((v) => sanitizeText(v))
    .refine((v) => v.length >= 3, 'Judul galeri minimal 3 karakter')
    .refine((v) => v.length <= 150, 'Judul galeri maksimal 150 karakter'),
  deskripsi: z
    .string()
    .optional()
    .transform((v) => sanitizeText(v)),
  lokasi: z
    .string()
    .optional()
    .transform((v) => sanitizeText(v)),
  tanggal_kegiatan: z.string().optional(),
});

module.exports = {
  VALID_PROVINCE_CODES,
  sanitizeText,
  isValidNik,
  maskNik,
  normalizePhone,
  formatPhoneDisplay,
  parseIndonesianDecimal,
  // Zod Schemas
  namaLengkapSchema,
  emailSchema,
  nikSchema,
  nomorHpSchema,
  passwordSchema,
  alamatSchema,
  registerSchema,
  loginSchema,
  updateProfileSchema,
  createSetoranSchema,
  createPenarikanSchema,
  createJenisSampahSchema,
  createKlienSchema,
  createPenjualanSchema,
  createLaporanSchema,
  createBeritaSchema,
  createEdukasiSchema,
  createGaleriSchema,
};
