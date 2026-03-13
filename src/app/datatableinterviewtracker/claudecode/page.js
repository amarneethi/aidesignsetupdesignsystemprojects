'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  UserPlus,
  Trash2,
  Download,
  Filter,
  X,
  Calendar,
  Building2,
  Briefcase,
  Star,
  StarOff,
} from 'lucide-react';
import {
  Button,
  DataTable,
  Tag,
  Select,
  Modal,
  TextInput,
  Notification,
  DatePicker,
  Search as SearchInput,
} from '@/components';

// ─── Sample Data ────────────────────────────────────────────────────────────────

const INITIAL_CANDIDATES = [
  {
    id: 1,
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    role: 'Senior Frontend Engineer',
    department: 'Engineering',
    stage: 'Technical',
    status: 'Scheduled',
    rating: 4,
    interviewer: 'Alex Kim',
    date: '2026-03-15',
    starred: true,
    notes: 'Strong React & TypeScript skills. Previous lead experience.',
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    email: 'marcus.j@email.com',
    role: 'Product Designer',
    department: 'Design',
    stage: 'Portfolio Review',
    status: 'Completed',
    rating: 5,
    interviewer: 'Priya Patel',
    date: '2026-03-10',
    starred: true,
    notes: 'Exceptional portfolio. Great systems thinking.',
  },
  {
    id: 3,
    name: 'Emily Nakamura',
    email: 'emily.n@email.com',
    role: 'Backend Engineer',
    department: 'Engineering',
    stage: 'Phone Screen',
    status: 'Completed',
    rating: 3,
    interviewer: 'David Osei',
    date: '2026-03-08',
    starred: false,
    notes: 'Good fundamentals. Needs more system design exposure.',
  },
  {
    id: 4,
    name: 'James Rodriguez',
    email: 'james.r@email.com',
    role: 'Engineering Manager',
    department: 'Engineering',
    stage: 'Final Round',
    status: 'Scheduled',
    rating: 4,
    interviewer: 'Lisa Wang',
    date: '2026-03-18',
    starred: false,
    notes: 'Managed 20+ engineers. Strong culture fit.',
  },
  {
    id: 5,
    name: 'Aisha Patel',
    email: 'aisha.p@email.com',
    role: 'Data Scientist',
    department: 'Engineering',
    stage: 'Technical',
    status: 'In Progress',
    rating: 0,
    interviewer: 'Chen Wei',
    date: '2026-03-13',
    starred: false,
    notes: 'PhD in ML. Published 3 papers on NLP.',
  },
  {
    id: 6,
    name: 'Tom Eriksson',
    email: 'tom.e@email.com',
    role: 'Product Manager',
    department: 'Product',
    stage: 'Phone Screen',
    status: 'Cancelled',
    rating: 0,
    interviewer: 'Jordan Lee',
    date: '2026-03-06',
    starred: false,
    notes: 'Candidate withdrew — accepted another offer.',
  },
  {
    id: 7,
    name: 'Nina Kowalski',
    email: 'nina.k@email.com',
    role: 'UX Researcher',
    department: 'Design',
    stage: 'Hiring Manager',
    status: 'Scheduled',
    rating: 4,
    interviewer: 'Priya Patel',
    date: '2026-03-20',
    starred: true,
    notes: 'Deep qual research background. Led studies at 2 FAANG companies.',
  },
  {
    id: 8,
    name: 'Diego Santos',
    email: 'diego.s@email.com',
    role: 'DevOps Engineer',
    department: 'Engineering',
    stage: 'Technical',
    status: 'Completed',
    rating: 3,
    interviewer: 'Alex Kim',
    date: '2026-03-09',
    starred: false,
    notes: 'Solid Kubernetes and AWS. Weaker on observability.',
  },
  {
    id: 9,
    name: 'Rachel Green',
    email: 'rachel.g@email.com',
    role: 'Marketing Lead',
    department: 'Marketing',
    stage: 'Final Round',
    status: 'Completed',
    rating: 5,
    interviewer: 'Jordan Lee',
    date: '2026-03-11',
    starred: true,
    notes: 'Led 3x growth at previous startup. Offer stage recommended.',
  },
  {
    id: 10,
    name: 'Kevin Park',
    email: 'kevin.p@email.com',
    role: 'Full Stack Engineer',
    department: 'Engineering',
    stage: 'Phone Screen',
    status: 'Scheduled',
    rating: 0,
    interviewer: 'David Osei',
    date: '2026-03-16',
    starred: false,
    notes: '5 years experience. Open source contributor.',
  },
  {
    id: 11,
    name: 'Fatima Al-Hassan',
    email: 'fatima.a@email.com',
    role: 'Senior Backend Engineer',
    department: 'Engineering',
    stage: 'Technical',
    status: 'Scheduled',
    rating: 0,
    interviewer: 'Chen Wei',
    date: '2026-03-17',
    starred: false,
    notes: 'Distributed systems expertise. Previously at Stripe.',
  },
  {
    id: 12,
    name: 'Liam O\'Brien',
    email: 'liam.o@email.com',
    role: 'Design Systems Lead',
    department: 'Design',
    stage: 'Portfolio Review',
    status: 'In Progress',
    rating: 0,
    interviewer: 'Priya Patel',
    date: '2026-03-13',
    starred: false,
    notes: 'Built DS from scratch at two companies. Figma plugin author.',
  },
  {
    id: 13,
    name: 'Sofia Müller',
    email: 'sofia.m@email.com',
    role: 'QA Engineer',
    department: 'Engineering',
    stage: 'Phone Screen',
    status: 'Completed',
    rating: 2,
    interviewer: 'Lisa Wang',
    date: '2026-03-05',
    starred: false,
    notes: 'Automation focused. Limited experience with performance testing.',
  },
  {
    id: 14,
    name: 'Raj Krishnamurthy',
    email: 'raj.k@email.com',
    role: 'Solutions Architect',
    department: 'Engineering',
    stage: 'Hiring Manager',
    status: 'Scheduled',
    rating: 4,
    interviewer: 'Lisa Wang',
    date: '2026-03-19',
    starred: true,
    notes: 'Cloud architecture certification. Enterprise B2B background.',
  },
  {
    id: 15,
    name: 'Claire Dubois',
    email: 'claire.d@email.com',
    role: 'Content Strategist',
    department: 'Marketing',
    stage: 'Phone Screen',
    status: 'Completed',
    rating: 3,
    interviewer: 'Jordan Lee',
    date: '2026-03-07',
    starred: false,
    notes: 'Strong writing samples. Needs more B2B SaaS experience.',
  },
];

const STAGES = [
  { value: '', label: 'All Stages' },
  { value: 'Phone Screen', label: 'Phone Screen' },
  { value: 'Technical', label: 'Technical' },
  { value: 'Portfolio Review', label: 'Portfolio Review' },
  { value: 'Hiring Manager', label: 'Hiring Manager' },
  { value: 'Final Round', label: 'Final Round' },
];

const STATUSES = [
  { value: '', label: 'All Statuses' },
  { value: 'Scheduled', label: 'Scheduled' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
];

const DEPARTMENTS = [
  { value: '', label: 'All Departments' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Design', label: 'Design' },
  { value: 'Product', label: 'Product' },
  { value: 'Marketing', label: 'Marketing' },
];

const STATUS_TAG_KIND = {
  Scheduled: 'blue',
  'In Progress': 'teal',
  Completed: 'green',
  Cancelled: 'red',
};

const STAGE_TAG_KIND = {
  'Phone Screen': 'gray',
  Technical: 'purple',
  'Portfolio Review': 'teal',
  'Hiring Manager': 'blue',
  'Final Round': 'green',
};

// ─── Rating Stars ───────────────────────────────────────────────────────────────

function RatingStars({ rating, size = 14 }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= rating
              ? 'fill-[var(--ds-color-amber-400)] text-[var(--ds-color-amber-400)]'
              : 'text-[var(--ds-text-tertiary)] opacity-30'
          }
        />
      ))}
    </span>
  );
}

// ─── Stats Cards ────────────────────────────────────────────────────────────────

function StatsCard({ label, value, accent }) {
  return (
    <div
      className="flex flex-col gap-1 rounded-[var(--ds-radius-lg)] border px-5 py-4"
      style={{
        backgroundColor: 'var(--ds-bg-primary)',
        borderColor: 'var(--ds-border-default)',
      }}
    >
      <span className="text-[length:var(--ds-text-xs)] font-medium text-[var(--ds-text-secondary)]">
        {label}
      </span>
      <span
        className="text-[length:var(--ds-text-2xl)] font-bold"
        style={{ color: accent || 'var(--ds-text-primary)' }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Page Component ─────────────────────────────────────────────────────────────

export default function InterviewTrackerPage() {
  // Data state
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [selectedRows, setSelectedRows] = useState([]);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Notification state
  const [notification, setNotification] = useState(null);

  // New candidate form
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    email: '',
    role: '',
    department: 'Engineering',
    stage: 'Phone Screen',
    status: 'Scheduled',
    interviewer: '',
    date: '',
    notes: '',
  });

  // ─── Derived Data ───────────────────────────────────────────────────────────

  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const matchesSearch =
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.interviewer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStage = !stageFilter || c.stage === stageFilter;
      const matchesStatus = !statusFilter || c.status === statusFilter;
      const matchesDept = !departmentFilter || c.department === departmentFilter;
      return matchesSearch && matchesStage && matchesStatus && matchesDept;
    });
  }, [candidates, searchQuery, stageFilter, statusFilter, departmentFilter]);

  const stats = useMemo(() => {
    const scheduled = candidates.filter((c) => c.status === 'Scheduled').length;
    const inProgress = candidates.filter((c) => c.status === 'In Progress').length;
    const completed = candidates.filter((c) => c.status === 'Completed').length;
    const starred = candidates.filter((c) => c.starred).length;
    return { total: candidates.length, scheduled, inProgress, completed, starred };
  }, [candidates]);

  const activeFilterCount = [stageFilter, statusFilter, departmentFilter].filter(Boolean).length;

  // ─── Handlers ─────────────────────────────────────────────────────────────────

  const showNotification = useCallback((message, kind = 'success') => {
    setNotification({ message, kind });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleCellEdit = useCallback(
    (rowIndex, columnKey, value) => {
      setCandidates((prev) => {
        const target = filteredCandidates[rowIndex];
        if (!target) return prev;
        return prev.map((c) => (c.id === target.id ? { ...c, [columnKey]: value } : c));
      });
      showNotification(`Updated ${columnKey} successfully`);
    },
    [filteredCandidates, showNotification]
  );

  const handleToggleStar = useCallback(
    (id) => {
      setCandidates((prev) =>
        prev.map((c) => (c.id === id ? { ...c, starred: !c.starred } : c))
      );
    },
    []
  );

  const handleDeleteSelected = useCallback(() => {
    const idsToDelete = selectedRows.map((idx) => filteredCandidates[idx]?.id).filter(Boolean);
    setCandidates((prev) => prev.filter((c) => !idsToDelete.includes(c.id)));
    setSelectedRows([]);
    showNotification(`Deleted ${idsToDelete.length} candidate(s)`);
  }, [selectedRows, filteredCandidates, showNotification]);

  const handleAddCandidate = useCallback(() => {
    if (!newCandidate.name || !newCandidate.email || !newCandidate.role) return;
    const id = Math.max(...candidates.map((c) => c.id)) + 1;
    setCandidates((prev) => [
      ...prev,
      {
        ...newCandidate,
        id,
        rating: 0,
        starred: false,
      },
    ]);
    setNewCandidate({
      name: '',
      email: '',
      role: '',
      department: 'Engineering',
      stage: 'Phone Screen',
      status: 'Scheduled',
      interviewer: '',
      date: '',
      notes: '',
    });
    setAddModalOpen(false);
    showNotification(`Added ${newCandidate.name} to pipeline`);
  }, [newCandidate, candidates, showNotification]);

  const handleViewCandidate = useCallback((candidate) => {
    setSelectedCandidate(candidate);
    setDetailModalOpen(true);
  }, []);

  const clearFilters = useCallback(() => {
    setStageFilter('');
    setStatusFilter('');
    setDepartmentFilter('');
    setSearchQuery('');
  }, []);

  // ─── Column Definitions ───────────────────────────────────────────────────────

  const columns = useMemo(
    () => [
      {
        key: 'starred',
        header: '',
        sortable: false,
        width: '48px',
        render: (val, row) => (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStar(row.id);
            }}
            className="p-1 cursor-pointer rounded hover:bg-[var(--ds-bg-hover)] transition-colors"
            aria-label={val ? 'Unstar candidate' : 'Star candidate'}
          >
            {val ? (
              <Star size={16} className="fill-[var(--ds-color-amber-400)] text-[var(--ds-color-amber-400)]" />
            ) : (
              <StarOff size={16} className="text-[var(--ds-text-tertiary)] opacity-40" />
            )}
          </button>
        ),
      },
      {
        key: 'name',
        header: 'Candidate',
        minWidth: '200px',
        render: (val, row) => (
          <button
            type="button"
            onClick={() => handleViewCandidate(row)}
            className="text-left cursor-pointer group"
          >
            <div className="font-medium text-[var(--ds-text-primary)] group-hover:text-[var(--ds-text-brand)] transition-colors">
              {val}
            </div>
            <div className="text-[length:var(--ds-text-xs)] text-[var(--ds-text-tertiary)]">
              {row.email}
            </div>
          </button>
        ),
      },
      {
        key: 'role',
        header: 'Role',
        minWidth: '180px',
        render: (val, row) => (
          <div>
            <div className="text-[var(--ds-text-primary)]">{val}</div>
            <div className="text-[length:var(--ds-text-xs)] text-[var(--ds-text-tertiary)] flex items-center gap-1">
              <Building2 size={11} />
              {row.department}
            </div>
          </div>
        ),
      },
      {
        key: 'stage',
        header: 'Stage',
        minWidth: '140px',
        render: (val) => <Tag kind={STAGE_TAG_KIND[val] || 'gray'}>{val}</Tag>,
      },
      {
        key: 'status',
        header: 'Status',
        minWidth: '120px',
        render: (val) => <Tag kind={STATUS_TAG_KIND[val] || 'gray'}>{val}</Tag>,
      },
      {
        key: 'rating',
        header: 'Rating',
        minWidth: '120px',
        render: (val) =>
          val > 0 ? <RatingStars rating={val} /> : (
            <span className="text-[var(--ds-text-tertiary)] text-[length:var(--ds-text-xs)]">Not rated</span>
          ),
        sortFn: (a, b) => (a.rating || 0) - (b.rating || 0),
      },
      {
        key: 'interviewer',
        header: 'Interviewer',
        minWidth: '140px',
      },
      {
        key: 'date',
        header: 'Date',
        minWidth: '110px',
        render: (val) => {
          if (!val) return '—';
          const d = new Date(val + 'T00:00:00');
          return (
            <span className="flex items-center gap-1.5 text-[var(--ds-text-primary)]">
              <Calendar size={13} className="text-[var(--ds-text-tertiary)]" />
              {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          );
        },
        sortFn: (a, b) => new Date(a.date) - new Date(b.date),
      },
    ],
    [handleToggleStar, handleViewCandidate]
  );

  // ─── Batch Actions ────────────────────────────────────────────────────────────

  const batchActions = (
    <>
      <Button variant="danger" size="sm" iconLeft={<Trash2 size={14} />} onClick={handleDeleteSelected}>
        Delete
      </Button>
      <Button variant="secondary" size="sm" iconLeft={<Download size={14} />} onClick={() => showNotification('Export started')}>
        Export
      </Button>
    </>
  );

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--ds-bg-secondary)' }}
    >
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Notification */}
        {notification && (
          <div className="fixed top-6 right-6 z-50">
            <Notification
              kind={notification.kind}
              title={notification.message}
              onClose={() => setNotification(null)}
            />
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col gap-1 mb-6">
          <h1 className="text-[length:var(--ds-text-3xl)] font-bold text-[var(--ds-text-primary)]">
            Interview Tracker
          </h1>
          <p className="text-[length:var(--ds-text-md)] text-[var(--ds-text-secondary)]">
            Manage candidates, track interview stages, and collaborate with your hiring team.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <StatsCard label="Total Candidates" value={stats.total} />
          <StatsCard label="Scheduled" value={stats.scheduled} accent="var(--ds-color-blue-500)" />
          <StatsCard label="In Progress" value={stats.inProgress} accent="var(--ds-color-teal-500)" />
          <StatsCard label="Completed" value={stats.completed} accent="var(--ds-color-green-500)" />
          <StatsCard label="Starred" value={stats.starred} accent="var(--ds-color-amber-500)" />
        </div>

        {/* Toolbar */}
        <div
          className="rounded-t-[var(--ds-radius-lg)] border border-b-0 px-4 py-3 flex flex-col md:flex-row md:items-center gap-3"
          style={{
            backgroundColor: 'var(--ds-bg-primary)',
            borderColor: 'var(--ds-table-border)',
          }}
        >
          <div className="flex-1 max-w-sm">
            <SearchInput
              placeholder="Search candidates, roles, interviewers…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              size="sm"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={showFilters ? 'secondary' : 'ghost'}
              size="sm"
              iconLeft={<Filter size={14} />}
              onClick={() => setShowFilters((v) => !v)}
            >
              Filters
              {activeFilterCount > 0 && (
                <span
                  className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full text-[length:var(--ds-text-xs)] font-bold"
                  style={{
                    backgroundColor: 'var(--ds-bg-brand)',
                    color: 'var(--ds-color-white)',
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" iconLeft={<X size={14} />} onClick={clearFilters}>
                Clear
              </Button>
            )}

            <div className="hidden md:block w-px h-6 bg-[var(--ds-border-default)]" />

            <Button
              variant="primary"
              size="sm"
              iconLeft={<UserPlus size={14} />}
              onClick={() => setAddModalOpen(true)}
            >
              Add Candidate
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        {showFilters && (
          <div
            className="border border-b-0 px-4 py-3 flex flex-col md:flex-row gap-3"
            style={{
              backgroundColor: 'var(--ds-bg-primary)',
              borderColor: 'var(--ds-table-border)',
            }}
          >
            <div className="w-full md:w-48">
              <Select
                options={STAGES}
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                size="sm"
                placeholder="Stage"
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                options={STATUSES}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                size="sm"
                placeholder="Status"
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                options={DEPARTMENTS}
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                size="sm"
                placeholder="Department"
              />
            </div>
          </div>
        )}

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={filteredCandidates}
          sortable
          defaultSortColumn="date"
          defaultSortDirection="desc"
          selectable
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          batchActions={batchActions}
          paginated
          defaultPageSize={10}
          pageSizeOptions={[5, 10, 25]}
          editableColumns={['interviewer', 'notes']}
          onCellEdit={handleCellEdit}
          stickyHeader
          striped
          emptyMessage="No candidates match your filters."
          className="rounded-t-none"
        />

        {/* Add Candidate Modal */}
        <Modal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          title="Add Candidate"
          size="lg"
          actions={
            <>
              <Button variant="ghost" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleAddCandidate}
                disabled={!newCandidate.name || !newCandidate.email || !newCandidate.role}
              >
                Add to Pipeline
              </Button>
            </>
          }
        >
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Full Name"
                placeholder="e.g. Jane Smith"
                value={newCandidate.name}
                onChange={(e) => setNewCandidate((p) => ({ ...p, name: e.target.value }))}
                required
              />
              <TextInput
                label="Email"
                type="email"
                placeholder="jane@email.com"
                value={newCandidate.email}
                onChange={(e) => setNewCandidate((p) => ({ ...p, email: e.target.value }))}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Role"
                placeholder="e.g. Senior Frontend Engineer"
                value={newCandidate.role}
                onChange={(e) => setNewCandidate((p) => ({ ...p, role: e.target.value }))}
                required
              />
              <Select
                label="Department"
                options={DEPARTMENTS.filter((d) => d.value)}
                value={newCandidate.department}
                onChange={(e) => setNewCandidate((p) => ({ ...p, department: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Interview Stage"
                options={STAGES.filter((s) => s.value)}
                value={newCandidate.stage}
                onChange={(e) => setNewCandidate((p) => ({ ...p, stage: e.target.value }))}
              />
              <TextInput
                label="Interviewer"
                placeholder="e.g. Alex Kim"
                value={newCandidate.interviewer}
                onChange={(e) => setNewCandidate((p) => ({ ...p, interviewer: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DatePicker
                label="Interview Date"
                value={newCandidate.date}
                onChange={(e) => setNewCandidate((p) => ({ ...p, date: e.target.value }))}
              />
              <Select
                label="Status"
                options={STATUSES.filter((s) => s.value)}
                value={newCandidate.status}
                onChange={(e) => setNewCandidate((p) => ({ ...p, status: e.target.value }))}
              />
            </div>
            <TextInput
              label="Notes"
              placeholder="Initial impressions, resume highlights, referral source…"
              value={newCandidate.notes}
              onChange={(e) => setNewCandidate((p) => ({ ...p, notes: e.target.value }))}
            />
          </div>
        </Modal>

        {/* Candidate Detail Modal */}
        <Modal
          open={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title="Candidate Details"
          size="lg"
          actions={
            <Button variant="ghost" onClick={() => setDetailModalOpen(false)}>
              Close
            </Button>
          }
        >
          {selectedCandidate && (
            <div className="flex flex-col gap-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[length:var(--ds-text-xl)] font-semibold text-[var(--ds-text-primary)]">
                    {selectedCandidate.name}
                  </h3>
                  <p className="text-[length:var(--ds-text-sm)] text-[var(--ds-text-secondary)]">
                    {selectedCandidate.email}
                  </p>
                </div>
                {selectedCandidate.rating > 0 && <RatingStars rating={selectedCandidate.rating} size={18} />}
              </div>

              {/* Details Grid */}
              <div
                className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-[var(--ds-radius-md)]"
                style={{ backgroundColor: 'var(--ds-bg-secondary)' }}
              >
                <DetailItem icon={<Briefcase size={14} />} label="Role" value={selectedCandidate.role} />
                <DetailItem icon={<Building2 size={14} />} label="Department" value={selectedCandidate.department} />
                <DetailItem icon={<Calendar size={14} />} label="Date" value={
                  selectedCandidate.date
                    ? new Date(selectedCandidate.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : '—'
                } />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[length:var(--ds-text-xs)] text-[var(--ds-text-tertiary)]">Stage</span>
                  <Tag kind={STAGE_TAG_KIND[selectedCandidate.stage] || 'gray'}>{selectedCandidate.stage}</Tag>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[length:var(--ds-text-xs)] text-[var(--ds-text-tertiary)]">Status</span>
                  <Tag kind={STATUS_TAG_KIND[selectedCandidate.status] || 'gray'}>{selectedCandidate.status}</Tag>
                </div>
                <DetailItem label="Interviewer" value={selectedCandidate.interviewer} />
              </div>

              {/* Notes */}
              {selectedCandidate.notes && (
                <div>
                  <h4 className="text-[length:var(--ds-text-sm)] font-semibold text-[var(--ds-text-secondary)] mb-2">
                    Notes
                  </h4>
                  <p
                    className="text-[length:var(--ds-text-sm)] text-[var(--ds-text-primary)] p-3 rounded-[var(--ds-radius-md)]"
                    style={{ backgroundColor: 'var(--ds-bg-secondary)' }}
                  >
                    {selectedCandidate.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

// ─── Detail Item Helper ─────────────────────────────────────────────────────────

function DetailItem({ icon, label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[length:var(--ds-text-xs)] text-[var(--ds-text-tertiary)] flex items-center gap-1">
        {icon}
        {label}
      </span>
      <span className="text-[length:var(--ds-text-sm)] font-medium text-[var(--ds-text-primary)]">
        {value}
      </span>
    </div>
  );
}
