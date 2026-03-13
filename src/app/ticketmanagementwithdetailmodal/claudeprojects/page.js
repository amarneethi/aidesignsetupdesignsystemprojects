'use client';
import { useState, useMemo } from 'react';
import {
  Button, DataTable, Tag, Search, Tabs, Dropdown,
  Breadcrumb, OverflowMenu, Pagination
} from '@/components';
import {
  Inbox, Plus, ArrowLeft, Clock, AlertCircle, CheckCircle2,
  MessageSquare, Paperclip, Send, X, Tag as TagIcon, User,
  Mail, Phone, ExternalLink, RefreshCw, Zap, CircleDot,
  ArrowUpRight, TrendingUp, Timer, FileText
} from 'lucide-react';

/* ─── deterministic PRNG (mulberry32) ─── */
function mulberry32(seed) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ─── sample data ─── */
const AGENTS = ['Priya Sharma', 'Leo Chen', 'Maria Santos', 'James Wright', 'Aisha Patel'];
const CUSTOMERS = [
  { name: 'Ravi Mehta', email: 'ravi@acme.co', phone: '+91 98765 43210', company: 'Acme Corp' },
  { name: 'Sarah Kim', email: 'sarah@globex.io', phone: '+1 415-555-0142', company: 'Globex Inc' },
  { name: 'Tomás Herrera', email: 'tomas@initech.com', phone: '+34 612 345 678', company: 'Initech' },
  { name: 'Lena Müller', email: 'lena@hooli.de', phone: '+49 170 1234567', company: 'Hooli GmbH' },
  { name: 'David Okafor', email: 'david@piedpiper.ng', phone: '+234 801 234 5678', company: 'Pied Piper' },
  { name: 'Yuki Tanaka', email: 'yuki@soylent.jp', phone: '+81 90-1234-5678', company: 'Soylent Corp' },
  { name: 'Chloe Dubois', email: 'chloe@umbrella.fr', phone: '+33 6 12 34 56 78', company: 'Umbrella LLC' },
  { name: 'Amit Joshi', email: 'amit@wayneent.in', phone: '+91 87654 32100', company: 'Wayne Enterprises' },
];

const PRIORITIES = ['Critical', 'High', 'Medium', 'Low'];
const STATUSES = ['Open', 'In Progress', 'Awaiting Customer', 'Resolved', 'Closed'];
const CATEGORIES = ['Billing', 'Technical', 'Account Access', 'Feature Request', 'Bug Report', 'General Inquiry'];

const SUBJECTS = [
  'Cannot access dashboard after password reset',
  'Billing discrepancy on latest invoice',
  'API rate limiting causing service interruption',
  'Feature request: bulk export to CSV',
  'Login redirect loop on mobile browsers',
  'Webhook delivery failures since last update',
  'Account permissions not syncing across teams',
  'SSL certificate warning on custom domain',
  'Data import failing for large CSV files',
  'Two-factor auth codes not arriving via SMS',
  'Search indexing delay exceeding 24 hours',
  'Custom report builder crashes on date filters',
  'Integration with Slack workspace disconnected',
  'Audit log missing entries from last week',
  'User unable to upgrade subscription plan',
  'Email notifications arriving with 3-hour delay',
  'Dashboard widgets loading blank after update',
  'API documentation missing v3 endpoints',
  'SAML SSO configuration error for Okta',
  'Automated backup job stuck in pending state',
];

/* Fixed base timestamp: 2026-03-13T12:00:00Z */
const BASE_TS = 1773496800000;

function generateMessages(rand, createdTs, customerName) {
  const msgs = [
    { sender: customerName, role: 'customer', body: 'Hi, I\'m experiencing an issue and need help resolving it urgently. I\'ve tried the usual troubleshooting steps but nothing seems to work. Could someone look into this?' },
    { sender: 'Priya Sharma', role: 'agent', body: 'Thanks for reaching out. I\'ve escalated this to the engineering team and we\'re actively investigating. Can you share any error messages or screenshots you\'re seeing?' },
    { sender: customerName, role: 'customer', body: 'Sure, I\'ve attached a screenshot of the error. It seems to happen every time I try the same action. It started yesterday afternoon.' },
    { sender: 'Leo Chen', role: 'agent', body: 'I\'ve identified the root cause — it\'s related to a recent configuration change. Pushing a fix now. Should be resolved within the hour.' },
  ];
  return msgs.map((m, i) => ({
    ...m,
    timestamp: new Date(createdTs + i * 3600000 * (1 + rand() * 2)).toISOString(),
  }));
}

function generateTickets(count = 42) {
  const rand = mulberry32(12345);
  const tickets = [];
  for (let i = 0; i < count; i++) {
    const createdTs = BASE_TS - rand() * 30 * 86400000;
    const updatedTs = createdTs + rand() * (BASE_TS - createdTs);
    const customer = CUSTOMERS[i % CUSTOMERS.length];
    const status = STATUSES[Math.floor(rand() * STATUSES.length)];
    tickets.push({
      id: `TKT-${String(1000 + i).padStart(4, '0')}`,
      subject: SUBJECTS[i % SUBJECTS.length],
      customer,
      priority: PRIORITIES[Math.floor(rand() * PRIORITIES.length)],
      status,
      category: CATEGORIES[Math.floor(rand() * CATEGORIES.length)],
      assignee: AGENTS[Math.floor(rand() * AGENTS.length)],
      created: new Date(createdTs).toISOString(),
      updated: new Date(updatedTs).toISOString(),
      sla: status === 'Resolved' || status === 'Closed' ? 'Met' : rand() > 0.3 ? 'On Track' : 'At Risk',
      messages: generateMessages(rand, createdTs, customer.name),
    });
  }
  return tickets.sort((a, b) => new Date(b.created) - new Date(a.created));
}

const ALL_TICKETS = generateTickets();

/* ─── helpers ─── */
function timeAgo(iso) {
  const diff = BASE_TS - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const priorityColor = { Critical: 'danger', High: 'warning', Medium: 'info', Low: 'default' };
const statusColor = { Open: 'brand', 'In Progress': 'info', 'Awaiting Customer': 'warning', Resolved: 'success', Closed: 'default' };
const slaColor = { Met: 'success', 'On Track': 'info', 'At Risk': 'danger' };

/* ─── stat card ─── */
function StatCard({ icon, label, value, trend, trendUp }) {
  return (
    <div className="rounded-[var(--ds-radius-xl)] bg-[var(--ds-bg-primary)] border border-[var(--ds-border-secondary)] p-5 flex flex-col gap-3 hover:shadow-[var(--ds-shadow-md)] transition-shadow duration-[var(--ds-duration-normal)]">
      <div className="flex items-center justify-between">
        <span className="text-[length:var(--ds-text-sm)] font-medium text-[color:var(--ds-text-secondary)]">{label}</span>
        <div className="w-9 h-9 rounded-[var(--ds-radius-lg)] bg-[var(--ds-bg-brand)] bg-opacity-10 flex items-center justify-center text-[var(--ds-icon-brand)]">
          {icon}
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-[length:var(--ds-text-3xl)] font-bold text-[color:var(--ds-text-primary)] leading-none">{value}</span>
        {trend && (
          <span className={`text-[length:var(--ds-text-xs)] font-medium flex items-center gap-0.5 mb-1 ${trendUp ? 'text-[color:var(--ds-text-success)]' : 'text-[color:var(--ds-text-danger)]'}`}>
            {trendUp ? <ArrowUpRight size={12} /> : <TrendingUp size={12} className="rotate-180" />}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── detail view ─── */
function TicketDetail({ ticket, onBack }) {
  const [reply, setReply] = useState('');
  const [activeTab, setActiveTab] = useState('conversation');

  return (
    <div className="flex flex-col h-full">
      {/* detail header */}
      <div className="shrink-0 border-b border-[var(--ds-border-secondary)] bg-[var(--ds-bg-primary)] px-6 py-4">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onBack}
            className="ds-focus-ring w-8 h-8 rounded-[var(--ds-radius-md)] flex items-center justify-center hover:bg-[var(--ds-bg-hover)] transition-colors duration-[var(--ds-duration-fast)] text-[var(--ds-icon-secondary)]"
          >
            <ArrowLeft size={18} />
          </button>
          <Breadcrumb items={[
            { label: 'Tickets', href: '#', icon: <Inbox size={14} /> },
            { label: ticket.id },
          ]} />
        </div>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h2 className="text-[length:var(--ds-text-xl)] font-semibold text-[color:var(--ds-text-primary)] leading-snug mb-2">
              {ticket.subject}
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Tag color={priorityColor[ticket.priority]} size="sm">{ticket.priority}</Tag>
              <Tag color={statusColor[ticket.status]} size="sm">{ticket.status}</Tag>
              <Tag color={slaColor[ticket.sla]} size="sm" outline>SLA: {ticket.sla}</Tag>
              <Tag size="sm" icon={<TagIcon size={12} />}>{ticket.category}</Tag>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="secondary" size="sm" icon={<RefreshCw size={14} />}>Update Status</Button>
            <Button variant="primary" size="sm" icon={<User size={14} />}>Reassign</Button>
            <OverflowMenu
              size="sm"
              items={[
                { label: 'Merge Tickets', icon: <Zap size={14} />, onClick: () => {} },
                { label: 'View Audit Log', icon: <FileText size={14} />, onClick: () => {} },
                { divider: true },
                { label: 'Close Ticket', icon: <X size={14} />, onClick: () => {}, danger: true },
              ]}
            />
          </div>
        </div>
      </div>

      {/* detail body */}
      <div className="flex-1 overflow-hidden flex">
        {/* left: conversation */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs
            tabs={[
              { id: 'conversation', label: 'Conversation', icon: <MessageSquare size={14} /> },
              { id: 'activity', label: 'Activity Log', icon: <Clock size={14} /> },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="underline"
            size="sm"
          />

          {activeTab === 'conversation' ? (
            <>
              <div className="flex-1 overflow-auto p-6 space-y-5">
                {ticket.messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'agent' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-[length:var(--ds-text-xs)] font-semibold ${
                      msg.role === 'agent'
                        ? 'bg-[var(--ds-bg-brand)] text-[color:var(--ds-text-on-brand)]'
                        : 'bg-[var(--ds-bg-tertiary)] text-[color:var(--ds-text-secondary)]'
                    }`}>
                      {msg.sender.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className={`max-w-[70%] rounded-[var(--ds-radius-xl)] px-4 py-3 ${
                      msg.role === 'agent'
                        ? 'bg-[var(--ds-bg-brand)] text-[color:var(--ds-text-on-brand)]'
                        : 'bg-[var(--ds-bg-secondary)] text-[color:var(--ds-text-primary)]'
                    }`}>
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className={`text-[length:var(--ds-text-xs)] font-semibold ${msg.role === 'agent' ? 'opacity-80' : 'text-[color:var(--ds-text-secondary)]'}`}>
                          {msg.sender}
                        </span>
                        <span className={`text-[length:var(--ds-text-xs)] ${msg.role === 'agent' ? 'opacity-60' : 'text-[color:var(--ds-text-tertiary)]'}`}>
                          {timeAgo(msg.timestamp)}
                        </span>
                      </div>
                      <p className="text-[length:var(--ds-text-sm)] leading-relaxed">{msg.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* reply box */}
              <div className="shrink-0 border-t border-[var(--ds-border-secondary)] p-4 bg-[var(--ds-bg-primary)]">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Type your reply…"
                      rows={2}
                      className="ds-focus-ring w-full resize-none rounded-[var(--ds-radius-lg)] border border-[var(--ds-input-border)] bg-[var(--ds-input-bg)] px-4 py-3 text-[length:var(--ds-text-sm)] text-[color:var(--ds-text-primary)] placeholder:text-[color:var(--ds-text-placeholder)] focus:border-[var(--ds-border-focus)] transition-colors duration-[var(--ds-duration-fast)]"
                    />
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button size="sm" variant="ghost" icon={<Paperclip size={16} />} />
                    <Button size="sm" icon={<Send size={16} />} disabled={!reply.trim()} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 overflow-auto p-6">
              <div className="space-y-4">
                {[
                  { action: 'Ticket created', by: ticket.customer.name, time: ticket.created },
                  { action: `Assigned to ${ticket.assignee}`, by: 'System', time: ticket.created },
                  { action: `Priority set to ${ticket.priority}`, by: ticket.assignee, time: ticket.created },
                  { action: `Status changed to ${ticket.status}`, by: ticket.assignee, time: ticket.updated },
                ].map((evt, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-[var(--ds-border-brand)] shrink-0" />
                    <div>
                      <p className="text-[length:var(--ds-text-sm)] text-[color:var(--ds-text-primary)]">
                        <span className="font-medium">{evt.action}</span>
                        <span className="text-[color:var(--ds-text-secondary)]"> by {evt.by}</span>
                      </p>
                      <p className="text-[length:var(--ds-text-xs)] text-[color:var(--ds-text-tertiary)]">{formatDate(evt.time)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* right: details sidebar */}
        <aside className="w-72 shrink-0 border-l border-[var(--ds-border-secondary)] bg-[var(--ds-bg-secondary)] overflow-auto">
          <div className="p-5 space-y-6">
            {/* customer info */}
            <section>
              <h3 className="text-[length:var(--ds-text-xs)] font-semibold text-[color:var(--ds-text-tertiary)] uppercase tracking-wider mb-3">Customer</h3>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[var(--ds-bg-brand)] flex items-center justify-center text-[color:var(--ds-text-on-brand)] text-[length:var(--ds-text-xs)] font-semibold">
                    {ticket.customer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-[length:var(--ds-text-sm)] font-medium text-[color:var(--ds-text-primary)]">{ticket.customer.name}</p>
                    <p className="text-[length:var(--ds-text-xs)] text-[color:var(--ds-text-tertiary)]">{ticket.customer.company}</p>
                  </div>
                </div>
                <div className="space-y-1.5 pl-[42px]">
                  <p className="flex items-center gap-2 text-[length:var(--ds-text-xs)] text-[color:var(--ds-text-secondary)]">
                    <Mail size={12} className="text-[var(--ds-icon-secondary)]" />{ticket.customer.email}
                  </p>
                  <p className="flex items-center gap-2 text-[length:var(--ds-text-xs)] text-[color:var(--ds-text-secondary)]">
                    <Phone size={12} className="text-[var(--ds-icon-secondary)]" />{ticket.customer.phone}
                  </p>
                </div>
              </div>
            </section>

            <hr className="border-[var(--ds-border-secondary)]" />

            {/* ticket details */}
            <section>
              <h3 className="text-[length:var(--ds-text-xs)] font-semibold text-[color:var(--ds-text-tertiary)] uppercase tracking-wider mb-3">Details</h3>
              <dl className="space-y-3">
                {[
                  ['Assignee', ticket.assignee],
                  ['Category', ticket.category],
                  ['Created', formatDate(ticket.created)],
                  ['Last Updated', formatDate(ticket.updated)],
                ].map(([label, val]) => (
                  <div key={label}>
                    <dt className="text-[length:var(--ds-text-xs)] text-[color:var(--ds-text-tertiary)]">{label}</dt>
                    <dd className="text-[length:var(--ds-text-sm)] text-[color:var(--ds-text-primary)] mt-0.5">{val}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <hr className="border-[var(--ds-border-secondary)]" />

            {/* SLA */}
            <section>
              <h3 className="text-[length:var(--ds-text-xs)] font-semibold text-[color:var(--ds-text-tertiary)] uppercase tracking-wider mb-3">SLA Status</h3>
              <div className="flex items-center gap-2">
                <Tag color={slaColor[ticket.sla]} size="sm">{ticket.sla}</Tag>
                {ticket.sla === 'At Risk' && (
                  <span className="text-[length:var(--ds-text-xs)] text-[color:var(--ds-text-danger)]">Response overdue</span>
                )}
              </div>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ─── main page ─── */
export default function SupportTicketsPage() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    return ALL_TICKETS.filter(t => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return t.id.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.customer.name.toLowerCase().includes(q);
      }
      return true;
    });
  }, [searchQuery, statusFilter, priorityFilter]);

  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  const stats = useMemo(() => ({
    open: ALL_TICKETS.filter(t => t.status === 'Open').length,
    inProgress: ALL_TICKETS.filter(t => t.status === 'In Progress').length,
    atRisk: ALL_TICKETS.filter(t => t.sla === 'At Risk').length,
    resolved: ALL_TICKETS.filter(t => t.status === 'Resolved' || t.status === 'Closed').length,
  }), []);

  return (
    <div className="h-screen flex flex-col bg-[var(--ds-bg-secondary)]">
      <main className="flex-1 overflow-hidden flex flex-col">
        {selectedTicket ? (
          <TicketDetail ticket={selectedTicket} onBack={() => setSelectedTicket(null)} />
        ) : (
          <>
            {/* list view header */}
            <div className="shrink-0 px-6 pt-6 pb-0">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h1 className="text-[length:var(--ds-text-3xl)] font-bold text-[color:var(--ds-text-primary)]">Support Tickets</h1>
                  <p className="text-[length:var(--ds-text-sm)] text-[color:var(--ds-text-secondary)] mt-1">Manage and resolve customer requests</p>
                </div>
                <Button icon={<Plus size={16} />}>New Ticket</Button>
              </div>

              {/* stat cards */}
              <div className="grid grid-cols-4 gap-4 mb-5">
                <StatCard icon={<CircleDot size={18} />} label="Open" value={stats.open} trend="+3 today" trendUp={false} />
                <StatCard icon={<Timer size={18} />} label="In Progress" value={stats.inProgress} trend="2 updated" trendUp />
                <StatCard icon={<AlertCircle size={18} />} label="SLA At Risk" value={stats.atRisk} trend="Needs attention" />
                <StatCard icon={<CheckCircle2 size={18} />} label="Resolved" value={stats.resolved} trend="+12 this week" trendUp />
              </div>

              {/* filters */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 max-w-sm">
                  <Search
                    placeholder="Search by ID, subject, or customer…"
                    size="sm"
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onClear={() => setSearchQuery('')}
                    debounceMs={200}
                  />
                </div>
                <Dropdown
                  placeholder="Status"
                  size="sm"
                  options={[{ value: 'all', label: 'All Statuses' }, ...STATUSES.map(s => ({ value: s, label: s }))]}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  wrapperClassName="w-44"
                />
                <Dropdown
                  placeholder="Priority"
                  size="sm"
                  options={[{ value: 'all', label: 'All Priorities' }, ...PRIORITIES.map(p => ({ value: p, label: p }))]}
                  value={priorityFilter}
                  onChange={setPriorityFilter}
                  wrapperClassName="w-44"
                />
                {(statusFilter !== 'all' || priorityFilter !== 'all' || searchQuery) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<X size={14} />}
                    onClick={() => { setStatusFilter('all'); setPriorityFilter('all'); setSearchQuery(''); }}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* table */}
            <div className="flex-1 overflow-auto px-6 pb-6">
              <DataTable
                columns={[
                  {
                    key: 'id',
                    header: 'ID',
                    width: '100px',
                    render: (val) => (
                      <span className="text-[length:var(--ds-text-sm)] font-mono font-medium text-[color:var(--ds-text-brand)]">{val}</span>
                    ),
                  },
                  {
                    key: 'subject',
                    header: 'Subject',
                    render: (val, row) => (
                      <div className="min-w-0">
                        <p className="text-[length:var(--ds-text-sm)] font-medium text-[color:var(--ds-text-primary)] truncate">{val}</p>
                        <p className="text-[length:var(--ds-text-xs)] text-[color:var(--ds-text-tertiary)] mt-0.5">{row.customer.name} · {row.customer.company}</p>
                      </div>
                    ),
                  },
                  {
                    key: 'priority',
                    header: 'Priority',
                    width: '110px',
                    sortable: true,
                    render: (val) => <Tag color={priorityColor[val]} size="sm">{val}</Tag>,
                  },
                  {
                    key: 'status',
                    header: 'Status',
                    width: '140px',
                    sortable: true,
                    render: (val) => <Tag color={statusColor[val]} size="sm">{val}</Tag>,
                  },
                  {
                    key: 'assignee',
                    header: 'Assignee',
                    width: '140px',
                    sortable: true,
                    render: (val) => (
                      <span className="text-[length:var(--ds-text-sm)] text-[color:var(--ds-text-secondary)]">{val}</span>
                    ),
                  },
                  {
                    key: 'sla',
                    header: 'SLA',
                    width: '100px',
                    render: (val) => <Tag color={slaColor[val]} size="sm" outline>{val}</Tag>,
                  },
                  {
                    key: 'updated',
                    header: 'Updated',
                    width: '100px',
                    sortable: true,
                    render: (val) => (
                      <span className="text-[length:var(--ds-text-xs)] text-[color:var(--ds-text-tertiary)]">{timeAgo(val)}</span>
                    ),
                  },
                  {
                    key: 'actions',
                    header: '',
                    width: '48px',
                    render: (_, row) => (
                      <OverflowMenu
                        size="sm"
                        items={[
                          { label: 'View Details', icon: <ExternalLink size={14} />, onClick: () => setSelectedTicket(row) },
                          { label: 'Assign to Me', icon: <User size={14} />, onClick: () => {} },
                          { divider: true },
                          { label: 'Close Ticket', icon: <X size={14} />, onClick: () => {}, danger: true },
                        ]}
                      />
                    ),
                  },
                ]}
                data={paged.map((t) => ({
                  ...t,
                  _onClick: () => setSelectedTicket(t),
                }))}
                sortable
                defaultSortColumn="updated"
                defaultSortDirection="desc"
                stickyHeader
                emptyMessage="No tickets match your filters"
                compact
              />

              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filtered.length / pageSize)}
                  totalItems={filtered.length}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  showItemCount
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}