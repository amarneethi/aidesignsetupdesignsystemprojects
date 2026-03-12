'use client';

import { forwardRef, useId } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const sizeStyles = {
  sm: 'h-[var(--ds-size-sm)] text-[length:var(--ds-text-xs)] px-2.5',
  md: 'h-[var(--ds-size-md)] text-[length:var(--ds-text-sm)] px-3',
  lg: 'h-[var(--ds-size-lg)] text-[length:var(--ds-text-md)] px-4',
};

const TextInput = forwardRef(function TextInput(
  {
    label,
    helperText,
    errorText,
    successText,
    size = 'md',
    disabled = false,
    required = false,
    id: idProp,
    className = '',
    wrapperClassName = '',
    icon,
    ...props
  },
  ref
) {
  const autoId = useId();
  const id = idProp || autoId;
  const hasError = !!errorText;
  const hasSuccess = !!successText;

  const stateMessage = errorText || successText || helperText;
  const stateColor = hasError
    ? 'var(--ds-text-danger)'
    : hasSuccess
      ? 'var(--ds-text-success)'
      : 'var(--ds-text-secondary)';

  const borderColor = hasError
    ? 'var(--ds-border-error)'
    : hasSuccess
      ? 'var(--ds-border-success)'
      : 'var(--ds-input-border)';

  return (
    <div className={['flex flex-col gap-1.5', wrapperClassName].filter(Boolean).join(' ')}>
      {label && (
        <label
          htmlFor={id}
          className="text-[length:var(--ds-text-sm)] font-medium text-[var(--ds-text-primary)]"
        >
          {label}
          {required && <span className="text-[var(--ds-text-danger)] ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ds-icon-secondary)] pointer-events-none">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          disabled={disabled}
          required={required}
          aria-invalid={hasError}
          aria-describedby={stateMessage ? `${id}-message` : undefined}
          className={[
            'ds-focus-ring w-full rounded-[var(--ds-radius-md)] bg-[var(--ds-input-bg)] text-[var(--ds-text-primary)]',
            'placeholder:text-[var(--ds-text-placeholder)]',
            'transition-colors duration-[var(--ds-duration-normal)]',
            `border border-[${borderColor}]`,
            `hover:border-[var(--ds-input-border-hover)]`,
            sizeStyles[size],
            icon ? 'pl-10' : '',
            disabled ? 'opacity-50 cursor-not-allowed bg-[var(--ds-bg-disabled)]' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          style={{ borderColor }}
          {...props}
        />
        {hasError && (
          <AlertCircle
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--ds-icon-danger)' }}
          />
        )}
        {hasSuccess && !hasError && (
          <CheckCircle2
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--ds-icon-success)' }}
          />
        )}
      </div>
      {stateMessage && (
        <p id={`${id}-message`} className="text-[length:var(--ds-text-xs)]" style={{ color: stateColor }}>
          {stateMessage}
        </p>
      )}
    </div>
  );
});

TextInput.displayName = 'TextInput';
export default TextInput;
