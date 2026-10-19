# 🌿 SIMBA Frontend — Next.js Web Application

Aplikasi antarmuka web modern untuk platform **SIMBA (Sistem Informasi Bank Sampah Indonesia)** yang dibangun menggunakan Next.js App Router, React 19, TypeScript, dan Tailwind CSS v4.

---

## 🚀 Memulai Pengembangan Lokal

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Konfigurasi Environment Variables
Salin contoh konfigurasi ke `.env.local`:
```bash
cp .env.example .env.local
```
Isi nilai variabel:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Menjalankan Server Development
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 📜 Skrip yang Tersedia

| Perintah | Deskripsi |
|---|---|
| `npm run dev` | Menjalankan server Next.js mode development dengan hot-reloading |
| `npm run build` | Melakukan build produksi teroptimasi menggunakan Next.js Turbopack |
| `npm run start` | Menjalankan server aplikasi Next.js dalam mode produksi |
| `npm test` | Menjalankan verifikasi peta wilayah & pemeriksaan regresi kode |
| `npm run lint` | Memeriksa kualitas kode menggunakan ESLint |

---

## 📁 Struktur Direktori Frontend

- `src/app/` — Halaman aplikasi & rute (App Router)
  - `(public)/` — Halaman publik (Beranda, Bank Sampah, Lapor, Berita, Edukasi, Login, Register)
  - `admin/` — Panel Dashboard Administrator BSI & KLH
  - `nasabah/` — Panel Dashboard Nasabah Warga
  - `petugas/` — Panel Input Timbangan Petugas Lapangan
- `src/components/` — Komponen UI modular
  - `home/` — Komponen khusus beranda (Hero, Peta Provinsi, Kalkulator)
  - `layout/` — Komponen layout (Navbar responsif dinamis, Footer, Sidebar)
  - `modals/` — Dialog pop-up interaktif & bukti nota cetak
- `src/lib/` — Utilitas pembantu, client API, validasi Zod, dan data referensi provinsi
- `public/` — Aset gambar, ikon, dan peta statis

---

Dokumentasi lengkap proyek dapat dilihat di [README.md utama](../README.md).
