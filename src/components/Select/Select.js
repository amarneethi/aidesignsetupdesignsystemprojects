'use client';

import { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';

const sizeStyles = {
  sm: 'h-[var(--ds-size-sm)] text-[length:var(--ds-text-xs)] pl-2.5 pr-8',
  md: 'h-[var(--ds-size-md)] text-[length:var(--ds-text-sm)] pl-3 pr-10',
  lg: 'h-[var(--ds-size-lg)] text-[length:var(--ds-text-md)] pl-4 pr-12',
};

const Select = forwardRef(function Select(
  {
    label,
    options = [],
    placeholder = 'Select an option',
    helperText,
    errorText,
    size = 'md',
    disabled = false,
    required = false,
    id: idProp,
    className = '',
    wrapperClassName = '',
    value,
    onChange,
    ...props
  },
  ref
) {
  const autoId = useId();
  const id = idProp || autoId;
  const hasError = !!errorText;
  const borderColor = hasError ? 'var(--ds-border-error)' : 'var(--ds-input-border)';

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
        <select
          ref={ref}
          id={id}
          disabled={disabled}
          required={required}
          value={value}
          onChange={onChange}
          aria-invalid={hasError}
          className={[
            'ds-focus-ring w-full rounded-[var(--ds-radius-md)] bg-[var(--ds-input-bg)] text-[var(--ds-text-primary)]',
            'appearance-none cursor-pointer',
            'transition-colors duration-[var(--ds-duration-normal)]',
            sizeStyles[size],
            disabled ? 'opacity-50 cursor-not-allowed bg-[var(--ds-bg-disabled)]' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          style={{ borderColor, border: `1px solid ${borderColor}` }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const lbl = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--ds-icon-secondary)' }}
        />
      </div>
      {(errorText || helperText) && (
        <p
          className="text-[length:var(--ds-text-xs)]"
          style={{ color: hasError ? 'var(--ds-text-danger)' : 'var(--ds-text-secondary)' }}
        >
          {errorText || helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
