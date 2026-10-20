/**
 * constants.ts — Sumber data fallback terpusat untuk SIMBA Indonesia
 *
 * Semua DEFAULT_* diletakkan di sini agar tidak ada cross-import antar
 * page files. Setiap page/form yang butuh data offline HARUS import dari sini.
 */

// ─── Jenis Sampah ────────────────────────────────────────────────────────────

export const DEFAULT_JENIS_SAMPAH = [
  {
    id: 'js-1',
    kode: 'LG-TMB01',
    nama: 'Tembaga Super (Kabel Kupas)',
    kategori: 'logam',
    satuan: 'kg',
    harga_beli: 85000,
    harga_jual: 95000,
    stok_tersedia_kg: 45.5,
    deskripsi: 'Kawat tembaga murni tanpa isolator, mengkilap dan bersih.',
    is_active: true,
  },
  {
    id: 'js-2',
    kode: 'LG-ALM01',
    nama: 'Aluminium Kaleng Minuman',
    kategori: 'logam',
    satuan: 'kg',
    harga_beli: 14000,
    harga_jual: 18000,
    stok_tersedia_kg: 120.0,
    deskripsi: 'Kaleng minuman aluminium ringan tanpa isi cairan.',
    is_active: true,
  },
  {
    id: 'js-3',
    kode: 'LG-ALM02',
    nama: 'Aluminium Profil / Tebal',
    kategori: 'logam',
    satuan: 'kg',
    harga_beli: 16000,
    harga_jual: 21000,
    stok_tersedia_kg: 85.0,
    deskripsi: 'Sisa kusen aluminium, plat tebal, dan wajan bekas bersih.',
    is_active: true,
  },
  {
    id: 'js-4',
    kode: 'PLS-PET01',
    nama: 'Botol Plastik PET Bening',
    kategori: 'anorganik',
    satuan: 'kg',
    harga_beli: 3500,
    harga_jual: 4800,
    stok_tersedia_kg: 340.0,
    deskripsi: 'Botol air mineral transparan, label dan tutup dilepas.',
    is_active: true,
  },
  {
    id: 'js-5',
    kode: 'PLS-HDP02',
    nama: 'Plastik HDPE / Emberan',
    kategori: 'anorganik',
    satuan: 'kg',
    harga_beli: 2800,
    harga_jual: 4000,
    stok_tersedia_kg: 210.0,
    deskripsi: 'Ember, baskom, jerigen warna-warni bersih.',
    is_active: true,
  },
  {
    id: 'js-6',
    kode: 'KRT-KRD01',
    nama: 'Kardus Box Cokelat Tebal',
    kategori: 'anorganik',
    satuan: 'kg',
    harga_beli: 1800,
    harga_jual: 2500,
    stok_tersedia_kg: 520.0,
    deskripsi: 'Kardus kemasan cokelat kondisi kering dan dilipat rapi.',
    is_active: true,
  },
  {
    id: 'js-7',
    kode: 'LG-BSI01',
    nama: 'Besi Padu / Besi Bangunan',
    kategori: 'logam',
    satuan: 'kg',
    harga_beli: 4500,
    harga_jual: 6000,
    stok_tersedia_kg: 480.0,
    deskripsi: 'Besi plat tebal, besi beton, dan rangka kontruksi.',
    is_active: true,
  },
  {
    id: 'js-8',
    kode: 'MNY-JLT01',
    nama: 'Minyak Jelantah Berkualitas',
    kategori: 'lainnya',
    satuan: 'liter',
    harga_beli: 7000,
    harga_jual: 9000,
    stok_tersedia_kg: 180.0,
    deskripsi: 'Minyak goreng bekas pakai, disaring tanpa remah makanan.',
    is_active: true,
  },
]

// ─── Nasabah ──────────────────────────────────────────────────────────────────

export const DEFAULT_NASABAH = [
  { id: 'nas-1', nomor_nasabah: 'NSB-001', nama_lengkap: 'Budi Santoso', nomor_hp: '0812-6012-3401', alamat: 'Jl. Merdeka No. 45' },
  { id: 'nas-2', nomor_nasabah: 'NSB-002', nama_lengkap: 'Siti Rahmawati', nomor_hp: '0813-7521-8902', alamat: 'Komp. Asri Blok D3' },
  { id: 'nas-3', nomor_nasabah: 'NSB-003', nama_lengkap: 'Ahmad Fauzi', nomor_hp: '0821-6890-4523', alamat: 'Kel. Sukamaju RT 02/04' },
  { id: 'nas-4', nomor_nasabah: 'NSB-004', nama_lengkap: 'Dewi Lestari', nomor_hp: '0852-7014-9981', alamat: 'Perum Harapan Indah No. 12' },
]

// ─── Klien / Offtaker ─────────────────────────────────────────────────────────

export const DEFAULT_CLIENTS = [
  {
    id: 'cl-1',
    kode_client: 'CLN-001',
    nama_client: 'PT Daur Logam Nusantara',
    perusahaan: 'Pabrik Peleburan Tembaga & Aluminium',
    komoditas: 'Logam (Tembaga, Aluminium, Besi)',
    alamat: 'Kawasan Industri Pulogadung Blok B No. 12, Jakarta Timur',
    nomor_hp: '0812-9901-2234',
    status_aktif: true,
  },
  {
    id: 'cl-2',
    kode_client: 'CLN-002',
    nama_client: 'UD Plastik Berkah Mandiri',
    perusahaan: 'Pengepul & Penggilingan Plastik',
    komoditas: 'Plastik (PET, HDPE, PP)',
    alamat: 'Jl. Raya Narogong Km. 12, Bantar Gebang, Bekasi',
    nomor_hp: '0813-8812-4456',
    status_aktif: true,
  },
  {
    id: 'cl-3',
    kode_client: 'CLN-003',
    nama_client: 'PT Pabrik Kertas Sumber Jaya',
    perusahaan: 'Industri Pulp & Paper Daur Ulang',
    komoditas: 'Kardus Box, Kertas HVS & Koran',
    alamat: 'Jl. Industri Rungkut Blok C No. 45, Surabaya',
    nomor_hp: '0821-3345-7789',
    status_aktif: true,
  },
  {
    id: 'cl-4',
    kode_client: 'CLN-004',
    nama_client: 'CV Bio-Energi Jelantah Indonesia',
    perusahaan: 'Pengolah Biodiesel Ramah Lingkungan',
    komoditas: 'Minyak Jelantah Rumah Tangga & Resto',
    alamat: 'Jl. Soekarno-Hatta No. 88, Gedebage, Bandung',
    nomor_hp: '0852-4456-9901',
    status_aktif: true,
  },
]

// ─── Setoran (Pembelian dari Nasabah) ─────────────────────────────────────────

export const DEFAULT_SETORAN = [
  {
    id: 'set-1',
    nomor_setoran: 'NOT-BELI-892101',
    nama_nasabah: 'Budi Santoso',
    nomor_nasabah: 'NSB-001',
    unit_nama: 'Bank Sampah Unit Pusat',
    tanggal_setoran: '2026-10-06',
    total_nilai: 285000,
    status: 'diverifikasi',
    catatan: 'Tembaga kabel kupas 3 kg & Kardus 15 kg',
    items: [
      { nama: 'Tembaga Super', kode: 'LG-TMB01', berat_kg: 3, harga_satuan: 85000, subtotal: 255000 },
      { nama: 'Kardus Box Cokelat', kode: 'KRT-KRD01', berat_kg: 15, harga_satuan: 2000, subtotal: 30000 },
    ],
  },
  {
    id: 'set-2',
    nomor_setoran: 'NOT-BELI-892102',
    nama_nasabah: 'Siti Rahmawati',
    nomor_nasabah: 'NSB-002',
    unit_nama: 'Bank Sampah Unit Melati',
    tanggal_setoran: '2026-10-06',
    total_nilai: 142000,
    status: 'diverifikasi',
    catatan: 'Aluminium kaleng 8 kg & PET 8.5 kg',
    items: [
      { nama: 'Aluminium Kaleng Minuman', kode: 'LG-ALM01', berat_kg: 8, harga_satuan: 14000, subtotal: 112000 },
      { nama: 'Botol Plastik PET Bening', kode: 'PLS-PET01', berat_kg: 8.5, harga_satuan: 3500, subtotal: 29750 },
    ],
  },
  {
    id: 'set-3',
    nomor_setoran: 'NOT-BELI-892103',
    nama_nasabah: 'Ahmad Fauzi',
    nomor_nasabah: 'NSB-003',
    unit_nama: 'Bank Sampah Unit Anggrek',
    tanggal_setoran: '2026-10-05',
    total_nilai: 67500,
    status: 'pending',
    catatan: 'Besi tua 15 kg',
    items: [
      { nama: 'Besi Padu / Besi Bangunan', kode: 'LG-BSI01', berat_kg: 15, harga_satuan: 4500, subtotal: 67500 },
    ],
  },
]

// ─── Penjualan (ke Offtaker / Klien) ─────────────────────────────────────────

export const DEFAULT_PENJUALAN = [
  {
    id: 'pj-1',
    nomor_faktur: 'FAK-JUAL-771201',
    nama_client: 'PT Daur Logam Nusantara',
    kode_client: 'CLN-001',
    tanggal_penjualan: '2026-10-06',
    total_berat_kg: 65.5,
    total_nominal: 5850000,
    status_pembayaran: 'Lunas / Transfer',
    nomor_truk: 'B 9842 UXZ',
    items: [
      { nama: 'Tembaga Super (Kabel Kupas)', kode: 'LG-TMB01', berat_kg: 45, harga_satuan: 95000, subtotal: 4275000 },
      { nama: 'Aluminium Profil / Tebal', kode: 'LG-ALM02', berat_kg: 20.5, harga_satuan: 21000, subtotal: 430500 },
    ],
  },
  {
    id: 'pj-2',
    nomor_faktur: 'FAK-JUAL-771202',
    nama_client: 'UD Plastik Berkah Mandiri',
    kode_client: 'CLN-002',
    tanggal_penjualan: '2026-10-05',
    total_berat_kg: 420.0,
    total_nominal: 1848000,
    status_pembayaran: 'Lunas / Transfer',
    nomor_truk: 'B 9123 POQ',
    items: [
      { nama: 'Botol Plastik PET Bening', kode: 'PLS-PET01', berat_kg: 250, harga_satuan: 4800, subtotal: 1200000 },
      { nama: 'Plastik HDPE / Emberan', kode: 'PLS-HDP02', berat_kg: 170, harga_satuan: 4000, subtotal: 680000 },
    ],
  },
  {
    id: 'pj-3',
    nomor_faktur: 'FAK-JUAL-771203',
    nama_client: 'PT Pabrik Kertas Sumber Jaya',
    kode_client: 'CLN-003',
    tanggal_penjualan: '2026-10-04',
    total_berat_kg: 850.0,
    total_nominal: 2125000,
    status_pembayaran: 'Tempo (14 Hari)',
    nomor_truk: 'L 8821 KJ',
    items: [
      { nama: 'Kardus Box Cokelat Tebal', kode: 'KRT-KRD01', berat_kg: 850, harga_satuan: 2500, subtotal: 2125000 },
    ],
  },
]
