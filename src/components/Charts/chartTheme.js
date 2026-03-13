'use client';

// Chart color palette — derived from the design system primitive tokens.
// We use resolved hex values so Recharts (which works with SVG/canvas)
// can consume them directly. The palette order is intentionally chosen
// for maximum perceptual contrast when series are plotted together.

export const CHART_COLORS = {
  blue:   { 600: '#2563eb', 500: '#3b82f6', 400: '#60a5fa', 300: '#93c5fd', 200: '#bfdbfe', 100: '#dbeafe', 50: '#eff6ff' },
  teal:   { 600: '#0d9488', 500: '#14b8a6', 400: '#2dd4bf', 300: '#5eead4', 200: '#99f6e4', 100: '#ccfbf1' },
  purple: { 600: '#9333ea', 500: '#a855f7', 400: '#c084fc', 300: '#d8b4fe', 200: '#e9d5ff', 100: '#f3e8ff' },
  amber:  { 600: '#d97706', 500: '#f59e0b', 400: '#fbbf24', 300: '#fcd34d', 200: '#fde68a', 100: '#fef3c7' },
  red:    { 600: '#dc2626', 500: '#ef4444', 400: '#f87171', 300: '#fca5a5', 200: '#fecaca', 100: '#fee2e2' },
  green:  { 600: '#16a34a', 500: '#22c55e', 400: '#4ade80', 300: '#86efac', 200: '#bbf7d0', 100: '#dcfce7' },
};

// Ordered series palette — use index to pick colors for multi-series charts
export const SERIES_COLORS = [
  CHART_COLORS.blue[500],
  CHART_COLORS.teal[500],
  CHART_COLORS.purple[500],
  CHART_COLORS.amber[500],
  CHART_COLORS.red[500],
  CHART_COLORS.green[500],
  CHART_COLORS.blue[300],
  CHART_COLORS.teal[300],
  CHART_COLORS.purple[300],
  CHART_COLORS.amber[300],
];

// Common chart styling props that match the design system aesthetic
export const CHART_THEME = {
  fontFamily: 'var(--ds-font-sans)',
  fontSize: 12,
  // Semantic grays used in axes, grid, tooltips
  axisStroke: '#9ca3af',       // gray-400
  gridStroke: '#e5e7eb',       // gray-200
  gridStrokeDark: '#374151',   // gray-700
  tooltipBg: '#ffffff',
  tooltipBgDark: '#1f2937',
  tooltipBorder: '#e5e7eb',
  tooltipBorderDark: '#374151',
  textPrimary: '#111827',      // gray-900
  textSecondary: '#6b7280',    // gray-500
  textPrimaryDark: '#f9fafb',  // gray-50
  textSecondaryDark: '#9ca3af',// gray-400
};

// Hook-free helper: read theme from DOM
export function getIsDark() {
  if (typeof document === 'undefined') return false;
  const theme = document.documentElement.getAttribute('data-theme');
  return theme === 'dark' || theme === 'high-contrast';
}

// Shared default props for common recharts sub-components
export function getAxisProps(isDark) {
  return {
    tick: { fill: isDark ? CHART_THEME.textSecondaryDark : CHART_THEME.textSecondary, fontSize: 12 },
    axisLine: { stroke: isDark ? CHART_THEME.gridStrokeDark : CHART_THEME.gridStroke },
    tickLine: false,
  };
}

export function getGridProps(isDark) {
  return {
    strokeDasharray: '3 3',
    stroke: isDark ? CHART_THEME.gridStrokeDark : CHART_THEME.gridStroke,
    vertical: false,
  };
}

export function getTooltipProps(isDark) {
  return {
    contentStyle: {
      backgroundColor: isDark ? CHART_THEME.tooltipBgDark : CHART_THEME.tooltipBg,
      border: `1px solid ${isDark ? CHART_THEME.tooltipBorderDark : CHART_THEME.tooltipBorder}`,
      borderRadius: '6px',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      fontSize: 12,
      fontFamily: CHART_THEME.fontFamily,
      color: isDark ? CHART_THEME.textPrimaryDark : CHART_THEME.textPrimary,
      padding: '8px 12px',
    },
    labelStyle: {
      fontWeight: 600,
      marginBottom: 4,
      color: isDark ? CHART_THEME.textPrimaryDark : CHART_THEME.textPrimary,
    },
    itemStyle: {
      padding: '2px 0',
      fontSize: 12,
    },
    cursor: { fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' },
  };
}

export function getLegendProps(isDark) {
  return {
    wrapperStyle: { fontSize: 12, fontFamily: CHART_THEME.fontFamily, color: isDark ? CHART_THEME.textSecondaryDark : CHART_THEME.textSecondary },
    iconType: 'circle',
    iconSize: 8,
  };
}

// Chart wrapper component — provides consistent card-like container
export function ChartWrapper({ title, subtitle, children, className = '', style = {} }) {
  return (
    <div
      className={`rounded-[var(--ds-radius-lg)] border p-5 ${className}`}
      style={{
        borderColor: 'var(--ds-border-primary)',
        backgroundColor: 'var(--ds-bg-primary)',
        ...style,
      }}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h4
              className="text-[length:var(--ds-text-sm)] font-semibold"
              style={{ color: 'var(--ds-text-primary)' }}
            >
              {title}
            </h4>
          )}
          {subtitle && (
            <p
              className="text-[length:var(--ds-text-xs)] mt-0.5"
              style={{ color: 'var(--ds-text-secondary)' }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
