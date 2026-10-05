const router = require('express').Router();
const { getAllLaporan, getLaporanById, createLaporan, updateStatusLaporan } = require('../controllers/laporan.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Public — siapa saja bisa lapor (token opsional untuk attach ke akun)
router.post('/', upload.array('fotos', 5), (req, res, next) => {
  // Coba attach user jika ada token, tapi tidak wajib
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    const { authMiddleware: mw } = require('../middleware/auth.middleware');
    return mw(req, res, next);
  }
  next();
}, createLaporan);

// Protected
router.get('/', authMiddleware, requireRole(['admin', 'petugas']), getAllLaporan);
router.get('/:id', authMiddleware, requireRole(['admin', 'petugas']), getLaporanById);
router.put('/:id/status', authMiddleware, requireRole(['admin', 'petugas']), updateStatusLaporan);

module.exports = router;
