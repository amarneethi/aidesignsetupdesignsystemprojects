'use client';

import { forwardRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

function getPageNumbers(currentPage, totalPages, siblingCount = 1) {
  const totalSlots = siblingCount * 2 + 5; // siblings + first + last + 2 ellipsis + current
  if (totalPages <= totalSlots) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  const pages = [];
  pages.push(1);

  if (showLeftEllipsis) {
    pages.push('...');
  } else {
    for (let i = 2; i < leftSibling; i++) pages.push(i);
  }

  for (let i = leftSibling; i <= rightSibling; i++) {
    if (i !== 1 && i !== totalPages) pages.push(i);
  }

  if (showRightEllipsis) {
    pages.push('...');
  } else {
    for (let i = rightSibling + 1; i < totalPages; i++) pages.push(i);
  }

  if (totalPages > 1) pages.push(totalPages);

  return pages;
}

const Pagination = forwardRef(function Pagination(
  {
    currentPage = 1,
    totalPages = 1,
    totalItems,
    pageSize,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 25, 50, 100],
    siblingCount = 1,
    showPageSizeSelector = false,
    showItemCount = false,
    className = '',
    ...props
  },
  ref
) {
  const pages = useMemo(
    () => getPageNumbers(currentPage, totalPages, siblingCount),
    [currentPage, totalPages, siblingCount]
  );

  const handlePage = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange?.(page);
    }
  };

  const startItem = totalItems ? (currentPage - 1) * (pageSize || 10) + 1 : null;
  const endItem = totalItems ? Math.min(currentPage * (pageSize || 10), totalItems) : null;

  return (
    <div
      ref={ref}
      className={['flex items-center justify-between gap-4 flex-wrap', className].join(' ')}
      {...props}
    >
      {/* Left: item count and page size */}
      <div className="flex items-center gap-4">
        {showItemCount && totalItems != null && (
          <span className="text-[length:var(--ds-text-sm)] text-[var(--ds-text-secondary)]">
            {startItem}–{endItem} of {totalItems}
          </span>
        )}
        {showPageSizeSelector && (
          <div className="flex items-center gap-2">
            <span className="text-[length:var(--ds-text-sm)] text-[var(--ds-text-secondary)]">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              className="h-7 text-[length:var(--ds-text-xs)] px-2 rounded-[var(--ds-radius-md)] bg-[var(--ds-input-bg)] text-[var(--ds-text-primary)] border cursor-pointer"
              style={{ borderColor: 'var(--ds-input-border)' }}
            >
              {pageSizeOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: page navigation */}
      <nav className="flex items-center gap-1" aria-label="Pagination">
        {/* First page */}
        <button
          type="button"
          onClick={() => handlePage(1)}
          disabled={currentPage === 1}
          className="ds-focus-ring p-1.5 rounded-[var(--ds-radius-md)] hover:bg-[var(--ds-bg-hover)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          aria-label="First page"
        >
          <ChevronsLeft size={16} style={{ color: 'var(--ds-icon-primary)' }} />
        </button>

        {/* Previous */}
        <button
          type="button"
          onClick={() => handlePage(currentPage - 1)}
          disabled={currentPage === 1}
          className="ds-focus-ring p-1.5 rounded-[var(--ds-radius-md)] hover:bg-[var(--ds-bg-hover)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} style={{ color: 'var(--ds-icon-primary)' }} />
        </button>

        {/* Page numbers */}
        {pages.map((page, idx) =>
          page === '...' ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-8 h-8 flex items-center justify-center text-[length:var(--ds-text-sm)] text-[var(--ds-text-tertiary)]"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => handlePage(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              className={[
                'ds-focus-ring w-8 h-8 flex items-center justify-center rounded-[var(--ds-radius-md)] text-[length:var(--ds-text-sm)] font-medium transition-colors cursor-pointer',
                page === currentPage
                  ? 'bg-[var(--ds-bg-brand)] text-[var(--ds-text-on-brand)]'
                  : 'text-[var(--ds-text-primary)] hover:bg-[var(--ds-bg-hover)]',
              ].join(' ')}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          type="button"
          onClick={() => handlePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ds-focus-ring p-1.5 rounded-[var(--ds-radius-md)] hover:bg-[var(--ds-bg-hover)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Next page"
        >
          <ChevronRight size={16} style={{ color: 'var(--ds-icon-primary)' }} />
        </button>

        {/* Last page */}
        <button
          type="button"
          onClick={() => handlePage(totalPages)}
          disabled={currentPage === totalPages}
          className="ds-focus-ring p-1.5 rounded-[var(--ds-radius-md)] hover:bg-[var(--ds-bg-hover)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Last page"
        >
          <ChevronsRight size={16} style={{ color: 'var(--ds-icon-primary)' }} />
        </button>
      </nav>
    </div>
  );
});

Pagination.displayName = 'Pagination';
export default Pagination;
