const supabase = require('../lib/supabase');
const { uploadToStorage } = require('./auth.controller');

// GET /api/setoran
const getAllSetoran = async (req, res) => {
  try {
    const { status, nasabah_id, page = 1, limit = 20, date_from, date_to } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('v_setoran')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq('status', status);
    if (nasabah_id) query = query.eq('nasabah_id', nasabah_id);
    if (date_from) query = query.gte('tanggal_setoran', date_from);
    if (date_to) query = query.lte('tanggal_setoran', date_to);

    const { data, error, count } = await query;
    if (error) return res.status(400).json({ success: false, message: error.message });

    return res.json({ success: true, data, meta: { total: count, page: +page, limit: +limit } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil data setoran' });
  }
};

// GET /api/setoran/my — setoran milik nasabah yang sedang login
const getMySetoran = async (req, res) => {
  try {
    const { data: nasabah } = await supabase
      .from('nasabah').select('id').eq('profile_id', req.user.id).single();

    if (!nasabah) return res.status(404).json({ success: false, message: 'Data nasabah tidak ditemukan' });

    const { data, error } = await supabase
      .from('v_setoran')
      .select('*')
      .eq('nasabah_id', nasabah.id)
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil setoran' });
  }
};

// GET /api/setoran/:id — detail setoran dengan item
const getSetoranById = async (req, res) => {
  try {
    const { data: setoran, error } = await supabase
      .from('v_setoran')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !setoran) return res.status(404).json({ success: false, message: 'Setoran tidak ditemukan' });

    const { data: details } = await supabase
      .from('detail_setoran')
      .select('*, jenis_sampah(nama, kode, satuan)')
      .eq('setoran_id', req.params.id);

    return res.json({ success: true, data: { ...setoran, details: details || [] } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil detail setoran' });
  }
};

// POST /api/setoran — buat setoran baru (petugas/admin input)
const createSetoran = async (req, res) => {
  const { nasabah_id, unit_id, tanggal_setoran, items, catatan } = req.body;

  if (!nasabah_id || !items || !items.length) {
    return res.status(400).json({ success: false, message: 'nasabah_id dan items wajib diisi' });
  }

  try {
    const nomorSetoran = `STO-${Date.now().toString().slice(-10)}`;

    // 1. Buat header setoran
    const { data: setoran, error: setoranError } = await supabase
      .from('setoran')
      .insert({
        nasabah_id,
        petugas_id: req.user.id,
        unit_id,
        nomor_setoran: nomorSetoran,
        tanggal_setoran: tanggal_setoran || new Date().toISOString().split('T')[0],
        status: 'pending',
        catatan,
      })
      .select()
      .single();

    if (setoranError) return res.status(400).json({ success: false, message: setoranError.message });

    // 2. Masukkan detail item setoran
    const detailItems = items.map(item => ({
      setoran_id: setoran.id,
      jenis_sampah_id: item.jenis_sampah_id,
      berat_kg: item.berat_kg,
      harga_satuan: item.harga_satuan,
    }));

    const { error: detailError } = await supabase.from('detail_setoran').insert(detailItems);

    if (detailError) {
      await supabase.from('setoran').delete().eq('id', setoran.id);
      return res.status(400).json({ success: false, message: detailError.message });
    }

    return res.status(201).json({
      success: true,
      message: 'Setoran berhasil dibuat',
      data: { id: setoran.id, nomor_setoran: nomorSetoran },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Gagal membuat setoran' });
  }
};

// PUT /api/setoran/:id/status — verifikasi atau tolak setoran
const updateStatusSetoran = async (req, res) => {
  const { status, catatan } = req.body;
  const validStatus = ['diverifikasi', 'ditolak'];

  if (!validStatus.includes(status)) {
    return res.status(400).json({ success: false, message: `Status harus: ${validStatus.join(' atau ')}` });
  }

  try {
    const { error } = await supabase
      .from('setoran')
      .update({ status, catatan, petugas_id: req.user.id })
      .eq('id', req.params.id);

    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, message: `Setoran berhasil ${status === 'diverifikasi' ? 'diverifikasi' : 'ditolak'}` });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal update status setoran' });
  }
};

module.exports = { getAllSetoran, getMySetoran, getSetoranById, createSetoran, updateStatusSetoran };
