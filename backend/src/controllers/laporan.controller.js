const supabase = require('../lib/supabase');
const { uploadToStorage } = require('./auth.controller');

// GET /api/laporan (petugas/admin)
const getAllLaporan = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('laporan_lingkungan')
      .select('id, judul, lokasi, status, nama_pelapor, created_at, foto_urls', { count: 'exact' })
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
      .from('laporan_lingkungan').select('*').eq('id', req.params.id).single();
    if (error || !data) return res.status(404).json({ success: false, message: 'Laporan tidak ditemukan' });
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil laporan' });
  }
};

// POST /api/laporan (public — warga bisa lapor tanpa login)
const createLaporan = async (req, res) => {
  const { judul, deskripsi, lokasi, nama_pelapor, nomor_hp, koordinat_lat, koordinat_lng } = req.body;
  if (!judul || !deskripsi || !lokasi) {
    return res.status(400).json({ success: false, message: 'Judul, deskripsi, dan lokasi wajib diisi' });
  }
  try {
    const foto_urls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToStorage(file, 'laporan', 'fotos');
        foto_urls.push(url);
      }
    }

    const { data, error } = await supabase
      .from('laporan_lingkungan')
      .insert({
        judul, deskripsi, lokasi, nama_pelapor, nomor_hp,
        koordinat_lat: koordinat_lat ? parseFloat(koordinat_lat) : null,
        koordinat_lng: koordinat_lng ? parseFloat(koordinat_lng) : null,
        foto_urls,
        pelapor_id: req.user?.id || null,
      })
      .select('id').single();

    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.status(201).json({ success: true, message: 'Laporan berhasil dikirim, terima kasih!', data });
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

module.exports = { getAllLaporan, getLaporanById, createLaporan, updateStatusLaporan };
