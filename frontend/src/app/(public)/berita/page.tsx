import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Calendar, Tag, ArrowRight } from 'lucide-react'
import { safeFetch, SAMPLE_BERITA } from '@/lib/sampleData'

export const dynamic = 'force-dynamic'

async function getBerita(searchParams: any) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl || apiUrl.includes('localhost')) return { data: SAMPLE_BERITA, meta: { total: SAMPLE_BERITA.length, page: 1 } }

  const params = new URLSearchParams({ page: searchParams?.page || '1', limit: '9', ...(searchParams?.kategori ? { kategori: searchParams.kategori } : {}), ...(searchParams?.q ? { search: searchParams.q } : {}) })
  const res = await safeFetch(`${apiUrl}/berita?${params}`)
  if (!res?.data?.length) return { data: SAMPLE_BERITA, meta: { total: SAMPLE_BERITA.length, page: 1 } }
  return res
}

const KATEGORI = ['umum', 'kegiatan', 'pengumuman', 'program']

export default async function BeritaPage({ searchParams }: { searchParams: any }) {
  const { data: berita, meta } = await getBerita(searchParams)

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <span className="text-emerald-600 font-semibold tracking-widest text-xs uppercase mb-2 block">Pusat Informasi</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Berita & Artikel</h1>
          <p className="text-slate-500 mt-2">Informasi terkini seputar operasional, harga komoditas daur ulang, dan kebijakan Bank Sampah Indonesia.</p>
        </div>

        {/* Filter Kategori */}
        <div className="flex flex-wrap gap-2 mb-10">
          <Link href="/berita" className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${!searchParams?.kategori ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300'}`}>
            Semua
          </Link>
          {KATEGORI.map(k => (
            <Link key={k} href={`/berita?kategori=${k}`} className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-colors ${searchParams?.kategori === k ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300'}`}>
              {k}
            </Link>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {berita.map((item: any) => (
            <Link key={item.id} href={`/berita/${item.slug}`} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-emerald-200 transition-all flex flex-col">
              {item.thumbnail_url ? (
                <div className="h-48 overflow-hidden">
                  <img src={item.thumbnail_url} alt={item.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-emerald-50 to-slate-100 flex items-center justify-center">
                  <Tag size={40} className="text-emerald-200" />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full capitalize">{item.kategori}</span>
                    <span className="flex items-center gap-1 text-xs text-slate-400"><Calendar size={11} />{formatDate(item.published_at)}</span>
                  </div>
                  <h2 className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors mb-2 leading-snug line-clamp-2">{item.judul}</h2>
                  {item.ringkasan && <p className="text-slate-500 text-sm line-clamp-2">{item.ringkasan}</p>}
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-emerald-600">Baca Selengkapnya <ArrowRight size={13} /></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
