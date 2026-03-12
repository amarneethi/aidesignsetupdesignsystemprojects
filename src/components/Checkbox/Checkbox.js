'use client';

import { forwardRef, useId } from 'react';
import { Check, Minus } from 'lucide-react';

const Checkbox = forwardRef(function Checkbox(
  {
    label,
    checked = false,
    indeterminate = false,
    disabled = false,
    size = 'md',
    onChange,
    id: idProp,
    className = '',
    ...props
  },
  ref
) {
  const autoId = useId();
  const id = idProp || autoId;

  const boxSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 18 : 14;

  const isChecked = indeterminate || checked;

  return (
    <label
      htmlFor={id}
      className={[
        'inline-flex items-center gap-2 cursor-pointer select-none',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="relative inline-flex items-center justify-center">
        <input
          ref={ref}
          type="checkbox"
          id={id}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="ds-sr-only peer"
          aria-checked={indeterminate ? 'mixed' : checked}
          {...props}
        />
        <span
          className={[
            boxSize,
            'rounded-[var(--ds-radius-sm)] border-2 transition-all duration-[var(--ds-duration-normal)]',
            'flex items-center justify-center',
            isChecked
              ? 'bg-[var(--ds-bg-brand)] border-[var(--ds-bg-brand)] text-[var(--ds-text-on-brand)]'
              : 'bg-[var(--ds-input-bg)] border-[var(--ds-input-border)]',
            'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-[var(--ds-focus-ring-color)] peer-focus-visible:outline-offset-2',
          ].join(' ')}
        >
          {indeterminate ? (
            <Minus size={iconSize} strokeWidth={3} />
          ) : checked ? (
            <Check size={iconSize} strokeWidth={3} />
          ) : null}
        </span>
      </span>
      {label && (
        <span className="text-[length:var(--ds-text-sm)] text-[var(--ds-text-primary)]">{label}</span>
      )}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';
export default Checkbox;
