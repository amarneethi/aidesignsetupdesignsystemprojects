'use client';

import { forwardRef, useState, useRef, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/* ---------- Sparkline (mini trendline for with-trend variant) ---------- */
function Sparkline({ data = [], width = 80, height = 28, color = 'var(--ds-text-brand)' }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);

  const points = data.map((v, i) => `${i * step},${height - ((v - min) / range) * height}`).join(' ');

  const [tooltip, setTooltip] = useState(null);
  const svgRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const idx = Math.round(x / step);
    if (idx >= 0 && idx < data.length) {
      setTooltip({ x: idx * step, y: height - ((data[idx] - min) / range) * height, value: data[idx] });
    }
  };

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="shrink-0"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTooltip(null)}
      style={{ overflow: 'visible' }}
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {tooltip && (
        <>
          <circle cx={tooltip.x} cy={tooltip.y} r="3" fill={color} />
          <rect
            x={tooltip.x - 16}
            y={tooltip.y - 20}
            width="32"
            height="16"
            rx="3"
            fill="var(--ds-bg-tertiary)"
            stroke="var(--ds-border-primary)"
            strokeWidth="0.5"
          />
          <text
            x={tooltip.x}
            y={tooltip.y - 9}
            textAnchor="middle"
            fontSize="9"
            fill="var(--ds-text-primary)"
          >
            {tooltip.value}
          </text>
        </>
      )}
    </svg>
  );
}

/* ---------- Progress ring ---------- */
function ProgressRing({ value = 0, size = 40, strokeWidth = 4, color = 'var(--ds-text-brand)' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(value, 0), 100);
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--ds-border-primary)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.4s ease' }}
      />
    </svg>
  );
}

/* ---------- Progress bar ---------- */
function ProgressBar({ value = 0, color = 'var(--ds-text-brand)' }) {
  const clamped = Math.min(Math.max(value, 0), 100);
  return (
    <div
      className="w-full h-1.5 rounded-full overflow-hidden mt-2"
      style={{ backgroundColor: 'var(--ds-bg-tertiary)' }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${clamped}%`,
          backgroundColor: color,
          transition: 'width 0.4s ease',
        }}
      />
    </div>
  );
}

/* ---------- Delta indicator ---------- */
function DeltaIndicator({ value, format = 'percentage' }) {
  if (value == null) return null;
  const isPositive = value > 0;
  const isNeutral = value === 0;
  const Icon = isPositive ? TrendingUp : isNeutral ? Minus : TrendingDown;
  const color = isPositive
    ? 'var(--ds-text-success)'
    : isNeutral
      ? 'var(--ds-text-secondary)'
      : 'var(--ds-text-danger)';

  const display = format === 'percentage'
    ? `${isPositive ? '+' : ''}${value}%`
    : `${isPositive ? '+' : ''}${value}`;

  return (
    <span className="inline-flex items-center gap-1 text-[length:var(--ds-text-xs)] font-medium" style={{ color }}>
      <Icon size={12} />
      {display}
    </span>
  );
}

/* ========== KPI CARD ========== */
const KpiCard = forwardRef(function KpiCard(
  {
    // Core
    label,
    value,
    // Variant-specific
    variant = 'simple', // simple | with-trend | with-delta | with-progress | with-icon
    // with-trend
    trendData,
    trendColor,
    // with-delta
    delta,
    deltaFormat = 'percentage', // percentage | absolute
    deltaLabel,
    // with-progress
    progress, // 0-100
    target,
    progressType = 'bar', // bar | ring
    progressColor,
    // with-icon
    icon,
    iconColor,
    // General
    className = '',
    ...props
  },
  ref
) {
  return (
    <div
      ref={ref}
      className={[
        'rounded-[var(--ds-radius-lg)] border p-4',
        'transition-shadow duration-[var(--ds-duration-normal)]',
        'hover:shadow-[var(--ds-shadow-md)]',
        className,
      ].join(' ')}
      style={{
        backgroundColor: 'var(--ds-bg-primary)',
        borderColor: 'var(--ds-border-primary)',
      }}
      {...props}
    >
      {/* Top row: icon + label */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Label */}
          <p
            className="text-[length:var(--ds-text-xs)] font-medium uppercase tracking-wider truncate"
            style={{ color: 'var(--ds-text-secondary)' }}
          >
            {label}
          </p>

          {/* Value row */}
          <div className="flex items-end gap-2 mt-1">
            <span
              className="text-[length:var(--ds-text-2xl)] font-bold leading-none"
              style={{ color: 'var(--ds-text-primary)' }}
            >
              {value}
            </span>

            {/* Delta (inline beside value) */}
            {variant === 'with-delta' && (
              <DeltaIndicator value={delta} format={deltaFormat} />
            )}
          </div>

          {/* Delta label */}
          {variant === 'with-delta' && deltaLabel && (
            <p
              className="text-[length:var(--ds-text-xs)] mt-1"
              style={{ color: 'var(--ds-text-tertiary)' }}
            >
              {deltaLabel}
            </p>
          )}

          {/* Progress bar variant */}
          {variant === 'with-progress' && progressType === 'bar' && (
            <div className="mt-1">
              <ProgressBar value={progress} color={progressColor || 'var(--ds-text-brand)'} />
              {target != null && (
                <p
                  className="text-[length:var(--ds-text-xs)] mt-1"
                  style={{ color: 'var(--ds-text-tertiary)' }}
                >
                  {progress}% of {target}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right side: icon, trend, or progress ring */}
        {variant === 'with-icon' && icon && (
          <div
            className="shrink-0 w-10 h-10 rounded-[var(--ds-radius-md)] flex items-center justify-center"
            style={{
              backgroundColor: iconColor ? `${iconColor}18` : 'var(--ds-bg-selected)',
              color: iconColor || 'var(--ds-text-brand)',
            }}
          >
            {icon}
          </div>
        )}

        {variant === 'with-trend' && trendData && (
          <Sparkline data={trendData} color={trendColor || 'var(--ds-text-brand)'} />
        )}

        {variant === 'with-progress' && progressType === 'ring' && (
          <div className="shrink-0 relative flex items-center justify-center">
            <ProgressRing value={progress} color={progressColor || 'var(--ds-text-brand)'} />
            <span
              className="absolute text-[length:9px] font-bold"
              style={{ color: 'var(--ds-text-primary)' }}
            >
              {progress}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

KpiCard.displayName = 'KpiCard';
export default KpiCard;
