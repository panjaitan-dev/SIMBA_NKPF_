const router = require('express').Router();
const { getAllPenarikan, getMyPenarikan, createPenarikan, updateStatusPenarikan, deletePenarikan } = require('../controllers/penarikan.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const { validate, createPenarikanSchema } = require('../middleware/validate.middleware');

router.use(authMiddleware);

router.get('/', requireRole(['admin', 'petugas']), getAllPenarikan);
router.get('/my', getMyPenarikan);
router.post('/', requireRole('nasabah'), validate(createPenarikanSchema), createPenarikan);
router.put('/:id/status', requireRole(['admin', 'petugas']), updateStatusPenarikan);
router.delete('/:id', requireRole(['admin', 'petugas', 'nasabah']), deletePenarikan);

module.exports = router;
