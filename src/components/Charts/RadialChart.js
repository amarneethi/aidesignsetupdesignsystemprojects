'use client';

import { useState, useEffect } from 'react';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Cell,
} from 'recharts';
import {
  SERIES_COLORS,
  CHART_COLORS,
  getTooltipProps,
  getLegendProps,
  getIsDark,
  ChartWrapper,
} from './chartTheme';

export const RADIAL_CHART_VARIANTS = ['gauge', 'progress', 'multi-ring', 'radar'];

/**
 * Determine gauge color based on percentage thresholds.
 * Green > 70%, amber 40-70%, red < 40%.
 */
function getGaugeColor(percentage) {
  if (percentage >= 70) return CHART_COLORS.green[500];
  if (percentage >= 40) return CHART_COLORS.amber[500];
  return CHART_COLORS.red[500];
}

/**
 * Center text overlay rendered as SVG elements inside the chart.
 */
function CenterLabel({ viewBox, value, label, isDark }) {
  if (!viewBox) return null;
  const { cx, cy } = viewBox;
  return (
    <g>
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: 32,
          fontWeight: 700,
          fill: isDark ? '#f9fafb' : '#111827',
        }}
      >
        {value}
      </text>
      {label && (
        <text
          x={cx}
          y={cy + 24}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: 13,
            fontWeight: 400,
            fill: isDark ? '#9ca3af' : '#6b7280',
          }}
        >
          {label}
        </text>
      )}
    </g>
  );
}

export function RadialChart({
  variant = 'gauge',
  value = 0,
  maxValue = 100,
  data = [],
  dataKeys = [],
  colors,
  height = 300,
  title,
  subtitle,
  showLegend = false,
  showTooltip = true,
  label,
  className = '',
}) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(getIsDark());

    const observer = new MutationObserver(() => {
      setIsDark(getIsDark());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  const palette = colors && colors.length > 0 ? colors : SERIES_COLORS;
  const trackFill = isDark ? '#374151' : '#e5e7eb';

  // ── Gauge ──────────────────────────────────────────────────────────────
  if (variant === 'gauge') {
    const clampedValue = Math.min(Math.max(value, 0), maxValue);
    const percentage = (clampedValue / maxValue) * 100;
    const gaugeColor = getGaugeColor(percentage);

    const chartData = [{ name: 'value', value: clampedValue, fill: gaugeColor }];

    return (
      <ChartWrapper title={title} subtitle={subtitle} className={className}>
        <ResponsiveContainer width="100%" height={height}>
          <RadialBarChart
            cx="50%"
            cy="55%"
            innerRadius="70%"
            outerRadius="85%"
            startAngle={210}
            endAngle={-30}
            data={chartData}
            barSize={16}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, maxValue]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: trackFill }}
              dataKey="value"
              angleAxisId={0}
              cornerRadius={10}
              label={
                <CenterLabel
                  value={clampedValue}
                  label={label}
                  isDark={isDark}
                />
              }
            />
            {showTooltip && <Tooltip {...getTooltipProps(isDark)} />}
            {showLegend && <Legend {...getLegendProps(isDark)} />}
          </RadialBarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    );
  }

  // ── Progress ───────────────────────────────────────────────────────────
  if (variant === 'progress') {
    const clampedValue = Math.min(Math.max(value, 0), maxValue);
    const percentage = Math.round((clampedValue / maxValue) * 100);

    const chartData = [{ name: 'progress', value: clampedValue, fill: CHART_COLORS.blue[500] }];

    return (
      <ChartWrapper title={title} subtitle={subtitle} className={className}>
        <ResponsiveContainer width="100%" height={height}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="75%"
            outerRadius="90%"
            startAngle={90}
            endAngle={-270}
            data={chartData}
            barSize={16}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, maxValue]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: trackFill }}
              dataKey="value"
              angleAxisId={0}
              cornerRadius={10}
              label={
                <CenterLabel
                  value={`${percentage}%`}
                  label={label}
                  isDark={isDark}
                />
              }
            />
            {showTooltip && <Tooltip {...getTooltipProps(isDark)} />}
            {showLegend && <Legend {...getLegendProps(isDark)} />}
          </RadialBarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    );
  }

  // ── Multi-Ring ─────────────────────────────────────────────────────────
  if (variant === 'multi-ring') {
    const ringData = [...data]
      .sort((a, b) => b.value - a.value)
      .map((entry, i) => ({
        ...entry,
        fill: entry.fill || palette[i % palette.length],
      }));

    return (
      <ChartWrapper title={title} subtitle={subtitle} className={className}>
        <ResponsiveContainer width="100%" height={height}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="20%"
            outerRadius="90%"
            startAngle={90}
            endAngle={-270}
            data={ringData}
            barSize={14}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, maxValue]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: trackFill }}
              dataKey="value"
              angleAxisId={0}
              cornerRadius={10}
            >
              {ringData.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={entry.fill} />
              ))}
            </RadialBar>
            {showTooltip && <Tooltip {...getTooltipProps(isDark)} />}
            <Legend {...getLegendProps(isDark)} />
          </RadialBarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    );
  }

  // ── Radar ──────────────────────────────────────────────────────────────
  if (variant === 'radar') {
    return (
      <ChartWrapper title={title} subtitle={subtitle} className={className}>
        <ResponsiveContainer width="100%" height={height}>
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid
              stroke={isDark ? '#374151' : '#e5e7eb'}
              gridType="polygon"
            />
            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fill: isDark ? '#9ca3af' : '#6b7280',
                fontSize: 12,
              }}
            />
            <PolarRadiusAxis
              tick={{
                fill: isDark ? '#9ca3af' : '#6b7280',
                fontSize: 10,
              }}
              axisLine={false}
            />
            {dataKeys.map((key, i) => {
              const color = palette[i % palette.length];
              return (
                <Radar
                  key={key}
                  name={key}
                  dataKey={key}
                  stroke={color}
                  fill={color}
                  fillOpacity={0.2}
                />
              );
            })}
            {showTooltip && <Tooltip {...getTooltipProps(isDark)} />}
            {showLegend && <Legend {...getLegendProps(isDark)} />}
          </RadarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    );
  }

  // Fallback for unknown variant
  return (
    <ChartWrapper title={title} subtitle={subtitle} className={className}>
      <p style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: 14 }}>
        Unknown variant: <code>{variant}</code>
      </p>
    </ChartWrapper>
  );
}
