import Link from 'next/link'
import {
  BookOpen,
  ArrowRight,
  Leaf,
  Recycle,
  Sparkles,
  ExternalLink,
  Images,
} from 'lucide-react'

const EDUKASI_ITEMS = [
  {
    slug: 'pilah-sampah-rumah-tangga',
    judul: 'Panduan Pilah Sampah dari Rumah Tangga',
    kategori: 'Praktik Warga',
    ringkasan: 'Langkah sederhana memisahkan sampah kering bernilai jual (plastik, kertas, logam) agar tidak tercampur limbah basah sisa makanan.',
    bacaan: '4 menit baca',
    ikon: Recycle,
  },
  {
    slug: 'prinsip-3r-dan-ekonomi-sirkular',
    judul: 'Memahami Prinsip 3R: Reduce, Reuse, Recycle',
    kategori: 'Konsep Lingkungan',
    ringkasan: 'Mengapa mendaur ulang adalah benteng terakhir, dan bagaimana bank sampah memberi nilai rupiah bagi rantai pasok ekonomi sirkular.',
    bacaan: '5 menit baca',
    ikon: Leaf,
  },
  {
    slug: 'komoditas-paling-dicari-bank-sampah',
    judul: 'Komoditas Sampah dengan Nilai Jual Tertinggi',
    kategori: 'Finansial Warga',
    ringkasan: 'Mengenal kode plastik botol PET, perbedaan tembaga super vs tembaga bakar, dan cara mengumpulkan minyak jelantah saring.',
    bacaan: '3 menit baca',
    ikon: BookOpen,
  },
]

export default function EdukasiRingkasSection() {
  return (
    <section id="edukasi-ringkas" className="py-20 sm:py-24 bg-[#FAF7F2] border-b border-[#E2DACB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#D8572A] block mb-2">
              Pengetahuan & Literasi Lingkungan
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B1B18] tracking-tight">
              Edukasi Pilah Sampah & <span className="text-[#1E4D3B]">Buku Tabungan</span>
            </h2>
            <p className="mt-2 text-sm text-[#66635B] max-w-xl">
              Panduan praktis bagi keluarga untuk memaksimalkan timbangan sampah dan menjaga kelestarian lingkungan sekitar.
            </p>
          </div>

          <Link
            href="/edukasi"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1E4D3B] hover:text-[#D8572A] underline decoration-2 shrink-0"
          >
            <span>Buka Modul Edukasi Lengkap</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 3 Kartu Edukasi Ringkas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EDUKASI_ITEMS.map((item) => {
            const Ikon = item.ikon
            return (
              <div
                key={item.slug}
                className="bg-[#F4EFE4] border-2 border-[#E2DACB] rounded-2xl p-6 flex flex-col justify-between hover:shadow-[4px_4px_0px_#1E4D3B] transition-all hover:-translate-y-1 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1E4D3B] bg-[#FAF7F2] px-2.5 py-1 rounded-md border border-[#D4CABA]">
                      {item.kategori}
                    </span>
                    <span className="text-[11px] font-mono text-[#66635B]">
                      {item.bacaan}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-[#1E4D3B] text-white flex items-center justify-center mb-4 group-hover:bg-[#D8572A] transition-colors shadow-xs">
                    <Ikon size={18} />
                  </div>

                  <h3 className="font-serif font-bold text-base text-[#1B1B18] mb-2 leading-snug group-hover:text-[#1E4D3B] transition-colors">
                    {item.judul}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#66635B] leading-relaxed">
                    {item.ringkasan}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E2DACB]">
                  <Link
                    href={`/edukasi`}
                    className="text-xs font-bold text-[#1E4D3B] group-hover:text-[#D8572A] inline-flex items-center gap-1"
                  >
                    <span>Pelajari Panduan Ini</span>
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Ringkasan Galeri & Dokumentasi Kegiatan (Kecil & Rapi) */}
        <div className="mt-12 bg-[#FAF7F2] border border-[#E2DACB] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF2EE] text-[#1E4D3B] flex items-center justify-center shrink-0 border border-[#1E4D3B]/20">
              <Images size={20} />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#1B1B18]">
                Dokumentasi Kegiatan Bank Sampah Unit
              </h4>
              <p className="text-xs text-[#66635B]">
                Lihat arsip foto penimbangan warga, program sosialisasi kelurahan, dan inovasi daur ulang mitra percontohan.
              </p>
            </div>
          </div>

          <Link
            href="/galeri"
            className="px-4 py-2 bg-[#FAF7F2] hover:bg-white text-[#1E4D3B] font-bold text-xs border border-[#1E4D3B] rounded-xl shadow-xs shrink-0 inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Lihat Galeri Foto</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  )
}
