const { createClient } = require('@supabase/supabase-js');
const { verifyLocalToken, getDemoAccountByEmail } = require('../lib/auth-utils');

/**
 * Middleware: Verifikasi JWT dari Supabase Auth atau Local Proxy Token
 * Tambahkan header: Authorization: Bearer <access_token>
 */
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token autentikasi diperlukan' });
  }

  const token = authHeader.split(' ')[1];

  // 1. Verifikasi local signed token (cepat, andal, tanpa ketergantungan jaringan eksternal)
  const localPayload = verifyLocalToken(token);
  if (localPayload) {
    const demo = getDemoAccountByEmail(localPayload.email);
    req.user = {
      id: localPayload.id,
      email: localPayload.email,
      role: localPayload.role,
      profile: demo?.profile || {
        id: localPayload.id,
        role: localPayload.role,
        nama_lengkap: localPayload.nama_lengkap || localPayload.email,
      },
    };
    return next();
  }

  // 2. Verifikasi Supabase token
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ success: false, message: 'Token tidak valid atau sudah kedaluwarsa' });
    }

    // Ambil profil user untuk mendapatkan role
    const supabaseAdmin = require('../lib/supabase');
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    req.user = { ...user, role: profile?.role || 'nasabah', profile };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Autentikasi gagal' });
  }
};

/**
 * Middleware: Cek role (opsional, digunakan bersama authMiddleware)
 * Contoh: requireRole('admin') atau requireRole(['admin', 'petugas'])
 */
const requireRole = (...roles) => {
  const allowedRoles = roles.flat();

  return (req, res, next) => {
    const userRole = req.user?.profile?.role || req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Akses ditolak. Diperlukan role: ${allowedRoles.join(' atau ')}`
      });
    }

    next();
  };
};

module.exports = { authMiddleware, requireRole };
