const supabase = require('../lib/supabase');

// GET /api/klien — server-side pagination & search
const getAllKlien = async (req, res) => {
  try {
    const { search, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('klien_pembeli')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`nama_client.ilike.%${search}%,kode_client.ilike.%${search}%,perusahaan.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      // Fallback response if table not yet migrated
      return res.json({ success: true, data: [], meta: { total: 0, page: +page, limit: +limit } });
    }
    return res.json({ success: true, data, meta: { total: count || 0, page: +page, limit: +limit } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil data klien' });
  }
};

// POST /api/klien
const createKlien = async (req, res) => {
  const { kode_client, nama_client, perusahaan, komoditas, alamat, nomor_hp, email, status_aktif } = req.body;
  if (!kode_client || !nama_client || !alamat || !nomor_hp) {
    return res.status(400).json({ success: false, message: 'Field wajib belum lengkap' });
  }

  try {
    const { data, error } = await supabase
      .from('klien_pembeli')
      .insert({
        kode_client,
        nama_client,
        perusahaan,
        komoditas,
        alamat,
        nomor_hp,
        email,
        status_aktif: status_aktif ?? true,
      })
      .select()
      .single();

    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.status(201).json({ success: true, message: 'Klien berhasil ditambahkan', data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal membuat data klien' });
  }
};

// PUT /api/klien/:id
const updateKlien = async (req, res) => {
  try {
    const { error } = await supabase
      .from('klien_pembeli')
      .update(req.body)
      .eq('id', req.params.id);

    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Data klien berhasil diperbarui' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal memperbarui data klien' });
  }
};

// DELETE /api/klien/:id
const deleteKlien = async (req, res) => {
  try {
    const { error } = await supabase
      .from('klien_pembeli')
      .delete()
      .eq('id', req.params.id);

    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Data klien berhasil dihapus' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal menghapus data klien' });
  }
};

module.exports = { getAllKlien, createKlien, updateKlien, deleteKlien };
