const supabase = require('../lib/supabase');

// GET /api/penarikan
const getAllPenarikan = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('penarikan')
      .select(`*, nasabah(nomor_nasabah, profile_id, profiles(nama_lengkap, nomor_hp))`, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'all') query = query.eq('status', status);
    if (search) {
      query = query.ilike('nomor_penarikan', `%${search}%`);
    }

    const { data, error, count } = await query;
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, data, meta: { total: count || 0, page: +page, limit: +limit } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil data penarikan' });
  }
};

// GET /api/penarikan/my
const getMyPenarikan = async (req, res) => {
  try {
    const { data: nasabah } = await supabase
      .from('nasabah').select('id').eq('profile_id', req.user.id).single();

    if (!nasabah) return res.status(404).json({ success: false, message: 'Nasabah tidak ditemukan' });

    const { data, error } = await supabase
      .from('penarikan')
      .select('*')
      .eq('nasabah_id', nasabah.id)
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil penarikan' });
  }
};

// POST /api/penarikan — nasabah ajukan penarikan
const createPenarikan = async (req, res) => {
  const { jumlah, catatan } = req.body;

  if (!jumlah || jumlah <= 0) {
    return res.status(400).json({ success: false, message: 'Jumlah penarikan harus lebih dari 0' });
  }

  try {
    const { data: nasabah, error: nasabahErr } = await supabase
      .from('nasabah').select('id, saldo').eq('profile_id', req.user.id).single();

    if (nasabahErr || !nasabah) return res.status(404).json({ success: false, message: 'Data nasabah tidak ditemukan' });

    if (nasabah.saldo < jumlah) {
      return res.status(400).json({ success: false, message: `Saldo tidak mencukupi. Saldo saat ini: Rp ${nasabah.saldo.toLocaleString('id-ID')}` });
    }

    const nomorPenarikan = `WDR-${Date.now().toString().slice(-10)}`;

    const { data, error } = await supabase
      .from('penarikan')
      .insert({ nasabah_id: nasabah.id, nomor_penarikan: nomorPenarikan, jumlah, catatan })
      .select().single();

    if (error) return res.status(400).json({ success: false, message: error.message });

    return res.status(201).json({
      success: true,
      message: 'Permintaan penarikan berhasil diajukan, menunggu persetujuan petugas',
      data: { id: data.id, nomor_penarikan: nomorPenarikan },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal membuat penarikan' });
  }
};

// PUT /api/penarikan/:id/status — petugas/admin proses penarikan
const updateStatusPenarikan = async (req, res) => {
  const { status, catatan } = req.body;
  const validStatus = ['disetujui', 'ditolak', 'dibayar'];

  if (!validStatus.includes(status)) {
    return res.status(400).json({ success: false, message: `Status harus: ${validStatus.join(', ')}` });
  }

  try {
    const { error } = await supabase
      .from('penarikan')
      .update({ status, catatan, petugas_id: req.user.id })
      .eq('id', req.params.id);

    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, message: `Penarikan berhasil diupdate ke status: ${status}` });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal update penarikan' });
  }
};

// DELETE /api/penarikan/:id — batalkan / void request penarikan
const deletePenarikan = async (req, res) => {
  try {
    const { data: penarikan, error: pErr } = await supabase
      .from('penarikan')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (pErr || !penarikan) {
      return res.status(404).json({ success: false, message: 'Data penarikan tidak ditemukan' });
    }

    const userRole = req.user?.profile?.role;

    // Jika nasabah, hanya boleh membatalkan miliknya sendiri yang masih pending
    if (userRole === 'nasabah') {
      const { data: nasabah } = await supabase
        .from('nasabah')
        .select('id')
        .eq('profile_id', req.user.id)
        .single();

      if (!nasabah || penarikan.nasabah_id !== nasabah.id) {
        return res.status(403).json({ success: false, message: 'Akses ditolak' });
      }

      if (penarikan.status !== 'pending') {
        return res.status(400).json({ success: false, message: 'Hanya permohonan berstatus pending yang dapat dibatalkan' });
      }
    }

    // Soft-delete / void status ke 'dibatalkan'
    // Jika status sebelumnya 'dibayar', trigger proses_penarikan() otomatis mengembalikan saldo nasabah
    const { error } = await supabase
      .from('penarikan')
      .update({
        status: 'dibatalkan',
        catatan: `${penarikan.catatan ? penarikan.catatan + ' | ' : ''}Dibatalkan oleh ${userRole || 'nasabah'}`
      })
      .eq('id', req.params.id);

    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Permintaan penarikan berhasil dibatalkan' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal membatalkan penarikan' });
  }
};

module.exports = { getAllPenarikan, getMyPenarikan, createPenarikan, updateStatusPenarikan, deletePenarikan };
