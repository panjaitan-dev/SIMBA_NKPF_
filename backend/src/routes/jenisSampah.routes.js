const router = require('express').Router();
const { getAllJenisSampah, createJenisSampah, updateJenisSampah, deleteJenisSampah } = require('../controllers/jenisSampah.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const { validate, createJenisSampahSchema } = require('../middleware/validate.middleware');

// Public
router.get('/', getAllJenisSampah);

// Admin only
router.post('/', authMiddleware, requireRole('admin'), validate(createJenisSampahSchema), createJenisSampah);
router.put('/:id', authMiddleware, requireRole('admin'), validate(createJenisSampahSchema.partial()), updateJenisSampah);
router.delete('/:id', authMiddleware, requireRole('admin'), deleteJenisSampah);

module.exports = router;
