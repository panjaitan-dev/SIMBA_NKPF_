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

// CORS (Support localhost, Vercel production & preview deployments)
const rawCors = process.env.CORS_ORIGIN || 'http://localhost:3000';
const configuredOrigins = rawCors.split(',').map((s) => s.trim().replace(/\/$/, ''));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (configuredOrigins.includes(origin)) return callback(null, true);
    // Allow localhost & 127.0.0.1 on any port
    if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return callback(null, true);
    if (/^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) return callback(null, true);
    // Allow all Vercel deployments (production & preview)
    if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return callback(null, true);
    return callback(null, false);
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

// Health check — Memeriksa koneksi database nyata dengan timeout
app.get('/api/health', async (req, res) => {
  const start = Date.now();
  let dbStatus = 'disconnected';
  let dbLatencyMs = null;
  let dbDetails = null;

  try {
    const supabase = require('./lib/supabase');
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('DB healthcheck timeout (3000ms)')), 3000)
    );
    const dbPromise = supabase.from('unit_bank_sampah').select('id').limit(1);
    const { error } = await Promise.race([dbPromise, timeoutPromise]);

    if (!error) {
      dbStatus = 'connected';
      dbLatencyMs = Date.now() - start;
      dbDetails = 'Database PostgreSQL aktif dan merespons';
    } else {
      dbStatus = 'error';
      dbDetails = error.message;
    }
  } catch (err) {
    dbStatus = 'unreachable';
    dbDetails = err.message || 'Gagal terhubung ke database Supabase';
  }

  const isHealthy = dbStatus === 'connected';
  const responseData = {
    success: isHealthy,
    status: isHealthy ? 'healthy' : 'degraded',
    message: isHealthy
      ? 'SIMBA API Server dan database berjalan dengan baik'
      : 'SIMBA API Server berjalan, namun koneksi database mengalami kendala',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: {
      status: dbStatus,
      latency_ms: dbLatencyMs,
      details: dbDetails,
      provider: 'Supabase PostgreSQL',
    },
    keep_alive_info: {
      note: 'Untuk menjaga backend (Render/Railway) dan Supabase free tier tetap aktif tanpa tertidur (cold start), jalankan HTTP ping berkala setiap 5-10 menit.',
      cron_example: '*/10 * * * * curl -s https://your-backend.onrender.com/api/health > /dev/null',
      interval_recommended: '5-10 menit',
    },
  };

  res.status(isHealthy ? 200 : 503).json(responseData);
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
