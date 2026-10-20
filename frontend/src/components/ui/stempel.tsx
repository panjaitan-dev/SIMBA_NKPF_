import * as React from 'react'
import { cn } from '@/lib/utils'

export interface StempelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'verified' | 'simulation' | 'paid' | 'custom'
  text?: string
  label?: string
  subtext?: string
  tilt?: 'left' | 'right' | 'none'
  size?: 'sm' | 'md' | 'lg'
}

export function Stempel({
  variant = 'verified',
  text,
  label,
  subtext,
  tilt = 'left',
  size = 'md',
  className,
  ...props
}: StempelProps) {
  const tiltClasses = {
    left: '-rotate-6 hover:-rotate-3',
    right: 'rotate-6 hover:rotate-3',
    none: 'rotate-0',
  }

  const sizeClasses = {
    sm: 'w-20 h-20 text-[9px] border-2',
    md: 'w-26 h-26 text-[10px] border-[2.5px]',
    lg: 'w-32 h-32 text-xs border-[3px]',
  }

  let displayText = text || label
  let displaySubtext = subtext
  let colorClasses = 'border-[#1E4D3B] text-[#1E4D3B]'

  if (variant === 'verified') {
    displayText = text || 'TERVERIFIKASI'
    displaySubtext = subtext || 'SUMUT PILOT'
    colorClasses = 'border-[#1E4D3B] text-[#1E4D3B] bg-[#1E4D3B]/5'
  } else if (variant === 'simulation') {
    displayText = text || 'DATA SIMULASI'
    displaySubtext = subtext || 'IT FEST 2026'
    colorClasses = 'border-[#D8572A] text-[#D8572A] bg-[#D8572A]/5'
  } else if (variant === 'paid') {
    displayText = text || 'LUNAS DISETOR'
    displaySubtext = subtext || 'SIMBA BSI'
    colorClasses = 'border-[#1E4D3B] text-[#1E4D3B] bg-[#1E4D3B]/5'
  }

  return (
    <div
      className={cn(
        'inline-flex flex-col items-center justify-center rounded-full font-mono uppercase tracking-widest font-black select-none pointer-events-none transition-transform duration-200 border-dashed',
        tiltClasses[tilt],
        sizeClasses[size],
        colorClasses,
        className
      )}
      aria-label={`Stempel: ${displayText} ${displaySubtext || ''}`}
      {...props}
    >
      <div className="w-[88%] h-[88%] rounded-full border border-current flex flex-col items-center justify-center p-1 text-center">
        <span className="leading-tight font-black">{displayText}</span>
        {displaySubtext && (
          <span className="text-[75%] tracking-normal opacity-85 mt-0.5 border-t border-current/40 pt-0.5 w-[75%]">
            {displaySubtext}
          </span>
        )}
      </div>
    </div>
  )
}
