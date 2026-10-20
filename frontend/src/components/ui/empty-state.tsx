import * as React from 'react'
import { LucideIcon, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

export interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  actionHref?: string
  className?: string
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border-2 border-dashed border-[#D4CABA] bg-[#FAF7F2]/80',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-white border border-[#D4CABA] flex items-center justify-center text-[#1E4D3B] mb-4 shadow-[2px_2px_0px_#E2DACB]">
        <Icon className="w-7 h-7" aria-hidden="true" />
      </div>
      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1B1B18] mb-1.5">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[#66635B] max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && (
        <>
          {actionHref ? (
            <a href={actionHref}>
              <Button variant="primary" size="md">
                {actionLabel}
              </Button>
            </a>
          ) : (
            <Button variant="primary" size="md" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </>
      )}
    </div>
  )
}
