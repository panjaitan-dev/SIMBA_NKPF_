'use client'
import Link from 'next/link'
import { Leaf, ArrowDown } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function HeroSection() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <header className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://www.chubb.com/content/dam/chubb-sites/chubb/global/images/things/green-forest-trees-1280x528.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg"
          alt="Danau Toba"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/90" />
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 relative z-10 w-full mt-16">
        <div
          className="flex flex-col items-start"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.7s ease-out',
          }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-6">
            <Leaf size={12} /> Pemerintah Kabupaten Toba
          </span>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
            Sistem Informasi{' '}
            <span className="text-emerald-400">Bank Sampah</span>{' '}
            Kabupaten Toba
          </h1>

          <p className="text-lg md:text-xl text-slate-200 mb-10 leading-relaxed max-w-2xl">
            SIMBA — platform terpadu untuk mengelola bank sampah, melaporkan masalah lingkungan, dan mewujudkan Kabupaten Toba yang bersih dan berkelanjutan.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-emerald-900/30"
            >
              <Leaf size={18} /> Daftar Nasabah
            </Link>
            <Link
              href="/lapor"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors backdrop-blur-sm"
            >
              Lapor Masalah Lingkungan
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '3+', label: 'Unit Bank Sampah' },
              { value: '14+', label: 'Jenis Sampah' },
              { value: '∞', label: 'Dampak Lingkungan' },
              { value: '2024', label: 'Tahun Berdiri' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-center">
                <p className="text-3xl font-extrabold text-emerald-400 mb-1">{stat.value}</p>
                <p className="text-xs text-slate-300 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ArrowDown size={20} className="text-white/50" />
      </div>
    </header>
  )
}
