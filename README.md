# 🌿 SIMBA Nusantara — Sistem Informasi Bank Sampah Indonesia

[![Next.js](https://img.shields.io/badge/Next.js-16.3.8-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=flat&logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel-black?style=flat&logo=vercel)](https://simba-nkpf.vercel.app/)

> **SIMBA Nusantara** adalah platform digital berbasis web untuk tata kelola, edukasi, dan transparansi ekosistem Bank Sampah Indonesia. Menghubungkan nasabah warga, petugas unit (BSU), administrator bank sampah induk (BSI), dan monitoring dinas/pemerintah (KLH) dalam satu portal terpadu.

🌐 **Demo Live Website:** [https://simba-nkpf.vercel.app](https://simba-nkpf.vercel.app)

---

## 📑 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Struktur Direktori](#-struktur-direktori)
- [Akun Demo Pengujian](#-akun-demo-pengujian)
- [Panduan Instalasi & Menjalankan Lokal](#-panduan-instalasi--menjalankan-lokal)
- [Konfigurasi Environment Variables](#-konfigurasi-environment-variables)
- [Pengujian & Verifikasi](#-pengujian--verifikasi)
- [Panduan Deployment](#-panduan-deployment)
- [Tim Pengembang & Lisensi](#-tim-pengembang--lisensi)

---

## 💡 Tentang Proyek

Sektor pengelolaan sampah di Indonesia menghadapi kendala pencatatan manual, keterbatasan akses informasi harga jual-beli sampah, serta minimnya transparansi tabungan bagi nasabah warga.

**SIMBA Nusantara** hadir sebagai solusi berbasis web modern dengan arsitektur skalabel:
1. **Transparansi Tabungan:** Warga dapat memantau berat timbangan sampah, saldo tabungan, dan mengajukan penarikan kapan saja.
2. **Efisiensi Petugas:** Pencatatan timbangan digital instan dengan kalkulasi harga beli otomatis serta bukti nota transaksi digital.
3. **Ekonomi Sirkular BSI:** Pengelolaan dual-pricing (harga beli nasabah vs harga jual industri/offtaker) untuk menjaga keberlanjutan operasional bank sampah.
4. **Pengawasan Satu Pintu (KLH):** Agregasi statistik nasional, pantauan tonase sampah terkelola, reduksi emisi karbon, serta sebaran unit bank sampah se-Indonesia.

---

## ✨ Fitur Utama

### 1. 🌐 Portal Publik & Edukasi Warga
- **Peta Interaktif Sebaran Provinsi:** Menampilkan sebaran unit bank sampah, agregasi tonase, dan partisipasi nasabah.
- **Kalkulator Sampah Digital:** Simulasi konversi berat sampah (plastik, kertas, logam, kaca) menjadi nilai rupiah dan estimasi reduksi jejak karbon ($CO_2$).
- **Direktori Bank Sampah:** Pencarian unit bank sampah terdekat berdasarkan wilayah dan kabupaten/kota.
- **Kanal Pengaduan Masalah Lingkungan (`/lapor`):** Formulir aduan warga dilengkapi fitur geotagging koordinat GPS, unggah bukti foto, dan pelacakan nomor tiket aduan.
- **Katalog Berita, Edukasi & Galeri:** Informasi terkini tentang program 3R (Reduce, Reuse, Recycle) dan bank sampah.

### 2. 👥 Sistem Multi-Role (Role-Based Access Control)
- **Nasabah (`/nasabah`):** Dashboard saldo, mutasi setoran sampah, pengajuan penarikan dana tabungan, dan manajemen profil.
- **Petugas Lapangan (`/petugas`):** Form timbangan cepat, kalkulasi subtotal otomatis, dan penerbitan nota transaksi digital siap cetak.
- **Administrator BSI (`/admin`):** Master data nasabah, katalog jenis & harga sampah, verifikasi setoran, persetujuan penarikan saldo, transaksi offtaker daur ulang, dan ekspor laporan keuangan CSV.
- **Monitoring KLH (`/admin/klh`):** Pemantauan statistik makro reduksi sampah nasional dan kinerja bank sampah daerah.

---

## 🛠 Teknologi yang Digunakan

| Komponen | Teknologi | Deskripsi |
|---|---|---|
| **Frontend Framework** | [Next.js 16.3.8](https://nextjs.org/) | React 19, Turbopack, App Router, Server & Client Components |
| **Bahasa Pemrograman** | [TypeScript](https://www.typescriptlang.org/) | Strict Type Checking untuk integritas kode |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/) | Utilitas CSS modern, dark/light theme adaptif, transisi mulus |
| **Ikon UI** | [Lucide React](https://lucide.dev/) | Kumpulan ikon grafis vektor ringan dan modern |
| **State & Notifikasi** | React Hooks, React Hot Toast | Pengalaman pengguna reaktif dengan toast alert |
| **Backend API** | [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) | RESTful API, kompresi Gzip, caching in-memory |
| **Validasi Skema** | [Zod](https://zod.dev/) | Validasi data ganda di lapisan frontend dan backend |
| **Basis Data & Autentikasi** | [Supabase](https://supabase.com/) | PostgreSQL Cloud, Database Triggers, RLS |
| **Deployment** | [Vercel](https://vercel.com/) | Continuous Deployment & Edge CDN Hosting |

---

## 📁 Struktur Direktori

```text
SIMBA_NKPF_/
├── frontend/                   # Aplikasi Web Next.js
│   ├── public/                 # Aset statis (gambar, logo, ikon, peta)
│   ├── src/
│   │   ├── app/                # Next.js App Router
│   │   │   ├── (public)/       # Halaman publik (Beranda, Lapor, Login, Register, dll)
│   │   │   ├── admin/          # Dashboard Admin BSI & KLH
│   │   │   ├── nasabah/        # Portal Nasabah Warga
│   │   │   ├── petugas/        # Portal Petugas Timbangan
│   │   │   ├── globals.css     # Tailwind CSS & konfigurasi styling global
│   │   │   └── layout.tsx      # Root Layout aplikasi
│   │   ├── components/         # Komponen UI modular
│   │   │   ├── home/           # HeroSection, PetaProvinsiSection, KalkulatorSection
│   │   │   ├── layout/         # Navbar responsif, Footer, Sidebar
│   │   │   └── modals/         # Modal transaksi, bukti nota, dialog aduan
│   │   └── lib/                # API client, validasi, utilitas data provinsi
│   ├── package.json
│   └── next.config.ts
├── backend/                    # Server RESTful API Node.js/Express
│   ├── src/
│   │   ├── routes/             # Rute API (auth, setoran, penarikan, laporan, dll)
│   │   ├── middlewares/        # RBAC, autentikasi JWT, sanitasi request
│   │   └── tests/              # Automated unit & flow testing
│   ├── supabase/               # Schema SQL, migrasi, dan database triggers
│   └── package.json
└── README.md                   # Dokumentasi utama proyek
```

---

## 🔐 Akun Demo Pengujian

Untuk menguji seluruh alur kerja sistem, gunakan kredensial demo berikut:

| Peran (Role) | Email | Password | URL Dashboard | Hak Akses Utama |
|---|---|---|---|---|
| **Administrator BSI** | `admin@simba.id` | `Password123!` | `/admin` | Kelola master data, katalog harga, approval penarikan, transaksi offtaker |
| **Petugas Lapangan** | `petugas.melati@simba.id` | `Password123!` | `/petugas` | Input setoran nasabah, timbangan sampah, cetak nota transaksi |
| **Nasabah Warga** | `nasabah.dewi@simba.id` | `Password123!` | `/nasabah` | Cek saldo, riwayat tabungan sampah, pengajuan penarikan saldo |
| **Monitoring KLH** | `klh.nasional@menlhk.go.id` | `Password123!` | `/admin/klh` | Monitoring agregasi data makro dan statistik nasional |

---

## 🚀 Panduan Instalasi & Menjalankan Lokal

### Prasyarat Sistem
- **Node.js** versi 18.x atau 20.x LTS ([Unduh Node.js](https://nodejs.org/))
- **Git** ([Unduh Git](https://git-scm.com/))
- Manajer paket **npm** (bawaan Node.js)

### Langkah 1: Kloning Repositori
```bash
git clone https://github.com/panjaitan-dev/SIMBA_NKPF_.git
cd SIMBA_NKPF_
```

### Langkah 2: Setup Frontend
Buka terminal dan masuk ke folder `frontend`:
```bash
cd frontend
npm install
npm run dev
```
Aplikasi web akan berjalan pada: **`http://localhost:3000`**

### Langkah 3: Setup Backend (Opsional untuk Pengembangan API Lokal)
Buka terminal baru dan masuk ke folder `backend`:
```bash
cd backend
npm install
npm run dev
```
Server API backend akan berjalan pada: **`http://localhost:5000`**

---

## ⚙️ Konfigurasi Environment Variables

### Frontend (`frontend/.env.local`)
Buat file `.env.local` di dalam direktori `frontend`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (`backend/.env`)
Buat file `.env` di dalam direktori `backend`:
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
CORS_ORIGIN=http://localhost:3000
```

---

## 🧪 Pengujian & Verifikasi

Proyek ini telah dilengkapi dengan verifikasi otomatis untuk menjaga kestabilan kode:

```bash
# Uji coba build produksi Next.js
cd frontend
npm run build

# Menjalankan verifikasi peta & uji regresi
npm test

# Menjalankan test suite unit backend (64 tests)
cd ../backend
npm test
```

---

## 🌐 Panduan Deployment

### Deployment Frontend ke Vercel
1. Hubungkan repositori GitHub Anda ke akun [Vercel](https://vercel.com/).
2. Pilih folder **Root Directory**: `frontend`.
3. Masukkan Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL`).
4. Klik **Deploy**. Vercel akan otomatis melakukan build dan deploy setiap kali ada commit baru ke branch `main`.

---

## 👥 Tim Pengembang & Lisensi

Dikembangkan dengan dedikasi oleh Tim **SIMBA_NKPF_**:
- **Proyek:** Sistem Informasi Bank Sampah Indonesia (SIMBA Nusantara)
- **Lisensi:** [MIT License](LICENSE) — bebas digunakan untuk pengembangan akademis, inovasi sosial, dan perbaikan tata kelola lingkungan.

---

<p align="center">
  <b>🌿 Bersama SIMBA, Ubah Sampah Menjadi Berkah & Nilai Ekonomi Nyata 🌿</b>
</p>
