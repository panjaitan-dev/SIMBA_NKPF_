const router = require('express').Router();
const { getAllPengumuman, getAllPengumumanAdmin, createPengumuman, updatePengumuman, deletePengumuman } = require('../controllers/pengumuman.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

router.get('/', getAllPengumuman);
router.get('/admin/all', authMiddleware, requireRole('admin'), getAllPengumumanAdmin);
router.post('/', authMiddleware, requireRole('admin'), createPengumuman);
router.put('/:id', authMiddleware, requireRole('admin'), updatePengumuman);
router.delete('/:id', authMiddleware, requireRole('admin'), deletePengumuman);

module.exports = router;
