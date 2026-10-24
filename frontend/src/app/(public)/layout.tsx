import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="relative min-h-screen">
  {/* Full‑screen video background */}
  <video
    src="/images/animasi.mp4"
    autoPlay
    muted
    loop
    playsInline
    className="absolute inset-0 w-full h-full object-cover -z-10"
  />
  <Navbar />
  <main className="relative z-10">{children}</main>
  <Footer />
</div>
      <main>{children}</main>
      <Footer />
    </>
  )
}
