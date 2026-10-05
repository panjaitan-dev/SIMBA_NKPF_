const supabase = require('../lib/supabase');

// GET /api/pengumuman (public)
const getAllPengumuman = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('pengumuman')
      .select('id, judul, konten, file_url, tanggal_mulai, tanggal_selesai, created_at')
      .eq('is_active', true)
      .or(`tanggal_selesai.is.null,tanggal_selesai.gte.${today}`)
      .order('created_at', { ascending: false })
      .limit(10);
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil pengumuman' });
  }
};

// GET /api/pengumuman/admin/all (admin)
const getAllPengumumanAdmin = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pengumuman').select('*').order('created_at', { ascending: false });
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil pengumuman' });
  }
};

// POST /api/pengumuman (admin)
const createPengumuman = async (req, res) => {
  const { judul, konten, tanggal_mulai, tanggal_selesai } = req.body;
  if (!judul || !konten) return res.status(400).json({ success: false, message: 'Judul dan konten wajib diisi' });
  try {
    const { data, error } = await supabase
      .from('pengumuman')
      .insert({ judul, konten, tanggal_mulai, tanggal_selesai, created_by: req.user.id })
      .select().single();
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.status(201).json({ success: true, message: 'Pengumuman berhasil dibuat', data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal membuat pengumuman' });
  }
};

// PUT /api/pengumuman/:id (admin)
const updatePengumuman = async (req, res) => {
  const { judul, konten, tanggal_mulai, tanggal_selesai, is_active } = req.body;
  try {
    const { error } = await supabase.from('pengumuman')
      .update({ judul, konten, tanggal_mulai, tanggal_selesai, is_active })
      .eq('id', req.params.id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Pengumuman diperbarui' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal memperbarui pengumuman' });
  }
};

// DELETE /api/pengumuman/:id (admin)
const deletePengumuman = async (req, res) => {
  try {
    const { error } = await supabase.from('pengumuman').delete().eq('id', req.params.id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Pengumuman dihapus' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal menghapus pengumuman' });
  }
};

module.exports = { getAllPengumuman, getAllPengumumanAdmin, createPengumuman, updatePengumuman, deletePengumuman };
