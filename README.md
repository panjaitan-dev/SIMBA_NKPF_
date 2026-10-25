# 🌿 SIMBA Nusantara – Sistem Informasi Bank Sampah Indonesia

[![Next.js](https://img.shields.io/badge/Next.js-16.3.8-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-lightgrey?style=flat&logo=express)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-emerald?style=flat&logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

> **Catatan Pengujian & Kompetisi:** Repositori ini memuat prototipe fungsional sistem informasi pengelolaan bank sampah terpadu berskala nasional, dirancang khusus untuk kompetisi **Web Development IT Fest 2026**. Data wilayah mengacu pada data simulasi 38 provinsi di Indonesia.

---

## 📖 Ringkasan Proyek

**SIMBA (Sistem Informasi Bank Sampah) Nusantara** adalah platform berbasis web terintegrasi yang menghadirkan solusi menyeluruh untuk digitalisasi tata kelola bank sampah di Indonesia:
- **Portal Publik Interaktif:** Peta sebaran unit bank sampah (38 provinsi), kalkulator taksiran nilai ekonomi sampah, direktori harga komoditas daur ulang transparan, serta kanal pengaduan masyarakat.
- **Manajemen Berbasis Peran (RBAC):** Dasbor terpisah dan terspesialisasi untuk **Administrator Bank Sampah**, **Petugas Lapangan**, **Nasabah**, dan **Pemantauan Agregasi Nasional (KLH)**.
- **Pencatatan Transaksi & Buku Tabungan Digital:** Alur verifikasi setoran fisik menjadi saldo tabungan, penarikan dana, kalkulasi margin offtaker, dan riwayat mutasi presisi.

---

## 🛠️ Arsitektur & Teknologi

| Lapisan Sistem | Teknologi yang Digunakan | Peran & Implementasi |
|:---|:---|:---|
| **Antarmuka Web** | **Next.js 16 (React 19, TypeScript)** | App Router, Server-Side Rendering (SSR), SSG, Turbopack, Tailwind CSS v4 |
| **REST API Engine** | **Express.js (Node.js LTS)** | Arsitektur controller-middleware, sanitasi input, validasi Zod ketat |
| **Basis Data** | **Supabase (PostgreSQL 15)** | Relational schema, Row Level Security (RLS), real-time indexing |
| **Autentikasi & Keamanan** | **Supabase Auth + Signed JWT** | Header `Authorization: Bearer <token>`, RBAC guard, token refresh, fallback akun pengujian mandiri |
| **Infrastruktur & Hosting** | **Vercel & Cloud Edge** | Frontend auto-deployment pada Vercel Edge Network |

---

## 👥 Akun Demo Pengujian (Pre-configured Accounts)

Untuk pengujian seluruh peran fungsional pada aplikasi, gunakan kredensial berikut pada halaman [Login](/login):

| Peran (Role) | Email | Password | Hak Akses Utama |
|:---|:---|:---|:---|
| **Administrator BSI** | `admin@simba.id` | `Password123!` | Kelola nasabah, verifikasi setoran/penarikan, kelola komoditas & harga, berita, edukasi, galeri |
| **Petugas Unit** | `petugas.melati@simba.id` | `Password123!` | Input penimbangan sampah, validasi setoran di tempat, cetak nota transaksi |
| **Nasabah** | `nasabah.dewi@simba.id` | `Password123!` | Buku tabungan digital, riwayat setoran, mutasi saldo, pengajuan penarikan dana |
| **Monitoring Nasional** | `admin.nasional@simba.id` | `Password123!` | Pemantauan agregasi metrik nasional 38 provinsi, sebaran unit, dan analisis reduksi timbulan sampah |

---

## 🚀 Panduan Memulai Cepat (Local Development)

### Prasyarat Sistem
- **Node.js:** Versi 20 LTS (direkomendasikan) atau 18+
- **Git**
- **npm** (bawaan Node.js)

### 1. Kloning Repositori
```bash
git clone https://github.com/panjaitan-dev/SIMBA_NKPF_.git
cd SIMBA_NKPF_
```

### 2. Konfigurasi Variabel Lingkungan
Salin file template lingkungan untuk frontend dan backend:
```bash
# Frontend
cp frontend/.env.example frontend/.env.local

# Backend
cp backend/.env.example backend/.env
```

### 3. Menjalankan Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Akses antarmuka web pada peramban di: **`http://localhost:3000`**

### 4. Menjalankan Backend API (Express.js)
```bash
cd ../backend
npm install
npm run dev
```
REST API aktif pada: **`http://localhost:5000/api`**

---

## 📁 Struktur Direktori Repositori

```plaintext
SIMBA_NKPF_/
├── .github/
│   └── workflows/ci.yml       # Alur integrasi CI (Automated Testing & Build Verification)
├── backend/
│   ├── src/
│   │   ├── config/            # Konfigurasi koneksi & konstanta
│   │   ├── controllers/       # Business logic per modul (auth, transaksi, direktori)
│   │   ├── middleware/        # Autentikasi JWT, RBAC guard, sanitasi Zod
│   │   ├── routes/            # Definisi endpoint REST API
│   │   └── lib/               # Utility, data provinsi 38 BPS, helper database
│   └── tests/                 # Uji unit otomatis logika finansial & validasi data
├── frontend/
│   ├── public/                # Aset statis SVG, peta vektor, dan ikon
│   └── src/
│       ├── app/               # Next.js App Router (Public, Admin, Nasabah, Petugas)
│       ├── components/        # Komponen antarmuka modular (UI, Header, Footer, Maps)
│       └── lib/               # Klien Supabase, HTTP client, skema validasi
├── docs/                      # Dokumentasi teknis, audit, dan pedoman desain
├── scripts/                   # Skrip otomasi pengujian kualitas & verifikasi build
└── README.md                  # Dokumentasi resmi proyek
```

---

## 🧪 Pengujian Kualitas Kode (Quality Assurance)

Repositori ini dilengkapi rangkaian pengujian otomatis end-to-end:
```bash
# 1. Jalankan pengujian backend (83 skenario pengujian logika finansial & RBAC)
npm test --prefix backend

# 2. Jalankan pengujian verifikasi peta vektor & integritas frontend
npm test --prefix frontend

# 3. Validasi build produksi Next.js
npm run build --prefix frontend
```

---

## 📜 Lisensi & Hak Cipta

Proyek ini dilisensikan di bawah ketentuan **[MIT License](LICENSE)**.
Dikembangkan dengan penuh dedikasi oleh **Tim SIMBA Nusantara** untuk **IT Fest 2026**.
