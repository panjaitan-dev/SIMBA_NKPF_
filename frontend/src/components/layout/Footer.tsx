import Link from 'next/link'
import { Leaf, MapPin, Mail, Phone, ChevronRight } from 'lucide-react'

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

const navLinks = ['Tentang', 'Berita', 'Edukasi', 'Galeri']
const resources = [
  { label: 'Portal SIMBA KLHK', href: 'https://simba.kemenlh.go.id/portal/' },
  { label: 'Permen LHK No. 14/2021', href: 'https://jdih.menlhk.go.id/' },
  { label: 'SIPSN Kemensetneg / KLHK', href: 'https://sipsn.menlhk.go.id/' },
  { label: 'Gerakan Indonesia Bersih 2029', href: '#' },
]
const bankLinks = [
  { label: 'Daftar Nasabah', href: '/register' },
  { label: 'Cek Saldo & Tabungan', href: '/nasabah' },
  { label: 'Setoran Sampah (Beli)', href: '/admin/setoran/baru' },
  { label: 'Katalog Sampah & Harga', href: '/admin/jenis-sampah' },
]

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Branding */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                <Leaf size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-extrabold text-lg">SIMBA</h3>
                <p className="text-emerald-500 text-[10px] font-bold tracking-widest uppercase">Bank Sampah Indonesia</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Sistem Informasi Bank Sampah Indonesia — Platform digital pelayanan publik terpadu untuk pencatatan transaksi jual beli, pengelolaan tabungan sampah, dan akselerasi ekonomi sirkular nasional.
            </p>
            <div className="flex gap-3">
              {[
                { href: 'https://simba.kemenlh.go.id/portal/', icon: <Leaf size={16} />, label: 'SIMBA Nasional' },
                { href: 'mailto:kontak@banksampah.id', icon: <Mail size={16} />, label: 'Email' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Bank Sampah */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm tracking-wider">Layanan Nasabah</h4>
            <ul className="space-y-3">
              {bankLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-slate-400 hover:text-emerald-400 text-sm flex items-center gap-2 group transition-colors">
                    <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform text-slate-600" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sumber Daya */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm tracking-wider">Regulasi & Jaringan</h4>
            <ul className="space-y-3">
              {resources.map((r) => (
                <li key={r.label}>
                  <a href={r.href} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-400 text-sm flex items-center gap-2 group transition-colors">
                    <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform text-slate-600" />
                    {r.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm tracking-wider">Sekretariat Pusat</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-slate-500 shrink-0 mt-0.5" />
                <span className="text-slate-400">Pusat Layanan Bank Sampah Indonesia, Gedung Manggala Wanabakti, Jakarta, Indonesia</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-slate-500 shrink-0" />
                <a href="mailto:info@simba.id" className="text-slate-400 hover:text-emerald-400 transition-colors">info@simba.id</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-slate-500 shrink-0" />
                <span className="text-slate-400">+62 21 5703246</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © 2026 <strong className="text-slate-300">Sistem Informasi Bank Sampah Indonesia</strong>. Hak Cipta Dilindungi Undang-Undang.
          </p>
          <div className="flex gap-6 text-sm font-medium">
            <Link href="/kebijakan-privasi" className="text-slate-500 hover:text-emerald-400 transition-colors">Kebijakan Privasi</Link>
            <Link href="/syarat-ketentuan" className="text-slate-500 hover:text-emerald-400 transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
