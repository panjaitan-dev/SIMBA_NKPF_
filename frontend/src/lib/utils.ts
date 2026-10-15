import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

export function formatWeight(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(2)} ton`
  return `${kg.toFixed(3)} kg`
}

export function truncate(text: string, length: number = 120): string {
  if (text.length <= length) return text
  return text.slice(0, length).trimEnd() + '...'
}

export const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-800 border border-amber-200/80',
  diproses: 'bg-blue-50 text-blue-800 border border-blue-200/80',
  diverifikasi: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
  selesai: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
  ditolak: 'bg-rose-50 text-rose-800 border border-rose-200/80',
  disetujui: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
  dibayar: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
  dibatalkan: 'bg-slate-100 text-slate-700 border border-slate-300/80',
}

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Menunggu Verifikasi',
  diproses: 'Sedang Diproses',
  diverifikasi: 'Terverifikasi',
  selesai: 'Selesai',
  ditolak: 'Ditolak',
  disetujui: 'Disetujui',
  dibayar: 'Telah Dibayar',
  dibatalkan: 'Dibatalkan (Void)',
}
