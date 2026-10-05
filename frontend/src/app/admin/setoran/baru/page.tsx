'use client'
import { useEffect, useState } from 'react'
import { ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { formatRupiah } from '@/lib/utils'
import toast from 'react-hot-toast'

interface JenisSampah { id: string; nama: string; kode: string; harga_per_satuan: number; satuan: string }
interface Nasabah { id: string; nomor_nasabah: string; nama_lengkap: string }
interface Item { jenis_sampah_id: string; berat_kg: string; harga_satuan: number; nama: string }

export default function InputSetoranPage() {
  const router = useRouter()
  const [jenisList, setJenisList] = useState<JenisSampah[]>([])
  const [nasabahList, setNasabahList] = useState<Nasabah[]>([])
  const [nasabahId, setNasabahId] = useState('')
  const [items, setItems] = useState<Item[]>([{ jenis_sampah_id: '', berat_kg: '', harga_satuan: 0, nama: '' }])
  const [catatan, setCatatan] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    Promise.all([api.get('/jenis-sampah?is_active=true'), api.get('/nasabah')])
      .then(([j, n]) => { setJenisList(j.data.data || []); setNasabahList(n.data.data || []) })
      .catch(console.error)
  }, [])

  const addItem = () => setItems(prev => [...prev, { jenis_sampah_id: '', berat_kg: '', harga_satuan: 0, nama: '' }])
  const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i))

  const updateItem = (i: number, key: string, value: string) => {
    setItems(prev => {
      const next = [...prev]
      next[i] = { ...next[i], [key]: value }
      if (key === 'jenis_sampah_id') {
        const found = jenisList.find(j => j.id === value)
        if (found) { next[i].harga_satuan = found.harga_per_satuan; next[i].nama = found.nama }
      }
      return next
    })
  }

  const total = items.reduce((acc, item) => acc + (parseFloat(item.berat_kg || '0') * item.harga_satuan), 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nasabahId) { toast.error('Pilih nasabah'); return }
    const validItems = items.filter(i => i.jenis_sampah_id && parseFloat(i.berat_kg) > 0)
    if (!validItems.length) { toast.error('Tambahkan minimal 1 item setoran'); return }

    setLoading(true)
    try {
      await api.post('/setoran', {
        nasabah_id: nasabahId, catatan,
        items: validItems.map(i => ({ jenis_sampah_id: i.jenis_sampah_id, berat_kg: parseFloat(i.berat_kg), harga_satuan: i.harga_satuan })),
      })
      toast.success('Setoran berhasil dicatat!')
      router.push('/admin/setoran')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 ml-60 p-8">
      <div className="max-w-2xl">
        <Link href="/admin/setoran" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 mb-4"><ArrowLeft size={14} /> Kembali</Link>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-8">Input Setoran Baru</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pilih Nasabah */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Pilih Nasabah *</label>
            <select value={nasabahId} onChange={e => setNasabahId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-sm bg-white">
              <option value="">-- Pilih Nasabah --</option>
              {nasabahList.map((n: any) => (
                <option key={n.id} value={n.id}>{n.nomor_nasabah} — {n.nama_lengkap}</option>
              ))}
            </select>
          </div>

          {/* Items Setoran */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900">Item Sampah</h2>
              <button type="button" onClick={addItem} className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                <Plus size={15} /> Tambah
              </button>
            </div>
            <div className="space-y-4">
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-5">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Jenis Sampah</label>
                    <select value={item.jenis_sampah_id} onChange={e => updateItem(i, 'jenis_sampah_id', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-sm bg-white">
                      <option value="">-- Pilih --</option>
                      {jenisList.map(j => (
                        <option key={j.id} value={j.id}>{j.nama} ({formatRupiah(j.harga_per_satuan)}/{j.satuan})</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Berat (kg)</label>
                    <input type="number" step="0.001" min="0" value={item.berat_kg} onChange={e => updateItem(i, 'berat_kg', e.target.value)}
                      placeholder="0.000"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-sm" />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Subtotal</label>
                    <p className="px-3 py-2.5 bg-slate-50 rounded-xl text-sm font-semibold text-emerald-700">
                      {formatRupiah(parseFloat(item.berat_kg || '0') * item.harga_satuan)}
                    </p>
                  </div>
                  <div className="col-span-1 flex justify-center pb-0.5">
                    {items.length > 1 && (
                      <button type="button" onClick={() => removeItem(i)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between">
              <span className="font-semibold text-slate-700">Total Nilai</span>
              <span className="text-xl font-extrabold text-emerald-700">{formatRupiah(total)}</span>
            </div>
          </div>

          {/* Catatan */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Catatan (opsional)</label>
            <textarea value={catatan} onChange={e => setCatatan(e.target.value)} rows={2}
              placeholder="Catatan tambahan..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-sm resize-none" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={17} className="animate-spin" /> Menyimpan...</> : 'Simpan Setoran'}
          </button>
        </form>
      </div>
    </div>
  )
}
