import Link from 'next/link'
import { BookOpen, ArrowRight } from 'lucide-react'
import { safeFetch, SAMPLE_EDUKASI } from '@/lib/sampleData'

export const dynamic = 'force-dynamic'

const KATEGORI_LABELS: Record<string, string> = {
  '3r': '♻️ 3R (Reduce, Reuse, Recycle)',
  bahaya_sampah: '⚠️ Bahaya Sampah Sembarangan',
  jenis_sampah: '🗑️ Jenis-Jenis Sampah',
  bank_sampah: '🏦 Bank Sampah',
  lainnya: '📚 Lainnya',
}

async function getEdukasi() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl || apiUrl.includes('localhost')) return SAMPLE_EDUKASI

  const res = await safeFetch(`${apiUrl}/edukasi`)
  return res?.data?.length ? res.data : SAMPLE_EDUKASI
}

export default async function EdukasiPage() {
  const edukasi = await getEdukasi()
  const byKategori: Record<string, any[]> = {}
  edukasi.forEach((item: any) => {
    if (!byKategori[item.kategori]) byKategori[item.kategori] = []
    byKategori[item.kategori].push(item)
  })

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-emerald-600 font-semibold tracking-widest text-xs uppercase mb-2 block">Pembelajaran</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Edukasi Lingkungan</h1>
          <p className="text-slate-500 mt-2 max-w-2xl">Pelajari cara menjaga lingkungan, mengelola sampah, dan manfaat bergabung di bank sampah.</p>
        </div>

        {Object.entries(byKategori).map(([kategori, items]) => (
          <div key={kategori} className="mb-14">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              {KATEGORI_LABELS[kategori] || kategori}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {items.map((item: any) => (
                <Link key={item.id} href={`/edukasi/${item.slug}`} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-emerald-200 transition-all">
                  {item.thumbnail_url ? (
                    <div className="h-44 overflow-hidden">
                      <img src={item.thumbnail_url} alt={item.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ) : (
                    <div className="h-44 bg-emerald-50 flex items-center justify-center">
                      <BookOpen size={36} className="text-emerald-200" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors mb-2">{item.judul}</h3>
                    {item.ringkasan && <p className="text-slate-500 text-sm line-clamp-2">{item.ringkasan}</p>}
                    <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-emerald-600">Baca <ArrowRight size={13} /></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
