'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import {
  SERIES_COLORS,
  CHART_COLORS,
  getAxisProps,
  getGridProps,
  getTooltipProps,
  getLegendProps,
  getIsDark,
  ChartWrapper,
} from './chartTheme';

export const BAR_CHART_VARIANTS = [
  'vertical',
  'horizontal',
  'grouped',
  'stacked',
  'stacked-percent',
  'diverging',
  'waterfall',
];

/** Normalize each row so that the dataKeys sum to 100%. */
function toPercentData(data, dataKeys) {
  return data.map((row) => {
    const total = dataKeys.reduce((sum, key) => sum + (Math.abs(Number(row[key])) || 0), 0);
    if (total === 0) return { ...row };
    const next = { ...row, __raw: {} };
    dataKeys.forEach((key) => {
      next.__raw[key] = row[key];
      next[key] = ((Math.abs(Number(row[key])) || 0) / total) * 100;
    });
    return next;
  });
}

/** Build waterfall-shaped data with invisible base bars. */
function toWaterfallData(data, valueKey) {
  let cumulative = 0;
  return data.map((row, idx) => {
    const value = Number(row[valueKey]) || 0;
    const isFirst = idx === 0;
    const isLast = idx === data.length - 1;

    if (isFirst) {
      cumulative = value;
      return { ...row, __base: 0, __value: value, __isTotal: true };
    }

    if (isLast) {
      return { ...row, __base: 0, __value: cumulative + value, __isTotal: true };
    }

    const base = value >= 0 ? cumulative : cumulative + value;
    cumulative += value;
    return { ...row, __base: base, __value: Math.abs(value), __isTotal: false, __rawValue: value };
  });
}

export function BarChart({
  variant = 'vertical',
  data = [],
  dataKeys = [],
  xAxisKey = 'name',
  colors,
  height = 300,
  title,
  subtitle,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  barRadius = 4,
  className,
  ...rest
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

  const palette = colors || SERIES_COLORS;
  const isHorizontal = variant === 'horizontal';
  const isStacked = variant === 'stacked' || variant === 'stacked-percent';
  const isMultiSeries = dataKeys.length > 1;
  const shouldShowLegend = showLegend && isMultiSeries;

  const axisProps = getAxisProps(isDark);
  const gridProps = getGridProps(isDark);
  const tooltipProps = getTooltipProps(isDark);
  const legendProps = getLegendProps(isDark);

  const verticalRadius = [barRadius, barRadius, 0, 0];
  const horizontalRadius = [0, barRadius, barRadius, 0];

  // --- Stacked-percent data transformation ---
  const percentData = useMemo(() => {
    if (variant !== 'stacked-percent') return null;
    return toPercentData(data, dataKeys);
  }, [variant, data, dataKeys]);

  // --- Waterfall data transformation ---
  const waterfallData = useMemo(() => {
    if (variant !== 'waterfall') return null;
    return toWaterfallData(data, dataKeys[0]);
  }, [variant, data, dataKeys]);

  // --- Diverging variant ---
  if (variant === 'diverging') {
    return (
      <ChartWrapper title={title} subtitle={subtitle} className={className}>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart data={data} {...rest}>
            {showGrid && <CartesianGrid {...gridProps} />}
            <XAxis dataKey={xAxisKey} {...axisProps} />
            <YAxis {...axisProps} />
            {showTooltip && <Tooltip {...tooltipProps} />}
            {shouldShowLegend && <Legend {...legendProps} />}
            <ReferenceLine y={0} stroke={isDark ? '#6b7280' : '#9ca3af'} />
            {dataKeys.map((key) => (
              <Bar key={key} dataKey={key} radius={verticalRadius}>
                {data.map((entry, idx) => {
                  const val = Number(entry[key]) || 0;
                  return (
                    <Cell
                      key={idx}
                      fill={val >= 0 ? CHART_COLORS.green[500] : CHART_COLORS.red[500]}
                    />
                  );
                })}
              </Bar>
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    );
  }

  // --- Waterfall variant ---
  if (variant === 'waterfall') {
    return (
      <ChartWrapper title={title} subtitle={subtitle} className={className}>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart data={waterfallData} {...rest}>
            {showGrid && <CartesianGrid {...gridProps} />}
            <XAxis dataKey={xAxisKey} {...axisProps} />
            <YAxis {...axisProps} />
            {showTooltip && (
              <Tooltip
                {...tooltipProps}
                formatter={(value, name) => {
                  if (name === '__base') return [null, null];
                  return [value, dataKeys[0]];
                }}
              />
            )}
            <Bar dataKey="__base" stackId="waterfall" fill="transparent" radius={0} />
            <Bar dataKey="__value" stackId="waterfall" radius={verticalRadius}>
              {waterfallData.map((entry, idx) => {
                let fill = CHART_COLORS.blue[500];
                if (!entry.__isTotal) {
                  fill = (entry.__rawValue ?? 0) >= 0
                    ? CHART_COLORS.green[500]
                    : CHART_COLORS.red[500];
                }
                return <Cell key={idx} fill={fill} />;
              })}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    );
  }

  // --- Stacked-percent variant ---
  if (variant === 'stacked-percent') {
    return (
      <ChartWrapper title={title} subtitle={subtitle} className={className}>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart data={percentData} {...rest}>
            {showGrid && <CartesianGrid {...gridProps} />}
            <XAxis dataKey={xAxisKey} {...axisProps} />
            <YAxis {...axisProps} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            {showTooltip && (
              <Tooltip
                {...tooltipProps}
                formatter={(value, name, props) => {
                  const raw = props.payload?.__raw?.[name];
                  if (raw !== undefined) {
                    return [`${raw} (${value.toFixed(1)}%)`, name];
                  }
                  return [`${value.toFixed(1)}%`, name];
                }}
              />
            )}
            {shouldShowLegend && <Legend {...legendProps} />}
            {dataKeys.map((key, i) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="stack"
                fill={palette[i % palette.length]}
                radius={
                  i === dataKeys.length - 1 ? verticalRadius : 0
                }
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    );
  }

  // --- Horizontal variant ---
  if (isHorizontal) {
    return (
      <ChartWrapper title={title} subtitle={subtitle} className={className}>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart data={data} layout="vertical" {...rest}>
            {showGrid && <CartesianGrid {...gridProps} horizontal={false} vertical />}
            <XAxis type="number" {...axisProps} />
            <YAxis type="category" dataKey={xAxisKey} {...axisProps} width={80} />
            {showTooltip && <Tooltip {...tooltipProps} />}
            {shouldShowLegend && <Legend {...legendProps} />}
            {dataKeys.map((key, i) => (
              <Bar
                key={key}
                dataKey={key}
                fill={palette[i % palette.length]}
                radius={horizontalRadius}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    );
  }

  // --- Vertical / Grouped / Stacked variants ---
  const stackId = isStacked ? 'stack' : undefined;

  return (
    <ChartWrapper title={title} subtitle={subtitle} className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={data} {...rest}>
          {showGrid && <CartesianGrid {...gridProps} />}
          <XAxis dataKey={xAxisKey} {...axisProps} />
          <YAxis {...axisProps} />
          {showTooltip && <Tooltip {...tooltipProps} />}
          {shouldShowLegend && <Legend {...legendProps} />}
          {dataKeys.map((key, i) => (
            <Bar
              key={key}
              dataKey={key}
              stackId={stackId}
              fill={palette[i % palette.length]}
              radius={
                isStacked
                  ? i === dataKeys.length - 1 ? verticalRadius : 0
                  : verticalRadius
              }
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
