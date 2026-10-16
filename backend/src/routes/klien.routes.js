const express = require('express');
const router = express.Router();
const { getAllKlien, createKlien, updateKlien, deleteKlien } = require('../controllers/klien.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const { validate, createKlienSchema } = require('../middleware/validate.middleware');

router.get('/', getAllKlien);
router.post('/', authMiddleware, requireRole('admin', 'petugas'), validate(createKlienSchema), createKlien);
router.put('/:id', authMiddleware, requireRole('admin', 'petugas'), validate(createKlienSchema), updateKlien);
router.delete('/:id', authMiddleware, requireRole('admin'), deleteKlien);

module.exports = router;
