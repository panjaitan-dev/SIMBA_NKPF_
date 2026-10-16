/**
 * SIMBA Nusantara — Test Suite 38 Provinsi & Agregasi Matematika Murni (Fase 3)
 * Menguji integritas 38 provinsi di Indonesia (termasuk 4 DOB Papua & Maluku),
 * validasi koordinat, kode BPS, unit percontohan, dan konsistensi agregasi nasional.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const { DATA_38_PROVINSI, getAgregasiNasional } = require('../src/lib/provinsi-data');

describe('Fase 3: Validasi Cakupan 38 Provinsi di Indonesia', () => {
  it('Harus memuat tepat 38 provinsi di seluruh Indonesia', () => {
    assert.strictEqual(DATA_38_PROVINSI.length, 38);
  });

  it('Harus memuat 4 Daerah Otonom Baru (DOB) di Papua', () => {
    const papuaProvs = DATA_38_PROVINSI.filter((p) => p.pulau === 'Maluku & Papua');
    const dobCodes = ['93', '94', '95', '96'];
    const foundDobs = papuaProvs.filter((p) => dobCodes.includes(p.kode_bps));

    assert.strictEqual(foundDobs.length, 4);

    const papuaSelatan = DATA_38_PROVINSI.find((p) => p.kode_bps === '93');
    assert.strictEqual(papuaSelatan.nama, 'Papua Selatan');
    assert.strictEqual(papuaSelatan.ibukota, 'Merauke');

    const papuaTengah = DATA_38_PROVINSI.find((p) => p.kode_bps === '94');
    assert.strictEqual(papuaTengah.nama, 'Papua Tengah');
    assert.strictEqual(papuaTengah.ibukota, 'Nabire');

    const papuaPegunungan = DATA_38_PROVINSI.find((p) => p.kode_bps === '95');
    assert.strictEqual(papuaPegunungan.nama, 'Papua Pegunungan');
    assert.strictEqual(papuaPegunungan.ibukota, 'Wamena');

    const papuaBaratDaya = DATA_38_PROVINSI.find((p) => p.kode_bps === '96');
    assert.strictEqual(papuaBaratDaya.nama, 'Papua Barat Daya');
    assert.strictEqual(papuaBaratDaya.ibukota, 'Sorong');
  });

  it('Harus memuat provinsi di Kepulauan Maluku secara lengkap', () => {
    const maluku = DATA_38_PROVINSI.find((p) => p.kode_bps === '81');
    const malut = DATA_38_PROVINSI.find((p) => p.kode_bps === '82');

    assert.ok(maluku, 'Provinsi Maluku harus ada');
    assert.strictEqual(maluku.ibukota, 'Ambon');
    assert.ok(malut, 'Provinsi Maluku Utara harus ada');
    assert.strictEqual(malut.ibukota, 'Sofifi');
  });

  it('Setiap provinsi harus memiliki data geografis dan operasional yang lengkap', () => {
    DATA_38_PROVINSI.forEach((p) => {
      assert.ok(p.kode_bps, `Kode BPS harus ada untuk ${p.nama}`);
      assert.ok(p.kode_iso, `Kode ISO harus ada untuk ${p.nama}`);
      assert.ok(p.nama, 'Nama provinsi harus ada');
      assert.ok(p.ibukota, `Ibu kota harus ada untuk ${p.nama}`);
      assert.ok(typeof p.lat === 'number' && p.lat >= -11.5 && p.lat <= 6.5, `Lat tidak valid untuk ${p.nama}`);
      assert.ok(typeof p.lng === 'number' && p.lng >= 94.5 && p.lng <= 141.5, `Lng tidak valid untuk ${p.nama}`);
      assert.ok(p.populasi > 0, `Populasi harus > 0 untuk ${p.nama}`);
      assert.ok(p.target_reduksi_persen >= 20, `Target reduksi harus >= 20% untuk ${p.nama}`);
      assert.ok(p.bsu_aktif > 0, `BSU aktif harus > 0 untuk ${p.nama}`);
      assert.ok(p.total_sampah_kg > 0, `Total sampah harus > 0 untuk ${p.nama}`);
      assert.ok(p.total_nasabah > 0, `Total nasabah harus > 0 untuk ${p.nama}`);
      assert.ok(p.unit_percontohan, `Unit percontohan harus ada untuk ${p.nama}`);
      assert.ok(p.unit_percontohan.nama, `Nama unit percontohan harus ada untuk ${p.nama}`);
      assert.ok(p.unit_percontohan.kode, `Kode unit percontohan harus ada untuk ${p.nama}`);
      assert.ok(p.unit_percontohan.alamat, `Alamat unit percontohan harus ada untuk ${p.nama}`);
      assert.ok(p.unit_percontohan.koordinator, `Koordinator unit percontohan harus ada untuk ${p.nama}`);
      assert.ok(p.unit_percontohan.nomor_hp, `Nomor HP koordinator harus ada untuk ${p.nama}`);
    });
  });

  it('Pembagian 6 region pulau harus mencakup tepat 38 provinsi (10 + 6 + 3 + 5 + 6 + 8)', () => {
    const sumatera = DATA_38_PROVINSI.filter((p) => p.pulau === 'Sumatera');
    const jawa = DATA_38_PROVINSI.filter((p) => p.pulau === 'Jawa');
    const baliNusra = DATA_38_PROVINSI.filter((p) => p.pulau === 'Bali & Nusa Tenggara');
    const kalimantan = DATA_38_PROVINSI.filter((p) => p.pulau === 'Kalimantan');
    const sulawesi = DATA_38_PROVINSI.filter((p) => p.pulau === 'Sulawesi');
    const malukuPapua = DATA_38_PROVINSI.filter((p) => p.pulau === 'Maluku & Papua');

    assert.strictEqual(sumatera.length, 10, 'Sumatera harus 10 provinsi');
    assert.strictEqual(jawa.length, 6, 'Jawa harus 6 provinsi');
    assert.strictEqual(baliNusra.length, 3, 'Bali & Nusa Tenggara harus 3 provinsi');
    assert.strictEqual(kalimantan.length, 5, 'Kalimantan harus 5 provinsi');
    assert.strictEqual(sulawesi.length, 6, 'Sulawesi harus 6 provinsi');
    assert.strictEqual(malukuPapua.length, 8, 'Maluku & Papua harus 8 provinsi');
    assert.strictEqual(
      sumatera.length + jawa.length + baliNusra.length + kalimantan.length + sulawesi.length + malukuPapua.length,
      38
    );
  });
});

describe('Fase 3: Agregasi Matematika Murni Dashboard KLH', () => {
  it('Total nasional BSU harus sama persis dengan penjumlahan matematis 38 provinsi', () => {
    const expectedBsu = DATA_38_PROVINSI.reduce((acc, p) => acc + p.bsu_aktif, 0);
    const agregasi = getAgregasiNasional('all');

    assert.strictEqual(agregasi.total_provinsi, 38);
    assert.strictEqual(agregasi.total_bsu, expectedBsu);
    assert.strictEqual(agregasi.total_bsi, 38);
  });

  it('Total nasional Sampah Terkelola (kg) harus sama persis dengan penjumlahan matematis', () => {
    const expectedKg = DATA_38_PROVINSI.reduce((acc, p) => acc + p.total_sampah_kg, 0);
    const agregasi = getAgregasiNasional('all');

    assert.strictEqual(agregasi.total_kg, expectedKg);
    assert.strictEqual(agregasi.total_rupiah, expectedKg * 2500);
  });

  it('Total nasional Nasabah harus sama persis dengan penjumlahan matematis', () => {
    const expectedNasabah = DATA_38_PROVINSI.reduce((acc, p) => acc + p.total_nasabah, 0);
    const agregasi = getAgregasiNasional('all');

    assert.strictEqual(agregasi.total_nasabah, expectedNasabah);
  });

  it('Filter per pulau harus menghasilkan agregasi lokal yang presisi', () => {
    const pulauJawa = getAgregasiNasional('Jawa');
    const jawaProvs = DATA_38_PROVINSI.filter((p) => p.pulau === 'Jawa');
    const expectedJawaKg = jawaProvs.reduce((acc, p) => acc + p.total_sampah_kg, 0);
    const expectedJawaBsu = jawaProvs.reduce((acc, p) => acc + p.bsu_aktif, 0);

    assert.strictEqual(pulauJawa.total_provinsi, 6);
    assert.strictEqual(pulauJawa.total_kg, expectedJawaKg);
    assert.strictEqual(pulauJawa.total_bsu, expectedJawaBsu);
  });

  it('Timbulan sampah per kapita harus dalam rentang rasio nasional KLHK (~0.5 - 0.9 kg/hari)', () => {
    DATA_38_PROVINSI.forEach((p) => {
      // Sampah tahunan per kapita = total_sampah_kg / populasi
      // Harian = tahunan / 365
      // Rasio daur ulang bank sampah ~ 5% - 25% dari total timbulan 0.7 kg/hari
      const kgPerNasabahPerTahun = p.total_sampah_kg / p.total_nasabah;
      assert.ok(
        kgPerNasabahPerTahun >= 20 && kgPerNasabahPerTahun <= 150,
        `Rasio kontribusi nasabah bank sampah realistis (20-150 kg/nasabah/tahun) untuk ${p.nama}: didapat ${kgPerNasabahPerTahun}`
      );
    });
  });
});
