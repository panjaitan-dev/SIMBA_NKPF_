const supabase = require('../lib/supabase');

// GET /api/penjualan — server-side pagination, filtering, search
const getAllPenjualan = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('penjualan_sampah')
      .select('*, klien:klien_pembeli(nama_client, kode_client, nomor_hp, alamat)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'all') {
      query = query.eq('status_pembayaran', status);
    }
    if (search) {
      query = query.ilike('nomor_faktur', `%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.json({ success: true, data: [], meta: { total: 0, page: +page, limit: +limit } });
    }
    return res.json({ success: true, data, meta: { total: count || 0, page: +page, limit: +limit } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil data penjualan' });
  }
};

// POST /api/penjualan
const createPenjualan = async (req, res) => {
  const { klien_id, nomor_faktur, total_berat_kg, total_nominal, status_pembayaran, nomor_truk, catatan, items } = req.body;
  if (!klien_id || !nomor_faktur) {
    return res.status(400).json({ success: false, message: 'klien_id dan nomor_faktur wajib diisi' });
  }

  try {
    const { data: header, error: hError } = await supabase
      .from('penjualan_sampah')
      .insert({
        klien_id,
        nomor_faktur,
        total_berat_kg: total_berat_kg || 0,
        total_nominal: total_nominal || 0,
        status_pembayaran: status_pembayaran || 'lunas',
        nomor_truk,
        catatan,
      })
      .select()
      .single();

    if (hError) return res.status(400).json({ success: false, message: hError.message });

    if (items && items.length > 0) {
      const detailRows = items.map((it) => ({
        penjualan_id: header.id,
        jenis_sampah_id: it.jenis_sampah_id,
        berat_kg: it.berat_kg,
        harga_satuan_jual: it.harga_satuan_jual,
      }));
      await supabase.from('detail_penjualan').insert(detailRows);
    }

    return res.status(201).json({ success: true, message: 'Faktur penjualan berhasil disimpan', data: header });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal menyimpan transaksi penjualan' });
  }
};

// GET /api/penjualan/:id
const getPenjualanById = async (req, res) => {
  try {
    const { data: header, error: hErr } = await supabase
      .from('penjualan_sampah')
      .select('*, klien:klien_pembeli(*)')
      .eq('id', req.params.id)
      .single();

    if (hErr || !header) return res.status(404).json({ success: false, message: 'Faktur tidak ditemukan' });

    const { data: details } = await supabase
      .from('detail_penjualan')
      .select('*, jenis_sampah:jenis_sampah(nama, kode, satuan)')
      .eq('penjualan_id', req.params.id);

    return res.json({ success: true, data: { ...header, items: details || [] } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil detail penjualan' });
  }
};

// PUT /api/penjualan/:id
const updatePenjualan = async (req, res) => {
  const { status_pembayaran, nomor_truk, catatan } = req.body;
  try {
    const updatePayload = {};
    if (status_pembayaran !== undefined) updatePayload.status_pembayaran = status_pembayaran;
    if (nomor_truk !== undefined) updatePayload.nomor_truk = nomor_truk;
    if (catatan !== undefined) updatePayload.catatan = catatan;

    const { data, error } = await supabase
      .from('penjualan_sampah')
      .update(updatePayload)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Transaksi penjualan diperbarui', data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal memperbarui penjualan' });
  }
};

// DELETE /api/penjualan/:id — batalkan / void faktur penjualan
const deletePenjualan = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('penjualan_sampah')
      .update({ status_pembayaran: 'dibatalkan', catatan: 'Transaksi dibatalkan / void' })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Transaksi penjualan berhasil dibatalkan (void)' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal membatalkan transaksi penjualan' });
  }
};

module.exports = { getAllPenjualan, createPenjualan, getPenjualanById, updatePenjualan, deletePenjualan };
