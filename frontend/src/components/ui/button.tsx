import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8572A] focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary:
          'bg-[#1E4D3B] hover:bg-[#143528] text-white shadow-[2px_2px_0px_#143528] active:translate-x-[1px] active:translate-y-[1px]',
        default:
          'bg-[#1E4D3B] hover:bg-[#143528] text-white shadow-[2px_2px_0px_#143528] active:translate-x-[1px] active:translate-y-[1px]',
        terracotta:
          'bg-[#D8572A] hover:bg-[#B8431A] text-white shadow-[2px_2px_0px_#78350F] active:translate-x-[1px] active:translate-y-[1px]',
        amber:
          'bg-[#D8572A] hover:bg-[#B8431A] text-white shadow-[2px_2px_0px_#78350F] active:translate-x-[1px] active:translate-y-[1px]',
        secondary:
          'bg-[#FAF7F2] hover:bg-[#F4EFE4] text-[#1B1B18] border border-[#D4CABA] shadow-xs active:bg-[#E8E1D3]',
        outline:
          'border-2 border-[#1E4D3B] bg-transparent text-[#1E4D3B] hover:bg-[#EBF2EE] active:bg-[#D7E5DD]',
        ghost:
          'hover:bg-[#FAF7F2] text-[#1B1B18] active:bg-[#E8E1D3]',
        destructive:
          'bg-[#B91C1C] hover:bg-[#991B1B] text-white shadow-[2px_2px_0px_#7F1D1D]',
      },
      size: {
        sm: 'h-9 px-3 text-xs rounded-lg min-w-[36px]',
        md: 'min-h-[44px] px-5 py-2.5 text-sm rounded-xl',
        default: 'min-h-[44px] px-5 py-2.5 text-sm rounded-xl',
        lg: 'min-h-[48px] px-7 py-3 text-base rounded-xl',
        icon: 'w-11 h-11 p-0 rounded-xl flex-shrink-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />}
        {children}
      </Comp>
    )
  }
)
Button.displayName = 'Button'
