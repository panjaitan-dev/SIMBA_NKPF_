import Link from 'next/link'
import { Recycle, PiggyBank, ClipboardList, TrendingUp, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: <Recycle size={24} />,
    title: 'Setoran Sampah',
    desc: 'Setor berbagai jenis sampah (plastik, kertas, logam, organik) dan dapatkan nilai rupiah langsung ke saldo tabungan.',
    color: 'text-emerald-700 bg-emerald-100',
  },
  {
    icon: <PiggyBank size={24} />,
    title: 'Tabungan Nasabah',
    desc: 'Saldo tabungan bertambah setiap kali setoran diverifikasi petugas. Tarik kapan saja melalui aplikasi.',
    color: 'text-blue-700 bg-blue-100',
  },
  {
    icon: <ClipboardList size={24} />,
    title: 'Riwayat Transaksi',
    desc: 'Pantau semua setoran dan penarikan secara real-time. Lengkap dengan rincian jenis sampah & beratnya.',
    color: 'text-violet-700 bg-violet-100',
  },
  {
    icon: <TrendingUp size={24} />,
    title: 'Laporan & Statistik',
    desc: 'Admin dan petugas bisa melihat laporan lengkap: total sampah terkumpul, nilai tabungan, & perkembangan unit.',
    color: 'text-amber-700 bg-amber-100',
  },
]

const steps = [
  { num: '01', title: 'Daftar Nasabah', desc: 'Buat akun SIMBA dengan data diri dan pilih unit bank sampah terdekat.' },
  { num: '02', title: 'Kumpulkan Sampah', desc: 'Pisahkan sampah organik dan anorganik di rumah sesuai kategori.' },
  { num: '03', title: 'Setor ke Petugas', desc: 'Bawa sampah ke unit bank sampah. Petugas akan menimbang dan mencatat.' },
  { num: '04', title: 'Saldo Bertambah', desc: 'Setelah diverifikasi, nilai sampah otomatis masuk ke saldo tabunganmu.' },
]

export default function BankSampahSection() {
  return (
    <section id="bank-sampah" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-emerald-400 font-semibold tracking-widest text-xs uppercase mb-2 block">Fitur Utama</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Kelola Bank Sampah{' '}
            <span className="text-emerald-400">Lebih Mudah</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            SIMBA menghadirkan sistem bank sampah digital yang transparan, efisien, dan mudah diakses oleh seluruh nasabah dan petugas.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((f) => (
            <div key={f.title} className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${f.color}`}>
                {f.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-10">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Cara Kerja SIMBA</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.num} className="relative text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-xl mx-auto mb-4">
                  {s.num}
                </div>
                <h4 className="text-white font-bold mb-2">{s.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && (
                  <ArrowRight size={20} className="hidden md:block absolute top-5 -right-3 text-slate-600" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-xl transition-colors"
            >
              Daftar Sekarang <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
