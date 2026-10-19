const router = require('express').Router();
const { getAllBerita, getBeritaBySlug, getAllBeritaAdmin, createBerita, updateBerita, deleteBerita } = require('../controllers/berita.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const { validate, createBeritaSchema } = require('../middleware/validate.middleware');

// Public
router.get('/', getAllBerita);
router.get('/slug/:slug', getBeritaBySlug);

// Admin
router.get('/admin/all', authMiddleware, requireRole('admin'), getAllBeritaAdmin);
router.post('/', authMiddleware, requireRole('admin'), upload.single('thumbnail'), validate(createBeritaSchema), createBerita);
router.put('/:id', authMiddleware, requireRole('admin'), upload.single('thumbnail'), validate(createBeritaSchema.partial()), updateBerita);
router.delete('/:id', authMiddleware, requireRole('admin'), deleteBerita);

module.exports = router;
