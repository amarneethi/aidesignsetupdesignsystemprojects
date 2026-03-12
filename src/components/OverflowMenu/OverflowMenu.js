'use client';

import { forwardRef, useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

const OverflowMenu = forwardRef(function OverflowMenu(
  {
    items = [],
    trigger,
    align = 'right',
    size = 'md',
    className = '',
    ...props
  },
  ref
) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleItemClick = (item) => {
    if (!item.disabled) {
      item.onClick?.();
      setIsOpen(false);
    }
  };

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;

  return (
    <div ref={containerRef} className={['relative inline-flex', className].join(' ')} {...props}>
      {trigger ? (
        <span onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
          {trigger}
        </span>
      ) : (
        <button
          ref={ref}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="ds-focus-ring p-1.5 rounded-[var(--ds-radius-md)] hover:bg-[var(--ds-bg-hover)] transition-colors cursor-pointer"
          aria-label="More actions"
          aria-haspopup="menu"
          aria-expanded={isOpen}
        >
          <MoreVertical size={iconSize} style={{ color: 'var(--ds-icon-secondary)' }} />
        </button>
      )}

      {isOpen && (
        <div
          role="menu"
          className={[
            'absolute top-full mt-1 min-w-[160px] py-1 rounded-[var(--ds-radius-lg)] border',
            align === 'right' ? 'right-0' : 'left-0',
          ].join(' ')}
          style={{
            zIndex: 'var(--ds-z-dropdown)',
            backgroundColor: 'var(--ds-bg-primary)',
            borderColor: 'var(--ds-border-primary)',
            boxShadow: 'var(--ds-shadow-lg)',
          }}
        >
          {items.map((item, idx) => {
            if (item.divider) {
              return (
                <div
                  key={`divider-${idx}`}
                  className="my-1 border-t"
                  style={{ borderColor: 'var(--ds-border-primary)' }}
                />
              );
            }
            return (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => handleItemClick(item)}
                className={[
                  'flex items-center gap-2 w-full px-3 py-2 text-[length:var(--ds-text-sm)] text-left',
                  'transition-colors duration-[var(--ds-duration-fast)] cursor-pointer',
                  item.danger ? 'text-[var(--ds-text-danger)]' : 'text-[var(--ds-text-primary)]',
                  item.disabled
                    ? 'opacity-40 cursor-not-allowed'
                    : item.danger
                      ? 'hover:bg-[var(--ds-bg-error)]'
                      : 'hover:bg-[var(--ds-bg-hover)]',
                ].join(' ')}
              >
                {item.icon && <span className="shrink-0 w-4 h-4 flex items-center justify-center">{item.icon}</span>}
                <span className="flex-1">{item.label}</span>
                {item.shortcut && (
                  <span className="text-[length:var(--ds-text-xs)] text-[var(--ds-text-tertiary)]">
                    {item.shortcut}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
});

OverflowMenu.displayName = 'OverflowMenu';
export default OverflowMenu;
