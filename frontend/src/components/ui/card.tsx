import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'paper' | 'offset' | 'ticket'
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantStyles = {
      default: 'rounded-xl border border-[#D4CABA] bg-white text-[#1B1B18] shadow-[2px_2px_0px_#E2DACB] hover:border-[#1E4D3B]/40',
      paper: 'rounded-xl border border-[#D4CABA] bg-[#FAF7F2] text-[#1B1B18] shadow-xs hover:border-[#1E4D3B]/40',
      offset: 'rounded-xl border-2 border-[#1E4D3B] bg-white text-[#1B1B18] shadow-[3px_3px_0px_#1E4D3B]',
      ticket: 'rounded-xl border-2 border-dashed border-[#D4CABA] bg-white text-[#1B1B18] shadow-sm',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'transition-all duration-150',
          variantStyles[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('font-serif text-xl sm:text-2xl font-bold leading-tight tracking-tight text-[#1B1B18]', className)}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-[#66635B] leading-relaxed', className)} {...props} />
  )
)
CardDescription.displayName = 'CardDescription'

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0 border-t border-[#E8E1D3] mt-4 pt-4', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'
