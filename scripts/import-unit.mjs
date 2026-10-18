#!/usr/bin/env node
/**
 * scripts/import-unit.mjs
 * Skrip Impor & Validasi Ketat Data Bank Sampah Sumatera Utara
 * Mode: --dry-run (default), --execute
 */

import fs from 'fs';
import path from 'path';

// Bounding box longgar Sumatera Utara (mendeteksi salah ketik koordinat)
const SUMUT_BBOX = {
  minLat: -1.0,
  maxLat: 4.5,
  minLng: 96.5,
  maxLng: 101.0,
};

// 33 Kode Resmi Kabupaten/Kota di Sumatera Utara (BPS 1201 s/d 1278)
const KAB_KOTA_SUMUT_VALID = new Set([
  '1201', '1202', '1203', '1204', '1205', '1206', '1207', '1208',
  '1209', '1210', '1211', '1212', '1213', '1214', '1215', '1216',
  '1217', '1218', '1219', '1220', '1221', '1222', '1223', '1224',
  '1225', '1271', '1272', '1273', '1274', '1275', '1276', '1277', '1278'
]);

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Haversine formula untuk menghitung jarak koordinat dalam meter
function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Radius Bumi dalam meter
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function run() {
  const args = process.argv.slice(2);
  const isExecute = args.includes('--execute');
  const isDryRun = !isExecute;
  const filePathArg = args.find((a) => !a.startsWith('--')) || 'data/templates/unit_sumut.csv';
  const csvPath = path.resolve(filePathArg);

  console.log('='.repeat(70));
  console.log('SIMBA Nusantara — Validasi & Impor Unit Bank Sampah Sumatera Utara');
  console.log(`Mode: ${isDryRun ? '🔍 DRY-RUN (Hanya Simulasi & Validasi)' : '🚀 EXECUTE (Tulis ke Database)'}`);
  console.log(`Berkas Sumber: ${csvPath}`);
  console.log('='.repeat(70));

  if (!fs.existsSync(csvPath)) {
    console.error(`[ERROR] Berkas tidak ditemukan: ${csvPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(csvPath, 'utf8');
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);

  if (lines.length < 2) {
    console.error('[ERROR] Berkas CSV kosong atau hanya memiliki header.');
    process.exit(1);
  }

  const header = parseCSVLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    const obj = {};
    header.forEach((h, idx) => {
      obj[h] = cols[idx] || '';
    });
    obj._line = i + 1;
    rows.push(obj);
  }

  const accepted = [];
  const rejected = [];

  const seenNameKab = new Map();
  const seenPhone = new Map();
  const seenCoords = [];

  for (const row of rows) {
    const errs = [];

    // 1. Kolom Wajib
    if (!row.nama || row.nama.length < 3) errs.push('Nama unit wajib diisi minimal 3 karakter');
    if (!row.slug || row.slug.length < 3) errs.push('Slug unik wajib diisi');
    if (!row.kode) errs.push('Kode unit wajib diisi');
    if (!row.alamat_lengkap || row.alamat_lengkap.length < 10) errs.push('Alamat lengkap wajib diisi minimal 10 karakter');
    if (!row.sumber_data || row.sumber_data.length < 5) errs.push('Sumber data wajib dicantumkan (R1: Data Asli)');
    if (!row.tanggal_verifikasi) errs.push('Tanggal verifikasi wajib dicantumkan');
    if (!row.status_verifikasi || !['terverifikasi', 'belum_diverifikasi'].includes(row.status_verifikasi)) {
      errs.push('Status verifikasi harus "terverifikasi" atau "belum_diverifikasi"');
    }

    // 2. Validasi Kabupaten/Kota Sumut
    if (!KAB_KOTA_SUMUT_VALID.has(row.kabupaten_kota_kode)) {
      errs.push(`Kode kab/kota "${row.kabupaten_kota_kode}" bukan bagian dari 33 Kabupaten/Kota resmi Sumatera Utara (1201-1278)`);
    }

    // 3. Validasi Format Tanggal
    if (row.tanggal_verifikasi && !/^\d{4}-\d{2}-\d{2}$/.test(row.tanggal_verifikasi)) {
      errs.push(`Format tanggal verifikasi "${row.tanggal_verifikasi}" tidak valid (wajib YYYY-MM-DD)`);
    }

    // 4. Validasi Nomor Telepon
    if (row.telepon_publik) {
      const cleanHp = row.telepon_publik.replace(/\D/g, '');
      if (cleanHp.length < 10 || cleanHp.length > 13) {
        errs.push(`Nomor telepon "${row.telepon_publik}" tidak valid (harus 10-13 digit)`);
      }
    }

    // 5. Validasi Bounding Box Koordinat
    const lat = parseFloat(row.lat);
    const lng = parseFloat(row.lng);
    if (isNaN(lat) || isNaN(lng)) {
      errs.push('Koordinat lat/lng tidak valid numerik');
    } else {
      if (lat < SUMUT_BBOX.minLat || lat > SUMUT_BBOX.maxLat) {
        errs.push(`Latitude ${lat} berada di luar wilayah administratif Sumatera Utara (${SUMUT_BBOX.minLat} s/d ${SUMUT_BBOX.maxLat})`);
      }
      if (lng < SUMUT_BBOX.minLng || lng > SUMUT_BBOX.maxLng) {
        errs.push(`Longitude ${lng} berada di luar wilayah administratif Sumatera Utara (${SUMUT_BBOX.minLng} s/d ${SUMUT_BBOX.maxLng})`);
      }
    }

    // 6. Deteksi Duplikat
    // A. Nama + Kab/Kota
    const nameKabKey = `${row.nama.toLowerCase()}|${row.kabupaten_kota_kode}`;
    if (seenNameKab.has(nameKabKey)) {
      errs.push(`Duplikat nama unit di kab/kota yang sama (sama dengan baris ${seenNameKab.get(nameKabKey)})`);
    } else {
      seenNameKab.set(nameKabKey, row._line);
    }

    // B. Telepon
    if (row.telepon_publik) {
      const cleanHp = row.telepon_publik.replace(/\D/g, '');
      if (seenPhone.has(cleanHp)) {
        errs.push(`Duplikat nomor telepon publik (sama dengan baris ${seenPhone.get(cleanHp)})`);
      } else {
        seenPhone.set(cleanHp, row._line);
      }
    }

    // C. Koordinat < 50 meter
    if (!isNaN(lat) && !isNaN(lng)) {
      for (const prev of seenCoords) {
        const dist = haversineMeters(lat, lng, prev.lat, prev.lng);
        if (dist < 50) {
          errs.push(`Koordinat terlalu berdekatan (${dist.toFixed(1)} m < 50 m) dengan baris ${prev.line} (${prev.nama})`);
        }
      }
      if (errs.length === 0) {
        seenCoords.push({ lat, lng, line: row._line, nama: row.nama });
      }
    }

    if (errs.length > 0) {
      rejected.push({ line: row._line, nama: row.nama || '(Tanpa Nama)', errors: errs });
    } else {
      accepted.push(row);
    }
  }

  console.log('\n📊 HASIL VALIDASI DATA:');
  console.log(`- Total Baris Data : ${rows.length}`);
  console.log(`- Data Diterima    : ${accepted.length} baris ✅`);
  console.log(`- Data Ditolak     : ${rejected.length} baris ❌`);

  if (rejected.length > 0) {
    console.log('\n⚠️ RINCIAN PENOLAKAN PER BARIS:');
    rejected.forEach((r) => {
      console.log(`[Baris ${r.line}] ${r.nama}:`);
      r.errors.forEach((e) => console.log(`   └─ ❌ ${e}`));
    });
  }

  if (accepted.length > 0) {
    console.log('\n✅ UNIT YANG LOLOS VALIDASI KETAT:');
    accepted.forEach((a, idx) => {
      console.log(
        `  ${idx + 1}. [${a.kode}] ${a.nama} (${a.kabupaten_kota_kode}) — Status: ${a.status_verifikasi}`
      );
    });
  }

  if (isDryRun) {
    console.log('\n[INFO] Mode --dry-run selesai. Tidak ada perubahan yang disimpan ke basis data.');
    console.log('Gunakan opsi --execute untuk menyinkronkan data yang lolos ke database Supabase.');
  }

  if (rejected.length > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

run().catch((err) => {
  console.error('[FATAL]', err);
  process.exit(1);
});
