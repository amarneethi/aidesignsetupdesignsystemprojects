'use client';

import { forwardRef, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

const sizeMap = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[90vw]',
};

const Modal = forwardRef(function Modal(
  {
    open = false,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    closeOnOverlay = true,
    closeOnEsc = true,
    showCloseButton = true,
    className = '',
    ...props
  },
  ref
) {
  const overlayRef = useRef(null);

  const handleEsc = useCallback(
    (e) => {
      if (e.key === 'Escape' && closeOnEsc) {
        onClose?.();
      }
    },
    [closeOnEsc, onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEsc);
        document.body.style.overflow = '';
      };
    }
  }, [open, handleEsc]);

  if (!open) return null;

  const modal = (
    <div
      ref={overlayRef}
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        zIndex: 'var(--ds-z-modal)',
        backgroundColor: 'var(--ds-bg-overlay)',
      }}
      onClick={(e) => {
        if (closeOnOverlay && e.target === overlayRef.current) {
          onClose?.();
        }
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={[
          'w-full rounded-[var(--ds-radius-xl)] shadow-[var(--ds-shadow-xl)] flex flex-col max-h-[85vh]',
          'bg-[var(--ds-bg-primary)] border border-[var(--ds-border-primary)]',
          sizeMap[size],
          className,
        ].join(' ')}
        {...props}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--ds-border-primary)] shrink-0">
            {title && (
              <h2
                id="modal-title"
                className="text-[length:var(--ds-text-lg)] font-semibold text-[var(--ds-text-primary)]"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="ds-focus-ring p-1.5 rounded-[var(--ds-radius-md)] hover:bg-[var(--ds-bg-hover)] transition-colors ml-auto cursor-pointer"
                aria-label="Close dialog"
              >
                <X size={18} style={{ color: 'var(--ds-icon-secondary)' }} />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 ds-scrollbar">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--ds-border-primary)] shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  if (typeof window === 'undefined') return null;
  return createPortal(modal, document.body);
});

Modal.displayName = 'Modal';
export default Modal;
