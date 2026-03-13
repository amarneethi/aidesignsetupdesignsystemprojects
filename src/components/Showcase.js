'use client';

import { useState } from 'react';
import { useTheme } from '../context/ThemeProvider';
import {
  Home, Settings, Users, BarChart3, FileText, Bell, User,
  Mail, Shield, Trash2, Edit3, Copy, Download, Plus,
  Sun, Moon, Contrast, Package, Search as SearchIcon,
  DollarSign, UserCheck, TicketCheck, Activity, Filter
} from 'lucide-react';

import {Button} from '@/components';
import {TextInput} from '@/components';
import {Checkbox} from '@/components';
import {Toggle} from '@/components';
import {Select} from '@/components';
import {Tag} from '@/components';
import {Notification, Toast, Banner } from '@/components';
import { Spinner, Skeleton, SkeletonText, TableSkeleton } from '@/components';
import {Header} from '@/components';
import {SideNav} from '@/components';
import {Breadcrumb} from '@/components';
import {Tabs} from '@/components';
import {Modal} from '@/components';
import {Dropdown} from '@/components';
import {OverflowMenu} from '@/components';
import {DatePicker} from '@/components';
import {Form, FormGroup, FormRow, FormActions } from '@/components';
import {Search} from '@/components';
import {DataTable} from '@/components';
import {Pagination} from '@/components';
import {KpiCard} from '@/components';
import {ActivityFeed, NotificationList, RankedList, AvatarList, TableList} from '@/components';
import ChartShowcase from './Charts/ChartShowcase';

/* ---------- Section wrapper ---------- */
function Section({ title, children }) {
  return (
    <section className="mb-12">
      <h2
        className="text-[length:var(--ds-text-2xl)] font-bold text-[var(--ds-text-primary)] mb-6 pb-2 border-b"
        style={{ borderColor: 'var(--ds-border-primary)' }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function SubSection({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="text-[length:var(--ds-text-sm)] font-semibold text-[var(--ds-text-secondary)] uppercase tracking-wider mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

/* ---------- Sample data ---------- */
const SAMPLE_TABLE_DATA = [
  { id: 1, name: 'Alice Johnson', email: 'alice@acme.com', role: 'Admin', status: 'Active', lastLogin: '2026-03-10' },
  { id: 2, name: 'Bob Smith', email: 'bob@acme.com', role: 'Editor', status: 'Active', lastLogin: '2026-03-09' },
  { id: 3, name: 'Carol Williams', email: 'carol@acme.com', role: 'Viewer', status: 'Inactive', lastLogin: '2026-02-15' },
  { id: 4, name: 'Dave Brown', email: 'dave@acme.com', role: 'Editor', status: 'Active', lastLogin: '2026-03-11' },
  { id: 5, name: 'Eve Davis', email: 'eve@acme.com', role: 'Admin', status: 'Pending', lastLogin: '2026-03-08' },
  { id: 6, name: 'Frank Miller', email: 'frank@acme.com', role: 'Viewer', status: 'Active', lastLogin: '2026-03-07' },
  { id: 7, name: 'Grace Wilson', email: 'grace@acme.com', role: 'Editor', status: 'Active', lastLogin: '2026-03-06' },
  { id: 8, name: 'Henry Taylor', email: 'henry@acme.com', role: 'Viewer', status: 'Inactive', lastLogin: '2026-01-20' },
  { id: 9, name: 'Ivy Anderson', email: 'ivy@acme.com', role: 'Admin', status: 'Active', lastLogin: '2026-03-12' },
  { id: 10, name: 'Jack Thomas', email: 'jack@acme.com', role: 'Editor', status: 'Active', lastLogin: '2026-03-05' },
  { id: 11, name: 'Karen Martinez', email: 'karen@acme.com', role: 'Viewer', status: 'Active', lastLogin: '2026-03-04' },
  { id: 12, name: 'Leo Garcia', email: 'leo@acme.com', role: 'Editor', status: 'Pending', lastLogin: '2026-03-03' },
];

const TABLE_COLUMNS = [
  { key: 'name', header: 'Name', minWidth: '160px' },
  { key: 'email', header: 'Email', minWidth: '200px' },
  { key: 'role', header: 'Role', width: '100px' },
  {
    key: 'status',
    header: 'Status',
    width: '120px',
    render: (value) => {
      const color = value === 'Active' ? 'success' : value === 'Pending' ? 'warning' : 'default';
      return <Tag size="sm" color={color}>{value}</Tag>;
    },
  },
  { key: 'lastLogin', header: 'Last Login', width: '130px' },
];

/* ========== MAIN PAGE ========== */
export default function ShowcasePage() {
  const { theme, setTheme, themes } = useTheme();

  // State for interactive demos
  const [modalOpen, setModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [checkA, setCheckA] = useState(true);
  const [checkB, setCheckB] = useState(false);
  const [toggleA, setToggleA] = useState(true);
  const [toggleB, setToggleB] = useState(false);
  const [selectVal, setSelectVal] = useState('');
  const [dropdownVal, setDropdownVal] = useState('');
  const [dateVal, setDateVal] = useState('');
  const [rangeDateVal, setRangeDateVal] = useState('');
  const [rangeDateEnd, setRangeDateEnd] = useState(null);
  const [searchVal, setSearchVal] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState(SAMPLE_TABLE_DATA);
  const [page, setPage] = useState(1);
  const [sideNavCollapsed, setSideNavCollapsed] = useState(false);
  const [inlineNotifs, setInlineNotifs] = useState({ success: true, warning: true, error: true, info: true });

  const themeIcon = theme === 'dark' ? <Sun size={16} /> : theme === 'high-contrast' ? <Contrast size={16} /> : <Moon size={16} />;

  return (
    <div className="min-h-screen bg-[var(--ds-bg-primary)]">
      {/* Banner */}
      {bannerVisible && (
        <Banner type="info" onDismiss={() => setBannerVisible(false)}>
          Welcome to the AI Design System showcase. Switch themes using the toggle in the header.
        </Banner>
      )}

      {/* Header */}
      <Header
        logo={<Package size={24} style={{ color: 'var(--ds-icon-brand)' }} />}
        productName="AI Design System"
        navItems={[
          { label: 'Dashboard', href: '#', active: true, icon: <Home size={16} /> },
          { label: 'Components', href: '#', icon: <Package size={16} /> },
          { label: 'Tokens', href: '#', icon: <Settings size={16} /> },
        ]}
        actions={
          <>
            <button
              onClick={() => setTheme(themes[(themes.indexOf(theme) + 1) % themes.length])}
              className="ds-focus-ring flex items-center gap-2 px-3 py-1.5 rounded-[var(--ds-radius-md)] text-[length:var(--ds-text-sm)] hover:bg-[var(--ds-bg-hover)] transition-colors cursor-pointer"
              style={{ color: 'var(--ds-text-secondary)' }}
            >
              {themeIcon}
              <span className="capitalize">{theme}</span>
            </button>
            <button className="ds-focus-ring p-2 rounded-[var(--ds-radius-md)] hover:bg-[var(--ds-bg-hover)] transition-colors cursor-pointer">
              <Bell size={18} style={{ color: 'var(--ds-icon-secondary)' }} />
            </button>
            <button className="ds-focus-ring p-2 rounded-[var(--ds-radius-md)] hover:bg-[var(--ds-bg-hover)] transition-colors cursor-pointer">
              <User size={18} style={{ color: 'var(--ds-icon-secondary)' }} />
            </button>
          </>
        }
      />

      <div className="flex">
        {/* Side Nav */}
        <SideNav
          collapsed={sideNavCollapsed}
          header={
            !sideNavCollapsed && (
              <button
                onClick={() => setSideNavCollapsed(!sideNavCollapsed)}
                className="text-[color:var(--ds-text-xs)] text-[var(--ds-sidebar-text)] hover:text-[var(--ds-sidebar-text-active)] cursor-pointer"
              >
                Collapse
              </button>
            )
          }
          items={[
            { label: 'Dashboard', icon: <Home size={18} />, active: true },
            { label: 'Analytics', icon: <BarChart3 size={18} />, badge: '3' },
            { label: 'Users', icon: <Users size={18} />, children: [
              { label: 'All Users', href: '#' },
              { label: 'Roles', href: '#' },
              { label: 'Permissions', href: '#' },
            ]},
            { label: 'Reports', icon: <FileText size={18} /> },
            { divider: true, label: 'Settings' },
            { label: 'General', icon: <Settings size={18} /> },
            { label: 'Security', icon: <Shield size={18} /> },
            { label: 'Notifications', icon: <Bell size={18} /> },
          ]}
          footer={
            sideNavCollapsed ? (
              <button
                onClick={() => setSideNavCollapsed(false)}
                className="text-[var(--ds-sidebar-text)] hover:text-[var(--ds-sidebar-text-active)] cursor-pointer p-1"
              >
                {'\u2192'}
              </button>
            ) : null
          }
        />

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto min-h-[calc(100vh-56px)]">
          <div className="max-w-5xl mx-auto">
            {/* Page title */}
            <div className="mb-8">
              <Breadcrumb
                items={[
                  { label: 'Home', href: '#', icon: <Home size={14} /> },
                  { label: 'Components', href: '#' },
                  { label: 'Showcase' },
                ]}
              />
              <h1 className="text-[length:var(--ds-text-4xl)] font-bold text-[var(--ds-text-primary)] mt-4">
                Component Showcase
              </h1>
              <p className="text-[length:var(--ds-text-lg)] text-[var(--ds-text-secondary)] mt-2">
                All 20 design system components with live theming support.
              </p>
            </div>

            {/* ===== BUTTON ===== */}
            <Section title="Button">
              <SubSection title="Variants">
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="tertiary">Tertiary</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </SubSection>
              <SubSection title="Sizes">
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </SubSection>
              <SubSection title="States">
                <div className="flex flex-wrap items-center gap-3">
                  <Button icon={<Plus size={16} />}>With Icon</Button>
                  <Button icon={<Download size={16} />} iconPosition="right">Icon Right</Button>
                  <Button loading>Loading</Button>
                  <Button disabled>Disabled</Button>
                  <Button variant="danger" icon={<Trash2 size={16} />}>Delete</Button>
                </div>
              </SubSection>
            </Section>

            {/* ===== TEXT INPUT ===== */}
            <Section title="Text Input">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <TextInput label="Default" placeholder="Enter text..." />
                <TextInput label="With Icon" placeholder="Search..." icon={<SearchIcon size={16} />} />
                <TextInput label="Required" placeholder="Required field" required />
                <TextInput label="Error State" placeholder="Invalid input" errorText="This field is required" defaultValue="bad value" />
                <TextInput label="Success State" placeholder="Valid input" successText="Looks good!" defaultValue="valid" />
                <TextInput label="Disabled" placeholder="Cannot edit" disabled />
              </div>
            </Section>

            {/* ===== CHECKBOX ===== */}
            <Section title="Checkbox">
              <div className="flex flex-wrap items-start gap-6">
                <Checkbox label="Checked" checked={checkA} onChange={(e) => setCheckA(e.target.checked)} />
                <Checkbox label="Unchecked" checked={checkB} onChange={(e) => setCheckB(e.target.checked)} />
                <Checkbox label="Indeterminate" indeterminate checked={false} onChange={() => {}} />
                <Checkbox label="Disabled" disabled checked />
                <Checkbox label="Small" size="sm" checked onChange={() => {}} />
                <Checkbox label="Large" size="lg" checked onChange={() => {}} />
              </div>
            </Section>

            {/* ===== TOGGLE ===== */}
            <Section title="Toggle">
              <div className="flex flex-wrap items-start gap-6">
                <Toggle label="Enabled" checked={toggleA} onChange={(e) => setToggleA(e.target.checked)} />
                <Toggle label="Disabled state" checked={toggleB} onChange={(e) => setToggleB(e.target.checked)} />
                <Toggle label="Disabled" disabled checked />
                <Toggle label="Small" size="sm" checked onChange={() => {}} />
                <Toggle label="Large" size="lg" checked onChange={() => {}} />
              </div>
            </Section>

            {/* ===== SELECT ===== */}
            <Section title="Select">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <Select
                  label="Role"
                  options={[
                    { value: 'admin', label: 'Admin' },
                    { value: 'editor', label: 'Editor' },
                    { value: 'viewer', label: 'Viewer' },
                  ]}
                  value={selectVal}
                  onChange={(e) => setSelectVal(e.target.value)}
                  placeholder="Choose a role"
                />
                <Select
                  label="Disabled"
                  options={['Option A', 'Option B']}
                  disabled
                />
              </div>
            </Section>

            {/* ===== DROPDOWN ===== */}
            <Section title="Dropdown">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <Dropdown
                  label="Priority"
                  options={[
                    { value: 'high', label: 'High' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'low', label: 'Low' },
                  ]}
                  value={dropdownVal}
                  onChange={setDropdownVal}
                  placeholder="Select priority"
                />
                <Dropdown
                  label="With Error"
                  options={['Option 1', 'Option 2']}
                  errorText="Selection required"
                />
              </div>
            </Section>

            {/* ===== TAG ===== */}
            <Section title="Tag">
              <SubSection title="Colors">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag color="default">Default</Tag>
                  <Tag color="brand">Brand</Tag>
                  <Tag color="success">Success</Tag>
                  <Tag color="warning">Warning</Tag>
                  <Tag color="danger">Danger</Tag>
                  <Tag color="info">Info</Tag>
                </div>
              </SubSection>
              <SubSection title="Outline & Dismissible">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag color="brand" outline>Outline</Tag>
                  <Tag color="success" outline>Success</Tag>
                  <Tag color="danger" dismissible onDismiss={() => {}}>Dismissible</Tag>
                  <Tag size="sm" color="info">Small</Tag>
                  <Tag size="lg" color="warning">Large</Tag>
                </div>
              </SubSection>
            </Section>

            {/* ===== NOTIFICATION ===== */}
            <Section title="Notification">
              <SubSection title="Inline">
                <div className="flex flex-col gap-3 max-w-2xl">
                  {inlineNotifs.success && (
                    <Notification type="success" title="Success" onDismiss={() => setInlineNotifs(n => ({...n, success: false}))}>
                      Record saved successfully.
                    </Notification>
                  )}
                  {inlineNotifs.warning && (
                    <Notification type="warning" title="Warning" onDismiss={() => setInlineNotifs(n => ({...n, warning: false}))}>
                      Your session will expire in 5 minutes.
                    </Notification>
                  )}
                  {inlineNotifs.error && (
                    <Notification type="error" title="Error" onDismiss={() => setInlineNotifs(n => ({...n, error: false}))}>
                      Failed to save changes. Please try again.
                    </Notification>
                  )}
                  {inlineNotifs.info && (
                    <Notification type="info" title="Info" onDismiss={() => setInlineNotifs(n => ({...n, info: false}))}>
                      A new version is available. Update when ready.
                    </Notification>
                  )}
                </div>
              </SubSection>
              <SubSection title="Toast">
                <Button variant="secondary" onClick={() => setToastVisible(true)}>
                  Show Toast
                </Button>
                <Toast
                  type="success"
                  title="Changes saved"
                  visible={toastVisible}
                  onClose={() => setToastVisible(false)}
                >
                  All changes have been saved successfully.
                </Toast>
              </SubSection>
            </Section>

            {/* ===== LOADING / SKELETON ===== */}
            <Section title="Loading / Skeleton">
              <SubSection title="Spinners">
                <div className="flex items-center gap-6">
                  <Spinner size="sm" />
                  <Spinner size="md" />
                  <Spinner size="lg" />
                  <Spinner size="xl" />
                </div>
              </SubSection>
              <SubSection title="Skeleton Shapes">
                <div className="flex gap-4 items-start max-w-md">
                  <Skeleton variant="circular" width="48px" height="48px" />
                  <div className="flex-1">
                    <Skeleton variant="text" height="1rem" width="60%" style={{ marginBottom: '0.5rem' }} />
                    <SkeletonText lines={3} />
                  </div>
                </div>
              </SubSection>
              <SubSection title="Table Skeleton">
                <div className="max-w-2xl border rounded-lg overflow-hidden" style={{ borderColor: 'var(--ds-table-border)' }}>
                  <TableSkeleton rows={3} columns={4} />
                </div>
              </SubSection>
            </Section>

            {/* ===== TABS ===== */}
            <Section title="Tabs">
              <SubSection title="Underline Variant">
                <Tabs
                  tabs={[
                    { id: 'overview', label: 'Overview', content: <p className="text-[var(--ds-text-secondary)]">Overview content goes here. This tab shows a high-level summary.</p> },
                    { id: 'details', label: 'Details', badge: 5, content: <p className="text-[var(--ds-text-secondary)]">Detailed information with a badge indicating 5 items.</p> },
                    { id: 'settings', label: 'Settings', content: <p className="text-[var(--ds-text-secondary)]">Configuration and settings for this resource.</p> },
                    { id: 'disabled', label: 'Disabled', disabled: true, content: null },
                  ]}
                />
              </SubSection>
              <SubSection title="Pill Variant">
                <Tabs
                  variant="pill"
                  tabs={[
                    { id: 'all', label: 'All', content: <p className="text-[var(--ds-text-secondary)]">Showing all items.</p> },
                    { id: 'active', label: 'Active', badge: 8, content: <p className="text-[var(--ds-text-secondary)]">Showing active items only.</p> },
                    { id: 'archived', label: 'Archived', content: <p className="text-[var(--ds-text-secondary)]">Showing archived items.</p> },
                  ]}
                />
              </SubSection>
            </Section>

            {/* ===== MODAL ===== */}
            <Section title="Modal">
              <Button variant="primary" onClick={() => setModalOpen(true)}>
                Open Modal
              </Button>
              <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Confirm Action"
                footer={
                  <>
                    <Button variant="tertiary" onClick={() => setModalOpen(false)}>Cancel</Button>
                    <Button variant="primary" onClick={() => setModalOpen(false)}>Confirm</Button>
                  </>
                }
              >
                <p className="text-[var(--ds-text-secondary)]">
                  Are you sure you want to proceed? This action will update the record and notify all team members.
                </p>
              </Modal>
            </Section>

            {/* ===== OVERFLOW MENU ===== */}
            <Section title="Overflow Menu">
              <div className="flex items-center gap-6">
                <OverflowMenu
                  items={[
                    { label: 'Edit', icon: <Edit3 size={14} />, onClick: () => {} },
                    { label: 'Copy', icon: <Copy size={14} />, shortcut: '\u2318C', onClick: () => {} },
                    { label: 'Download', icon: <Download size={14} />, onClick: () => {} },
                    { divider: true },
                    { label: 'Delete', icon: <Trash2 size={14} />, danger: true, onClick: () => {} },
                  ]}
                />
                <span className="text-[length:var(--ds-text-sm)] text-[var(--ds-text-secondary)]">{'\u2190'} Click the menu icon</span>
              </div>
            </Section>

            {/* ===== DATE PICKER ===== */}
            <Section title="Date Picker">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <DatePicker
                  label="Single Date"
                  value={dateVal}
                  onChange={setDateVal}
                  placeholder="Pick a date"
                />
                <DatePicker
                  label="Date Range"
                  mode="range"
                  value={rangeDateVal}
                  rangeEnd={rangeDateEnd}
                  onChange={setRangeDateVal}
                  onRangeChange={(s, e) => { setRangeDateVal(s); setRangeDateEnd(e); }}
                  placeholder="Start \u2192 End"
                />
              </div>
            </Section>

            {/* ===== SEARCH ===== */}
            <Section title="Search">
              <div className="max-w-md">
                <Search
                  value={searchVal}
                  onChange={setSearchVal}
                  onSearch={(v) => console.log('Search:', v)}
                  placeholder="Search users, roles, reports..."
                  suggestions={
                    searchVal.length > 0
                      ? [
                          { label: `Users matching "${searchVal}"`, description: '12 results' },
                          { label: `Reports containing "${searchVal}"`, description: '3 results' },
                        ]
                      : []
                  }
                />
              </div>
            </Section>

            {/* ===== FORM ===== */}
            <Section title="Form">
              <div className="max-w-2xl border rounded-[var(--ds-radius-lg)] p-6" style={{ borderColor: 'var(--ds-border-primary)' }}>
                <Form onSubmit={() => alert('Form submitted!')}>
                  <FormGroup legend="Personal Information">
                    <FormRow>
                      <TextInput label="First Name" placeholder="Jane" required />
                      <TextInput label="Last Name" placeholder="Doe" required />
                    </FormRow>
                    <TextInput label="Email" type="email" placeholder="jane@company.com" required />
                  </FormGroup>
                  <FormGroup legend="Preferences">
                    <FormRow>
                      <Select
                        label="Department"
                        options={[
                          { value: 'eng', label: 'Engineering' },
                          { value: 'design', label: 'Design' },
                          { value: 'pm', label: 'Product' },
                        ]}
                        placeholder="Select department"
                      />
                      <Select
                        label="Role"
                        options={[
                          { value: 'admin', label: 'Admin' },
                          { value: 'member', label: 'Member' },
                        ]}
                        placeholder="Select role"
                      />
                    </FormRow>
                    <Toggle label="Enable email notifications" checked={toggleA} onChange={(e) => setToggleA(e.target.checked)} />
                    <Checkbox label="I agree to the terms and conditions" checked={checkA} onChange={(e) => setCheckA(e.target.checked)} />
                  </FormGroup>
                  <FormActions>
                    <Button variant="tertiary">Cancel</Button>
                    <Button variant="primary" type="submit">Save</Button>
                  </FormActions>
                </Form>
              </div>
            </Section>

            {/* ===== PAGINATION (standalone) ===== */}
            <Section title="Pagination">
              <Pagination
                currentPage={page}
                totalPages={10}
                totalItems={96}
                pageSize={10}
                onPageChange={setPage}
                showItemCount
                showPageSizeSelector
              />
            </Section>

            {/* ===== DATA TABLE ===== */}
            <Section title="Data Table">
              <p className="text-[length:var(--ds-text-sm)] text-[var(--ds-text-secondary)] mb-4">
                Features: sorting (click headers), selection (checkboxes), inline editing (double-click Name/Email), pagination, and batch actions.
              </p>
              <DataTable
                columns={TABLE_COLUMNS}
                data={tableData}
                selectable
                selectedRows={selectedRows}
                onSelectionChange={setSelectedRows}
                paginated
                defaultPageSize={5}
                editableColumns={['name', 'email']}
                onCellEdit={(rowIdx, colKey, newValue) => {
                  setTableData((prev) => {
                    const updated = [...prev];
                    updated[rowIdx] = { ...updated[rowIdx], [colKey]: newValue };
                    return updated;
                  });
                }}
                batchActions={
                  <>
                    <Button size="sm" variant="secondary" icon={<Mail size={14} />}>
                      Email
                    </Button>
                    <Button size="sm" variant="danger" icon={<Trash2 size={14} />}>
                      Delete
                    </Button>
                  </>
                }
                striped
              />
            </Section>

            {/* ===== CHARTS ===== */}
            <Section title="Charts">
              <p className="text-[length:var(--ds-text-sm)] text-[var(--ds-text-secondary)] mb-6">
                28 chart variants across 6 chart types — Bar, Line, Area, Pie/Donut, Composed, and Radial/Gauge. All charts support light, dark, and high-contrast themes.
              </p>
              <ChartShowcase />
            </Section>

            {/* ===== KPI CARD ===== */}
            <Section title="KPI Card">
              <SubSection title="Simple">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <KpiCard label="Total Revenue" value="$48,290" />
                  <KpiCard label="Active Users" value="2,847" />
                  <KpiCard label="Open Tickets" value="142" />
                  <KpiCard label="Avg Response" value="1.4h" />
                </div>
              </SubSection>
              <SubSection title="With Trend">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <KpiCard label="Revenue" value="$48,290" variant="with-trend" trendData={[20, 25, 22, 30, 28, 35, 40, 38, 45, 48]} />
                  <KpiCard label="Sessions" value="12,483" variant="with-trend" trendData={[100, 120, 90, 110, 130, 125, 140, 150, 145, 160]} trendColor="var(--ds-text-success)" />
                  <KpiCard label="Bounce Rate" value="34.2%" variant="with-trend" trendData={[45, 42, 38, 40, 36, 34, 37, 35, 33, 34]} trendColor="var(--ds-text-danger)" />
                </div>
              </SubSection>
              <SubSection title="With Delta">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <KpiCard label="Revenue" value="$48,290" variant="with-delta" delta={12.5} deltaLabel="vs last month" />
                  <KpiCard label="Users" value="2,847" variant="with-delta" delta={-3.2} deltaLabel="vs last week" />
                  <KpiCard label="Orders" value="1,024" variant="with-delta" delta={0} deltaLabel="no change" />
                  <KpiCard label="Items Sold" value="8,491" variant="with-delta" delta={340} deltaFormat="absolute" deltaLabel="vs yesterday" />
                </div>
              </SubSection>
              <SubSection title="With Progress">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <KpiCard label="Q1 Target" value="$48,290" variant="with-progress" progress={72} target="$67,000" progressType="bar" />
                  <KpiCard label="Sprint Velocity" value="84 pts" variant="with-progress" progress={84} target="100 pts" progressType="bar" progressColor="var(--ds-text-success)" />
                  <KpiCard label="Disk Usage" value="142 GB" variant="with-progress" progress={62} progressType="ring" />
                  <KpiCard label="Quota" value="8,491" variant="with-progress" progress={93} progressType="ring" progressColor="var(--ds-text-danger)" />
                </div>
              </SubSection>
              <SubSection title="With Icon">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <KpiCard label="Revenue" value="$48,290" variant="with-icon" icon={<DollarSign size={20} />} iconColor="var(--ds-green-500)" />
                  <KpiCard label="Active Users" value="2,847" variant="with-icon" icon={<UserCheck size={20} />} iconColor="var(--ds-blue-500)" />
                  <KpiCard label="Open Tickets" value="142" variant="with-icon" icon={<TicketCheck size={20} />} iconColor="var(--ds-amber-500)" />
                  <KpiCard label="Uptime" value="99.98%" variant="with-icon" icon={<Activity size={20} />} iconColor="var(--ds-teal-500)" />
                </div>
              </SubSection>
            </Section>

            {/* ===== LIST / FEED ===== */}
            <Section title="List / Feed">
              <SubSection title="Activity Feed">
                <div className="max-w-xl border rounded-[var(--ds-radius-lg)] overflow-hidden" style={{ borderColor: 'var(--ds-border-primary)', backgroundColor: 'var(--ds-bg-primary)' }}>
                  <ActivityFeed
                    items={[
                      { content: 'John closed deal "Acme Enterprise" for $24,000', timestamp: 'Today at 2:14 PM', color: 'var(--ds-green-500)' },
                      { content: 'Sarah added 3 new contacts to "Globex Corp"', timestamp: 'Today at 1:45 PM', color: 'var(--ds-blue-500)' },
                      { content: 'Mike updated the Q1 forecast to $1.2M', timestamp: 'Today at 11:30 AM', color: 'var(--ds-amber-500)' },
                      { content: 'Lisa assigned ticket #482 to the engineering team', timestamp: 'Yesterday at 4:52 PM', color: 'var(--ds-teal-500)' },
                      { content: 'System backup completed successfully', timestamp: 'Yesterday at 2:00 AM', color: 'var(--ds-gray-400)' },
                    ]}
                  />
                </div>
              </SubSection>

              <SubSection title="Notification List">
                <div className="max-w-xl border rounded-[var(--ds-radius-lg)] overflow-hidden" style={{ borderColor: 'var(--ds-border-primary)', backgroundColor: 'var(--ds-bg-primary)' }}>
                  <NotificationList
                    items={[
                      { title: 'Deployment succeeded', description: 'v2.4.1 deployed to production', severity: 'success', timestamp: '5 min ago' },
                      { title: 'High CPU usage detected', description: 'Server us-east-1 at 92% for 10 minutes', severity: 'warning', timestamp: '12 min ago', unread: true },
                      { title: 'Payment failed', description: 'Invoice #1042 charge declined', severity: 'error', timestamp: '1 hour ago', unread: true },
                      { title: 'New team member added', description: 'alex@company.com joined the Design team', severity: 'info', timestamp: '3 hours ago' },
                    ]}
                  />
                </div>
              </SubSection>

              <SubSection title="Ranked List">
                <div className="max-w-md border rounded-[var(--ds-radius-lg)] overflow-hidden" style={{ borderColor: 'var(--ds-border-primary)', backgroundColor: 'var(--ds-bg-primary)' }}>
                  <RankedList
                    items={[
                      { label: 'Acme Corporation', sublabel: 'Enterprise', value: '$142K' },
                      { label: 'Globex Inc.', sublabel: 'Mid-market', value: '$98K' },
                      { label: 'Initech LLC', sublabel: 'Enterprise', value: '$87K' },
                      { label: 'Hooli Systems', sublabel: 'Startup', value: '$64K' },
                      { label: 'Pied Piper', sublabel: 'Startup', value: '$51K' },
                    ]}
                  />
                </div>
              </SubSection>

              <SubSection title="With Avatar">
                <div className="max-w-md border rounded-[var(--ds-radius-lg)] overflow-hidden" style={{ borderColor: 'var(--ds-border-primary)', backgroundColor: 'var(--ds-bg-primary)' }}>
                  <AvatarList
                    items={[
                      { name: 'Alice Johnson', description: 'Closed 12 deals this month', meta: '2m ago' },
                      { name: 'Bob Smith', description: 'Updated pipeline forecast', meta: '15m ago' },
                      { name: 'Carol Williams', description: 'Added 5 new leads', meta: '1h ago' },
                      { name: 'Dave Brown', description: 'Completed onboarding', meta: '3h ago' },
                    ]}
                  />
                </div>
              </SubSection>

              <SubSection title="With Table">
                <div className="border rounded-[var(--ds-radius-lg)] overflow-hidden p-4" style={{ borderColor: 'var(--ds-border-primary)', backgroundColor: 'var(--ds-bg-primary)' }}>
                  <TableList
                    sortable
                    columns={[
                      { key: 'name', header: 'Account', icon: <Users size={12} /> },
                      { key: 'deal', header: 'Deal' },
                      { key: 'value', header: 'Value', width: '100px' },
                      {
                        key: 'status',
                        header: 'Status',
                        width: '120px',
                        render: (val) => {
                          const c = val === 'Won' ? 'success' : val === 'Lost' ? 'danger' : 'warning';
                          return <Tag size="sm" color={c}>{val}</Tag>;
                        },
                      },
                    ]}
                    data={[
                      { id: 1, name: 'Acme Corp', deal: 'Enterprise License', value: '$24,000', status: 'Won' },
                      { id: 2, name: 'Globex Inc', deal: 'Pro Plan Upgrade', value: '$12,500', status: 'Negotiating' },
                      { id: 3, name: 'Initech', deal: 'API Access', value: '$8,200', status: 'Won' },
                      { id: 4, name: 'Hooli', deal: 'Starter Plan', value: '$3,400', status: 'Lost' },
                      { id: 5, name: 'Pied Piper', deal: 'Custom Integration', value: '$18,000', status: 'Negotiating' },
                    ]}
                    actions={
                      <>
                        <Button size="sm" variant="secondary" icon={<Filter size={14} />}>Filter</Button>
                        <Dropdown
                          options={[
                            { value: 'all', label: 'All Statuses' },
                            { value: 'won', label: 'Won' },
                            { value: 'lost', label: 'Lost' },
                            { value: 'negotiating', label: 'Negotiating' },
                          ]}
                          placeholder="Status"
                          size="sm"
                        />
                      </>
                    }
                  />
                </div>
              </SubSection>
            </Section>

            {/* ===== BREADCRUMB ===== */}
            <Section title="Breadcrumb">
              <div className="flex flex-col gap-4">
                <Breadcrumb
                  items={[
                    { label: 'Home', href: '#', icon: <Home size={14} /> },
                    { label: 'Projects', href: '#' },
                    { label: 'Acme Corp', href: '#' },
                    { label: 'Settings' },
                  ]}
                />
              </div>
            </Section>

            {/* ===== HEADER (inline demo) ===== */}
            <Section title="Header">
              <div className="border rounded-[var(--ds-radius-lg)] overflow-hidden" style={{ borderColor: 'var(--ds-border-primary)' }}>
                <Header
                  productName="Acme Dashboard"
                  navItems={[
                    { label: 'Home', active: true },
                    { label: 'Reports' },
                    { label: 'Team' },
                  ]}
                  actions={
                    <Button size="sm" variant="primary" icon={<Plus size={14} />}>
                      New Report
                    </Button>
                  }
                />
              </div>
              <p className="text-[length:var(--ds-text-xs)] text-[var(--ds-text-tertiary)] mt-2">
                The main header with theme toggle is shown at the top of this page.
              </p>
            </Section>

            {/* ===== SIDE NAV (inline demo) ===== */}
            <Section title="Side Nav">
              <div className="border rounded-[var(--ds-radius-lg)] overflow-hidden h-64 flex" style={{ borderColor: 'var(--ds-border-primary)' }}>
                <SideNav
                  items={[
                    { label: 'Home', icon: <Home size={18} />, active: true },
                    { label: 'Analytics', icon: <BarChart3 size={18} /> },
                    { label: 'Team', icon: <Users size={18} />, badge: '2' },
                    { divider: true, label: 'Admin' },
                    { label: 'Settings', icon: <Settings size={18} /> },
                  ]}
                />
                <div className="flex-1 flex items-center justify-center text-[var(--ds-text-tertiary)] text-[length:var(--ds-text-sm)]">
                  Main content area
                </div>
              </div>
              <p className="text-[length:var(--ds-text-xs)] text-[var(--ds-text-tertiary)] mt-2">
                The full side nav with collapsible sections is shown on the left side of this page.
              </p>
            </Section>
          </div>
        </main>
      </div>
    </div>
  );
}
