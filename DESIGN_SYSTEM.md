# AI Design System v1 — Reference Guide

> **Framework:** Next.js 16 + React 19 + Tailwind CSS 4
> **Theming:** CSS custom properties with runtime switching (light, dark, high-contrast)
> **Icons:** lucide-react
> **All components are `'use client'`** — they use hooks, refs, and browser APIs.

---

## 1. Component Inventory

All components are exported from the barrel file and can be imported individually.

| Component | Barrel import | Direct import |
|-----------|--------------|---------------|
| Button | `import { Button } from '@/components'` | `import Button from '@/components/Button/Button'` |
| TextInput | `import { TextInput } from '@/components'` | `import TextInput from '@/components/TextInput/TextInput'` |
| Checkbox | `import { Checkbox } from '@/components'` | `import Checkbox from '@/components/Checkbox/Checkbox'` |
| Toggle | `import { Toggle } from '@/components'` | `import Toggle from '@/components/Toggle/Toggle'` |
| Select | `import { Select } from '@/components'` | `import Select from '@/components/Select/Select'` |
| Dropdown | `import { Dropdown } from '@/components'` | `import Dropdown from '@/components/Dropdown/Dropdown'` |
| DatePicker | `import { DatePicker } from '@/components'` | `import DatePicker from '@/components/DatePicker/DatePicker'` |
| Search | `import { Search } from '@/components'` | `import Search from '@/components/Search/Search'` |
| Tag | `import { Tag } from '@/components'` | `import Tag from '@/components/Tag/Tag'` |
| Modal | `import { Modal } from '@/components'` | `import Modal from '@/components/Modal/Modal'` |
| DataTable | `import { DataTable } from '@/components'` | `import DataTable from '@/components/DataTable/DataTable'` |
| Pagination | `import { Pagination } from '@/components'` | `import Pagination from '@/components/Pagination/Pagination'` |
| Tabs | `import { Tabs } from '@/components'` | `import Tabs from '@/components/Tabs/Tabs'` |
| Header | `import { Header } from '@/components'` | `import Header from '@/components/Header/Header'` |
| SideNav | `import { SideNav } from '@/components'` | `import SideNav from '@/components/SideNav/SideNav'` |
| Breadcrumb | `import { Breadcrumb } from '@/components'` | `import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'` |
| OverflowMenu | `import { OverflowMenu } from '@/components'` | `import OverflowMenu from '@/components/OverflowMenu/OverflowMenu'` |
| Notification | `import { Notification } from '@/components'` | `import Notification from '@/components/Notification/Notification'` |
| Toast | `import { Toast } from '@/components'` | `import { Toast } from '@/components/Notification/Notification'` |
| Banner | `import { Banner } from '@/components'` | `import { Banner } from '@/components/Notification/Notification'` |
| Form | `import { Form } from '@/components'` | `import Form from '@/components/Form/Form'` |
| FormGroup | `import { FormGroup } from '@/components'` | `import { FormGroup } from '@/components/Form/Form'` |
| FormRow | `import { FormRow } from '@/components'` | `import { FormRow } from '@/components/Form/Form'` |
| FormActions | `import { FormActions } from '@/components'` | `import { FormActions } from '@/components/Form/Form'` |
| Spinner | `import { Spinner } from '@/components'` | `import { Spinner } from '@/components/Loading/Loading'` |
| Skeleton | `import { Skeleton } from '@/components'` | `import { Skeleton } from '@/components/Loading/Loading'` |
| SkeletonText | `import { SkeletonText } from '@/components'` | `import { SkeletonText } from '@/components/Loading/Loading'` |
| TableSkeleton | `import { TableSkeleton } from '@/components'` | `import { TableSkeleton } from '@/components/Loading/Loading'` |
| BarChart | `import { BarChart } from '@/components'` | `import { BarChart } from '@/components/Charts/BarChart'` |
| LineChart | `import { LineChart } from '@/components'` | `import { LineChart } from '@/components/Charts/LineChart'` |
| AreaChart | `import { AreaChart } from '@/components'` | `import { AreaChart } from '@/components/Charts/AreaChart'` |
| PieChart | `import { PieChart } from '@/components'` | `import { PieChart } from '@/components/Charts/PieChart'` |
| ComposedChart | `import { ComposedChart } from '@/components'` | `import { ComposedChart } from '@/components/Charts/ComposedChart'` |
| RadialChart | `import { RadialChart } from '@/components'` | `import { RadialChart } from '@/components/Charts/RadialChart'` |
| ChartWrapper | `import { ChartWrapper } from '@/components'` | `import { ChartWrapper } from '@/components/Charts/chartTheme'` |
| List | `import { List } from '@/components'` | `import List from '@/components/List/List'` |
| ActivityFeed | `import { ActivityFeed } from '@/components'` | `import { ActivityFeed } from '@/components/List/List'` |
| NotificationList | `import { NotificationList } from '@/components'` | `import { NotificationList } from '@/components/List/List'` |
| RankedList | `import { RankedList } from '@/components'` | `import { RankedList } from '@/components/List/List'` |
| AvatarList | `import { AvatarList } from '@/components'` | `import { AvatarList } from '@/components/List/List'` |
| TableList | `import { TableList } from '@/components'` | `import { TableList } from '@/components/List/List'` |
| KpiCard | `import { KpiCard } from '@/components'` | `import KpiCard from '@/components/KpiCard/KpiCard'` |

---

## 2. Component Props

Every component accepts `className` and forwards extra props via `...props`. All components use `forwardRef`.

### Button
```jsx
<Button
  variant="primary"       // "primary" | "secondary" | "tertiary" | "danger" | "ghost"
  size="md"               // "sm" | "md" | "lg"
  disabled={false}
  loading={false}         // shows Loader2 spinner, disables button
  icon={<IconComponent />}
  iconPosition="left"     // "left" | "right"
  fullWidth={false}
  type="button"           // "button" | "submit" | "reset"
  onClick={fn}
/>
```

### TextInput
```jsx
<TextInput
  label="Email"
  placeholder="you@example.com"
  size="md"               // "sm" | "md" | "lg"
  disabled={false}
  required={false}
  helperText="We'll never share your email."
  errorText="Invalid email"   // triggers error state (red border + icon)
  successText="Looks good!"   // triggers success state (green border + icon)
  icon={<IconComponent />}    // left icon
  wrapperClassName=""
  // All native <input> props: value, onChange, type, name, etc.
/>
```

### Select (native)
```jsx
<Select
  label="Country"
  options={[                    // string[] or { value, label }[]
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
  ]}
  value="us"
  onChange={fn}
  placeholder="Select an option"
  size="md"                     // "sm" | "md" | "lg"
  disabled={false}
  required={false}
  errorText=""
  helperText=""
  wrapperClassName=""
/>
```

### Dropdown (custom styled, non-native)
```jsx
<Dropdown
  label="Role"
  options={[                    // string[] or { value, label, disabled? }[]
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' },
  ]}
  value="admin"
  onChange={(value) => {}}
  placeholder="Select..."
  size="md"                     // "sm" | "md" | "lg"
  disabled={false}
  required={false}
  errorText=""
  helperText=""
  wrapperClassName=""
/>
```

### Checkbox
```jsx
<Checkbox
  label="Accept terms"
  checked={false}
  indeterminate={false}    // shows minus icon (mixed state)
  disabled={false}
  size="md"                // "sm" | "md" | "lg"
  onChange={fn}
/>
```

### Toggle
```jsx
<Toggle
  label="Dark mode"
  checked={false}
  disabled={false}
  size="md"               // "sm" | "md" | "lg"
  onChange={fn}
/>
```

### Modal
```jsx
<Modal
  open={false}
  onClose={fn}
  title="Confirm Action"
  size="md"               // "sm" | "md" | "lg" | "xl" | "full"
  closeOnOverlay={true}
  closeOnEsc={true}
  showCloseButton={true}
  footer={<>
    <Button variant="tertiary" onClick={onClose}>Cancel</Button>
    <Button onClick={onConfirm}>Confirm</Button>
  </>}
>
  <p>Modal body content here.</p>
</Modal>
```
Note: Modal renders via `createPortal` to `document.body`. It locks body scroll while open.

### Tag
```jsx
<Tag
  color="default"          // "default" | "brand" | "success" | "warning" | "danger" | "info"
  size="md"                // "sm" | "md" | "lg"
  dismissible={false}
  onDismiss={fn}
  icon={<IconComponent />}
  outline={false}          // outline variant: transparent bg with colored border
>
  Label
</Tag>
```

### Notification (inline)
```jsx
<Notification
  type="info"              // "success" | "warning" | "error" | "info"
  title="Heads up"
  dismissible={true}
  onDismiss={fn}
>
  Descriptive message body.
</Notification>
```

### Toast (floating)
```jsx
<Toast
  type="success"           // "success" | "warning" | "error" | "info"
  title="Saved"
  visible={true}
  duration={5000}          // ms, 0 = persistent
  onClose={fn}
>
  Optional body text.
</Toast>
```
Renders fixed at bottom-right.

### Banner (full-width)
```jsx
<Banner
  type="warning"           // "success" | "warning" | "error" | "info"
  dismissible={true}
  onDismiss={fn}
>
  System maintenance scheduled for tonight.
</Banner>
```

### DataTable
```jsx
<DataTable
  columns={[
    { key: 'name', header: 'Name', sortable: true, width: '200px' },
    { key: 'email', header: 'Email' },
    { key: 'status', header: 'Status', render: (val, row) => <Tag>{val}</Tag> },
  ]}
  data={[
    { id: 1, name: 'Alice', email: 'alice@co.com', status: 'Active' },
  ]}
  sortable={true}
  defaultSortColumn="name"
  defaultSortDirection="asc"    // "asc" | "desc"
  onSort={(column, direction) => {}}
  selectable={false}
  selectedRows={[]}             // array of row indices
  onSelectionChange={(indices) => {}}
  batchActions={<Button size="sm">Delete</Button>}  // shown when rows selected
  paginated={false}
  defaultPageSize={10}
  pageSizeOptions={[10, 25, 50, 100]}
  editableColumns={['name']}    // columns that support inline edit (double-click)
  onCellEdit={(rowIndex, columnKey, newValue) => {}}
  loading={false}
  emptyMessage="No data available"
  stickyHeader={false}
  compact={false}               // tighter row padding
  striped={false}               // alternating row backgrounds
/>
```

### Pagination
```jsx
<Pagination
  currentPage={1}
  totalPages={10}
  totalItems={100}
  pageSize={10}
  onPageChange={(page) => {}}
  onPageSizeChange={(size) => {}}
  pageSizeOptions={[10, 25, 50, 100]}
  siblingCount={1}
  showPageSizeSelector={false}
  showItemCount={false}
/>
```

### Tabs
```jsx
<Tabs
  tabs={[
    { id: 'tab1', label: 'General', content: <div>...</div> },
    { id: 'tab2', label: 'Settings', icon: <Settings size={16} />, badge: 3 },
    { id: 'tab3', label: 'Disabled', disabled: true },
  ]}
  defaultActiveTab="tab1"
  activeTab={controlled}        // optional controlled mode
  onChange={(tabId) => {}}
  variant="underline"           // "underline" | "pill"
  size="md"                     // "sm" | "md" | "lg"
  fullWidth={false}
/>
```

### Header
```jsx
<Header
  logo={<img src="/logo.svg" alt="Logo" />}
  productName="Product"
  navItems={[
    { label: 'Dashboard', href: '/', active: true, icon: <Home size={16} /> },
    { label: 'Settings', href: '/settings', onClick: fn },
  ]}
  actions={<Button size="sm">Sign out</Button>}
/>
```

### SideNav
```jsx
<SideNav
  collapsed={false}          // collapsed = icon-only (w-16), expanded = full (w-60)
  header={<Logo />}
  footer={<UserMenu />}
  items={[
    { label: 'Dashboard', href: '/', icon: <Home size={18} />, active: true, badge: '3' },
    { label: 'Analytics', icon: <BarChart size={18} />, children: [
      { label: 'Overview', href: '/analytics' },
      { label: 'Reports', href: '/reports' },
    ], defaultExpanded: true },
    { divider: true, label: 'Settings' },   // section divider with optional label
    { label: 'Preferences', icon: <Settings size={18} />, href: '/settings' },
  ]}
/>
```

### Breadcrumb
```jsx
<Breadcrumb
  items={[
    { label: 'Home', href: '/', icon: <Home size={14} /> },
    { label: 'Projects', href: '/projects' },
    { label: 'Current' },     // last item renders as plain text (aria-current="page")
  ]}
  separator={<CustomSeparator />}   // optional, defaults to ChevronRight
/>
```

### Search
```jsx
<Search
  value={controlled}           // optional controlled mode
  onChange={(val) => {}}
  onSearch={(val) => {}}       // fires on Enter or after debounce
  onClear={fn}
  placeholder="Search..."
  suggestions={[               // string[] or { label, description }[]
    { label: 'Result 1', description: 'Description' },
  ]}
  onSuggestionSelect={(suggestion) => {}}
  loading={false}
  size="md"                    // "sm" | "md" | "lg"
  disabled={false}
  scope="Projects"             // optional scope badge inside input
  debounceMs={300}
  wrapperClassName=""
/>
```

### DatePicker
```jsx
<DatePicker
  label="Start date"
  value="2026-03-12"           // format: YYYY-MM-DD
  onChange={(dateStr) => {}}
  mode="single"                // "single" | "range"
  rangeEnd="2026-03-20"        // only when mode="range"
  onRangeChange={(start, end) => {}}
  placeholder="Select date"
  min="2026-01-01"             // disable dates before
  max="2026-12-31"             // disable dates after
  size="md"                    // "sm" | "md" | "lg"
  disabled={false}
  required={false}
  errorText=""
  helperText=""
  wrapperClassName=""
/>
```

### OverflowMenu
```jsx
<OverflowMenu
  trigger={<CustomTrigger />}  // optional, defaults to MoreVertical icon
  align="right"                // "right" | "left"
  size="md"                    // "sm" | "md" | "lg"
  items={[
    { label: 'Edit', icon: <Edit size={14} />, onClick: fn, shortcut: '⌘E' },
    { label: 'Duplicate', icon: <Copy size={14} />, onClick: fn },
    { divider: true },
    { label: 'Delete', icon: <Trash size={14} />, onClick: fn, danger: true },
    { label: 'Disabled', onClick: fn, disabled: true },
  ]}
/>
```

### Form / FormGroup / FormRow / FormActions
```jsx
<Form onSubmit={(e) => {}}>
  <FormGroup legend="Personal Info">
    <FormRow>                   {/* 2-column grid on md+ screens */}
      <TextInput label="First name" />
      <TextInput label="Last name" />
    </FormRow>
    <TextInput label="Email" />
  </FormGroup>

  <FormActions align="right">  {/* "left" | "center" | "right" | "between" */}
    <Button variant="tertiary">Cancel</Button>
    <Button type="submit">Save</Button>
  </FormActions>
</Form>
```

### Loading Components
```jsx
<Spinner size="md" label="Loading..." />       // "sm" | "md" | "lg" | "xl"
<Skeleton width="200px" height="1rem" variant="rectangular" />  // "rectangular" | "circular" | "text"
<SkeletonText lines={3} />
<TableSkeleton rows={5} columns={4} />
```

### Charts (Recharts-based)

All chart components share common props: `data`, `height`, `title`, `subtitle`, `showTooltip`, `showLegend`, `colors`, and `className`. They are wrapped in `ChartWrapper` (a card-like container) and automatically adapt to dark/high-contrast themes via a `MutationObserver` on `data-theme`. Charts use `SERIES_COLORS` (a 10-color ordered palette) by default. Override with the `colors` prop.

**Dependency:** All chart components require `recharts` as a peer dependency.

#### ChartWrapper
```jsx
<ChartWrapper
  title="Revenue"              // optional heading
  subtitle="Monthly trend"    // optional subheading
  className=""
>
  {/* chart content */}
</ChartWrapper>
```

#### BarChart
```jsx
<BarChart
  variant="vertical"           // "vertical" | "horizontal" | "grouped" | "stacked" | "stacked-percent" | "diverging" | "waterfall"
  data={[{ name: 'Jan', revenue: 4200, expenses: 2400 }]}
  dataKeys={['revenue']}       // keys from data to render as bars
  xAxisKey="name"              // key for the category axis
  colors={[]}                  // optional color array, defaults to SERIES_COLORS
  height={300}
  title=""
  subtitle=""
  showGrid={true}
  showLegend={true}            // auto-hidden for single series
  showTooltip={true}
  barRadius={4}                // border-radius on bar corners
/>
```
**Variant notes:**
- `grouped`: side-by-side bars for multi-series comparison
- `stacked-percent`: normalizes each row to 100%, Y-axis shows percentages
- `diverging`: colors bars green (positive) or red (negative) around a zero baseline
- `waterfall`: shows cumulative build-up with invisible base bars; first & last bars are totals

#### LineChart
```jsx
<LineChart
  variant="single"             // "single" | "multi" | "stepped" | "dashed-target" | "with-threshold"
  data={[{ name: 'Week 1', users: 1200, target: 1500 }]}
  dataKeys={['users']}
  xAxisKey="name"
  colors={[]}
  height={300}
  title=""
  subtitle=""
  showGrid={true}
  showLegend                   // defaults to true when multi-series
  showTooltip={true}
  showDots={true}
  strokeWidth={2}
  thresholdValue={1500}        // only for "with-threshold" — draws horizontal reference line
  thresholdLabel="Threshold"   // label on the reference line
  targetKey="target"           // only for "dashed-target" — which dataKey renders dashed
/>
```

#### AreaChart
```jsx
<AreaChart
  variant="single"             // "single" | "stacked" | "stacked-percent" | "gradient" | "range"
  data={[{ name: 'Mon', tickets: 42 }]}
  dataKeys={['tickets']}
  xAxisKey="name"
  colors={[]}
  height={300}
  title=""
  subtitle=""
  showGrid={true}
  showLegend                   // defaults to true when multi-series
  showTooltip={true}
  strokeWidth={2}
  rangeKeys={{ upper: 'upper', lower: 'lower' }}  // only for "range" variant
/>
```
**Variant notes:**
- `gradient`: prominent gradient fill from top to bottom
- `range`: renders a confidence-interval band between `rangeKeys.upper` and `rangeKeys.lower`, with a line for the first `dataKey`

#### PieChart
```jsx
<PieChart
  variant="standard"           // "standard" | "donut" | "semi" | "nested"
  data={[{ name: 'Enterprise', value: 45 }]}
  outerData={[]}               // only for "nested" — second ring data
  colors={[]}
  height={300}
  title=""
  subtitle=""
  showLegend={true}
  showTooltip={true}
  showLabels={false}           // percentage labels inside slices
  centerValue="$1.2M"         // center text for "donut" and "semi"
  centerLabel="ARR"           // center subtext
/>
```
**Variant notes:**
- `donut`: pie with inner radius cutout; supports center text
- `semi`: half-circle donut (180° arc); supports center text
- `nested`: two concentric rings — inner from `data`, outer from `outerData`

#### ComposedChart
```jsx
<ComposedChart
  variant="bar-line"           // "bar-line" | "bar-area" | "multi-axis"
  data={[{ name: 'Jan', revenue: 42000, margin: 32 }]}
  barKeys={['revenue']}        // keys rendered as bars
  lineKeys={['margin']}        // keys rendered as lines
  areaKeys={[]}                // keys rendered as areas (used in "bar-area" and "multi-axis")
  xAxisKey="name"
  colors={[]}
  height={300}
  title=""
  subtitle=""
  showGrid={true}
  showLegend={true}
  showTooltip={true}
  barRadius={4}
  yAxisLabel=""                // left Y-axis label
  yAxisRightLabel=""           // right Y-axis label (for dual-axis variants)
/>
```
**Variant notes:**
- `bar-line`: bars on left Y-axis, lines on right Y-axis (dual-axis)
- `bar-area`: areas render behind bars on a single Y-axis
- `multi-axis`: all three series types with independent left/right Y-axes

#### RadialChart
```jsx
<RadialChart
  variant="gauge"              // "gauge" | "progress" | "multi-ring" | "radar"
  value={73}                   // current value for "gauge" and "progress"
  maxValue={100}               // scale maximum
  data={[]}                    // array of { name, value } for "multi-ring" and "radar"
  dataKeys={[]}                // keys to plot for "radar" variant
  colors={[]}
  height={300}
  title=""
  subtitle=""
  showLegend={false}
  showTooltip={true}
  label="Quota"                // center subtext for "gauge" and "progress"
/>
```
**Variant notes:**
- `gauge`: 240° arc with auto-coloring (green ≥70%, amber ≥40%, red <40%), displays `value` in center
- `progress`: full 360° ring showing percentage complete, displays `percentage%` in center
- `multi-ring`: concentric rings for multiple data items, each with its own color
- `radar`: polygon radar/spider chart; `data` items need a `subject` key, `dataKeys` specify the series

#### Chart Utilities
```jsx
import { SERIES_COLORS, CHART_COLORS } from '@/components/Charts/chartTheme';

// SERIES_COLORS: ordered 10-color array for multi-series charts
// CHART_COLORS: full palette object keyed by color family (blue, teal, purple, amber, red, green)
//   each with shades: { 600, 500, 400, 300, 200, 100, 50 }
```

### List (multi-variant)

`List` is a convenience wrapper that delegates to a specialized sub-component based on the `variant` prop. You can also import each sub-component directly. All list components use `forwardRef`.

#### List (wrapper)
```jsx
<List
  variant="activity-feed"      // "activity-feed" | "notification" | "ranked" | "with-avatar" | "with-table"
  // ...variant-specific props
/>
```

#### ActivityFeed
```jsx
<ActivityFeed
  items={[
    { id: '1', content: 'Deployed v2.1 to production', timestamp: '2 hours ago', color: '#3b82f6' },
  ]}
  maxHeight="400px"            // optional scroll container height
/>
```
Each item: `{ id?, content, timestamp?, color? }`. Color sets the timeline dot; defaults to `--ds-text-brand`.

#### NotificationList
```jsx
<NotificationList
  items={[
    {
      id: '1',
      title: 'Build failed',
      description: 'CI pipeline error on main branch',
      severity: 'error',       // "info" | "warning" | "error" | "success"
      timestamp: '5 min ago',
      unread: true,
    },
  ]}
  maxHeight="400px"
  onItemClick={(item, index) => {}}   // makes items clickable with hover state
/>
```
Unread items show a bold title, selected background, and a blue dot indicator.

#### RankedList
```jsx
<RankedList
  items={[
    { id: '1', label: 'Alice', sublabel: 'Engineering', value: '$142K' },
  ]}
/>
```
Each item: `{ id?, label, sublabel?, value? }`. Top 3 items get a highlighted rank badge.

#### AvatarList
```jsx
<AvatarList
  items={[
    { id: '1', name: 'Alice Smith', avatar: '/avatars/alice.jpg', description: 'Engineering Lead', meta: 'Online' },
  ]}
  onItemClick={(item, index) => {}}   // makes items clickable with hover state
/>
```
Each item: `{ id?, name, avatar?, description?, meta? }`. If no `avatar` URL, renders initials in a colored circle.

#### TableList
```jsx
<TableList
  columns={[
    { key: 'name', header: 'Name', width: '200px', minWidth: '150px', icon: <Icon /> },
    { key: 'status', header: 'Status', render: (val, row, index) => <Tag>{val}</Tag> },
  ]}
  data={[
    { id: 1, name: 'Project Alpha', status: 'Active' },
  ]}
  sortable={false}                     // enable column sorting
  defaultSortColumn="name"
  defaultSortDirection="asc"           // "asc" | "desc"
  actions={<Button size="sm">Filter</Button>}  // toolbar above the table
/>
```

### KpiCard

A metric card with multiple display variants. Uses `forwardRef`. Renders as a bordered card with hover shadow.

```jsx
<KpiCard
  label="Monthly Revenue"       // uppercase label text
  value="$48,200"               // primary metric display
  variant="simple"              // "simple" | "with-trend" | "with-delta" | "with-progress" | "with-icon"
/>
```

#### with-trend
Displays a mini sparkline (SVG polyline) to the right of the value. Supports hover tooltip on data points.
```jsx
<KpiCard
  variant="with-trend"
  label="Active Users"
  value="1,842"
  trendData={[120, 135, 110, 158, 142, 170]}   // array of numbers
  trendColor="var(--ds-text-brand)"             // sparkline stroke color
/>
```

#### with-delta
Shows a change indicator (trending up/down/neutral icon + formatted value) inline next to the metric.
```jsx
<KpiCard
  variant="with-delta"
  label="Conversion Rate"
  value="3.2%"
  delta={12}                    // positive = green + TrendingUp, negative = red + TrendingDown, 0 = neutral
  deltaFormat="percentage"      // "percentage" (+12%) | "absolute" (+12)
  deltaLabel="vs last month"   // optional context text below value
/>
```

#### with-progress
Displays a progress indicator — either a horizontal bar or a circular ring.
```jsx
<KpiCard
  variant="with-progress"
  label="Quota"
  value="$34K"
  progress={68}                 // 0-100
  target="$50K"                 // shown as "{progress}% of {target}" below the bar
  progressType="bar"            // "bar" (horizontal) | "ring" (circular, displayed on the right)
  progressColor="var(--ds-text-brand)"
/>
```

#### with-icon
Shows a colored icon badge to the right of the metric.
```jsx
<KpiCard
  variant="with-icon"
  label="Open Tickets"
  value="23"
  icon={<TicketIcon size={20} />}
  iconColor="#3b82f6"           // icon color + translucent background; defaults to brand
/>
```

---

## 3. Design Tokens

All tokens are CSS custom properties defined in `src/tokens/tokens.css`. Components reference **semantic** tokens only — never primitives directly.

### Colour Palette (Primitives)

| Scale | Token pattern | Range |
|-------|--------------|-------|
| Gray | `--ds-gray-{0,50,100..900,950}` | #ffffff → #030712 |
| Blue (Primary) | `--ds-blue-{50..900}` | #eff6ff → #1e3a8a |
| Red (Danger) | `--ds-red-{50..900}` | #fef2f2 → #7f1d1d |
| Green (Success) | `--ds-green-{50..900}` | #f0fdf4 → #14532d |
| Amber (Warning) | `--ds-amber-{50..900}` | #fffbeb → #78350f |
| Teal (Info) | `--ds-teal-{50..900}` | #f0fdfa → #134e4a |
| Purple (Accent) | `--ds-purple-{50..900}` | #faf5ff → #581c87 |

### Semantic Tokens (use these in components)

**Backgrounds:**
`--ds-bg-primary` `--ds-bg-secondary` `--ds-bg-tertiary` `--ds-bg-inverse` `--ds-bg-brand` `--ds-bg-brand-hover` `--ds-bg-danger` `--ds-bg-danger-hover` `--ds-bg-success` `--ds-bg-warning` `--ds-bg-info` `--ds-bg-error` `--ds-bg-overlay` `--ds-bg-hover` `--ds-bg-active` `--ds-bg-selected` `--ds-bg-disabled`

**Text:**
`--ds-text-primary` `--ds-text-secondary` `--ds-text-tertiary` `--ds-text-inverse` `--ds-text-brand` `--ds-text-danger` `--ds-text-success` `--ds-text-warning` `--ds-text-info` `--ds-text-disabled` `--ds-text-placeholder` `--ds-text-on-brand` `--ds-text-link` `--ds-text-link-hover`

**Borders:**
`--ds-border-primary` `--ds-border-secondary` `--ds-border-focus` `--ds-border-error` `--ds-border-success` `--ds-border-warning` `--ds-border-info` `--ds-border-disabled` `--ds-border-brand` `--ds-border-inverse`

**Icons:**
`--ds-icon-primary` `--ds-icon-secondary` `--ds-icon-inverse` `--ds-icon-brand` `--ds-icon-danger` `--ds-icon-success` `--ds-icon-warning` `--ds-icon-info` `--ds-icon-disabled`

**Component-specific:**
`--ds-input-bg` `--ds-input-border` `--ds-input-border-hover`
`--ds-table-header-bg` `--ds-table-row-hover` `--ds-table-row-selected` `--ds-table-border`
`--ds-sidebar-bg` `--ds-sidebar-text` `--ds-sidebar-text-active` `--ds-sidebar-hover` `--ds-sidebar-active`
`--ds-header-bg` `--ds-header-border`

### Spacing (4px base)

| Token | Value |
|-------|-------|
| `--ds-spacing-0` | 0 |
| `--ds-spacing-1` | 0.25rem (4px) |
| `--ds-spacing-2` | 0.5rem (8px) |
| `--ds-spacing-3` | 0.75rem (12px) |
| `--ds-spacing-4` | 1rem (16px) |
| `--ds-spacing-5` | 1.25rem (20px) |
| `--ds-spacing-6` | 1.5rem (24px) |
| `--ds-spacing-8` | 2rem (32px) |
| `--ds-spacing-10` | 2.5rem (40px) |
| `--ds-spacing-12` | 3rem (48px) |
| `--ds-spacing-16` | 4rem (64px) |
| `--ds-spacing-20` | 5rem (80px) |
| `--ds-spacing-24` | 6rem (96px) |

### Sizing

| Token | Value | Use |
|-------|-------|-----|
| `--ds-size-xs` | 1.5rem (24px) | Small badges, tags |
| `--ds-size-sm` | 2rem (32px) | Small buttons/inputs |
| `--ds-size-md` | 2.5rem (40px) | Default buttons/inputs |
| `--ds-size-lg` | 3rem (48px) | Large buttons/inputs |
| `--ds-size-xl` | 3.5rem (56px) | Extra large |

Icons: `--ds-icon-{xs,sm,md,lg,xl}` → 12px, 16px, 20px, 24px, 32px

Containers: `--ds-container-{sm,md,lg,xl,2xl}` → 640px, 768px, 1024px, 1280px, 1536px

### Typography

| Token | Value |
|-------|-------|
| `--ds-font-sans` | Geist Sans (falls back to system sans-serif) |
| `--ds-font-mono` | Geist Mono (falls back to system monospace) |
| `--ds-text-xs` | 0.75rem (12px) |
| `--ds-text-sm` | 0.875rem (14px) |
| `--ds-text-md` | 1rem (16px) |
| `--ds-text-lg` | 1.125rem (18px) |
| `--ds-text-xl` | 1.25rem (20px) |
| `--ds-text-2xl` | 1.5rem (24px) |
| `--ds-text-3xl` | 1.875rem (30px) |
| `--ds-text-4xl` | 2.25rem (36px) |
| `--ds-font-regular` | 400 |
| `--ds-font-medium` | 500 |
| `--ds-font-semibold` | 600 |
| `--ds-font-bold` | 700 |
| `--ds-leading-none` | 1 |
| `--ds-leading-tight` | 1.25 |
| `--ds-leading-snug` | 1.375 |
| `--ds-leading-normal` | 1.5 |
| `--ds-leading-relaxed` | 1.625 |

### Border Radius

`--ds-radius-none` (0) · `--ds-radius-sm` (4px) · `--ds-radius-md` (6px) · `--ds-radius-lg` (8px) · `--ds-radius-xl` (12px) · `--ds-radius-2xl` (16px) · `--ds-radius-full` (9999px)

### Shadows

`--ds-shadow-xs` · `--ds-shadow-sm` · `--ds-shadow-md` · `--ds-shadow-lg` · `--ds-shadow-xl` · `--ds-shadow-2xl`

Dark theme automatically increases shadow opacity.

### Motion

| Token | Value |
|-------|-------|
| `--ds-duration-fast` | 100ms |
| `--ds-duration-normal` | 200ms |
| `--ds-duration-slow` | 300ms |
| `--ds-duration-slower` | 500ms |
| `--ds-ease-default` | cubic-bezier(0.4, 0, 0.2, 1) |

### Z-Index

| Token | Value |
|-------|-------|
| `--ds-z-dropdown` | 1000 |
| `--ds-z-sticky` | 1020 |
| `--ds-z-fixed` | 1030 |
| `--ds-z-modal-backdrop` | 1040 |
| `--ds-z-modal` | 1050 |
| `--ds-z-popover` | 1060 |
| `--ds-z-tooltip` | 1070 |
| `--ds-z-toast` | 1080 |

---

## 4. Theming

### Available themes: `light` (default), `dark`, `high-contrast`

Themes are applied via `data-theme` attribute on `<html>`. Switch at runtime using the ThemeProvider context:

```jsx
import { useTheme } from '@/context/ThemeProvider';

function ThemeSwitcher() {
  const { theme, setTheme, toggleTheme, themes } = useTheme();
  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      {themes.map(t => <option key={t} value={t}>{t}</option>)}
    </select>
  );
}
```

The `Providers` component in `src/app/providers.js` wraps the app with `ThemeProvider`. Theme persists in `localStorage` under key `ds-theme`.

### Creating a custom theme

Add a new `[data-theme="your-theme"]` block in `tokens.css` overriding the semantic tokens, then add the theme name to the `THEMES` array in `src/context/ThemeProvider.js`.

---

## 5. Style Guide

### General rules
- **Use semantic tokens** (`--ds-bg-brand`, not `--ds-blue-600`). This ensures theme compatibility.
- **Tailwind CSS 4** is the styling approach. Token values are applied inline via `var()` inside Tailwind arbitrary values: `bg-[var(--ds-bg-primary)]`, `text-[color:var(--ds-text-brand)]`.
  - For font-size tokens, use the `length` hint: `text-[length:var(--ds-text-sm)]`
  - For color tokens in `text-`, use the `color` hint: `text-[color:var(--ds-text-brand)]`
  - For colors without hint ambiguity (bg, border), no hint is needed: `bg-[var(--ds-bg-primary)]`
- **All interactive elements** must include the `ds-focus-ring` class for keyboard accessibility.
- **Transitions** use design tokens: `transition-all duration-[var(--ds-duration-normal)]`.

### Layout patterns
- **App shell:** `Header` (h-14, top) + `SideNav` (w-60 or w-16 collapsed) + main content area.
- **Forms:** Wrap in `<Form>`, group sections with `<FormGroup legend="...">`, pair fields side-by-side with `<FormRow>`, and end with `<FormActions>`.
- **Spacing:** Use Tailwind's spacing utilities. For component internals, the token scale maps to Tailwind: `p-4` = 16px = `--ds-spacing-4`.

### Component patterns
- All form components (`TextInput`, `Select`, `Dropdown`, `DatePicker`, `Checkbox`, `Toggle`, `Search`) support `size="sm|md|lg"` for consistent sizing.
- Error states: pass `errorText` to form controls. It sets red borders, shows error icons, and displays the message below the field.
- Loading states: `Button` has a `loading` prop. `DataTable` has a `loading` prop. Use `Spinner`, `Skeleton`, `SkeletonText`, or `TableSkeleton` for content loading.
- All components forward refs and spread `...props` for extensibility.

### Typography
- Page headings: `text-[length:var(--ds-text-3xl)]` or `text-[length:var(--ds-text-4xl)]` with `font-bold`
- Section headings: `text-[length:var(--ds-text-xl)]` with `font-semibold`
- Body text: `text-[length:var(--ds-text-md)]` (16px default)
- Small / helper text: `text-[length:var(--ds-text-sm)]` or `text-[length:var(--ds-text-xs)]`
- Use `--ds-text-primary` for main content, `--ds-text-secondary` for supporting text, `--ds-text-tertiary` for subdued text.

### Accessibility
- Focus rings via `ds-focus-ring` class (2px solid blue outline with 2px offset).
- Screen reader text via `ds-sr-only` class.
- All interactive components include proper ARIA attributes (`role`, `aria-label`, `aria-expanded`, `aria-modal`, etc.).
- Modal traps focus context and responds to Escape key.
- Color contrast meets WCAG AA in all three themes (high-contrast theme is designed for enhanced contrast).

---

## 6. Quick-Start Example

```jsx
'use client';
import { useState } from 'react';
import {
  Header, SideNav, Button, TextInput, Modal, DataTable,
  Tag, Notification, Form, FormGroup, FormRow, FormActions
} from '@/components';
import { Home, Settings, Users } from 'lucide-react';

export default function DashboardPage() {
  const [sideNavCollapsed, setSideNavCollapsed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      <Header
        productName="Acme Admin"
        navItems={[{ label: 'Dashboard', href: '/', active: true }]}
        actions={<Button size="sm" variant="ghost">Sign out</Button>}
      />
      <div className="flex flex-1 overflow-hidden">
        <SideNav
          collapsed={sideNavCollapsed}
          items={[
            { label: 'Home', icon: <Home size={18} />, href: '/', active: true },
            { label: 'Users', icon: <Users size={18} />, href: '/users' },
            { divider: true, label: 'Config' },
            { label: 'Settings', icon: <Settings size={18} />, href: '/settings' },
          ]}
        />
        <main className="flex-1 overflow-auto p-6">
          <h1 className="text-[length:var(--ds-text-3xl)] font-bold text-[var(--ds-text-primary)] mb-6">
            Dashboard
          </h1>
          <Notification type="info" title="Welcome back">
            You have 3 pending tasks.
          </Notification>
          <div className="mt-6">
            <DataTable
              columns={[
                { key: 'name', header: 'Name' },
                { key: 'status', header: 'Status', render: (v) => <Tag color="success">{v}</Tag> },
              ]}
              data={[{ id: 1, name: 'Project Alpha', status: 'Active' }]}
              paginated
              defaultPageSize={10}
            />
          </div>
          <Button className="mt-4" onClick={() => setModalOpen(true)}>
            Add Item
          </Button>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="New Item"
            footer={<>
              <Button variant="tertiary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button>Save</Button>
            </>}
          >
            <Form>
              <FormRow>
                <TextInput label="Name" required />
                <TextInput label="Email" type="email" />
              </FormRow>
            </Form>
          </Modal>
        </main>
      </div>
    </div>
  );
}
```
