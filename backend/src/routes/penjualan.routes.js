const express = require('express');
const router = express.Router();
const { getAllPenjualan, createPenjualan, getPenjualanById, updatePenjualan, deletePenjualan } = require('../controllers/penjualan.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const { validate, createPenjualanSchema } = require('../middleware/validate.middleware');

router.get('/', authMiddleware, requireRole('admin', 'petugas'), getAllPenjualan);
router.get('/:id', authMiddleware, requireRole('admin', 'petugas'), getPenjualanById);
router.post('/', authMiddleware, requireRole('admin', 'petugas'), validate(createPenjualanSchema), createPenjualan);
router.put('/:id', authMiddleware, requireRole('admin', 'petugas'), validate(createPenjualanSchema.partial()), updatePenjualan);
router.delete('/:id', authMiddleware, requireRole('admin', 'petugas'), deletePenjualan);

module.exports = router;
