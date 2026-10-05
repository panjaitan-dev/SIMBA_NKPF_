const router = require('express').Router();
const { getAllSetoran, getMySetoran, getSetoranById, createSetoran, updateStatusSetoran } = require('../controllers/setoran.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/', requireRole(['admin', 'petugas']), getAllSetoran);
router.get('/my', getMySetoran);
router.get('/:id', getSetoranById);
router.post('/', requireRole(['admin', 'petugas']), createSetoran);
router.put('/:id/status', requireRole(['admin', 'petugas']), updateStatusSetoran);

module.exports = router;
