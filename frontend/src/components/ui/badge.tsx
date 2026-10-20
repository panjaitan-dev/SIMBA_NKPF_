import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const badgeVariants = cva(
  'inline-flex items-center gap-1.5 font-semibold transition-colors select-none rounded-full border',
  {
    variants: {
      variant: {
        default:
          'bg-[#EBF2EE] text-[#1E4D3B] border-[#B3CBBB]',
        forest:
          'bg-[#1E4D3B] text-white border-[#143528]',
        terracotta:
          'bg-[#D8572A] text-white border-[#B8431A]',
        pilot:
          'bg-[#FAF7F2] text-[#1E4D3B] border-2 border-[#1E4D3B] font-mono tracking-wider uppercase',
        simulation:
          'bg-[#FFF9F5] text-[#D8572A] border border-[#E87146] font-mono font-bold',
        verified:
          'bg-[#EBF2EE] text-[#1E4D3B] border border-[#1E4D3B]/40 font-bold',
        amber:
          'bg-[#FFF9F5] text-[#D8572A] border border-[#E87146]',
        success:
          'bg-[#EBF2EE] text-[#1E4D3B] border-[#B3CBBB]',
        warning:
          'bg-[#FDF3E7] text-[#C05621] border-[#F6AD55]',
        danger:
          'bg-[#FDF2F2] text-[#B91C1C] border-[#FEB2B2]',
        destructive:
          'bg-[#FDF2F2] text-[#B91C1C] border-[#FEB2B2]',
        info:
          'bg-[#EBF4FA] text-[#2B6CB0] border-[#90CDF4]',
        outline:
          'bg-white text-[#1B1B18] border-[#D4CABA]',
        subtle:
          'bg-[#E8E1D3] text-[#3E3C37] border-[#D4CABA]',
      },
      size: {
        sm: 'text-[10px] px-2 py-0.5',
        default: 'text-xs px-2.5 py-1',
        lg: 'text-sm px-3 py-1.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
}
