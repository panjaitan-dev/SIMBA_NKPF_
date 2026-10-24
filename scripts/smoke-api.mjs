// scripts/smoke-api.mjs
// SIMBA / SIMBAH Smoke API Test
// Tests login for 4 roles and verifies all major endpoints against target URL.

const TARGET_URL = process.env.TARGET_URL || process.argv[2] || 'https://simba-nkpf.vercel.app/api';

const ROLES = [
  { role: 'admin', email: 'admin@simba.id', password: process.env.DEMO_PASSWORD || 'Password123!' },
  { role: 'admin_klh', email: 'admin.nasional@simba.id', password: process.env.DEMO_PASSWORD || 'Password123!' },
  { role: 'petugas', email: 'petugas.melati@simba.id', password: process.env.DEMO_PASSWORD || 'Password123!' },
  { role: 'nasabah', email: 'nasabah.dewi@simba.id', password: process.env.DEMO_PASSWORD || 'Password123!' },
];

const ENDPOINTS = [
  { path: '/health', method: 'GET', minRole: null },
  { path: '/stats/nasional', method: 'GET', minRole: null },
  { path: '/jenis-sampah', method: 'GET', minRole: null },
  { path: '/berita', method: 'GET', minRole: null },
  { path: '/edukasi', method: 'GET', minRole: null },
  { path: '/galeri', method: 'GET', minRole: null },
  { path: '/berita/admin/all', method: 'GET', minRole: 'admin' },
  { path: '/edukasi/admin/all', method: 'GET', minRole: 'admin' },
  { path: '/laporan?status=pending&limit=50', method: 'GET', minRole: 'admin' },
  { path: '/nasabah', method: 'GET', minRole: 'admin' },
  { path: '/setoran', method: 'GET', minRole: 'admin' },
  { path: '/penarikan', method: 'GET', minRole: 'admin' },
  { path: '/penjualan', method: 'GET', minRole: 'admin' },
  { path: '/klien', method: 'GET', minRole: 'admin' },
  { path: '/unit', method: 'GET', minRole: 'admin' },
  { path: '/dashboard/admin', method: 'GET', minRole: 'admin' },
  { path: '/dashboard/nasabah', method: 'GET', minRole: 'nasabah' },
];

async function run() {
  console.log(`\n======================================================`);
  console.log(`  SIMBA Smoke API Test`);
  console.log(`  Target: ${TARGET_URL}`);
  console.log(`  Timestamp: ${new Date().toISOString()}`);
  console.log(`======================================================\n`);

  const tokens = {};

  console.log(`--- [1/2] Pengujian Login 4 Peran ---`);
  for (const user of ROLES) {
    try {
      const res = await fetch(`${TARGET_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, password: user.password }),
      });
      const data = await res.json().catch(() => ({}));
      const ok = res.ok && (data.success || data.token);
      tokens[user.role] = data.token || null;
      console.log(`  [${user.role.toUpperCase()}] ${user.email} -> Status: ${res.status} ${ok ? '✓ OK' : '✗ FAIL'} ${data.message || ''}`);
    } catch (err) {
      console.log(`  [${user.role.toUpperCase()}] ${user.email} -> ERROR: ${err.message}`);
    }
  }

  console.log(`\n--- [2/2] Pengujian Endpoint Matriks (HTTP Status x Pesan) ---`);
  const results = [];

  for (const ep of ENDPOINTS) {
    // Determine which token to use
    let token = null;
    let tester = 'Anonymous';
    if (ep.minRole) {
      token = tokens[ep.minRole] || tokens['admin'];
      tester = ep.minRole;
    }

    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(`${TARGET_URL}${ep.path}`, {
        method: ep.method,
        headers,
        signal: controller.signal,
      });
      clearTimeout(timer);

      let text = '';
      let msg = '';
      try {
        const json = await res.json();
        msg = json.message || (Array.isArray(json.data) ? `Array(${json.data.length})` : typeof json.data) || 'OK';
      } catch {
        msg = `Non-JSON body`;
      }

      results.push({
        Endpoint: ep.path,
        Method: ep.method,
        Auth: tester,
        Status: res.status,
        Pesan: msg.slice(0, 40),
      });
    } catch (err) {
      results.push({
        Endpoint: ep.path,
        Method: ep.method,
        Auth: tester,
        Status: err.name === 'AbortError' ? 'TIMEOUT (10s)' : 'ERR',
        Pesan: err.message.slice(0, 40),
      });
    }
  }

  console.table(results);
}

run().catch(console.error);
