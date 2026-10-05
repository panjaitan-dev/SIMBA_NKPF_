import Link from 'next/link'
import { ArrowRight, Calendar, Tag } from 'lucide-react'
import { formatDate, truncate } from '@/lib/utils'
import api from '@/lib/api'

async function getHomeData() {
  try {
    const [beritaRes, pengumumanRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/berita?limit=3`, { next: { revalidate: 60 } }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/pengumuman`, { next: { revalidate: 60 } }),
    ])
    const berita = beritaRes.ok ? (await beritaRes.json()).data : []
    const pengumuman = pengumumanRes.ok ? (await pengumumanRes.json()).data : []
    return { berita, pengumuman }
  } catch {
    return { berita: [], pengumuman: [] }
  }
}

export default async function BeritaSection() {
  const { berita, pengumuman } = await getHomeData()

  return (
    <section id="berita" className="py-24 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-emerald-600 font-semibold tracking-widest text-xs uppercase mb-2 block">Pusat Informasi</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Berita & <span className="text-emerald-600">Pengumuman</span>
          </h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
            Informasi terkini seputar kegiatan dan kebijakan Dinas Lingkungan Hidup Kabupaten Toba.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Berita */}
          <div>
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                <h3 className="text-xl font-bold text-slate-900">Berita Terbaru</h3>
              </div>
              <Link href="/berita" className="flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                Lihat Semua <ArrowRight size={14} />
              </Link>
            </div>

            <div className="space-y-5">
              {berita.length === 0 ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-2xl" />
                ))
              ) : (
                berita.map((item: any) => (
                  <Link
                    key={item.id}
                    href={`/berita/${item.slug}`}
                    className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group"
                  >
                    {item.thumbnail_url && (
                      <img
                        src={item.thumbnail_url}
                        alt={item.judul}
                        className="w-24 h-20 object-cover rounded-xl shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full capitalize">
                          {item.kategori}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Calendar size={11} /> {formatDate(item.published_at)}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors text-sm leading-snug">
                        {item.judul}
                      </h4>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Pengumuman */}
          <div>
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
              <h3 className="text-xl font-bold text-slate-900">Pengumuman Terbaru</h3>
            </div>

            <div className="space-y-4">
              {pengumuman.length === 0 ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-2xl" />
                ))
              ) : (
                pengumuman.map((item: any) => (
                  <div key={item.id} className="p-5 border border-slate-200 rounded-2xl hover:border-amber-200 hover:bg-amber-50/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <Tag size={14} className="text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm mb-1">{item.judul}</h4>
                        <p className="text-slate-500 text-xs leading-relaxed">{truncate(item.konten, 100)}</p>
                        <span className="text-xs text-slate-400 mt-2 block">{formatDate(item.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
