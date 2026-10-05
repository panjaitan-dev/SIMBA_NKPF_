-- ============================================================
-- SIMBA — Sistem Informasi Bank Sampah
-- Database Schema untuk Supabase (PostgreSQL)
-- Jalankan di Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. PROFILES (extends Supabase Auth users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'nasabah' CHECK (role IN ('nasabah', 'petugas', 'admin')),
  nama_lengkap TEXT NOT NULL,
  nomor_hp TEXT,
  avatar_url TEXT,
  alamat TEXT,
  nik TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. UNIT BANK SAMPAH
-- ============================================================
CREATE TABLE IF NOT EXISTS public.unit_bank_sampah (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama TEXT NOT NULL,
  kode TEXT UNIQUE NOT NULL,
  alamat TEXT,
  koordinator TEXT,
  nomor_hp TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. NASABAH BANK SAMPAH
-- ============================================================
CREATE TABLE IF NOT EXISTS public.nasabah (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES public.unit_bank_sampah(id),
  nomor_nasabah TEXT UNIQUE NOT NULL,
  saldo DECIMAL(15, 2) DEFAULT 0.00,
  total_setoran_kg DECIMAL(10, 3) DEFAULT 0.000,
  is_active BOOLEAN DEFAULT TRUE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. JENIS SAMPAH & HARGA
-- ============================================================
CREATE TABLE IF NOT EXISTS public.jenis_sampah (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama TEXT NOT NULL,
  kode TEXT UNIQUE NOT NULL,
  kategori TEXT NOT NULL CHECK (kategori IN ('organik', 'anorganik', 'b3', 'lainnya')),
  satuan TEXT DEFAULT 'kg',
  harga_per_satuan DECIMAL(10, 2) NOT NULL DEFAULT 0,
  deskripsi TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. SETORAN SAMPAH (Transaksi Masuk)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.setoran (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nasabah_id UUID NOT NULL REFERENCES public.nasabah(id),
  petugas_id UUID REFERENCES public.profiles(id),
  unit_id UUID REFERENCES public.unit_bank_sampah(id),
  nomor_setoran TEXT UNIQUE NOT NULL,
  tanggal_setoran DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'diverifikasi', 'ditolak')),
  total_nilai DECIMAL(15, 2) DEFAULT 0,
  catatan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. DETAIL SETORAN (Item per jenis sampah)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.detail_setoran (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setoran_id UUID NOT NULL REFERENCES public.setoran(id) ON DELETE CASCADE,
  jenis_sampah_id UUID NOT NULL REFERENCES public.jenis_sampah(id),
  berat_kg DECIMAL(10, 3) NOT NULL,
  harga_satuan DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(15, 2) GENERATED ALWAYS AS (berat_kg * harga_satuan) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. PENARIKAN TABUNGAN
-- ============================================================
CREATE TABLE IF NOT EXISTS public.penarikan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nasabah_id UUID NOT NULL REFERENCES public.nasabah(id),
  petugas_id UUID REFERENCES public.profiles(id),
  nomor_penarikan TEXT UNIQUE NOT NULL,
  jumlah DECIMAL(15, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'disetujui', 'ditolak', 'dibayar')),
  catatan TEXT,
  tanggal_request TIMESTAMPTZ DEFAULT NOW(),
  tanggal_proses TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. BERITA
-- ============================================================
CREATE TABLE IF NOT EXISTS public.berita (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  judul TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  konten TEXT NOT NULL,
  ringkasan TEXT,
  thumbnail_url TEXT,
  kategori TEXT DEFAULT 'umum' CHECK (kategori IN ('umum', 'kegiatan', 'pengumuman', 'program')),
  tag TEXT[],
  penulis_id UUID REFERENCES public.profiles(id),
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. PENGUMUMAN
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pengumuman (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  judul TEXT NOT NULL,
  konten TEXT NOT NULL,
  file_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  tanggal_mulai DATE,
  tanggal_selesai DATE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 10. EDUKASI
-- ============================================================
CREATE TABLE IF NOT EXISTS public.edukasi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  judul TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  konten TEXT NOT NULL,
  ringkasan TEXT,
  thumbnail_url TEXT,
  kategori TEXT DEFAULT '3r' CHECK (kategori IN ('3r', 'bahaya_sampah', 'jenis_sampah', 'bank_sampah', 'lainnya')),
  urutan INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 11. GALERI ALBUM
-- ============================================================
CREATE TABLE IF NOT EXISTS public.galeri_album (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  judul TEXT NOT NULL,
  deskripsi TEXT,
  cover_url TEXT,
  lokasi TEXT,
  tanggal_kegiatan DATE,
  is_published BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 12. GALERI FOTO
-- ============================================================
CREATE TABLE IF NOT EXISTS public.galeri_foto (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  album_id UUID NOT NULL REFERENCES public.galeri_album(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  urutan INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 13. LAPORAN MASALAH LINGKUNGAN
-- ============================================================
CREATE TABLE IF NOT EXISTS public.laporan_lingkungan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pelapor_id UUID REFERENCES public.profiles(id),
  nama_pelapor TEXT,
  nomor_hp TEXT,
  judul TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  lokasi TEXT NOT NULL,
  koordinat_lat DECIMAL(10, 8),
  koordinat_lng DECIMAL(11, 8),
  foto_urls TEXT[],
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'diproses', 'selesai', 'ditolak')),
  petugas_id UUID REFERENCES public.profiles(id),
  catatan_petugas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- VIEWS
-- ============================================================

-- View: Ringkasan nasabah dengan nama
CREATE OR REPLACE VIEW public.v_nasabah AS
SELECT
  n.id,
  n.nomor_nasabah,
  n.saldo,
  n.total_setoran_kg,
  n.is_active,
  n.joined_at,
  p.nama_lengkap,
  p.nomor_hp,
  p.alamat,
  p.nik,
  u.nama AS unit_nama,
  u.kode AS unit_kode
FROM public.nasabah n
LEFT JOIN public.profiles p ON n.profile_id = p.id
LEFT JOIN public.unit_bank_sampah u ON n.unit_id = u.id;

-- View: Setoran dengan detail nasabah
CREATE OR REPLACE VIEW public.v_setoran AS
SELECT
  s.id,
  s.nomor_setoran,
  s.tanggal_setoran,
  s.status,
  s.total_nilai,
  s.catatan,
  s.created_at,
  n.nomor_nasabah,
  p.nama_lengkap AS nama_nasabah,
  pt.nama_lengkap AS nama_petugas,
  u.nama AS unit_nama
FROM public.setoran s
LEFT JOIN public.nasabah n ON s.nasabah_id = n.id
LEFT JOIN public.profiles p ON n.profile_id = p.id
LEFT JOIN public.profiles pt ON s.petugas_id = pt.id
LEFT JOIN public.unit_bank_sampah u ON s.unit_id = u.id;

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Fungsi: Auto-update saldo nasabah ketika setoran diverifikasi
CREATE OR REPLACE FUNCTION update_saldo_nasabah()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'diverifikasi' AND OLD.status != 'diverifikasi' THEN
    UPDATE public.nasabah
    SET 
      saldo = saldo + NEW.total_nilai,
      total_setoran_kg = total_setoran_kg + (
        SELECT COALESCE(SUM(berat_kg), 0)
        FROM public.detail_setoran
        WHERE setoran_id = NEW.id
      ),
      updated_at = NOW()
    WHERE id = NEW.nasabah_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_saldo
AFTER UPDATE ON public.setoran
FOR EACH ROW
EXECUTE FUNCTION update_saldo_nasabah();

-- Fungsi: Auto-update total_nilai setoran dari detail
CREATE OR REPLACE FUNCTION update_total_setoran()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.setoran
  SET total_nilai = (
    SELECT COALESCE(SUM(subtotal), 0)
    FROM public.detail_setoran
    WHERE setoran_id = NEW.setoran_id
  ),
  updated_at = NOW()
  WHERE id = NEW.setoran_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_total_setoran
AFTER INSERT OR UPDATE OR DELETE ON public.detail_setoran
FOR EACH ROW
EXECUTE FUNCTION update_total_setoran();

-- Fungsi: Kurangi saldo saat penarikan disetujui
CREATE OR REPLACE FUNCTION proses_penarikan()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'dibayar' AND OLD.status != 'dibayar' THEN
    UPDATE public.nasabah
    SET 
      saldo = saldo - NEW.jumlah,
      updated_at = NOW()
    WHERE id = NEW.nasabah_id;
    
    NEW.tanggal_proses = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_proses_penarikan
BEFORE UPDATE ON public.penarikan
FOR EACH ROW
EXECUTE FUNCTION proses_penarikan();

-- Trigger: auto update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_nasabah_updated_at BEFORE UPDATE ON public.nasabah FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_jenis_sampah_updated_at BEFORE UPDATE ON public.jenis_sampah FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_setoran_updated_at BEFORE UPDATE ON public.setoran FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_berita_updated_at BEFORE UPDATE ON public.berita FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_edukasi_updated_at BEFORE UPDATE ON public.edukasi FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_pengumuman_updated_at BEFORE UPDATE ON public.pengumuman FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_laporan_updated_at BEFORE UPDATE ON public.laporan_lingkungan FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nasabah ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.setoran ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detail_setoran ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.penarikan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.berita ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengumuman ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edukasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galeri_album ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galeri_foto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laporan_lingkungan ENABLE ROW LEVEL SECURITY;

-- Profiles: user bisa lihat & edit profil sendiri, admin bisa semua
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Berita: publik bisa baca yang published
CREATE POLICY "berita_public_read" ON public.berita FOR SELECT USING (is_published = TRUE);

-- Edukasi: publik bisa baca yang published
CREATE POLICY "edukasi_public_read" ON public.edukasi FOR SELECT USING (is_published = TRUE);

-- Galeri: publik bisa baca yang published
CREATE POLICY "galeri_public_read" ON public.galeri_album FOR SELECT USING (is_published = TRUE);
CREATE POLICY "galeri_foto_public_read" ON public.galeri_foto FOR SELECT USING (TRUE);

-- Pengumuman: publik bisa baca yang aktif
CREATE POLICY "pengumuman_public_read" ON public.pengumuman FOR SELECT USING (is_active = TRUE);

-- Nasabah: hanya bisa lihat data sendiri
CREATE POLICY "nasabah_select_own" ON public.nasabah FOR SELECT USING (
  profile_id = auth.uid()
);

-- Setoran: nasabah hanya bisa lihat setoran sendiri
CREATE POLICY "setoran_select_own" ON public.setoran FOR SELECT USING (
  nasabah_id IN (SELECT id FROM public.nasabah WHERE profile_id = auth.uid())
);

-- Penarikan: nasabah hanya bisa lihat penarikan sendiri
CREATE POLICY "penarikan_select_own" ON public.penarikan FOR SELECT USING (
  nasabah_id IN (SELECT id FROM public.nasabah WHERE profile_id = auth.uid())
);

-- Laporan: user bisa lihat laporan sendiri, atau guest berdasarkan session
CREATE POLICY "laporan_select_own" ON public.laporan_lingkungan FOR SELECT USING (
  pelapor_id = auth.uid() OR pelapor_id IS NULL
);
CREATE POLICY "laporan_insert_public" ON public.laporan_lingkungan FOR INSERT WITH CHECK (TRUE);

-- ============================================================
-- SEED DATA — Jenis Sampah Dasar
-- ============================================================
INSERT INTO public.jenis_sampah (nama, kode, kategori, satuan, harga_per_satuan, deskripsi) VALUES
('Kertas Koran', 'KRT-KOR', 'anorganik', 'kg', 1500, 'Koran, majalah, dan kertas bekas sejenis'),
('Kertas HVS', 'KRT-HVS', 'anorganik', 'kg', 2000, 'Kertas putih, buku tulis, dokumen'),
('Kardus/Karton', 'KRT-KDL', 'anorganik', 'kg', 1200, 'Kardus kemasan dan kotak bekas'),
('Botol Plastik PET', 'PLS-PET', 'anorganik', 'kg', 3500, 'Botol air mineral, botol minuman'),
('Plastik Kresek', 'PLS-KRK', 'anorganik', 'kg', 800, 'Kantong plastik kresek'),
('Plastik Keras (HDPE)', 'PLS-HDP', 'anorganik', 'kg', 2500, 'Ember, jerigen, pipa plastik'),
('Kaleng Besi', 'LOG-BES', 'anorganik', 'kg', 1800, 'Kaleng cat, kaleng makanan besi'),
('Kaleng Aluminium', 'LOG-ALU', 'anorganik', 'kg', 8000, 'Kaleng minuman aluminium'),
('Tembaga', 'LOG-TEM', 'anorganik', 'kg', 65000, 'Kabel tembaga, pipa tembaga'),
('Besi/Baja', 'LOG-BSI', 'anorganik', 'kg', 3500, 'Besi tua, rangka besi'),
('Botol Kaca', 'KCA-BTL', 'anorganik', 'kg', 500, 'Botol kaca bekas minuman'),
('Sampah Organik (Kompos)', 'ORG-KMP', 'organik', 'kg', 200, 'Sisa makanan, daun, sayuran untuk kompos'),
('Minyak Jelantah', 'ORG-MJL', 'organik', 'liter', 3000, 'Minyak goreng bekas'),
('Elektronik Bekas (e-Waste)', 'B3-ELK', 'b3', 'unit', 5000, 'HP, laptop, elektronik bekas')
ON CONFLICT (kode) DO NOTHING;

-- Seed: Unit Bank Sampah
INSERT INTO public.unit_bank_sampah (nama, kode, alamat) VALUES
('Bank Sampah Induk Toba', 'BST-IND', 'Jl. Hutabulu Mejan No. 14, Balige'),
('Bank Sampah Unit Laguboti', 'BST-LGB', 'Laguboti, Kab. Toba'),
('Bank Sampah Unit Porsea', 'BST-PRS', 'Porsea, Kab. Toba')
ON CONFLICT (kode) DO NOTHING;
