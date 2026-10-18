const supabase = require('../lib/supabase');
const { DATA_38_PROVINSI, getAgregasiNasional } = require('../lib/provinsi-data');

// In-Memory Cache Store for high-traffic public endpoints
const cache = {
  nasional: { data: null, expiresAt: 0 },
  provinsi: { data: null, expiresAt: 0 },
  harga: { data: null, expiresAt: 0 },
};
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

// GET /api/stats/nasional — Public endpoint, statistik ringkasan nasional with pure mathematical aggregation
const getStatsNasional = async (req, res) => {
  try {
    const pulau = req.query.pulau || 'all';

    const [
      { count: totalUnit },
      { count: totalNasabah },
      { data: setoranData },
    ] = await Promise.all([
      supabase
        .from('unit_bank_sampah')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .eq('is_demo', false)
        .eq('status_verifikasi', 'terverifikasi'),
      supabase.from('nasabah').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('setoran').select('total_nilai, total_berat_kg').eq('status', 'diverifikasi'),
    ]);

    const hasActiveLiveTraffic = (totalNasabah || 0) > 20 && pulau === 'all';
    let resultData;

    if (hasActiveLiveTraffic) {
      const totalRupiah = (setoranData || []).reduce((acc, s) => acc + (s.total_nilai || 0), 0);
      const totalKg = (setoranData || []).reduce((acc, s) => acc + (s.total_berat_kg || 0), 0);
      resultData = {
        total_provinsi: 38,
        total_bsi: 38,
        total_bsu: Math.max(38, totalUnit || 0),
        total_nasabah: totalNasabah || 0,
        total_kg: totalKg,
        total_rupiah: totalRupiah,
        is_demo: false,
      };
    } else {
      // Agregasi Matematika Murni (SUM/AVG) dari 38 Provinsi
      const agregasi = getAgregasiNasional(pulau);
      resultData = {
        ...agregasi,
        is_demo: true,
      };
    }

    res.set('Cache-Control', 'public, max-age=60, s-maxage=300');
    return res.json({ success: true, data: resultData });
  } catch (err) {
    const agregasi = getAgregasiNasional(req.query.pulau || 'all');
    return res.json({ success: true, data: { ...agregasi, is_demo: true } });
  }
};

// GET /api/stats/provinsi — Statistik lengkap 38 provinsi di Indonesia
const getStatsProvinsi = async (req, res) => {
  try {
    const pulau = req.query.pulau;
    let list = DATA_38_PROVINSI;
    if (pulau && pulau !== 'all') {
      list = list.filter((p) => p.pulau.toLowerCase() === pulau.toLowerCase());
    }

    // Format response kredibel (memiliki properti bsu, kg, nasabah + detail BPS, lat/lng, unit percontohan)
    const formatted = list.map((p) => ({
      kode: p.kode_iso,
      kode_bps: p.kode_bps,
      nama: p.nama,
      pulau: p.pulau,
      ibukota: p.ibukota,
      lat: p.lat,
      lng: p.lng,
      populasi: p.populasi,
      target_reduksi_persen: p.target_reduksi_persen,
      bsu: p.bsu_aktif,
      kg: p.total_sampah_kg,
      ton: parseFloat((p.total_sampah_kg / 1000).toFixed(2)),
      nasabah: p.total_nasabah,
      partisipasi_persen: p.partisipasi_persen,
      unit_percontohan: p.unit_percontohan,
    }));

    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    return res.json({ success: true, total: formatted.length, data: formatted });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil data provinsi' });
  }
};

// GET /api/stats/harga — Harga sampah public (dari jenis_sampah) with caching
const getHargaSampah = async (_req, res) => {
  try {
    if (cache.harga.data && Date.now() < cache.harga.expiresAt) {
      res.set('Cache-Control', 'public, max-age=60, s-maxage=300');
      return res.json({ success: true, data: cache.harga.data, cached: true });
    }

    const { data, error } = await supabase
      .from('jenis_sampah')
      .select('kode, nama, satuan, harga_beli, harga_jual, kategori')
      .eq('is_active', true)
      .order('harga_beli', { ascending: false });

    if (error || !data?.length) {
      // Fallback ke data simulasi
      const fallback = [
        { kode: 'LG-TMB01', nama: 'Tembaga Super (Kabel Kupas)', satuan: 'kg', harga_beli: 85000, harga_jual: 95000, kategori: 'logam', trend: 'up' },
        { kode: 'LG-ALM01', nama: 'Aluminium Kaleng Minuman', satuan: 'kg', harga_beli: 14000, harga_jual: 18000, kategori: 'logam', trend: 'stable' },
        { kode: 'LG-ALM02', nama: 'Aluminium Profil / Tebal', satuan: 'kg', harga_beli: 16000, harga_jual: 21000, kategori: 'logam', trend: 'up' },
        { kode: 'LG-BSI01', nama: 'Besi Padu / Besi Bangunan', satuan: 'kg', harga_beli: 4500, harga_jual: 6000, kategori: 'logam', trend: 'down' },
        { kode: 'MNY-JLT01', nama: 'Minyak Jelantah Berkualitas', satuan: 'liter', harga_beli: 7000, harga_jual: 9000, kategori: 'lainnya', trend: 'up' },
        { kode: 'PLS-PET01', nama: 'Botol Plastik PET Bening', satuan: 'kg', harga_beli: 3500, harga_jual: 4800, kategori: 'anorganik', trend: 'stable' },
        { kode: 'PLS-HDP02', nama: 'Plastik HDPE / Emberan', satuan: 'kg', harga_beli: 2800, harga_jual: 4000, kategori: 'anorganik', trend: 'down' },
        { kode: 'KRT-KRD01', nama: 'Kardus Box Cokelat Tebal', satuan: 'kg', harga_beli: 1800, harga_jual: 2500, kategori: 'anorganik', trend: 'stable' },
        { kode: 'KRT-KRS01', nama: 'Kertas HVS / Koran', satuan: 'kg', harga_beli: 1200, harga_jual: 1800, kategori: 'anorganik', trend: 'stable' },
        { kode: 'KAC-BEN01', nama: 'Kaca / Botol Bening', satuan: 'kg', harga_beli: 400, harga_jual: 600, kategori: 'anorganik', trend: 'stable' },
      ];
      cache.harga = { data: fallback, expiresAt: Date.now() + CACHE_TTL_MS };
      res.set('Cache-Control', 'public, max-age=60, s-maxage=300');
      return res.json({ success: true, data: fallback });
    }

    cache.harga = { data, expiresAt: Date.now() + CACHE_TTL_MS };
    res.set('Cache-Control', 'public, max-age=60, s-maxage=300');
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil harga sampah' });
  }
};

// GET /api/stats/petugas — Dashboard petugas BSU
const getPetugasStats = async (req, res) => {
  try {
    let unitId = req.user?.profile?.unit_id;
    let unitNama = 'Bank Sampah Unit Pusat';

    if (unitId) {
      const { data: u } = await supabase.from('unit_bank_sampah').select('id, nama').eq('id', unitId).single();
      if (u) unitNama = u.nama;
    } else {
      const { data: firstUnit } = await supabase.from('unit_bank_sampah').select('id, nama').eq('is_active', true).limit(1).single();
      if (firstUnit) {
        unitId = firstUnit.id;
        unitNama = firstUnit.nama;
      }
    }

    const today = new Date().toISOString().split('T')[0];
    const [
      { count: totalNasabah },
      { count: setoranHariIni },
      { count: setoranPending },
      { data: nasabahList },
      { data: setoranToday },
    ] = await Promise.all([
      supabase.from('nasabah').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('setoran').select('*', { count: 'exact', head: true }).gte('tanggal_setoran', today),
      supabase.from('setoran').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('v_nasabah').select('id, nomor_nasabah, nama_lengkap, saldo, unit_id').eq('is_active', true).order('nama_lengkap').limit(100),
      supabase.from('v_setoran').select('*').gte('tanggal_setoran', today).order('created_at', { ascending: false }).limit(20),
    ]);

    return res.json({
      success: true,
      data: {
        unit_id: unitId,
        unit_nama: unitNama,
        total_nasabah: totalNasabah || 0,
        setoran_hari_ini: setoranHariIni || 0,
        setoran_pending: setoranPending || 0,
        nasabah_list: nasabahList || [],
        setoran_today: setoranToday || [],
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil data petugas' });
  }
};

// POST /api/stats/petugas/setoran — Input timbangan oleh petugas
const inputSetoranPetugas = async (req, res) => {
  try {
    const { nasabah_id, items, metode_pembayaran, catatan } = req.body;

    if (!nasabah_id || !items?.length) {
      return res.status(400).json({ success: false, message: 'nasabah_id dan items wajib diisi' });
    }

    // Validasi nasabah exist
    const { data: nasabah, error: nErr } = await supabase
      .from('v_nasabah').select('id, saldo, nama_lengkap, nomor_nasabah, unit_id').eq('id', nasabah_id).single();

    if (nErr || !nasabah) {
      return res.status(404).json({ success: false, message: 'Nasabah tidak ditemukan' });
    }

    // Hitung total
    let totalBerat = 0;
    let totalNilai = 0;
    for (const item of items) {
      const berat = parseFloat(item.berat_kg) || 0;
      const harga = parseFloat(item.harga_satuan) || 0;
      totalBerat += berat;
      totalNilai += berat * harga;
    }

    // Buat nomor setoran
    const nomorSetoran = `NOT-BELI-${Date.now().toString().slice(-6)}`;
    const today = new Date().toISOString().split('T')[0];

    // Simpan setoran (trigger update_saldo_nasabah akan otomatis mengupdate saldo)
    const { data: setoran, error: sErr } = await supabase.from('setoran').insert({
      nomor_setoran: nomorSetoran,
      nasabah_id,
      unit_id: nasabah.unit_id || null,
      petugas_id: req.user?.id || null,
      total_berat_kg: totalBerat,
      total_nilai: totalNilai,
      metode_pembayaran: metode_pembayaran || 'Saldo Tabungan',
      catatan: catatan || '',
      tanggal_setoran: today,
      status: 'diverifikasi',
      created_by: req.user?.id || null,
    }).select().single();

    if (sErr) throw sErr;

    // Simpan detail items tanpa subtotal (kolom subtotal GENERATED ALWAYS STORED)
    if (setoran) {
      await supabase.from('detail_setoran').insert(
        items.map((item) => ({
          setoran_id: setoran.id,
          jenis_sampah_id: item.jenis_sampah_id || null,
          nama_sampah: item.nama || item.nama_sampah || 'Sampah Daur Ulang',
          kode_sampah: item.kode || item.kode_sampah || 'SMP-01',
          berat_kg: parseFloat(item.berat_kg) || 0,
          harga_satuan: parseFloat(item.harga_satuan) || 0,
        }))
      );
    }

    const saldoBaru = (nasabah.saldo || 0) + totalNilai;

    return res.json({
      success: true,
      message: 'Setoran berhasil dicatat',
      data: {
        nomor_setoran: nomorSetoran,
        nasabah: nasabah.nama_lengkap,
        total_berat_kg: totalBerat,
        total_nilai: totalNilai,
        saldo_lama: nasabah.saldo || 0,
        saldo_baru: saldoBaru,
        setoran_id: setoran?.id,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal menyimpan setoran' });
  }
};

module.exports = { getStatsNasional, getStatsProvinsi, getHargaSampah, getPetugasStats, inputSetoranPetugas };
