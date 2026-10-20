import * as React from 'react';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PaginationProps {
  totalItems: number;
  itemsPerPage?: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

/** Simple pagination component respecting the design language (no glossy borders). */
export function Pagination({
  totalItems,
  itemsPerPage = 5,
  currentPage,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const generatePageNumbers = () => {
    const left = Math.max(currentPage - siblingCount, 1);
    const right = Math.min(currentPage + siblingCount, totalPages);
    const pages = [];
    if (left > 1) pages.push(1, -1); // -1 will be rendered as ellipsis
    pages.push(...range(left, right));
    if (right < totalPages) pages.push(-1, totalPages);
    return pages;
  };

  const pages = generatePageNumbers();

  return (
    <nav className="flex items-center gap-2 mt-4" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'flex items-center px-2 py-1 rounded border border-[#D4CABA] text-sm',
          currentPage === 1 && 'opacity-50 cursor-not-allowed'
        )}
      >
        <ArrowLeft size={14} />
      </button>
      {pages.map((p, i) =>
        p === -1 ? (
          <span key={`ellipsis-${i}`} className="px-2 text-sm text-[#66635B]">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              'px-2 py-1 rounded border border-[#D4CABA] text-sm',
              p === currentPage && 'bg-[#1E4D3B] text-white'
            )}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'flex items-center px-2 py-1 rounded border border-[#D4CABA] text-sm',
          currentPage === totalPages && 'opacity-50 cursor-not-allowed'
        )}
      >
        <ArrowRight size={14} />
      </button>
    </nav>
  );
}
