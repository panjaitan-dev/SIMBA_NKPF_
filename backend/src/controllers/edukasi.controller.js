const supabase = require('../lib/supabase');
const { uploadToStorage } = require('./auth.controller');

const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// GET /api/edukasi (public)
const getAllEdukasi = async (req, res) => {
  try {
    const { kategori } = req.query;
    let query = supabase
      .from('edukasi')
      .select('id, judul, slug, ringkasan, thumbnail_url, kategori, urutan')
      .eq('is_published', true)
      .order('urutan').order('created_at', { ascending: false });

    if (kategori) query = query.eq('kategori', kategori);
    const { data, error } = await query;
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil edukasi' });
  }
};

// GET /api/edukasi/:slug (public)
const getEdukasiBySlug = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('edukasi').select('*').eq('slug', req.params.slug).eq('is_published', true).single();
    if (error || !data) return res.status(404).json({ success: false, message: 'Konten edukasi tidak ditemukan' });
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil edukasi' });
  }
};

// POST /api/edukasi (admin)
const createEdukasi = async (req, res) => {
  const { judul, konten, ringkasan, kategori, urutan, is_published } = req.body;
  if (!judul || !konten) return res.status(400).json({ success: false, message: 'Judul dan konten wajib diisi' });
  try {
    let thumbnail_url = null;
    if (req.file) thumbnail_url = await uploadToStorage(req.file, 'edukasi', 'thumbnails');
    const slug = `${slugify(judul)}-${Date.now().toString().slice(-6)}`;
    const { data, error } = await supabase
      .from('edukasi')
      .insert({ judul, slug, konten, ringkasan, thumbnail_url, kategori: kategori || 'lainnya', urutan: urutan || 0, is_published: is_published === 'true', created_by: req.user.id })
      .select().single();
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.status(201).json({ success: true, message: 'Konten edukasi berhasil dibuat', data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal membuat edukasi' });
  }
};

// PUT /api/edukasi/:id (admin)
const updateEdukasi = async (req, res) => {
  const { judul, konten, ringkasan, kategori, urutan, is_published } = req.body;
  try {
    let thumbnail_url = undefined;
    if (req.file) thumbnail_url = await uploadToStorage(req.file, 'edukasi', 'thumbnails');
    const updateData = { judul, konten, ringkasan, kategori, urutan, is_published: is_published === 'true' };
    if (thumbnail_url) updateData.thumbnail_url = thumbnail_url;
    const { error } = await supabase.from('edukasi').update(updateData).eq('id', req.params.id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Edukasi diperbarui' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal memperbarui edukasi' });
  }
};

// DELETE /api/edukasi/:id (admin)
const deleteEdukasi = async (req, res) => {
  try {
    const { error } = await supabase.from('edukasi').delete().eq('id', req.params.id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Edukasi dihapus' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal menghapus edukasi' });
  }
};

// GET /api/edukasi/admin/all (admin)
const getAllEdukasiAdmin = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('edukasi')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil data edukasi admin' });
  }
};

module.exports = { getAllEdukasi, getEdukasiBySlug, createEdukasi, updateEdukasi, deleteEdukasi, getAllEdukasiAdmin };
