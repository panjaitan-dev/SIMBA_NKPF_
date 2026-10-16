/**
 * SIMBA Nusantara — Automated Tests for Zod Validation Schemas
 * Menguji 25+ kasus uji validasi input client + server + database:
 * Nama Lengkap, Email, NIK, Nomor HP, Password, Setoran, Penarikan, Jenis Sampah, dan Teks Bebas.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const {
  namaLengkapSchema,
  emailSchema,
  nikSchema,
  nomorHpSchema,
  passwordSchema,
  alamatSchema,
  registerSchema,
  createSetoranSchema,
  createPenarikanSchema,
  createJenisSampahSchema,
  sanitizeText,
  isValidNik,
  maskNik,
  normalizePhone,
  parseIndonesianDecimal,
} = require('../src/lib/validation');

function getErrorMessage(error) {
  const list = error?.issues || error?.errors || [];
  return list[0]?.message || '';
}

describe('Fase 2: Validasi Nama Lengkap', () => {
  it('Kasus 1: Tolak nama kosong', () => {
    const res = namaLengkapSchema.safeParse('');
    assert.strictEqual(res.success, false);
  });

  it('Kasus 2: Tolak nama < 3 karakter', () => {
    const res = namaLengkapSchema.safeParse('Ab');
    assert.strictEqual(res.success, false);
    assert.ok(getErrorMessage(res.error).includes('minimal 3 karakter'));
  });

  it('Kasus 3: Tolak nama > 100 karakter', () => {
    const longName = 'A'.repeat(101);
    const res = namaLengkapSchema.safeParse(longName);
    assert.strictEqual(res.success, false);
    assert.ok(getErrorMessage(res.error).includes('maksimal 100'));
  });

  it('Kasus 4: Tolak nama mengandung angka', () => {
    const res = namaLengkapSchema.safeParse('Dewi Lestari 123');
    assert.strictEqual(res.success, false);
  });

  it('Kasus 5: Tolak nama mengandung simbol dilarang (@#$%)', () => {
    const res = namaLengkapSchema.safeParse('Dewi @Lestari#');
    assert.strictEqual(res.success, false);
  });

  it('Kasus 6: Tolak karakter sama berulang >= 5x berturut-turut (heuristik)', () => {
    const res = namaLengkapSchema.safeParse('Aaaaaa Budi');
    assert.strictEqual(res.success, false);
    assert.ok(getErrorMessage(res.error).includes('berulang 5 kali'));
  });

  it('Kasus 7: Terima nama sah dan padatkan spasi ganda', () => {
    const res = namaLengkapSchema.safeParse('  Dewi   Lestari   ');
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data, 'Dewi Lestari');
  });

  it('Kasus 8: Terima nama dengan titik, apostrof, dan tanda hubung', () => {
    const res = namaLengkapSchema.safeParse("Dr. M. Sitorus O'Connor-Smith");
    assert.strictEqual(res.success, true);
  });
});

describe('Fase 2: Validasi Email', () => {
  it('Kasus 9: Tolak email kosong', () => {
    const res = emailSchema.safeParse('');
    assert.strictEqual(res.success, false);
  });

  it('Kasus 10: Tolak email tanpa @', () => {
    const res = emailSchema.safeParse('dewilestari.gmail.com');
    assert.strictEqual(res.success, false);
  });

  it('Kasus 11: Tolak email tanpa TLD', () => {
    const res = emailSchema.safeParse('dewi@gmail');
    assert.strictEqual(res.success, false);
  });

  it('Kasus 12: Tolak email dengan TLD < 2 karakter', () => {
    const res = emailSchema.safeParse('dewi@gmail.c');
    assert.strictEqual(res.success, false);
  });

  it('Kasus 13: Tolak email > 254 karakter', () => {
    const longEmail = 'a'.repeat(250) + '@simba.id';
    const res = emailSchema.safeParse(longEmail);
    assert.strictEqual(res.success, false);
  });

  it('Kasus 14: Terima email valid dan ubah ke lowercase', () => {
    const res = emailSchema.safeParse('  Dewi.Lestari@SIMBA.ID  ');
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data, 'dewi.lestari@simba.id');
  });
});

describe('Fase 2: Validasi NIK (16 Digit, Kode Provinsi, Tanggal Lahir)', () => {
  it('Kasus 15: Tolak NIK < 16 digit', () => {
    const res = nikSchema.safeParse('123456789012345');
    assert.strictEqual(res.success, false);
  });

  it('Kasus 16: Tolak NIK > 16 digit', () => {
    const res = nikSchema.safeParse('12345678901234567');
    assert.strictEqual(res.success, false);
  });

  it('Kasus 17: Tolak NIK mengandung huruf', () => {
    const res = nikSchema.safeParse('120401550495000A');
    assert.strictEqual(res.success, false);
  });

  it('Kasus 18: Tolak NIK dengan kode provinsi tidak terdaftar (mis. 99)', () => {
    const res = nikSchema.safeParse('9904015504950002');
    assert.strictEqual(res.success, false);
  });

  it('Kasus 19: Tolak NIK dengan bulan lahir tidak valid (mis. bulan 13)', () => {
    const res = nikSchema.safeParse('1204015513950002');
    assert.strictEqual(res.success, false);
  });

  it('Kasus 20: Terima NIK valid perempuan (hari lahir 15 + 40 = 55)', () => {
    // 12 = Sumut, 04 = Kab, 01 = Kec, 55 = Tgl 15 perempuan, 04 = Apr, 95 = 1995, 0002 = urut
    const res = nikSchema.safeParse('1204015504950002');
    assert.strictEqual(res.success, true);
  });

  it('Kasus 21: Terima NIK valid laki-laki (hari lahir 15)', () => {
    const res = nikSchema.safeParse('1204011504950002');
    assert.strictEqual(res.success, true);
  });

  it('Kasus 22: Terima NIK kosong karena opsional', () => {
    const res = nikSchema.safeParse('');
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data, '');
  });

  it('Kasus Masking NIK: NIK ter-masking dengan bintang', () => {
    const masked = maskNik('1204015504950002');
    assert.strictEqual(masked, '1204************');
  });
});

describe('Fase 2: Validasi Nomor HP', () => {
  it('Kasus 23: Tolak nomor HP mengandung huruf', () => {
    const res = nomorHpSchema.safeParse('0812abcd5678');
    assert.strictEqual(res.success, false);
  });

  it('Kasus 24: Tolak nomor HP bukan seluler Indonesia (bukan 08)', () => {
    const res = nomorHpSchema.safeParse('02112345678');
    assert.strictEqual(res.success, false);
  });

  it('Kasus 25: Tolak nomor HP terlalu pendek (< 10 digit)', () => {
    const res = nomorHpSchema.safeParse('0812345');
    assert.strictEqual(res.success, false);
  });

  it('Kasus 26: Terima dan normalisasi nomor HP lokal (08...) ke 628...', () => {
    const res = nomorHpSchema.safeParse('0812-3456-7890');
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data, '6281234567890');
  });

  it('Kasus 27: Terima dan normalisasi nomor HP internasional (+62...) ke 628...', () => {
    const res = nomorHpSchema.safeParse('+6281234567890');
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data, '6281234567890');
  });
});

describe('Fase 2: Validasi Password', () => {
  it('Kasus 28: Tolak password < 8 karakter', () => {
    const res = passwordSchema.safeParse('Pass1!');
    assert.strictEqual(res.success, false);
    assert.ok(getErrorMessage(res.error).includes('minimal 8'));
  });

  it('Kasus 29: Tolak password tanpa huruf besar', () => {
    const res = passwordSchema.safeParse('password123');
    assert.strictEqual(res.success, false);
    assert.ok(getErrorMessage(res.error).includes('huruf besar'));
  });

  it('Kasus 30: Tolak password tanpa angka', () => {
    const res = passwordSchema.safeParse('PasswordAbc');
    assert.strictEqual(res.success, false);
    assert.ok(getErrorMessage(res.error).includes('angka'));
  });

  it('Kasus 31: Terima password kuat (8+ karakter, ada huruf besar, kecil, angka)', () => {
    const res = passwordSchema.safeParse('Password123!');
    assert.strictEqual(res.success, true);
  });
});

describe('Fase 2: Validasi Transaksi (Setoran, Penarikan, Komoditas, Teks Bebas)', () => {
  it('Kasus 32: Tolak setoran dengan berat 0 kg', () => {
    const res = createSetoranSchema.safeParse({
      nasabah_id: 'nsb-1',
      items: [{ jenis_sampah_id: 'js-1', berat_kg: 0 }],
    });
    assert.strictEqual(res.success, false);
  });

  it('Kasus 33: Tolak setoran dengan berat negatif', () => {
    const res = createSetoranSchema.safeParse({
      nasabah_id: 'nsb-1',
      items: [{ jenis_sampah_id: 'js-1', berat_kg: -5 }],
    });
    assert.strictEqual(res.success, false);
  });

  it('Kasus 34: Terima berat desimal format Indonesia dengan koma ("2,5" -> 2.5)', () => {
    const res = createSetoranSchema.safeParse({
      nasabah_id: 'nsb-1',
      items: [{ jenis_sampah_id: 'js-1', berat_kg: '2,5' }],
    });
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data.items[0].berat_kg, 2.5);
  });

  it('Kasus 35: Tolak berat setoran melebihi batas wajar (> 10.000 kg)', () => {
    const res = createSetoranSchema.safeParse({
      nasabah_id: 'nsb-1',
      items: [{ jenis_sampah_id: 'js-1', berat_kg: 10001 }],
    });
    assert.strictEqual(res.success, false);
  });

  it('Kasus 36: Tolak penarikan < Rp 10.000', () => {
    const res = createPenarikanSchema.safeParse({ jumlah: 5000 });
    assert.strictEqual(res.success, false);
    assert.ok(getErrorMessage(res.error).includes('Minimal penarikan'));
  });

  it('Kasus 37: Terima penarikan valid Rp 50.000', () => {
    const res = createPenarikanSchema.safeParse({ jumlah: '50000' });
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data.jumlah, 50000);
  });

  it('Kasus 38: Tolak jenis sampah dengan harga beli <= 0', () => {
    const res = createJenisSampahSchema.safeParse({
      nama: 'Plastik Bekas',
      kode: 'PLS-01',
      kategori: 'anorganik',
      harga_beli: 0,
      harga_jual: 2000,
    });
    assert.strictEqual(res.success, false);
  });

  it('Kasus 39: Tolak jenis sampah dengan harga jual <= 0', () => {
    const res = createJenisSampahSchema.safeParse({
      nama: 'Plastik Bekas',
      kode: 'PLS-01',
      kategori: 'anorganik',
      harga_beli: 1000,
      harga_jual: 0,
    });
    assert.strictEqual(res.success, false);
  });

  it('Kasus 40: Sanitasi teks bebas membuang karakter kontrol dan zero-width', () => {
    const dirty = 'Jl. Merdeka\u200B\u0000 No. 10\t\n  ';
    const clean = sanitizeText(dirty);
    assert.strictEqual(clean, 'Jl. Merdeka No. 10');
  });
});
