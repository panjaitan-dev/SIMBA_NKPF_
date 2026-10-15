/**
 * SIMBA Nusantara — Large Scale Benchmark Data Generator
 * Menghasilkan 1.000+ Nasabah & 5.000+ Transaksi Setoran
 * Untuk pengujian kinerja skala besar & presentasi juri lomba.
 * 
 * Penggunaan:
 *   node backend/scripts/seed-large-scale.js [--sql] [--run]
 *   --sql : Menghasilkan berkas SQL `backend/supabase/seed_large_scale.sql`
 *   --run : Langsung menyuntikkan ke Supabase via REST API
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const FIRST_NAMES = [
  'Ahmad', 'Budi', 'Chandra', 'Dewi', 'Eko', 'Fajar', 'Gita', 'Hadi', 'Indah', 'Joko',
  'Kartika', 'Lestari', 'Mahendra', 'Nurul', 'Oki', 'Prasetyo', 'Rina', 'Siti', 'Tri', 'Utami',
  'Wahyu', 'Yusuf', 'Zainal', 'Agus', 'Bambang', 'Cahyo', 'Dian', 'Endang', 'Fitri', 'Gunawan',
  'Hendra', 'Irfan', 'Juli', 'Kusuma', 'Lukman', 'Mega', 'Nugroho', 'Putri', 'Rahmat', 'Surya'
];

const LAST_NAMES = [
  'Santoso', 'Wijaya', 'Saputra', 'Hidayat', 'Kusuma', 'Pratama', 'Wibowo', 'Nugroho', 'Siregar', 'Lubis',
  'Nasution', 'Harahap', 'Pasaribu', 'Simanjuntak', 'Hutapea', 'Sitorus', 'Tanjung', 'Gultom', 'Pardede', 'Batubara',
  'Kusumawati', 'Anggraini', 'Permata', 'Sari', 'Utami', 'Wardani', 'Puspitasari', 'Rahmawati', 'Lestari', 'Wulandari'
];

const KOTA_LIST = [
  'Jakarta Pusat', 'Jakarta Timur', 'Jakarta Selatan', 'Bandung', 'Cimahi', 'Surabaya',
  'Sidoarjo', 'Medan', 'Semarang', 'Yogyakarta', 'Denpasar', 'Makassar', 'Balikpapan'
];

const UNITS = [
  { id: '11111111-1111-1111-1111-111111111111', nama: 'Bank Sampah Induk Pusat', kode: 'BSI-JKT01' },
  { id: '22222222-2222-2222-2222-222222222222', nama: 'Bank Sampah Unit Melati Mandiri', kode: 'BSU-JKT02' },
  { id: '33333333-3333-3333-3333-333333333333', nama: 'Bank Sampah Unit Asri Sejahtera', kode: 'BSU-BDO01' },
  { id: '44444444-4444-4444-4444-444444444444', nama: 'Bank Sampah Unit Resik Lestari', kode: 'BSU-SBY01' },
  { id: '55555555-5555-5555-5555-555555555555', nama: 'Bank Sampah Unit Berkah Medan', kode: 'BSU-MDN01' },
];

const KOMODITAS = [
  { nama: 'Tembaga Super (Kabel Kupas)', kode: 'LG-TMB01', harga: 85000, satuan: 'kg', min: 0.5, max: 15 },
  { nama: 'Aluminium Kaleng Minuman', kode: 'LG-ALM01', harga: 14000, satuan: 'kg', min: 1, max: 25 },
  { nama: 'Aluminium Profil / Tebal', kode: 'LG-ALM02', harga: 16000, satuan: 'kg', min: 2, max: 30 },
  { nama: 'Botol Plastik PET Bening', kode: 'PLS-PET01', harga: 3500, satuan: 'kg', min: 2, max: 50 },
  { nama: 'Plastik HDPE / Emberan', kode: 'PLS-HDP02', harga: 2800, satuan: 'kg', min: 3, max: 40 },
  { nama: 'Kardus Box Cokelat Tebal', kode: 'KRT-KRD01', harga: 1800, satuan: 'kg', min: 5, max: 120 },
  { nama: 'Besi Padu / Konstruksi', kode: 'LG-BSI01', harga: 4500, satuan: 'kg', min: 10, max: 200 },
  { nama: 'Minyak Jelantah Berkualitas', kode: 'MNY-JLT01', harga: 7000, satuan: 'liter', min: 2, max: 20 },
  { nama: 'Botol Kaca Utuh', kode: 'KC-BTL01', harga: 500, satuan: 'pcs', min: 10, max: 100 },
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max, decimals = 2) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
}

function generateDataset(nasabahCount = 1000, setoranCount = 5000) {
  console.log(`[SIMBA Seeder] Membangkitkan ${nasabahCount} data nasabah...`);
  
  const nasabahList = [];
  for (let i = 1; i <= nasabahCount; i++) {
    const fn = getRandomItem(FIRST_NAMES);
    const ln = getRandomItem(LAST_NAMES);
    const nama = `${fn} ${ln}`;
    const id = uuidv4();
    const nomor = `NSB-2026-${String(i).padStart(5, '0')}`;
    const nik = `317${getRandomInt(10, 99)}${getRandomInt(1000000000, 9999999999)}`;
    const unit = getRandomItem(UNITS);
    const kota = getRandomItem(KOTA_LIST);
    const alamat = `Jl. Lingkungan Resik No. ${getRandomInt(1, 150)}, ${kota}`;
    const nomorHp = `08${getRandomInt(11, 99)}-${getRandomInt(1000, 9999)}-${getRandomInt(1000, 9999)}`;

    nasabahList.push({
      id,
      nomor_nasabah: nomor,
      nama_lengkap: nama,
      nik,
      alamat,
      nomor_hp: nomorHp,
      unit_id: unit.id,
      unit_nama: unit.nama,
      saldo: 0,
      total_setoran_kg: 0,
    });
  }

  console.log(`[SIMBA Seeder] Membangkitkan ${setoranCount} riwayat setoran...`);
  const setoranList = [];
  const detailList = [];

  const startDate = new Date(2026, 0, 1).getTime();
  const endDate = new Date(2026, 9, 15).getTime();

  for (let i = 1; i <= setoranCount; i++) {
    const n = getRandomItem(nasabahList);
    const setoranId = uuidv4();
    const nomorSetoran = `STR-2026-${String(i).padStart(6, '0')}`;
    
    // Random date between Jan 1 and Oct 15, 2026
    const randomTime = new Date(startDate + Math.random() * (endDate - startDate));
    const tanggal = randomTime.toISOString().split('T')[0];
    const createdAt = randomTime.toISOString();

    // 1-3 items per deposit
    const itemCount = getRandomInt(1, 3);
    let totalNilai = 0;
    let totalBerat = 0;

    for (let k = 0; k < itemCount; k++) {
      const komoditas = getRandomItem(KOMODITAS);
      const berat = getRandomFloat(komoditas.min, komoditas.max);
      const subtotal = Math.round(berat * komoditas.harga);

      totalBerat += berat;
      totalNilai += subtotal;

      detailList.push({
        id: uuidv4(),
        setoran_id: setoranId,
        nama_sampah: komoditas.nama,
        kode_sampah: komoditas.kode,
        berat_kg: berat,
        harga_satuan: komoditas.harga,
        subtotal,
      });
    }

    totalBerat = parseFloat(totalBerat.toFixed(2));
    n.saldo += totalNilai;
    n.total_setoran_kg += totalBerat;

    setoranList.push({
      id: setoranId,
      nomor_setoran: nomorSetoran,
      nasabah_id: n.id,
      unit_id: n.unit_id,
      tanggal_setoran: tanggal,
      total_berat_kg: totalBerat,
      total_nilai: totalNilai,
      metode_pembayaran: Math.random() > 0.3 ? 'Saldo Tabungan' : 'Tunai',
      status: 'diverifikasi',
      created_at: createdAt,
    });
  }

  return { nasabahList, setoranList, detailList };
}

function exportToSQL(dataset, outputPath) {
  console.log(`[SIMBA Seeder] Menyusun berkas SQL ke ${outputPath}...`);
  let sql = `-- SIMBA Nusantara: Large Scale Benchmark Seed (1.000 Nasabah & 5.000 Setoran)
-- Digenerate secara otomatis untuk pengujian kinerja skala besar

BEGIN;

-- 1. Insert Nasabah
`;

  const CHUNK_SIZE = 100;
  for (let i = 0; i < dataset.nasabahList.length; i += CHUNK_SIZE) {
    const chunk = dataset.nasabahList.slice(i, i + CHUNK_SIZE);
    sql += `INSERT INTO public.nasabah (id, nomor_nasabah, nama_lengkap, nik, alamat, nomor_hp, unit_id, saldo, is_active) VALUES\n`;
    sql += chunk.map(n => 
      `('${n.id}', '${n.nomor_nasabah}', '${n.nama_lengkap.replace(/'/g, "''")}', '${n.nik}', '${n.alamat.replace(/'/g, "''")}', '${n.nomor_hp}', '${n.unit_id}', ${n.saldo}, true)`
    ).join(',\n') + `\nON CONFLICT (nomor_nasabah) DO NOTHING;\n\n`;
  }

  sql += `-- 2. Insert Setoran (5.000 transaksi)\n`;
  for (let i = 0; i < dataset.setoranList.length; i += CHUNK_SIZE) {
    const chunk = dataset.setoranList.slice(i, i + CHUNK_SIZE);
    sql += `INSERT INTO public.setoran (id, nomor_setoran, nasabah_id, unit_id, tanggal_setoran, total_berat_kg, total_nilai, metode_pembayaran, status, created_at) VALUES\n`;
    sql += chunk.map(s => 
      `('${s.id}', '${s.nomor_setoran}', '${s.nasabah_id}', '${s.unit_id}', '${s.tanggal_setoran}', ${s.total_berat_kg}, ${s.total_nilai}, '${s.metode_pembayaran}', '${s.status}', '${s.created_at}')`
    ).join(',\n') + `\nON CONFLICT (nomor_setoran) DO NOTHING;\n\n`;
  }

  sql += `COMMIT;\n`;

  fs.writeFileSync(outputPath, sql, 'utf8');
  console.log(`[SIMBA Seeder] Selesai! Berkas SQL tersimpan: ${outputPath} (${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB)`);
}

// Main Execution
const isSql = process.argv.includes('--sql') || !process.argv.includes('--run');
const dataset = generateDataset(1000, 5000);

if (isSql) {
  const targetPath = path.join(__dirname, '../supabase/seed_large_scale.sql');
  exportToSQL(dataset, targetPath);
}

module.exports = { generateDataset };
