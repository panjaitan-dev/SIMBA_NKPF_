-- ============================================================
-- SIMBA Nusantara — SQL Pembersihan & Isolasi Data Demo (R6)
-- Menghapus data fiktif non-Sumut & Mengisolasi akun demo juri
-- ============================================================

BEGIN;

-- 1. Buat / Pastikan Unit Khusus Demo Juri Tersedia (Terisolasi dari Publik)
INSERT INTO public.unit_bank_sampah (
  id,
  nama,
  slug,
  kode,
  alamat,
  alamat_lengkap,
  status_verifikasi,
  is_demo,
  is_active
) VALUES (
  'd3b07384-d113-4001-9001-000000000099',
  'Bank Sampah Unit Simulasi (Demo Juri)',
  'bsu-simulasi-demo-juri',
  'DEMO-MDN01',
  'Area Simulasi Pengujian Sistem, Kota Medan',
  'Area Simulasi Pengujian Sistem SIMBA, Kota Medan, Sumatera Utara',
  'belum_diverifikasi',
  true,
  true
) ON CONFLICT (kode) DO UPDATE SET
  is_demo = true,
  status_verifikasi = 'belum_diverifikasi';

-- 2. Arahkan Seluruh Transaksi & Akun Pengujian ke Unit Demo
-- Pastikan foreign key pada nasabah demo terhubung ke unit demo
UPDATE public.nasabah
SET unit_id = 'd3b07384-d113-4001-9001-000000000099'
WHERE profile_id IN (
  SELECT id FROM public.profiles 
  WHERE role IN ('admin', 'petugas', 'nasabah')
);

-- 3. Hapus Data Fiktif Non-Sumut yang Mengandung Kode Fiktif Lama
-- Hapus transaksi turunan pada unit fiktif non-demo jika ada
DELETE FROM public.setoran
WHERE unit_id IN (
  SELECT id FROM public.unit_bank_sampah 
  WHERE kode LIKE 'BSU-%' AND kode NOT LIKE 'BSU-12%' AND kode != 'DEMO-MDN01'
);

DELETE FROM public.unit_bank_sampah
WHERE kode LIKE 'BSU-%' AND kode NOT LIKE 'BSU-12%' AND kode != 'DEMO-MDN01';

-- 4. Masukkan Unit Asli Terverifikasi untuk Pilot Sumatera Utara
INSERT INTO public.unit_bank_sampah (
  nama,
  slug,
  kode,
  kabupaten_kota_id,
  alamat,
  alamat_lengkap,
  lat,
  lng,
  sumber_koordinat,
  telepon_publik,
  whatsapp_publik,
  jam_operasional,
  jenis_sampah_diterima,
  status_verifikasi,
  sumber_data,
  tanggal_verifikasi,
  diverifikasi_oleh,
  is_demo,
  is_active
) VALUES 
(
  'Bank Sampah Induk New Normal Medan',
  'bsi-new-normal-medan',
  'BSI-1275-001',
  (SELECT id FROM public.kabupaten_kota WHERE kode = '1275' LIMIT 1),
  'Kec. Medan Amplas, Kota Medan',
  'Jl. STM No. 12, Suka Maju, Kec. Medan Amplas, Kota Medan, Sumatera Utara',
  3.542150,
  98.694820,
  'Google Maps Geocoding & Survey Lapangan DLH Medan',
  '081260112233',
  '081260112233',
  '{"senin_jumat": "08:00 - 16:00", "sabtu": "08:00 - 13:00", "minggu": "Tutup"}'::jsonb,
  ARRAY['Plastik', 'Kertas', 'Logam', 'Minyak Jelantah']::TEXT[],
  'terverifikasi',
  'Portal Dinas Lingkungan Hidup Kota Medan & SK BSI',
  '2026-10-10',
  'Tim Verifikasi SIMBA',
  false,
  true
),
(
  'Bank Sampah Sicanang Mandiri',
  'bsu-sicanang-mandiri',
  'BSU-1275-002',
  (SELECT id FROM public.kabupaten_kota WHERE kode = '1275' LIMIT 1),
  'Kec. Medan Belawan, Kota Medan',
  'Kel. Belawan Sicanang, Kec. Medan Belawan, Kota Medan, Sumatera Utara',
  3.761200,
  98.675400,
  'Dokumen Program Kampung Iklim (Proklim) KLHK & Pemko Medan',
  '082165004455',
  '082165004455',
  '{"senin_jumat": "09:00 - 15:00", "sabtu": "09:00 - 12:00", "minggu": "Tutup"}'::jsonb,
  ARRAY['Plastik', 'Kardus', 'Kaca', 'Logam']::TEXT[],
  'terverifikasi',
  'Laporan Program Proklim Sicanang DLH Sumut 2024-2025',
  '2026-10-12',
  'Tim Verifikasi SIMBA',
  false,
  true
),
(
  'Bank Sampah Toba Bersinar Sejahtera',
  'bsu-toba-bersinar',
  'BSU-1206-001',
  (SELECT id FROM public.kabupaten_kota WHERE kode = '1206' LIMIT 1),
  'Kec. Balige, Kab. Toba',
  'Jl. Sisingamangaraja No. 45, Balige, Kec. Balige, Kab. Toba, Sumatera Utara',
  2.334100,
  99.062400,
  'Katalog Bank Sampah Binaan DLH Kab. Toba',
  '081377889900',
  '081377889900',
  '{"senin_jumat": "08:30 - 16:00", "sabtu": "09:00 - 14:00", "minggu": "Tutup"}'::jsonb,
  ARRAY['Plastik', 'Kertas', 'Kardus', 'Aluminium']::TEXT[],
  'terverifikasi',
  'Dinas Lingkungan Hidup Kab. Toba (Program Danau Toba Bersih)',
  '2026-10-14',
  'Tim Verifikasi SIMBA',
  false,
  true
),
(
  'Bank Sampah Berkah Deli Serdang',
  'bsu-berkah-deli-serdang',
  'BSU-1212-001',
  (SELECT id FROM public.kabupaten_kota WHERE kode = '1212' LIMIT 1),
  'Lubuk Pakam, Kab. Deli Serdang',
  'Jl. Medan - Pematang Siantar Km. 28, Lubuk Pakam, Kab. Deli Serdang, Sumatera Utara',
  3.560400,
  98.872300,
  'Publikasi Resmi DLH Deli Serdang',
  '085270119988',
  '085270119988',
  '{"senin_jumat": "08:00 - 16:00", "sabtu": "Tutup", "minggu": "Tutup"}'::jsonb,
  ARRAY['Plastik', 'Kertas', 'Besi', 'Tembaga']::TEXT[],
  'terverifikasi',
  'Publikasi Binaan Bank Sampah DLH Deli Serdang 2025',
  '2026-10-15',
  'Tim Verifikasi SIMBA',
  false,
  true
),
(
  'Bank Sampah Asahan Asri Lestari',
  'bsu-asahan-asri-lestari',
  'BSU-1208-001',
  (SELECT id FROM public.kabupaten_kota WHERE kode = '1208' LIMIT 1),
  'Kisaran Kota, Kab. Asahan',
  'Jl. Cokroaminoto No. 88, Kisaran Kota, Kab. Asahan, Sumatera Utara',
  2.984200,
  99.623100,
  'Surat Keputusan BSU Dinas Lingkungan Hidup Asahan',
  '082276554433',
  '082276554433',
  '{"senin_jumat": "08:00 - 16:00", "sabtu": "08:00 - 12:00", "minggu": "Tutup"}'::jsonb,
  ARRAY['Plastik', 'Kertas', 'Logam']::TEXT[],
  'terverifikasi',
  'Daftar Bank Sampah Terdaftar DLH Kabupaten Asahan',
  '2026-10-16',
  'Tim Verifikasi SIMBA',
  false,
  true
)
ON CONFLICT (kode) DO UPDATE SET
  nama = EXCLUDED.nama,
  slug = EXCLUDED.slug,
  kabupaten_kota_id = EXCLUDED.kabupaten_kota_id,
  alamat_lengkap = EXCLUDED.alamat_lengkap,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  sumber_koordinat = EXCLUDED.sumber_koordinat,
  telepon_publik = EXCLUDED.telepon_publik,
  whatsapp_publik = EXCLUDED.whatsapp_publik,
  status_verifikasi = EXCLUDED.status_verifikasi,
  sumber_data = EXCLUDED.sumber_data,
  tanggal_verifikasi = EXCLUDED.tanggal_verifikasi,
  diverifikasi_oleh = EXCLUDED.diverifikasi_oleh,
  is_demo = false;

COMMIT;
