'use client';

import { useState, useEffect } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
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

export const LINE_CHART_VARIANTS = [
  'single',
  'multi',
  'stepped',
  'dashed-target',
  'with-threshold',
];

const DOT_PROPS = { r: 3 };
const ACTIVE_DOT_PROPS = { r: 5, strokeWidth: 2 };

export function LineChart({
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
  showDots = true,
  strokeWidth = 2,
  thresholdValue,
  thresholdLabel = 'Threshold',
  targetKey,
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

  const resolvedTargetKey = targetKey || dataKeys[dataKeys.length - 1];

  const getLineType = () => {
    if (variant === 'stepped') return 'stepAfter';
    return 'monotone';
  };

  const renderLines = () =>
    dataKeys.map((key, index) => {
      const color = palette[index % palette.length];
      const isDashed =
        variant === 'dashed-target' && key === resolvedTargetKey;

      return (
        <Line
          key={key}
          type={getLineType()}
          dataKey={key}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={isDashed ? '8 4' : undefined}
          strokeOpacity={isDashed ? 0.6 : 1}
          dot={showDots ? DOT_PROPS : false}
          activeDot={showDots ? ACTIVE_DOT_PROPS : false}
        />
      );
    });

  return (
    <ChartWrapper title={title} subtitle={subtitle} className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data}>
          {showGrid && <CartesianGrid {...getGridProps(isDark)} />}
          <XAxis dataKey={xAxisKey} {...getAxisProps(isDark)} />
          <YAxis {...getAxisProps(isDark)} />
          {showTooltip && <Tooltip {...getTooltipProps(isDark)} />}
          {legendVisible && <Legend {...getLegendProps(isDark)} />}

          {variant === 'with-threshold' && thresholdValue != null && (
            <ReferenceLine
              y={thresholdValue}
              stroke={CHART_COLORS.red[400]}
              strokeDasharray="6 3"
              label={{
                value: thresholdLabel,
                position: 'insideTopRight',
                fill: CHART_COLORS.red[400],
                fontSize: 12,
              }}
            />
          )}

          {renderLines()}
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
