const router = require('express').Router();
const { getAllEdukasi, getEdukasiBySlug, createEdukasi, updateEdukasi, deleteEdukasi, getAllEdukasiAdmin } = require('../controllers/edukasi.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const { validate, createEdukasiSchema } = require('../middleware/validate.middleware');

router.get('/', getAllEdukasi);
router.get('/admin/all', authMiddleware, requireRole('admin'), getAllEdukasiAdmin);
router.get('/slug/:slug', getEdukasiBySlug);

router.post('/', authMiddleware, requireRole('admin'), upload.single('thumbnail'), validate(createEdukasiSchema), createEdukasi);
router.put('/:id', authMiddleware, requireRole('admin'), upload.single('thumbnail'), validate(createEdukasiSchema.partial()), updateEdukasi);
router.delete('/:id', authMiddleware, requireRole('admin'), deleteEdukasi);

module.exports = router;
