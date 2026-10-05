# SIMBA — Sistem Informasi Bank Sampah
## Dinas Lingkungan Hidup Kabupaten Toba

Portal web lengkap untuk pengelolaan Bank Sampah, pelaporan masalah lingkungan, dan informasi publik.

---

## 🏗️ Struktur Proyek

```
SIMBA_NKPF_/
├── frontend/   → Next.js 15 (App Router + TypeScript + Tailwind CSS)
└── backend/    → Node.js + Express.js (REST API)
```

---

## ⚙️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | Supabase (PostgreSQL + Auth + Storage) |
| PWA | Web Manifest + Service Worker |

---

## 🚀 Setup & Instalasi

### 1. Konfigurasi Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Buka **SQL Editor** dan jalankan file: `backend/supabase/schema.sql`
3. Di **Storage**, buat bucket publik: `berita`, `edukasi`, `galeri`, `laporan`, `avatars`
4. Salin **Project URL**, **Anon Key**, dan **Service Role Key**

---

### 2. Backend (Node.js + Express)

```bash
cd backend

# Salin dan isi environment variables
copy .env.example .env
# Edit .env dengan kredensial Supabase kamu

# Jalankan server
npm run dev
# → Server berjalan di http://localhost:5000
```

**Isi `.env` backend:**
```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

---

### 3. Frontend (Next.js)

```bash
cd frontend

# Salin dan isi environment variables
copy .env.local.example .env.local
# Edit .env.local dengan kredensial Supabase kamu

# Jalankan dev server
npm run dev
# → App berjalan di http://localhost:3000
```

**Isi `.env.local` frontend:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

## 📱 Fitur Utama

### 🌐 Portal Publik
- **Landing Page** — Hero, Profil DLH, Fitur Bank Sampah, Berita, Edukasi, Galeri
- **Berita & Pengumuman** — Listing + detail artikel
- **Edukasi Lingkungan** — 3R, Jenis Sampah, Bahaya Sampah, Bank Sampah
- **Galeri Kegiatan** — Album foto kegiatan DLH
- **Form Lapor** — Pelaporan masalah lingkungan (publik, tanpa login)
- **PWA** — Installable di Android/iOS

### 🏦 Bank Sampah (Nasabah)
- Daftar & login nasabah
- Dashboard: saldo, total setoran, riwayat transaksi
- Ajukan penarikan tabungan

### 👷 Petugas
- Verifikasi setoran sampah
- Update status laporan lingkungan

### 🔑 Admin
- Dashboard statistik lengkap
- Kelola nasabah, setoran, penarikan
- Kelola jenis sampah & harga
- Kelola unit bank sampah
- CRUD berita, edukasi, galeri, pengumuman
- Manajemen laporan lingkungan

---

## 🗄️ Database Schema

| Tabel | Fungsi |
|-------|--------|
| `profiles` | Data user (extend Supabase Auth) |
| `nasabah` | Data nasabah bank sampah |
| `unit_bank_sampah` | Unit/cabang bank sampah |
| `jenis_sampah` | Jenis sampah & harga per satuan |
| `setoran` | Header transaksi setoran |
| `detail_setoran` | Detail item setoran (auto-total) |
| `penarikan` | Permintaan penarikan tabungan |
| `berita` | Artikel berita |
| `pengumuman` | Pengumuman resmi |
| `edukasi` | Konten edukasi lingkungan |
| `galeri_album` | Album foto kegiatan |
| `galeri_foto` | Foto dalam album |
| `laporan_lingkungan` | Laporan masalah lingkungan |

---

## 🔐 Role & Akses

| Role | Akses |
|------|-------|
| `nasabah` | Dashboard pribadi, setoran, penarikan |
| `petugas` | Verifikasi setoran, update laporan |
| `admin` | Akses penuh semua fitur |

---

## 🏃 Production Build

```bash
# Frontend
cd frontend && npm run build && npm start

# Backend
cd backend && NODE_ENV=production npm start
```

---

## 📞 Kontak

**Dinas Lingkungan Hidup Kabupaten Toba**  
Jl. Hutabulu Mejan No. 14, Balige, Sumatera Utara  
📧 dlhtoba@gmail.com  
🌐 [tobabersih.tech](https://tobabersih.tech)
