'use client';

import { forwardRef } from 'react';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = forwardRef(function Breadcrumb(
  { items = [], separator, className = '', ...props },
  ref
) {
  const SeparatorIcon = separator || (
    <ChevronRight size={14} style={{ color: 'var(--ds-text-tertiary)' }} />
  );

  return (
    <nav ref={ref} aria-label="Breadcrumb" className={className} {...props}>
      <ol className="flex items-center gap-1.5 flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {isLast ? (
                <span
                  className="text-[length:var(--ds-text-sm)] font-medium text-[var(--ds-text-primary)]"
                  aria-current="page"
                >
                  {item.icon && <span className="mr-1 inline-flex align-text-bottom">{item.icon}</span>}
                  {item.label}
                </span>
              ) : (
                <>
                  <a
                    href={item.href || '#'}
                    onClick={item.onClick}
                    className="ds-focus-ring text-[length:var(--ds-text-sm)] text-[var(--ds-text-link)] hover:text-[var(--ds-text-link-hover)] hover:underline transition-colors"
                  >
                    {item.icon && <span className="mr-1 inline-flex align-text-bottom">{item.icon}</span>}
                    {item.label}
                  </a>
                  <span className="flex items-center" aria-hidden="true">
                    {SeparatorIcon}
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

Breadcrumb.displayName = 'Breadcrumb';
export default Breadcrumb;
