'use client'
import { useState, useEffect, useRef } from 'react'
import api from '@/lib/api'

interface StatItem {
  label: string
  value: number
  prefix?: string
  suffix?: string
  target: number
}

export default function HeroSection() {
  const [visible, setVisible] = useState(false)
  const [stats, setStats] = useState<StatItem[]>([
    { label: 'Nasabah Aktif', value: 0, target: 2341891, suffix: '' },
    { label: 'Sampah Terkumpul', value: 0, target: 89543, suffix: ' ton' },
    { label: 'Rupiah Dibayarkan', value: 0, prefix: 'Rp ', target: 178, suffix: ' M' },
    { label: 'Unit Bank Sampah', value: 0, target: 14823, suffix: '' },
  ])
  const animRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setVisible(true)
    // Fetch real stats
    api.get('/stats/nasional').then((r) => {
      const d = r.data.data
      setStats([
        { label: 'Nasabah Aktif', value: 0, target: d.total_nasabah, suffix: '' },
        { label: 'Sampah Terkumpul', value: 0, target: Math.round(d.total_kg / 1000), suffix: ' ton' },
        { label: 'Rupiah Dibayarkan', value: 0, prefix: 'Rp ', target: Math.round(d.total_rupiah / 1_000_000_000), suffix: ' M' },
        { label: 'Unit Bank Sampah', value: 0, target: d.total_bsu, suffix: '' },
      ])
    }).catch(() => {})
  }, [])

  // Animated counter
  useEffect(() => {
    if (!visible) return
    const duration = 2000
    const steps = 60
    const interval = duration / steps
    let step = 0
    animRef.current = setInterval(() => {
      step++
      const progress = step / steps
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setStats((prev) => prev.map((s) => ({ ...s, value: Math.round(s.target * eased) })))
      if (step >= steps) clearInterval(animRef.current!)
    }, interval)
    return () => clearInterval(animRef.current!)
  }, [visible, stats[0].target])

  const formatStat = (s: StatItem) => {
    const n = s.value.toLocaleString('id-ID')
    return `${s.prefix || ''}${n}${s.suffix || ''}`
  }

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900">
      {/* Animated bg pattern */}
      <div className="absolute inset-0 z-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#059669" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-700/15 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 w-full mt-16">
        <div
          className="flex flex-col items-start"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Sistem Informasi Bank Sampah Indonesia
          </span>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
            Bank Sampah<br />
            <span className="text-emerald-400">Lebih Mudah</span>{' '}
            <span className="text-slate-300">& Digital</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
            SIMBA Nusantara menghubungkan 14.000+ unit bank sampah, 2+ juta nasabah, 
            dan pemerintah dalam satu platform terintegrasi — bisa diakses dari HP manapun.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => scrollTo('kalkulator')}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-900/40 hover:shadow-emerald-500/30 hover:-translate-y-0.5"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="12" y2="18"/></svg>
              Hitung Setoran Saya
            </button>
            <button
              onClick={() => scrollTo('finder')}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-xl transition-all backdrop-blur-sm hover:-translate-y-0.5"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              Cari Bank Sampah
            </button>
          </div>

          {/* Live counter stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition-colors">
                <p className="text-2xl md:text-3xl font-extrabold text-emerald-400 mb-1 tabular-nums">
                  {formatStat(s)}
                </p>
                <p className="text-xs text-slate-400 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-xs text-slate-500 font-medium">Scroll untuk menjelajahi</span>
        <div className="w-5 h-8 border border-slate-600 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-emerald-500 rounded-full animate-bounce" />
        </div>
      </div>
    </header>
  )
}
