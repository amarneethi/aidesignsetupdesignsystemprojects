'use client';

import { forwardRef, useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const sizeStyles = {
  sm: 'h-[var(--ds-size-sm)] text-[length:var(--ds-text-xs)] pl-2.5 pr-8',
  md: 'h-[var(--ds-size-md)] text-[length:var(--ds-text-sm)] pl-3 pr-10',
  lg: 'h-[var(--ds-size-lg)] text-[length:var(--ds-text-md)] pl-4 pr-12',
};

const Dropdown = forwardRef(function Dropdown(
  {
    label,
    options = [],
    value,
    onChange,
    placeholder = 'Select...',
    size = 'md',
    disabled = false,
    required = false,
    errorText,
    helperText,
    id: idProp,
    className = '',
    wrapperClassName = '',
    ...props
  },
  ref
) {
  const autoId = useId();
  const id = idProp || autoId;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find((o) => (typeof o === 'string' ? o : o.value) === value);
  const selectedLabel = selectedOption
    ? typeof selectedOption === 'string'
      ? selectedOption
      : selectedOption.label
    : '';

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

  const handleSelect = (optValue) => {
    onChange?.(optValue);
    setIsOpen(false);
  };

  const hasError = !!errorText;
  const borderColor = hasError ? 'var(--ds-border-error)' : 'var(--ds-input-border)';

  return (
    <div ref={containerRef} className={['flex flex-col gap-1.5 relative', wrapperClassName].join(' ')}>
      {label && (
        <label
          htmlFor={id}
          className="text-[length:var(--ds-text-sm)] font-medium text-[var(--ds-text-primary)]"
        >
          {label}
          {required && <span className="text-[var(--ds-text-danger)] ml-0.5">*</span>}
        </label>
      )}
      <button
        ref={ref}
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={[
          'ds-focus-ring w-full rounded-[var(--ds-radius-md)] bg-[var(--ds-input-bg)] text-left',
          'transition-colors duration-[var(--ds-duration-normal)] relative cursor-pointer',
          sizeStyles[size],
          disabled ? 'opacity-50 cursor-not-allowed bg-[var(--ds-bg-disabled)]' : '',
          selectedLabel ? 'text-[var(--ds-text-primary)]' : 'text-[var(--ds-text-placeholder)]',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={{ border: `1px solid ${borderColor}` }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        {...props}
      >
        <span className="block truncate">{selectedLabel || placeholder}</span>
        <ChevronDown
          size={16}
          className={[
            'absolute right-3 top-1/2 -translate-y-1/2 transition-transform',
            isOpen ? 'rotate-180' : '',
          ].join(' ')}
          style={{ color: 'var(--ds-icon-secondary)' }}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <ul
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1 py-1 rounded-[var(--ds-radius-lg)] border overflow-auto max-h-60 ds-scrollbar"
          style={{
            zIndex: 'var(--ds-z-dropdown)',
            backgroundColor: 'var(--ds-bg-primary)',
            borderColor: 'var(--ds-border-primary)',
            boxShadow: 'var(--ds-shadow-lg)',
          }}
        >
          {options.map((opt) => {
            const optValue = typeof opt === 'string' ? opt : opt.value;
            const optLabel = typeof opt === 'string' ? opt : opt.label;
            const optDisabled = typeof opt === 'object' && opt.disabled;
            const isSelected = optValue === value;

            return (
              <li
                key={optValue}
                role="option"
                aria-selected={isSelected}
                onClick={() => !optDisabled && handleSelect(optValue)}
                className={[
                  'flex items-center gap-2 px-3 py-2 text-[length:var(--ds-text-sm)] cursor-pointer',
                  'transition-colors duration-[var(--ds-duration-fast)]',
                  isSelected ? 'bg-[var(--ds-bg-selected)] text-[var(--ds-text-brand)] font-medium' : 'text-[var(--ds-text-primary)]',
                  optDisabled
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-[var(--ds-bg-hover)]',
                ].join(' ')}
              >
                <span className="flex-1 truncate">{optLabel}</span>
                {isSelected && <Check size={16} style={{ color: 'var(--ds-icon-brand)' }} />}
              </li>
            );
          })}
          {options.length === 0 && (
            <li className="px-3 py-2 text-[length:var(--ds-text-sm)] text-[var(--ds-text-tertiary)]">
              No options available
            </li>
          )}
        </ul>
      )}

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

Dropdown.displayName = 'Dropdown';
export default Dropdown;
