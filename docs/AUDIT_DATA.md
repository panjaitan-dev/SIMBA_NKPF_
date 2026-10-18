# Laporan Audit & Pembersihan Data SIMBA Nusantara

Dokumen ini disusun sebagai bagian dari **Track 1: Fondasi Data Asli Sumatera Utara** untuk memenuhi Aturan Besi:
- **R1 (Data Asli):** Dilarang mengarang unit, kontak, atau data operasional.
- **R3 (Privasi):** Hanya nomor/kontak organisasi publik berizin yang dipublikasikan.
- **R4 (Demo vs Asli):** Akun dan data demo juri diberi penanda `is_demo = true` dan disembunyikan dari semua API publik.
- **R5 (Provinsi Lain):** Master 38 provinsi dipertahankan, namun 37 provinsi non-pilot berstatus `belum_tersedia`.
- **R6 (Bukti & Keamanan DB):** Pembersihan data produksi dirancang lewat transaksi SQL dengan verifikasi sebelum & sesudah.

---

## 1. Temuan Audit Data Saat Ini (Kondisi Awal)

### A. Data Dummy & Karangan Fiktif
1. **`backend/supabase/seed_38_provinsi.sql`:**
   * Memuat 38 unit fiktif yang sengaja diisi untuk meniru cakupan 38 provinsi di Indonesia (contoh: *Bank Sampah Unit Ranah Minang Resik*, *Bank Sampah Unit Bersinar Pasteur*, dll.).
   * Menggunakan nama koordinator dan nomor HP fiktif (mis. *Nurhayati Chaniago*, *0813-4567-1301*).
2. **`backend/supabase/seed_large_scale.sql`:**
   * Berisi 1.000 akun nasabah sintetis dan 5.000 transaksi setoran acak untuk pengujian beban. Seluruh transaksi ini berstatus dummy dan merusak keaslian angka publik jika tidak diisolasi dengan `is_demo = true`.
3. **`frontend/src/components/home/FinderBSUSection.tsx`:**
   * Menggunakan perulangan `DATA_38_PROVINSI.map()` untuk membangkitkan data unit dengan atribut palsu seperti rating bintang `(4.6 + ...)`, jam buka karangan, dan nomor kontak generik.

### B. Data Non-Sumatera Utara
* Terdapat 37 unit di luar provinsi Sumatera Utara pada basis data lama.
* **Tindakan yang disyaratkan:** Sesuai posisi strategis *"Pilot Sumatera Utara, arsitektur siap 38 provinsi"*, seluruh unit publik operasional harus berlokasi di 33 Kabupaten/Kota Sumatera Utara dengan sumber verifikasi yang sah.

### C. Duplikasi & Inkonsistensi Kunci Asing
* Skema `unit_bank_sampah` sebelumnya hanya memiliki constraint `UNIQUE(kode)`. Tidak ada proteksi duplikasi nama per wilayah, tidak ada `slug` ramah URL, dan koordinat belum memiliki validasi spasial (sering kali bernilai NULL).
* Tidak ada relasi formal ke master wilayah (`kabupaten_kota_id` dan `provinsi_kode`), sehingga pencarian direktori mengandalkan pencocokan teks bebas yang rentan salah ketik.

### D. Kolom Kosong & Kurang Lengkap
Pada skema lama `unit_bank_sampah`:
* `slug` : Kosong / belum ada
* `lat` & `lng` : NULL pada mayoritas baris
* `sumber_data` : NULL / tidak tercatat
* `tanggal_verifikasi` : NULL
* `status_verifikasi` : Tidak ada (semua baris otomatis tampil publik)
* `is_demo` : Tidak ada (data demo bercampur baur dengan data publik)

---

## 2. Rencana Pembersihan Data (Idempoten & Aman)

Operasi pembersihan akan dijalankan menggunakan skrip SQL terisolasi di dalam blok transaksi PostgreSQL:
```sql
BEGIN;
  -- 1. Backup snapshot tabel yang terdampak
  -- 2. Migrasi referensi foreign key nasabah & setoran demo ke Unit Demo terisolasi
  -- 3. Hapus data unit fiktif non-Sumut
  -- 4. Beri flag is_demo = true pada unit demo juri dan transaksi terkait
  -- 5. Impor unit Sumatera Utara yang terverifikasi (data asli)
COMMIT; -- atau ROLLBACK jika terjadi anomali
```

### Tabel Perbandingan Jumlah Baris (Sebelum vs Target Sesudah)

| Entitas Data | Sebelum Pembersihan | Target Sesudah Pembersihan | Status & Keterangan |
|--------------|:-------------------:|:--------------------------:|---------------------|
| **Tabel Provinsi** | 0 (hanya ada di file JS) | **38 Provinsi** | 1 `aktif_pilot` (Sumut), 37 `belum_tersedia` |
| **Tabel Kab/Kota** | 0 | **33 Kab/Kota** | 25 Kabupaten & 8 Kota resmi Sumut (BPS 1201-1278) |
| **Unit Publik Terverifikasi** | 38 (Fiktif/Dummy) | **Unit Asli Sumut** | Status `terverifikasi`, `is_demo = false` |
| **Unit Demo Juri** | 0 (Bercampur) | **1 Unit Demo** | Kode `DEMO-MDN01`, `is_demo = true` (Tersembunyi) |
| **Unit Non-Sumut Publik** | 37 unit | **0 unit** ✅ | Sesuai posisi strategis Pilot Sumut |
| **Duplikat Unit/Telepon** | Tidak terproteksi | **0 duplikat** ✅ | Dilindungi UNIQUE slug, kode, dan validasi importir |
| **Akun Demo Juri (4 Role)** | 4 Akun | **4 Akun** | Tetap bisa login, ditandai `is_demo = true` |

---

## 3. Skrip Pembersihan yang Siap Dijalankan

Skrip pembersihan disimpan pada `backend/supabase/cleanup_and_isolate_demo.sql` dengan proteksi:
1. Menjaga akun demo dewan juri (`admin@simba.id`, `petugas.melati@simba.id`, `nasabah.dewi@simba.id`, `klh.nasional@menlhk.go.id`) tetap dapat login dan melakukan CRUD.
2. Mengisolasi akun demo ke unit khusus bertanda `is_demo = true`.
3. Menghapus 37 unit dummy non-Sumut.
4. Memasukkan data awal unit bank sampah Sumatera Utara yang telah terverifikasi sumbernya.
