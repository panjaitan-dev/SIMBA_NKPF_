const supabase = require('../lib/supabase');

// GET /api/nasabah — semua nasabah (admin/petugas)
const getAllNasabah = async (req, res) => {
  try {
    const { search, unit_id, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('v_nasabah')
      .select('*', { count: 'exact' })
      .order('joined_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`nama_lengkap.ilike.%${search}%,nomor_nasabah.ilike.%${search}%,nik.ilike.%${search}%`);
    }
    if (unit_id) query = query.eq('unit_id', unit_id); // akan diperbaiki karena v_nasabah tidak ada unit_id langsung

    const { data, error, count } = await query;
    if (error) return res.status(400).json({ success: false, message: error.message });

    return res.json({ success: true, data, meta: { total: count, page: +page, limit: +limit } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil data nasabah' });
  }
};

// GET /api/nasabah/:id
const getNasabahById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('v_nasabah')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ success: false, message: 'Nasabah tidak ditemukan' });
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil nasabah' });
  }
};

// GET /api/nasabah/me — profil nasabah sendiri
const getMyNasabah = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('v_nasabah')
      .select('*')
      .eq('profile_id', req.user.id)
      .single();

    if (error || !data) return res.status(404).json({ success: false, message: 'Data nasabah tidak ditemukan' });
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil data nasabah' });
  }
};

// PUT /api/nasabah/:id — update nasabah (admin)
const updateNasabah = async (req, res) => {
  const { unit_id, is_active } = req.body;
  try {
    const { error } = await supabase
      .from('nasabah')
      .update({ unit_id, is_active })
      .eq('id', req.params.id);

    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Data nasabah diperbarui' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal memperbarui nasabah' });
  }
};

// GET /api/nasabah/:id/riwayat — riwayat transaksi nasabah
const getRiwayatNasabah = async (req, res) => {
  try {
    const { data: nasabah } = await supabase
      .from('nasabah').select('id').eq('id', req.params.id).single();
    if (!nasabah) return res.status(404).json({ success: false, message: 'Nasabah tidak ditemukan' });

    const [{ data: setoran }, { data: penarikan }] = await Promise.all([
      supabase.from('setoran').select('*').eq('nasabah_id', nasabah.id).order('created_at', { ascending: false }).limit(20),
      supabase.from('penarikan').select('*').eq('nasabah_id', nasabah.id).order('created_at', { ascending: false }).limit(20),
    ]);

    return res.json({ success: true, data: { setoran: setoran || [], penarikan: penarikan || [] } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil riwayat' });
  }
};

module.exports = { getAllNasabah, getNasabahById, getMyNasabah, updateNasabah, getRiwayatNasabah };
