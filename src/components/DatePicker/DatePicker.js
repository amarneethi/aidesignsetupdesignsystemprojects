'use client';

import { forwardRef, useState, useRef, useEffect, useMemo, useCallback, useId } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function isSameDay(a, b) {
  if (!a || !b) return false;
  const da = new Date(a);
  const db = new Date(b);
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate();
}

const DatePicker = forwardRef(function DatePicker(
  {
    label,
    value,
    onChange,
    rangeEnd,
    onRangeChange,
    mode = 'single',
    placeholder = 'Select date',
    disabled = false,
    required = false,
    errorText,
    helperText,
    min,
    max,
    size = 'md',
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

  const today = useMemo(() => new Date(), []);
  const initialDate = value ? new Date(value) : today;

  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [hoverDate, setHoverDate] = useState(null);
  const [rangeStart, setRangeStart] = useState(value || null);
  const [rangeEndInternal, setRangeEndInternal] = useState(rangeEnd || null);

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

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = useCallback(() => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }, [viewMonth]);

  const nextMonth = useCallback(() => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }, [viewMonth]);

  const handleDayClick = (day) => {
    const selected = new Date(viewYear, viewMonth, day);
    if (min && selected < new Date(min)) return;
    if (max && selected > new Date(max)) return;

    if (mode === 'range') {
      if (!rangeStart || rangeEndInternal) {
        setRangeStart(selected);
        setRangeEndInternal(null);
        onChange?.(formatDate(selected));
        onRangeChange?.(formatDate(selected), null);
      } else {
        const end = selected < rangeStart ? rangeStart : selected;
        const start = selected < rangeStart ? selected : rangeStart;
        setRangeStart(start);
        setRangeEndInternal(end);
        onChange?.(formatDate(start));
        onRangeChange?.(formatDate(start), formatDate(end));
        setIsOpen(false);
      }
    } else {
      onChange?.(formatDate(selected));
      setIsOpen(false);
    }
  };

  const isInRange = (day) => {
    if (mode !== 'range') return false;
    const d = new Date(viewYear, viewMonth, day);
    const s = rangeStart ? new Date(rangeStart) : null;
    const e = (rangeEndInternal ? new Date(rangeEndInternal) : hoverDate ? new Date(hoverDate) : null);
    if (!s || !e) return false;
    const start = s < e ? s : e;
    const end = s < e ? e : s;
    return d > start && d < end;
  };

  const isDisabledDay = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    if (min && d < new Date(min)) return true;
    if (max && d > new Date(max)) return true;
    return false;
  };

  const displayValue = mode === 'range' && value && rangeEndInternal
    ? `${value} → ${formatDate(rangeEndInternal)}`
    : value || '';

  const hasError = !!errorText;
  const borderColor = hasError ? 'var(--ds-border-error)' : 'var(--ds-input-border)';

  const sizeClasses = {
    sm: 'h-[var(--ds-size-sm)] text-[length:var(--ds-text-xs)] pl-2.5 pr-8',
    md: 'h-[var(--ds-size-md)] text-[length:var(--ds-text-sm)] pl-3 pr-10',
    lg: 'h-[var(--ds-size-lg)] text-[length:var(--ds-text-md)] pl-4 pr-12',
  };

  return (
    <div ref={containerRef} className={['flex flex-col gap-1.5 relative', wrapperClassName].join(' ')}>
      {label && (
        <label htmlFor={id} className="text-[length:var(--ds-text-sm)] font-medium text-[var(--ds-text-primary)]">
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
          'ds-focus-ring w-full rounded-[var(--ds-radius-md)] bg-[var(--ds-input-bg)] text-left relative cursor-pointer',
          'transition-colors duration-[var(--ds-duration-normal)]',
          sizeClasses[size],
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          displayValue ? 'text-[var(--ds-text-primary)]' : 'text-[var(--ds-text-placeholder)]',
          className,
        ].join(' ')}
        style={{ border: `1px solid ${borderColor}` }}
        {...props}
      >
        <span className="block truncate">{displayValue || placeholder}</span>
        <Calendar
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--ds-icon-secondary)' }}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 p-3 rounded-[var(--ds-radius-lg)] border w-[280px]"
          style={{
            zIndex: 'var(--ds-z-dropdown)',
            backgroundColor: 'var(--ds-bg-primary)',
            borderColor: 'var(--ds-border-primary)',
            boxShadow: 'var(--ds-shadow-lg)',
          }}
        >
          {/* Month/Year header */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 rounded-[var(--ds-radius-md)] hover:bg-[var(--ds-bg-hover)] transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} style={{ color: 'var(--ds-icon-primary)' }} />
            </button>
            <span className="text-[length:var(--ds-text-sm)] font-semibold text-[var(--ds-text-primary)]">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 rounded-[var(--ds-radius-md)] hover:bg-[var(--ds-bg-hover)] transition-colors cursor-pointer"
            >
              <ChevronRight size={16} style={{ color: 'var(--ds-icon-primary)' }} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-0 mb-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-[11px] font-medium text-[var(--ds-text-tertiary)] py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-0">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateObj = new Date(viewYear, viewMonth, day);
              const isSelected = isSameDay(dateObj, value) || isSameDay(dateObj, rangeEndInternal);
              const isToday = isSameDay(dateObj, today);
              const inRange = isInRange(day);
              const dayDisabled = isDisabledDay(day);

              return (
                <button
                  key={day}
                  type="button"
                  disabled={dayDisabled}
                  onClick={() => handleDayClick(day)}
                  onMouseEnter={() => mode === 'range' && rangeStart && !rangeEndInternal && setHoverDate(dateObj)}
                  className={[
                    'w-9 h-9 text-[length:var(--ds-text-sm)] rounded-[var(--ds-radius-md)] transition-colors cursor-pointer',
                    isSelected
                      ? 'bg-[var(--ds-bg-brand)] text-[var(--ds-text-on-brand)] font-semibold'
                      : inRange
                        ? 'bg-[var(--ds-bg-selected)] text-[var(--ds-text-brand)]'
                        : isToday
                          ? 'font-semibold text-[var(--ds-text-brand)] bg-[var(--ds-bg-selected)]'
                          : 'text-[var(--ds-text-primary)] hover:bg-[var(--ds-bg-hover)]',
                    dayDisabled ? 'opacity-30 cursor-not-allowed' : '',
                  ].join(' ')}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Today button */}
          <div className="mt-2 pt-2 border-t border-[var(--ds-border-primary)]">
            <button
              type="button"
              onClick={() => {
                setViewYear(today.getFullYear());
                setViewMonth(today.getMonth());
                handleDayClick(today.getDate());
              }}
              className="w-full text-[length:var(--ds-text-xs)] text-[var(--ds-text-brand)] hover:underline py-1 cursor-pointer"
            >
              Today
            </button>
          </div>
        </div>
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

DatePicker.displayName = 'DatePicker';
export default DatePicker;
