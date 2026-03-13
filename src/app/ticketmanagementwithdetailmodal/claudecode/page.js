'use client';

import { useState, useMemo } from 'react';
import {
  DataTable,
  Tag,
  Modal,
  Button,
  Search,
  Dropdown,
} from '../components';
import {
  Ticket,
  Clock,
  User,
  MessageSquare,
  Calendar,
  AlertCircle,
  Plus,
} from 'lucide-react';

const tickets = [
  {
    id: 'TKT-1001',
    subject: 'Unable to login after password reset',
    requester: 'Sarah Chen',
    assignee: 'Mike Johnson',
    priority: 'high',
    status: 'open',
    category: 'Authentication',
    created: '2026-03-12T09:15:00Z',
    updated: '2026-03-13T08:30:00Z',
    description:
      'After resetting my password through the forgot-password flow, I receive a "credentials invalid" error when trying to log in with the new password. I have tried clearing cookies and using incognito mode.',
    comments: [
      { author: 'Mike Johnson', date: '2026-03-12T10:00:00Z', text: 'Can you confirm which browser you are using?' },
      { author: 'Sarah Chen', date: '2026-03-12T10:15:00Z', text: 'Chrome 124 on macOS.' },
      { author: 'Mike Johnson', date: '2026-03-13T08:30:00Z', text: 'Reproduced the issue. Investigating the token expiry logic.' },
    ],
  },
  {
    id: 'TKT-1002',
    subject: 'Dashboard charts not loading on Firefox',
    requester: 'James Patel',
    assignee: 'Emily Rivera',
    priority: 'medium',
    status: 'in-progress',
    category: 'UI/UX',
    created: '2026-03-11T14:22:00Z',
    updated: '2026-03-12T16:45:00Z',
    description:
      'The analytics dashboard charts render as blank canvases on Firefox 130. Works fine on Chrome and Safari. Console shows WebGL context errors.',
    comments: [
      { author: 'Emily Rivera', date: '2026-03-12T09:00:00Z', text: 'Looks like a compatibility issue with our charting library. Testing a patch.' },
    ],
  },
  {
    id: 'TKT-1003',
    subject: 'Export to CSV produces empty file',
    requester: 'Aisha Mohammed',
    assignee: 'Mike Johnson',
    priority: 'high',
    status: 'open',
    category: 'Data',
    created: '2026-03-10T11:05:00Z',
    updated: '2026-03-11T09:20:00Z',
    description:
      'When exporting the transaction report to CSV, the downloaded file contains only headers with no data rows. Verified the report has 2,400 records in the UI.',
    comments: [
      { author: 'Mike Johnson', date: '2026-03-10T14:00:00Z', text: 'Checking the export endpoint. Might be a pagination issue with the API.' },
      { author: 'Aisha Mohammed', date: '2026-03-11T09:20:00Z', text: 'Same issue with the PDF export as well.' },
    ],
  },
  {
    id: 'TKT-1004',
    subject: 'Request for bulk user import feature',
    requester: 'Carlos Mendez',
    assignee: 'Unassigned',
    priority: 'low',
    status: 'open',
    category: 'Feature Request',
    created: '2026-03-09T08:30:00Z',
    updated: '2026-03-09T08:30:00Z',
    description:
      'We need the ability to import users via CSV upload. Currently we have to add users one by one, which is not feasible when onboarding 200+ employees.',
    comments: [],
  },
  {
    id: 'TKT-1005',
    subject: 'Two-factor authentication SMS not received',
    requester: 'Priya Sharma',
    assignee: 'Emily Rivera',
    priority: 'critical',
    status: 'in-progress',
    category: 'Authentication',
    created: '2026-03-08T16:45:00Z',
    updated: '2026-03-12T11:00:00Z',
    description:
      'Multiple users in the APAC region report not receiving 2FA SMS codes. This is blocking them from accessing the platform entirely.',
    comments: [
      { author: 'Emily Rivera', date: '2026-03-09T09:00:00Z', text: 'Escalated to our SMS provider. Investigating regional delivery issues.' },
      { author: 'Emily Rivera', date: '2026-03-12T11:00:00Z', text: 'Provider confirmed routing issues in the APAC region. Fix deployed, monitoring.' },
    ],
  },
  {
    id: 'TKT-1006',
    subject: 'Slow page load on team management screen',
    requester: 'David Kim',
    assignee: 'Mike Johnson',
    priority: 'medium',
    status: 'resolved',
    category: 'Performance',
    created: '2026-03-07T13:10:00Z',
    updated: '2026-03-10T15:30:00Z',
    description:
      'The team management page takes 12+ seconds to load for organizations with more than 500 members. The API response itself is fast but the frontend rendering is the bottleneck.',
    comments: [
      { author: 'Mike Johnson', date: '2026-03-08T10:00:00Z', text: 'Identified unbounded list rendering. Implementing virtualization.' },
      { author: 'Mike Johnson', date: '2026-03-10T15:30:00Z', text: 'Fixed with virtual scrolling. Load time down to 1.2s. Closing.' },
    ],
  },
  {
    id: 'TKT-1007',
    subject: 'Incorrect timezone in scheduled reports',
    requester: 'Lisa Nakamura',
    assignee: 'Emily Rivera',
    priority: 'medium',
    status: 'resolved',
    category: 'Data',
    created: '2026-03-06T10:00:00Z',
    updated: '2026-03-09T14:15:00Z',
    description:
      'Scheduled reports are generated using UTC instead of the user\'s configured timezone, resulting in incorrect date ranges for daily summaries.',
    comments: [
      { author: 'Emily Rivera', date: '2026-03-07T11:00:00Z', text: 'Confirmed. The scheduler ignores the user timezone preference. Patching now.' },
      { author: 'Emily Rivera', date: '2026-03-09T14:15:00Z', text: 'Fix deployed. Reports now respect user timezone settings.' },
    ],
  },
  {
    id: 'TKT-1008',
    subject: 'API rate limit too restrictive for integrations',
    requester: 'Tom Bradley',
    assignee: 'Unassigned',
    priority: 'low',
    status: 'closed',
    category: 'API',
    created: '2026-03-05T09:30:00Z',
    updated: '2026-03-08T12:00:00Z',
    description:
      'The current rate limit of 100 requests/min is too low for our data sync integration. Requesting an increase to at least 500 req/min for verified integrations.',
    comments: [
      { author: 'Mike Johnson', date: '2026-03-06T10:00:00Z', text: 'Reviewed with the platform team. We can offer tiered rate limits. Documented in the API guide.' },
    ],
  },
];

const priorityConfig = {
  critical: { color: 'danger', label: 'Critical' },
  high: { color: 'warning', label: 'High' },
  medium: { color: 'info', label: 'Medium' },
  low: { color: 'default', label: 'Low' },
};

const statusConfig = {
  open: { color: 'warning', label: 'Open' },
  'in-progress': { color: 'brand', label: 'In Progress' },
  resolved: { color: 'success', label: 'Resolved' },
  closed: { color: 'default', label: 'Closed' },
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function HomePage() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          t.id.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.requester.toLowerCase().includes(q) ||
          t.assignee.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery, statusFilter, priorityFilter]);

  const columns = [
    {
      key: 'id',
      header: 'Ticket ID',
      width: '120px',
      render: (val) => (
        <span className="font-mono font-medium text-[var(--ds-text-brand)]">{val}</span>
      ),
    },
    {
      key: 'subject',
      header: 'Subject',
      minWidth: '250px',
    },
    {
      key: 'requester',
      header: 'Requester',
      width: '150px',
    },
    {
      key: 'priority',
      header: 'Priority',
      width: '110px',
      render: (val) => {
        const cfg = priorityConfig[val];
        return (
          <Tag color={cfg.color} size="sm">
            {cfg.label}
          </Tag>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      width: '130px',
      render: (val) => {
        const cfg = statusConfig[val];
        return (
          <Tag color={cfg.color} size="sm" outline>
            {cfg.label}
          </Tag>
        );
      },
    },
    {
      key: 'assignee',
      header: 'Assignee',
      width: '150px',
      render: (val) => (
        <span className={val === 'Unassigned' ? 'text-[var(--ds-text-tertiary)] italic' : ''}>
          {val}
        </span>
      ),
    },
    {
      key: 'updated',
      header: 'Last Updated',
      width: '130px',
      render: (val) => (
        <span className="text-[var(--ds-text-secondary)]">{timeAgo(val)}</span>
      ),
    },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  // Summary counts
  const openCount = tickets.filter((t) => t.status === 'open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'in-progress').length;
  const criticalCount = tickets.filter((t) => t.priority === 'critical').length;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--ds-bg-secondary)' }}
    >
      {/* Page Header */}
      <div
        className="border-b px-8 py-6"
        style={{
          backgroundColor: 'var(--ds-bg-primary)',
          borderColor: 'var(--ds-border-primary)',
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[length:var(--ds-text-2xl)] font-bold text-[var(--ds-text-primary)] flex items-center gap-3">
                <Ticket size={28} style={{ color: 'var(--ds-icon-brand)' }} />
                Support Tickets
              </h1>
              <p className="text-[length:var(--ds-text-sm)] text-[var(--ds-text-secondary)] mt-1">
                Manage and track customer support requests
              </p>
            </div>
            <Button icon={<Plus size={16} />}>New Ticket</Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div
              className="rounded-[var(--ds-radius-lg)] border px-4 py-3"
              style={{
                backgroundColor: 'var(--ds-bg-primary)',
                borderColor: 'var(--ds-border-primary)',
              }}
            >
              <div className="text-[length:var(--ds-text-xs)] font-medium text-[var(--ds-text-secondary)]">
                Open Tickets
              </div>
              <div className="text-[length:var(--ds-text-2xl)] font-bold text-[var(--ds-text-warning)] mt-1">
                {openCount}
              </div>
            </div>
            <div
              className="rounded-[var(--ds-radius-lg)] border px-4 py-3"
              style={{
                backgroundColor: 'var(--ds-bg-primary)',
                borderColor: 'var(--ds-border-primary)',
              }}
            >
              <div className="text-[length:var(--ds-text-xs)] font-medium text-[var(--ds-text-secondary)]">
                In Progress
              </div>
              <div className="text-[length:var(--ds-text-2xl)] font-bold text-[var(--ds-text-brand)] mt-1">
                {inProgressCount}
              </div>
            </div>
            <div
              className="rounded-[var(--ds-radius-lg)] border px-4 py-3"
              style={{
                backgroundColor: 'var(--ds-bg-primary)',
                borderColor: 'var(--ds-border-primary)',
              }}
            >
              <div className="text-[length:var(--ds-text-xs)] font-medium text-[var(--ds-text-secondary)]">
                Critical
              </div>
              <div className="text-[length:var(--ds-text-2xl)] font-bold text-[var(--ds-text-danger)] mt-1">
                {criticalCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Toolbar */}
        <div className="flex items-end gap-4 mb-4">
          <Search
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={setSearchQuery}
            wrapperClassName="flex-1 max-w-sm"
            size="sm"
          />
          <Dropdown
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Status"
            size="sm"
            wrapperClassName="w-44"
          />
          <Dropdown
            options={priorityOptions}
            value={priorityFilter}
            onChange={setPriorityFilter}
            placeholder="Priority"
            size="sm"
            wrapperClassName="w-44"
          />
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={filteredTickets.map((t) => ({
            ...t,
            _onClick: () => setSelectedTicket(t),
          }))}
          sortable
          defaultSortColumn="updated"
          defaultSortDirection="desc"
          paginated
          defaultPageSize={10}
          emptyMessage="No tickets match your filters"
          className="[&_tbody_tr]:cursor-pointer"
          onClick={(e) => {
            const row = e.target.closest('tr');
            if (!row || !row.closest('tbody')) return;
            const rowIdx = Array.from(row.parentElement.children).indexOf(row);
            if (rowIdx >= 0 && filteredTickets[rowIdx]) {
              setSelectedTicket(filteredTickets[rowIdx]);
            }
          }}
        />
      </div>

      {/* Ticket Detail Modal */}
      <Modal
        open={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title={selectedTicket?.id}
        size="lg"
        footer={
          <>
            <Button variant="tertiary" onClick={() => setSelectedTicket(null)}>
              Close
            </Button>
            <Button>Reply</Button>
          </>
        }
      >
        {selectedTicket && (
          <div className="space-y-6">
            {/* Subject & Tags */}
            <div>
              <h3 className="text-[length:var(--ds-text-lg)] font-semibold text-[var(--ds-text-primary)]">
                {selectedTicket.subject}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <Tag color={priorityConfig[selectedTicket.priority].color} size="sm">
                  {priorityConfig[selectedTicket.priority].label}
                </Tag>
                <Tag color={statusConfig[selectedTicket.status].color} size="sm" outline>
                  {statusConfig[selectedTicket.status].label}
                </Tag>
                <Tag color="default" size="sm">
                  {selectedTicket.category}
                </Tag>
              </div>
            </div>

            {/* Meta Info */}
            <div
              className="grid grid-cols-2 gap-4 rounded-[var(--ds-radius-lg)] border p-4"
              style={{
                backgroundColor: 'var(--ds-bg-secondary)',
                borderColor: 'var(--ds-border-primary)',
              }}
            >
              <div className="flex items-center gap-2">
                <User size={14} style={{ color: 'var(--ds-icon-secondary)' }} />
                <span className="text-[length:var(--ds-text-xs)] text-[var(--ds-text-secondary)]">Requester</span>
                <span className="text-[length:var(--ds-text-sm)] font-medium text-[var(--ds-text-primary)] ml-auto">
                  {selectedTicket.requester}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle size={14} style={{ color: 'var(--ds-icon-secondary)' }} />
                <span className="text-[length:var(--ds-text-xs)] text-[var(--ds-text-secondary)]">Assignee</span>
                <span
                  className={[
                    'text-[length:var(--ds-text-sm)] font-medium ml-auto',
                    selectedTicket.assignee === 'Unassigned'
                      ? 'text-[var(--ds-text-tertiary)] italic'
                      : 'text-[var(--ds-text-primary)]',
                  ].join(' ')}
                >
                  {selectedTicket.assignee}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} style={{ color: 'var(--ds-icon-secondary)' }} />
                <span className="text-[length:var(--ds-text-xs)] text-[var(--ds-text-secondary)]">Created</span>
                <span className="text-[length:var(--ds-text-sm)] text-[var(--ds-text-primary)] ml-auto">
                  {formatDate(selectedTicket.created)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} style={{ color: 'var(--ds-icon-secondary)' }} />
                <span className="text-[length:var(--ds-text-xs)] text-[var(--ds-text-secondary)]">Updated</span>
                <span className="text-[length:var(--ds-text-sm)] text-[var(--ds-text-primary)] ml-auto">
                  {formatDate(selectedTicket.updated)}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-[length:var(--ds-text-sm)] font-semibold text-[var(--ds-text-primary)] mb-2">
                Description
              </h4>
              <p className="text-[length:var(--ds-text-sm)] text-[var(--ds-text-secondary)] leading-relaxed">
                {selectedTicket.description}
              </p>
            </div>

            {/* Comments */}
            <div>
              <h4 className="text-[length:var(--ds-text-sm)] font-semibold text-[var(--ds-text-primary)] mb-3 flex items-center gap-2">
                <MessageSquare size={14} />
                Comments ({selectedTicket.comments.length})
              </h4>
              {selectedTicket.comments.length === 0 ? (
                <p className="text-[length:var(--ds-text-sm)] text-[var(--ds-text-tertiary)] italic">
                  No comments yet
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedTicket.comments.map((comment, i) => (
                    <div
                      key={i}
                      className="rounded-[var(--ds-radius-md)] border p-3"
                      style={{
                        backgroundColor: 'var(--ds-bg-secondary)',
                        borderColor: 'var(--ds-border-primary)',
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[length:var(--ds-text-sm)] font-medium text-[var(--ds-text-primary)]">
                          {comment.author}
                        </span>
                        <span className="text-[length:var(--ds-text-xs)] text-[var(--ds-text-tertiary)]">
                          {formatDateTime(comment.date)}
                        </span>
                      </div>
                      <p className="text-[length:var(--ds-text-sm)] text-[var(--ds-text-secondary)]">
                        {comment.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
