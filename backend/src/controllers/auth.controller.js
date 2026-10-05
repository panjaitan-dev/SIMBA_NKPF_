const supabase = require('../lib/supabase');

/**
 * Utility: Upload file ke Supabase Storage
 */
const uploadToStorage = async (file, bucket, folder = '') => {
  const ext = file.originalname.split('.').pop();
  const filename = `${folder ? folder + '/' : ''}${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filename, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filename);

  return publicUrl;
};

// ============================================================
// AUTH CONTROLLERS
// ============================================================

const register = async (req, res) => {
  const { email, password, nama_lengkap, nomor_hp, alamat, nik, unit_id } = req.body;

  if (!email || !password || !nama_lengkap) {
    return res.status(400).json({ success: false, message: 'Email, password, dan nama lengkap wajib diisi' });
  }

  try {
    // 1. Buat user di Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      return res.status(400).json({ success: false, message: authError.message });
    }

    const userId = authData.user.id;

    // 2. Buat profil
    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      role: 'nasabah',
      nama_lengkap,
      nomor_hp,
      alamat,
      nik,
    });

    if (profileError) {
      await supabase.auth.admin.deleteUser(userId);
      return res.status(400).json({ success: false, message: profileError.message });
    }

    // 3. Buat data nasabah
    const nomorNasabah = `NSB-${Date.now().toString().slice(-8)}`;
    const { error: nasabahError } = await supabase.from('nasabah').insert({
      profile_id: userId,
      unit_id: unit_id || null,
      nomor_nasabah: nomorNasabah,
    });

    if (nasabahError) {
      console.error('Error membuat nasabah:', nasabahError);
    }

    return res.status(201).json({
      success: true,
      message: 'Registrasi berhasil. Silakan login.',
      data: { nomor_nasabah: nomorNasabah },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};

const getMe = async (req, res) => {
  try {
    const { data: nasabah } = await supabase
      .from('nasabah')
      .select('id, nomor_nasabah, saldo, total_setoran_kg, unit_id, unit_bank_sampah(nama)')
      .eq('profile_id', req.user.id)
      .single();

    return res.json({
      success: true,
      data: {
        ...req.user.profile,
        email: req.user.email,
        nasabah: nasabah || null,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil data user' });
  }
};

const updateProfile = async (req, res) => {
  const { nama_lengkap, nomor_hp, alamat } = req.body;

  try {
    let avatar_url = null;
    if (req.file) {
      avatar_url = await uploadToStorage(req.file, 'avatars', req.user.id);
    }

    const updateData = { nama_lengkap, nomor_hp, alamat };
    if (avatar_url) updateData.avatar_url = avatar_url;

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', req.user.id);

    if (error) return res.status(400).json({ success: false, message: error.message });

    return res.json({ success: true, message: 'Profil berhasil diperbarui' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal memperbarui profil' });
  }
};

module.exports = { register, getMe, updateProfile, uploadToStorage };
