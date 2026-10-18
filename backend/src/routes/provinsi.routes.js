const router = require('express').Router();
const supabase = require('../lib/supabase');
const { withTimeout } = require('../lib/db-helper');
const { DATA_38_PROVINSI } = require('../lib/provinsi-data');

// Rate limiting in-memory
const minatIps = new Map();
function checkRateLimit(ip, limit = 20, windowMs = 60000) {
  if (process.env.NODE_ENV === 'test') return true;
  const now = Date.now();
  const records = minatIps.get(ip) || [];
  const recent = records.filter((t) => now - t < windowMs);
  if (recent.length >= limit) return false;
  recent.push(now);
  minatIps.set(ip, recent);
  return true;
}

const memMinatProvinsi = [];

/**
 * GET /api/provinsi — Daftar 38 Provinsi dengan status layanan
 * Sumatera Utara = 'aktif_pilot', 37 lainnya = 'belum_tersedia'
 */
router.get('/', async (req, res) => {
  try {
    const list = DATA_38_PROVINSI.map((p) => {
      const isPilot = p.kode_bps === '12' || p.kode_iso === 'SU';
      return {
        kode: p.kode_bps,
        kode_iso: p.kode_iso,
        nama: p.nama,
        ibukota: p.ibukota,
        pulau: p.pulau,
        lat: p.lat,
        lng: p.lng,
        status_layanan: isPilot ? 'aktif_pilot' : 'belum_tersedia',
        status_label: isPilot ? 'Pilot Aktif' : 'Belum tersedia di SIMBA',
      };
    });

    return res.json({ success: true, data: list });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil data provinsi' });
  }
});

/**
 * GET /api/provinsi/minat — Agregasi Jumlah Minat per Provinsi ("Ajukan Provinsi Saya")
 * Dimulai dari 0 untuk provinsi belum tersedia sesuai aturan R5
 */
router.get('/minat', async (req, res) => {
  try {
    // Hitung dari memori dan database jika ada
    const counts = {};
    DATA_38_PROVINSI.forEach((p) => {
      counts[p.kode_bps] = 0;
    });

    try {
      const { data, error } = await withTimeout(
        supabase
          .from('provinsi_minat')
          .select('provinsi_kode')
      );

      if (!error && Array.isArray(data)) {
        data.forEach((row) => {
          if (counts[row.provinsi_kode] !== undefined) {
            counts[row.provinsi_kode] += 1;
          }
        });
      }
    } catch {}

    memMinatProvinsi.forEach((m) => {
      if (counts[m.provinsi_kode] !== undefined) {
        counts[m.provinsi_kode] += 1;
      }
    });

    const result = DATA_38_PROVINSI.map((p) => ({
      kode: p.kode_bps,
      kode_iso: p.kode_iso,
      nama: p.nama,
      status_layanan: (p.kode_bps === '12' || p.kode_iso === 'SU') ? 'aktif_pilot' : 'belum_tersedia',
      jumlah_minat: counts[p.kode_bps] || 0,
    }));

    return res.json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil data minat provinsi' });
  }
});

/**
 * POST /api/provinsi/minat — Form Pengajuan Minat Provinsi Baru
 * Fitur "Ajukan provinsi saya" dengan Honeypot & Rate Limiting
 */
router.post('/minat', async (req, res) => {
  const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
  if (!checkRateLimit(clientIp, 5, 60000)) {
    return res.status(429).json({
      success: false,
      message: 'Terlalu banyak permintaan pengajuan minat. Coba 1 menit lagi.',
    });
  }

  // Honeypot check
  if (req.body.website_trap) {
    return res.status(400).json({ success: false, message: 'Spam terdeteksi' });
  }

  const { provinsi_kode, peran, email, catatan } = req.body;

  if (!provinsi_kode) {
    return res.status(400).json({ success: false, message: 'Provinsi wajib dipilih' });
  }

  const validProv = DATA_38_PROVINSI.find((p) => p.kode_bps === provinsi_kode || p.kode_iso === provinsi_kode);
  if (!validProv) {
    return res.status(400).json({ success: false, message: 'Kode provinsi tidak valid' });
  }

  const validPeran = ['warga', 'pengelola', 'pemda', 'lainnya'];
  if (!peran || !validPeran.includes(peran)) {
    return res.status(400).json({ success: false, message: 'Peran wajib dipilih (warga/pengelola/pemda/lainnya)' });
  }

  const newMinat = {
    id: `minat-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    provinsi_kode: validProv.kode_bps,
    peran,
    email: email ? email.trim() : null,
    catatan: catatan ? catatan.trim() : null,
    created_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from('provinsi_minat')
      .insert(newMinat)
      .select()
      .single();

    if (!error && data) {
      return res.status(201).json({
        success: true,
        message: `Minat untuk ${validProv.nama} berhasil dicatat. Dukungan Anda membantu percepatan ekspansi SIMBA ke provinsi Anda!`,
        data,
      });
    }
  } catch {}

  memMinatProvinsi.push(newMinat);
  return res.status(201).json({
    success: true,
    message: `Minat untuk ${validProv.nama} berhasil dicatat. Dukungan Anda membantu percepatan ekspansi SIMBA ke provinsi Anda!`,
    data: newMinat,
  });
});

module.exports = router;
