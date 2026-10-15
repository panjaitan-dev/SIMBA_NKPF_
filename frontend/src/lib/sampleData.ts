/**
 * sampleData.ts — Data fallback & utilitas fetch untuk konten CMS publik
 * (Berita, Pengumuman, Edukasi 3R, dan Galeri Foto)
 * Digunakan saat API backend belum terhubung atau saat SSG build.
 */
export const SAMPLE_BERITA = [
  {
    id: '1',
    judul: 'Peluncuran Aplikasi SIMBA Indonesia untuk Integrasi Operasional Bank Sampah Nasional',
    slug: 'peluncuran-simba-indonesia',
    ringkasan: 'Platform digital SIMBA Indonesia resmi diluncurkan guna mempermudah pencatatan transaksi pembelian dan penjualan komoditas daur ulang serta transparansi buku tabungan nasabah.',
    thumbnail_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    kategori: 'program',
    published_at: new Date().toISOString(),
    view_count: 245,
    konten: 'Dalam rangka mengakselerasi target Indonesia Bersih Sampah 2029 dan implementasi ekonomi sirkular, diluncurkan platform digital Sistem Informasi Bank Sampah Indonesia (SIMBA). Program ini bertujuan untuk menstandarisasi tata kelola operasional kasir bank sampah, integrasi data timbangan, dan optimalisasi rantai pasok daur ulang nasional.',
  },
  {
    id: '2',
    judul: 'Aksi Bersih Lingkungan Serentak & Penimbangan Massal Komoditas Daur Ulang',
    slug: 'aksi-bersih-lingkungan-serentak-nasional',
    ringkasan: 'Ratusan bank sampah unit bersama ribuan nasabah bergotong-royong mengumpulkan dan menyortir lebih dari 15 ton sampah bernilai ekonomis.',
    thumbnail_url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
    kategori: 'kegiatan',
    published_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    view_count: 180,
    konten: 'Gerakan penimbangan massal serentak berhasil menghimpun belasan ton material anorganik bernilai tinggi seperti tembaga, aluminium kaleng, dan plastik PET yang langsung disalurkan ke mitra industri daur ulang terdaftar.',
  },
  {
    id: '3',
    judul: 'Edukasi Pemilahan Sampah Bernilai Ekonomis Sejak Dini di Sekolah Adiwiyata',
    slug: 'edukasi-pemilahan-sampah-sekolah-adiwiyata',
    ringkasan: 'Sosialisasi prinsip 3R dan pembentukan unit bank sampah mini di lingkungan sekolah dasar dan menengah.',
    thumbnail_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    kategori: 'umum',
    published_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    view_count: 124,
    konten: 'Pendidikan lingkungan hidup dan pengenalan nilai ekonomi sampah sejak dini menjadi kunci keberlanjutan masa depan. Program pendampingan ini melatih siswa memilah sampah organik dan anorganik serta mengelola tabungan sampah mandiri.',
  },
]

export const SAMPLE_PENGUMUMAN = [
  {
    id: '1',
    judul: 'Jadwal Operasional Kasir & Penimbangan Bank Sampah Unit Pusat',
    konten: 'Penimbangan dan penyetoran sampah dilayani setiap hari Senin s/d Sabtu pukul 08.00 - 16.00 WIB di seluruh loket operasional Bank Sampah Indonesia.',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    judul: 'Penyesuaian Tarif Harga Beli & Harga Jual Komoditas Periode 2026',
    konten: 'Daftar harga beli sampah tembaga, aluminium, plastik PET, dan kardus telah diperbarui mengikuti dinamika pasar daur ulang. Silakan periksa menu Jenis Sampah.',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: '3',
    judul: 'Integrasi Sistem Layanan Publik Berskala Besar SIMBA Indonesia',
    konten: 'Seluruh unit bank sampah dihimbau memanfaatkan modul transaksi cepat POS dan penerbitan nota cetak otomatis untuk mempermudah audit pembukuan.',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
]

export const SAMPLE_EDUKASI = [
  {
    id: '1',
    judul: 'Mengenal Prinsip 3R: Reduce, Reuse, Recycle',
    slug: 'mengenal-prinsip-3r',
    kategori: '3r',
    ringkasan: 'Panduan praktis menerapkan konsep hemat penggunaan, pemanfaatan ulang, dan daur ulang sampah dalam kehidupan sehari-hari.',
    thumbnail_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    konten: 'Prinsip 3R (Reduce, Reuse, Recycle) adalah langkah paling mendasar dan efektif untuk menanggulangi penumpukan sampah. Reduce berarti mengurangi segala sesuatu yang mengakibatkan timbulan sampah, Reuse menggunakan kembali wadah atau kemasan, dan Recycle mendaur ulang sampah bernilai ekonomis melalui bank sampah.',
  },
  {
    id: '2',
    judul: 'Optimalisasi Nilai Logam Berharga: Dari Tembaga hingga Aluminium',
    slug: 'optimalisasi-nilai-logam-berharga',
    kategori: 'jenis_sampah',
    ringkasan: 'Mengapa logam non-ferrous seperti tembaga dan aluminium memiliki nilai tukar rupiah tertinggi di bank sampah.',
    thumbnail_url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    konten: 'Logam seperti tembaga super dan kaleng aluminium dapat didaur ulang tanpa batas tanpa menurunkan kualitas materialnya. Pengumpulan logam secara terpilah memberikan margin keuntungan signifikan bagi nasabah dan unit bank sampah.',
  },
  {
    id: '3',
    judul: 'Klasifikasi Sampah: Organik, Anorganik Bernilai, dan Residu B3',
    slug: 'klasifikasi-sampah-nasional',
    kategori: 'jenis_sampah',
    ringkasan: 'Kenali perbedaan karakteristik sampah organik untuk kompos dan anorganik siap jual ke industri manufaktur daur ulang.',
    thumbnail_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    konten: 'Pemilahan sampah dari sumber adalah kunci kelayakan industri daur ulang. Sampah plastik kering, kertas karton bersih, serta logam memiliki harga serap tinggi di offtaker resmi.',
  },
]

export const SAMPLE_GALERI = [
  {
    id: '1',
    judul: 'Penimbangan Massal & Penyetoran Komoditas Daur Ulang',
    deskripsi: 'Aksi penimbangan bersama ratusan nasabah dengan sistem digital timbangan terintegrasi.',
    lokasi: 'Unit Bank Sampah Induk Jakarta',
    tanggal_kegiatan: '2026-09-15',
    cover_url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    judul: 'Penyaluran Komoditas Sampah Terpilah ke Mitra Industri Offtaker',
    deskripsi: 'Proses muat dan pengiriman sampah terpilah dari gudang bank sampah ke pabrik daur ulang.',
    lokasi: 'Pusat Logistik Bank Sampah Nasional',
    tanggal_kegiatan: '2026-09-20',
    cover_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    judul: 'Sosialisasi & Workshop Manajemen Keuangan Bank Sampah',
    deskripsi: 'Pelatihan pembukuan kasir digital, cetak nota, dan pengelolaan tabungan nasabah.',
    lokasi: 'Aula Pelatihan Bank Sampah Indonesia',
    tanggal_kegiatan: '2026-09-28',
    cover_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
  },
]

// Helper fetch dengan timeout 2 detik agar build tidak pernah hang
export async function safeFetch(url: string, timeoutMs = 2000): Promise<any> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { signal: controller.signal, next: { revalidate: 60 } })
    clearTimeout(id)
    if (!res.ok) return null
    return await res.json()
  } catch {
    clearTimeout(id)
    return null
  }
}
