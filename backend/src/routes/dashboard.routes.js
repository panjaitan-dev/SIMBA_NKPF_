const router = require('express').Router();
const { getDashboardStats, getNasabahStats, getUnitStats } = require('../controllers/dashboard.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/admin', requireRole('admin'), getDashboardStats);
router.get('/nasabah', requireRole('nasabah'), getNasabahStats);
router.get('/unit/:unit_id', requireRole(['admin', 'petugas']), getUnitStats);

module.exports = router;
