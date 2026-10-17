const supabase = require('../lib/supabase');
const { uploadToStorage } = require('./auth.controller');
const limits = require('../config/limits');

// GET /api/laporan (petugas/admin)
const getAllLaporan = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('laporan_lingkungan')
      .select('id, nomor_tiket, judul, lokasi, status, nama_pelapor, created_at, foto_urls', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq('status', status);

    const { data, error, count } = await query;
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, data, meta: { total: count, page: +page, limit: +limit } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil laporan' });
  }
};

// GET /api/laporan/:id
const getLaporanById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('laporan_lingkungan')
      .select('*')
      .eq('id', req.params.id)
      .single();
    if (error || !data) return res.status(404).json({ success: false, message: 'Laporan tidak ditemukan' });
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil laporan' });
  }
};

// GET /api/laporan/lacak/:kode (public — pelacakan tiket aduan warga)
const getLaporanByTiket = async (req, res) => {
  try {
    const kode = (req.params.kode || '').trim().toUpperCase();
    if (!kode) {
      return res.status(400).json({
        success: false,
        message: 'Nomor tiket wajib diisi',
      });
    }

    const { data, error } = await supabase
      .from('laporan_lingkungan')
      .select('id, nomor_tiket, judul, deskripsi, lokasi, status, catatan_petugas, created_at, updated_at, foto_urls')
      .eq('nomor_tiket', kode)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Tiket tidak ditemukan. Periksa kembali nomor tiket Anda.',
      });
    }

    // Mapping status code untuk progress timeline
    // status: pending -> step 1, diproses -> step 2 / 3, selesai -> step 4, ditolak -> status khusus
    let statusCode = 1;
    let statusLabel = 'Laporan Diterima & Terdaftar';

    if (data.status === 'diproses') {
      statusCode = 2;
      statusLabel = 'Sedang Ditindaklanjuti Tim Lapangan';
    } else if (data.status === 'selesai') {
      statusCode = 4;
      statusLabel = 'Selesai Ditindaklanjuti';
    } else if (data.status === 'ditolak') {
      statusCode = 0;
      statusLabel = 'Laporan Ditolak';
    }

    // Sanitasi lokasi untuk publik (hanya level kelurahan/kecamatan/ringkasan)
    const sanitizedLokasi = data.lokasi.replace(/\[Lat:.*?\]/g, '').trim();

    return res.json({
      success: true,
      data: {
        nomor_tiket: data.nomor_tiket,
        judul: data.judul,
        deskripsi: data.deskripsi,
        lokasi: sanitizedLokasi,
        status: data.status,
        status_code: statusCode,
        status_label: statusLabel,
        petugas: data.catatan_petugas ? 'Tim Penanganan DLH Terpadu' : 'Menunggu Penugasan Petugas',
        catatan: data.catatan_petugas || 'Laporan dalam antrean verifikasi petugas.',
        tanggal: data.created_at,
        updated_at: data.updated_at,
        foto_urls: data.foto_urls || [],
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal melacak tiket aduan' });
  }
};

// POST /api/laporan (public — warga bisa lapor tanpa login)
const createLaporan = async (req, res) => {
  // Anti-spam honeypot check
  if (req.body.website) {
    return res.status(400).json({ success: false, message: 'Permintaan tidak valid (spam detected)' });
  }

  const {
    judul,
    deskripsi,
    lokasi,
    nama_pelapor,
    nomor_hp,
    koordinat_lat,
    koordinat_lng,
    nomor_tiket,
  } = req.body;

  if (!judul || !deskripsi || !lokasi) {
    return res.status(400).json({ success: false, message: 'Judul, deskripsi, dan lokasi wajib diisi' });
  }

  // Generate nomor_tiket acak 15 karakter jika tidak dikirim (LAP-2026-XXXXXX)
  let ticketId = nomor_tiket;
  if (!ticketId || ticketId.length !== (limits.LAPOR_TIKET_LENGTH || 15)) {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    ticketId = `LAP-2026-${randomDigits}`;
  }

  try {
    const foto_urls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToStorage(file, 'laporan', 'fotos');
        foto_urls.push(url);
      }
    }

    const insertPayload = {
      judul,
      deskripsi,
      lokasi,
      nama_pelapor: nama_pelapor || null,
      nomor_hp: nomor_hp || null,
      koordinat_lat: koordinat_lat ? parseFloat(koordinat_lat) : null,
      koordinat_lng: koordinat_lng ? parseFloat(koordinat_lng) : null,
      foto_urls,
      pelapor_id: req.user?.id || null,
      nomor_tiket: ticketId,
    };

    const { data, error } = await supabase
      .from('laporan_lingkungan')
      .insert(insertPayload)
      .select('id, nomor_tiket, judul, status, created_at')
      .single();

    if (error) {
      // Jika kolom nomor_tiket belum ada di schema database, coba insert tanpa nomor_tiket sebagai fallback
      if (error.message?.includes('nomor_tiket')) {
        delete insertPayload.nomor_tiket;
        const fallback = await supabase
          .from('laporan_lingkungan')
          .insert(insertPayload)
          .select('id, judul, status, created_at')
          .single();
        if (fallback.error) return res.status(400).json({ success: false, message: fallback.error.message });
        return res.status(201).json({
          success: true,
          message: 'Laporan berhasil dikirim, terima kasih!',
          data: { ...fallback.data, nomor_tiket: ticketId },
        });
      }
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(201).json({
      success: true,
      message: 'Laporan berhasil dikirim, terima kasih!',
      data: {
        id: data.id,
        nomor_tiket: data.nomor_tiket || ticketId,
        judul: data.judul,
        status: data.status,
        created_at: data.created_at,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengirim laporan' });
  }
};

// PUT /api/laporan/:id/status (petugas/admin)
const updateStatusLaporan = async (req, res) => {
  const { status, catatan_petugas } = req.body;
  const validStatus = ['diproses', 'selesai', 'ditolak'];
  if (!validStatus.includes(status)) {
    return res.status(400).json({ success: false, message: `Status harus: ${validStatus.join(', ')}` });
  }
  try {
    const { error } = await supabase
      .from('laporan_lingkungan')
      .update({ status, catatan_petugas, petugas_id: req.user.id })
      .eq('id', req.params.id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Status laporan diperbarui' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal update laporan' });
  }
};

// DELETE /api/laporan/:id (admin)
const deleteLaporan = async (req, res) => {
  try {
    const { error } = await supabase
      .from('laporan_lingkungan')
      .delete()
      .eq('id', req.params.id);

    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Laporan aduan lingkungan berhasil dihapus' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal menghapus laporan' });
  }
};

module.exports = {
  getAllLaporan,
  getLaporanById,
  getLaporanByTiket,
  createLaporan,
  updateStatusLaporan,
  deleteLaporan,
};
