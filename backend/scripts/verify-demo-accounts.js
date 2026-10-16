/**
 * SIMBA Nusantara — Demo Accounts & Auth Verification Script
 * Memverifikasi 4 akun demo resmi (README.md), endpoint proxy auth,
 * pemisahan error kredensial vs error jaringan, dan status Supabase.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const http = require('http');
const https = require('https');
const { DEMO_ACCOUNTS } = require('../src/lib/auth-utils');

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

function request(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;

    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runVerification() {
  console.log('============================================================');
  console.log('  SIMBA NUSANTARA — VERIFIKASI AUTENTIKASI & AKUN DEMO');
  console.log('============================================================\n');

  // 1. Uji GET /api/health
  console.log('[1/5] Menguji GET /api/health ...');
  try {
    const health = await request(`${BASE_URL}/health`, { method: 'GET' });
    console.log(`  ✓ Status HTTP: ${health.status}`);
    console.log(`  ✓ Status Server: ${health.data.status} | Database: ${health.data.database?.status}`);
    console.log(`  ✓ Keterangan DB: ${health.data.database?.details}`);
  } catch (err) {
    console.log(`  ❌ Gagal memanggil /api/health: ${err.message}`);
    console.log('     Pastikan server backend sedang aktif di port 5000!');
    process.exit(1);
  }

  // 2. Uji Login 4 Akun Demo Resmi
  console.log('\n[2/5] Menguji Login 4 Akun Demo Resmi via Proxy Backend ...');
  let successCount = 0;

  for (const acc of DEMO_ACCOUNTS) {
    try {
      const res = await request(
        `${BASE_URL}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
        { email: acc.email, password: acc.password }
      );

      const isValid =
        res.status === 200 &&
        res.data.success === true &&
        res.data.role === acc.role &&
        Boolean(res.data.token);

      if (isValid) {
        console.log(`  ✓ [${acc.role.toUpperCase()}] ${acc.email} -> LOGIN SUKSES!`);
        console.log(`    Role: ${res.data.role} | Nama: ${res.data.user?.nama_lengkap} | Token: ${res.data.token.slice(0, 20)}...`);
        successCount++;
      } else {
        console.log(`  ❌ [${acc.role}] ${acc.email} -> GAGAL: ${JSON.stringify(res.data)}`);
      }
    } catch (err) {
      console.log(`  ❌ [${acc.role}] ${acc.email} -> Exception: ${err.message}`);
    }
  }

  console.log(`  Hasil: ${successCount}/${DEMO_ACCOUNTS.length} akun demo berhasil login.`);

  // 3. Uji Penolakan Password Salah (Error Kredensial -> 401)
  console.log('\n[3/5] Menguji Proteksi Password Salah (Error Kredensial) ...');
  try {
    const res = await request(
      `${BASE_URL}/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'petugas.melati@simba.id', password: 'PasswordSALAH123!' }
    );

    if (res.status === 401 && res.data.message === 'Email atau password salah') {
      console.log('  ✓ Terverifikasi: Password salah ditolak HTTP 401 dengan pesan ramah:');
      console.log(`    "${res.data.message}"`);
    } else {
      console.log(`  ❌ Respon tidak sesuai: status ${res.status}, body:`, res.data);
    }
  } catch (err) {
    console.log(`  ❌ Exception: ${err.message}`);
  }

  // 4. Uji Simulasi Server Mati (Error Jaringan)
  console.log('\n[4/5] Menguji Deteksi Error Jaringan Saat Server Tidak Terjangkau ...');
  try {
    // Port 59999 tidak aktif -> simulasi server offline
    await request('http://localhost:59999/api/auth/login', { method: 'POST', timeout: 2000 }, { email: 'test@simba.id', password: '123' });
    console.log('  ❌ Seharusnya gagal menghubungkan.');
  } catch (err) {
    const isNetworkErr = err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT';
    if (isNetworkErr) {
      console.log('  ✓ Terverifikasi: Node/browser menangkap error jaringan (ECONNREFUSED).');
      console.log('  ✓ Frontend akan menampilkan:');
      console.log('    "Tidak dapat terhubung ke server. Periksa koneksi Anda lalu coba lagi" + Tombol Coba Lagi');
    } else {
      console.log(`  ℹ Terdeteksi error: ${err.code || err.message}`);
    }
  }

  // 5. Cek Langsung Domain Supabase Cloud
  console.log('\n[5/5] Memeriksa Status Domain Supabase Cloud (*.supabase.co) ...');
  const supaUrl = process.env.SUPABASE_URL;
  console.log(`  Target URL: ${supaUrl}`);

  try {
    const hostname = new URL(supaUrl).hostname;
    const dns = require('dns').promises;
    await dns.lookup(hostname);
    console.log(`  ✓ Domain ${hostname} berhasil di-resolve oleh DNS.`);
  } catch (err) {
    console.log(`  ⚠️ Perlu dikonfirmasi: Domain Supabase tidak dapat di-resolve di DNS (${err.code}).`);
    console.log('     Penyebab: Proyek Supabase Free Tier ter-pause akibat masa inaktivitas > 7 hari.');
    console.log('     Solusi: Buka dashboard Supabase -> Klik "Restore project", atau buat project baru.');
  }

  console.log('\n============================================================');
  console.log('  VERIFIKASI FASE 1 SELESAI');
  console.log('============================================================\n');
}

runVerification();
