import HeroSection from '@/components/home/HeroSection'
import ProfileSection from '@/components/home/ProfileSection'
import BankSampahSection from '@/components/home/BankSampahSection'
import BeritaSection from '@/components/home/BeritaSection'
import EdukasiSection from '@/components/home/EdukasiSection'
import GaleriSection from '@/components/home/GaleriSection'

export const revalidate = 60 // ISR — revalidate setiap 60 detik

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProfileSection />
      <BankSampahSection />
      <BeritaSection />
      <EdukasiSection />
      <GaleriSection />
    </>
  )
}
