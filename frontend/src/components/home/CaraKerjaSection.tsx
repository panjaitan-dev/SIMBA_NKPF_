import Link from 'next/link'
import {
  Sparkles,
  ArrowRight,
  PackageCheck,
  MapPin,
  Scale,
  Wallet,
  Receipt,
} from 'lucide-react'

const LANGKAH_SETORAN = [
  {
    nomor: '01',
    judul: 'Pilah dari Rumah',
    deskripsi: 'Pisahkan sampah kering bernilai ekonomi (botol plastik, kardus, kertas, kaleng, jelantah) dalam kondisi bersih.',
    ikon: PackageCheck,
    tag: 'Langkah Awal',
  },
  {
    nomor: '02',
    judul: 'Antar ke Unit Terdekat',
    deskripsi: 'Bawa sampah ke Bank Sampah Unit (BSU) terdaftar di kelurahan atau kecamatan Anda saat jam operasional.',
    ikon: MapPin,
    tag: 'Kunjungi Unit',
  },
  {
    nomor: '03',
    judul: 'Timbang & Cetak Nota',
    deskripsi: 'Petugas menimbang secara transparan dan mencetak nota fisik berisi rincian berat dan harga per kilogram.',
    ikon: Scale,
    tag: 'Bukti Nyata',
  },
  {
    nomor: '04',
    judul: 'Saldo Masuk Buku Tabungan',
    deskripsi: 'Rupiah langsung masuk ke saldo rekening Anda. Bisa ditabung untuk kebutuhan keluarga atau ditarik tunai.',
    ikon: Wallet,
    tag: 'Nilai Rupiah',
  },
]

export default function CaraKerjaSection() {
  return (
    <section id="cara-kerja" className="py-20 sm:py-24 bg-[#FAF7F2] border-b border-[#E2DACB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#D8572A] block mb-2">
            Alur Penyetoran Warga
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B1B18] tracking-tight">
            Empat Langkah Mudah{' '}
            <span className="text-[#1E4D3B]">Menabung dari Sampah</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#66635B] leading-relaxed">
            Tidak ada proses birokrasi rumit. Dari dapur rumah hingga buku rekening, semua tercatat transparan.
          </p>
        </div>

        {/* Grid 4 Kartu Langkah */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {LANGKAH_SETORAN.map((langkah, idx) => {
            const Ikon = langkah.ikon
            return (
              <div
                key={langkah.nomor}
                className="bg-[#F4EFE4] border-2 border-[#E2DACB] rounded-2xl p-6 relative flex flex-col justify-between hover:shadow-[4px_4px_0px_#1E4D3B] transition-all hover:-translate-y-1 group"
              >
                {/* Nomor Monospace Besar & Tag */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-black text-[#1E4D3B] bg-[#FAF7F2] px-3 py-1 rounded-xl border border-[#D4CABA]">
                      {langkah.nomor}
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-[#66635B] uppercase tracking-wider">
                      {langkah.tag}
                    </span>
                  </div>

                  {/* Ikon Lucide */}
                  <div className="w-12 h-12 rounded-xl bg-[#1E4D3B] text-white flex items-center justify-center mb-5 group-hover:bg-[#D8572A] transition-colors shadow-xs">
                    <Ikon size={22} />
                  </div>

                  {/* Judul & Deskripsi */}
                  <h3 className="font-serif font-bold text-lg text-[#1B1B18] mb-2 leading-snug">
                    {langkah.judul}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#66635B] leading-relaxed">
                    {langkah.deskripsi}
                  </p>
                </div>

                {/* Indikator Panah di Layar Desktop */}
                {idx < LANGKAH_SETORAN.length - 1 && (
                  <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 text-[#1E4D3B]">
                    <div className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#E2DACB] flex items-center justify-center shadow-xs">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* CTA Bawah Ringkas */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-[#EBF2EE] border border-[#1E4D3B]/20 rounded-2xl p-3 sm:px-6 sm:py-3.5">
            <span className="text-xs sm:text-sm text-[#1E4D3B] font-semibold flex items-center gap-2">
              <Receipt size={16} className="text-[#D8572A]" />
              Ingin tahu berapa estimasi rupiah sampah yang sudah terkumpul di rumah Anda?
            </span>
            <a
              href="#kalkulator"
              className="text-xs sm:text-sm font-bold text-[#D8572A] hover:text-[#B8431A] underline decoration-2 inline-flex items-center gap-1"
            >
              Buka Kalkulator Setoran <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
