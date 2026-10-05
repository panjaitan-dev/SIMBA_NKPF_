const supabase = require('../lib/supabase');
const { uploadToStorage } = require('./auth.controller');

// GET /api/galeri (public)
const getAllAlbum = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('galeri_album')
      .select('*, galeri_foto(count)')
      .eq('is_published', true)
      .order('tanggal_kegiatan', { ascending: false });
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil galeri' });
  }
};

// GET /api/galeri/:id (public)
const getAlbumById = async (req, res) => {
  try {
    const { data: album, error } = await supabase
      .from('galeri_album').select('*').eq('id', req.params.id).eq('is_published', true).single();
    if (error || !album) return res.status(404).json({ success: false, message: 'Album tidak ditemukan' });

    const { data: fotos } = await supabase
      .from('galeri_foto').select('*').eq('album_id', req.params.id).order('urutan');

    return res.json({ success: true, data: { ...album, fotos: fotos || [] } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil album' });
  }
};

// POST /api/galeri (admin) — buat album baru
const createAlbum = async (req, res) => {
  const { judul, deskripsi, lokasi, tanggal_kegiatan, is_published } = req.body;
  if (!judul) return res.status(400).json({ success: false, message: 'Judul album wajib diisi' });
  try {
    let cover_url = null;
    if (req.file) cover_url = await uploadToStorage(req.file, 'galeri', 'covers');
    const { data, error } = await supabase
      .from('galeri_album')
      .insert({ judul, deskripsi, cover_url, lokasi, tanggal_kegiatan, is_published: is_published !== 'false', created_by: req.user.id })
      .select().single();
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.status(201).json({ success: true, message: 'Album berhasil dibuat', data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal membuat album' });
  }
};

// POST /api/galeri/:id/foto (admin) — upload foto ke album
const uploadFoto = async (req, res) => {
  if (!req.files || !req.files.length) {
    return res.status(400).json({ success: false, message: 'Minimal 1 foto harus diunggah' });
  }
  try {
    const fotoData = [];
    for (const file of req.files) {
      const url = await uploadToStorage(file, 'galeri', `album-${req.params.id}`);
      fotoData.push({ album_id: req.params.id, url, caption: file.originalname, urutan: fotoData.length });
    }
    const { data, error } = await supabase.from('galeri_foto').insert(fotoData).select();
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.status(201).json({ success: true, message: `${data.length} foto berhasil diunggah`, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengunggah foto' });
  }
};

// DELETE /api/galeri/:id (admin)
const deleteAlbum = async (req, res) => {
  try {
    const { error } = await supabase.from('galeri_album').delete().eq('id', req.params.id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Album dihapus' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal menghapus album' });
  }
};

// DELETE /api/galeri/foto/:id (admin)
const deleteFoto = async (req, res) => {
  try {
    const { error } = await supabase.from('galeri_foto').delete().eq('id', req.params.id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Foto dihapus' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal menghapus foto' });
  }
};

module.exports = { getAllAlbum, getAlbumById, createAlbum, uploadFoto, deleteAlbum, deleteFoto };
