import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Calendar, ArrowLeft, Eye } from 'lucide-react'

export const revalidate = 60

async function getBerita(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/berita/slug/${slug}`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    return (await res.json()).data
  } catch { return null }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const berita = await getBerita(params.slug)
  if (!berita) return { title: 'Berita Tidak Ditemukan' }
  return { title: berita.judul, description: berita.ringkasan }
}

export default async function BeritaDetailPage({ params }: { params: { slug: string } }) {
  const berita = await getBerita(params.slug)
  if (!berita) notFound()

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <Link href="/berita" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600 mb-8 transition-colors">
          <ArrowLeft size={16} /> Kembali ke Berita
        </Link>

        <article className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          {berita.thumbnail_url && (
            <img src={berita.thumbnail_url} alt={berita.judul} className="w-full h-72 object-cover" />
          )}
          <div className="p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full capitalize">{berita.kategori}</span>
              <span className="flex items-center gap-1.5 text-sm text-slate-400"><Calendar size={14} />{formatDate(berita.published_at)}</span>
              <span className="flex items-center gap-1.5 text-sm text-slate-400"><Eye size={14} />{berita.view_count} views</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-6 leading-tight">{berita.judul}</h1>

            {berita.ringkasan && (
              <p className="text-lg text-slate-600 italic border-l-4 border-emerald-500 pl-5 mb-8 leading-relaxed">{berita.ringkasan}</p>
            )}

            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: berita.konten.replace(/\n/g, '<br/>') }} />

            {berita.profiles && (
              <div className="mt-10 pt-6 border-t border-slate-100">
                <p className="text-sm text-slate-500">Ditulis oleh <span className="font-semibold text-slate-700">{berita.profiles.nama_lengkap}</span></p>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}
