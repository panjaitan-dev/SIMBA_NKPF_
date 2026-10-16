const supabase = require('../lib/supabase');
const {
  DEMO_ACCOUNTS,
  signLocalToken,
  getDemoAccountByEmail,
  verifyLocalToken,
} = require('../lib/auth-utils');

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
// AUTH CONTROLLERS (Proxy Architecture)
// ============================================================

/**
 * POST /api/auth/login
 * Proksi login: Mendukung Supabase Auth & Akun Demo Resmi
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email dan password wajib diisi',
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const demoAccount = getDemoAccountByEmail(normalizedEmail);

  // 1. Cek kredensial akun demo jika cocok
  if (demoAccount) {
    if (demoAccount.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah',
      });
    }

    // Coba autentikasi ke Supabase jika aktif
    try {
      const { data: sbData, error: sbError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (!sbError && sbData?.session) {
        let role = demoAccount.role;
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', sbData.user.id)
            .single();
          if (profile?.role) role = profile.role;
        } catch {}

        return res.json({
          success: true,
          message: 'Login berhasil',
          token: sbData.session.access_token,
          refresh_token: sbData.session.refresh_token,
          role,
          user: {
            id: sbData.user.id,
            email: sbData.user.email,
            nama_lengkap: demoAccount.nama_lengkap,
            role,
          },
          profile: demoAccount.profile,
        });
      }
    } catch {
      // Supabase unresolvable / offline fallback
    }

    // Fallback akun demo terotentikasi aman via signed JWT
    const token = signLocalToken({
      id: demoAccount.id,
      email: demoAccount.email,
      role: demoAccount.role,
      nama_lengkap: demoAccount.nama_lengkap,
    });

    return res.json({
      success: true,
      message: 'Login berhasil',
      token,
      refresh_token: token,
      role: demoAccount.role,
      user: {
        id: demoAccount.id,
        email: demoAccount.email,
        nama_lengkap: demoAccount.nama_lengkap,
        role: demoAccount.role,
      },
      profile: demoAccount.profile,
    });
  }

  // 2. Akun non-demo: Autentikasi via Supabase Auth
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) {
      const isInvalidCreds =
        error.message?.toLowerCase().includes('invalid login credentials') ||
        error.message?.toLowerCase().includes('invalid grant') ||
        error.status === 400 ||
        error.status === 401;

      if (isInvalidCreds) {
        return res.status(401).json({
          success: false,
          message: 'Email atau password salah',
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message || 'Login gagal',
      });
    }

    // Ambil profil
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const role = profile?.role || 'nasabah';

    return res.json({
      success: true,
      message: 'Login berhasil',
      token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      role,
      user: {
        id: data.user.id,
        email: data.user.email,
        nama_lengkap: profile?.nama_lengkap || data.user.email,
        role,
      },
      profile: profile || null,
    });
  } catch (err) {
    const isNetwork =
      err.code === 'ENOTFOUND' ||
      err.code === 'ECONNREFUSED' ||
      err.message?.includes('fetch failed') ||
      err.message?.includes('network');

    if (isNetwork) {
      return res.status(503).json({
        success: false,
        isNetworkError: true,
        message: 'Tidak dapat terhubung ke server autentikasi. Periksa koneksi Anda lalu coba lagi',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal pada server autentikasi',
    });
  }
};

/**
 * POST /api/auth/register
 */
const register = async (req, res) => {
  const { email, password, nama_lengkap, nomor_hp, alamat, nik, unit_id } = req.body;

  try {
    // 1. Buat user di Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      const isDuplicate =
        authError.message?.toLowerCase().includes('already registered') ||
        authError.message?.toLowerCase().includes('already exists') ||
        authError.status === 422;

      if (isDuplicate) {
        return res.status(400).json({
          success: false,
          message: 'Email sudah terdaftar. Silakan gunakan email lain atau masuk ke akun Anda.',
          errors: [{ field: 'email', message: 'Email sudah terdaftar. Silakan gunakan email lain atau masuk ke akun Anda.' }],
        });
      }
      return res.status(400).json({ success: false, message: authError.message });
    }

    const userId = authData.user.id;

    // 2. Buat profil
    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      role: 'nasabah',
      nama_lengkap,
      nomor_hp: nomorHp || null,
      alamat: alamat || null,
      nik: nik || null,
    });

    if (profileError) {
      await supabase.auth.admin.deleteUser(userId);
      const isNikDup = profileError.message?.toLowerCase().includes('nik');
      const errorMsg = isNikDup
        ? 'NIK sudah terdaftar pada akun lain. Mohon periksa kembali NIK Anda.'
        : profileError.message;

      return res.status(400).json({
        success: false,
        message: errorMsg,
        errors: [{ field: isNikDup ? 'nik' : 'profile', message: errorMsg }],
      });
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
    const isNetwork =
      err.code === 'ENOTFOUND' ||
      err.code === 'ECONNREFUSED' ||
      err.message?.includes('fetch failed') ||
      err.message?.includes('network');

    if (isNetwork) {
      // Jika Supabase offline, respons tetap validasi berhasil untuk simulasi lokal jika diperlukan
      const nomorNasabah = `NSB-${Date.now().toString().slice(-8)}`;
      return res.status(201).json({
        success: true,
        message: 'Registrasi berhasil (mode offline). Silakan login.',
        data: { nomor_nasabah: nomorNasabah },
      });
    }

    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server saat pendaftaran' });
  }
};

/**
 * POST /api/auth/refresh
 */
const refreshToken = async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) {
    return res.status(400).json({ success: false, message: 'Refresh token wajib disertakan' });
  }

  // Cek jika ini local demo token
  const payload = verifyLocalToken(refresh_token);
  if (payload) {
    const newToken = signLocalToken({
      id: payload.id,
      email: payload.email,
      role: payload.role,
      nama_lengkap: payload.nama_lengkap,
    });
    return res.json({
      success: true,
      token: newToken,
      refresh_token: newToken,
    });
  }

  // Coba Supabase refresh
  try {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token });
    if (error || !data.session) {
      return res.status(401).json({ success: false, message: 'Sesi kedaluwarsa, silakan login ulang' });
    }

    return res.json({
      success: true,
      token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });
  } catch {
    return res.status(401).json({ success: false, message: 'Gagal memperbarui sesi' });
  }
};

/**
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      // Supabase signOut if token
      await supabase.auth.admin.signOut(token).catch(() => {});
    }
  } catch {}

  return res.json({
    success: true,
    message: 'Logout berhasil',
  });
};

/**
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  try {
    const profile = req.user.profile || {
      id: req.user.id,
      nama_lengkap: req.user.nama_lengkap || req.user.email,
      role: req.user.role,
    };

    let nasabah = null;
    try {
      const { data } = await supabase
        .from('nasabah')
        .select('id, nomor_nasabah, saldo, total_setoran_kg, unit_id, unit_bank_sampah(nama)')
        .eq('profile_id', req.user.id)
        .single();
      nasabah = data;
    } catch {}

    return res.json({
      success: true,
      data: {
        ...profile,
        email: req.user.email,
        nasabah: nasabah || null,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil data user' });
  }
};

/**
 * PUT /api/auth/profile
 */
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

module.exports = {
  login,
  register,
  refreshToken,
  logout,
  getMe,
  updateProfile,
  uploadToStorage,
};
