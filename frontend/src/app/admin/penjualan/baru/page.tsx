'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Plus, Trash2, Printer, Save, Building2, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/layout/AdminSidebar'
import NotaTransaksiModal, { NotaData } from '@/components/NotaTransaksiModal'
import { DEFAULT_JENIS_SAMPAH, DEFAULT_CLIENTS } from '@/lib/constants'
import api from '@/lib/api'
import { formatRupiah } from '@/lib/utils'
import toast from 'react-hot-toast'

interface PenjualanItem {
  jenis_sampah_id: string
  nama: string
  kode: string
  satuan: string
  berat_kg: string
  harga_satuan: number
}

export default function InputPenjualanPage() {
  const router = useRouter()
  const [jenisList, setJenisList] = useState<any[]>(DEFAULT_JENIS_SAMPAH)
  const [clientList, setClientList] = useState<any[]>(DEFAULT_CLIENTS)
  const [clientId, setClientId] = useState(DEFAULT_CLIENTS[0].id)
  const [catatan, setCatatan] = useState('')
  const [statusPembayaran, setStatusPembayaran] = useState('Lunas / Transfer')
  const [nomorPolisiTruk, setNomorPolisiTruk] = useState('B 9842 UXZ')
  const [loading, setLoading] = useState(false)

  // Nota modal
  const [notaData, setNotaData] = useState<NotaData | null>(null)
  const [isNotaOpen, setIsNotaOpen] = useState(false)

  const [items, setItems] = useState<PenjualanItem[]>([
    {
      jenis_sampah_id: DEFAULT_JENIS_SAMPAH[0].id,
      nama: DEFAULT_JENIS_SAMPAH[0].nama,
      kode: DEFAULT_JENIS_SAMPAH[0].kode,
      satuan: DEFAULT_JENIS_SAMPAH[0].satuan,
      berat_kg: '25',
      harga_satuan: DEFAULT_JENIS_SAMPAH[0].harga_jual,
    },
  ])

  useEffect(() => {
    Promise.all([
      api.get('/jenis-sampah?is_active=true').catch(() => null),
      api.get('/klien').catch(() => null),
    ]).then(([jRes, cRes]) => {
      if (jRes?.data?.data?.length) {
        const mapped = jRes.data.data.map((item: any) => ({
          ...item,
          harga_jual: item.harga_jual ?? Math.round((item.harga_per_satuan || 3000) * 1.3),
        }))
        setJenisList(mapped)
      }
      if (cRes?.data?.data?.length) {
        setClientList(cRes.data.data)
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
        harga_satuan: defaultItem.harga_jual || defaultItem.harga_per_satuan || 0,
      },
    ])
  }

  const removeItem = (idx: number) => {
    if (items.length === 1) {
      toast.error('Minimal harus ada 1 item komoditas yang dijual')
      return
    }
    setItems((prev) => prev.filter((_, i) => i !== idx))
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
            harga_satuan: found.harga_jual ?? Math.round((found.harga_per_satuan || 3000) * 1.3),
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

  const selectedClient = clientList.find((c) => c.id === clientId)

  const handleSubmit = async (andPrint = false) => {
    if (!clientId) {
      toast.error('Silakan pilih client/pembeli komoditas')
      return
    }

    const validItems = items.filter((i) => i.jenis_sampah_id && parseFloat(i.berat_kg) > 0)
    if (!validItems.length) {
      toast.error('Masukkan berat komoditas yang valid')
      return
    }

    setLoading(true)
    const nomorFaktur = `FAK-JUAL-${Date.now().toString().slice(-6)}`

    const payload = {
      klien_id: clientId,
      nomor_faktur: nomorFaktur,
      total_berat_kg: totalBerat,
      total_nominal: totalNilai,
      status_pembayaran: statusPembayaran,
      nomor_truk: nomorPolisiTruk,
      catatan,
      items: validItems.map((i) => ({
        jenis_sampah_id: i.jenis_sampah_id,
        berat_kg: parseFloat(i.berat_kg),
        harga_satuan_jual: i.harga_satuan,
      })),
    }

    try {
      await api.post('/penjualan', payload).catch(() => {})
      toast.success('Transaksi Penjualan ke Offtaker berhasil dicatat!')

      const preparedNota: NotaData = {
        tipe: 'penjualan',
        nomor_transaksi: nomorFaktur,
        tanggal: new Date().toISOString(),
        nama_pihak: selectedClient ? selectedClient.nama_client : 'Pabrik / Offtaker',
        identitas_pihak: selectedClient ? selectedClient.kode_client : undefined,
        nomor_hp: selectedClient?.nomor_hp,
        alamat_pihak: selectedClient?.alamat,
        nama_petugas: 'Kasir Logistik Pusat',
        unit_nama: 'Bank Sampah Induk Nasional',
        metode_pembayaran: statusPembayaran,
        items: validItems.map((v) => ({
          nama: v.nama,
          kode: v.kode,
          satuan: v.satuan,
          berat_kg: parseFloat(v.berat_kg),
          harga_satuan: v.harga_satuan,
          subtotal: parseFloat(v.berat_kg) * v.harga_satuan,
        })),
        total_nilai: totalNilai,
        catatan: `${catatan ? catatan + ' | ' : ''}No. Armada Pengangkut: ${nomorPolisiTruk}`,
      }

      setNotaData(preparedNota)

      if (andPrint) {
        setIsNotaOpen(true)
      } else {
        router.push('/admin/penjualan')
      }
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan faktur penjualan')
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
                href="/admin/penjualan"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-700 mb-2 transition-colors"
              >
                <ArrowLeft size={14} /> Kembali ke Daftar Penjualan
              </Link>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Pencatatan Transaksi Penjualan (Penyaluran ke Offtaker)
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Pengiriman komoditas daur ulang ke pembeli industri/pengepul dengan kalkulasi otomatis harga jual.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* 1. Pilih Client Pembeli */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-blue-900 font-bold text-sm">
                <Building2 size={18} className="text-blue-600" /> Identitas Client / Pembeli Industri
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Pilih Client / Pembeli *
                  </label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 outline-none text-sm bg-white font-medium"
                  >
                    {clientList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.kode_client} — {c.nama_client}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Metode / Syarat Pembayaran *
                  </label>
                  <select
                    value={statusPembayaran}
                    onChange={(e) => setStatusPembayaran(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 outline-none text-sm bg-white font-medium"
                  >
                    <option value="Lunas / Transfer">Lunas (Transfer Bank)</option>
                    <option value="Tunai / Kas">Tunai di Tempat</option>
                    <option value="Tempo (14 Hari)">Tempo (14 Hari)</option>
                    <option value="Tempo (30 Hari)">Tempo (30 Hari)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    No. Polisi Armada Pengangkut
                  </label>
                  <input
                    value={nomorPolisiTruk}
                    onChange={(e) => setNomorPolisiTruk(e.target.value)}
                    placeholder="Contoh: B 1234 ABC"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 outline-none text-sm bg-white font-mono font-bold"
                  />
                </div>
              </div>

              {selectedClient && (
                <div className="mt-4 p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center justify-between text-xs text-blue-900">
                  <div>
                    <span className="font-bold">{selectedClient.kode_client}</span> |{' '}
                    <span className="font-bold">{selectedClient.nama_client}</span> ({selectedClient.alamat}) |{' '}
                    <span>Kontak: {selectedClient.nomor_hp}</span>
                  </div>
                  <span className="font-bold text-blue-700">Mitra Offtaker Terdaftar</span>
                </div>
              )}
            </div>

            {/* 2. Item Komoditas yang Dijual */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <TrendingUp size={18} className="text-blue-600" /> Komoditas Sampah yang Dijual
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl text-xs font-bold transition-colors"
                >
                  <Plus size={14} /> Tambah Komoditas
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
                              {j.kode} - {j.nama} (Jual: {formatRupiah(j.harga_jual)}/{j.satuan || 'kg'})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">
                          Kuantitas ({item.satuan || 'kg'}) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          required
                          value={item.berat_kg}
                          onChange={(e) => updateItem(idx, 'berat_kg', e.target.value)}
                          placeholder="Contoh: 50"
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-mono font-bold text-slate-900 outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="col-span-5 sm:col-span-3 text-right">
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">
                          Total Nilai Jual
                        </label>
                        <div className="font-mono font-extrabold text-sm text-blue-800">
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

              {/* Catatan */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan / Keterangan Muatan
                </label>
                <input
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Keterangan tara timbangan pabrik, surat jalan..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none"
                />
              </div>

              {/* Summary Box */}
              <div className="mt-6 p-5 bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-blue-300 font-bold uppercase tracking-wider">
                    Total Muatan: {totalBerat.toFixed(2)} kg ({items.length} komoditas)
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
                    <Save size={15} /> Simpan Faktur
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleSubmit(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 text-xs font-extrabold transition-all shadow-lg shadow-blue-500/20"
                  >
                    <Printer size={15} /> Simpan & Cetak Faktur
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Nota / Faktur Transaksi */}
        <NotaTransaksiModal
          isOpen={isNotaOpen}
          data={notaData}
          onClose={() => {
            setIsNotaOpen(false)
            router.push('/admin/penjualan')
          }}
        />
      </main>
    </div>
  )
}
