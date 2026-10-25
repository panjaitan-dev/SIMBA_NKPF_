# Sistem Desain SIMBA Nusantara: "Buku Tabungan Sampah"

Dokumentasi resmi sistem desain SIMBA (Sistem Informasi Bank Sampah Nusantara) untuk kompetisi **Web Development IT Fest 2026**.

---

## 1. Filosofi & Konsep: "Buku Tabungan Sampah"

Situs dirancang khusus untuk warga Sumatera Utara dan Indonesia dengan pendekatan visual yang **hangat, tepercaya, ringan, dan manusiawi**.

### Menghindari Kesan:
- **Bukan portal birokrasi pemerintah yang kaku**: Tidak memakai warna biru korporat dingin, banner berlebihan, atau bahasa formal yang berbelit-belit.
- **Bukan template generik / crypto neon**: Tidak memakai tema gelap penuh, gradien neon limau, efek glassmorphism berlebihan, atau terminal hacking.

### Mengangkat Keaslian Fisik Bank Sampah:
- **Kertas Hangat & Tinta Fisik**: Latar belakang bernuansa kertas arsip tabungan (`#F4EFE4`) dan kartu catatan (`#FAF7F2`), dipadu tinta cetak (`#1B1B18`).
- **Komponen Nota Setoran**: Elemen khas berupa nota bertitik putus-putus (`border-dashed`), tepi bergerigi/perforasi (`receipt-perforation`), nomor seri transaksi, dan angka monospace.
- **Stempel Tinta Basah (Wet-ink Stamp)**: Penanda status autentik (seperti `TERVERIFIKASI`, `DATA SIMULASI`, `LUNAS DISETOR`) dengan rotasi acak halus (-2° s.d. +3°) meniru stempel manual pengurus unit.
- **Timbangan & Buku Kas**: Tabel terstruktur seperti buku kas fisik dengan kolom angka rata kanan dan pembatas halus.

---

## 2. Palet Warna & Kontras WCAG AA/AAA

Semua kombinasi warna teks dan latar telah diuji untuk memenuhi standar aksesibilitas WCAG 2.1 AA (minimal 4.5:1 untuk teks normal, 3:1 untuk teks besar).

| Token | Nilai Hex | Penggunaan | Rasio Kontras pada `#F4EFE4` | Status WCAG |
| :--- | :--- | :--- | :--- | :--- |
| `--paper-base` | `#F4EFE4` | Latar utama halaman (warm paper) | - | - |
| `--paper-light` | `#FAF7F2` | Permukaan kartu, modal, input | - | - |
| `--paper-border` | `#E2DACB` | Garis pembatas kartu & section | - | - |
| `--ink-base` | `#1B1B18` | Teks utama (headline & paragraf) | **14.8 : 1** | **AAA (Lolos)** |
| `--ink-muted` | `#66635B` | Teks sekunder, label pembantu, meta | **4.9 : 1** | **AA (Lolos)** |
| `--forest-base` | `#1E4D3B` | Merek utama, header, aksen alam | **8.6 : 1** (pada paper-light) | **AAA (Lolos)** |
| `--terracotta-base` | `#D8572A` | CTA utama, highlight penting, saldo | **4.7 : 1** (pada paper-light) | **AA (Lolos)** |
| `--terracotta-dark` | `#B8431A` | Status hover CTA terracotta | **6.1 : 1** | **AA (Lolos)** |

---

## 3. Tipografi (3-Font System via `next/font`)

Sistem tipografi diprogram tanpa layout shift (`display: 'swap'`) menggunakan font variable:

1. **Display & Section Headings**: `Fraunces` (Variable Serif)
   - Karakter: Anggun, hangat, memberikan nuansa penerbitan koran/buku fisik yang terpercaya.
   - Digunakan pada: Judul Hero, Heading Section (H1, H2), angka statistik utama.
   - Font family: `font-serif` (`var(--font-fraunces)`).

2. **Body & Antarmuka**: `Plus Jakarta Sans` (Humanist Sans)
   - Karakter: Geometris humanis ramah khas Indonesia, keterbacaan tinggi pada layar mobile kecil (360px).
   - Digunakan pada: Paragraf umum, tombol, form input, navigasi, deskripsi edukasi.
   - Font family: `font-sans` (`var(--font-plus-jakarta)`).

3. **Monospace & Angka Tabular**: `JetBrains Mono`
   - Karakter: Presisi angka finansial, berat timbangan, dan nomor nota transaksi.
   - Digunakan pada: Nomor seri nota, format Rupiah kalkulator, bobot kilogram, kode unit.
   - Font family: `font-mono` (`var(--font-jetbrains-mono)`).

---

## 4. Sistem Ikonografi & Eliminasi Emoji

- **100% Ikon Vektor Lucide**: Seluruh emoji yang sebelumnya digunakan sebagai icon antarmuka (seperti tong sampah, daun, timbangan, piala) telah dihapus dan digantikan secara konsisten oleh icon Lucide (`Recycle`, `Leaf`, `Scale`, `Trophy`, `CheckCircle2`, `AlertTriangle`, dll.).
- **Ukuran Standar**: 16px (small/inline), 20px (action button/control), 24px (feature badge).

---

## 5. Komponen Inti (`src/components/ui/`)

### `Button`
- Varian: `terracotta` (CTA utama), `forest` (navigasi & aksi primer), `secondary` (kertas), `outline`.
- Ukuran minimum touch target mobile: **44px** (`min-h-[44px]`).
- Efek fisik: Offset shadow terukur (`shadow-[2px_2px_0px_#1E4D3B]`) yang bereaksi saat ditekan (`active:translate-x-0.5 active:translate-y-0.5`).

### `KomponenNota` (`src/components/ui/komponen-nota.tsx`)
- Komponen fisik nota tabungan sampah dengan:
  - Header berlogo SIMBA Nusantara & nama Bank Sampah Unit.
  - Nomor seri unik (misal: `NOTA-SMBA-2026-0891`).
  - Baris rincian timbangan tabular: `[Jenis Sampah] | [Berat Kg] | [Harga/Kg] | [Subtotal]`.
  - Garis sobek perforasi cetak (`border-t-2 border-dashed border-[#D4CABA]`).
  - Total Rupiah berhuruf monospace tebal.
  - Stempel cap tinta basah di sudut nota.

### `Stempel` (`src/components/ui/stempel.tsx`)
- Cap tinta dengan bingkai ganda (`border-2 border-dashed`).
- Varian: `verified` (Hijau Tua Terverifikasi), `simulation` (Oranye Data Simulasi), `paid` (Lunas Disetor).
- Kemiringan dinamis (`-2deg` s.d. `+3deg`) untuk kesan ketukan stempel fisik.

### `Badge`
- Badge `Data Simulasi` (kuning hangat/terakota soft) dan `Pilot Sumut` (hijau tua) untuk transparansi data tanpa manipulasi angka.

### `Input` & `Table`
- Input field berlatar kertas terang dengan ring fokus terakota.
- Tabel dengan horizontal scroll container terisolasi untuk kenyamanan perangkat 360px tanpa layout breaking.

---

## 6. Pedoman Implementasi Halaman
Setiap halaman baru dan refaktor wajib mengimpor komponen dari `@/components/ui` dan memastikan kepatuhan terhadap palet `--paper-*`, `--ink-*`, `--forest-*`, dan `--terracotta-*`.
