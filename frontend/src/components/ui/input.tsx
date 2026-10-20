import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean | string
  helperText?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, helperText, id, ...props }, ref) => {
    const hasError = Boolean(error)
    return (
      <div className="w-full">
        <input
          type={type}
          id={id}
          className={cn(
            'flex w-full min-h-[44px] rounded-xl border bg-white px-4 py-2.5 text-sm text-[#1B1B18] transition-all duration-150',
            'placeholder:text-[#99958C]',
            'focus:outline-none focus:ring-2 focus:ring-offset-1',
            hasError
              ? 'border-[#B91C1C] focus:border-[#B91C1C] focus:ring-[#B91C1C]/20'
              : 'border-[#D4CABA] focus:border-[#D8572A] focus:ring-[#D8572A]/20',
            'disabled:cursor-not-allowed disabled:bg-[#E8E1D3]/50 disabled:opacity-60',
            className
          )}
          ref={ref}
          aria-invalid={hasError ? 'true' : undefined}
          {...props}
        />
        {typeof error === 'string' && error && (
          <p className="mt-1.5 text-xs font-medium text-[#B91C1C]" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="mt-1.5 text-xs text-[#66635B]">{helperText}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
