const router = require('express').Router();
const { getAllSetoran, getMySetoran, getSetoranById, createSetoran, updateStatusSetoran, deleteSetoran } = require('../controllers/setoran.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const { validate, createSetoranSchema } = require('../middleware/validate.middleware');

router.use(authMiddleware);

router.get('/', requireRole(['admin', 'petugas']), getAllSetoran);
router.get('/my', getMySetoran);
router.get('/:id', getSetoranById);
router.post('/', requireRole(['admin', 'petugas']), validate(createSetoranSchema), createSetoran);
router.put('/:id/status', requireRole(['admin', 'petugas']), updateStatusSetoran);
router.delete('/:id', requireRole(['admin', 'petugas']), deleteSetoran);

module.exports = router;
