'use client';

import { forwardRef, useState, useEffect } from 'react';
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const typeConfig = {
  success: {
    icon: CheckCircle2,
    bg: 'var(--ds-bg-success)',
    border: 'var(--ds-border-success)',
    iconColor: 'var(--ds-icon-success)',
    text: 'var(--ds-text-success)',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'var(--ds-bg-warning)',
    border: 'var(--ds-border-warning)',
    iconColor: 'var(--ds-icon-warning)',
    text: 'var(--ds-text-warning)',
  },
  error: {
    icon: AlertCircle,
    bg: 'var(--ds-bg-error)',
    border: 'var(--ds-border-error)',
    iconColor: 'var(--ds-icon-danger)',
    text: 'var(--ds-text-danger)',
  },
  info: {
    icon: Info,
    bg: 'var(--ds-bg-info)',
    border: 'var(--ds-border-info)',
    iconColor: 'var(--ds-icon-info)',
    text: 'var(--ds-text-info)',
  },
};

/** Inline notification — renders in-page */
const Notification = forwardRef(function Notification(
  {
    type = 'info',
    title,
    children,
    dismissible = true,
    onDismiss,
    className = '',
    ...props
  },
  ref
) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      ref={ref}
      role="alert"
      className={[
        'flex gap-3 p-4 rounded-[var(--ds-radius-lg)] border-l-4',
        className,
      ].join(' ')}
      style={{
        backgroundColor: config.bg,
        borderLeftColor: config.border,
        borderTop: `1px solid ${config.border}`,
        borderRight: `1px solid ${config.border}`,
        borderBottom: `1px solid ${config.border}`,
      }}
      {...props}
    >
      <Icon size={20} className="shrink-0 mt-0.5" style={{ color: config.iconColor }} />
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-semibold text-[length:var(--ds-text-sm)]" style={{ color: config.text }}>
            {title}
          </p>
        )}
        {children && (
          <div className="text-[length:var(--ds-text-sm)] text-[var(--ds-text-secondary)] mt-1">
            {children}
          </div>
        )}
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 p-1 rounded-[var(--ds-radius-sm)] hover:bg-black/10 transition-colors cursor-pointer"
          aria-label="Dismiss"
        >
          <X size={16} style={{ color: config.iconColor }} />
        </button>
      )}
    </div>
  );
});

/** Toast notification — appears as a floating alert */
export function Toast({ type = 'info', title, children, duration = 5000, onClose, visible = true }) {
  const [show, setShow] = useState(visible);
  const config = typeConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    setShow(visible);
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!show) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-6 right-6 max-w-sm w-full animate-in slide-in-from-right"
      style={{ zIndex: 'var(--ds-z-toast)' }}
    >
      <div
        className="flex gap-3 p-4 rounded-[var(--ds-radius-lg)] shadow-[var(--ds-shadow-lg)] border"
        style={{
          backgroundColor: 'var(--ds-bg-primary)',
          borderColor: 'var(--ds-border-primary)',
        }}
      >
        <Icon size={20} className="shrink-0 mt-0.5" style={{ color: config.iconColor }} />
        <div className="flex-1 min-w-0">
          {title && (
            <p className="font-semibold text-[length:var(--ds-text-sm)] text-[var(--ds-text-primary)]">
              {title}
            </p>
          )}
          {children && (
            <div className="text-[length:var(--ds-text-sm)] text-[var(--ds-text-secondary)] mt-1">
              {children}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            setShow(false);
            onClose?.();
          }}
          className="shrink-0 p-1 rounded-[var(--ds-radius-sm)] hover:bg-[var(--ds-bg-hover)] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={16} style={{ color: 'var(--ds-icon-secondary)' }} />
        </button>
      </div>
    </div>
  );
}

/** Banner notification — full-width at the top of a page */
export function Banner({ type = 'info', children, dismissible = true, onDismiss, className = '' }) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={['flex items-center gap-3 px-4 py-3', className].join(' ')}
      style={{
        backgroundColor: config.bg,
        borderBottom: `1px solid ${config.border}`,
      }}
    >
      <Icon size={18} className="shrink-0" style={{ color: config.iconColor }} />
      <div className="flex-1 text-[length:var(--ds-text-sm)]" style={{ color: config.text }}>
        {children}
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 p-1 rounded-[var(--ds-radius-sm)] hover:bg-black/10 transition-colors cursor-pointer"
          aria-label="Dismiss"
        >
          <X size={16} style={{ color: config.iconColor }} />
        </button>
      )}
    </div>
  );
}

Notification.displayName = 'Notification';
Toast.displayName = 'Toast';
Banner.displayName = 'Banner';
export default Notification;
