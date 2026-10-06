import Link from 'next/link'
import { Images, MapPin, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { safeFetch, SAMPLE_GALERI } from '@/lib/sampleData'

export const dynamic = 'force-dynamic'

async function getGaleri() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl || apiUrl.includes('localhost')) return SAMPLE_GALERI

  const res = await safeFetch(`${apiUrl}/galeri`)
  return res?.data?.length ? res.data : SAMPLE_GALERI
}

export default async function GaleriPage() {
  const albums = await getGaleri()

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-emerald-600 font-semibold tracking-widest text-xs uppercase mb-2 block">Dokumentasi</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Galeri Kegiatan</h1>
          <p className="text-slate-500 mt-2">Dokumentasi kegiatan DLH dan Bank Sampah Kabupaten Toba.</p>
        </div>

        {albums.length === 0 ? (
          <div className="text-center py-20 text-slate-400">Belum ada album galeri.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album: any) => (
              <Link key={album.id} href={`/galeri/${album.id}`} className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all bg-slate-100">
                {album.cover_url ? (
                  <img src={album.cover_url} alt={album.judul} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-emerald-100 to-slate-200 flex items-center justify-center">
                    <Images size={48} className="text-emerald-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-white font-bold text-lg mb-1.5">{album.judul}</h2>
                  {album.deskripsi && <p className="text-slate-300 text-xs line-clamp-1 mb-2">{album.deskripsi}</p>}
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    {album.lokasi && <span className="flex items-center gap-1"><MapPin size={11} />{album.lokasi}</span>}
                    {album.tanggal_kegiatan && <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(album.tanggal_kegiatan)}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
