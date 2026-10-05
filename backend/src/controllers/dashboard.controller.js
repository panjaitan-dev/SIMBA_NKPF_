const supabase = require('../lib/supabase');

// GET /api/dashboard/stats (admin)
const getDashboardStats = async (req, res) => {
  try {
    const [
      { count: totalNasabah },
      { count: totalSetoran },
      { count: laporanPending },
      { count: penarikanPending },
      { data: setoranStats },
      { data: recentSetoran },
    ] = await Promise.all([
      supabase.from('nasabah').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('setoran').select('*', { count: 'exact', head: true }).eq('status', 'diverifikasi'),
      supabase.from('laporan_lingkungan').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('penarikan').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('setoran').select('total_nilai').eq('status', 'diverifikasi'),
      supabase.from('v_setoran').select('*').order('created_at', { ascending: false }).limit(5),
    ]);

    const totalNilaiSetoran = (setoranStats || []).reduce((acc, s) => acc + (s.total_nilai || 0), 0);

    return res.json({
      success: true,
      data: {
        total_nasabah: totalNasabah || 0,
        total_setoran_diverifikasi: totalSetoran || 0,
        laporan_pending: laporanPending || 0,
        penarikan_pending: penarikanPending || 0,
        total_nilai_setoran: totalNilaiSetoran,
        recent_setoran: recentSetoran || [],
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil statistik' });
  }
};

// GET /api/dashboard/nasabah-stats (nasabah sendiri)
const getNasabahStats = async (req, res) => {
  try {
    const { data: nasabah, error } = await supabase
      .from('nasabah')
      .select('id, saldo, total_setoran_kg, nomor_nasabah, joined_at')
      .eq('profile_id', req.user.id).single();

    if (error || !nasabah) return res.status(404).json({ success: false, message: 'Data nasabah tidak ditemukan' });

    const [{ count: totalSetoran }, { count: totalPenarikan }, { data: lastSetoran }] = await Promise.all([
      supabase.from('setoran').select('*', { count: 'exact', head: true }).eq('nasabah_id', nasabah.id).eq('status', 'diverifikasi'),
      supabase.from('penarikan').select('*', { count: 'exact', head: true }).eq('nasabah_id', nasabah.id).eq('status', 'dibayar'),
      supabase.from('v_setoran').select('*').eq('nasabah_id', nasabah.id).order('created_at', { ascending: false }).limit(5),
    ]);

    return res.json({
      success: true,
      data: {
        ...nasabah,
        total_setoran_count: totalSetoran || 0,
        total_penarikan_count: totalPenarikan || 0,
        last_setoran: lastSetoran || [],
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil statistik nasabah' });
  }
};

// GET /api/dashboard/unit/:unit_id (petugas)
const getUnitStats = async (req, res) => {
  try {
    const { unit_id } = req.params;
    const [
      { count: totalNasabah },
      { count: setoranPending },
      { data: recentSetoran },
    ] = await Promise.all([
      supabase.from('nasabah').select('*', { count: 'exact', head: true }).eq('unit_id', unit_id).eq('is_active', true),
      supabase.from('setoran').select('*', { count: 'exact', head: true }).eq('unit_id', unit_id).eq('status', 'pending'),
      supabase.from('v_setoran').select('*').eq('unit_id', unit_id).order('created_at', { ascending: false }).limit(10),
    ]);

    return res.json({
      success: true,
      data: { total_nasabah: totalNasabah || 0, setoran_pending: setoranPending || 0, recent_setoran: recentSetoran || [] },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil statistik unit' });
  }
};

module.exports = { getDashboardStats, getNasabahStats, getUnitStats };
