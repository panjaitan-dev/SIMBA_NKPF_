'use client'
import { useState } from 'react'
import { ArrowLeft, Upload, Loader2, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function UploadFotoPage() {
  const params = useParams()
  const albumId = params.id as string
  const [files, setFiles] = useState<FileList | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploaded, setUploaded] = useState(false)

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!files || files.length === 0) { toast.error('Pilih foto terlebih dahulu'); return }
    setLoading(true)
    try {
      const fd = new FormData()
      Array.from(files).forEach(f => fd.append('fotos', f))
      await api.post(`/galeri/${albumId}/foto`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success(`${files.length} foto berhasil diunggah!`)
      setUploaded(true)
    } catch (err: any) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-slate-50 ml-60 p-8">
      <div className="max-w-xl">
        <Link href="/admin/galeri" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 mb-4"><ArrowLeft size={14} /> Kembali ke Galeri</Link>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-8">Upload Foto ke Album</h1>

        {uploaded ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <CheckCircle size={48} className="text-emerald-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Foto Berhasil Diunggah!</h2>
            <div className="flex flex-col gap-3 mt-6">
              <button onClick={() => { setUploaded(false); setFiles(null) }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl">Upload Foto Lagi</button>
              <Link href={`/galeri/${albumId}`} target="_blank" className="text-sm text-emerald-600 hover:underline">Lihat Album →</Link>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-8">
            <form onSubmit={handleUpload}>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Pilih Foto (maks. 10 foto sekaligus)</label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:border-emerald-300 transition-colors">
                <Upload size={36} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm mb-4">Klik untuk memilih atau seret foto ke sini</p>
                <input type="file" accept="image/*" multiple onChange={e => setFiles(e.target.files)} className="hidden" id="foto-input" />
                <label htmlFor="foto-input" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm cursor-pointer transition-colors">
                  <Upload size={15} /> Pilih Foto
                </label>
              </div>
              {files && <p className="text-sm text-slate-600 mt-3 font-medium">{files.length} foto dipilih</p>}
              <button type="submit" disabled={loading || !files}
                className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2">
                {loading ? <><Loader2 size={17} className="animate-spin" /> Mengunggah...</> : <><Upload size={17} /> Upload Foto</>}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
