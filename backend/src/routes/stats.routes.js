const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const {
  getStatsNasional,
  getStatsProvinsi,
  getHargaSampah,
  getPetugasStats,
  inputSetoranPetugas,
} = require('../controllers/stats.controller');

// Public endpoints (no auth required)
router.get('/nasional', getStatsNasional);
router.get('/provinsi', getStatsProvinsi);
router.get('/harga', getHargaSampah);

// Petugas endpoints
router.get('/petugas', authMiddleware, requireRole('petugas', 'admin', 'admin_klh'), getPetugasStats);
router.post('/petugas/setoran', authMiddleware, requireRole('petugas', 'admin'), inputSetoranPetugas);

module.exports = router;
