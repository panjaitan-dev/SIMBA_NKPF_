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

export function formatNumberId(value: number, minDec: number = 0, maxDec: number = 2): string {
  if (isNaN(value) || value === null || value === undefined) return '0'
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: minDec,
    maximumFractionDigits: maxDec,
  }).format(value)
}

export function formatWeight(kg: number, forceUnit?: 'kg' | 'ton'): string {
  const num = typeof kg === 'number' ? kg : parseFloat(kg) || 0
  if (forceUnit === 'ton' || (!forceUnit && num >= 1000)) {
    return `${formatNumberId(num / 1000, 2, 2)} ton`
  }
  return `${formatNumberId(num, 0, 2)} kg`
}

export function truncate(text: string, length: number = 120): string {
  if (text.length <= length) return text
  return text.slice(0, length).trimEnd() + '...'
}

export const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-[var(--color-amber-50)] text-[var(--color-amber-800)] border border-[var(--color-amber-200)]/80',
  diproses: 'bg-[var(--color-brand-forest)] text-[var(--color-ink)] border border-[var(--color-forest-200)]/80',
  diverifikasi: 'bg-[var(--color-forest-50)] text-[var(--color-forest-800)] border border-[var(--color-forest-200)]/80',
  selesai: 'bg-[var(--color-forest-50)] text-[var(--color-forest-800)] border border-[var(--color-forest-200)]/80',
  ditolak: 'bg-[var(--color-amber-600)] text-[var(--color-ink-light)] border border-[var(--color-amber-500)]/80',
  disetujui: 'bg-[var(--color-forest-50)] text-[var(--color-forest-800)] border border-[var(--color-forest-200)]/80',
  dibayar: 'bg-[var(--color-forest-50)] text-[var(--color-forest-800)] border border-[var(--color-forest-200)]/80',
  dibatalkan: 'bg-[var(--color-paper)] text-[var(--color-ink)] border border-[var(--color-paper-border)]/80',
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
