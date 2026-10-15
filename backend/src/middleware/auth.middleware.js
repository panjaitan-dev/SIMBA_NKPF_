const { createClient } = require('@supabase/supabase-js');

/**
 * Middleware: Verifikasi JWT dari Supabase Auth
 * Tambahkan header: Authorization: Bearer <access_token>
 */
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token autentikasi diperlukan' });
  }

  const token = authHeader.split(' ')[1];

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

    req.user = { ...user, profile };
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
