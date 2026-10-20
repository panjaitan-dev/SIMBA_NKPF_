import Link from 'next/link'
import { Leaf, MapPin, Mail, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const navLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Cari Unit Terdekat', href: '/bank-sampah' },
  { label: 'Kalkulator Setoran', href: '/#kalkulator' },
  { label: 'Papan Harga Acuan', href: '/#harga' },
  { label: 'Edukasi 3R & Pemilahan', href: '/edukasi' },
  { label: 'Lapor Timbunan Sampah', href: '/lapor' },
]

const legalLinks = [
  { label: 'Kebijakan Privasi', href: '/kebijakan-privasi' },
  { label: 'Syarat & Ketentuan', href: '/syarat-ketentuan' },
]

export default function Footer() {
  return (
    <footer className="bg-[#143528] text-[#FAF7F2] pt-16 pb-10 border-t border-[#1E4D3B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#1E4D3B]">
          {/* Kolom 1: Identitas & Pernyataan Kompetisi (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#FAF7F2] text-[#1E4D3B] rounded-xl flex items-center justify-center shadow-xs">
                <Leaf size={18} />
              </div>
              <span className="font-serif font-black text-xl tracking-tight text-[#FAF7F2]">
                SIMBA <span className="text-[#D8572A]">Nusantara</span>
              </span>
            </div>

            <p className="text-sm text-[#FAF7F2]/80 leading-relaxed max-w-md">
              Sistem Informasi Bank Sampah Nusantara — Platform pencatatan transaksi timbangan,
              buku tabungan nasabah, dan transparansi harga komoditas daur ulang.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="simulation">Data Simulasi</Badge>
              <Badge variant="pilot">Fase Percontohan: Sumatera Utara</Badge>
            </div>

            <p className="text-xs text-[#FAF7F2]/60 font-mono pt-2">
              Karya Prototipe untuk Kompetisi Web Development IT Fest 2026. Bukan portal resmi instansi pemerintah.
            </p>
          </div>

          {/* Kolom 2: Navigasi Cepat (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D8572A]">
              Navigasi Layanan
            </h4>
            <ul className="space-y-2 text-sm">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[#FAF7F2]/80 hover:text-white hover:underline transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Kontak & Sekretariat Tim (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D8572A]">
              Kontak Tim Pengembang
            </h4>
            <ul className="space-y-3 text-sm text-[#FAF7F2]/85">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#D8572A] shrink-0 mt-0.5" />
                <span>Medan, Sumatera Utara, Indonesia (Wilayah Pilot Riset)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-[#D8572A] shrink-0" />
                <a
                  href="mailto:kontak.tim@simba-dev.test"
                  className="hover:text-white underline decoration-dotted"
                >
                  kontak.tim@simba-dev.test
                </a>
              </li>
            </ul>

            <div className="bg-[#1E4D3B]/60 border border-[#FAF7F2]/10 rounded-2xl p-4 mt-3">
              <span className="text-xs font-semibold text-[#FAF7F2] block mb-1">
                Keterbukaan Data Publik
              </span>
              <p className="text-xs text-[#FAF7F2]/75 leading-relaxed">
                Unit yang terdaftar saat ini terbatas pada unit percontohan terverifikasi di Sumatera Utara.
                Wilayah provinsi lain dipersiapkan untuk fase ekspansi berikutnya.
              </p>
            </div>
          </div>
        </div>

        {/* Baris Bawah */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF7F2]/60">
          <p>© 2026 Tim SIMBA Nusantara • Prototipe Lomba IT Fest 2026.</p>
          <div className="flex gap-4">
            {legalLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="hover:text-white hover:underline transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
