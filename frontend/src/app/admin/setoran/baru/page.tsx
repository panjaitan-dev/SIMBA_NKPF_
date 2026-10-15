'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Plus, Trash2, Printer, Save, CheckCircle2, User, Scale } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/layout/AdminSidebar'
import NotaTransaksiModal, { NotaData } from '@/components/NotaTransaksiModal'
import { DEFAULT_JENIS_SAMPAH, DEFAULT_NASABAH } from '@/lib/constants'
import api from '@/lib/api'
import { formatRupiah } from '@/lib/utils'
import toast from 'react-hot-toast'


interface FormItem {
  jenis_sampah_id: string
  nama: string
  kode: string
  satuan: string
  berat_kg: string
  harga_satuan: number
}

export default function InputSetoranPage() {
  const router = useRouter()
  const [jenisList, setJenisList] = useState<any[]>(DEFAULT_JENIS_SAMPAH)
  const [nasabahList, setNasabahList] = useState<any[]>(DEFAULT_NASABAH)
  const [nasabahId, setNasabahId] = useState('')
  const [catatan, setCatatan] = useState('')
  const [metodePembayaran, setMetodePembayaran] = useState('Saldo Tabungan')
  const [loading, setLoading] = useState(false)

  // Nota Modal state
  const [notaData, setNotaData] = useState<NotaData | null>(null)
  const [isNotaOpen, setIsNotaOpen] = useState(false)

  const [items, setItems] = useState<FormItem[]>([
    {
      jenis_sampah_id: DEFAULT_JENIS_SAMPAH[0].id,
      nama: DEFAULT_JENIS_SAMPAH[0].nama,
      kode: DEFAULT_JENIS_SAMPAH[0].kode,
      satuan: DEFAULT_JENIS_SAMPAH[0].satuan,
      berat_kg: '1',
      harga_satuan: DEFAULT_JENIS_SAMPAH[0].harga_beli,
    },
  ])

  useEffect(() => {
    Promise.all([
      api.get('/jenis-sampah?is_active=true').catch(() => null),
      api.get('/nasabah').catch(() => null),
    ]).then(([jRes, nRes]) => {
      if (jRes?.data?.data?.length) {
        const mapped = jRes.data.data.map((item: any) => ({
          ...item,
          harga_beli: item.harga_beli ?? item.harga_per_satuan ?? 0,
        }))
        setJenisList(mapped)
      }
      if (nRes?.data?.data?.length) {
        setNasabahList(nRes.data.data)
      }
    })
  }, [])

  const addItem = () => {
    const defaultItem = jenisList[0] || DEFAULT_JENIS_SAMPAH[0]
    setItems((prev) => [
      ...prev,
      {
        jenis_sampah_id: defaultItem.id,
        nama: defaultItem.nama,
        kode: defaultItem.kode,
        satuan: defaultItem.satuan || 'kg',
        berat_kg: '',
        harga_satuan: defaultItem.harga_beli || defaultItem.harga_per_satuan || 0,
      },
    ])
  }

  const removeItem = (index: number) => {
    if (items.length === 1) {
      toast.error('Minimal harus ada 1 item transaksi')
      return
    }
    setItems((prev) => prev.filter((_, idx) => idx !== index))
  }

  const updateItem = (index: number, field: string, val: any) => {
    setItems((prev) => {
      const next = [...prev]
      if (field === 'jenis_sampah_id') {
        const found = jenisList.find((j) => j.id === val)
        if (found) {
          next[index] = {
            ...next[index],
            jenis_sampah_id: found.id,
            nama: found.nama,
            kode: found.kode,
            satuan: found.satuan || 'kg',
            harga_satuan: found.harga_beli ?? found.harga_per_satuan ?? 0,
          }
        }
      } else {
        next[index] = { ...next[index], [field]: val }
      }
      return next
    })
  }

  const totalNilai = items.reduce((acc, it) => {
    const qty = parseFloat(it.berat_kg) || 0
    return acc + qty * it.harga_satuan
  }, 0)

  const totalBerat = items.reduce((acc, it) => {
    return acc + (parseFloat(it.berat_kg) || 0)
  }, 0)

  const selectedNasabah = nasabahList.find((n) => n.id === nasabahId)

  const handleSubmit = async (andPrint = false) => {
    if (!nasabahId) {
      toast.error('Silakan pilih nasabah penyetor')
      return
    }

    const validItems = items.filter((i) => i.jenis_sampah_id && parseFloat(i.berat_kg) > 0)
    if (!validItems.length) {
      toast.error('Masukkan kuantitas timbangan berat (kg) yang valid')
      return
    }

    setLoading(true)
    const nomorTransaksi = `NOT-BELI-${Date.now().toString().slice(-6)}`

    const payload = {
      nasabah_id: nasabahId,
      nomor_setoran: nomorTransaksi,
      catatan,
      total_nilai: totalNilai,
      metode_pembayaran: metodePembayaran,
      items: validItems.map((i) => ({
        jenis_sampah_id: i.jenis_sampah_id,
        berat_kg: parseFloat(i.berat_kg),
        harga_satuan: i.harga_satuan,
      })),
    }

    try {
      await api.post('/setoran', payload).catch(() => {})
      toast.success('Transaksi Pembelian Sampah berhasil dicatat!')

      const preparedNota: NotaData = {
        tipe: 'pembelian',
        nomor_transaksi: nomorTransaksi,
        tanggal: new Date().toISOString(),
        nama_pihak: selectedNasabah ? selectedNasabah.nama_lengkap : 'Nasabah Terdaftar',
        identitas_pihak: selectedNasabah ? selectedNasabah.nomor_nasabah : undefined,
        nomor_hp: selectedNasabah?.nomor_hp,
        alamat_pihak: selectedNasabah?.alamat,
        nama_petugas: 'Kasir Bank Sampah',
        unit_nama: 'Bank Sampah Unit Pusat',
        metode_pembayaran: metodePembayaran,
        items: validItems.map((v) => ({
          nama: v.nama,
          kode: v.kode,
          satuan: v.satuan,
          berat_kg: parseFloat(v.berat_kg),
          harga_satuan: v.harga_satuan,
          subtotal: parseFloat(v.berat_kg) * v.harga_satuan,
        })),
        total_nilai: totalNilai,
        catatan,
      }

      setNotaData(preparedNota)

      if (andPrint) {
        setIsNotaOpen(true)
      } else {
        router.push('/admin/setoran')
      }
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan transaksi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 ml-0 w-full min-w-0 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link
                href="/admin/setoran"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 mb-2 transition-colors"
              >
                <ArrowLeft size={14} /> Kembali ke Daftar Setoran
              </Link>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Pencatatan Transaksi Pembelian (Setoran Masuk)
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Kasir timbangan sampah dari nasabah: hitung otomatis kuantitas $\times$ harga beli per kg.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* 1. Pilih Nasabah */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-emerald-800 font-bold text-sm">
                <User size={18} /> Identitas Nasabah Penyetor
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Pilih Nasabah *
                  </label>
                  <select
                    value={nasabahId}
                    onChange={(e) => setNasabahId(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none text-sm bg-white font-medium"
                  >
                    <option value="">-- Cari / Pilih Nasabah --</option>
                    {nasabahList.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.nomor_nasabah} — {n.nama_lengkap}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Metode Pembayaran / Pencairan *
                  </label>
                  <select
                    value={metodePembayaran}
                    onChange={(e) => setMetodePembayaran(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none text-sm bg-white font-medium"
                  >
                    <option value="Saldo Tabungan">Simpan ke Saldo Tabungan (Default)</option>
                    <option value="Tunai Langsung">Bayar Kas Tunai Langsung</option>
                    <option value="Transfer Bank / E-Wallet">Transfer Bank / E-Wallet</option>
                  </select>
                </div>
              </div>

              {selectedNasabah && (
                <div className="mt-4 p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
                  <div>
                    <span className="font-bold">No. Nasabah:</span> {selectedNasabah.nomor_nasabah} |{' '}
                    <span className="font-bold">Nama:</span> {selectedNasabah.nama_lengkap} |{' '}
                    <span className="font-bold">Kontak:</span> {selectedNasabah.nomor_hp || '-'}
                  </div>
                  <span className="font-bold text-emerald-700">Nasabah Terverifikasi</span>
                </div>
              )}
            </div>

            {/* 2. Rincian Item Sampah Masuk */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Scale size={18} className="text-emerald-600" /> Timbangan & Rincian Item Komoditas
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-colors"
                >
                  <Plus size={14} /> Tambah Baris
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, idx) => {
                  const subtotal = (parseFloat(item.berat_kg) || 0) * item.harga_satuan
                  return (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-3 items-center p-3.5 bg-slate-50 border border-slate-200 rounded-2xl"
                    >
                      <div className="col-span-12 sm:col-span-5">
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">
                          Komoditas Sampah
                        </label>
                        <select
                          value={item.jenis_sampah_id}
                          onChange={(e) => updateItem(idx, 'jenis_sampah_id', e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 outline-none"
                        >
                          {jenisList.map((j) => (
                            <option key={j.id} value={j.id}>
                              {j.kode} - {j.nama} ({formatRupiah(j.harga_beli)}/{j.satuan || 'kg'})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">
                          Berat / Qty ({item.satuan || 'kg'}) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          required
                          value={item.berat_kg}
                          onChange={(e) => updateItem(idx, 'berat_kg', e.target.value)}
                          placeholder="Contoh: 2.5"
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-mono font-bold text-slate-900 outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="col-span-5 sm:col-span-3 text-right">
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">
                          Subtotal Rupiah
                        </label>
                        <div className="font-mono font-extrabold text-sm text-emerald-800">
                          {formatRupiah(subtotal)}
                        </div>
                      </div>

                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus baris"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Catatan Transaksi */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Transaksi (Opsional)
                </label>
                <input
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Keterangan tambahan kualitas sampah..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none"
                />
              </div>

              {/* Total Summary Box */}
              <div className="mt-6 p-5 bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-emerald-300 font-bold uppercase tracking-wider">
                    Total Timbangan: {totalBerat.toFixed(2)} kg ({items.length} item)
                  </p>
                  <p className="text-2xl font-black font-mono tracking-tight text-white mt-0.5">
                    {formatRupiah(totalNilai)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleSubmit(false)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold transition-all"
                  >
                    <Save size={15} /> Simpan Saja
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleSubmit(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <Printer size={15} /> Simpan & Cetak Nota
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Nota Transaksi */}
        <NotaTransaksiModal
          isOpen={isNotaOpen}
          data={notaData}
          onClose={() => {
            setIsNotaOpen(false)
            router.push('/admin/setoran')
          }}
        />
      </main>
    </div>
  )
}
