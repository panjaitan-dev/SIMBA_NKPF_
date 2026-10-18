-- ============================================================
-- SIMBA Nusantara — Migrasi Skema Track 2: Direktori, Usulan, Laporan Keliru & Minat Provinsi
-- ============================================================

-- 1. Tabel Usulan Bank Sampah Baru (Publik -> Antrian Admin)
CREATE TABLE IF NOT EXISTS public.usulan_bank_sampah (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama VARCHAR(150) NOT NULL CHECK (char_length(trim(nama)) >= 3),
  kabupaten_kota_kode CHAR(4) NOT NULL REFERENCES public.kabupaten_kota(kode),
  alamat_lengkap TEXT NOT NULL CHECK (char_length(trim(alamat_lengkap)) >= 10),
  lat DECIMAL(9,6),
  lng DECIMAL(9,6),
  telepon VARCHAR(25),
  nama_pengusul VARCHAR(100) NOT NULL,
  email_pengusul VARCHAR(100),
  catatan TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'menunggu_verifikasi'
    CHECK (status IN ('menunggu_verifikasi', 'disetujui', 'ditolak')),
  catatan_admin TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Laporan Data Keliru (Warga -> Antrian Admin)
CREATE TABLE IF NOT EXISTS public.laporan_data_keliru (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID NOT NULL REFERENCES public.unit_bank_sampah(id) ON DELETE CASCADE,
  jenis_kekeliruan VARCHAR(50) NOT NULL 
    CHECK (jenis_kekeliruan IN ('alamat_salah', 'nomor_tidak_aktif', 'jam_tutup', 'harga_berbeda', 'lainnya')),
  deskripsi TEXT NOT NULL CHECK (char_length(trim(deskripsi)) >= 10),
  data_usulan_koreksi TEXT,
  nama_pelapor VARCHAR(100),
  kontak_pelapor VARCHAR(50),
  status VARCHAR(30) NOT NULL DEFAULT 'antrian'
    CHECK (status IN ('antrian', 'ditinjau', 'selesai', 'diabaikan')),
  catatan_admin TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Minat Pengajuan Provinsi ("Ajukan Provinsi Saya")
CREATE TABLE IF NOT EXISTS public.provinsi_minat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provinsi_kode CHAR(2) NOT NULL REFERENCES public.provinsi(kode) ON DELETE CASCADE,
  peran VARCHAR(30) NOT NULL CHECK (peran IN ('warga', 'pengelola', 'pemda', 'lainnya')),
  email VARCHAR(100),
  catatan TEXT,
  ip_hash VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_usulan_status ON public.usulan_bank_sampah(status);
CREATE INDEX IF NOT EXISTS idx_laporan_keliru_unit ON public.laporan_data_keliru(unit_id, status);
CREATE INDEX IF NOT EXISTS idx_provinsi_minat_kode ON public.provinsi_minat(provinsi_kode);
