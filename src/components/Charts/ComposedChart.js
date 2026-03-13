'use client';

import { useState, useEffect } from 'react';
import {
  ComposedChart as RechartsComposedChart,
  Bar,
  Line,
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

export const COMPOSED_CHART_VARIANTS = ['bar-line', 'bar-area', 'multi-axis'];

export function ComposedChart({
  variant = 'bar-line',
  data = [],
  barKeys = [],
  lineKeys = [],
  areaKeys = [],
  xAxisKey = 'name',
  colors,
  height = 300,
  title,
  subtitle,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  barRadius = 4,
  yAxisLabel,
  yAxisRightLabel,
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

  const axisProps = getAxisProps(isDark);
  const gridProps = getGridProps(isDark);
  const tooltipProps = getTooltipProps(isDark);
  const legendProps = getLegendProps(isDark);

  // Build a color lookup: index across all keys in render order
  const getColor = (index) => {
    if (colors && colors[index]) return colors[index];
    return SERIES_COLORS[index % SERIES_COLORS.length];
  };

  const renderBarLine = () => {
    // Bars use blue-500, lines use amber-500
    const barColor = (i) => (colors && colors[i]) ? colors[i] : CHART_COLORS.blue[500];
    const lineColor = (i) => {
      const offset = barKeys.length + i;
      return (colors && colors[offset]) ? colors[offset] : CHART_COLORS.amber[500];
    };

    return (
      <ResponsiveContainer width="100%" height={height}>
        <RechartsComposedChart data={data}>
          {showGrid && <CartesianGrid {...gridProps} />}
          <XAxis dataKey={xAxisKey} {...axisProps} />
          <YAxis
            yAxisId="left"
            {...axisProps}
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', style: { fill: axisProps.tick.fill, fontSize: 12 } } : undefined}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            {...axisProps}
            label={yAxisRightLabel ? { value: yAxisRightLabel, angle: 90, position: 'insideRight', style: { fill: axisProps.tick.fill, fontSize: 12 } } : undefined}
          />
          {showTooltip && <Tooltip {...tooltipProps} />}
          {showLegend && <Legend {...legendProps} />}
          {barKeys.map((key, i) => (
            <Bar
              key={key}
              dataKey={key}
              yAxisId="left"
              fill={barColor(i)}
              radius={[barRadius, barRadius, 0, 0]}
            />
          ))}
          {lineKeys.map((key, i) => (
            <Line
              key={key}
              dataKey={key}
              yAxisId="right"
              type="monotone"
              stroke={lineColor(i)}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          ))}
        </RechartsComposedChart>
      </ResponsiveContainer>
    );
  };

  const renderBarArea = () => {
    // Areas render first (behind), bars render on top. Single Y axis.
    let colorIndex = 0;

    return (
      <ResponsiveContainer width="100%" height={height}>
        <RechartsComposedChart data={data}>
          {showGrid && <CartesianGrid {...gridProps} />}
          <XAxis dataKey={xAxisKey} {...axisProps} />
          <YAxis
            {...axisProps}
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', style: { fill: axisProps.tick.fill, fontSize: 12 } } : undefined}
          />
          {showTooltip && <Tooltip {...tooltipProps} />}
          {showLegend && <Legend {...legendProps} />}
          {areaKeys.map((key) => {
            const c = getColor(colorIndex++);
            return (
              <Area
                key={key}
                dataKey={key}
                type="monotone"
                fill={c}
                stroke={c}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            );
          })}
          {barKeys.map((key) => {
            const c = getColor(colorIndex++);
            return (
              <Bar
                key={key}
                dataKey={key}
                fill={c}
                radius={[barRadius, barRadius, 0, 0]}
              />
            );
          })}
        </RechartsComposedChart>
      </ResponsiveContainer>
    );
  };

  const renderMultiAxis = () => {
    let colorIndex = 0;

    return (
      <ResponsiveContainer width="100%" height={height}>
        <RechartsComposedChart data={data}>
          {showGrid && <CartesianGrid {...gridProps} />}
          <XAxis dataKey={xAxisKey} {...axisProps} />
          <YAxis
            yAxisId="left"
            {...axisProps}
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', style: { fill: axisProps.tick.fill, fontSize: 12 } } : undefined}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            {...axisProps}
            label={yAxisRightLabel ? { value: yAxisRightLabel, angle: 90, position: 'insideRight', style: { fill: axisProps.tick.fill, fontSize: 12 } } : undefined}
          />
          {showTooltip && <Tooltip {...tooltipProps} />}
          {showLegend && <Legend {...legendProps} />}
          {areaKeys.map((key) => {
            const c = getColor(colorIndex++);
            return (
              <Area
                key={key}
                dataKey={key}
                yAxisId="left"
                type="monotone"
                fill={c}
                stroke={c}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            );
          })}
          {barKeys.map((key) => {
            const c = getColor(colorIndex++);
            return (
              <Bar
                key={key}
                dataKey={key}
                yAxisId="left"
                fill={c}
                radius={[barRadius, barRadius, 0, 0]}
              />
            );
          })}
          {lineKeys.map((key) => {
            const c = getColor(colorIndex++);
            return (
              <Line
                key={key}
                dataKey={key}
                yAxisId="right"
                type="monotone"
                stroke={c}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            );
          })}
        </RechartsComposedChart>
      </ResponsiveContainer>
    );
  };

  const renderChart = () => {
    switch (variant) {
      case 'bar-area':
        return renderBarArea();
      case 'multi-axis':
        return renderMultiAxis();
      case 'bar-line':
      default:
        return renderBarLine();
    }
  };

  return (
    <ChartWrapper title={title} subtitle={subtitle} className={className}>
      {renderChart()}
    </ChartWrapper>
  );
}
