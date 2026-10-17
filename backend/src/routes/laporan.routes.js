const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const {
  getAllLaporan,
  getLaporanById,
  getLaporanByTiket,
  createLaporan,
  updateStatusLaporan,
  deleteLaporan,
} = require('../controllers/laporan.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const { validate, createLaporanSchema } = require('../middleware/validate.middleware');

// Anti-Spam Rate Limiters
const laporPostLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10, // Maks 10 laporan per 15 menit per IP
  message: {
    success: false,
    message: 'Terlalu banyak aduan dikirim dari perangkat ini. Harap tunggu 15 menit sebelum mencoba kembali.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const lacakLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 menit
  max: 30, // Maks 30 pelacakan per 5 menit per IP
  message: {
    success: false,
    message: 'Terlalu banyak permintaan pelacakan status tiket. Harap tunggu beberapa saat.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public — Lacak status tiket aduan
router.get('/lacak/:kode', lacakLimiter, getLaporanByTiket);

// Public — Siapa saja bisa lapor (dilindungi rate limit, validasi Zod, magic bytes & batas ukuran)
router.post(
  '/',
  laporPostLimiter,
  upload.array('fotos', 5),
  upload.verifyMagicBytesAndLimits,
  validate(createLaporanSchema),
  (req, res, next) => {
    // Coba attach user jika ada token, tapi tidak wajib
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) {
      const { authMiddleware: mw } = require('../middleware/auth.middleware');
      return mw(req, res, next);
    }
    next();
  },
  createLaporan
);

// Protected (Admin & Petugas)
router.get('/', authMiddleware, requireRole(['admin', 'petugas']), getAllLaporan);
router.get('/:id', authMiddleware, requireRole(['admin', 'petugas']), getLaporanById);
router.put('/:id/status', authMiddleware, requireRole(['admin', 'petugas']), updateStatusLaporan);
router.delete('/:id', authMiddleware, requireRole(['admin', 'petugas']), deleteLaporan);

module.exports = router;
