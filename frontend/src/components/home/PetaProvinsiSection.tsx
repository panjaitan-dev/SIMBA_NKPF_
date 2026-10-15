'use client'
import { useState } from 'react'

// Tile grid layout Indonesia (row × col positions)
const PROVINSI_GRID = [
  { kode: 'AC', nama: 'Aceh', row: 0, col: 0 },
  { kode: 'SU', nama: 'Sumatera Utara', row: 1, col: 0 },
  { kode: 'SB', nama: 'Sumatera Barat', row: 2, col: 0 },
  { kode: 'RI', nama: 'Riau', row: 2, col: 1 },
  { kode: 'KR', nama: 'Kepulauan Riau', row: 3, col: 1 },
  { kode: 'JA', nama: 'Jambi', row: 3, col: 0 },
  { kode: 'SS', nama: 'Sumatera Selatan', row: 4, col: 0 },
  { kode: 'BB', nama: 'Bangka Belitung', row: 4, col: 1 },
  { kode: 'BE', nama: 'Bengkulu', row: 5, col: 0 },
  { kode: 'LA', nama: 'Lampung', row: 5, col: 1 },
  { kode: 'BT', nama: 'Banten', row: 6, col: 1 },
  { kode: 'JK', nama: 'DKI Jakarta', row: 6, col: 2 },
  { kode: 'JB', nama: 'Jawa Barat', row: 6, col: 3 },
  { kode: 'JT', nama: 'Jawa Tengah', row: 6, col: 4 },
  { kode: 'YO', nama: 'DI Yogyakarta', row: 7, col: 4 },
  { kode: 'JI', nama: 'Jawa Timur', row: 6, col: 5 },
  { kode: 'BA', nama: 'Bali', row: 6, col: 6 },
  { kode: 'NB', nama: 'NTB', row: 6, col: 7 },
  { kode: 'NT', nama: 'NTT', row: 6, col: 8 },
  { kode: 'KB', nama: 'Kalbar', row: 3, col: 3 },
  { kode: 'KT', nama: 'Kalteng', row: 3, col: 4 },
  { kode: 'KS', nama: 'Kalsel', row: 4, col: 4 },
  { kode: 'KI', nama: 'Kaltim', row: 2, col: 5 },
  { kode: 'KU', nama: 'Kaltara', row: 1, col: 5 },
  { kode: 'SW', nama: 'Sulut', row: 2, col: 7 },
  { kode: 'GO', nama: 'Gorontalo', row: 3, col: 7 },
  { kode: 'ST', nama: 'Sulteng', row: 3, col: 6 },
  { kode: 'SR', nama: 'Sulbar', row: 4, col: 6 },
  { kode: 'SN', nama: 'Sulsel', row: 4, col: 7 },
  { kode: 'SG', nama: 'Sultra', row: 5, col: 7 },
  { kode: 'MU', nama: 'Malut', row: 2, col: 8 },
  { kode: 'MA', nama: 'Maluku', row: 4, col: 9 },
  { kode: 'PB', nama: 'Papua Barat', row: 3, col: 10 },
  { kode: 'PA', nama: 'Papua', row: 4, col: 10 },
]

// Simulasi data per provinsi
const PROVINSI_DATA: Record<string, { bsu: number; kg: number; nasabah: number; units: string[] }> = {
  AC: { bsu: 312, kg: 1823400, nasabah: 48321, units: ['BSU Banda Aceh Bersih', 'BSU Lhokseumawe Hijau', 'BSU Meulaboh Lestari'] },
  SU: { bsu: 891, kg: 5234100, nasabah: 143291, units: ['BSU Medan Bersih', 'BSU Binjai Hijau', 'BSU Pematang Siantar'] },
  JB: { bsu: 2341, kg: 15234100, nasabah: 534123, units: ['BSU Bandung Raya', 'BSU Bogor Bersih', 'BSU Depok Hijau'] },
  JK: { bsu: 1243, kg: 8934200, nasabah: 312341, units: ['BSU Jakarta Selatan', 'BSU Jakarta Utara', 'BSU Jakarta Timur'] },
  JT: { bsu: 1987, kg: 12341200, nasabah: 432341, units: ['BSU Semarang Hijau', 'BSU Solo Bersih', 'BSU Pekalongan Lestari'] },
  JI: { bsu: 2134, kg: 13241800, nasabah: 467234, units: ['BSU Surabaya Bersih', 'BSU Malang Hijau', 'BSU Sidoarjo Lestari'] },
  SN: { bsu: 534, kg: 3234100, nasabah: 112341, units: ['BSU Makassar Bersih', 'BSU Gowa Hijau', 'BSU Maros Lestari'] },
  BA: { bsu: 543, kg: 3534200, nasabah: 123412, units: ['BSU Denpasar Bersih', 'BSU Badung Hijau', 'BSU Gianyar Lestari'] },
}

const getProvinsiData = (kode: string) =>
  PROVINSI_DATA[kode] || {
    bsu: Math.floor(100 + Math.random() * 400),
    kg: Math.floor(500000 + Math.random() * 3000000),
    nasabah: Math.floor(10000 + Math.random() * 80000),
    units: ['BSU ' + kode + ' Bersih', 'BSU ' + kode + ' Hijau', 'BSU ' + kode + ' Lestari'],
  }

const MAX_BSU = 2341 // Jawa Barat
const getColor = (kode: string) => {
  const d = getProvinsiData(kode)
  const ratio = d.bsu / MAX_BSU
  if (ratio > 0.7) return '#059669' // dark emerald
  if (ratio > 0.4) return '#34d399' // medium emerald
  if (ratio > 0.2) return '#6ee7b7' // light emerald
  return '#a7f3d0' // very light
}

const formatNum = (n: number) => new Intl.NumberFormat('id-ID').format(n)

// Build grid
const MAX_ROW = Math.max(...PROVINSI_GRID.map((p) => p.row)) + 1
const MAX_COL = Math.max(...PROVINSI_GRID.map((p) => p.col)) + 1

export default function PetaProvinsiSection() {
  const [selected, setSelected] = useState<string | null>(null)
  const selectedData = selected ? getProvinsiData(selected) : null
  const selectedProv = selected ? PROVINSI_GRID.find((p) => p.kode === selected) : null

  // Build grid map
  const grid: (typeof PROVINSI_GRID[0] | null)[][] = Array.from({ length: MAX_ROW }, () =>
    Array(MAX_COL).fill(null)
  )
  PROVINSI_GRID.forEach((p) => { grid[p.row][p.col] = p })

  return (
    <section id="peta" className="py-24 bg-slate-900 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-emerald-400 font-semibold tracking-widest text-xs uppercase mb-2 block">Sebaran Nasional</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Bank Sampah di Seluruh <span className="text-emerald-400">Indonesia</span>
          </h2>
          <p className="text-slate-400 mt-4 text-sm max-w-xl mx-auto">
            Klik provinsi untuk melihat detail jumlah unit dan data setoran. Warna lebih gelap = lebih banyak unit bank sampah.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Grid Peta */}
          <div className="overflow-x-auto">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${MAX_COL}, 54px)`,
                gridTemplateRows: `repeat(${MAX_ROW}, 54px)`,
                gap: '4px',
              }}
            >
              {grid.flatMap((row, ri) =>
                row.map((prov, ci) =>
                  prov ? (
                    <button
                      key={prov.kode}
                      onClick={() => setSelected(selected === prov.kode ? null : prov.kode)}
                      title={prov.nama}
                      style={{
                        gridRow: ri + 1,
                        gridColumn: ci + 1,
                        backgroundColor: selected === prov.kode ? '#f59e0b' : getColor(prov.kode),
                        border: selected === prov.kode ? '2px solid #f59e0b' : '2px solid transparent',
                        boxShadow: selected === prov.kode ? '0 0 12px rgba(245,158,11,0.5)' : 'none',
                      }}
                      className="rounded-lg flex items-center justify-center text-xs font-bold text-white/90 hover:opacity-80 transition-all hover:scale-110 focus:outline-none"
                    >
                      {prov.kode}
                    </button>
                  ) : (
                    <div
                      key={`empty-${ri}-${ci}`}
                      style={{ gridRow: ri + 1, gridColumn: ci + 1 }}
                    />
                  )
                )
              )}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="lg:w-72 flex-shrink-0">
            {!selected ? (
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-emerald-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.5">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5"/>
                  </svg>
                </div>
                <p className="text-slate-400 text-sm">Klik salah satu provinsi pada peta untuk melihat detail data bank sampah.</p>
              </div>
            ) : (
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: getColor(selected) }}>
                    {selected}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{selectedProv?.nama}</h3>
                    <p className="text-xs text-slate-400">Provinsi</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {[
                    { label: 'Unit Bank Sampah', value: formatNum(selectedData!.bsu) + ' BSU', icon: '🏪' },
                    { label: 'Total Sampah', value: formatNum(selectedData!.kg) + ' kg', icon: '♻️' },
                    { label: 'Total Nasabah', value: formatNum(selectedData!.nasabah) + ' orang', icon: '👥' },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-3 bg-slate-700/50 rounded-xl p-3">
                      <span className="text-lg">{s.icon}</span>
                      <div>
                        <p className="text-xs text-slate-400">{s.label}</p>
                        <p className="font-bold text-white text-sm">{s.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs text-slate-400 font-semibold mb-2">Unit Contoh:</p>
                  <ul className="space-y-1.5">
                    {selectedData!.units.map((u) => (
                      <li key={u} className="text-xs text-slate-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setSelected(null)}
                  className="mt-5 w-full text-xs text-slate-400 hover:text-white transition-colors"
                >
                  × Tutup detail
                </button>
              </div>
            )}

            {/* Legend */}
            <div className="mt-4 bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-xs text-slate-400 font-semibold mb-2">Legenda Kepadatan BSU:</p>
              <div className="flex items-center gap-1">
                {['#a7f3d0', '#6ee7b7', '#34d399', '#059669'].map((c, i) => (
                  <div key={c} className="flex-1 h-3 rounded" style={{ backgroundColor: c }} />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-slate-500">Sedikit</span>
                <span className="text-xs text-slate-500">Banyak</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
