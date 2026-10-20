import * as React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

export interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  isRetrying?: boolean
  className?: string
}

export function ErrorState({
  title = 'Koneksi Terkendala',
  description = 'Sistem belum berhasil memuat data. Periksa jaringan internetmu lalu muat ulang.',
  onRetry,
  isRetrying = false,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border border-[#FEB2B2] bg-[#FDF2F2]',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-white border border-[#FEB2B2] flex items-center justify-center text-[#B91C1C] mb-4 shadow-2xs">
        <AlertCircle className="w-7 h-7" aria-hidden="true" />
      </div>
      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1B1B18] mb-1.5">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[#66635B] max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {onRetry && (
        <Button
          variant="outline"
          size="md"
          onClick={onRetry}
          isLoading={isRetrying}
          className="border-[#B91C1C] text-[#B91C1C] hover:bg-white"
        >
          <RefreshCw className={cn('w-4 h-4 mr-2', isRetrying && 'animate-spin')} />
          Coba Muat Ulang
        </Button>
      )}
    </div>
  )
}
