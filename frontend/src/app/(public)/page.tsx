import dynamic from 'next/dynamic'
import HeroSection from '@/components/home/HeroSection'
import BankSampahSection from '@/components/home/BankSampahSection'
import HargaTickerSection from '@/components/home/HargaTickerSection'

// Dynamic imports for below-the-fold components to reduce initial JS payload
const KalkulatorSection = dynamic(() => import('@/components/home/KalkulatorSection'), {
  loading: () => <div className="min-h-[400px] bg-slate-50 animate-pulse flex items-center justify-center text-slate-400">Memuat Kalkulator Ekonomi Sampah...</div>
})
const PetaProvinsiSection = dynamic(() => import('@/components/home/PetaProvinsiSection'), {
  loading: () => <div className="min-h-[500px] bg-slate-900 animate-pulse flex items-center justify-center text-slate-500">Memuat Peta Interaktif Sebaran Bank Sampah...</div>
})
const FinderBSUSection = dynamic(() => import('@/components/home/FinderBSUSection'), {
  loading: () => <div className="min-h-[400px] bg-slate-50 animate-pulse" />
})
const KuisEdukasiSection = dynamic(() => import('@/components/home/KuisEdukasiSection'), {
  loading: () => <div className="min-h-[400px] bg-slate-900 animate-pulse" />
})
const BeritaSection = dynamic(() => import('@/components/home/BeritaSection'), {
  loading: () => <div className="min-h-[400px] bg-white animate-pulse" />
})
const EdukasiSection = dynamic(() => import('@/components/home/EdukasiSection'), {
  loading: () => <div className="min-h-[400px] bg-slate-50 animate-pulse" />
})
const GaleriSection = dynamic(() => import('@/components/home/GaleriSection'), {
  loading: () => <div className="min-h-[400px] bg-white animate-pulse" />
})

export const revalidate = 60

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BankSampahSection />
      <KalkulatorSection />
      <PetaProvinsiSection />
      <FinderBSUSection />
      <HargaTickerSection />
      <KuisEdukasiSection />
      <BeritaSection />
      <EdukasiSection />
      <GaleriSection />
    </>
  )
}
