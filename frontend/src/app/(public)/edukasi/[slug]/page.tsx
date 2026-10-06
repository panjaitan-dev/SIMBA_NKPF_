import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { safeFetch, SAMPLE_EDUKASI } from '@/lib/sampleData'

export const dynamic = 'force-dynamic'

async function getEdukasi(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl || apiUrl.includes('localhost')) {
    return SAMPLE_EDUKASI.find(e => e.slug === slug) || SAMPLE_EDUKASI[0]
  }

  const res = await safeFetch(`${apiUrl}/edukasi/slug/${slug}`)
  if (res?.data) return res.data
  return SAMPLE_EDUKASI.find(e => e.slug === slug) || SAMPLE_EDUKASI[0]
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const item = await getEdukasi(params.slug)
  if (!item) return { title: 'Edukasi Tidak Ditemukan' }
  return { title: item.judul, description: item.ringkasan }
}

export default async function EdukasiDetailPage({ params }: { params: { slug: string } }) {
  const item = await getEdukasi(params.slug)
  if (!item) notFound()

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <Link href="/edukasi" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600 mb-8 transition-colors">
          <ArrowLeft size={16} /> Kembali ke Edukasi
        </Link>

        <article className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          {item.thumbnail_url ? (
            <img src={item.thumbnail_url} alt={item.judul} className="w-full h-64 object-cover" />
          ) : (
            <div className="w-full h-48 bg-emerald-50 flex items-center justify-center">
              <BookOpen size={56} className="text-emerald-200" />
            </div>
          )}
          <div className="p-8 md:p-12">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full capitalize mb-4 inline-block">
              {item.kategori?.replace('_', ' ')}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-6 leading-tight">{item.judul}</h1>
            {item.ringkasan && (
              <p className="text-lg text-slate-600 italic border-l-4 border-emerald-500 pl-5 mb-8 leading-relaxed">{item.ringkasan}</p>
            )}
            <div className="prose max-w-none text-slate-700 leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: item.konten?.replace(/\n/g, '<br/>') || '' }} />
          </div>
        </article>
      </div>
    </div>
  )
}
