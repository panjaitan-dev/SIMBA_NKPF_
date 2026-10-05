const router = require('express').Router();
const { getAllPenarikan, getMyPenarikan, createPenarikan, updateStatusPenarikan } = require('../controllers/penarikan.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/', requireRole(['admin', 'petugas']), getAllPenarikan);
router.get('/my', getMyPenarikan);
router.post('/', requireRole('nasabah'), createPenarikan);
router.put('/:id/status', requireRole(['admin', 'petugas']), updateStatusPenarikan);

module.exports = router;
