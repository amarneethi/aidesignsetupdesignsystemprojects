'use client';

import { forwardRef } from 'react';
import { X } from 'lucide-react';

const colorMap = {
  default: {
    bg: 'var(--ds-bg-tertiary)',
    text: 'var(--ds-text-primary)',
    border: 'var(--ds-border-primary)',
  },
  brand: {
    bg: 'var(--ds-bg-selected)',
    text: 'var(--ds-text-brand)',
    border: 'var(--ds-border-brand)',
  },
  success: {
    bg: 'var(--ds-bg-success)',
    text: 'var(--ds-text-success)',
    border: 'var(--ds-border-success)',
  },
  warning: {
    bg: 'var(--ds-bg-warning)',
    text: 'var(--ds-text-warning)',
    border: 'var(--ds-border-warning)',
  },
  danger: {
    bg: 'var(--ds-bg-error)',
    text: 'var(--ds-text-danger)',
    border: 'var(--ds-border-error)',
  },
  info: {
    bg: 'var(--ds-bg-info)',
    text: 'var(--ds-text-info)',
    border: 'var(--ds-border-info)',
  },
};

const sizes = {
  sm: 'h-5 text-[length:var(--ds-text-xs)] px-1.5 gap-1',
  md: 'h-6 text-[length:var(--ds-text-xs)] px-2 gap-1.5',
  lg: 'h-7 text-[length:var(--ds-text-sm)] px-2.5 gap-1.5',
};

const Tag = forwardRef(function Tag(
  {
    children,
    color = 'default',
    size = 'md',
    dismissible = false,
    onDismiss,
    icon,
    outline = false,
    className = '',
    ...props
  },
  ref
) {
  const c = colorMap[color] || colorMap.default;

  return (
    <span
      ref={ref}
      className={[
        'inline-flex items-center rounded-full font-medium whitespace-nowrap',
        'transition-colors duration-[var(--ds-duration-normal)]',
        sizes[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        backgroundColor: outline ? 'transparent' : c.bg,
        color: c.text,
        border: outline ? `1px solid ${c.border}` : 'none',
      }}
      {...props}
    >
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      <span>{children}</span>
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-full p-0.5 hover:bg-black/10 transition-colors cursor-pointer"
          aria-label="Remove"
        >
          <X size={size === 'sm' ? 10 : 12} />
        </button>
      )}
    </span>
  );
});

Tag.displayName = 'Tag';
export default Tag;
