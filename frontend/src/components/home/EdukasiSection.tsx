import Link from 'next/link'
import { ArrowRight, BookOpen, Recycle, AlertTriangle, Trash2, Building2, LucideIcon } from 'lucide-react'
import { safeFetch, SAMPLE_EDUKASI } from '@/lib/sampleData'

async function getEdukasi() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl || apiUrl.includes('localhost')) return SAMPLE_EDUKASI

  const res = await safeFetch(`${apiUrl}/edukasi?limit=3`)
  return res?.data?.length ? res.data : SAMPLE_EDUKASI
}

const KATEGORI_CONFIG: Record<string, { label: string; icon: LucideIcon }> = {
  '3r': { label: '3R', icon: Recycle },
  bahaya_sampah: { label: 'Bahaya Sampah', icon: AlertTriangle },
  jenis_sampah: { label: 'Jenis Sampah', icon: Trash2 },
  bank_sampah: { label: 'Bank Sampah', icon: Building2 },
  lainnya: { label: 'Lainnya', icon: BookOpen },
}

export default async function EdukasiSection() {
  const edukasi = await getEdukasi()

  return (
    <section id="edukasi" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-emerald-600 font-semibold tracking-widest text-xs uppercase mb-2 block">Pembelajaran</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Edukasi <span className="text-emerald-600">Lingkungan</span>
            </h2>
            <p className="text-slate-500 mt-2 max-w-2xl">
              Materi edukasi untuk meningkatkan kesadaran dan kepedulian terhadap lingkungan dan bank sampah.
            </p>
          </div>
          <Link
            href="/edukasi"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-emerald-300 hover:text-emerald-700 rounded-xl text-slate-700 font-semibold transition-colors text-sm"
          >
            Lihat Semua Edukasi <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {edukasi.map((item: any) => (
            <Link
              key={item.id}
              href={`/edukasi/${item.slug}`}
              className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-emerald-200 transition-all flex flex-col"
            >
              {item.thumbnail_url ? (
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.thumbnail_url}
                    alt={item.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="h-48 bg-emerald-50 flex items-center justify-center">
                  <BookOpen size={40} className="text-emerald-200" />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {(() => {
                    const meta = KATEGORI_CONFIG[item.kategori] || { label: item.kategori, icon: BookOpen }
                    const CatIcon = meta.icon
                    return (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-800 bg-forest-50 border border-forest-200/80 px-2.5 py-1 rounded-full shadow-2xs">
                        <CatIcon size={12} className="text-forest-700" />
                        <span>{meta.label}</span>
                      </span>
                    )
                  })()}
                  <h3 className="font-bold text-slate-800 mt-3 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {item.judul}
                  </h3>
                  {item.ringkasan && (
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{item.ringkasan}</p>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-emerald-600">
                  Baca Selengkapnya <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
