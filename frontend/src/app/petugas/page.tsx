'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Scale, Users, ClipboardList, Plus, Trash2, Printer, Save, Loader2, LogOut, LayoutDashboard, Leaf, Search, ChevronDown, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { clearAuthCookies } from '@/lib/auth-client'
import api from '@/lib/api'
import { formatRupiah, formatDate } from '@/lib/utils'
import { DEFAULT_JENIS_SAMPAH, DEFAULT_NASABAH } from '@/lib/constants'
import NotaTransaksiModal, { NotaData } from '@/components/NotaTransaksiModal'
import toast from 'react-hot-toast'

interface FormItem { 
  jenis_sampah_id: string; 
  nama: string; 
  kode: string; 
  satuan: string; 
  berat_kg: string; 
  harga_satuan: number 
}

export default function PetugasDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [jenisList, setJenisList] = useState<any[]>(DEFAULT_JENIS_SAMPAH)
  const [nasabahList, setNasabahList] = useState<any[]>(DEFAULT_NASABAH)
  const [loading, setLoading] = useState(true)

  // Form State
  const [selectedNasabahId, setSelectedNasabahId] = useState('')
  const [nasabahSearch, setNasabahSearch] = useState('')
  const [showNasabahDropdown, setShowNasabahDropdown] = useState(false)
  
  const [items, setItems] = useState<FormItem[]>([{ jenis_sampah_id: '', nama: '', kode: '', satuan: 'kg', berat_kg: '', harga_satuan: 0 }])
  const [metode, setMetode] = useState('Saldo Tabungan')
  const [catatan, setCatatan] = useState('')
  const [saving, setSaving] = useState(false)
  
  const [notaData, setNotaData] = useState<NotaData | null>(null)
  const [isNotaOpen, setIsNotaOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const fetchStats = useCallback(() => {
    Promise.all([
      api.get('/stats/petugas').catch(() => null),
      api.get('/jenis-sampah?is_active=true').catch(() => null),
      api.get('/nasabah?limit=200').catch(() => null),
    ]).then(([sRes, jRes, nRes]) => {
      if (sRes?.data?.data) setStats(sRes.data.data)
      if (jRes?.data?.data?.length) setJenisList(jRes.data.data.map((j:any) => ({ ...j, harga_beli: j.harga_beli || 0 })))
      if (nRes?.data?.data?.length) setNasabahList(nRes.data.data)
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const { parseIndonesianDecimal } = require('@/lib/validation')
  const totalNilai = items.reduce((s, item) => s + (parseIndonesianDecimal(item.berat_kg) || 0) * item.harga_satuan, 0)
  const totalBerat = items.reduce((s, item) => s + (parseIndonesianDecimal(item.berat_kg) || 0), 0)

  const addItem = () => setItems(prev => [...prev, { jenis_sampah_id: '', nama: '', kode: '', satuan: 'kg', berat_kg: '', harga_satuan: 0 }])
  const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i))
  const updateItem = (i: number, field: keyof FormItem, val: string | number) =>
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: val } : item))

  const handleSelectJenis = (idx: number, jenisId: string) => {
    const jenis = jenisList.find(j => j.id === jenisId)
    if (!jenis) {
      updateItem(idx, 'jenis_sampah_id', '')
      updateItem(idx, 'nama', '')
      updateItem(idx, 'kode', '')
      updateItem(idx, 'satuan', 'kg')
      updateItem(idx, 'harga_satuan', 0)
      return
    }
    updateItem(idx, 'jenis_sampah_id', jenisId)
    updateItem(idx, 'nama', jenis.nama)
    updateItem(idx, 'kode', jenis.kode)
    updateItem(idx, 'satuan', jenis.satuan || 'kg')
    updateItem(idx, 'harga_satuan', jenis.harga_beli || 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedNasabahId) { 
      toast.error('Pilih nasabah terlebih dahulu')
      return 
    }
    const validItems = items
      .map((i) => ({ ...i, beratNum: parseIndonesianDecimal(i.berat_kg) }))
      .filter((i) => i.jenis_sampah_id && !isNaN(i.beratNum) && i.beratNum > 0 && i.beratNum <= 10000)

    if (!validItems.length) { 
      toast.error('Tambahkan minimal 1 jenis sampah dengan berat valid (0 < berat <= 10.000 kg)')
      return 
    }
    
    setSaving(true)
    try {
      const r = await api.post('/stats/petugas/setoran', {
        nasabah_id: selectedNasabahId,
        items: validItems.map(i => ({ ...i, berat_kg: i.beratNum })),
        metode_pembayaran: metode,
        catatan,
      })
      const d = r.data.data
      const nasabah = nasabahList.find(n => n.id === selectedNasabahId)
      
      setNotaData({
        tipe: 'pembelian',
        type: 'pembelian',
        nomor_transaksi: d.nomor_setoran,
        nomor: d.nomor_setoran,
        tanggal: new Date().toISOString().split('T')[0],
        nama_pihak: d.nasabah || nasabah?.nama || '',
        identitas_pihak: nasabah?.nomor_nasabah || '',
        id_pihak: nasabah?.nomor_nasabah || '',
        unit_nama: stats?.unit_nama || 'Bank Sampah Unit Pusat',
        items: validItems.map(i => ({ 
          nama: i.nama, 
          kode: i.kode, 
          berat_kg: parseFloat(i.berat_kg), 
          harga_satuan: i.harga_satuan, 
          subtotal: parseFloat(i.berat_kg) * i.harga_satuan 
        })),
        total_berat_kg: d.total_berat_kg,
        total_nilai: d.total_nilai,
        metode_pembayaran: metode,
        saldo_sebelum: d.saldo_lama,
        saldo_sesudah: d.saldo_baru,
      })
      
      setIsNotaOpen(true)
      toast.success(`Setoran ${d.nomor_setoran} berhasil disimpan!`)
      
      // Reset form
      setSelectedNasabahId('')
      setNasabahSearch('')
      setItems([{ jenis_sampah_id: '', nama: '', kode: '', satuan: 'kg', berat_kg: '', harga_satuan: 0 }])
      setCatatan('')
      setMetode('Saldo Tabungan')
      
      // Refresh stats
      api.get('/stats/petugas').then(res => { 
        if (res.data?.data) setStats(res.data.data) 
      }).catch(() => {})
      
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan setoran')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('simba_token')
        localStorage.removeItem('simba_user')
        localStorage.removeItem('simba_role')
        clearAuthCookies()
      }
      const supabase = createClient()
      await supabase.auth.signOut().catch(() => {})
      router.push('/login')
    } catch {}
  }

  const filteredNasabah = nasabahList.filter(n => 
    (n.nama || '').toLowerCase().includes(nasabahSearch.toLowerCase()) || 
    (n.nomor_nasabah || '').toLowerCase().includes(nasabahSearch.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
          <p className="text-slate-500 font-medium animate-pulse">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-30 px-4 flex items-center justify-between shadow-xs">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-xs">
            <Leaf size={16} className="text-white" />
          </div>
          <div>
            <p className="font-extrabold text-slate-900 text-sm tracking-tight leading-none">SIMBA</p>
            <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">Petugas BSU</p>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Backdrop overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Leaf size={16} className="text-white" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-sm">SIMBA</p>
              <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-widest">Petugas BSU</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-700 min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="Tutup menu"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/petugas"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-50 text-emerald-700 min-h-[44px]"
          >
            <LayoutDashboard size={17} /> Dashboard
          </Link>
          <button 
            onClick={() => {
              setMobileOpen(false)
              document.getElementById('form-timbangan')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors min-h-[44px]"
          >
            <Scale size={17} /> Input Timbangan
          </button>
        </nav>
        
        {/* Logout */}
        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors min-h-[44px]"
          >
            <LogOut size={17} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 ml-0 w-full min-w-0 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Dashboard Petugas</h1>
            <p className="text-slate-500 text-sm mt-1">{stats?.unit_nama || 'Bank Sampah Unit Pusat'}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-500">{formatDate(new Date().toISOString())}</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Nasabah</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats?.total_nasabah || nasabahList.length}</h3>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <Scale size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Setoran Hari Ini</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats?.setoran_hari_ini || 0}</h3>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <ClipboardList size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Setoran Pending</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats?.setoran_pending || 0}</h3>
            </div>
          </div>
        </div>

        {/* FORM TIMBANGAN */}
        <div id="form-timbangan" className="bg-white border border-slate-200 rounded-2xl p-8 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Scale size={20} className="text-emerald-600" /> Input Timbangan Sampah
              </h2>
              <p className="text-sm text-slate-500 mt-1">Catat setoran sampah dari nasabah ke bank sampah.</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Pilih Nasabah Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 relative">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Users size={16} className="text-slate-400"/> Nasabah <span className="text-red-500">*</span>
                </label>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                    placeholder="Cari nama atau ID nasabah..."
                    value={nasabahSearch}
                    onChange={(e) => {
                      setNasabahSearch(e.target.value)
                      setShowNasabahDropdown(true)
                      if (selectedNasabahId) setSelectedNasabahId('')
                    }}
                    onFocus={() => setShowNasabahDropdown(true)}
                    onBlur={() => setTimeout(() => setShowNasabahDropdown(false), 200)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown size={16} className="text-slate-400" />
                  </div>
                </div>

                {/* Dropdown Results */}
                {showNasabahDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {filteredNasabah.length > 0 ? (
                      filteredNasabah.map(n => (
                        <div 
                          key={n.id}
                          className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
                          onClick={() => {
                            setSelectedNasabahId(n.id)
                            setNasabahSearch(`${n.nama} (${n.nomor_nasabah || '-'})`)
                            setShowNasabahDropdown(false)
                          }}
                        >
                          <p className="font-semibold text-slate-800 text-sm">{n.nama}</p>
                          <p className="text-xs text-slate-500">{n.nomor_nasabah || 'Tanpa ID'} • {n.alamat || 'Tanpa alamat'}</p>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-slate-500 text-center">Nasabah tidak ditemukan</div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Tanggal Setor</label>
                <div className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed">
                  {formatDate(new Date().toISOString())}
                </div>
              </div>
            </div>

            {/* Rincian Sampah */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700 block border-b border-slate-100 pb-2">Rincian Timbangan</label>
              
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-3 items-start bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="w-full md:w-5/12">
                      <label className="text-xs font-medium text-slate-500 mb-1 block">Jenis Sampah</label>
                      <select
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                        value={item.jenis_sampah_id}
                        onChange={(e) => handleSelectJenis(idx, e.target.value)}
                        required
                      >
                        <option value="">-- Pilih Jenis --</option>
                        {jenisList.map(j => (
                          <option key={j.id} value={j.id}>
                            {j.kode} - {j.nama} ({formatRupiah(j.harga_beli || 0)}/{j.satuan || 'kg'})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="w-full md:w-2/12">
                      <label className="text-xs font-medium text-slate-500 mb-1 block">Berat ({item.satuan || 'kg'})</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                        placeholder="0.00"
                        value={item.berat_kg}
                        onChange={(e) => updateItem(idx, 'berat_kg', e.target.value)}
                        required
                      />
                    </div>

                    <div className="w-full md:w-3/12">
                      <label className="text-xs font-medium text-slate-500 mb-1 block">Subtotal (Rp)</label>
                      <div className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 font-semibold text-right">
                        {formatRupiah((parseFloat(item.berat_kg) || 0) * item.harga_satuan)}
                      </div>
                    </div>

                    <div className="w-full md:w-2/12 flex items-end justify-end md:pb-1 h-full pt-5">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center w-full md:w-auto"
                          title="Hapus baris"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors mt-2"
              >
                <Plus size={16} /> Tambah Jenis Sampah
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
              {/* Pembayaran & Catatan */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Metode Penyaluran Hasil</label>
                  <select
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={metode}
                    onChange={(e) => setMetode(e.target.value)}
                  >
                    <option value="Saldo Tabungan">Simpan ke Saldo Tabungan</option>
                    <option value="Tunai">Bayar Tunai</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Catatan (Opsional)</label>
                  <textarea
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                    rows={3}
                    placeholder="Tambahkan catatan jika perlu..."
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                  ></textarea>
                </div>
              </div>

              {/* Total Summary */}
              <div className="flex flex-col justify-end space-y-4">
                <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-6 rounded-2xl border border-amber-200/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-amber-700 text-sm font-medium">Total Berat</span>
                    <span className="text-amber-900 font-bold">{totalBerat.toFixed(2)} kg</span>
                  </div>
                  <div className="flex justify-between items-end pt-4 border-t border-amber-200/50">
                    <span className="text-amber-700 font-semibold">Total Nilai</span>
                    <span className="text-3xl font-extrabold text-amber-600">{formatRupiah(totalNilai)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving || !selectedNasabahId || totalBerat <= 0}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  {saving ? 'Menyimpan...' : 'Simpan Setoran'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Setoran Hari Ini Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList size={18} className="text-emerald-600" /> Setoran Hari Ini
            </h2>
            <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
              {stats?.setoran_today?.length || 0} Transaksi
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[650px]">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">No. Setoran / Waktu</th>
                  <th className="px-6 py-4 font-semibold">Nasabah</th>
                  <th className="px-6 py-4 font-semibold">Total Berat</th>
                  <th className="px-6 py-4 font-semibold text-right">Total Nilai</th>
                  <th className="px-6 py-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats?.setoran_today?.length > 0 ? (
                  stats.setoran_today.map((s: any, i: number) => (
                    <tr key={s.id || i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{s.nomor_setoran || '-'}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{s.created_at ? new Date(s.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-700">{s.nasabah?.nama || s.nasabah_nama || '-'}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {s.total_berat_kg ? `${s.total_berat_kg} kg` : '-'}
                      </td>
                      <td className="px-6 py-4 font-semibold text-emerald-600 text-right">
                        {formatRupiah(s.total_nilai || 0)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2.5 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                          Selesai
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      Belum ada transaksi setoran hari ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Nota Modal */}
      {notaData && (
        <NotaTransaksiModal 
          isOpen={isNotaOpen} 
          onClose={() => setIsNotaOpen(false)} 
          data={notaData} 
        />
      )}
    </div>
  )
}
