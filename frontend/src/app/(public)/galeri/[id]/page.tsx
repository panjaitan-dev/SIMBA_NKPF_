import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const revalidate = 300

async function getAlbum(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/galeri/${id}`, { next: { revalidate: 300 } })
    if (!res.ok) return null
    return (await res.json()).data
  } catch { return null }
}

export default async function GaleriDetailPage({ params }: { params: { id: string } }) {
  const album = await getAlbum(params.id)
  if (!album) notFound()

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Link href="/galeri" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600 mb-8 transition-colors">
          <ArrowLeft size={16} /> Kembali ke Galeri
        </Link>

        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">{album.judul}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            {album.lokasi && <span className="flex items-center gap-1.5"><MapPin size={15} />{album.lokasi}</span>}
            {album.tanggal_kegiatan && <span className="flex items-center gap-1.5"><Calendar size={15} />{formatDate(album.tanggal_kegiatan)}</span>}
            <span className="text-slate-400">{album.fotos?.length || 0} foto</span>
          </div>
          {album.deskripsi && <p className="text-slate-600 mt-3 max-w-2xl">{album.deskripsi}</p>}
        </div>

        {album.fotos?.length === 0 ? (
          <div className="text-center py-20 text-slate-400">Belum ada foto dalam album ini.</div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {album.fotos?.map((foto: any) => (
              <div key={foto.id} className="break-inside-avoid rounded-xl overflow-hidden shadow-sm">
                <img src={foto.url} alt={foto.caption || album.judul} className="w-full object-cover hover:opacity-95 transition-opacity" loading="lazy" />
                {foto.caption && (
                  <div className="bg-white px-4 py-2 text-xs text-slate-500">{foto.caption}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
