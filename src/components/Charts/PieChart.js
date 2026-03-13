'use client';

import { useState, useEffect } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector,
} from 'recharts';
import {
  SERIES_COLORS,
  CHART_COLORS,
  getTooltipProps,
  getLegendProps,
  getIsDark,
  ChartWrapper,
} from './chartTheme';

export const PIE_CHART_VARIANTS = ['standard', 'donut', 'semi', 'nested'];

const RADIAN = Math.PI / 180;

/** Custom label renderer — shows percentage inside each slice. */
function renderCustomizedLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

/** Active shape renderer — slightly enlarged sector on hover. */
function renderActiveShape(props) {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      {innerRadius > 0 && (
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 2}
          outerRadius={innerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={0.3}
        />
      )}
    </g>
  );
}

export function PieChart({
  variant = 'standard',
  data = [],
  outerData = [],
  colors,
  height = 300,
  title,
  subtitle,
  showLegend = true,
  showTooltip = true,
  showLabels = false,
  centerLabel,
  centerValue,
  className = '',
}) {
  const [isDark, setIsDark] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

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

  const getColor = (index, paletteOverride) => {
    const p = paletteOverride || palette;
    return p[index % p.length];
  };

  const resolvedColors = data.map((entry, i) => entry.color || getColor(i));

  // Outer ring uses a shifted color range for visual distinction
  const outerPalette = [
    CHART_COLORS.blue[400],
    CHART_COLORS.teal[400],
    CHART_COLORS.purple[400],
    CHART_COLORS.amber[400],
    CHART_COLORS.red[400],
    CHART_COLORS.green[400],
    CHART_COLORS.blue[200],
    CHART_COLORS.teal[200],
    CHART_COLORS.purple[200],
    CHART_COLORS.amber[200],
  ];

  const resolvedOuterColors = outerData.map((entry, i) => entry.color || outerPalette[i % outerPalette.length]);

  const onPieEnter = (_, index) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(-1);

  /** Render center text for donut / semi variants. */
  const renderCenterText = (cx, cy) => {
    if (!centerValue && !centerLabel) return null;
    return (
      <g>
        {centerValue != null && (
          <text
            x={cx}
            y={centerLabel ? cy - 10 : cy}
            textAnchor="middle"
            dominantBaseline="central"
            fill={isDark ? '#f9fafb' : '#111827'}
            fontSize={24}
            fontWeight={700}
          >
            {centerValue}
          </text>
        )}
        {centerLabel && (
          <text
            x={cx}
            y={centerValue != null ? cy + 16 : cy}
            textAnchor="middle"
            dominantBaseline="central"
            fill={isDark ? '#9ca3af' : '#6b7280'}
            fontSize={12}
          >
            {centerLabel}
          </text>
        )}
      </g>
    );
  };

  const tooltipProps = getTooltipProps(isDark);
  const legendProps = getLegendProps(isDark);

  const renderChart = () => {
    // Center coordinates used for center text
    const cx = '50%';
    const cxNum = undefined; // let recharts compute
    const cyNum = variant === 'semi' ? height * 0.65 : undefined;
    const cyProp = variant === 'semi' ? cyNum : '50%';

    switch (variant) {
      case 'standard':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RechartsPieChart>
              <Pie
                data={data}
                cx={cx}
                cy="50%"
                outerRadius={100}
                dataKey="value"
                nameKey="name"
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                label={showLabels ? renderCustomizedLabel : false}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={resolvedColors[index]} />
                ))}
              </Pie>
              {showTooltip && <Tooltip {...tooltipProps} />}
              {showLegend && <Legend {...legendProps} />}
            </RechartsPieChart>
          </ResponsiveContainer>
        );

      case 'donut':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RechartsPieChart>
              <Pie
                data={data}
                cx={cx}
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                nameKey="name"
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                label={showLabels ? renderCustomizedLabel : false}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={resolvedColors[index]} />
                ))}
              </Pie>
              {renderCenterText('50%', height / 2 - (showLegend ? 15 : 0))}
              {showTooltip && <Tooltip {...tooltipProps} />}
              {showLegend && <Legend {...legendProps} />}
            </RechartsPieChart>
          </ResponsiveContainer>
        );

      case 'semi':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RechartsPieChart>
              <Pie
                data={data}
                cx={cx}
                cy={cyNum}
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                nameKey="name"
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                label={showLabels ? renderCustomizedLabel : false}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={resolvedColors[index]} />
                ))}
              </Pie>
              {renderCenterText('50%', cyNum)}
              {showTooltip && <Tooltip {...tooltipProps} />}
              {showLegend && <Legend {...legendProps} />}
            </RechartsPieChart>
          </ResponsiveContainer>
        );

      case 'nested':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RechartsPieChart>
              {/* Inner ring — primary data */}
              <Pie
                data={data}
                cx={cx}
                cy="50%"
                innerRadius={40}
                outerRadius={65}
                dataKey="value"
                nameKey="name"
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
              >
                {data.map((entry, index) => (
                  <Cell key={`inner-${index}`} fill={resolvedColors[index]} />
                ))}
              </Pie>
              {/* Outer ring — outerData */}
              <Pie
                data={outerData}
                cx={cx}
                cy="50%"
                innerRadius={75}
                outerRadius={100}
                dataKey="value"
                nameKey="name"
              >
                {outerData.map((entry, index) => (
                  <Cell key={`outer-${index}`} fill={resolvedOuterColors[index]} />
                ))}
              </Pie>
              {showTooltip && <Tooltip {...tooltipProps} />}
              {showLegend && <Legend {...legendProps} />}
            </RechartsPieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <ChartWrapper title={title} subtitle={subtitle} className={className}>
      {renderChart()}
    </ChartWrapper>
  );
}
