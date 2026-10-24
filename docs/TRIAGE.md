# 🔍 TRIAGE LAPORAN INSIDEN & AKAR MASALAH (24 OKTOBER 2026)

**Sistem:** SIMBA (SIMBAH) Nusantara — Sistem Informasi Bank Sampah  
**Target Pengujian:** `https://simba-nkpf.vercel.app/` & `http://localhost:5000/api`  
**Waktu Temuan:** 24 Oktober 2026 (Hari Freeze Lomba IT Fest 2026)  
**Branch Penanganan:** `fix/freeze-final`  
**Penanggung Jawab:** Senior Full-Stack Engineer + QA Lead + Technical Writer  

---

## 1. Ringkasan Eksekutif & Temuan Gejala

Pada pengujian tanggal 24 Oktober 2026 terhadap live deployment produksi Vercel (`https://simba-nkpf.vercel.app/`), ditemukan beberapa kegagalan kritis pada halaman Admin dan Nasabah:

| Gejala Dilaporkan | Halaman Terdampak | Status HTTP & Error Aktual |
|---|---|---|
| Skeleton tidak pernah terisi | `/admin/galeri` | `400 Bad Request` — `TypeError: fetch failed` |
| 3 toast identik "Gagal memuat laporan" + skeleton menetap | `/admin/berita` | `400 Bad Request` — `TypeError: fetch failed` (serta residu toast un-dismissed lintas rute) |
| Toast "Gagal memuat laporan" SEKALIGUS teks "Tidak ada laporan." | `/admin/laporan` | `400 Bad Request` — `TypeError: fetch failed` (kondisi error ditampilkan sebagai state array kosong) |
| Spinner "Memuat data edukasi..." menetap + toast gagal | `/admin/edukasi` | `400 Bad Request` — `TypeError: fetch failed` |
| Login akun Nasabah (`nasabah.dewi@simba.id`) terpental | `/login` -> `/nasabah` -> `/login` | `404 Not Found` pada `/api/dashboard/nasabah` ("Data nasabah tidak ditemukan"), memicu `.catch(() => router.push('/login'))` |
| Kredensial akun demo & password bocor di UI publik | `/login` | Komponen *"Pilihan Akun Demo (klik untuk isi cepat)"* mengekspos 4 email peran dan password teks terbuka `Password123!` |

---

## 2. Hasil Eksekusi Uji Asli (Smoke API Matrix)

Hasil eksekusi riil dari `scripts/smoke-api.mjs` terhadap `https://simba-nkpf.vercel.app/api`:

```
======================================================
  SIMBA Smoke API Test — Production Target
======================================================
--- [1/2] Pengujian Login 4 Peran ---
  [ADMIN] admin@simba.id       -> Status: 200 ✓ OK Login berhasil
  [ADMIN_KLH] admin.nasional@simba.id -> Status: 200 ✓ OK Login berhasil
  [PETUGAS] petugas.melati@simba.id   -> Status: 200 ✓ OK Login berhasil
  [NASABAH] nasabah.dewi@simba.id     -> Status: 200 ✓ OK Login berhasil

--- [2/2] Matriks Endpoint (HTTP Status x Pesan) ---
┌─────────┬────────────────────────────────────┬────────┬─────────────┬────────┬────────────────────────────────────────────┐
│ (index) │ Endpoint                           │ Method │ Auth        │ Status │ Pesan                                      │
├─────────┼────────────────────────────────────┼────────┼─────────────┼────────┼────────────────────────────────────────────┤
│ 0       │ '/health'                          │ 'GET'  │ 'Anonymous' │ 503    │ 'SIMBA API Server berjalan, namun koneksi' │
│ 1       │ '/stats/nasional'                  │ 'GET'  │ 'Anonymous' │ 200    │ 'object'                                   │
│ 2       │ '/jenis-sampah'                    │ 'GET'  │ 'Anonymous' │ 400    │ 'TypeError: fetch failed'                  │
│ 3       │ '/berita'                          │ 'GET'  │ 'Anonymous' │ 400    │ 'TypeError: fetch failed'                  │
│ 4       │ '/edukasi'                         │ 'GET'  │ 'Anonymous' │ 400    │ 'TypeError: fetch failed'                  │
│ 5       │ '/galeri'                          │ 'GET'  │ 'Anonymous' │ 400    │ 'TypeError: fetch failed'                  │
│ 6       │ '/berita/admin/all'                │ 'GET'  │ 'admin'     │ 400    │ 'TypeError: fetch failed'                  │
│ 7       │ '/edukasi/admin/all'               │ 'GET'  │ 'admin'     │ 400    │ 'TypeError: fetch failed'                  │
│ 8       │ '/laporan?status=pending&limit=50' │ 'GET'  │ 'admin'     │ 400    │ 'TypeError: fetch failed'                  │
│ 9       │ '/nasabah'                         │ 'GET'  │ 'admin'     │ 400    │ 'TypeError: fetch failed'                  │
│ 10      │ '/setoran'                         │ 'GET'  │ 'admin'     │ 400    │ 'TypeError: fetch failed'                  │
│ 11      │ '/penarikan'                       │ 'GET'  │ 'admin'     │ 400    │ 'TypeError: fetch failed'                  │
│ 12      │ '/penjualan'                       │ 'GET'  │ 'admin'     │ 200    │ 'Array(0)'                                 │
│ 13      │ '/klien'                           │ 'GET'  │ 'admin'     │ 200    │ 'Array(0)'                                 │
│ 14      │ '/unit'                            │ 'GET'  │ 'admin'     │ 200    │ 'Array(5)'                                 │
│ 15      │ '/dashboard/admin'                 │ 'GET'  │ 'admin'     │ 200    │ 'object'                                   │
│ 16      │ '/dashboard/nasabah'               │ 'GET'  │ 'nasabah'   │ 404    │ 'Data nasabah tidak ditemukan'             │
└─────────┴────────────────────────────────────┴────────┴─────────────┴────────┴────────────────────────────────────────────┘
```

---

## 3. Investigasi Akar Masalah (Root Cause Analysis)

### 3.1. Masalah Utama 1: Kegagalan Resolusi DNS / Dormant Supabase Database
* **Investigasi:** Uji direct HTTP terhadap upstream Supabase:
  `curl -i https://bjjcyolhkkdljvifzwew.supabase.co/rest/v1/`
  **Output:** `curl: (6) Could not resolve host: bjjcyolhkkdljvifzwew.supabase.co`
* **Analisis:** Proyek Supabase Cloud free-tier yang digunakan telah mengalami *auto-pause* atau terhapus karena masa aktif tanpa trafik. 
* **Dampak:** Backend Node.js Express yang mencoba menghubungi Supabase via client library `@supabase/supabase-js` mengalami kegagalan jaringan (`TypeError: fetch failed`) setelah latensi 7 detik per query. Controller Express menangani kegagalan tersebut dengan:
  ```javascript
  if (error) return res.status(400).json({ success: false, message: error.message });
  ```
  yang langsung memuntahkan error `400 Bad Request: TypeError: fetch failed` ke frontend Next.js.

### 3.2. Masalah Utama 2: Konflik Vercel Rewrites vs. In-App Route Handler
* **Investigasi Commit History:**
  * Commit `86ea42c` & `3c6eff8`: Mengonfigurasi `next.config.ts`:
    ```typescript
    async rewrites() {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (apiUrl && !apiUrl.includes('localhost')) {
        return [
          {
            source: '/api/:path((?!wastebank).*)*',
            destination: `${apiUrl}/:path*`,
          },
        ]
      }
      return []
    }
    ```
  * Commit `54db2aa` (22 Okt 2026): Menambahkan in-memory CRUD pada `frontend/src/app/api/[...path]/route.ts`.
* **Analisis Ketidaksinkronan:**
  Meskipun kode internal Next.js App Router telah dibuat untuk menangani data fallback secara mandiri di `frontend/src/app/api/[...path]/route.ts`, aturan `rewrites` di `next.config.ts` **membajak seluruh rute `/api/*` (kecuali `/api/wastebank`)** dan meneruskannya ke backend Express eksternal yang sedang terputus dari database Supabase. Akibatnya, route handler Next.js yang mandiri tidak pernah dieksekusi di produksi Vercel.

### 3.3. Masalah Utama 3: Bouncing Login Nasabah (`/dashboard/nasabah` 404)
* **Investigasi:**
  Di frontend `frontend/src/app/nasabah/page.tsx`:
  ```typescript
  useEffect(() => {
    api.get('/dashboard/nasabah')
      .then(r => setStats(r.data.data))
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false))
  }, [])
  ```
  Di backend Express `backend/src/controllers/dashboard.controller.js`:
  ```javascript
  const { data: nasabah, error } = await supabase
    .from('nasabah')
    .select('id, saldo, total_setoran_kg, nomor_nasabah, joined_at')
    .eq('profile_id', req.user.id).single();
  if (error || !nasabah) return res.status(404).json({ success: false, message: 'Data nasabah tidak ditemukan' });
  ```
* **Analisis:**
  Akun demo `nasabah.dewi@simba.id` berhasil mendapatkan JWT token saat login karena fungsi login mengecek array akun demo. Namun begitu masuk ke halaman `/nasabah`, endpoint `/api/dashboard/nasabah` gagal menemukan record di Supabase (karena Supabase down), menghasilkan status HTTP 404. Handler `.catch()` di frontend langsung menendang router kembali ke `/login`. Pengguna merasa login gagal padahal terjadi *redirect loop pasca-login*.

### 3.4. Masalah Utama 4: Kesalahan Desain UI Error State & Toast Multiplying
1. **Error ditampilkan sebagai Kosong:** Pada `/admin/laporan`, blok `try...catch` hanya menangkap error dengan `toast.error('Gagal memuat laporan')`, tanpa menyetel state `error: true`. Kondisi `data.length === 0` mengevaluasi benar sehingga menampilkan teks menyesatkan *"Tidak ada laporan."*
2. **Toast Bertumpuk & Residu Lintas Rute:** `react-hot-toast` tidak dibersihkan saat perpindahan halaman (`pathname` change) dan efek re-triggering React StrictMode memicu pemanggilan ganda tanpa `AbortController`, menghasilkan 3 toast bersamaan.

---

## 4. Solusi & Rencana Tindakan (P0 s/d P0-B)

1. **Perbaikan Arsitektur API (Dual-Engine Resilient API):**
   * Perbaiki `next.config.ts` agar route handler internal Vercel Next.js (`frontend/src/app/api/`) menjadi first-class handler yang tangguh dan selalu aktif dengan seed data resmi jika upstream backend tidak merespons atau mengembalikan error.
   * Lengkapi `frontend/src/app/api/[...path]/route.ts` dengan penanganan lengkap: `/api/dashboard/nasabah`, `/api/dashboard/admin`, `/api/laporan`, `/api/berita/admin/all`, `/api/edukasi/admin/all`, `/api/galeri`.
   * Pada backend Express (`backend/src/controllers/`), tambahkan fallback data in-memory saat koneksi Supabase mengembalikan kegagalan koneksi jaringan/DNS (`TypeError: fetch failed`).
2. **Pemulihan Login Nasabah:**
   * Di `/nasabah/page.tsx`, jangan tendang ke `/login` jika error adalah kegagalan pemanggilan statistik (hanya tendang jika status adalah 401 Unauthorized). Berikan state fallback data profil nasabah.
   * Pastikan endpoint `/api/dashboard/nasabah` mengembalikan data demo profil nasabah Dewi Lestari lengkap dengan saldo dan riwayat.
3. **Pembersihan & Pengamanan Kredensial (P0-B):**
   * Hapus komponen demo 1-klik di `/login/page.tsx`. Ganti dengan teks netral: *"Akun uji untuk juri tersedia di dokumen pengumpulan."*
   * Hapus seluruh referensi password plaintext dari UI, README, dan dokumentasi publik.
4. **Resiliensi UI (P0.5):**
   * Tambahkan state error eksplisit dengan tombol *"Coba Lagi"* pada setiap modul admin (`/admin/laporan`, `/admin/berita`, `/admin/edukasi`, `/admin/galeri`).
   * Pasang global route listener untuk mendismiss toast saat navigasi rute terjadi (`toast.dismiss()`).
   * Gunakan timeout 10 detik dan `AbortController` untuk mencegah race condition.
