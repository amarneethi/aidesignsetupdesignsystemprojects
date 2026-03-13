'use client';
import { useState } from 'react';
import {
  Header, SideNav, Button, Tag, DataTable, Tabs, Dropdown,
  KpiCard, Notification, Banner, Search, OverflowMenu, Modal,
  BarChart, LineChart, AreaChart, PieChart, ComposedChart, RadialChart,
  ActivityFeed, RankedList, NotificationList, ChartWrapper,
  Form, FormGroup, FormRow, FormActions, TextInput, Select,
} from '@/components';
import {
  Home, TrendingUp, Wallet, BarChart3, PieChart as PieIcon,
  ArrowUpRight, ArrowDownRight, Activity, Bell, Settings,
  Layers, CandlestickChart, Globe, Eye,
  ArrowRightLeft, Download, Star, Briefcase,
  DollarSign, Shield, LineChart as LineIcon, Clock,
  Edit, Trash2, Copy, ExternalLink,
} from 'lucide-react';

/* ─────────────────── Mock Data ─────────────────── */

const portfolioPerformance = [
  { date: 'Oct', portfolio: 124300, benchmark: 121000 },
  { date: 'Nov', portfolio: 131800, benchmark: 125400 },
  { date: 'Dec', portfolio: 128200, benchmark: 123800 },
  { date: 'Jan', portfolio: 136700, benchmark: 128900 },
  { date: 'Feb', portfolio: 142100, benchmark: 132600 },
  { date: 'Mar', portfolio: 148950, benchmark: 135200 },
];

const sectorAllocation = [
  { name: 'Technology', value: 34 },
  { name: 'Healthcare', value: 18 },
  { name: 'Financials', value: 15 },
  { name: 'Energy', value: 12 },
  { name: 'Consumer', value: 11 },
  { name: 'Other', value: 10 },
];

const monthlyReturns = [
  { month: 'Oct', return: 3.2, spReturn: 2.1 },
  { month: 'Nov', return: 6.0, spReturn: 3.6 },
  { month: 'Dec', return: -2.7, spReturn: -1.3 },
  { month: 'Jan', return: 6.6, spReturn: 4.1 },
  { month: 'Feb', return: 3.9, spReturn: 2.9 },
  { month: 'Mar', return: 4.8, spReturn: 2.0 },
];

const volumeData = [
  { day: 'Mon', buys: 12400, sells: 8200 },
  { day: 'Tue', buys: 9800, sells: 11300 },
  { day: 'Wed', buys: 15600, sells: 7400 },
  { day: 'Thu', buys: 11200, sells: 9800 },
  { day: 'Fri', buys: 18300, sells: 12100 },
];

const holdings = [
  { id: 1, symbol: 'AAPL', name: 'Apple Inc.', shares: 45, avgCost: '$178.20', current: '$218.47', change: '+2.14%', pnl: '+$1,812', allocation: '14.2%' },
  { id: 2, symbol: 'NVDA', name: 'NVIDIA Corp', shares: 22, avgCost: '$485.30', current: '$892.15', change: '+3.87%', pnl: '+$8,951', allocation: '12.8%' },
  { id: 3, symbol: 'MSFT', name: 'Microsoft Corp', shares: 30, avgCost: '$332.10', current: '$415.60', change: '-0.42%', pnl: '+$2,505', allocation: '10.1%' },
  { id: 4, symbol: 'AMZN', name: 'Amazon.com', shares: 18, avgCost: '$148.50', current: '$186.40', change: '+1.23%', pnl: '+$682', allocation: '8.4%' },
  { id: 5, symbol: 'JPM', name: 'JPMorgan Chase', shares: 35, avgCost: '$165.80', current: '$198.30', change: '-0.67%', pnl: '+$1,138', allocation: '7.2%' },
  { id: 6, symbol: 'UNH', name: 'UnitedHealth', shares: 12, avgCost: '$488.90', current: '$527.15', change: '+0.89%', pnl: '+$459', allocation: '6.8%' },
  { id: 7, symbol: 'XOM', name: 'Exxon Mobil', shares: 55, avgCost: '$98.40', current: '$112.85', change: '-1.12%', pnl: '+$795', allocation: '5.9%' },
  { id: 8, symbol: 'TSLA', name: 'Tesla Inc.', shares: 15, avgCost: '$242.60', current: '$273.90', change: '+4.56%', pnl: '+$470', allocation: '5.1%' },
];

const topPerformers = [
  { id: '1', label: 'TSLA', sublabel: 'Tesla Inc.', value: '+4.56%' },
  { id: '2', label: 'NVDA', sublabel: 'NVIDIA Corp', value: '+3.87%' },
  { id: '3', label: 'AAPL', sublabel: 'Apple Inc.', value: '+2.14%' },
  { id: '4', label: 'AMZN', sublabel: 'Amazon.com', value: '+1.23%' },
  { id: '5', label: 'UNH', sublabel: 'UnitedHealth', value: '+0.89%' },
];

const recentActivityItems = [
  { id: '1', content: 'Bought 5 shares of NVDA at $887.30', timestamp: 'Today, 10:32 AM', color: '#22c55e' },
  { id: '2', content: 'Sold 10 shares of XOM at $114.20', timestamp: 'Today, 09:45 AM', color: '#ef4444' },
  { id: '3', content: 'Dividend received from AAPL — $96.75', timestamp: 'Mar 12, 2026', color: '#3b82f6' },
  { id: '4', content: 'Bought 8 shares of AMZN at $182.10', timestamp: 'Mar 11, 2:15 PM', color: '#22c55e' },
  { id: '5', content: 'Sold 5 shares of TSLA at $268.40', timestamp: 'Mar 10, 11:02 AM', color: '#ef4444' },
  { id: '6', content: 'Limit order placed: BUY 10 GOOG @ $155.00', timestamp: 'Mar 10, 9:30 AM', color: '#f59e0b' },
];

const alertItems = [
  { id: '1', title: 'NVDA up 3.87% today', description: 'NVIDIA surged on strong AI chip demand forecasts.', severity: 'success', timestamp: '32 min ago', unread: true },
  { id: '2', title: 'XOM dropped below $113', description: 'Exxon Mobil hit your price alert threshold.', severity: 'warning', timestamp: '1 hr ago', unread: true },
  { id: '3', title: 'Order filled: 5× NVDA', description: 'Market buy executed at $887.30 per share.', severity: 'info', timestamp: '3 hrs ago', unread: false },
  { id: '4', title: 'JPM ex-dividend approaching', description: 'Record date is Mar 18. Ensure holdings are settled.', severity: 'info', timestamp: 'Yesterday', unread: false },
];

const riskMetrics = [
  { subject: 'Volatility', portfolio: 72, benchmark: 55 },
  { subject: 'Sharpe', portfolio: 85, benchmark: 65 },
  { subject: 'Diversification', portfolio: 60, benchmark: 78 },
  { subject: 'Drawdown', portfolio: 45, benchmark: 52 },
  { subject: 'Liquidity', portfolio: 90, benchmark: 80 },
];

/* ─────────────────── Dashboard ─────────────────── */

export default function TradingDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [tradeAction, setTradeAction] = useState('buy');
  const [timeRange, setTimeRange] = useState('6m');

  return (
    <div className="h-screen flex flex-col bg-[var(--ds-bg-secondary)]">
      {/* Banner */}
      <Banner type="info" dismissible>
        Markets are open — U.S. equities trading session ends at 4:00 PM ET.
      </Banner>

      {/* Header */}
      <Header
        logo={
          <div className="w-8 h-8 rounded-[var(--ds-radius-lg)] bg-[var(--ds-bg-brand)] flex items-center justify-center">
            <CandlestickChart size={18} className="text-[color:var(--ds-text-on-brand)]" />
          </div>
        }
        productName="Meridian"
        navItems={[
          { label: 'Dashboard', href: '/', active: true, icon: <Home size={16} /> },
          { label: 'Trade', href: '/trade', icon: <ArrowRightLeft size={16} /> },
          { label: 'Research', href: '/research', icon: <Globe size={16} /> },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Search placeholder="Search symbols..." size="sm" />
            <Button size="sm" variant="ghost" icon={<Bell size={16} />} />
            <Button size="sm" variant="ghost" icon={<Settings size={16} />} />
          </div>
        }
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <SideNav
          collapsed={collapsed}
          items={[
            { label: 'Overview', icon: <Home size={18} />, href: '/', active: true },
            { label: 'Portfolio', icon: <Briefcase size={18} />, href: '/portfolio' },
            { label: 'Orders', icon: <ArrowRightLeft size={18} />, href: '/orders', badge: '2' },
            { label: 'Watchlist', icon: <Star size={18} />, href: '/watchlist' },
            { divider: true, label: 'Analytics' },
            { label: 'Performance', icon: <TrendingUp size={18} />, href: '/performance' },
            { label: 'Allocation', icon: <PieIcon size={18} />, href: '/allocation' },
            { label: 'Reports', icon: <BarChart3 size={18} />, href: '/reports' },
            { divider: true, label: 'Account' },
            { label: 'Settings', icon: <Settings size={18} />, href: '/settings' },
          ]}
        />

        {/* Main */}
        <main className="flex-1 overflow-auto p-6">
          {/* Page heading */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-[length:var(--ds-text-3xl)] font-bold text-[color:var(--ds-text-primary)] tracking-tight">
                Trading Dashboard
              </h1>
              <p className="text-[length:var(--ds-text-sm)] text-[color:var(--ds-text-secondary)] mt-1">
                Account overview and portfolio analytics
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Dropdown
                options={[
                  { value: '1m', label: '1 Month' },
                  { value: '3m', label: '3 Months' },
                  { value: '6m', label: '6 Months' },
                  { value: '1y', label: '1 Year' },
                  { value: 'ytd', label: 'YTD' },
                ]}
                value={timeRange}
                onChange={setTimeRange}
                size="sm"
                placeholder="Time range"
              />
              <Button size="sm" variant="secondary" icon={<Download size={14} />}>Export</Button>
              <Button size="sm" variant="primary" icon={<ArrowRightLeft size={14} />} onClick={() => setTradeModalOpen(true)}>
                New Trade
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KpiCard
              variant="with-trend"
              label="Portfolio Value"
              value="$148,950"
              trendData={[124300, 131800, 128200, 136700, 142100, 148950]}
              trendColor="var(--ds-text-success)"
            />
            <KpiCard
              variant="with-delta"
              label="Total Gain/Loss"
              value="+$24,650"
              delta={19.83}
              deltaFormat="percentage"
              deltaLabel="all-time return"
            />
            <KpiCard
              variant="with-delta"
              label="Today's P&L"
              value="+$2,847"
              delta={1.95}
              deltaFormat="percentage"
              deltaLabel="vs previous close"
            />
            <KpiCard
              variant="with-progress"
              label="Buying Power Used"
              value="$125,470"
              progress={84}
              target="$148,950"
              progressType="ring"
              progressColor="var(--ds-text-brand)"
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-2">
              <AreaChart
                variant="gradient"
                data={portfolioPerformance}
                dataKeys={['portfolio', 'benchmark']}
                xAxisKey="date"
                height={320}
                title="Portfolio Performance"
                subtitle="Portfolio vs S&P 500 (6 months)"
                showLegend
                showGrid
                colors={['#3b82f6', '#94a3b8']}
              />
            </div>
            <PieChart
              variant="donut"
              data={sectorAllocation}
              height={320}
              title="Sector Allocation"
              subtitle="By market value"
              showLegend
              centerValue="6"
              centerLabel="sectors"
            />
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <ComposedChart
              variant="bar-line"
              data={monthlyReturns}
              barKeys={['return']}
              lineKeys={['spReturn']}
              xAxisKey="month"
              height={280}
              title="Monthly Returns (%)"
              subtitle="Portfolio vs S&P 500"
              showLegend
              yAxisLabel="Portfolio %"
              yAxisRightLabel="S&P %"
              colors={['#3b82f6', '#f59e0b']}
            />
            <BarChart
              variant="grouped"
              data={volumeData}
              dataKeys={['buys', 'sells']}
              xAxisKey="day"
              height={280}
              title="Weekly Trade Volume"
              subtitle="Buy vs sell activity (USD)"
              showLegend
              colors={['#22c55e', '#ef4444']}
            />
            <RadialChart
              variant="radar"
              data={riskMetrics}
              dataKeys={['portfolio', 'benchmark']}
              height={280}
              title="Risk Profile"
              subtitle="Portfolio vs benchmark"
              showLegend
              colors={['#3b82f6', '#94a3b8']}
            />
          </div>

          {/* Tabbed Section */}
          <Tabs
            variant="underline"
            size="md"
            tabs={[
              {
                id: 'holdings',
                label: 'Holdings',
                icon: <Briefcase size={16} />,
                badge: holdings.length,
                content: (
                  <div className="mt-4">
                    <DataTable
                      columns={[
                        {
                          key: 'symbol',
                          header: 'Symbol',
                          sortable: true,
                          width: '130px',
                          render: (val, row) => (
                            <div>
                              <span className="font-bold text-[color:var(--ds-text-primary)]">{val}</span>
                              <span className="block text-[length:var(--ds-text-xs)] text-[color:var(--ds-text-tertiary)]">{row.name}</span>
                            </div>
                          ),
                        },
                        { key: 'shares', header: 'Shares', sortable: true, width: '80px' },
                        { key: 'avgCost', header: 'Avg Cost', width: '100px' },
                        {
                          key: 'current',
                          header: 'Price',
                          sortable: true,
                          width: '100px',
                          render: (val) => <span className="font-semibold">{val}</span>,
                        },
                        {
                          key: 'change',
                          header: 'Today',
                          sortable: true,
                          width: '100px',
                          render: (val) => (
                            <Tag color={val.startsWith('+') ? 'success' : 'danger'} size="sm">{val}</Tag>
                          ),
                        },
                        {
                          key: 'pnl',
                          header: 'P&L',
                          sortable: true,
                          width: '100px',
                          render: (val) => (
                            <span className="text-[color:var(--ds-text-success)] font-semibold">{val}</span>
                          ),
                        },
                        { key: 'allocation', header: 'Weight', sortable: true, width: '90px' },
                        {
                          key: 'actions',
                          header: '',
                          width: '48px',
                          render: (_, row) => (
                            <OverflowMenu
                              size="sm"
                              items={[
                                { label: 'Buy more', icon: <ArrowUpRight size={14} />, onClick: () => {} },
                                { label: 'Sell', icon: <ArrowDownRight size={14} />, onClick: () => {} },
                                { divider: true },
                                { label: 'View details', icon: <ExternalLink size={14} />, onClick: () => {} },
                              ]}
                            />
                          ),
                        },
                      ]}
                      data={holdings}
                      sortable
                      defaultSortColumn="allocation"
                      defaultSortDirection="desc"
                      compact
                      stickyHeader
                      striped
                      paginated
                      defaultPageSize={10}
                    />
                  </div>
                ),
              },
              {
                id: 'activity',
                label: 'Activity',
                icon: <Activity size={16} />,
                content: (
                  <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartWrapper title="Recent Trades" subtitle="Last 7 days">
                      <ActivityFeed items={recentActivityItems} maxHeight="360px" />
                    </ChartWrapper>
                    <ChartWrapper title="Top Performers" subtitle="Today's leaders by % change">
                      <RankedList items={topPerformers} />
                    </ChartWrapper>
                  </div>
                ),
              },
              {
                id: 'alerts',
                label: 'Alerts',
                icon: <Bell size={16} />,
                badge: 2,
                content: (
                  <div className="mt-4">
                    <ChartWrapper title="Price Alerts & Notifications" subtitle="Your active watchlist triggers">
                      <NotificationList
                        items={alertItems}
                        maxHeight="400px"
                        onItemClick={() => {}}
                      />
                    </ChartWrapper>
                  </div>
                ),
              },
            ]}
          />

          {/* Bottom KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <KpiCard
              variant="with-icon"
              label="Open Orders"
              value="2"
              icon={<Clock size={20} />}
              iconColor="#f59e0b"
            />
            <KpiCard
              variant="with-icon"
              label="Positions"
              value="8"
              icon={<Layers size={20} />}
              iconColor="#3b82f6"
            />
            <KpiCard
              variant="with-icon"
              label="Dividends (YTD)"
              value="$1,284"
              icon={<DollarSign size={20} />}
              iconColor="#22c55e"
            />
            <KpiCard
              variant="with-progress"
              label="Annual Goal"
              value="$148,950"
              progress={74}
              target="$200,000"
              progressType="bar"
              progressColor="var(--ds-text-success)"
            />
          </div>
        </main>
      </div>

      {/* Trade Modal */}
      <Modal
        open={tradeModalOpen}
        onClose={() => setTradeModalOpen(false)}
        title="Place a Trade"
        size="md"
        footer={
          <>
            <Button variant="tertiary" onClick={() => setTradeModalOpen(false)}>Cancel</Button>
            <Button variant={tradeAction === 'sell' ? 'danger' : 'primary'}>
              {tradeAction === 'buy' ? 'Buy' : 'Sell'} Shares
            </Button>
          </>
        }
      >
        <Form>
          <FormGroup legend="Order Details">
            <FormRow>
              <Select
                label="Action"
                options={[
                  { value: 'buy', label: 'Buy' },
                  { value: 'sell', label: 'Sell' },
                ]}
                value={tradeAction}
                onChange={(e) => setTradeAction(e.target.value)}
              />
              <Select
                label="Order Type"
                options={[
                  { value: 'market', label: 'Market' },
                  { value: 'limit', label: 'Limit' },
                  { value: 'stop', label: 'Stop Loss' },
                  { value: 'stop-limit', label: 'Stop Limit' },
                ]}
              />
            </FormRow>
            <FormRow>
              <TextInput label="Symbol" placeholder="e.g. AAPL" required />
              <TextInput label="Quantity" type="number" placeholder="0" required />
            </FormRow>
            <TextInput label="Limit Price" placeholder="$0.00" helperText="Required for limit and stop-limit orders" />
          </FormGroup>
          <Notification type="info" title="Estimated cost">
            Order preview will appear once symbol and quantity are provided.
          </Notification>
        </Form>
      </Modal>
    </div>
  );
}