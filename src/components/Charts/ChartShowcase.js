'use client';

import  {BarChart}  from './BarChart';
import { LineChart } from './LineChart';
import { AreaChart } from './AreaChart';
import { PieChart } from './PieChart';
import { ComposedChart } from './ComposedChart';
import { RadialChart } from './RadialChart';

// ── Sample data ──────────────────────────────────────────────

const MONTHLY_REVENUE = [
  { name: 'Jan', revenue: 4200, expenses: 2400, profit: 1800 },
  { name: 'Feb', revenue: 3800, expenses: 2210, profit: 1590 },
  { name: 'Mar', revenue: 5100, expenses: 2900, profit: 2200 },
  { name: 'Apr', revenue: 4600, expenses: 2700, profit: 1900 },
  { name: 'May', revenue: 5400, expenses: 3100, profit: 2300 },
  { name: 'Jun', revenue: 6200, expenses: 3400, profit: 2800 },
];

const REPS_DATA = [
  { name: 'Alice', closed: 34, pipeline: 22 },
  { name: 'Bob', closed: 28, pipeline: 18 },
  { name: 'Carol', closed: 45, pipeline: 30 },
  { name: 'Dave', closed: 19, pipeline: 25 },
  { name: 'Eve', closed: 38, pipeline: 20 },
];

const DIVERGING_DATA = [
  { name: 'Q1', value: 12 },
  { name: 'Q2', value: -5 },
  { name: 'Q3', value: 8 },
  { name: 'Q4', value: -3 },
  { name: 'Q5', value: 15 },
  { name: 'Q6', value: -8 },
];

const WATERFALL_DATA = [
  { name: 'Start', value: 100 },
  { name: 'Sales', value: 40 },
  { name: 'Returns', value: -15 },
  { name: 'Opex', value: -30 },
  { name: 'Tax', value: -12 },
  { name: 'End', value: 83 },
];

const TREND_DATA = [
  { name: 'Week 1', users: 1200, sessions: 3400, actual: 1200, target: 1500 },
  { name: 'Week 2', users: 1350, sessions: 3900, actual: 1350, target: 1500 },
  { name: 'Week 3', users: 1100, sessions: 3100, actual: 1100, target: 1500 },
  { name: 'Week 4', users: 1580, sessions: 4200, actual: 1580, target: 1500 },
  { name: 'Week 5', users: 1420, sessions: 3800, actual: 1420, target: 1500 },
  { name: 'Week 6', users: 1700, sessions: 4800, actual: 1700, target: 1500 },
  { name: 'Week 7', users: 1650, sessions: 4500, actual: 1650, target: 1500 },
  { name: 'Week 8', users: 1900, sessions: 5100, actual: 1900, target: 1500 },
];

const STEPPED_DATA = [
  { name: 'Jan', tier: 1 },
  { name: 'Feb', tier: 1 },
  { name: 'Mar', tier: 2 },
  { name: 'Apr', tier: 2 },
  { name: 'May', tier: 2 },
  { name: 'Jun', tier: 3 },
  { name: 'Jul', tier: 3 },
  { name: 'Aug', tier: 4 },
];

const AREA_VOLUME = [
  { name: 'Mon', tickets: 42 },
  { name: 'Tue', tickets: 58 },
  { name: 'Wed', tickets: 35 },
  { name: 'Thu', tickets: 74 },
  { name: 'Fri', tickets: 63 },
  { name: 'Sat', tickets: 21 },
  { name: 'Sun', tickets: 15 },
];

const AREA_STACKED = [
  { name: 'Jan', organic: 400, paid: 240, referral: 180 },
  { name: 'Feb', organic: 300, paid: 310, referral: 200 },
  { name: 'Mar', organic: 500, paid: 280, referral: 220 },
  { name: 'Apr', organic: 450, paid: 350, referral: 190 },
  { name: 'May', organic: 600, paid: 400, referral: 250 },
  { name: 'Jun', organic: 550, paid: 380, referral: 300 },
];

const RANGE_DATA = [
  { name: 'Mon', upper: 85, lower: 60, avg: 72 },
  { name: 'Tue', upper: 88, lower: 65, avg: 76 },
  { name: 'Wed', upper: 82, lower: 55, avg: 68 },
  { name: 'Thu', upper: 90, lower: 70, avg: 80 },
  { name: 'Fri', upper: 86, lower: 62, avg: 74 },
  { name: 'Sat', upper: 78, lower: 50, avg: 64 },
  { name: 'Sun', upper: 75, lower: 48, avg: 62 },
];

const PIE_DATA = [
  { name: 'Enterprise', value: 45 },
  { name: 'Pro', value: 30 },
  { name: 'Starter', value: 15 },
  { name: 'Free', value: 10 },
];

const PIE_OUTER_DATA = [
  { name: 'Enterprise', value: 40 },
  { name: 'Pro', value: 35 },
  { name: 'Starter', value: 18 },
  { name: 'Free', value: 7 },
];

const LEAD_SOURCE = [
  { name: 'Organic', value: 35 },
  { name: 'Paid Ads', value: 25 },
  { name: 'Referral', value: 20 },
  { name: 'Social', value: 12 },
  { name: 'Direct', value: 8 },
];

const COMPOSED_DATA = [
  { name: 'Jan', revenue: 42000, margin: 32 },
  { name: 'Feb', revenue: 38000, margin: 28 },
  { name: 'Mar', revenue: 51000, margin: 35 },
  { name: 'Apr', revenue: 46000, margin: 30 },
  { name: 'May', revenue: 54000, margin: 38 },
  { name: 'Jun', revenue: 62000, margin: 42 },
];

const RADAR_DATA = [
  { subject: 'Reliability', product: 90, benchmark: 70 },
  { subject: 'Speed', product: 75, benchmark: 80 },
  { subject: 'Security', product: 95, benchmark: 75 },
  { subject: 'UX', product: 80, benchmark: 85 },
  { subject: 'Support', product: 70, benchmark: 65 },
  { subject: 'Price', product: 60, benchmark: 55 },
];

const MULTI_RING_DATA = [
  { name: 'Revenue', value: 85, fill: '#3b82f6' },
  { name: 'Pipeline', value: 62, fill: '#14b8a6' },
  { name: 'Retention', value: 93, fill: '#a855f7' },
];

// ── Showcase Component ───────────────────────────────────────

export default function ChartShowcase() {
  return (
    <>
      {/* ── BAR CHARTS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <BarChart
          variant="vertical"
          data={MONTHLY_REVENUE}
          dataKeys={['revenue']}
          title="bar/vertical"
          subtitle="Monthly revenue — single series"
          height={260}
        />
        <BarChart
          variant="horizontal"
          data={REPS_DATA}
          dataKeys={['closed']}
          title="bar/horizontal"
          subtitle="Deals closed by rep"
          height={260}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <BarChart
          variant="grouped"
          data={REPS_DATA}
          dataKeys={['closed', 'pipeline']}
          title="bar/grouped"
          subtitle="Closed vs pipeline by rep"
          height={260}
        />
        <BarChart
          variant="stacked"
          data={MONTHLY_REVENUE}
          dataKeys={['expenses', 'profit']}
          title="bar/stacked"
          subtitle="Expense + profit composition"
          height={260}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <BarChart
          variant="stacked-percent"
          data={MONTHLY_REVENUE}
          dataKeys={['expenses', 'profit']}
          title="bar/stacked-percent"
          subtitle="Normalized to 100%"
          height={260}
        />
        <BarChart
          variant="diverging"
          data={DIVERGING_DATA}
          dataKeys={['value']}
          title="bar/diverging"
          subtitle="Gain / loss from zero baseline"
          height={260}
        />
        <BarChart
          variant="waterfall"
          data={WATERFALL_DATA}
          dataKeys={['value']}
          title="bar/waterfall"
          subtitle="Value build-up breakdown"
          height={260}
        />
      </div>

      {/* ── LINE CHARTS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <LineChart
          variant="single"
          data={TREND_DATA}
          dataKeys={['users']}
          title="line/single"
          subtitle="Weekly active users"
          height={260}
        />
        <LineChart
          variant="multi"
          data={TREND_DATA}
          dataKeys={['users', 'sessions']}
          title="line/multi"
          subtitle="Users vs sessions over time"
          height={260}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <LineChart
          variant="stepped"
          data={STEPPED_DATA}
          dataKeys={['tier']}
          title="line/stepped"
          subtitle="Plan tier changes"
          height={260}
        />
        <LineChart
          variant="dashed-target"
          data={TREND_DATA}
          dataKeys={['actual', 'target']}
          targetKey="target"
          title="line/dashed-target"
          subtitle="Actual vs target"
          height={260}
        />
        <LineChart
          variant="with-threshold"
          data={TREND_DATA}
          dataKeys={['users']}
          thresholdValue={1500}
          thresholdLabel="SLA Target"
          title="line/with-threshold"
          subtitle="Users with SLA threshold"
          height={260}
        />
      </div>

      {/* ── AREA CHARTS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <AreaChart
          variant="single"
          data={AREA_VOLUME}
          dataKeys={['tickets']}
          title="area/single"
          subtitle="Support ticket volume"
          height={260}
        />
        <AreaChart
          variant="gradient"
          data={AREA_VOLUME}
          dataKeys={['tickets']}
          title="area/gradient"
          subtitle="Ticket volume with gradient fill"
          height={260}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <AreaChart
          variant="stacked"
          data={AREA_STACKED}
          dataKeys={['organic', 'paid', 'referral']}
          title="area/stacked"
          subtitle="Traffic by source"
          height={260}
        />
        <AreaChart
          variant="stacked-percent"
          data={AREA_STACKED}
          dataKeys={['organic', 'paid', 'referral']}
          title="area/stacked-percent"
          subtitle="Share of traffic (100%)"
          height={260}
        />
        <AreaChart
          variant="range"
          data={RANGE_DATA}
          dataKeys={['avg']}
          rangeKeys={{ upper: 'upper', lower: 'lower' }}
          title="area/range"
          subtitle="Confidence interval band"
          height={260}
        />
      </div>

      {/* ── PIE / DONUT CHARTS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <PieChart
          variant="standard"
          data={PIE_DATA}
          title="pie/standard"
          subtitle="Plan distribution"
          height={260}
          showLabels
        />
        <PieChart
          variant="donut"
          data={PIE_DATA}
          title="pie/donut"
          subtitle="With center metric"
          height={260}
          centerValue="$1.2M"
          centerLabel="ARR"
        />
        <PieChart
          variant="semi"
          data={LEAD_SOURCE}
          title="pie/semi"
          subtitle="Lead source split"
          height={260}
          centerValue="4,280"
          centerLabel="Leads"
        />
        <PieChart
          variant="nested"
          data={PIE_DATA}
          outerData={PIE_OUTER_DATA}
          title="pie/nested"
          subtitle="This Q vs last Q"
          height={260}
        />
      </div>

      {/* ── COMPOSED CHARTS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <ComposedChart
          variant="bar-line"
          data={COMPOSED_DATA}
          barKeys={['revenue']}
          lineKeys={['margin']}
          title="composed/bar-line"
          subtitle="Revenue bars + margin % line"
          height={280}
        />
        <ComposedChart
          variant="bar-area"
          data={MONTHLY_REVENUE}
          barKeys={['profit']}
          areaKeys={['revenue']}
          title="composed/bar-area"
          subtitle="Profit bars over revenue backdrop"
          height={280}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <ComposedChart
          variant="multi-axis"
          data={COMPOSED_DATA}
          barKeys={['revenue']}
          lineKeys={['margin']}
          title="composed/multi-axis"
          subtitle="Independent Y-axes — revenue (left) and margin % (right)"
          height={280}
          yAxisLabel="Revenue ($)"
          yAxisRightLabel="Margin %"
        />
      </div>

      {/* ── RADIAL / GAUGE CHARTS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <RadialChart
          variant="gauge"
          value={73}
          title="radial/gauge"
          subtitle="Quota attainment"
          label="Quota"
          height={240}
        />
        <RadialChart
          variant="progress"
          value={68}
          title="radial/progress"
          subtitle="Sprint completion"
          label="Complete"
          height={240}
        />
        <RadialChart
          variant="multi-ring"
          data={MULTI_RING_DATA}
          title="radial/multi-ring"
          subtitle="KPI dashboard rings"
          height={240}
          showLegend
        />
        <RadialChart
          variant="radar"
          data={RADAR_DATA}
          dataKeys={['product', 'benchmark']}
          title="radial/radar"
          subtitle="Feature coverage"
          height={240}
          showLegend
        />
      </div>
    </>
  );
}
