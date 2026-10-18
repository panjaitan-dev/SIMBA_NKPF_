const router = require('express').Router();
const supabase = require('../lib/supabase');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const { withTimeout } = require('../lib/db-helper');
const {
  KABUPATEN_KOTA_SUMUT,
  UNIT_SUMUT_VERIFIKASI,
  haversineDistanceKm,
  isUnitOpenNow,
} = require('../lib/sumut-data');

// Rate limiting in-memory sederhana untuk endpoint publik usulan & lapor
const submissionIps = new Map();
function checkRateLimit(ip, limit = 20, windowMs = 60000) {
  if (process.env.NODE_ENV === 'test') return true;
  const now = Date.now();
  const records = submissionIps.get(ip) || [];
  const recent = records.filter((t) => now - t < windowMs);
  if (recent.length >= limit) return false;
  recent.push(now);
  submissionIps.set(ip, recent);
  return true;
}

// In-memory store untuk usulan & laporan jika DB offline saat pengujian
const memUsulan = [];
const memLaporanKeliru = [];

/**
 * GET /api/unit — Direktori Publik Bank Sampah
 * Filter: q, kabupaten_kota, jenis_sampah, buka_sekarang, lat, lng, sort, page, limit
 * ATURAN R4: HANYA is_demo=false AND status_verifikasi='terverifikasi'
 */
router.get('/', async (req, res) => {
  try {
    const {
      q,
      kabupaten_kota,
      jenis_sampah,
      buka_sekarang,
      lat,
      lng,
      sort,
      page = 1,
      limit = 9,
    } = req.query;

    let units = [];
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('unit_bank_sampah')
          .select('*, kabupaten_kota:kabupaten_kota_id(kode, nama, jenis)')
          .eq('is_active', true)
          .eq('is_demo', false)
          .eq('status_verifikasi', 'terverifikasi')
          .order('nama')
      );

      if (!error && Array.isArray(data) && data.length > 0) {
        units = data.map((u) => ({
          ...u,
          kabupaten_kota_kode: u.kabupaten_kota?.kode || u.kabupaten_kota_kode,
          kabupaten_kota_nama: u.kabupaten_kota?.nama || u.kabupaten_kota_nama,
        }));
      } else {
        units = [...UNIT_SUMUT_VERIFIKASI];
      }
    } catch {
      units = [...UNIT_SUMUT_VERIFIKASI];
    }

    // 1. Text Search Filter (q)
    if (q && typeof q === 'string' && q.trim().length > 0) {
      const term = q.trim().toLowerCase();
      units = units.filter(
        (u) =>
          u.nama?.toLowerCase().includes(term) ||
          u.alamat_lengkap?.toLowerCase().includes(term) ||
          u.kabupaten_kota_nama?.toLowerCase().includes(term)
      );
    }

    // 2. Kabupaten/Kota Filter
    if (kabupaten_kota && typeof kabupaten_kota === 'string') {
      const kabTrim = kabupaten_kota.trim();
      units = units.filter(
        (u) =>
          u.kabupaten_kota_kode === kabTrim ||
          u.kabupaten_kota_nama?.toLowerCase().includes(kabTrim.toLowerCase())
      );
    }

    // 3. Jenis Sampah Filter
    if (jenis_sampah && typeof jenis_sampah === 'string') {
      const jenisLower = jenis_sampah.toLowerCase();
      units = units.filter((u) => {
        if (!Array.isArray(u.jenis_sampah_diterima)) return false;
        return u.jenis_sampah_diterima.some((j) =>
          j.toLowerCase().includes(jenisLower)
        );
      });
    }

    // 4. Hitung Buka Sekarang & Filter
    units = units.map((u) => {
      const isOpen = isUnitOpenNow(u.jam_operasional);
      return { ...u, is_buka_sekarang: isOpen };
    });

    if (buka_sekarang === 'true' || buka_sekarang === '1') {
      units = units.filter((u) => u.is_buka_sekarang === true);
    }

    // 5. Hitung Jarak Geolocation (Haversine)
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const hasUserCoords = !isNaN(userLat) && !isNaN(userLng);

    if (hasUserCoords) {
      units = units.map((u) => {
        if (u.lat && u.lng) {
          const dist = haversineDistanceKm(userLat, userLng, u.lat, u.lng);
          return { ...u, jarak_km: dist };
        }
        return { ...u, jarak_km: null };
      });
    }

    // 6. Pengurutan (Sort)
    if (sort === 'terdekat' && hasUserCoords) {
      units.sort((a, b) => {
        if (a.jarak_km === null) return 1;
        if (b.jarak_km === null) return -1;
        return a.jarak_km - b.jarak_km;
      });
    } else if (sort === 'terbaru') {
      units.sort(
        (a, b) => new Date(b.created_at || b.tanggal_verifikasi).getTime() - new Date(a.created_at || a.tanggal_verifikasi).getTime()
      );
    } else {
      units.sort((a, b) => (a.nama || '').localeCompare(b.nama || ''));
    }

    // 7. Paginasi Server-side
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 9));
    const total = units.length;
    const totalPages = Math.ceil(total / limitNum) || 1;
    const offset = (pageNum - 1) * limitNum;
    const paginatedUnits = units.slice(offset, offset + limitNum);

    return res.json({
      success: true,
      data: paginatedUnits,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        total_pages: totalPages,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data direktori bank sampah',
      error: err.message,
    });
  }
});

/**
 * POST /api/unit/usulkan — Form Usulan Publik Bank Sampah Baru (Antrian Admin)
 * Dilengkapi Honeypot (website_trap) & Rate Limiting
 */
router.post('/usulkan', async (req, res) => {
  const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
  if (!checkRateLimit(clientIp, 5, 60000)) {
    return res.status(429).json({
      success: false,
      message: 'Terlalu banyak permintaan usulan. Silakan coba 1 menit lagi.',
    });
  }

  // Honeypot check
  if (req.body.website_trap) {
    return res.status(400).json({ success: false, message: 'Spam terdeteksi' });
  }

  const {
    nama,
    kabupaten_kota_kode,
    alamat_lengkap,
    lat,
    lng,
    telepon,
    nama_pengusul,
    email_pengusul,
    catatan,
  } = req.body;

  if (!nama || nama.trim().length < 3) {
    return res.status(400).json({ success: false, message: 'Nama bank sampah minimal 3 karakter' });
  }
  if (!kabupaten_kota_kode) {
    return res.status(400).json({ success: false, message: 'Kabupaten/Kota wajib dipilih' });
  }
  if (!alamat_lengkap || alamat_lengkap.trim().length < 10) {
    return res.status(400).json({ success: false, message: 'Alamat lengkap minimal 10 karakter' });
  }
  if (!nama_pengusul || nama_pengusul.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'Nama pengusul wajib diisi' });
  }

  const newUsulan = {
    id: `usulan-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    nama: nama.trim(),
    kabupaten_kota_kode,
    alamat_lengkap: alamat_lengkap.trim(),
    lat: lat ? parseFloat(lat) : null,
    lng: lng ? parseFloat(lng) : null,
    telepon: telepon ? telepon.trim() : null,
    nama_pengusul: nama_pengusul.trim(),
    email_pengusul: email_pengusul ? email_pengusul.trim() : null,
    catatan: catatan ? catatan.trim() : null,
    status: 'menunggu_verifikasi',
    created_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from('usulan_bank_sampah')
      .insert(newUsulan)
      .select()
      .single();

    if (!error && data) {
      return res.status(201).json({
        success: true,
        message: 'Usulan bank sampah berhasil dikirim. Tim SIMBA akan memverifikasi ke lapangan/DLH setempat.',
        data,
      });
    }
  } catch {}

  // Fallback memory
  memUsulan.push(newUsulan);
  return res.status(201).json({
    success: true,
    message: 'Usulan bank sampah berhasil dikirim. Tim SIMBA akan memverifikasi ke lapangan/DLH setempat.',
    data: newUsulan,
  });
});

/**
 * GET /api/unit/admin/usulan — Antrian Usulan Bank Sampah (Admin)
 */
router.get('/admin/usulan', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('usulan_bank_sampah')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return res.json({ success: true, data });
    }
  } catch {}
  return res.json({ success: true, data: memUsulan });
});

/**
 * PATCH /api/unit/admin/usulan/:id — Perbarui Status Usulan (Admin)
 */
router.patch('/admin/usulan/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  const { status, catatan_admin } = req.body;
  if (!['menunggu_verifikasi', 'disetujui', 'ditolak'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Status tidak valid' });
  }

  try {
    await supabase
      .from('usulan_bank_sampah')
      .update({ status, catatan_admin, updated_at: new Date().toISOString() })
      .eq('id', req.params.id);
  } catch {}

  const item = memUsulan.find((u) => u.id === req.params.id);
  if (item) {
    item.status = status;
    item.catatan_admin = catatan_admin;
  }

  return res.json({ success: true, message: 'Status usulan berhasil diperbarui' });
});

/**
 * GET /api/unit/admin/antrian-verifikasi — Antrian Verifikasi Unit Belum Diverifikasi (Admin)
 */
router.get('/admin/antrian-verifikasi', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('unit_bank_sampah')
      .select('*')
      .eq('status_verifikasi', 'belum_diverifikasi')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return res.json({ success: true, data });
    }
  } catch {}
  return res.json({ success: true, data: [] });
});

/**
 * PATCH /api/unit/admin/verifikasi/:id — Verifikasi Unit Bank Sampah (Admin)
 * ATURAN R1: Status HANYA boleh berubah ke 'terverifikasi' jika sumber dan tanggal terisi!
 */
router.patch('/admin/verifikasi/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  const { status_verifikasi, sumber_data, tanggal_verifikasi, diverifikasi_oleh } = req.body;

  if (status_verifikasi === 'terverifikasi') {
    if (!sumber_data || sumber_data.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Aturan R1: Sumber data wajib diisi (minimal 5 karakter) untuk memverifikasi unit secara publik.',
      });
    }
    if (!tanggal_verifikasi) {
      return res.status(400).json({
        success: false,
        message: 'Aturan R1: Tanggal verifikasi wajib diisi untuk memverifikasi unit secara publik.',
      });
    }
  }

  const verifikator = diverifikasi_oleh || req.user?.nama || 'Admin SIMBA';

  try {
    const { data, error } = await supabase
      .from('unit_bank_sampah')
      .update({
        status_verifikasi,
        sumber_data,
        tanggal_verifikasi: tanggal_verifikasi || new Date().toISOString().split('T')[0],
        diverifikasi_oleh: verifikator,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Status verifikasi unit berhasil diperbarui', data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal memperbarui verifikasi unit' });
  }
});

/**
 * GET /api/unit/admin/laporan-keliru — Antrian Laporan Data Keliru (Admin)
 */
router.get('/admin/laporan-keliru', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('laporan_data_keliru')
      .select('*, unit:unit_id(id, nama, slug, kode)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return res.json({ success: true, data });
    }
  } catch {}
  return res.json({ success: true, data: memLaporanKeliru });
});

/**
 * PATCH /api/unit/admin/laporan-keliru/:id — Perbarui Status Laporan Data Keliru (Admin)
 */
router.patch('/admin/laporan-keliru/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  const { status, catatan_admin } = req.body;
  if (!['antrian', 'ditinjau', 'selesai', 'diabaikan'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Status tidak valid' });
  }

  try {
    await supabase
      .from('laporan_data_keliru')
      .update({ status, catatan_admin, updated_at: new Date().toISOString() })
      .eq('id', req.params.id);
  } catch {}

  const item = memLaporanKeliru.find((l) => l.id === req.params.id);
  if (item) {
    item.status = status;
    item.catatan_admin = catatan_admin;
  }

  return res.json({ success: true, message: 'Status laporan kekeliruan berhasil diperbarui' });
});

/**
 * POST /api/unit/:slug/lapor-keliru — Laporkan Data Keliru untuk Unit Tertentu
 * Dilengkapi Honeypot & Rate Limiting
 */
router.post('/:slug/lapor-keliru', async (req, res) => {
  const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
  if (!checkRateLimit(clientIp, 5, 60000)) {
    return res.status(429).json({
      success: false,
      message: 'Terlalu banyak laporan. Silakan coba 1 menit lagi.',
    });
  }

  // Honeypot check
  if (req.body.website_trap) {
    return res.status(400).json({ success: false, message: 'Spam terdeteksi' });
  }

  const { slug } = req.params;
  const unit = UNIT_SUMUT_VERIFIKASI.find((u) => u.slug === slug || u.id === slug);

  if (!unit) {
    return res.status(404).json({ success: false, message: 'Bank sampah tidak ditemukan' });
  }

  const {
    jenis_kekeliruan,
    deskripsi,
    data_usulan_koreksi,
    nama_pelapor,
    kontak_pelapor,
  } = req.body;

  const validJenis = ['alamat_salah', 'nomor_tidak_aktif', 'jam_tutup', 'harga_berbeda', 'lainnya'];
  if (!validJenis.includes(jenis_kekeliruan)) {
    return res.status(400).json({ success: false, message: 'Jenis kekeliruan tidak valid' });
  }
  if (!deskripsi || deskripsi.trim().length < 10) {
    return res.status(400).json({ success: false, message: 'Deskripsi kekeliruan minimal 10 karakter' });
  }

  const newLaporan = {
    id: `lapor-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    unit_id: unit.id,
    unit_nama: unit.nama,
    jenis_kekeliruan,
    deskripsi: deskripsi.trim(),
    data_usulan_koreksi: data_usulan_koreksi ? data_usulan_koreksi.trim() : null,
    nama_pelapor: nama_pelapor ? nama_pelapor.trim() : null,
    kontak_pelapor: kontak_pelapor ? kontak_pelapor.trim() : null,
    status: 'antrian',
    created_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from('laporan_data_keliru')
      .insert(newLaporan)
      .select()
      .single();

    if (!error && data) {
      return res.status(201).json({
        success: true,
        message: 'Laporan kekeliruan data berhasil dikirim. Terima kasih atas kepedulian Anda dalam menjaga akurasi data SIMBA.',
        data,
      });
    }
  } catch {}

  memLaporanKeliru.push(newLaporan);
  return res.status(201).json({
    success: true,
    message: 'Laporan kekeliruan data berhasil dikirim. Terima kasih atas kepedulian Anda dalam menjaga akurasi data SIMBA.',
    data: newLaporan,
  });
});

/**
 * GET /api/unit/:slug — Detail Unit Bank Sampah Publik
 * Hanya unit is_demo=false AND status_verifikasi='terverifikasi'
 * Mengembalikan 404 jika tidak ditemukan atau belum terverifikasi
 */
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;

  try {
    let unit = null;

    try {
      const { data, error } = await withTimeout(
        supabase
          .from('unit_bank_sampah')
          .select(`
            *,
            kabupaten_kota:kabupaten_kota_id(kode, nama, jenis),
            unit_harga(id, harga_beli, tanggal_berlaku, sumber, jenis_sampah:jenis_sampah_id(nama, kategori, satuan))
          `)
          .or(`slug.eq.${slug},id.eq.${slug}`)
          .eq('is_active', true)
          .eq('is_demo', false)
          .eq('status_verifikasi', 'terverifikasi')
          .single()
      );

      if (!error && data) {
        unit = {
          ...data,
          kabupaten_kota_kode: data.kabupaten_kota?.kode || data.kabupaten_kota_kode,
          kabupaten_kota_nama: data.kabupaten_kota?.nama || data.kabupaten_kota_nama,
          harga_katalog: (data.unit_harga || []).map((h) => ({
            jenis: h.jenis_sampah?.nama || 'Sampah Terpilah',
            kategori: h.jenis_sampah?.kategori || 'Umum',
            harga_beli: h.harga_beli,
            satuan: h.jenis_sampah?.satuan || 'kg',
            tanggal_berlaku: h.tanggal_berlaku,
            sumber: h.sumber,
          })),
        };
      }
    } catch {}

    if (!unit) {
      unit = UNIT_SUMUT_VERIFIKASI.find(
        (u) =>
          (u.slug === slug || u.id === slug) &&
          u.is_demo === false &&
          u.status_verifikasi === 'terverifikasi'
      );
    }

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Bank sampah tidak ditemukan atau belum terverifikasi publik',
      });
    }

    // Hitung status buka sekarang
    const isOpen = isUnitOpenNow(unit.jam_operasional);

    return res.json({
      success: true,
      data: {
        ...unit,
        is_buka_sekarang: isOpen,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail bank sampah',
      error: err.message,
    });
  }
});

// POST /api/unit (admin create)
router.post('/', authMiddleware, requireRole('admin'), async (req, res) => {
  const { nama, kode, alamat_lengkap, alamat, koordinator, nomor_hp } = req.body;
  if (!nama || !kode) return res.status(400).json({ success: false, message: 'Nama dan kode wajib diisi' });
  try {
    const { data, error } = await supabase
      .from('unit_bank_sampah')
      .insert({
        nama,
        kode,
        alamat_lengkap: alamat_lengkap || alamat,
        koordinator,
        telepon_publik: nomor_hp,
      })
      .select()
      .single();
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.status(201).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal membuat unit' });
  }
});

// PUT /api/unit/:id (admin update)
router.put('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  const { nama, alamat, alamat_lengkap, koordinator, nomor_hp, is_active } = req.body;
  try {
    const { error } = await supabase
      .from('unit_bank_sampah')
      .update({
        nama,
        alamat_lengkap: alamat_lengkap || alamat,
        koordinator,
        telepon_publik: nomor_hp,
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.params.id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Unit diperbarui' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal memperbarui unit' });
  }
});

module.exports = router;
