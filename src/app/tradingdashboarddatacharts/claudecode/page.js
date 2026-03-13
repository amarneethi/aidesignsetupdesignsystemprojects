'use client';

import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  RefreshCw,
} from 'lucide-react';
import KpiCard from '@/components/KpiCard/KpiCard';
import DataTable from '@/components/DataTable/DataTable';
import {Tabs, Tag} from '@/components';
import { AreaChart, PieChart, BarChart, LineChart } from '@/components/Charts';

/* ──────────────────── Mock Data ──────────────────── */

const portfolioPerformance = [
  { date: 'Jan', value: 124500, benchmark: 120000 },
  { date: 'Feb', value: 128300, benchmark: 122400 },
  { date: 'Mar', value: 125100, benchmark: 121800 },
  { date: 'Apr', value: 131700, benchmark: 125600 },
  { date: 'May', value: 136200, benchmark: 128100 },
  { date: 'Jun', value: 133800, benchmark: 127500 },
  { date: 'Jul', value: 139400, benchmark: 130200 },
  { date: 'Aug', value: 142100, benchmark: 132800 },
  { date: 'Sep', value: 138600, benchmark: 131400 },
  { date: 'Oct', value: 145300, benchmark: 134700 },
  { date: 'Nov', value: 151200, benchmark: 137900 },
  { date: 'Dec', value: 156847, benchmark: 140200 },
];

const allocationData = [
  { name: 'US Equities', value: 45 },
  { name: 'Int\'l Equities', value: 20 },
  { name: 'Fixed Income', value: 15 },
  { name: 'Crypto', value: 10 },
  { name: 'Commodities', value: 5 },
  { name: 'Cash', value: 5 },
];

const sectorData = [
  { name: 'Technology', weight: 32, return: 18.4 },
  { name: 'Healthcare', weight: 18, return: 12.1 },
  { name: 'Financials', weight: 14, return: 9.8 },
  { name: 'Consumer', weight: 12, return: 7.2 },
  { name: 'Energy', weight: 10, return: -3.5 },
  { name: 'Industrials', weight: 8, return: 5.1 },
  { name: 'Real Estate', weight: 6, return: -1.2 },
];

const holdings = [
  { id: 1, symbol: 'AAPL', name: 'Apple Inc.', shares: 150, avgCost: 142.30, price: 178.72, change: 2.34, changePercent: 1.33, marketValue: 26808.00, gain: 5463.00, gainPercent: 25.60 },
  { id: 2, symbol: 'MSFT', name: 'Microsoft Corp.', shares: 80, avgCost: 285.50, price: 378.91, change: -1.22, changePercent: -0.32, marketValue: 30312.80, gain: 7472.80, gainPercent: 32.72 },
  { id: 3, symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 60, avgCost: 118.75, price: 141.80, change: 0.95, changePercent: 0.67, marketValue: 8508.00, gain: 1383.00, gainPercent: 19.42 },
  { id: 4, symbol: 'AMZN', name: 'Amazon.com Inc.', shares: 100, avgCost: 128.40, price: 178.25, change: 3.12, changePercent: 1.78, marketValue: 17825.00, gain: 4985.00, gainPercent: 38.83 },
  { id: 5, symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 45, avgCost: 425.60, price: 721.33, change: 12.45, changePercent: 1.76, marketValue: 32459.85, gain: 13307.85, gainPercent: 69.49 },
  { id: 6, symbol: 'TSLA', name: 'Tesla Inc.', shares: 70, avgCost: 242.15, price: 248.42, change: -4.87, changePercent: -1.92, marketValue: 17389.40, gain: 438.90, gainPercent: 2.59 },
  { id: 7, symbol: 'JPM', name: 'JPMorgan Chase', shares: 55, avgCost: 148.20, price: 195.67, change: 1.05, changePercent: 0.54, marketValue: 10761.85, gain: 2610.85, gainPercent: 32.03 },
  { id: 8, symbol: 'V', name: 'Visa Inc.', shares: 40, avgCost: 228.90, price: 275.83, change: 0.78, changePercent: 0.28, marketValue: 11033.20, gain: 1877.20, gainPercent: 20.51 },
  { id: 9, symbol: 'BTC', name: 'Bitcoin', shares: 0.25, avgCost: 38200.00, price: 67450.00, change: 1250.00, changePercent: 1.89, marketValue: 16862.50, gain: 7312.50, gainPercent: 76.57 },
  { id: 10, symbol: 'ETH', name: 'Ethereum', shares: 3.5, avgCost: 2100.00, price: 3520.00, change: -45.00, changePercent: -1.26, marketValue: 12320.00, gain: 4970.00, gainPercent: 67.62 },
];

const recentTrades = [
  { id: 1, date: '2026-03-13', time: '10:32 AM', symbol: 'NVDA', side: 'Buy', qty: 10, price: 718.50, total: 7185.00, status: 'Filled' },
  { id: 2, date: '2026-03-13', time: '09:45 AM', symbol: 'AAPL', side: 'Buy', qty: 25, price: 177.20, total: 4430.00, status: 'Filled' },
  { id: 3, date: '2026-03-12', time: '03:15 PM', symbol: 'TSLA', side: 'Sell', qty: 15, price: 252.30, total: 3784.50, status: 'Filled' },
  { id: 4, date: '2026-03-12', time: '11:20 AM', symbol: 'BTC', side: 'Buy', qty: 0.05, price: 66200.00, total: 3310.00, status: 'Filled' },
  { id: 5, date: '2026-03-11', time: '02:50 PM', symbol: 'MSFT', side: 'Sell', qty: 10, price: 380.15, total: 3801.50, status: 'Filled' },
  { id: 6, date: '2026-03-11', time: '10:05 AM', symbol: 'GOOGL', side: 'Buy', qty: 20, price: 140.85, total: 2817.00, status: 'Filled' },
  { id: 7, date: '2026-03-10', time: '01:30 PM', symbol: 'V', side: 'Buy', qty: 15, price: 274.50, total: 4117.50, status: 'Filled' },
  { id: 8, date: '2026-03-10', time: '09:35 AM', symbol: 'JPM', side: 'Buy', qty: 20, price: 194.60, total: 3892.00, status: 'Filled' },
];

const weeklyPnL = [
  { day: 'Mon', pnl: 1240 },
  { day: 'Tue', pnl: -680 },
  { day: 'Wed', pnl: 2150 },
  { day: 'Thu', pnl: 890 },
  { day: 'Fri', pnl: -320 },
];

/* ──────────────────── Formatters ──────────────────── */

function fmt(n, opts = {}) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', ...opts }).format(n);
}

function fmtCompact(n) {
  if (Math.abs(n) >= 1000) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(n);
  }
  return fmt(n);
}

/* ──────────────────── Column Defs ──────────────────── */

const holdingsColumns = [
  {
    key: 'symbol',
    header: 'Symbol',
    width: '100px',
    render: (val, row) => (
      <div>
        <span className="font-semibold" style={{ color: 'var(--ds-text-brand)' }}>{val}</span>
        <p className="text-[length:var(--ds-text-xs)] mt-0.5" style={{ color: 'var(--ds-text-tertiary)' }}>{row.name}</p>
      </div>
    ),
  },
  {
    key: 'shares',
    header: 'Shares',
    width: '80px',
    render: (val) => <span>{val.toLocaleString()}</span>,
  },
  {
    key: 'avgCost',
    header: 'Avg Cost',
    width: '100px',
    render: (val) => <span>{fmt(val)}</span>,
  },
  {
    key: 'price',
    header: 'Price',
    width: '100px',
    render: (val) => <span className="font-medium">{fmt(val)}</span>,
  },
  {
    key: 'change',
    header: 'Change',
    width: '120px',
    render: (val, row) => (
      <span className="inline-flex items-center gap-1" style={{ color: val >= 0 ? 'var(--ds-text-success)' : 'var(--ds-text-danger)' }}>
        {val >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {fmt(Math.abs(val))} ({Math.abs(row.changePercent).toFixed(2)}%)
      </span>
    ),
  },
  {
    key: 'marketValue',
    header: 'Mkt Value',
    width: '120px',
    render: (val) => <span className="font-medium">{fmt(val)}</span>,
  },
  {
    key: 'gain',
    header: 'Total Gain',
    width: '140px',
    render: (val, row) => (
      <div>
        <span className="font-medium" style={{ color: val >= 0 ? 'var(--ds-text-success)' : 'var(--ds-text-danger)' }}>
          {val >= 0 ? '+' : ''}{fmt(val)}
        </span>
        <span className="ml-1 text-[length:var(--ds-text-xs)]" style={{ color: val >= 0 ? 'var(--ds-text-success)' : 'var(--ds-text-danger)' }}>
          ({val >= 0 ? '+' : ''}{row.gainPercent.toFixed(2)}%)
        </span>
      </div>
    ),
  },
];

const tradesColumns = [
  {
    key: 'date',
    header: 'Date',
    width: '110px',
    render: (val, row) => (
      <div>
        <span>{val}</span>
        <p className="text-[length:var(--ds-text-xs)]" style={{ color: 'var(--ds-text-tertiary)' }}>{row.time}</p>
      </div>
    ),
  },
  {
    key: 'symbol',
    header: 'Symbol',
    width: '80px',
    render: (val) => <span className="font-semibold" style={{ color: 'var(--ds-text-brand)' }}>{val}</span>,
  },
  {
    key: 'side',
    header: 'Side',
    width: '80px',
    render: (val) => (
      <Tag color={val === 'Buy' ? 'success' : 'danger'} size="sm">{val}</Tag>
    ),
  },
  {
    key: 'qty',
    header: 'Qty',
    width: '60px',
    render: (val) => <span>{val.toLocaleString()}</span>,
  },
  {
    key: 'price',
    header: 'Price',
    width: '100px',
    render: (val) => <span>{fmt(val)}</span>,
  },
  {
    key: 'total',
    header: 'Total',
    width: '100px',
    render: (val) => <span className="font-medium">{fmt(val)}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    width: '80px',
    render: (val) => <Tag color="brand" size="sm">{val}</Tag>,
  },
];

/* ──────────────────── Dashboard Component ──────────────────── */

export default function TradingDashboard() {
  const [activeTab, setActiveTab] = useState('holdings');

  const totalValue = 156847.23;
  const dayPnl = 2847.56;
  const dayPnlPercent = 1.85;
  const totalReturn = 32347.23;
  const totalReturnPercent = 25.98;
  const buyingPower = 43152.77;

  const sparkTrend = [124.5, 128.3, 125.1, 131.7, 136.2, 133.8, 139.4, 142.1, 138.6, 145.3, 151.2, 156.8];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--ds-bg-secondary)' }}
    >
      {/* Header Bar */}
      <header
        className="border-b px-6 py-4"
        style={{
          backgroundColor: 'var(--ds-bg-primary)',
          borderColor: 'var(--ds-border-primary)',
        }}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-[var(--ds-radius-md)] flex items-center justify-center"
              style={{ backgroundColor: 'var(--ds-bg-brand)', color: 'var(--ds-text-on-brand)' }}
            >
              <BarChart3 size={20} />
            </div>
            <div>
              <h1
                className="text-[length:var(--ds-text-lg)] font-bold leading-tight"
                style={{ color: 'var(--ds-text-primary)' }}
              >
                Trading Dashboard
              </h1>
              <p
                className="text-[length:var(--ds-text-xs)]"
                style={{ color: 'var(--ds-text-tertiary)' }}
              >
                Personal Brokerage Account
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span
              className="inline-flex items-center gap-1.5 text-[length:var(--ds-text-xs)]"
              style={{ color: 'var(--ds-text-tertiary)' }}
            >
              <Clock size={13} />
              Last updated: Mar 13, 2026 · 10:45 AM EST
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--ds-radius-md)] text-[length:var(--ds-text-xs)] font-medium cursor-pointer transition-colors"
              style={{
                backgroundColor: 'var(--ds-bg-tertiary)',
                color: 'var(--ds-text-primary)',
                border: '1px solid var(--ds-border-primary)',
              }}
            >
              <RefreshCw size={13} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            variant="with-trend"
            label="Portfolio Value"
            value={fmt(totalValue)}
            trendData={sparkTrend}
            trendColor="var(--ds-text-brand)"
          />
          <KpiCard
            variant="with-delta"
            label="Today's P&L"
            value={fmt(dayPnl)}
            delta={dayPnlPercent}
            deltaFormat="percentage"
            deltaLabel="vs previous close"
          />
          <KpiCard
            variant="with-icon"
            label="Total Return"
            value={`+${fmt(totalReturn)}`}
            icon={<TrendingUp size={20} />}
            iconColor="var(--ds-text-success)"
          />
          <KpiCard
            variant="with-icon"
            label="Buying Power"
            value={fmt(buyingPower)}
            icon={<Wallet size={20} />}
            iconColor="var(--ds-text-info)"
          />
        </div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Portfolio Performance */}
          <div className="lg:col-span-2">
            <AreaChart
              variant="single"
              data={portfolioPerformance}
              dataKeys={['value']}
              xAxisKey="date"
              height={320}
              title="Portfolio Performance"
              subtitle="12-month portfolio value"
              showLegend={false}
              showTooltip
            />
          </div>

          {/* Asset Allocation */}
          <div>
            <PieChart
              variant="donut"
              data={allocationData}
              height={320}
              title="Asset Allocation"
              subtitle="By asset class"
              showLegend
              centerLabel="Total"
              centerValue={fmt(totalValue, { maximumFractionDigits: 0 })}
            />
          </div>
        </div>

        {/* ── Charts Row 2 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Sector Breakdown */}
          <BarChart
            variant="horizontal"
            data={sectorData}
            dataKeys={['weight']}
            xAxisKey="name"
            height={280}
            title="Sector Allocation"
            subtitle="Portfolio weight by sector"
            showLegend={false}
            showTooltip
          />

          {/* Weekly P&L */}
          <BarChart
            variant="vertical"
            data={weeklyPnL}
            dataKeys={['pnl']}
            xAxisKey="day"
            height={280}
            title="Weekly P&L"
            subtitle="Daily profit & loss this week"
            showLegend={false}
            showTooltip
          />
        </div>

        {/* ── Data Tables ── */}
        <div
          className="rounded-[var(--ds-radius-lg)] border overflow-hidden"
          style={{
            backgroundColor: 'var(--ds-bg-primary)',
            borderColor: 'var(--ds-border-primary)',
          }}
        >
          <Tabs
            tabs={[
              {
                id: 'holdings',
                label: 'Holdings',
                badge: holdings.length,
                content: (
                  <DataTable
                    columns={holdingsColumns}
                    data={holdings}
                    sortable
                    defaultSortColumn="marketValue"
                    defaultSortDirection="desc"
                    compact
                    striped
                  />
                ),
              },
              {
                id: 'trades',
                label: 'Recent Trades',
                badge: recentTrades.length,
                content: (
                  <DataTable
                    columns={tradesColumns}
                    data={recentTrades}
                    sortable
                    defaultSortColumn="date"
                    defaultSortDirection="desc"
                    compact
                    striped
                  />
                ),
              },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="underline"
            className="px-4 pt-4"
          />
        </div>

        {/* ── Top Movers ── */}
        <div
          className="rounded-[var(--ds-radius-lg)] border p-4"
          style={{
            backgroundColor: 'var(--ds-bg-primary)',
            borderColor: 'var(--ds-border-primary)',
          }}
        >
          <h3
            className="text-[length:var(--ds-text-sm)] font-semibold mb-3"
            style={{ color: 'var(--ds-text-primary)' }}
          >
            Today&apos;s Top Movers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {holdings
              .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
              .slice(0, 5)
              .map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between p-3 rounded-[var(--ds-radius-md)]"
                  style={{ backgroundColor: 'var(--ds-bg-secondary)' }}
                >
                  <div>
                    <span className="text-[length:var(--ds-text-sm)] font-semibold" style={{ color: 'var(--ds-text-primary)' }}>
                      {h.symbol}
                    </span>
                    <p className="text-[length:var(--ds-text-xs)]" style={{ color: 'var(--ds-text-tertiary)' }}>
                      {fmt(h.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className="inline-flex items-center gap-0.5 text-[length:var(--ds-text-sm)] font-semibold"
                      style={{ color: h.changePercent >= 0 ? 'var(--ds-text-success)' : 'var(--ds-text-danger)' }}
                    >
                      {h.changePercent >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {Math.abs(h.changePercent).toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}
