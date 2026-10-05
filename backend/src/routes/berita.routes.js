const router = require('express').Router();
const { getAllBerita, getBeritaBySlug, getAllBeritaAdmin, createBerita, updateBerita, deleteBerita } = require('../controllers/berita.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Public
router.get('/', getAllBerita);
router.get('/slug/:slug', getBeritaBySlug);

// Admin
router.get('/admin/all', authMiddleware, requireRole('admin'), getAllBeritaAdmin);
router.post('/', authMiddleware, requireRole('admin'), upload.single('thumbnail'), createBerita);
router.put('/:id', authMiddleware, requireRole('admin'), upload.single('thumbnail'), updateBerita);
router.delete('/:id', authMiddleware, requireRole('admin'), deleteBerita);

module.exports = router;
