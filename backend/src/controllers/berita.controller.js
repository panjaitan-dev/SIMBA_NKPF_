const supabase = require('../lib/supabase');
const { uploadToStorage } = require('./auth.controller');

const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// GET /api/berita (public)
const getAllBerita = async (req, res) => {
  try {
    const { kategori, search, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('berita')
      .select('id, judul, slug, ringkasan, thumbnail_url, kategori, tag, published_at, view_count', { count: 'exact' })
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (kategori) query = query.eq('kategori', kategori);
    if (search) query = query.ilike('judul', `%${search}%`);

    const { data, error, count } = await query;
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, data, meta: { total: count, page: +page, limit: +limit } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil berita' });
  }
};

// GET /api/berita/:slug (public)
const getBeritaBySlug = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('berita')
      .select('*, profiles(nama_lengkap)')
      .eq('slug', req.params.slug)
      .eq('is_published', true)
      .single();

    if (error || !data) return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });

    await supabase.from('berita').update({ view_count: (data.view_count || 0) + 1 }).eq('id', data.id);

    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil berita' });
  }
};

// GET /api/berita/admin/all (admin)
const getAllBeritaAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const { data, error, count } = await supabase
      .from('berita')
      .select('id, judul, slug, kategori, is_published, published_at, view_count, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, data, meta: { total: count, page: +page, limit: +limit } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil berita' });
  }
};

// POST /api/berita (admin)
const createBerita = async (req, res) => {
  const { judul, konten, ringkasan, kategori, tag, is_published } = req.body;
  if (!judul || !konten) return res.status(400).json({ success: false, message: 'Judul dan konten wajib diisi' });

  try {
    let thumbnail_url = null;
    if (req.file) thumbnail_url = await uploadToStorage(req.file, 'berita', 'thumbnails');

    const slug = `${slugify(judul)}-${Date.now().toString().slice(-6)}`;
    const published_at = is_published === 'true' ? new Date().toISOString() : null;

    const { data, error } = await supabase
      .from('berita')
      .insert({ judul, slug, konten, ringkasan, thumbnail_url, kategori: kategori || 'umum', tag: tag || [], penulis_id: req.user.id, is_published: is_published === 'true', published_at })
      .select().single();

    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.status(201).json({ success: true, message: 'Berita berhasil dibuat', data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal membuat berita' });
  }
};

// PUT /api/berita/:id (admin)
const updateBerita = async (req, res) => {
  const { judul, konten, ringkasan, kategori, tag, is_published } = req.body;
  try {
    let thumbnail_url = undefined;
    if (req.file) thumbnail_url = await uploadToStorage(req.file, 'berita', 'thumbnails');

    const updateData = { judul, konten, ringkasan, kategori, tag, is_published: is_published === 'true' };
    if (thumbnail_url) updateData.thumbnail_url = thumbnail_url;
    if (is_published === 'true') updateData.published_at = new Date().toISOString();

    const { error } = await supabase.from('berita').update(updateData).eq('id', req.params.id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Berita diperbarui' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal memperbarui berita' });
  }
};

// DELETE /api/berita/:id (admin)
const deleteBerita = async (req, res) => {
  try {
    const { error } = await supabase.from('berita').delete().eq('id', req.params.id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Berita dihapus' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal menghapus berita' });
  }
};

module.exports = { getAllBerita, getBeritaBySlug, getAllBeritaAdmin, createBerita, updateBerita, deleteBerita };
