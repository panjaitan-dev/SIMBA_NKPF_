const supabase = require('../lib/supabase');

// GET /api/jenis-sampah
const getAllJenisSampah = async (req, res) => {
  try {
    const { kategori, is_active } = req.query;
    let query = supabase.from('jenis_sampah').select('*').order('nama');
    if (kategori) query = query.eq('kategori', kategori);
    if (is_active !== undefined) query = query.eq('is_active', is_active === 'true');

    const { data, error } = await query;
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil jenis sampah' });
  }
};

// POST /api/jenis-sampah
const createJenisSampah = async (req, res) => {
  const { nama, kode, kategori, satuan, harga_per_satuan, harga_beli, harga_jual, deskripsi, icon } = req.body;
  const effectiveHargaBeli = harga_beli || harga_per_satuan || 0;
  const effectiveHargaJual = harga_jual || Math.round(effectiveHargaBeli * 1.3);

  if (!nama || !kode || !kategori) {
    return res.status(400).json({ success: false, message: 'nama, kode, dan kategori wajib diisi' });
  }
  try {
    const { data, error } = await supabase
      .from('jenis_sampah')
      .insert({
        nama,
        kode,
        kategori,
        satuan: satuan || 'kg',
        harga_per_satuan: effectiveHargaBeli,
        harga_beli: effectiveHargaBeli,
        harga_jual: effectiveHargaJual,
        deskripsi,
        icon,
      })
      .select().single();
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.status(201).json({ success: true, message: 'Jenis sampah berhasil ditambahkan', data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal membuat jenis sampah' });
  }
};

// PUT /api/jenis-sampah/:id
const updateJenisSampah = async (req, res) => {
  const { nama, kode, kategori, satuan, harga_per_satuan, harga_beli, harga_jual, deskripsi, icon, is_active } = req.body;
  try {
    const updatePayload = { nama, kode, kategori, satuan, deskripsi, icon, is_active };
    if (harga_beli !== undefined) updatePayload.harga_beli = harga_beli;
    if (harga_jual !== undefined) updatePayload.harga_jual = harga_jual;
    if (harga_per_satuan !== undefined || harga_beli !== undefined) {
      updatePayload.harga_per_satuan = harga_beli !== undefined ? harga_beli : harga_per_satuan;
    }

    const { error } = await supabase
      .from('jenis_sampah')
      .update(updatePayload)
      .eq('id', req.params.id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Jenis sampah diperbarui' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal memperbarui jenis sampah' });
  }
};

// DELETE /api/jenis-sampah/:id
const deleteJenisSampah = async (req, res) => {
  try {
    const { error } = await supabase.from('jenis_sampah').update({ is_active: false }).eq('id', req.params.id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Jenis sampah dinonaktifkan' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal menghapus jenis sampah' });
  }
};

module.exports = { getAllJenisSampah, createJenisSampah, updateJenisSampah, deleteJenisSampah };
