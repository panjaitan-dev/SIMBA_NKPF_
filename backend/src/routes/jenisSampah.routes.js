const router = require('express').Router();
const { getAllJenisSampah, createJenisSampah, updateJenisSampah, deleteJenisSampah } = require('../controllers/jenisSampah.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

// Public
router.get('/', getAllJenisSampah);

// Admin only
router.post('/', authMiddleware, requireRole('admin'), createJenisSampah);
router.put('/:id', authMiddleware, requireRole('admin'), updateJenisSampah);
router.delete('/:id', authMiddleware, requireRole('admin'), deleteJenisSampah);

module.exports = router;
