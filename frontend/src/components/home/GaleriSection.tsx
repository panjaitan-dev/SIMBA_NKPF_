import Link from 'next/link'
import { ArrowRight, Images, MapPin, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { safeFetch, SAMPLE_GALERI } from '@/lib/sampleData'

async function getGaleri() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl || apiUrl.includes('localhost')) return SAMPLE_GALERI

  const res = await safeFetch(`${apiUrl}/galeri?limit=3`)
  return res?.data?.length ? res.data : SAMPLE_GALERI
}

export default async function GaleriSection() {
  const albums = await getGaleri()

  return (
    <section id="galeri" className="py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-emerald-600 font-semibold tracking-widest text-xs uppercase mb-2 block">Dokumentasi</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Galeri <span className="text-emerald-600">Kegiatan</span>
            </h2>
            <p className="text-slate-500 mt-2 max-w-2xl">
              Dokumentasi kegiatan dan program Dinas Lingkungan Hidup Kabupaten Toba.
            </p>
          </div>
          <Link
            href="/galeri"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-emerald-300 hover:text-emerald-700 rounded-xl text-slate-700 font-semibold transition-colors text-sm"
          >
            Lihat Semua <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {albums.map((album: any) => (
            <Link
              key={album.id}
              href={`/galeri/${album.id}`}
              className="group relative overflow-hidden rounded-2xl bg-slate-100 shadow-sm hover:shadow-xl transition-all"
            >
              {album.cover_url ? (
                <img
                  src={album.cover_url}
                  alt={album.judul}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-emerald-100 to-slate-200 flex items-center justify-center">
                  <Images size={48} className="text-emerald-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white font-bold text-lg mb-1">{album.judul}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  {album.lokasi && (
                    <span className="flex items-center gap-1">
                      <MapPin size={11} /> {album.lokasi}
                    </span>
                  )}
                  {album.tanggal_kegiatan && (
                    <span className="flex items-center gap-1">
                      <Calendar size={11} /> {formatDate(album.tanggal_kegiatan)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
