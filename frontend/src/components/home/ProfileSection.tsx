import { Award, Target, MapPin } from 'lucide-react'

const misi = [
  'SDM berdaya saing & berakhlak mulia',
  'Infrastruktur terintegrasi & merata',
  'Ekonomi berbasis potensi daerah lokal',
  'Tata kelola pemerintah yang bersih (Parhobas)',
  'Keamanan & ketertiban masyarakat terjaga',
  'Pelestarian nilai budaya & kearifan lokal',
]

export default function ProfileSection() {
  return (
    <section id="tentang" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-emerald-600 font-semibold tracking-widest text-xs uppercase mb-2 block">Profil & Landasan</span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Toba <span className="text-emerald-600">Mantap</span> 2029
        </h2>
        <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
          Visi dan misi pembangunan Kabupaten Toba menuju daerah maju, sejahtera, dan berkelanjutan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tentang DLH */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 shadow-sm flex flex-col items-start">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 mb-5">
            <Award size={22} />
          </div>
          <h3 className="text-emerald-900 text-xl font-bold mb-3">Tentang DLH Toba</h3>
          <p className="text-emerald-800 text-sm leading-relaxed">
            Dinas Lingkungan Hidup Kabupaten Toba berkomitmen mewujudkan tata kelola lingkungan yang berkelanjutan, melindungi ekosistem Danau Toba, dan meningkatkan kualitas hidup masyarakat melalui program bank sampah.
          </p>
        </div>

        {/* Visi */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col items-start">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700 mb-5">
            <Target size={22} />
          </div>
          <h3 className="text-slate-900 text-xl font-bold mb-3">Visi Utama</h3>
          <p className="text-slate-700 text-base font-semibold leading-relaxed italic">
            "Maju Daerahnya, Sejahtera Rakyatnya dan Berkelanjutan Pembangunannya."
          </p>
          <div className="mt-4 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-200 rounded-full" />
        </div>

        {/* Misi */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col items-start">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700 mb-5">
            <MapPin size={22} />
          </div>
          <h3 className="text-slate-900 text-xl font-bold mb-4">Misi Kami</h3>
          <ul className="space-y-2.5 flex-1">
            {misi.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
