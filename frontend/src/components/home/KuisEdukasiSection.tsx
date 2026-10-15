'use client'
import { useState } from 'react'

const SOAL = [
  {
    soal: 'Botol plastik air mineral bekas termasuk kategori sampah apa?',
    pilihan: ['Sampah organik', 'Sampah anorganik / plastik', 'Sampah B3 (Berbahaya)', 'Sampah elektronik'],
    jawaban: 1,
    penjelasan: 'Botol plastik PET adalah sampah anorganik yang dapat didaur ulang. Pisahkan dari sampah organik dan cuci sebelum disetor ke bank sampah.',
  },
  {
    soal: 'Mengapa sampah organik sebaiknya TIDAK dicampur dengan sampah anorganik?',
    pilihan: [
      'Karena tidak ada bedanya',
      'Agar lebih mudah dibuang',
      'Karena mencampur keduanya membuat anorganik tercemar & sulit didaur ulang',
      'Karena sampah organik lebih berat',
    ],
    jawaban: 2,
    penjelasan: 'Sampah organik basah (sisa makanan) dapat mencemari sampah anorganik sehingga tidak bisa didaur ulang dan nilai jualnya hilang.',
  },
  {
    soal: 'Berapa kg CO₂ yang setara dengan mendaur ulang 1 kg aluminium kaleng?',
    pilihan: ['1 kg CO₂', '4 kg CO₂', '9 kg CO₂', '15 kg CO₂'],
    jawaban: 2,
    penjelasan: 'Mendaur ulang 1 kg aluminium menghemat sekitar 9 kg CO₂ — setara energi yang dibutuhkan untuk memproduksi aluminium baru dari bauksit.',
  },
  {
    soal: 'Mana yang BUKAN termasuk jenis sampah yang diterima bank sampah pada umumnya?',
    pilihan: ['Kardus bekas', 'Botol kaca', 'Sisa makanan basah', 'Minyak jelantah'],
    jawaban: 2,
    penjelasan: 'Sisa makanan basah adalah sampah organik yang dikompos, bukan diterima oleh bank sampah. Bank sampah fokus pada sampah anorganik yang dapat didaur ulang.',
  },
  {
    soal: 'Apa yang dimaksud dengan "3R" dalam pengelolaan sampah?',
    pilihan: [
      'Recycle, Reduce, Replace',
      'Reduce, Reuse, Recycle',
      'Repair, Reuse, Remove',
      'Reduce, Remove, Recycle',
    ],
    jawaban: 1,
    penjelasan: '3R adalah Reduce (kurangi), Reuse (pakai ulang), dan Recycle (daur ulang). Reduce adalah yang paling penting — kurangi produksi sampah dari sumbernya.',
  },
]

const BADGES = [
  { min: 0, label: 'Pemula', emoji: '🌱', desc: 'Terus belajar untuk menjaga lingkungan!', color: 'text-slate-600 bg-slate-100' },
  { min: 2, label: 'Mahir', emoji: '🌿', desc: 'Kamu sudah paham dasar pemilahan sampah!', color: 'text-emerald-700 bg-emerald-100' },
  { min: 4, label: 'Pakar', emoji: '🏆', desc: 'Luar biasa! Kamu adalah Pahlawan Lingkungan!', color: 'text-amber-700 bg-amber-100' },
]

export default function KuisEdukasiSection() {
  const [step, setStep] = useState<'intro' | 'playing' | 'done'>('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [pilihan, setPilihan] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showExplain, setShowExplain] = useState(false)

  const badge = BADGES.slice().reverse().find((b) => score >= b.min)!

  const handlePilih = (idx: number) => {
    if (pilihan !== null) return
    setPilihan(idx)
    if (idx === SOAL[currentQ].jawaban) setScore((s) => s + 1)
    setShowExplain(true)
  }

  const handleNext = () => {
    setPilihan(null)
    setShowExplain(false)
    if (currentQ + 1 >= SOAL.length) {
      setStep('done')
    } else {
      setCurrentQ((q) => q + 1)
    }
  }

  const handleReset = () => {
    setStep('intro')
    setCurrentQ(0)
    setPilihan(null)
    setScore(0)
    setShowExplain(false)
  }

  const q = SOAL[currentQ]

  return (
    <section id="kuis" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-emerald-600 font-semibold tracking-widest text-xs uppercase mb-2 block">Uji Pengetahuan</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Kuis <span className="text-emerald-600">Pilah Sampah</span>
          </h2>
          <p className="text-slate-500 mt-4 text-sm">Uji pengetahuanmu tentang pengelolaan sampah dan dapatkan badge.</p>
        </div>

        {/* Intro */}
        {step === 'intro' && (
          <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-3xl p-10 text-center text-white">
            <div className="text-6xl mb-5">♻️</div>
            <h3 className="text-2xl font-extrabold mb-3">Siap Memulai?</h3>
            <p className="text-slate-300 mb-8 max-w-sm mx-auto">
              {SOAL.length} pertanyaan pilihan ganda tentang pemilahan sampah. Raih badge Pakar jika skormu sempurna!
            </p>
            <div className="flex justify-center gap-3 mb-8">
              {BADGES.map((b) => (
                <div key={b.label} className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-center">
                  <div className="text-2xl mb-1">{b.emoji}</div>
                  <p className="text-xs font-semibold">{b.label}</p>
                  <p className="text-xs text-slate-400">{b.min}+ benar</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep('playing')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3.5 rounded-xl transition-colors"
            >
              Mulai Kuis →
            </button>
          </div>
        )}

        {/* Playing */}
        {step === 'playing' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-slate-500 mb-2">
                <span>Pertanyaan {currentQ + 1} dari {SOAL.length}</span>
                <span className="font-semibold text-emerald-600">{score} benar</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${((currentQ) / SOAL.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Soal */}
            <h3 className="text-lg font-bold text-slate-900 mb-6">{q.soal}</h3>

            {/* Pilihan */}
            <div className="space-y-3 mb-6">
              {q.pilihan.map((p, idx) => {
                let cls = 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300'
                if (pilihan !== null) {
                  if (idx === q.jawaban) cls = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold'
                  else if (idx === pilihan) cls = 'border-red-400 bg-red-50 text-red-700'
                  else cls = 'border-slate-100 bg-slate-50 text-slate-400'
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handlePilih(idx)}
                    disabled={pilihan !== null}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 text-sm transition-all ${cls} ${pilihan === null ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <span className="mr-3 font-bold text-slate-400">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {p}
                  </button>
                )
              })}
            </div>

            {/* Penjelasan */}
            {showExplain && (
              <div className={`rounded-xl p-4 mb-4 text-sm ${pilihan === q.jawaban ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                <p className="font-semibold mb-1">
                  {pilihan === q.jawaban ? '✅ Benar!' : '❌ Kurang tepat.'}
                </p>
                <p className="text-sm leading-relaxed">{q.penjelasan}</p>
              </div>
            )}

            {pilihan !== null && (
              <button
                onClick={handleNext}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-colors"
              >
                {currentQ + 1 >= SOAL.length ? 'Lihat Hasil' : 'Pertanyaan Berikutnya →'}
              </button>
            )}
          </div>
        )}

        {/* Done */}
        {step === 'done' && (
          <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-3xl p-10 text-center text-white">
            <div className="text-6xl mb-3">{badge.emoji}</div>
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-4 ${badge.color}`}>
              Badge: {badge.label}
            </div>
            <h3 className="text-2xl font-extrabold mb-2">
              Skor: {score}/{SOAL.length}
            </h3>
            <p className="text-slate-300 mb-8 max-w-sm mx-auto">{badge.desc}</p>

            {/* Score bar */}
            <div className="max-w-sm mx-auto mb-8">
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all"
                  style={{ width: `${(score / SOAL.length) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>0</span>
                <span>{SOAL.length}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={handleReset}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                Coba Lagi
              </button>
              <a
                href="/register"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                Daftar Nasabah
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
