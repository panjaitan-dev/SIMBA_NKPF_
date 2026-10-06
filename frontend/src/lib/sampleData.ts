import { createClient } from '@/lib/supabase/client'

// Sample data default jika database masih kosong atau saat build
export const SAMPLE_BERITA = [
  {
    id: '1',
    judul: 'DLH Kabupaten Toba Luncurkan Aplikasi SIMBA untuk Pengelolaan Bank Sampah Terpadu',
    slug: 'dlh-toba-luncurkan-simba',
    ringkasan: 'Dinas Lingkungan Hidup Kabupaten Toba resmi meluncurkan platform digital SIMBA untuk mempermudah warga menabung sampah dan memantau saldo tabungan secara transparan.',
    thumbnail_url: 'https://www.chubb.com/content/dam/chubb-sites/chubb/global/images/things/green-forest-trees-1280x528.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg',
    kategori: 'program',
    published_at: new Date().toISOString(),
    view_count: 142,
    konten: 'Dalam rangka mewujudkan visi Toba Mantap 2029, Dinas Lingkungan Hidup Kabupaten Toba menghadirkan inovasi digital berupa Sistem Informasi Bank Sampah (SIMBA). Program ini bertujuan untuk mendorong partisipasi aktif masyarakat dalam memilah sampah dari rumah tangga dan menukarkannya menjadi nilai ekonomis yang bermanfaat.',
  },
  {
    id: '2',
    judul: 'Aksi Bersih Lingkungan Serentak di Sepanjang Pesisir Danau Toba',
    slug: 'aksi-bersih-lingkungan-pesisir-danau-toba',
    ringkasan: 'Ratusan warga, relawan, dan jajaran DLH Kabupaten Toba bergotong-royong membersihkan sampah anorganik di kawasan wisata Danau Toba.',
    thumbnail_url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
    kategori: 'kegiatan',
    published_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    view_count: 98,
    konten: 'Kegiatan gotong royong membersihkan kawasan pesisir Danau Toba berhasil mengumpulkan lebih dari 2 ton sampah anorganik yang kemudian disalurkan langsung ke Unit Bank Sampah Induk Toba untuk dipilah dan didaur ulang.',
  },
  {
    id: '3',
    judul: 'Edukasi Pemilahan Sampah Sejak Dini di Sekolah Adiwiyata Balige',
    slug: 'edukasi-pemilahan-sampah-sekolah-adiwiyata',
    ringkasan: 'Sosialisasi prinsip 3R dan pembentukan unit bank sampah mini di lingkungan sekolah dasar dan menengah di Balige.',
    thumbnail_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    kategori: 'umum',
    published_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    view_count: 76,
    konten: 'Pendidikan lingkungan hidup sejak dini menjadi kunci keberlanjutan masa depan. DLH Toba aktif mendampingi sekolah-sekolah untuk membentuk kebiasaan membuang sampah pada tempatnya dan memisahkan sampah organik serta plastik.',
  },
]

export const SAMPLE_PENGUMUMAN = [
  {
    id: '1',
    judul: 'Jadwal Operasional Penimbangan Bank Sampah Unit Induk Balige',
    konten: 'Penimbangan dan penyetoran sampah dilayani setiap hari Senin s/d Sabtu pukul 08.00 - 15.00 WIB bertempat di Kantor DLH Jl. Hutabulu Mejan No. 14, Balige.',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    judul: 'Penyesuaian Harga Beli Sampah Anorganik Periode 2026',
    konten: 'Daftar harga beli sampah plastik PET, kaleng aluminium, dan kertas karton telah diperbarui. Silakan cek menu Jenis Sampah untuk informasi tarif terkini.',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: '3',
    judul: 'Himbauan Pengelolaan Sampah Menjelang Event Wisata Toba',
    konten: 'Dihimbau kepada seluruh pelaku usaha dan masyarakat untuk menjaga kebersihan fasilitas umum serta memilah sampah pada tempat pembuangan terpadu.',
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
    konten: 'Prinsip 3R (Reduce, Reuse, Recycle) adalah langkah paling mendasar dan efektif untuk menanggulangi penumpukan sampah. Reduce berarti mengurangi segala sesuatu yang mengakibatkan sampah, Reuse berarti menggunakan kembali sampah yang masih dapat digunakan, dan Recycle berarti mengolah kembali sampah menjadi barang baru yang bermanfaat.',
  },
  {
    id: '2',
    judul: 'Bahaya Membuang Sampah Sembarangan bagi Ekosistem Danau Toba',
    slug: 'bahaya-sampah-danau-toba',
    kategori: 'bahaya_sampah',
    ringkasan: 'Dampak pencemaran limbah plastik dan sampah domestik terhadap kelestarian kualitas air dan biota Danau Toba.',
    thumbnail_url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
    konten: 'Danau Toba sebagai salah satu destinasi pariwisata super prioritas dan sumber kehidupan masyarakat membutuhkan perlindungan bersama. Sampah plastik membutuhkan waktu ratusan tahun untuk terurai dan dapat mencemari rantai makanan melalui mikroplastik.',
  },
  {
    id: '3',
    judul: 'Membedakan Sampah Organik, Anorganik, dan B3',
    slug: 'membedakan-jenis-sampah',
    kategori: 'jenis_sampah',
    ringkasan: 'Kenali perbedaan karakteristik sampah organik yang dapat dikomposkan dan sampah anorganik yang bernilai ekonomis.',
    thumbnail_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    konten: 'Pemilahan sampah dari sumbernya adalah langkah pertama menuju sistem bank sampah yang efisien. Sampah organik mencakup sisa makanan dan daun, anorganik mencakup plastik, botol, dan kaleng, sementara limbah B3 memerlukan perlakuan khusus.',
  },
]

export const SAMPLE_GALERI = [
  {
    id: '1',
    judul: 'Gotong Royong Bersih Venue dan Pesisir Pantai Balige',
    deskripsi: 'Aksi pembersihan massal melibatkan komunitas pecinta alam, pelajar, dan jajaran dinas lingkungan hidup.',
    lokasi: 'Balige, Kab. Toba',
    tanggal_kegiatan: '2026-09-15',
    cover_url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    judul: 'Penimbangan dan Edukasi Bank Sampah Unit Laguboti',
    deskripsi: 'Kegiatan penimbangan rutin mingguan nasabah bank sampah unit Laguboti dan penukaran saldo tabungan.',
    lokasi: 'Laguboti, Kab. Toba',
    tanggal_kegiatan: '2026-09-20',
    cover_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    judul: 'Sosialisasi Program Adiwiyata dan Bank Sampah Sekolah',
    deskripsi: 'Pembinaan sekolah-sekolah di Kabupaten Toba dalam rangka penilaian Sekolah Peduli dan Berbudaya Lingkungan.',
    lokasi: 'Porsea, Kab. Toba',
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
