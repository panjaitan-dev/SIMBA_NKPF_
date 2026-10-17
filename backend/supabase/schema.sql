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
  role TEXT NOT NULL DEFAULT 'nasabah' CHECK (role IN ('nasabah', 'petugas', 'admin', 'admin_klh')),
  nama_lengkap TEXT NOT NULL CHECK (char_length(trim(nama_lengkap)) >= 3 AND char_length(nama_lengkap) <= 100),
  nomor_hp TEXT CHECK (nomor_hp IS NULL OR char_length(nomor_hp) >= 10),
  avatar_url TEXT,
  alamat TEXT CHECK (alamat IS NULL OR char_length(alamat) <= 255),
  nik TEXT UNIQUE CHECK (nik IS NULL OR (char_length(nik) = 16 AND nik ~ '^[0-9]{16}$')),
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
  kategori TEXT NOT NULL CHECK (kategori IN ('organik', 'anorganik', 'b3', 'logam', 'lainnya')),
  satuan TEXT DEFAULT 'kg',
  harga_per_satuan DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (harga_per_satuan >= 0),
  harga_beli DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (harga_beli >= 0),
  harga_jual DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (harga_jual >= 0),
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
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'diverifikasi', 'ditolak', 'dibatalkan')),
  total_nilai DECIMAL(15, 2) DEFAULT 0 CHECK (total_nilai >= 0),
  total_berat_kg DECIMAL(10, 3) DEFAULT 0 CHECK (total_berat_kg >= 0),
  metode_pembayaran TEXT DEFAULT 'Saldo Tabungan',
  catatan TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. DETAIL SETORAN (Item per jenis sampah)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.detail_setoran (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setoran_id UUID NOT NULL REFERENCES public.setoran(id) ON DELETE CASCADE,
  jenis_sampah_id UUID REFERENCES public.jenis_sampah(id),
  nama_sampah TEXT,
  kode_sampah TEXT,
  berat_kg DECIMAL(10, 3) NOT NULL CHECK (berat_kg > 0 AND berat_kg <= 10000),
  harga_satuan DECIMAL(10, 2) NOT NULL CHECK (harga_satuan >= 0),
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
  jumlah DECIMAL(15, 2) NOT NULL CHECK (jumlah >= 10000),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'disetujui', 'ditolak', 'dibayar', 'dibatalkan')),
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
  nomor_tiket TEXT UNIQUE,
  pelapor_id UUID REFERENCES public.profiles(id),
  nama_pelapor TEXT CHECK (nama_pelapor IS NULL OR char_length(nama_pelapor) <= 100),
  nomor_hp TEXT,
  judul TEXT NOT NULL CHECK (char_length(trim(judul)) >= 5 AND char_length(judul) <= 100),
  deskripsi TEXT NOT NULL CHECK (char_length(trim(deskripsi)) >= 20 AND char_length(deskripsi) <= 1000),
  lokasi TEXT NOT NULL CHECK (char_length(trim(lokasi)) >= 5 AND char_length(lokasi) <= 200),
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

-- Fungsi: Auto-update saldo nasabah ketika setoran diverifikasi atau dibatalkan
CREATE OR REPLACE FUNCTION update_saldo_nasabah()
RETURNS TRIGGER AS $$
DECLARE
  v_total_berat DECIMAL(10, 3);
BEGIN
  -- 1. Ketika status berubah menjadi 'diverifikasi' (baik dari INSERT langsung maupun UPDATE)
  IF (TG_OP = 'INSERT' AND NEW.status = 'diverifikasi') OR
     (TG_OP = 'UPDATE' AND NEW.status = 'diverifikasi' AND (OLD.status IS NULL OR OLD.status != 'diverifikasi')) THEN
     
    SELECT COALESCE(SUM(berat_kg), 0) INTO v_total_berat
    FROM public.detail_setoran
    WHERE setoran_id = NEW.id;

    IF (v_total_berat = 0 OR v_total_berat IS NULL) AND NEW.total_berat_kg IS NOT NULL THEN
      v_total_berat := NEW.total_berat_kg;
    END IF;

    UPDATE public.nasabah
    SET 
      saldo = saldo + NEW.total_nilai,
      total_setoran_kg = total_setoran_kg + COALESCE(v_total_berat, 0),
      updated_at = NOW()
    WHERE id = NEW.nasabah_id;

  -- 2. Jika status berubah dari 'diverifikasi' ke status lain (dibatalkan/ditolak)
  ELSIF TG_OP = 'UPDATE' AND OLD.status = 'diverifikasi' AND NEW.status != 'diverifikasi' THEN

    SELECT COALESCE(SUM(berat_kg), 0) INTO v_total_berat
    FROM public.detail_setoran
    WHERE setoran_id = NEW.id;

    IF (v_total_berat = 0 OR v_total_berat IS NULL) AND OLD.total_berat_kg IS NOT NULL THEN
      v_total_berat := OLD.total_berat_kg;
    END IF;

    UPDATE public.nasabah
    SET 
      saldo = GREATEST(0, saldo - OLD.total_nilai),
      total_setoran_kg = GREATEST(0, total_setoran_kg - COALESCE(v_total_berat, 0)),
      updated_at = NOW()
    WHERE id = NEW.nasabah_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_saldo ON public.setoran;
CREATE TRIGGER trigger_update_saldo
AFTER INSERT OR UPDATE ON public.setoran
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
    WHERE setoran_id = COALESCE(NEW.setoran_id, OLD.setoran_id)
  ),
  total_berat_kg = (
    SELECT COALESCE(SUM(berat_kg), 0)
    FROM public.detail_setoran
    WHERE setoran_id = COALESCE(NEW.setoran_id, OLD.setoran_id)
  ),
  updated_at = NOW()
  WHERE id = COALESCE(NEW.setoran_id, OLD.setoran_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_total_setoran ON public.detail_setoran;
CREATE TRIGGER trigger_update_total_setoran
AFTER INSERT OR UPDATE OR DELETE ON public.detail_setoran
FOR EACH ROW
EXECUTE FUNCTION update_total_setoran();

-- Fungsi: Kurangi saldo saat penarikan dibayar (dan kembalikan jika void/batal)
CREATE OR REPLACE FUNCTION proses_penarikan()
RETURNS TRIGGER AS $$
BEGIN
  -- 1. Penarikan dicairkan / dibayar
  IF NEW.status = 'dibayar' AND (OLD.status IS NULL OR OLD.status != 'dibayar') THEN
    UPDATE public.nasabah
    SET 
      saldo = GREATEST(0, saldo - NEW.jumlah),
      updated_at = NOW()
    WHERE id = NEW.nasabah_id;
    
    NEW.tanggal_proses = NOW();

  -- 2. Penarikan dibatalkan setelah sebelumnya dibayar
  ELSIF OLD.status = 'dibayar' AND NEW.status != 'dibayar' THEN
    UPDATE public.nasabah
    SET 
      saldo = saldo + OLD.jumlah,
      updated_at = NOW()
    WHERE id = NEW.nasabah_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_proses_penarikan ON public.penarikan;
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
-- 14. KLIEN / PEMBELI INDUSTRI (OFFTAKER)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.klien_pembeli (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kode_client TEXT UNIQUE NOT NULL,
  nama_client TEXT NOT NULL,
  perusahaan TEXT,
  komoditas TEXT,
  alamat TEXT NOT NULL,
  nomor_hp TEXT NOT NULL,
  email TEXT,
  status_aktif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 15. TRANSAKSI PENJUALAN KOMODITAS (Sampah Keluar ke Pembeli)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.penjualan_sampah (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  klien_id UUID NOT NULL REFERENCES public.klien_pembeli(id) ON DELETE CASCADE,
  petugas_id UUID REFERENCES public.profiles(id),
  nomor_faktur TEXT UNIQUE NOT NULL,
  tanggal_penjualan DATE NOT NULL DEFAULT CURRENT_DATE,
  total_berat_kg DECIMAL(10, 3) NOT NULL DEFAULT 0,
  total_nominal DECIMAL(15, 2) NOT NULL DEFAULT 0,
  status_pembayaran TEXT DEFAULT 'lunas',
  nomor_truk TEXT,
  catatan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 16. DETAIL PENJUALAN
-- ============================================================
CREATE TABLE IF NOT EXISTS public.detail_penjualan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  penjualan_id UUID NOT NULL REFERENCES public.penjualan_sampah(id) ON DELETE CASCADE,
  jenis_sampah_id UUID NOT NULL REFERENCES public.jenis_sampah(id),
  berat_kg DECIMAL(10, 3) NOT NULL,
  harga_satuan_jual DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(15, 2) GENERATED ALWAYS AS (berat_kg * harga_satuan_jual) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SEED DATA — Jenis Sampah Dual Pricing
-- ============================================================
INSERT INTO public.jenis_sampah (nama, kode, kategori, satuan, harga_per_satuan, harga_beli, harga_jual, deskripsi) VALUES
('Tembaga Super (Kabel Kupas)', 'LG-TMB01', 'logam', 'kg', 85000, 85000, 95000, 'Kawat tembaga murni tanpa isolator, mengkilap'),
('Aluminium Kaleng Minuman', 'LG-ALM01', 'logam', 'kg', 14000, 14000, 18000, 'Kaleng minuman aluminium ringan tanpa cairan'),
('Aluminium Profil / Tebal', 'LG-ALM02', 'logam', 'kg', 16000, 16000, 21000, 'Kusen aluminium, plat tebal, wajan bekas'),
('Botol Plastik PET Bening', 'PLS-PET01', 'anorganik', 'kg', 3500, 3500, 4800, 'Botol air mineral transparan bersih'),
('Plastik HDPE / Emberan', 'PLS-HDP02', 'anorganik', 'kg', 2800, 2800, 4000, 'Ember, jerigen, baskom plastik'),
('Kardus Box Cokelat Tebal', 'KRT-KRD01', 'anorganik', 'kg', 1800, 1800, 2500, 'Kardus kemasan cokelat kering'),
('Besi Padu / Konstruksi', 'LG-BSI01', 'logam', 'kg', 4500, 4500, 6000, 'Besi plat tebal, beton, dan kontruksi'),
('Minyak Jelantah Berkualitas', 'MNY-JLT01', 'lainnya', 'liter', 7000, 7000, 9000, 'Minyak goreng bekas disaring bersih'),
('Botol Kaca Utuh', 'KC-BTL01', 'anorganik', 'pcs', 500, 500, 1000, 'Botol kaca sirup / kecap utuh')
ON CONFLICT (kode) DO NOTHING;

-- Seed: Unit Bank Sampah Percontohan 38 Provinsi di Seluruh Indonesia
INSERT INTO public.unit_bank_sampah (nama, kode, alamat, koordinator, nomor_hp, is_active) VALUES
('Bank Sampah Unit Meuraxa Berseri', 'BSU-11-001', 'Kec. Meuraxa, Kota Banda Aceh, Aceh', 'Teuku Iskandar, S.T.', '0812-6543-1101', true),
('Bank Sampah Unit Deli Hijau Bersih', 'BSU-12-001', 'Kec. Medan Kota, Kota Medan, Sumatera Utara', 'Bambang Sitorus, S.Sos.', '0812-7890-1201', true),
('Bank Sampah Unit Ranah Minang Resik', 'BSU-13-001', 'Kec. Padang Barat, Kota Padang, Sumatera Barat', 'Nurhayati Chaniago', '0813-4567-1301', true),
('Bank Sampah Unit Lancang Kuning', 'BSU-14-001', 'Kec. Tampan, Kota Pekanbaru, Riau', 'M. Faisal Azmi', '0812-9901-1401', true),
('Bank Sampah Unit Batanghari Mandiri', 'BSU-15-001', 'Kec. Telanaipura, Kota Jambi, Jambi', 'Hendra Gunawan', '0852-6789-1501', true),
('Bank Sampah Unit Sriwijaya Berdaya', 'BSU-16-001', 'Kec. Ilir Barat I, Kota Palembang, Sumatera Selatan', 'Dra. Rosmala Dewi', '0813-6712-1601', true),
('Bank Sampah Unit Rafflesia Lestari', 'BSU-17-001', 'Kec. Ratu Agung, Kota Bengkulu, Bengkulu', 'Agus Salim, S.E.', '0821-8899-1701', true),
('Bank Sampah Unit Radin Inten Mandiri', 'BSU-18-001', 'Kec. Tanjung Karang Pusat, Kota Bandar Lampung, Lampung', 'Farhan Kurniawan', '0853-7890-1801', true),
('Bank Sampah Unit Serumpun Sebalai', 'BSU-19-001', 'Kec. Gerunggang, Kota Pangkalpinang, Kep. Bangka Belitung', 'Budi Darmawan', '0812-7123-1901', true),
('Bank Sampah Unit Gurindam Sejahtera', 'BSU-21-001', 'Kec. Bukit Bestari, Kota Tanjungpinang, Kepulauan Riau', 'Ahmad Zulkarnain', '0813-8812-2101', true),
('Bank Sampah Induk Cempaka Bestari', 'BSU-31-001', 'Kec. Cempaka Putih, Jakarta Pusat, DKI Jakarta', 'Hj. Siti Aminah, M.Pd.', '0812-8182-3101', true),
('Bank Sampah Unit Bersinar Pasteur', 'BSU-32-001', 'Kec. Sukajadi, Kota Bandung, Jawa Barat', 'Asep Ridwan, S.T.', '0813-2211-3201', true),
('Bank Sampah Unit Pandanaran Asri', 'BSU-33-001', 'Kec. Semarang Tengah, Kota Semarang, Jawa Tengah', 'Tri Wibowo, S.H.', '0815-6677-3301', true),
('Bank Sampah Unit Malioboro Resik', 'BSU-34-001', 'Kec. Danurejan, Kota Yogyakarta, DI Yogyakarta', 'Sri Handayani', '0817-4455-3401', true),
('Bank Sampah Unit Suroboyo Hijau', 'BSU-35-001', 'Kec. Wonokromo, Kota Surabaya, Jawa Timur', 'Joko Prasetyo, M.M.', '0812-3344-3501', true),
('Bank Sampah Unit Jawara Resik', 'BSU-36-001', 'Kec. Cipocok Jaya, Kota Serang, Banten', 'Tb. Maulana Yusuf', '0878-1122-3601', true),
('Bank Sampah Unit Bali Bersih Shanti', 'BSU-51-001', 'Kec. Denpasar Selatan, Kota Denpasar, Bali', 'I Wayan Suardana', '0812-3890-5101', true),
('Bank Sampah Unit Sasak Hijau Lestari', 'BSU-52-001', 'Kec. Selaparang, Kota Mataram, Nusa Tenggara Barat', 'Lalu Muhamad Saleh', '0819-0789-5201', true),
('Bank Sampah Unit Flobamora Bersemi', 'BSU-53-001', 'Kec. Oebobo, Kota Kupang, Nusa Tenggara Timur', 'Maria Yohanis, S.Pd.', '0852-3901-5301', true),
('Bank Sampah Unit Khatulistiwa Mandiri', 'BSU-61-001', 'Kec. Pontianak Kota, Kota Pontianak, Kalimantan Barat', 'Fransiskus Aseng', '0813-4512-6101', true),
('Bank Sampah Unit Isen Mulang Hijau', 'BSU-62-001', 'Kec. Jekan Raya, Kota Palangka Raya, Kalimantan Tengah', 'Kristina Natalia, S.Si.', '0852-4911-6201', true),
('Bank Sampah Unit Lambung Mangkurat', 'BSU-63-001', 'Kec. Banjarmasin Tengah, Kota Banjarmasin, Kalimantan Selatan', 'Gusti Muhammad Noor', '0812-5123-6301', true),
('Bank Sampah Unit Etam Nusantara (IKN)', 'BSU-64-001', 'Kec. Samarinda Ulu, Kota Samarinda, Kalimantan Timur', 'Drs. Hendro Waskito', '0813-5001-6401', true),
('Bank Sampah Unit Benuanta Berseri', 'BSU-65-001', 'Kec. Tanjung Selor, Kab. Bulungan, Kalimantan Utara', 'Abdul Rahim, S.Pd.', '0853-4812-6501', true),
('Bank Sampah Unit Bunaken Lestari', 'BSU-71-001', 'Kec. Malalayang, Kota Manado, Sulawesi Utara', 'Mieke Tumewu, S.E.', '0811-4301-7101', true),
('Bank Sampah Unit Tadulako Bangkit', 'BSU-72-001', 'Kec. Palu Timur, Kota Palu, Sulawesi Tengah', 'Rusdi Mansyur, S.Kom.', '0852-4112-7201', true),
('Bank Sampah Unit Anging Mammiri', 'BSU-73-001', 'Kec. Panakkukang, Kota Makassar, Sulawesi Selatan', 'H. Syamsuddin Dg. Lau', '0812-4211-7301', true),
('Bank Sampah Unit Anoa Sejahtera', 'BSU-74-001', 'Kec. Mandonga, Kota Kendari, Sulawesi Tenggara', 'La Ode Armin, S.H.', '0853-9901-7401', true),
('Bank Sampah Unit Hulonthalo Resik', 'BSU-75-001', 'Kec. Kota Barat, Kota Gorontalo, Gorontalo', 'Yusuf Katili', '0821-9012-7501', true),
('Bank Sampah Unit Manakarra Mandiri', 'BSU-76-001', 'Kec. Simboro, Kab. Mamuju, Sulawesi Barat', 'Nurhidayah Basri', '0852-5501-7601', true),
('Bank Sampah Unit Siwalima Manise', 'BSU-81-001', 'Kec. Sirimau, Kota Ambon, Maluku', 'Piet Pattiasina', '0812-4701-8101', true),
('Bank Sampah Unit Moloku Kie Raha', 'BSU-82-001', 'Kec. Oba Utara, Kota Tidore Kepulauan (Sofifi), Maluku Utara', 'Iskandar Malik', '0813-5612-8201', true),
('Bank Sampah Unit Port Numbay Hijau', 'BSU-91-001', 'Kec. Jayapura Selatan, Kota Jayapura, Papua', 'Yohanes Kogoya, S.Sos.', '0812-4801-9101', true),
('Bank Sampah Unit Kasuari Mandiri', 'BSU-92-001', 'Kec. Manokwari Barat, Kab. Manokwari, Papua Barat', 'Markus Mandacan', '0813-4401-9201', true),
('Bank Sampah Unit Anim Ha Lestari', 'BSU-93-001', 'Kec. Merauke, Kab. Merauke, Papua Selatan', 'Petrus Mahuze, S.T.', '0852-5401-9301', true),
('Bank Sampah Unit Cenderawasih Nabire', 'BSU-94-001', 'Kec. Nabire, Kab. Nabire, Papua Tengah', 'Mikael Degei', '0821-9801-9401', true),
('Bank Sampah Unit Lembah Baliem Bersih', 'BSU-95-001', 'Kec. Wamena, Kab. Jayawijaya, Papua Pegunungan', 'Keliopas Matuan, S.Pd.', '0812-4011-9501', true),
('Bank Sampah Unit Raja Ampat Bahari Resik', 'BSU-96-001', 'Kec. Sorong Barat, Kota Sorong, Papua Barat Daya', 'Agustinus Osok', '0813-4311-9601', true)
ON CONFLICT (kode) DO NOTHING;

-- Seed: Klien / Pembeli Offtaker
INSERT INTO public.klien_pembeli (kode_client, nama_client, perusahaan, komoditas, alamat, nomor_hp) VALUES
('CLN-001', 'PT Daur Logam Nusantara', 'Pabrik Peleburan Tembaga & Aluminium', 'Logam (Tembaga, Aluminium, Besi)', 'Kawasan Industri Pulogadung Blok B No. 12, Jakarta', '0812-9876-5432'),
('CLN-002', 'UD Plastik Berkah Mandiri', 'Pengepul & Penggilingan Plastik', 'Plastik (PET, HDPE, PP)', 'Jl. Raya Narogong Km. 12, Bantar Gebang, Bekasi', '0813-1122-3344'),
('CLN-003', 'PT Pabrik Kertas Sumber Jaya', 'Industri Pulp & Paper Daur Ulang', 'Kardus Box, Kertas HVS & Koran', 'Jl. Industri Rungkut Blok C No. 45, Surabaya', '0857-4455-6677')
ON CONFLICT (kode_client) DO NOTHING;

-- ============================================================
-- 17. PERFORMANCE INDEXES — OPTIMASI KINERJA SKALA BESAR (FASE 5)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_nasabah_unit_id ON public.nasabah(unit_id);
CREATE INDEX IF NOT EXISTS idx_nasabah_nomor ON public.nasabah(nomor_nasabah);
CREATE INDEX IF NOT EXISTS idx_profiles_nama ON public.profiles(nama_lengkap);
CREATE INDEX IF NOT EXISTS idx_laporan_nomor_tiket ON public.laporan_lingkungan(nomor_tiket);
CREATE INDEX IF NOT EXISTS idx_setoran_nasabah_id ON public.setoran(nasabah_id);
CREATE INDEX IF NOT EXISTS idx_setoran_unit_id ON public.setoran(unit_id);
CREATE INDEX IF NOT EXISTS idx_setoran_status ON public.setoran(status);
CREATE INDEX IF NOT EXISTS idx_setoran_tanggal ON public.setoran(tanggal_setoran DESC);
CREATE INDEX IF NOT EXISTS idx_setoran_nomor ON public.setoran(nomor_setoran);
CREATE INDEX IF NOT EXISTS idx_detail_setoran_setoran_id ON public.detail_setoran(setoran_id);
CREATE INDEX IF NOT EXISTS idx_detail_setoran_jenis_id ON public.detail_setoran(jenis_sampah_id);
CREATE INDEX IF NOT EXISTS idx_penarikan_nasabah_id ON public.penarikan(nasabah_id);
CREATE INDEX IF NOT EXISTS idx_penarikan_status ON public.penarikan(status);
CREATE INDEX IF NOT EXISTS idx_penarikan_tanggal ON public.penarikan(tanggal_request DESC);
CREATE INDEX IF NOT EXISTS idx_penjualan_client_id ON public.penjualan_sampah(klien_id);
CREATE INDEX IF NOT EXISTS idx_penjualan_tanggal ON public.penjualan_sampah(tanggal_penjualan DESC);
CREATE INDEX IF NOT EXISTS idx_penjualan_status ON public.penjualan_sampah(status_pembayaran);
CREATE INDEX IF NOT EXISTS idx_jenis_sampah_kategori ON public.jenis_sampah(kategori);
CREATE INDEX IF NOT EXISTS idx_jenis_sampah_is_active ON public.jenis_sampah(is_active);
CREATE INDEX IF NOT EXISTS idx_laporan_status ON public.laporan_lingkungan(status);
CREATE INDEX IF NOT EXISTS idx_berita_slug ON public.berita(slug);
CREATE INDEX IF NOT EXISTS idx_berita_published ON public.berita(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_edukasi_slug ON public.edukasi(slug);
CREATE INDEX IF NOT EXISTS idx_edukasi_published ON public.edukasi(is_published);

