# SIMBA Nusantara — Sistem Informasi Bank Sampah Indonesia

> **Prototipe Platform Digital Pelayanan Publik dan Tata Kelola Bank Sampah**  
> **Posisi Strategis:** Pilot Sumatera Utara, arsitektur siap 38 provinsi.  
> Mengacu pada regulasi **Permen LHK No. 14 Tahun 2021** tentang Pengelolaan Sampah pada Bank Sampah.  
> Dikembangkan untuk **Lomba Web Development IT Fest 2026** oleh Tim **SIMBA_NKPF_**.  
> *(Catatan: Ini adalah prototipe proyek kompetisi mahasiswa, bukan situs resmi pemerintah).*

---

## 📊 Status Progres & Kesiapan Sistem

| Aspek Penilaian | Target Lomba | Status Aktual | Keterangan |
|-----------------|--------------|---------------|------------|
| **Progres Keseluruhan** | Siap Uji & Demo | **SIAP DEMO** | Modul inti warga, petugas BSU, admin BSI, dan monitoring KLH berjalan |
| **Desain Visual (20%)** | Orisinal, Responsif | Terverifikasi | Desain khas Pelayanan Publik Hijau, Tailwind CSS v4, kontras ramah aksesibilitas |
| **Fungsionalitas (20%)** | Alur Lengkap | Terverifikasi | Setoran sampah (auto-balancing), penarikan saldo nasabah, penjualan offtaker, direktori unit |
| **Responsif & Kompatibilitas (15%)** | 375px s.d. 1440px | Terverifikasi | Drawer mobile di dashboard, tabel adaptif, target sentuh minimal 44px |
| **Kinerja & Skala Besar (15%)** | Skala Siap Nasional | Terverifikasi | Server-side pagination, index database b-tree, gzip compression, caching memori |
| **Keamanan & Kualitas** | RBAC, 0 Secret Leak | Terverifikasi | Middleware `requireRole`, Zod validation ganda (frontend & backend), sanitasi error |
| **Automated Testing** | Unit & Flow Tests | Terverifikasi | 64 test lulus pada backend (`node:test`) dan uji regresi frontend |
| **Deployment Ready** | Vercel & Cloud Backend | Terverifikasi | Frontend terkonfigurasi untuk Vercel; backend siap di-deploy via Docker/Procfile |

---

## 1. Ringkasan Proyek & Posisi Strategis

**SIMBA Nusantara** berfokus pada digitalisasi bank sampah di tingkat warga dan pengelola dengan **pilot Sumatera Utara** dan pondasi arsitektur yang dirancang siap untuk mencakup 38 provinsi di Indonesia.

### Ekosistem Pengguna (4 Role Terintegrasi):
1. **Warga / Nasabah:** Memantau saldo tabungan sampah secara real-time, melihat riwayat transaksi setoran, mengajukan pencairan saldo tabungan mandiri, serta kalkulator simulasi nilai ekonomi sampah dan estimasi reduksi CO2.
2. **Petugas Unit Bank Sampah (BSU):** Menginput hasil timbangan sampah di lapangan dengan kalkulasi harga beli otomatis dan menerbitkan bukti transaksi digital.
3. **Administrator Bank Sampah Induk (BSI):** Mengelola master data nasabah, katalog harga sampah dual-pricing (harga beli nasabah vs harga jual industri), verifikasi setoran, persetujuan penarikan saldo, transaksi ke offtaker, dan ekspor laporan keuangan.
4. **Monitoring Nasional (Admin KLH):** Mengawasi agregasi statistik: total tonase terkelola, sirkulasi dana nasabah, dan sebaran wilayah pilot serta status kesiapan provinsi lainnya.

---

## 2. Akun Demo Pengujian (Demo Credentials)

Akun demo berikut disediakan khusus untuk pengujian alur dewan juri (Role-Based Access Control):

| Peran (Role) | Email Login | Password | Akses URL Utama | Tugas Utama yang Didemokan |
|--------------|-------------|----------|-----------------|----------------------------|
| **Administrator BSI** | `admin@simba.id` | `Password123!` | `/admin` | Tata kelola master data, verifikasi transaksi, jual ke offtaker, export CSV laporan |
| **Petugas BSU** | `petugas.melati@simba.id` | `Password123!` | `/petugas` | Input timbangan nasabah, hitung subtotal otomatis, nota transaksi digital |
| **Nasabah Warga** | `nasabah.dewi@simba.id` | `Password123!` | `/nasabah` | Cek saldo tabungan, riwayat setoran, ajukan penarikan saldo, edit profil |
| **Monitoring KLH** | `klh.nasional@menlhk.go.id` | `Password123!` | `/admin/klh` | Monitoring agregasi statistik wilayah pilot Sumut dan kesiapan 38 provinsi |

---

## 3. Matriks Fungsionalitas & Siklus Transaksi

Semua modul transaksi dilengkapi perlindungan integritas data (**Create, Read, Update, Delete/Void**):

| Modul Sistem | Create | Read (Server-Side) | Update | Delete / Void | Mekanisme Integritas Finansial |
|--------------|:------:|:------------------:|:------:|:-------------:|--------------------------------|
| **Jenis Sampah** | Ya | Ya | Ya | Ya | Dual-pricing: harga beli (nasabah) & harga jual (offtaker) |
| **Nasabah** | Ya | Ya (Filter/Cari) | Ya | Ya (Soft-delete) | Status aktif/non-aktif tanpa merusak riwayat transaksi lampau |
| **Setoran Sampah** | Ya | Ya (Pagination) | Ya (Verifikasi) | Ya (Void/Batal) | **Trigger Auto-Reversal:** Saldo nasabah otomatis dikembalikan jika transaksi dibatalkan |
| **Penarikan Saldo**| Ya | Ya (Pagination) | Ya (Pencairan) | Ya (Batal Request)| Validasi saldo tidak boleh defisit; pembatalan request mengembalikan alokasi saldo |
| **Penjualan Offtaker** | Ya | Ya (Pagination) | Ya (Status Kirim)| Ya (Void Transaksi)| Margin pendapatan BSI terlacak otomatis (`total_nominal` vs modal beli) |
| **Klien Industri** | Ya | Ya (Pagination) | Ya | Ya | Relasi aman terhadap data transaksi penjualan |
| **Laporan Masalah**| Ya | Ya | Ya (Tindak Lanjut)| Ya (Hapus Aduan) | Formulir aduan warga dengan validasi tipe berkas dan batas ukuran |
| **Berita & Edukasi**| Ya | Ya (Dynamic slug) | Ya | Ya | Artikel edukasi pemilahan sampah dan wawasan bank sampah |
| **Galeri Foto** | Ya | Ya | Ya | Ya | Dokumentasi kegiatan operasional bank sampah |
| **Ekspor Laporan** | — | Ya (Real CSV) | — | — | Ekspor riwayat setoran, penarikan, dan rekapitulasi data |

---

## 4. Skrip Skenario Presentasi & Demo 5 Menit (Final IT Fest 2026)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 SKENARIO PRESENTASI JURI SIMBA NUSANTARA                    │
│                        Total Durasi: 5 Menit                                │
└─────────────────────────────────────────────────────────────────────────────┘
  ▼
[MENIT 01:00] HOMEPAGE & PILOT SUMATERA UTARA
  • Buka halaman utama: Jelaskan posisi strategis pilot Sumut & arsitektur 38 provinsi.
  • Tunjukkan Peta Sebaran Interaktif dan kalkulator simulasi nilai ekonomi sampah.
  • Paparkan keselarasan alur dengan Permen LHK No. 14/2021 tentang Bank Sampah.

  ▼
[MENIT 02:00] ALUR NASABAH (CITIZEN PORTAL)
  • Login sebagai nasabah (nasabah.dewi@simba.id).
  • Tunjukkan transparansi saldo tabungan di /nasabah.
  • Buka /nasabah/setoran untuk melihat riwayat setoran transparan.
  • Buka /nasabah/penarikan dan lakukan simulasi pengajuan penarikan dana tabungan Rp 50.000.
  • Status penarikan berubah menjadi pending verifikasi petugas.

  ▼
[MENIT 03:00] ALUR PETUGAS LAPANGAN BSU (TIMBANGAN & NOTA)
  • Buka tab baru / incognito, login sebagai petugas (petugas.melati@simba.id).
  • Tunjukkan form input timbangan cepat di /petugas.
  • Pilih nasabah "Dewi Lestari", input setoran sampah terpilah.
  • Subtotal terkalkulasi otomatis. Klik "Simpan Setoran".
  • Muncul modal Nota Transaksi Digital siap cetak.
  • Saldo nasabah bertambah secara atomik via trigger database.

  ▼
[MENIT 04:00] ADMINISTRASI BSI, TRANSAKSI INDUSTRI, & EKSPOR
  • Login sebagai Administrator (admin@simba.id).
  • Buka /admin/penarikan: Setujui pengajuan penarikan saldo Dewi yang diajukan di menit 2.
  • Buka /admin/penjualan/baru: Tunjukkan transaksi hilir ke offtaker daur ulang.
  • Buka /admin/laporan-transaksi: Klik tombol "Export Laporan CSV" untuk unduh data rekap.

  ▼
[MENIT 05:00] MONITORING NASIONAL KLH & KEUNGGULAN ARSITEKTUR
  • Buka dashboard monitoring di /admin/klh.
  • Tunjukkan visualisasi wilayah pilot Sumut dan kesiapan arsitektur 38 provinsi.
  • Tutup dengan memaparkan bukti teknis: 0 Error build Next.js, 64 automated tests passed, dan kesiapan produksi.
```

---

## 5. Arsitektur Teknis & Kinerja

```
┌────────────────────────────────────────────────────────┐
│               FRONTEND (Next.js 16.3.8)                │
│  App Router • TypeScript • Tailwind CSS v4 • Radix UI  │
│  Responsive Mobile Drawer • Dynamic Import • Clean UI  │
└───────────────────────────┬────────────────────────────┘
                            │ HTTPS / JWT Bearer
                            ▼
┌────────────────────────────────────────────────────────┐
│             BACKEND (Node.js & Express.js)             │
│  Gzip Compression • In-Memory Cache • Helmet Security  │
│  Zod Schema Validation • Multer Safe MIME Filter       │
│  Server-side Pagination (Limit/Offset) & Search        │
└───────────────────────────┬────────────────────────────┘
                            │ SQL Pool / Service Role
                            ▼
┌────────────────────────────────────────────────────────┐
│             DATABASE (Supabase PostgreSQL)             │
│  B-Tree Index Tables • Atomic Balancing Triggers       │
│  Dual-Pricing Engine • Relational Schema Integrity     │
│  Pemisahan Data Real vs Demo (is_demo flag)           │
└────────────────────────────────────────────────────────┘
```

---

## 6. Panduan Menjalankan Secara Lokal

### Prasyarat
- Node.js versi 18.x atau 20.x LTS
- Akun [Supabase](https://supabase.com) (Database PostgreSQL Cloud)
- Git & npm

### 1. Kloning Repositori
```bash
git clone https://github.com/username/SIMBA_NKPF_.git
cd SIMBA_NKPF_
```

### 2. Setup Basis Data (Supabase)
1. Buka dashboard proyek Supabase Anda.
2. Masuk ke menu **SQL Editor**.
3. Jalankan skrip `backend/supabase/schema.sql` untuk membuat tabel, trigger saldo, fungsi auto-reversal, dan data awal.

### 3. Konfigurasi Environment Variables

**Backend:**
Salin template `backend/.env.example` ke `backend/.env` dan sesuaikan nilainya:
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://proyek-anda.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
CORS_ORIGIN=http://localhost:3000
```

**Frontend:**
Salin template `frontend/.env.example` ke `frontend/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://proyek-anda.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Instalasi & Menjalankan Aplikasi

**Terminal 1 — Backend API:**
```bash
cd backend
npm install
npm run dev
# Server aktif di http://localhost:5000
```

**Terminal 2 — Frontend Next.js:**
```bash
cd frontend
npm install
npm run dev
# Portal web aktif di http://localhost:3000
```

---

## 7. Verifikasi Kualitas & Automated Tests

### Menjalankan Automated Unit & Flow Tests (Backend)
Backend dilengkapi test suite terotomasi menggunakan Node.js native test runner (`node --test`):
```bash
cd backend
npm test
```
*Hasil uji:* **64 Tests Passed (100% pass)** meliputi:
- Alur kritis keuangan setoran & auto-reversal pembatalan (void).
- Logika penarikan tabungan dan proteksi saldo defisit.
- Enforcing RBAC Guard (Admin, Petugas, Nasabah, KLH).
- Validasi dual-pricing offtaker vs nasabah.
- Validasi masukan data (Zod schemas: nama, NIK, HP, email, password, transaksi).
- Verifikasi struktur master 38 provinsi dan agregasi matematis.

### Menjalankan Production Build & Regression Check (Frontend)
```bash
cd frontend
npm test
npm run build
```
*Hasil build:* **Compiled successfully (0 errors, 27/27 static routes generated)**.

---

## 8. Panduan Deployment Produksi

### A. Deploy Backend (Railway / Render)
1. Hubungkan repositori GitHub ke Railway atau Render.
2. Tentukan sub-folder root ke `backend`.
3. Masukkan environment variables sesuai `backend/.env.example`.
4. Build command: `npm install`, Start command: `npm start`.

### B. Deploy Frontend (Vercel)
1. Buat proyek baru di Vercel dan hubungkan repositori ini.
2. Tetapkan **Root Directory** ke `frontend`.
3. Atur environment variables (`NEXT_PUBLIC_API_URL`, Supabase credentials).
4. Deploy dengan build output otomatis via Next.js.

---

## 9. Lisensi & Pernyataan Orisinalitas

Proyek ini dilisensikan di bawah **MIT License**.  
Dikembangkan secara independen oleh Tim **SIMBA_NKPF_** sebagai prototipe solusi digital tata kelola bank sampah modern untuk IT Fest 2026.
