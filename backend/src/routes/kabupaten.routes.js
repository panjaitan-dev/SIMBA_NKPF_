const router = require('express').Router();
const supabase = require('../lib/supabase');
const { withTimeout } = require('../lib/db-helper');
const { KABUPATEN_KOTA_SUMUT, UNIT_SUMUT_VERIFIKASI } = require('../lib/sumut-data');

/**
 * GET /api/kabupaten-kota — Daftar 33 Kabupaten/Kota di Sumatera Utara (Pilot)
 * Disertai jumlah unit bank sampah terverifikasi
 */
router.get('/', async (req, res) => {
  try {
    let list = [...KABUPATEN_KOTA_SUMUT];

    // Hitung unit terverifikasi per kab/kota
    const counts = {};
    UNIT_SUMUT_VERIFIKASI.forEach((u) => {
      counts[u.kabupaten_kota_kode] = (counts[u.kabupaten_kota_kode] || 0) + 1;
    });

    try {
      const { data, error } = await withTimeout(
        supabase
          .from('unit_bank_sampah')
          .select('kabupaten_kota_id, kabupaten_kota:kabupaten_kota_id(kode)')
          .eq('is_active', true)
          .eq('is_demo', false)
          .eq('status_verifikasi', 'terverifikasi')
      );

      if (!error && Array.isArray(data) && data.length > 0) {
        // Reset and recount from DB
        Object.keys(counts).forEach((k) => delete counts[k]);
        data.forEach((row) => {
          const kode = row.kabupaten_kota?.kode;
          if (kode) {
            counts[kode] = (counts[kode] || 0) + 1;
          }
        });
      }
    } catch {}

    const result = list.map((k) => ({
      ...k,
      jumlah_unit_terverifikasi: counts[k.kode] || 0,
    }));

    return res.json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil data kabupaten/kota' });
  }
});

module.exports = router;
