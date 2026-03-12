'use client';

import { forwardRef } from 'react';

const Header = forwardRef(function Header(
  {
    logo,
    productName = 'Product',
    navItems = [],
    actions,
    className = '',
    ...props
  },
  ref
) {
  return (
    <header
      ref={ref}
      className={[
        'flex items-center h-14 px-4 border-b shrink-0',
        'bg-[var(--ds-header-bg)] border-[var(--ds-header-border)]',
        className,
      ].join(' ')}
      style={{ zIndex: 'var(--ds-z-fixed)' }}
      {...props}
    >
      {/* Logo + Product Name */}
      <div className="flex items-center gap-3 mr-8">
        {logo && <span className="shrink-0">{logo}</span>}
        <span className="text-[length:var(--ds-text-md)] font-semibold text-[var(--ds-text-primary)] whitespace-nowrap">
          {productName}
        </span>
      </div>

      {/* Nav Links */}
      <nav className="hidden md:flex items-center gap-1 flex-1">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href || '#'}
            onClick={item.onClick}
            className={[
              'ds-focus-ring px-3 py-1.5 rounded-[var(--ds-radius-md)] text-[length:var(--ds-text-sm)] font-medium',
              'transition-colors duration-[var(--ds-duration-normal)]',
              item.active
                ? 'bg-[var(--ds-bg-selected)] text-[var(--ds-text-brand)]'
                : 'text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)] hover:bg-[var(--ds-bg-hover)]',
            ].join(' ')}
          >
            {item.icon && <span className="mr-1.5 inline-flex">{item.icon}</span>}
            {item.label}
          </a>
        ))}
      </nav>

      {/* Actions (search, notifications, user, etc.) */}
      {actions && (
        <div className="flex items-center gap-2 ml-auto">
          {actions}
        </div>
      )}
    </header>
  );
});

Header.displayName = 'Header';
export default Header;
