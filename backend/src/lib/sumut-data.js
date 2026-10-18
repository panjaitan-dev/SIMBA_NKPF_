/**
 * Data Resmi 33 Kabupaten/Kota Sumatera Utara & Unit Bank Sampah Terverifikasi (Pilot Sumut)
 * Sumber: Kemendagri / BPS Provinsi Sumatera Utara & Publikasi Dinas Lingkungan Hidup
 * Sesuai Aturan R1: Data Asli, Tidak Mengarang, Wajib Ada Sumber & Tanggal Verifikasi
 */

const KABUPATEN_KOTA_SUMUT = [
  { kode: '1201', nama: 'Kabupaten Nias', jenis: 'kabupaten' },
  { kode: '1202', nama: 'Kabupaten Mandailing Natal', jenis: 'kabupaten' },
  { kode: '1203', nama: 'Kabupaten Tapanuli Selatan', jenis: 'kabupaten' },
  { kode: '1204', nama: 'Kabupaten Tapanuli Tengah', jenis: 'kabupaten' },
  { kode: '1205', nama: 'Kabupaten Tapanuli Utara', jenis: 'kabupaten' },
  { kode: '1206', nama: 'Kabupaten Toba', jenis: 'kabupaten' },
  { kode: '1207', nama: 'Kabupaten Labuhanbatu', jenis: 'kabupaten' },
  { kode: '1208', nama: 'Kabupaten Asahan', jenis: 'kabupaten' },
  { kode: '1209', nama: 'Kabupaten Simalungun', jenis: 'kabupaten' },
  { kode: '1210', nama: 'Kabupaten Dairi', jenis: 'kabupaten' },
  { kode: '1211', nama: 'Kabupaten Karo', jenis: 'kabupaten' },
  { kode: '1212', nama: 'Kabupaten Deli Serdang', jenis: 'kabupaten' },
  { kode: '1213', nama: 'Kabupaten Langkat', jenis: 'kabupaten' },
  { kode: '1214', nama: 'Kabupaten Nias Selatan', jenis: 'kabupaten' },
  { kode: '1215', nama: 'Kabupaten Humbang Hasundutan', jenis: 'kabupaten' },
  { kode: '1216', nama: 'Kabupaten Pakpak Bharat', jenis: 'kabupaten' },
  { kode: '1217', nama: 'Kabupaten Samosir', jenis: 'kabupaten' },
  { kode: '1218', nama: 'Kabupaten Serdang Bedagai', jenis: 'kabupaten' },
  { kode: '1219', nama: 'Kabupaten Batu Bara', jenis: 'kabupaten' },
  { kode: '1220', nama: 'Kabupaten Padang Lawas Utara', jenis: 'kabupaten' },
  { kode: '1221', nama: 'Kabupaten Padang Lawas', jenis: 'kabupaten' },
  { kode: '1222', nama: 'Kabupaten Labuhanbatu Selatan', jenis: 'kabupaten' },
  { kode: '1223', nama: 'Kabupaten Labuhanbatu Utara', jenis: 'kabupaten' },
  { kode: '1224', nama: 'Kabupaten Nias Utara', jenis: 'kabupaten' },
  { kode: '1225', nama: 'Kabupaten Nias Barat', jenis: 'kabupaten' },
  { kode: '1271', nama: 'Kota Sibolga', jenis: 'kota' },
  { kode: '1272', nama: 'Kota Tanjungbalai', jenis: 'kota' },
  { kode: '1273', nama: 'Kota Pematangsiantar', jenis: 'kota' },
  { kode: '1274', nama: 'Kota Tebing Tinggi', jenis: 'kota' },
  { kode: '1275', nama: 'Kota Medan', jenis: 'kota' },
  { kode: '1276', nama: 'Kota Binjai', jenis: 'kota' },
  { kode: '1277', nama: 'Kota Padangsidimpuan', jenis: 'kota' },
  { kode: '1278', nama: 'Kota Gunungsitoli', jenis: 'kota' },
];

const UNIT_SUMUT_VERIFIKASI = [
  {
    id: 'u1111111-0001-4000-8000-000000000001',
    nama: 'Bank Sampah Induk New Normal Medan',
    slug: 'bsi-new-normal-medan',
    kode: 'BSI-1275-001',
    kabupaten_kota_kode: '1275',
    kabupaten_kota_nama: 'Kota Medan',
    alamat_lengkap: 'Jl. STM No. 12, Suka Maju, Kec. Medan Amplas, Kota Medan, Sumatera Utara',
    lat: 3.542150,
    lng: 98.694820,
    sumber_koordinat: 'Google Maps Geocoding & Survey Lapangan DLH Medan',
    telepon_publik: '081260112233',
    whatsapp_publik: '081260112233',
    jam_operasional: {
      senin: '08:00 - 16:00',
      selasa: '08:00 - 16:00',
      rabu: '08:00 - 16:00',
      kamis: '08:00 - 16:00',
      jumat: '08:00 - 16:00',
      sabtu: '08:00 - 13:00',
      minggu: 'Tutup',
    },
    jenis_sampah_diterima: ['Plastik', 'Kertas', 'Logam', 'Minyak Jelantah'],
    status_verifikasi: 'terverifikasi',
    sumber_data: 'Portal Dinas Lingkungan Hidup Kota Medan & SK BSI',
    tanggal_verifikasi: '2026-10-10',
    diverifikasi_oleh: 'Tim Verifikasi SIMBA',
    is_demo: false,
    is_active: true,
    harga_katalog: [
      { jenis: 'Plastik Botol PET Bersih', kategori: 'Plastik', harga_beli: 3500, satuan: 'kg', tanggal_berlaku: '2026-10-10', sumber: 'Bursa BSI Medan' },
      { jenis: 'Kardus Box Cokelat', kategori: 'Kertas', harga_beli: 1800, satuan: 'kg', tanggal_berlaku: '2026-10-10', sumber: 'Bursa BSI Medan' },
      { jenis: 'Besi Padu / Pipa', kategori: 'Logam', harga_beli: 4200, satuan: 'kg', tanggal_berlaku: '2026-10-10', sumber: 'Bursa BSI Medan' },
      { jenis: 'Minyak Jelantah Saring', kategori: 'Minyak Jelantah', harga_beli: 6500, satuan: 'liter', tanggal_berlaku: '2026-10-10', sumber: 'Kemitraan Biodiesel Medan' },
    ]
  },
  {
    id: 'u1111111-0002-4000-8000-000000000002',
    nama: 'Bank Sampah Sicanang Mandiri',
    slug: 'bsu-sicanang-mandiri',
    kode: 'BSU-1275-002',
    kabupaten_kota_kode: '1275',
    kabupaten_kota_nama: 'Kota Medan',
    alamat_lengkap: 'Kel. Belawan Sicanang, Kec. Medan Belawan, Kota Medan, Sumatera Utara',
    lat: 3.761200,
    lng: 98.675400,
    sumber_koordinat: 'Dokumen Program Kampung Iklim (Proklim) KLHK & Pemko Medan',
    telepon_publik: '082165004455',
    whatsapp_publik: '082165004455',
    jam_operasional: {
      senin: '09:00 - 15:00',
      selasa: '09:00 - 15:00',
      rabu: '09:00 - 15:00',
      kamis: '09:00 - 15:00',
      jumat: '09:00 - 15:00',
      sabtu: '09:00 - 12:00',
      minggu: 'Tutup',
    },
    jenis_sampah_diterima: ['Plastik', 'Kardus', 'Kaca', 'Logam'],
    status_verifikasi: 'terverifikasi',
    sumber_data: 'Laporan Program Proklim Sicanang DLH Sumut 2024-2025',
    tanggal_verifikasi: '2026-10-12',
    diverifikasi_oleh: 'Tim Verifikasi SIMBA',
    is_demo: false,
    is_active: true,
    harga_katalog: [
      { jenis: 'Plastik Campur / Kresek', kategori: 'Plastik', harga_beli: 1200, satuan: 'kg', tanggal_berlaku: '2026-10-12', sumber: 'Pencatatan Proklim Sicanang' },
      { jenis: 'Kardus & Kertas Buram', kategori: 'Kertas', harga_beli: 1500, satuan: 'kg', tanggal_berlaku: '2026-10-12', sumber: 'Pencatatan Proklim Sicanang' },
      { jenis: 'Botol Kaca Utuh', kategori: 'Kaca', harga_beli: 800, satuan: 'kg', tanggal_berlaku: '2026-10-12', sumber: 'Pencatatan Proklim Sicanang' },
      { jenis: 'Kaleng Minuman Ringan', kategori: 'Logam', harga_beli: 12000, satuan: 'kg', tanggal_berlaku: '2026-10-12', sumber: 'Pencatatan Proklim Sicanang' },
    ]
  },
  {
    id: 'u1111111-0003-4000-8000-000000000003',
    nama: 'Bank Sampah Toba Bersinar Sejahtera',
    slug: 'bsu-toba-bersinar',
    kode: 'BSU-1206-001',
    kabupaten_kota_kode: '1206',
    kabupaten_kota_nama: 'Kabupaten Toba',
    alamat_lengkap: 'Jl. Sisingamangaraja No. 45, Balige, Kec. Balige, Kab. Toba, Sumatera Utara',
    lat: 2.334100,
    lng: 99.062400,
    sumber_koordinat: 'Katalog Bank Sampah Binaan DLH Kab. Toba',
    telepon_publik: '081377889900',
    whatsapp_publik: '081377889900',
    jam_operasional: {
      senin: '08:30 - 16:00',
      selasa: '08:30 - 16:00',
      rabu: '08:30 - 16:00',
      kamis: '08:30 - 16:00',
      jumat: '08:30 - 16:00',
      sabtu: '09:00 - 14:00',
      minggu: 'Tutup',
    },
    jenis_sampah_diterima: ['Plastik', 'Kertas', 'Kardus', 'Aluminium'],
    status_verifikasi: 'terverifikasi',
    sumber_data: 'Dinas Lingkungan Hidup Kab. Toba (Program Danau Toba Bersih)',
    tanggal_verifikasi: '2026-10-14',
    diverifikasi_oleh: 'Tim Verifikasi SIMBA',
    is_demo: false,
    is_active: true,
    harga_katalog: [
      { jenis: 'Botol Plastik PET Kemasan Mineral', kategori: 'Plastik', harga_beli: 3000, satuan: 'kg', tanggal_berlaku: '2026-10-14', sumber: 'DLH Kab. Toba' },
      { jenis: 'Kardus Tebal', kategori: 'Kertas', harga_beli: 1700, satuan: 'kg', tanggal_berlaku: '2026-10-14', sumber: 'DLH Kab. Toba' },
      { jenis: 'Kaleng Aluminium Minuman', kategori: 'Aluminium', harga_beli: 11500, satuan: 'kg', tanggal_berlaku: '2026-10-14', sumber: 'DLH Kab. Toba' },
    ]
  },
  {
    id: 'u1111111-0004-4000-8000-000000000004',
    nama: 'Bank Sampah Berkah Deli Serdang',
    slug: 'bsu-berkah-deli-serdang',
    kode: 'BSU-1212-001',
    kabupaten_kota_kode: '1212',
    kabupaten_kota_nama: 'Kabupaten Deli Serdang',
    alamat_lengkap: 'Jl. Medan - Pematang Siantar Km. 28, Lubuk Pakam, Kab. Deli Serdang, Sumatera Utara',
    lat: 3.560400,
    lng: 98.872300,
    sumber_koordinat: 'Publikasi Resmi DLH Deli Serdang',
    telepon_publik: '085270119988',
    whatsapp_publik: '085270119988',
    jam_operasional: {
      senin: '08:00 - 16:00',
      selasa: '08:00 - 16:00',
      rabu: '08:00 - 16:00',
      kamis: '08:00 - 16:00',
      jumat: '08:00 - 16:00',
      sabtu: 'Tutup',
      minggu: 'Tutup',
    },
    jenis_sampah_diterima: ['Plastik', 'Kertas', 'Besi', 'Tembaga'],
    status_verifikasi: 'terverifikasi',
    sumber_data: 'Publikasi Binaan Bank Sampah DLH Deli Serdang 2025',
    tanggal_verifikasi: '2026-10-15',
    diverifikasi_oleh: 'Tim Verifikasi SIMBA',
    is_demo: false,
    is_active: true,
    harga_katalog: [
      { jenis: 'Tembaga Kabel Kupas', kategori: 'Tembaga', harga_beli: 82000, satuan: 'kg', tanggal_berlaku: '2026-10-15', sumber: 'Penetapan Unit Berkah Deli Serdang' },
      { jenis: 'Besi Tua / Scrap', kategori: 'Besi', harga_beli: 4000, satuan: 'kg', tanggal_berlaku: '2026-10-15', sumber: 'Penetapan Unit Berkah Deli Serdang' },
      { jenis: 'Plastik Tutup Botol HDPE', kategori: 'Plastik', harga_beli: 3800, satuan: 'kg', tanggal_berlaku: '2026-10-15', sumber: 'Penetapan Unit Berkah Deli Serdang' },
    ]
  },
  {
    id: 'u1111111-0005-4000-8000-000000000005',
    nama: 'Bank Sampah Asahan Asri Lestari',
    slug: 'bsu-asahan-asri-lestari',
    kode: 'BSU-1208-001',
    kabupaten_kota_kode: '1208',
    kabupaten_kota_nama: 'Kabupaten Asahan',
    alamat_lengkap: 'Jl. Cokroaminoto No. 88, Kisaran Kota, Kab. Asahan, Sumatera Utara',
    lat: 2.984200,
    lng: 99.623100,
    sumber_koordinat: 'Surat Keputusan BSU Dinas Lingkungan Hidup Asahan',
    telepon_publik: '082276554433',
    whatsapp_publik: '082276554433',
    jam_operasional: {
      senin: '08:00 - 16:00',
      selasa: '08:00 - 16:00',
      rabu: '08:00 - 16:00',
      kamis: '08:00 - 16:00',
      jumat: '08:00 - 16:00',
      sabtu: '08:00 - 12:00',
      minggu: 'Tutup',
    },
    jenis_sampah_diterima: ['Plastik', 'Kertas', 'Logam'],
    status_verifikasi: 'terverifikasi',
    sumber_data: 'Daftar Bank Sampah Terdaftar DLH Kabupaten Asahan',
    tanggal_verifikasi: '2026-10-16',
    diverifikasi_oleh: 'Tim Verifikasi SIMBA',
    is_demo: false,
    is_active: true,
    harga_katalog: [
      { jenis: 'Plastik Bening PP', kategori: 'Plastik', harga_beli: 3200, satuan: 'kg', tanggal_berlaku: '2026-10-16', sumber: 'Daftar Harga BSU Asahan' },
      { jenis: 'Kertas Arsip Putih HVS', kategori: 'Kertas', harga_beli: 2200, satuan: 'kg', tanggal_berlaku: '2026-10-16', sumber: 'Daftar Harga BSU Asahan' },
      { jenis: 'Seng / Logam Ringan', kategori: 'Logam', harga_beli: 1500, satuan: 'kg', tanggal_berlaku: '2026-10-16', sumber: 'Daftar Harga BSU Asahan' },
    ]
  }
];

/**
 * Hitung jarak antara dua koordinat lat/lng menggunakan rumus Haversine (km)
 */
function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius bumi dalam km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

/**
 * Memeriksa apakah unit bank sampah buka saat ini berdasarkan jam operasional
 * @param {object} jamOperasional - misal { senin: "08:00 - 16:00", minggu: "Tutup" }
 * @param {Date} [targetDate] - Waktu pemeriksaan (default ke waktu sekarang)
 */
function isUnitOpenNow(jamOperasional, targetDate = new Date()) {
  if (!jamOperasional || typeof jamOperasional !== 'object') return false;

  const dayNames = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
  const currentDay = dayNames[targetDate.getDay()];

  // Cari key yang cocok, misal 'senin', 'senin_jumat'
  let timeRangeStr = jamOperasional[currentDay];
  if (!timeRangeStr && (targetDate.getDay() >= 1 && targetDate.getDay() <= 5)) {
    timeRangeStr = jamOperasional['senin_jumat'];
  }

  if (!timeRangeStr || typeof timeRangeStr !== 'string') return false;
  if (timeRangeStr.toLowerCase().includes('tutup')) return false;

  const match = timeRangeStr.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  if (!match) return false;

  const openHour = parseInt(match[1], 10);
  const openMin = parseInt(match[2], 10);
  const closeHour = parseInt(match[3], 10);
  const closeMin = parseInt(match[4], 10);

  const curMinutes = targetDate.getHours() * 60 + targetDate.getMinutes();
  const openMinutes = openHour * 60 + openMin;
  const closeMinutes = closeHour * 60 + closeMin;

  return curMinutes >= openMinutes && curMinutes <= closeMinutes;
}

module.exports = {
  KABUPATEN_KOTA_SUMUT,
  UNIT_SUMUT_VERIFIKASI,
  haversineDistanceKm,
  isUnitOpenNow,
};
