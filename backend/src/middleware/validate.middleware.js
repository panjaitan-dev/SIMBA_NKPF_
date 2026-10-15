const { z } = require('zod');

/**
 * Middleware untuk validasi request payload menggunakan Zod Schema
 * @param {z.ZodSchema} schema 
 */
const validate = (schema) => (req, res, next) => {
  try {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.slice(1).join('.') || err.path[0] || 'input',
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        message: errors[0]?.message || 'Validasi input gagal',
        errors,
      });
    }

    if (result.data.body) req.body = result.data.body;
    if (result.data.query) req.query = result.data.query;
    if (result.data.params) req.params = result.data.params;
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan validasi sistem' });
  }
};

// ============================================================
// SKEMA VALIDASI UTAMA
// ============================================================

const createSetoranSchema = z.object({
  body: z.object({
    nasabah_id: z.string({ required_error: 'ID nasabah wajib diisi' }).min(1, 'ID nasabah wajib diisi'),
    items: z.array(z.object({
      jenis_sampah_id: z.string().optional(),
      berat_kg: z.number().positive('Berat harus lebih dari 0').or(z.string().regex(/^\d+(\.\d+)?$/, 'Berat tidak valid')),
      harga_satuan: z.number().nonnegative('Harga tidak boleh negatif').optional().or(z.string().optional()),
    })).min(1, 'Minimal sertakan 1 item sampah'),
    catatan: z.string().optional(),
    tanggal_setoran: z.string().optional(),
  }),
});

const createPenarikanSchema = z.object({
  body: z.object({
    jumlah: z.number({ required_error: 'Jumlah penarikan wajib diisi' })
      .positive('Jumlah penarikan harus lebih dari 0')
      .or(z.string().transform(v => parseFloat(v)).refine(v => v > 0, 'Jumlah penarikan harus lebih dari 0')),
    catatan: z.string().optional(),
  }),
});

const createJenisSampahSchema = z.object({
  body: z.object({
    nama: z.string().min(2, 'Nama komoditas minimal 2 karakter'),
    kode: z.string().min(2, 'Kode komoditas minimal 2 karakter'),
    kategori: z.enum(['organik', 'anorganik', 'b3', 'logam', 'lainnya'], {
      errorMap: () => ({ message: 'Kategori harus salah satu dari: organik, anorganik, b3, logam, lainnya' }),
    }),
    satuan: z.string().default('kg'),
    harga_beli: z.number().nonnegative().optional().or(z.string().optional()),
    harga_jual: z.number().nonnegative().optional().or(z.string().optional()),
    deskripsi: z.string().optional(),
  }),
});

const createPenjualanSchema = z.object({
  body: z.object({
    klien_id: z.string().min(1, 'Klien pembeli wajib dipilih'),
    nomor_faktur: z.string().min(1, 'Nomor faktur wajib diisi'),
    total_berat_kg: z.number().nonnegative().optional(),
    total_nominal: z.number().nonnegative().optional(),
    status_pembayaran: z.string().optional(),
    items: z.array(z.any()).optional(),
  }),
});

const createLaporanSchema = z.object({
  body: z.object({
    judul: z.string().min(3, 'Judul aduan minimal 3 karakter'),
    deskripsi: z.string().min(5, 'Deskripsi aduan minimal 5 karakter'),
    lokasi: z.string().min(3, 'Lokasi kejadian wajib diisi'),
    nama_pelapor: z.string().optional(),
    nomor_hp: z.string().optional(),
  }),
});

module.exports = {
  validate,
  z,
  createSetoranSchema,
  createPenarikanSchema,
  createJenisSampahSchema,
  createPenjualanSchema,
  createLaporanSchema,
};
