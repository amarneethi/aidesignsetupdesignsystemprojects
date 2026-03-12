'use client';

import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

/** Spinner — circular loading indicator */
const Spinner = forwardRef(function Spinner(
  { size = 'md', label = 'Loading...', className = '', ...props },
  ref
) {
  const sizes = { sm: 16, md: 24, lg: 32, xl: 48 };
  const px = sizes[size] || sizes.md;

  return (
    <span
      ref={ref}
      role="status"
      className={['inline-flex items-center gap-2', className].join(' ')}
      {...props}
    >
      <Loader2
        size={px}
        className="animate-spin"
        style={{ color: 'var(--ds-icon-brand)' }}
      />
      {label && <span className="ds-sr-only">{label}</span>}
    </span>
  );
});

/** Skeleton — placeholder shimmer block */
const Skeleton = forwardRef(function Skeleton(
  { width, height, variant = 'rectangular', className = '', style: styleProp = {}, ...props },
  ref
) {
  const radiusMap = {
    rectangular: 'var(--ds-radius-md)',
    circular: '50%',
    text: 'var(--ds-radius-sm)',
  };

  return (
    <div
      ref={ref}
      className={['animate-pulse', className].join(' ')}
      style={{
        width: width || '100%',
        height: height || (variant === 'text' ? '1em' : '100%'),
        backgroundColor: 'var(--ds-bg-tertiary)',
        borderRadius: radiusMap[variant],
        ...styleProp,
      }}
      {...props}
    />
  );
});

/** SkeletonText — multiple skeleton lines for paragraph placeholders */
export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={['flex flex-col gap-2', className].join(' ')}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          height="0.875rem"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
}

/** TableSkeleton — skeleton for table rows */
export function TableSkeleton({ rows = 5, columns = 4, className = '' }) {
  return (
    <div className={['w-full', className].join(' ')}>
      <div
        className="grid gap-4 p-4 border-b"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          borderColor: 'var(--ds-table-border)',
        }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" height="0.75rem" width="70%" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="grid gap-4 p-4 border-b"
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            borderColor: 'var(--ds-table-border)',
          }}
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton
              key={colIdx}
              variant="text"
              height="0.875rem"
              width={`${60 + ((rowIdx * columns + colIdx) * 17 + 7) % 30}%`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

Spinner.displayName = 'Spinner';
Skeleton.displayName = 'Skeleton';
SkeletonText.displayName = 'SkeletonText';
TableSkeleton.displayName = 'TableSkeleton';

export { Spinner, Skeleton };
export default Spinner;
