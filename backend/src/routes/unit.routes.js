const router = require('express').Router();
const supabase = require('../lib/supabase');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

// GET /api/unit — publik (Hanya unit non-demo dan terverifikasi sesuai R4)
router.get('/', async (req, res) => {
  try {
    let query = supabase
      .from('unit_bank_sampah')
      .select('*')
      .eq('is_active', true)
      .eq('is_demo', false)
      .eq('status_verifikasi', 'terverifikasi')
      .order('nama');

    const { data, error } = await query;
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil unit bank sampah' });
  }
});

// POST /api/unit (admin)
router.post('/', authMiddleware, requireRole('admin'), async (req, res) => {
  const { nama, kode, alamat, koordinator, nomor_hp } = req.body;
  if (!nama || !kode) return res.status(400).json({ success: false, message: 'Nama dan kode wajib diisi' });
  try {
    const { data, error } = await supabase.from('unit_bank_sampah').insert({ nama, kode, alamat, koordinator, nomor_hp }).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.status(201).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal membuat unit' });
  }
});

// PUT /api/unit/:id (admin)
router.put('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  const { nama, alamat, koordinator, nomor_hp, is_active } = req.body;
  try {
    const { error } = await supabase.from('unit_bank_sampah').update({ nama, alamat, koordinator, nomor_hp, is_active }).eq('id', req.params.id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Unit diperbarui' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal memperbarui unit' });
  }
});

module.exports = router;
