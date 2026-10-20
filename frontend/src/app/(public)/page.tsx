import dynamic from 'next/dynamic'
import HeroSection from '@/components/home/HeroSection'
import CaraKerjaSection from '@/components/home/CaraKerjaSection'

// Dynamic imports untuk komponen di bawah lipatan (below-the-fold) guna menjaga LCP dan skor Lighthouse
const KalkulatorSection = dynamic(() => import('@/components/home/KalkulatorSection'), {
  loading: () => (
    <div className="min-h-[400px] bg-[#F4EFE4] animate-pulse flex items-center justify-center text-[#66635B] font-mono text-xs">
      Memuat Kalkulator Setoran Sampah...
    </div>
  ),
})

const PetaDanUnitSection = dynamic(() => import('@/components/home/PetaDanUnitSection'), {
  loading: () => (
    <div className="min-h-[450px] bg-[#FAF7F2] animate-pulse flex items-center justify-center text-[#66635B] font-mono text-xs">
      Memuat Peta Sebaran & Direktori Unit Sumut...
    </div>
  ),
})

const HargaTickerSection = dynamic(() => import('@/components/home/HargaTickerSection'), {
  loading: () => (
    <div className="min-h-[350px] bg-[#F4EFE4] animate-pulse flex items-center justify-center text-[#66635B] font-mono text-xs">
      Memuat Papan Harga Acuan...
    </div>
  ),
})

const EdukasiRingkasSection = dynamic(() => import('@/components/home/EdukasiRingkasSection'), {
  loading: () => (
    <div className="min-h-[350px] bg-[#FAF7F2] animate-pulse flex items-center justify-center text-[#66635B] font-mono text-xs">
      Memuat Edukasi & Panduan Warga...
    </div>
  ),
})

const KuisEdukasiSection = dynamic(() => import('@/components/home/KuisEdukasiSection'), {
  loading: () => (
    <div className="min-h-[350px] bg-[#F4EFE4] animate-pulse flex items-center justify-center text-[#66635B] font-mono text-xs">
      Memuat Kuis Pilah Sampah...
    </div>
  ),
})

export const revalidate = 60

export default function HomePage() {
  return (
    <>
      {/* 1. Hero: Nilai utama + 2 CTA + Mockup Nota Fisik + Statistik Masuk Viewport */}
      <HeroSection />

      {/* 2. Cara Kerja 4 Langkah Berkonsep Buku Tabungan */}
      <CaraKerjaSection />

      {/* 3. Kalkulator Setoran Interaktif dengan Lembar Nota Fisik & Stempel Simulasi */}
      <KalkulatorSection />

      {/* 4. Peta & Cari Bank Sampah (Unit Terverifikasi Sumut, Pagination 3 Unit/Halaman) */}
      <PetaDanUnitSection />

      {/* 5. Papan Harga Acuan Terstandardisasi (Katalog Bertanggal, Tanpa Polling Palsu) */}
      <HargaTickerSection />

      {/* 6. Edukasi Ringkas (3 Modul Praktis Warga + Tautan Galeri Foto Kegiatan) */}
      <EdukasiRingkasSection />

      {/* 7. Kuis Interaktif Literasi Pemilahan Sampah */}
      <KuisEdukasiSection />
    </>
  )
}
