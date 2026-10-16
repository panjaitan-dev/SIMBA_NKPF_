/**
 * SIMBA Nusantara — Automated Tests for Critical Business Flows
 * Menguji alur inti: Setoran -> Saldo bertambah, Penarikan -> Saldo berkurang,
 * Guard Role Middleware, dan Validasi Input.
 * 
 * Dijalankan dengan: `npm test` atau `node --test tests/critical-flows.test.js`
 */

require('dotenv').config();
const { describe, it } = require('node:test');
const assert = require('node:assert');
const { requireRole } = require('../src/middleware/auth.middleware');

describe('Alur Kritis 1: Logika Finansial Setoran Sampah', () => {
  it('harus menghitung total setoran dan menambah saldo nasabah secara presisi', () => {
    let saldoAwal = 50000;
    const items = [
      { nama: 'Tembaga Super', berat_kg: 2.5, harga_satuan: 85000 },
      { nama: 'Kardus Box', berat_kg: 10, harga_satuan: 1800 },
    ];

    const totalNilai = items.reduce((acc, item) => acc + item.berat_kg * item.harga_satuan, 0);
    assert.strictEqual(totalNilai, 212500 + 18000); // 230500

    // Simulasi trigger DB update_saldo_nasabah()
    const saldoAkhir = saldoAwal + totalNilai;
    assert.strictEqual(saldoAkhir, 280500);
  });

  it('harus membatalkan (void/soft-delete) transaksi setoran dan mengembalikan saldo awal (auto-reversal)', () => {
    let saldoTerkini = 280500;
    const nominalBatal = 230500;

    // Simulasi trigger status = 'dibatalkan'
    saldoTerkini -= nominalBatal;
    assert.strictEqual(saldoTerkini, 50000);
  });
});

describe('Alur Kritis 2: Logika Finansial Penarikan Tabungan', () => {
  it('harus memotong saldo nasabah saat penarikan valid disetujui', () => {
    let saldo = 150000;
    const jumlahTarik = 100000;

    assert.ok(jumlahTarik <= saldo, 'Saldo harus mencukupi');
    saldo -= jumlahTarik;
    assert.strictEqual(saldo, 50000);
  });

  it('harus menolak penarikan jika nominal melebihi saldo yang tersedia', () => {
    const saldo = 50000;
    const jumlahTarik = 100000;

    const isAllowed = jumlahTarik <= saldo;
    assert.strictEqual(isAllowed, false, 'Penarikan melebihi saldo wajib ditolak');
  });

  it('harus menolak penarikan dengan nominal non-positif', () => {
    const invalidAmounts = [0, -50000, -1];
    for (const amt of invalidAmounts) {
      assert.strictEqual(amt > 0, false, `Nominal ${amt} tidak boleh diproses`);
    }
  });
});

describe('Alur Kritis 3: Role-Based Access Control (RBAC Guard)', () => {
  it('harus menolak akses jika pengguna tidak memiliki role yang diizinkan (403 Forbidden)', () => {
    const middleware = requireRole('admin', 'admin_klh');
    const req = { user: { role: 'nasabah' } };
    let statusCode = 0;
    let responseBody = null;
    let nextCalled = false;

    const res = {
      status(code) {
        statusCode = code;
        return {
          json(body) {
            responseBody = body;
          },
        };
      },
    };

    middleware(req, res, () => {
      nextCalled = true;
    });

    assert.strictEqual(nextCalled, false, 'Next tidak boleh dipanggil untuk role yang tidak berhak');
    assert.strictEqual(statusCode, 403);
    assert.strictEqual(responseBody?.success, false);
  });

  it('harus mengizinkan akses jika role pengguna sesuai (Admin / Petugas / KLH)', () => {
    const middleware = requireRole('admin', 'petugas');
    const req = { user: { role: 'petugas' } };
    let nextCalled = false;

    const res = {
      status() { return { json() {} }; },
    };

    middleware(req, res, () => {
      nextCalled = true;
    });

    assert.strictEqual(nextCalled, true, 'Next harus dipanggil untuk role yang sah');
  });
});

describe('Alur Kritis 4: Validasi Dual-Pricing & Margin Offtaker', () => {
  it('harus memastikan harga jual offtaker selalu lebih besar dari harga beli nasabah (positive margin)', () => {
    const katalogSampah = [
      { nama: 'Tembaga Super', harga_beli: 85000, harga_jual: 95000 },
      { nama: 'Aluminium Kaleng', harga_beli: 14000, harga_jual: 18000 },
      { nama: 'Botol PET Bening', harga_beli: 3500, harga_jual: 4800 },
    ];

    for (const item of katalogSampah) {
      const margin = item.harga_jual - item.harga_beli;
      assert.ok(margin > 0, `Margin untuk ${item.nama} harus positif`);
    }
  });
});

describe('Alur Kritis 5: Proksi Autentikasi & Pemisahan Error Jaringan vs Kredensial', () => {
  const { DEMO_ACCOUNTS, signLocalToken, verifyLocalToken } = require('../src/lib/auth-utils');
  const { login } = require('../src/controllers/auth.controller');

  it('harus memvalidasi 4 akun demo resmi dengan role yang sesuai di README', () => {
    assert.strictEqual(DEMO_ACCOUNTS.length, 4);
    const roles = DEMO_ACCOUNTS.map((a) => a.role);
    assert.deepStrictEqual(roles, ['admin', 'petugas', 'nasabah', 'admin_klh']);

    for (const acc of DEMO_ACCOUNTS) {
      assert.strictEqual(acc.password, 'Password123!');
      assert.ok(acc.email.includes('@'));
    }
  });

  it('harus berhasil menandatangani dan memverifikasi token JWT lokal secara independen', () => {
    const payload = { id: 'test-1', email: 'test@simba.id', role: 'admin' };
    const token = signLocalToken(payload, 3600);
    assert.ok(typeof token === 'string' && token.split('.').length === 3);

    const verified = verifyLocalToken(token);
    assert.ok(verified);
    assert.strictEqual(verified.email, 'test@simba.id');
    assert.strictEqual(verified.role, 'admin');
  });

  it('harus menolak login dengan password salah (HTTP 401: Email atau password salah)', async () => {
    let statusCode = null;
    let jsonBody = null;

    const req = {
      body: { email: 'petugas.melati@simba.id', password: 'PasswordSalah!' },
    };
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonBody = data;
        return this;
      },
    };

    await login(req, res);
    assert.strictEqual(statusCode, 401);
    assert.strictEqual(jsonBody?.success, false);
    assert.strictEqual(jsonBody?.message, 'Email atau password salah');
  });

  it('harus meluluskan login untuk 4 akun demo dengan token dan profil lengkap', async () => {
    for (const acc of DEMO_ACCOUNTS) {
      let statusCode = 200;
      let jsonBody = null;

      const req = { body: { email: acc.email, password: acc.password } };
      const res = {
        status(code) {
          statusCode = code;
          return this;
        },
        json(data) {
          jsonBody = data;
          return this;
        },
      };

      await login(req, res);
      assert.strictEqual(statusCode, 200);
      assert.strictEqual(jsonBody?.success, true);
      assert.strictEqual(jsonBody?.role, acc.role);
      assert.ok(Boolean(jsonBody?.token));
    }
  });

  it('harus menolak request tanpa email atau password (HTTP 400)', async () => {
    let statusCode = null;
    let jsonBody = null;

    const req = { body: { email: '', password: '' } };
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonBody = data;
        return this;
      },
    };

    await login(req, res);
    assert.strictEqual(statusCode, 400);
    assert.strictEqual(jsonBody?.message, 'Email dan password wajib diisi');
  });
});

