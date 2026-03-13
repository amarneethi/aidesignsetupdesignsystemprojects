'use client';

import { useState, useEffect } from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
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

export const AREA_CHART_VARIANTS = [
  'single',
  'stacked',
  'stacked-percent',
  'gradient',
  'range',
];

export function AreaChart({
  variant = 'single',
  data = [],
  dataKeys = [],
  xAxisKey = 'name',
  colors,
  height = 300,
  title,
  subtitle,
  showGrid = true,
  showLegend,
  showTooltip = true,
  strokeWidth = 2,
  rangeKeys,
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

  const isMultiSeries = dataKeys.length > 1;
  const legendVisible = showLegend !== undefined ? showLegend : isMultiSeries;
  const palette = colors || SERIES_COLORS;

  // Transform data for special variants
  const getChartData = () => {
    if (variant === 'stacked-percent') {
      return data.map((entry) => {
        const total = dataKeys.reduce((sum, key) => sum + (Number(entry[key]) || 0), 0);
        if (total === 0) return entry;
        const transformed = { ...entry };
        dataKeys.forEach((key) => {
          transformed[key] = ((Number(entry[key]) || 0) / total) * 100;
        });
        return transformed;
      });
    }
    if (variant === 'range' && rangeKeys) {
      // For stacked range, upper needs to be the delta (upper - lower)
      return data.map((entry) => ({
        ...entry,
        __rangeDelta: (Number(entry[rangeKeys.upper]) || 0) - (Number(entry[rangeKeys.lower]) || 0),
      }));
    }
    return data;
  };

  const chartData = getChartData();

  const renderDefs = () => {
    if (variant === 'single') {
      const color = palette[0];
      return (
        <defs>
          <linearGradient id="area-gradient-0" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
      );
    }

    if (variant === 'gradient') {
      const color = palette[0];
      return (
        <defs>
          <linearGradient id="area-gradient-prominent-0" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.6} />
            <stop offset="100%" stopColor={color} stopOpacity={0.05} />
          </linearGradient>
        </defs>
      );
    }

    return null;
  };

  const renderAreas = () => {
    if (variant === 'single') {
      const color = palette[0];
      const key = dataKeys[0];
      return (
        <Area
          type="monotone"
          dataKey={key}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="url(#area-gradient-0)"
        />
      );
    }

    if (variant === 'stacked' || variant === 'stacked-percent') {
      return dataKeys.map((key, index) => {
        const color = palette[index % palette.length];
        return (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stackId="stack"
            stroke={color}
            strokeWidth={strokeWidth}
            fill={color}
            fillOpacity={0.4}
          />
        );
      });
    }

    if (variant === 'gradient') {
      const color = palette[0];
      const key = dataKeys[0];
      return (
        <Area
          type="monotone"
          dataKey={key}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="url(#area-gradient-prominent-0)"
        />
      );
    }

    if (variant === 'range' && rangeKeys) {
      const color = palette[0];
      return (
        <>
          <Area
            type="monotone"
            dataKey={rangeKeys.lower}
            stackId="range"
            stroke="transparent"
            fill="transparent"
            fillOpacity={0}
          />
          <Area
            type="monotone"
            dataKey="__rangeDelta"
            stackId="range"
            stroke={color}
            strokeWidth={strokeWidth}
            fill={color}
            fillOpacity={0.2}
            name="Range"
          />
          {dataKeys[0] && (
            <Area
              type="monotone"
              dataKey={dataKeys[0]}
              stroke={CHART_COLORS.blue[600]}
              strokeWidth={strokeWidth}
              fill="none"
              dot={{ r: 3, fill: CHART_COLORS.blue[600] }}
              name={dataKeys[0]}
            />
          )}
        </>
      );
    }

    // Fallback: render each key as a separate area
    return dataKeys.map((key, index) => {
      const color = palette[index % palette.length];
      return (
        <Area
          key={key}
          type="monotone"
          dataKey={key}
          stroke={color}
          strokeWidth={strokeWidth}
          fill={color}
          fillOpacity={0.2}
        />
      );
    });
  };

  return (
    <ChartWrapper title={title} subtitle={subtitle} className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsAreaChart data={chartData}>
          {renderDefs()}
          {showGrid && <CartesianGrid {...getGridProps(isDark)} />}
          <XAxis dataKey={xAxisKey} {...getAxisProps(isDark)} />
          <YAxis
            {...getAxisProps(isDark)}
            {...(variant === 'stacked-percent' ? { domain: [0, 100], tickFormatter: (v) => `${v}%` } : {})}
          />
          {showTooltip && (
            <Tooltip
              {...getTooltipProps(isDark)}
              {...(variant === 'stacked-percent'
                ? { formatter: (value) => `${value.toFixed(1)}%` }
                : {})}
            />
          )}
          {legendVisible && <Legend {...getLegendProps(isDark)} />}
          {renderAreas()}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
