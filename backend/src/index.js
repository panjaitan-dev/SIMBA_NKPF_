require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const compression = require('compression');

const authRoutes = require('./routes/auth.routes');
const nasabahRoutes = require('./routes/nasabah.routes');
const setoranRoutes = require('./routes/setoran.routes');
const penarikanRoutes = require('./routes/penarikan.routes');
const jenisSampahRoutes = require('./routes/jenisSampah.routes');
const beritaRoutes = require('./routes/berita.routes');
const edukasiRoutes = require('./routes/edukasi.routes');
const galeriRoutes = require('./routes/galeri.routes');
const pengumumanRoutes = require('./routes/pengumuman.routes');
const laporanRoutes = require('./routes/laporan.routes');
const unitRoutes = require('./routes/unit.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const klienRoutes = require('./routes/klien.routes');
const penjualanRoutes = require('./routes/penjualan.routes');
const statsRoutes = require('./routes/stats.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Performance middleware
app.use(helmet());
app.use(compression());

// CORS
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',').map((s) => s.trim());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 200,
  message: { success: false, message: 'Terlalu banyak permintaan, coba lagi nanti.' },
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'SIMBA API Server berjalan dengan baik',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/nasabah', nasabahRoutes);
app.use('/api/setoran', setoranRoutes);
app.use('/api/penarikan', penarikanRoutes);
app.use('/api/jenis-sampah', jenisSampahRoutes);
app.use('/api/berita', beritaRoutes);
app.use('/api/edukasi', edukasiRoutes);
app.use('/api/galeri', galeriRoutes);
app.use('/api/pengumuman', pengumumanRoutes);
app.use('/api/laporan', laporanRoutes);
app.use('/api/unit', unitRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/klien', klienRoutes);
app.use('/api/penjualan', penjualanRoutes);
app.use('/api/stats', statsRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

// Global error handler (Production Safe — no stack trace leak)
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('[SIMBA Server Error]', err.stack || err.message);
  }
  const isProd = process.env.NODE_ENV === 'production';
  const statusCode = err.status || err.statusCode || 500;
  const clientMessage = isProd && statusCode === 500
    ? 'Terjadi kesalahan internal pada sistem. Silakan coba beberapa saat lagi.'
    : (err.message || 'Terjadi kesalahan pada server');

  res.status(statusCode).json({
    success: false,
    message: clientMessage,
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 SIMBA API Server berjalan di port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
