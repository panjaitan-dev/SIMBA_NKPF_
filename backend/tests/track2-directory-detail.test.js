/**
 * SIMBA Nusantara — Automated Tests Track 2: Direktori, Detail Unit, Usulan, Lapor Keliru, & Minat Provinsi
 * Menguji fungsionalitas direktori, pencarian, filter, Haversine, 404 unit, honeypot spam, dan aturan R1.
 * Menggunakan Node.js Native Test Runner & Native fetch (Zero external dev dependencies).
 */

process.env.NODE_ENV = 'test';
require('dotenv').config();
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('http');
const app = require('../src/index');
const { haversineDistanceKm, isUnitOpenNow } = require('../src/lib/sumut-data');

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
});

describe('Track 2.1: Logika Geospasial Haversine & Status Jam Operasional', () => {
  it('harus menghitung jarak Haversine secara akurat', () => {
    // Jarak Medan (3.5952, 98.6722) ke Lubuk Pakam Deli Serdang (3.5604, 98.8723) ~ 22-24 km
    const dist = haversineDistanceKm(3.5952, 98.6722, 3.5604, 98.8723);
    assert.ok(dist >= 20 && dist <= 25, `Jarak terhitung: ${dist} km`);
  });

  it('harus mengevaluasi status buka/tutup jam operasional dengan tepat', () => {
    const jamOp = {
      senin: '08:00 - 16:00',
      selasa: '08:00 - 16:00',
      minggu: 'Tutup',
    };

    // Hari Senin jam 10:00 (harus buka)
    const seninPagi = new Date('2026-10-19T10:00:00'); // 19 Okt 2026 adalah Senin
    assert.strictEqual(isUnitOpenNow(jamOp, seninPagi), true);

    // Hari Senin jam 19:00 (harus tutup)
    const seninMalam = new Date('2026-10-19T19:00:00');
    assert.strictEqual(isUnitOpenNow(jamOp, seninMalam), false);

    // Hari Minggu jam 10:00 (harus tutup)
    const mingguPagi = new Date('2026-10-18T10:00:00'); // 18 Okt 2026 adalah Minggu
    assert.strictEqual(isUnitOpenNow(jamOp, mingguPagi), false);
  });
});

describe('Track 2.2: Endpoint Direktori Unit Bank Sampah (/api/unit)', () => {
  it('harus mengembalikan daftar unit bank sampah terverifikasi Sumut dengan paginasi', async () => {
    const res = await fetch(`${baseUrl}/api/unit?page=1&limit=5`);
    const json = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.success, true);
    assert.ok(Array.isArray(json.data));
    assert.ok(json.pagination);
    assert.strictEqual(json.pagination.page, 1);
    assert.strictEqual(json.pagination.limit, 5);

    // Pastikan semua unit yang dikembalikan non-demo dan terverifikasi
    json.data.forEach((u) => {
      assert.strictEqual(u.is_demo, false);
      assert.strictEqual(u.status_verifikasi, 'terverifikasi');
    });
  });

  it('harus memfilter berdasarkan pencarian teks (q)', async () => {
    const res = await fetch(`${baseUrl}/api/unit?q=Toba`);
    const json = await res.json();
    assert.strictEqual(res.status, 200);
    assert.ok(json.data.length > 0);
    json.data.forEach((u) => {
      const match =
        u.nama.toLowerCase().includes('toba') ||
        u.alamat_lengkap.toLowerCase().includes('toba') ||
        (u.kabupaten_kota_nama && u.kabupaten_kota_nama.toLowerCase().includes('toba'));
      assert.ok(match, 'Unit harus relevan dengan kata kunci Toba');
    });
  });

  it('harus memfilter berdasarkan kabupaten_kota', async () => {
    const res = await fetch(`${baseUrl}/api/unit?kabupaten_kota=1275`); // Kota Medan
    const json = await res.json();
    assert.strictEqual(res.status, 200);
    json.data.forEach((u) => {
      assert.strictEqual(u.kabupaten_kota_kode, '1275');
    });
  });

  it('harus memfilter berdasarkan jenis_sampah', async () => {
    const res = await fetch(`${baseUrl}/api/unit?jenis_sampah=Minyak%20Jelantah`);
    const json = await res.json();
    assert.strictEqual(res.status, 200);
    json.data.forEach((u) => {
      assert.ok(
        u.jenis_sampah_diterima.some((j) => j.toLowerCase().includes('minyak jelantah')),
        'Unit harus menerima minyak jelantah'
      );
    });
  });

  it('harus menghitung jarak dan mengurutkan terdekat jika lat/lng disediakan', async () => {
    // Koordinat pusat Kota Medan (3.5952, 98.6722)
    const res = await fetch(`${baseUrl}/api/unit?lat=3.5952&lng=98.6722&sort=terdekat`);
    const json = await res.json();
    assert.strictEqual(res.status, 200);
    assert.ok(json.data.length >= 2);

    // Unit pertama harus memiliki jarak terhitung dan jarak bertambah untuk elemen berikutnya
    const first = json.data[0];
    const second = json.data[1];
    assert.ok(typeof first.jarak_km === 'number');
    assert.ok(typeof second.jarak_km === 'number');
    assert.ok(first.jarak_km <= second.jarak_km, 'Urutan harus dari jarak terdekat ke terjauh');
  });
});

describe('Track 2.3: Endpoint Detail Unit Bank Sampah (/api/unit/:slug)', () => {
  it('harus mengembalikan detail unit terverifikasi beserta daftar harga dan status operasional', async () => {
    const res = await fetch(`${baseUrl}/api/unit/bsi-new-normal-medan`);
    const json = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.slug, 'bsi-new-normal-medan');
    assert.strictEqual(json.data.status_verifikasi, 'terverifikasi');
    assert.strictEqual(json.data.is_demo, false);

    // Harus memiliki katalog harga dengan tanggal berlaku dan sumber sesuai R1
    assert.ok(Array.isArray(json.data.harga_katalog));
    assert.ok(json.data.harga_katalog.length > 0);
    json.data.harga_katalog.forEach((h) => {
      assert.ok(h.jenis, 'Jenis sampah di harga harus ada');
      assert.ok(h.harga_beli > 0, 'Harga beli harus > 0');
      assert.ok(h.tanggal_berlaku, 'Tanggal berlaku harga wajib ada');
      assert.ok(h.sumber, 'Sumber harga wajib ada');
    });
  });

  it('harus mengembalikan 404 jika slug tidak ditemukan', async () => {
    const res = await fetch(`${baseUrl}/api/unit/slug-tidak-akan-pernah-ada-xyz`);
    const json = await res.json();
    assert.strictEqual(res.status, 404);
    assert.strictEqual(json.success, false);
  });
});

describe('Track 2.4: Usulan Bank Sampah Baru & Anti-Spam Honeypot', () => {
  it('harus menolak kiriman usulan jika bot mengisi honeypot website_trap', async () => {
    const res = await fetch(`${baseUrl}/api/unit/usulkan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nama: 'Bank Sampah Bot Spam',
        kabupaten_kota_kode: '1275',
        alamat_lengkap: 'Alamat palsu bot spamming',
        nama_pengusul: 'Spam Bot',
        website_trap: 'http://spam-link.xyz',
      }),
    });
    const json = await res.json();
    assert.strictEqual(res.status, 400);
    assert.strictEqual(json.success, false);
    assert.ok(json.message.toLowerCase().includes('spam'));
  });

  it('harus menolak usulan jika input tidak lengkap', async () => {
    const res = await fetch(`${baseUrl}/api/unit/usulkan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nama: 'BS', // terlalu pendek
        kabupaten_kota_kode: '',
        alamat_lengkap: 'Pendek',
      }),
    });
    const json = await res.json();
    assert.strictEqual(res.status, 400);
    assert.strictEqual(json.success, false);
  });

  it('harus menerima usulan yang valid dan menyimpannya ke antrian verifikasi', async () => {
    const res = await fetch(`${baseUrl}/api/unit/usulkan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nama: 'Bank Sampah Warga Seroja',
        kabupaten_kota_kode: '1275',
        alamat_lengkap: 'Jl. Seroja No. 55 Kelurahan Tanjung Rejo, Kota Medan',
        telepon: '081299887766',
        nama_pengusul: 'Hendra Saputra',
        email_pengusul: 'hendra@example.com',
        catatan: 'Aktif setiap Sabtu pagi, beranggotakan 45 KK',
        website_trap: '', // Kosong untuk manusia asli
      }),
    });
    const json = await res.json();
    assert.strictEqual(res.status, 201);
    assert.strictEqual(json.success, true);
    assert.ok(json.data.id);
  });
});

describe('Track 2.5: Laporan Data Keliru (/api/unit/:slug/lapor-keliru)', () => {
  it('harus menolak laporan keliru jika honeypot terisi', async () => {
    const res = await fetch(`${baseUrl}/api/unit/bsi-new-normal-medan/lapor-keliru`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jenis_kekeliruan: 'alamat_salah',
        deskripsi: 'Deskripsi keliru yang dilaporkan spammer',
        website_trap: 'spam_detected',
      }),
    });
    assert.strictEqual(res.status, 400);
  });

  it('harus menolak jika bank sampah tidak ditemukan (404)', async () => {
    const res = await fetch(`${baseUrl}/api/unit/unit-fiktif/lapor-keliru`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jenis_kekeliruan: 'alamat_salah',
        deskripsi: 'Alamat unit fiktif salah',
      }),
    });
    assert.strictEqual(res.status, 404);
  });

  it('harus menerima laporan keliru yang valid', async () => {
    const res = await fetch(`${baseUrl}/api/unit/bsi-new-normal-medan/lapor-keliru`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jenis_kekeliruan: 'jam_tutup',
        deskripsi: 'Pada hari Sabtu unit tutup jam 12:00, bukan jam 13:00',
        nama_pelapor: 'Ahmad Nasabah',
        kontak_pelapor: '081233445566',
        website_trap: '',
      }),
    });
    const json = await res.json();
    assert.strictEqual(res.status, 201);
    assert.strictEqual(json.success, true);
  });
});

describe('Track 2.6: Aturan R1 pada Antrian Verifikasi Admin', () => {
  it('harus menolak verifikasi unit jika tanpa otentikasi admin', async () => {
    const res = await fetch(`${baseUrl}/api/unit/admin/verifikasi/mock-id-123`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token-palsu-atau-kosong',
      },
      body: JSON.stringify({
        status_verifikasi: 'terverifikasi',
        sumber_data: '',
        tanggal_verifikasi: '2026-10-18',
      }),
    });
    assert.strictEqual(res.status, 401);
  });
});

describe('Track 2.7: Fitur Ajukan Provinsi Saya (/api/provinsi/minat)', () => {
  it('harus mengembalikan daftar 38 provinsi dengan jumlah minat nyata', async () => {
    const res = await fetch(`${baseUrl}/api/provinsi/minat`);
    const json = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.length, 38);

    const sumut = json.data.find((p) => p.kode === '12');
    assert.strictEqual(sumut.status_layanan, 'aktif_pilot');

    const dki = json.data.find((p) => p.kode === '31');
    assert.strictEqual(dki.status_layanan, 'belum_tersedia');
    assert.ok(typeof dki.jumlah_minat === 'number');
  });

  it('harus menerima pengajuan minat provinsi baru dan menolak honeypot', async () => {
    // Test honeypot
    const spamRes = await fetch(`${baseUrl}/api/provinsi/minat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provinsi_kode: '32',
        peran: 'warga',
        website_trap: 'bot',
      }),
    });
    assert.strictEqual(spamRes.status, 400);

    // Test valid submission
    const validRes = await fetch(`${baseUrl}/api/provinsi/minat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provinsi_kode: '32', // Jawa Barat
        peran: 'warga',
        email: 'warga.jabar@example.com',
        catatan: 'Ingin SIMBA hadir di Bandung',
        website_trap: '',
      }),
    });
    const validJson = await validRes.json();
    assert.strictEqual(validRes.status, 201);
    assert.strictEqual(validJson.success, true);
  });
});

describe('Track 2.8: Master 33 Kabupaten/Kota Sumatera Utara (/api/kabupaten-kota)', () => {
  it('harus memuat tepat 33 kabupaten dan kota di Sumatera Utara', async () => {
    const res = await fetch(`${baseUrl}/api/kabupaten-kota`);
    const json = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.length, 33);

    const medan = json.data.find((k) => k.kode === '1275');
    assert.ok(medan);
    assert.strictEqual(medan.nama, 'Kota Medan');
    assert.strictEqual(medan.jenis, 'kota');
    assert.ok(medan.jumlah_unit_terverifikasi >= 1);
  });
});
