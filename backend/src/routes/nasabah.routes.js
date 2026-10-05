const router = require('express').Router();
const { getAllNasabah, getNasabahById, getMyNasabah, updateNasabah, getRiwayatNasabah } = require('../controllers/nasabah.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/', requireRole(['admin', 'petugas']), getAllNasabah);
router.get('/me', getMyNasabah);
router.get('/:id', requireRole(['admin', 'petugas']), getNasabahById);
router.get('/:id/riwayat', requireRole(['admin', 'petugas']), getRiwayatNasabah);
router.put('/:id', requireRole('admin'), updateNasabah);

module.exports = router;
