-- ============================================================
-- SIMBA Nusantara — Migrasi Skema Track 1: Fondasi Data Asli Sumut
-- Arsitektur: Pilot Sumatera Utara & Siap 38 Provinsi
-- ============================================================

-- 1. Tabel Master 38 Provinsi
CREATE TABLE IF NOT EXISTS public.provinsi (
  kode CHAR(2) PRIMARY KEY,
  kode_iso CHAR(2) NOT NULL UNIQUE,
  nama VARCHAR(100) NOT NULL,
  ibukota VARCHAR(100) NOT NULL,
  pulau VARCHAR(50) NOT NULL,
  status_layanan VARCHAR(30) NOT NULL DEFAULT 'belum_tersedia' 
    CHECK (status_layanan IN ('aktif_pilot', 'belum_tersedia')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed 38 Provinsi Indonesia (Status: Hanya Sumatera Utara aktif_pilot, 37 lainnya belum_tersedia)
INSERT INTO public.provinsi (kode, kode_iso, nama, ibukota, pulau, status_layanan) VALUES
-- SUMATERA
('11', 'AC', 'Aceh', 'Banda Aceh', 'Sumatera', 'belum_tersedia'),
('12', 'SU', 'Sumatera Utara', 'Medan', 'Sumatera', 'aktif_pilot'),
('13', 'SB', 'Sumatera Barat', 'Padang', 'Sumatera', 'belum_tersedia'),
('14', 'RI', 'Riau', 'Pekanbaru', 'Sumatera', 'belum_tersedia'),
('15', 'JA', 'Jambi', 'Jambi', 'Sumatera', 'belum_tersedia'),
('16', 'SS', 'Sumatera Selatan', 'Palembang', 'Sumatera', 'belum_tersedia'),
('17', 'BE', 'Bengkulu', 'Bengkulu', 'Sumatera', 'belum_tersedia'),
('18', 'LA', 'Lampung', 'Bandar Lampung', 'Sumatera', 'belum_tersedia'),
('19', 'BB', 'Kepulauan Bangka Belitung', 'Pangkalpinang', 'Sumatera', 'belum_tersedia'),
('21', 'KR', 'Kepulauan Riau', 'Tanjungpinang', 'Sumatera', 'belum_tersedia'),
-- JAWA
('31', 'JK', 'DKI Jakarta', 'Jakarta Pusat', 'Jawa', 'belum_tersedia'),
('32', 'JB', 'Jawa Barat', 'Bandung', 'Jawa', 'belum_tersedia'),
('33', 'JT', 'Jawa Tengah', 'Semarang', 'Jawa', 'belum_tersedia'),
('34', 'YO', 'DI Yogyakarta', 'Yogyakarta', 'Jawa', 'belum_tersedia'),
('35', 'JI', 'Jawa Timur', 'Surabaya', 'Jawa', 'belum_tersedia'),
('36', 'BT', 'Banten', 'Serang', 'Jawa', 'belum_tersedia'),
-- BALI & NUSA TENGGARA
('51', 'BA', 'Bali', 'Denpasar', 'Bali & Nusa Tenggara', 'belum_tersedia'),
('52', 'NB', 'Nusa Tenggara Barat', 'Mataram', 'Bali & Nusa Tenggara', 'belum_tersedia'),
('53', 'NT', 'Nusa Tenggara Timur', 'Kupang', 'Bali & Nusa Tenggara', 'belum_tersedia'),
-- KALIMANTAN
('61', 'KB', 'Kalimantan Barat', 'Pontianak', 'Kalimantan', 'belum_tersedia'),
('62', 'KT', 'Kalimantan Tengah', 'Palangka Raya', 'Kalimantan', 'belum_tersedia'),
('63', 'KS', 'Kalimantan Selatan', 'Banjarmasin', 'Kalimantan', 'belum_tersedia'),
('64', 'KI', 'Kalimantan Timur', 'Samarinda', 'Kalimantan', 'belum_tersedia'),
('65', 'KU', 'Kalimantan Utara', 'Tanjung Selor', 'Kalimantan', 'belum_tersedia'),
-- SULAWESI
('71', 'SW', 'Sulawesi Utara', 'Manado', 'Sulawesi', 'belum_tersedia'),
('72', 'ST', 'Sulawesi Tengah', 'Palu', 'Sulawesi', 'belum_tersedia'),
('73', 'SN', 'Sulawesi Selatan', 'Makassar', 'Sulawesi', 'belum_tersedia'),
('74', 'SG', 'Sulawesi Tenggara', 'Kendari', 'Sulawesi', 'belum_tersedia'),
('75', 'GO', 'Gorontalo', 'Gorontalo', 'Sulawesi', 'belum_tersedia'),
('76', 'SR', 'Sulawesi Barat', 'Mamuju', 'Sulawesi', 'belum_tersedia'),
-- MALUKU & PAPUA
('81', 'MA', 'Maluku', 'Ambon', 'Maluku & Papua', 'belum_tersedia'),
('82', 'MU', 'Maluku Utara', 'Sofifi', 'Maluku & Papua', 'belum_tersedia'),
('91', 'PA', 'Papua', 'Jayapura', 'Maluku & Papua', 'belum_tersedia'),
('92', 'PB', 'Papua Barat', 'Manokwari', 'Maluku & Papua', 'belum_tersedia'),
('93', 'PS', 'Papua Selatan', 'Merauke', 'Maluku & Papua', 'belum_tersedia'),
('94', 'PT', 'Papua Tengah', 'Nabire', 'Maluku & Papua', 'belum_tersedia'),
('95', 'PP', 'Papua Pegunungan', 'Jayawijaya', 'Maluku & Papua', 'belum_tersedia'),
('96', 'PD', 'Papua Barat Daya', 'Sorong', 'Maluku & Papua', 'belum_tersedia')
ON CONFLICT (kode) DO UPDATE SET
  status_layanan = EXCLUDED.status_layanan,
  nama = EXCLUDED.nama,
  ibukota = EXCLUDED.ibukota,
  pulau = EXCLUDED.pulau;

-- 2. Tabel Master 33 Kabupaten/Kota di Sumatera Utara (Resmi BPS / Kemendagri)
CREATE TABLE IF NOT EXISTS public.kabupaten_kota (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kode CHAR(4) UNIQUE NOT NULL,
  provinsi_kode CHAR(2) NOT NULL REFERENCES public.provinsi(kode) ON DELETE RESTRICT,
  nama VARCHAR(100) NOT NULL,
  jenis VARCHAR(20) NOT NULL CHECK (jenis IN ('kabupaten', 'kota')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed 33 Kabupaten/Kota Resmi Sumatera Utara (Kode BPS 1201 s/d 1278)
INSERT INTO public.kabupaten_kota (kode, provinsi_kode, nama, jenis) VALUES
('1201', '12', 'Kabupaten Nias', 'kabupaten'),
('1202', '12', 'Kabupaten Mandailing Natal', 'kabupaten'),
('1203', '12', 'Kabupaten Tapanuli Selatan', 'kabupaten'),
('1204', '12', 'Kabupaten Tapanuli Tengah', 'kabupaten'),
('1205', '12', 'Kabupaten Tapanuli Utara', 'kabupaten'),
('1206', '12', 'Kabupaten Toba', 'kabupaten'),
('1207', '12', 'Kabupaten Labuhanbatu', 'kabupaten'),
('1208', '12', 'Kabupaten Asahan', 'kabupaten'),
('1209', '12', 'Kabupaten Simalungun', 'kabupaten'),
('1210', '12', 'Kabupaten Dairi', 'kabupaten'),
('1211', '12', 'Kabupaten Karo', 'kabupaten'),
('1212', '12', 'Kabupaten Deli Serdang', 'kabupaten'),
('1213', '12', 'Kabupaten Langkat', 'kabupaten'),
('1214', '12', 'Kabupaten Nias Selatan', 'kabupaten'),
('1215', '12', 'Kabupaten Humbang Hasundutan', 'kabupaten'),
('1216', '12', 'Kabupaten Pakpak Bharat', 'kabupaten'),
('1217', '12', 'Kabupaten Samosir', 'kabupaten'),
('1218', '12', 'Kabupaten Serdang Bedagai', 'kabupaten'),
('1219', '12', 'Kabupaten Batu Bara', 'kabupaten'),
('1220', '12', 'Kabupaten Padang Lawas Utara', 'kabupaten'),
('1221', '12', 'Kabupaten Padang Lawas', 'kabupaten'),
('1222', '12', 'Kabupaten Labuhanbatu Selatan', 'kabupaten'),
('1223', '12', 'Kabupaten Labuhanbatu Utara', 'kabupaten'),
('1224', '12', 'Kabupaten Nias Utara', 'kabupaten'),
('1225', '12', 'Kabupaten Nias Barat', 'kabupaten'),
('1271', '12', 'Kota Sibolga', 'kota'),
('1272', '12', 'Kota Tanjungbalai', 'kota'),
('1273', '12', 'Kota Pematangsiantar', 'kota'),
('1274', '12', 'Kota Tebing Tinggi', 'kota'),
('1275', '12', 'Kota Medan', 'kota'),
('1276', '12', 'Kota Binjai', 'kota'),
('1277', '12', 'Kota Padangsidimpuan', 'kota'),
('1278', '12', 'Kota Gunungsitoli', 'kota')
ON CONFLICT (kode) DO UPDATE SET
  nama = EXCLUDED.nama,
  jenis = EXCLUDED.jenis;

-- 3. Penambahan Kolom Validasi & Audit pada Tabel unit_bank_sampah
ALTER TABLE public.unit_bank_sampah
  ADD COLUMN IF NOT EXISTS slug VARCHAR(120) UNIQUE,
  ADD COLUMN IF NOT EXISTS kabupaten_kota_id UUID REFERENCES public.kabupaten_kota(id),
  ADD COLUMN IF NOT EXISTS alamat_lengkap TEXT,
  ADD COLUMN IF NOT EXISTS lat DECIMAL(9,6) CHECK (lat IS NULL OR (lat >= -1.0 AND lat <= 4.5)),
  ADD COLUMN IF NOT EXISTS lng DECIMAL(9,6) CHECK (lng IS NULL OR (lng >= 96.5 AND lng <= 101.0)),
  ADD COLUMN IF NOT EXISTS sumber_koordinat VARCHAR(150),
  ADD COLUMN IF NOT EXISTS telepon_publik VARCHAR(25) CHECK (telepon_publik IS NULL OR char_length(telepon_publik) <= 25),
  ADD COLUMN IF NOT EXISTS whatsapp_publik VARCHAR(25) CHECK (whatsapp_publik IS NULL OR char_length(whatsapp_publik) <= 25),
  ADD COLUMN IF NOT EXISTS jam_operasional JSONB DEFAULT '{"senin_jumat": "08:00 - 16:00", "sabtu": "08:00 - 14:00", "minggu": "Tutup"}'::jsonb,
  ADD COLUMN IF NOT EXISTS jenis_sampah_diterima TEXT[] DEFAULT ARRAY['Plastik', 'Kertas', 'Logam']::TEXT[],
  ADD COLUMN IF NOT EXISTS status_verifikasi VARCHAR(30) NOT NULL DEFAULT 'belum_diverifikasi'
    CHECK (status_verifikasi IN ('terverifikasi', 'belum_diverifikasi')),
  ADD COLUMN IF NOT EXISTS sumber_data TEXT,
  ADD COLUMN IF NOT EXISTS tanggal_verifikasi DATE,
  ADD COLUMN IF NOT EXISTS diverifikasi_oleh VARCHAR(100),
  ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 4. Tabel unit_harga (Harga Pembelian Sampah per Unit)
CREATE TABLE IF NOT EXISTS public.unit_harga (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID NOT NULL REFERENCES public.unit_bank_sampah(id) ON DELETE CASCADE,
  jenis_sampah_id UUID NOT NULL REFERENCES public.jenis_sampah(id) ON DELETE RESTRICT,
  harga_beli DECIMAL(10, 2) NOT NULL CHECK (harga_beli >= 0),
  tanggal_berlaku DATE NOT NULL DEFAULT CURRENT_DATE,
  sumber TEXT NOT NULL CHECK (char_length(trim(sumber)) >= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_unit_jenis UNIQUE (unit_id, jenis_sampah_id)
);

-- Index Pencarian Cepat
CREATE INDEX IF NOT EXISTS idx_unit_kabupaten ON public.unit_bank_sampah(kabupaten_kota_id);
CREATE INDEX IF NOT EXISTS idx_unit_status_demo ON public.unit_bank_sampah(status_verifikasi, is_demo);
CREATE INDEX IF NOT EXISTS idx_unit_harga_unit ON public.unit_harga(unit_id);
