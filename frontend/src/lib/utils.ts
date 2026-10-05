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
  pending: 'bg-yellow-100 text-yellow-800',
  diproses: 'bg-blue-100 text-blue-800',
  diverifikasi: 'bg-green-100 text-green-800',
  selesai: 'bg-green-100 text-green-800',
  ditolak: 'bg-red-100 text-red-800',
  disetujui: 'bg-emerald-100 text-emerald-800',
  dibayar: 'bg-emerald-100 text-emerald-800',
}

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Menunggu',
  diproses: 'Diproses',
  diverifikasi: 'Terverifikasi',
  selesai: 'Selesai',
  ditolak: 'Ditolak',
  disetujui: 'Disetujui',
  dibayar: 'Dibayar',
}
