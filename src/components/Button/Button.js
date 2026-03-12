'use client';

import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-[var(--ds-bg-brand)] text-[color:var(--ds-text-on-brand)] hover:bg-[var(--ds-bg-brand-hover)] active:brightness-90',
  secondary:
    'bg-transparent text-[color:var(--ds-text-brand)] border border-[var(--ds-border-brand)] hover:bg-[var(--ds-bg-selected)] active:bg-[var(--ds-bg-active)]',
  tertiary:
    'bg-transparent text-[color:var(--ds-text-primary)] border border-[var(--ds-border-primary)] hover:bg-[var(--ds-bg-hover)] active:bg-[var(--ds-bg-active)]',
  danger:
    'bg-[var(--ds-bg-danger)] text-[color:var(--ds-text-on-brand)] hover:bg-[var(--ds-bg-danger-hover)] active:brightness-90',
  ghost:
    'bg-transparent text-[color:var(--ds-text-brand)] hover:bg-[var(--ds-bg-hover)] active:bg-[var(--ds-bg-active)]',
};

const sizes = {
  sm: 'h-[var(--ds-size-sm)] px-3 text-[length:var(--ds-text-xs)] gap-1.5',
  md: 'h-[var(--ds-size-md)] px-4 text-[length:var(--ds-text-sm)] gap-2',
  lg: 'h-[var(--ds-size-lg)] px-6 text-[length:var(--ds-text-md)] gap-2.5',
};

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    className = '',
    type = 'button',
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={[
        'ds-focus-ring inline-flex items-center justify-center font-medium rounded-[var(--ds-radius-md)] transition-all',
        `duration-[var(--ds-duration-normal)]`,
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {!loading && icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      {children && <>{children}</>}
      {!loading && icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
