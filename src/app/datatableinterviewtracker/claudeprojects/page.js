'use client';
import { useState, useMemo, useCallback } from 'react';
import {
  Button,
  TextInput,
  Select,
  Modal,
  DataTable,
  Tag,
  Search,
  Tabs,
  Form,
  FormGroup,
  FormRow,
  Breadcrumb,
} from '@/components';
import {
  Home,
  Users,
  Download,
  UserPlus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Star,
  TrendingUp,
  SlidersHorizontal,
  X,
} from 'lucide-react';

/* ── seed data ───────────────────────────────────────────────── */
const INITIAL_CANDIDATES = [
  { id: 1, name: 'Priya Sharma', role: 'Senior Frontend Engineer', team: 'Web Platform', stage: 'Onsite', status: 'In Progress', interviewer: 'Alex Chen', rating: 4, appliedDate: '2026-02-18', nextInterview: '2026-03-15', source: 'LinkedIn', email: 'priya.s@email.com' },
  { id: 2, name: 'Marcus Johnson', role: 'Staff Backend Engineer', team: 'Infrastructure', stage: 'Final Round', status: 'In Progress', interviewer: 'Sarah Kim', rating: 5, appliedDate: '2026-02-10', nextInterview: '2026-03-14', source: 'Referral', email: 'marcus.j@email.com' },
  { id: 3, name: 'Elena Kowalski', role: 'ML Engineer', team: 'AI/ML', stage: 'Offer Extended', status: 'Pending', interviewer: 'David Park', rating: 5, appliedDate: '2026-01-28', nextInterview: '', source: 'Careers Page', email: 'elena.k@email.com' },
  { id: 4, name: 'James O\'Brien', role: 'DevOps Engineer', team: 'Infrastructure', stage: 'Phone Screen', status: 'In Progress', interviewer: 'Maria Garcia', rating: 3, appliedDate: '2026-03-05', nextInterview: '2026-03-17', source: 'Indeed', email: 'james.ob@email.com' },
  { id: 5, name: 'Aisha Patel', role: 'Product Designer', team: 'Design', stage: 'Rejected', status: 'Closed', interviewer: 'Tom Wilson', rating: 2, appliedDate: '2026-02-01', nextInterview: '', source: 'Dribbble', email: 'aisha.p@email.com' },
  { id: 6, name: 'Liam Chen', role: 'Senior Frontend Engineer', team: 'Web Platform', stage: 'Technical Screen', status: 'In Progress', interviewer: 'Alex Chen', rating: 4, appliedDate: '2026-03-01', nextInterview: '2026-03-18', source: 'Referral', email: 'liam.c@email.com' },
  { id: 7, name: 'Sofia Rodriguez', role: 'Engineering Manager', team: 'Mobile', stage: 'Onsite', status: 'In Progress', interviewer: 'Rachel Lee', rating: 4, appliedDate: '2026-02-14', nextInterview: '2026-03-16', source: 'LinkedIn', email: 'sofia.r@email.com' },
  { id: 8, name: 'Noah Kim', role: 'Data Engineer', team: 'Data Platform', stage: 'Hired', status: 'Closed', interviewer: 'Sarah Kim', rating: 5, appliedDate: '2026-01-15', nextInterview: '', source: 'Referral', email: 'noah.k@email.com' },
  { id: 9, name: 'Fatima Al-Hassan', role: 'Security Engineer', team: 'Infrastructure', stage: 'Phone Screen', status: 'In Progress', interviewer: 'David Park', rating: 3, appliedDate: '2026-03-08', nextInterview: '2026-03-19', source: 'Careers Page', email: 'fatima.ah@email.com' },
  { id: 10, name: 'Ryan Taylor', role: 'iOS Engineer', team: 'Mobile', stage: 'Technical Screen', status: 'In Progress', interviewer: 'Rachel Lee', rating: 3, appliedDate: '2026-03-03', nextInterview: '2026-03-20', source: 'LinkedIn', email: 'ryan.t@email.com' },
  { id: 11, name: 'Mei Lin', role: 'ML Engineer', team: 'AI/ML', stage: 'Final Round', status: 'In Progress', interviewer: 'David Park', rating: 4, appliedDate: '2026-02-20', nextInterview: '2026-03-15', source: 'Conference', email: 'mei.l@email.com' },
  { id: 12, name: 'Carlos Mendez', role: 'Full Stack Engineer', team: 'Web Platform', stage: 'Withdrawn', status: 'Closed', interviewer: 'Alex Chen', rating: 3, appliedDate: '2026-02-25', nextInterview: '', source: 'Indeed', email: 'carlos.m@email.com' },
];

const STAGES = ['Phone Screen', 'Technical Screen', 'Onsite', 'Final Round', 'Offer Extended', 'Hired', 'Rejected', 'Withdrawn'];
const STATUSES = ['In Progress', 'Pending', 'Closed'];
const TEAMS = ['Web Platform', 'Infrastructure', 'AI/ML', 'Design', 'Mobile', 'Data Platform'];
const SOURCES = ['LinkedIn', 'Referral', 'Careers Page', 'Indeed', 'Dribbble', 'Conference'];

/* ── helpers ──────────────────────────────────────────────────── */
const stageTagColor = (stage) => ({
  'Phone Screen': 'info', 'Technical Screen': 'brand', 'Onsite': 'brand',
  'Final Round': 'warning', 'Offer Extended': 'success', 'Hired': 'success',
  'Rejected': 'danger', 'Withdrawn': 'default',
})[stage] || 'default';

const statusIcon = (status) => {
  if (status === 'In Progress') return <Clock size={14} />;
  if (status === 'Pending') return <AlertCircle size={14} />;
  return <CheckCircle2 size={14} />;
};

const renderStars = (rating) => (
  <span className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} size={14} className={i <= rating ? 'fill-[var(--ds-amber-400)] text-[color:var(--ds-amber-400)]' : 'text-[color:var(--ds-text-tertiary)]'} />
    ))}
  </span>
);

/* ── component ────────────────────────────────────────────────── */
export default function InterviewTracker() {
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRows, setSelectedRows] = useState([]);
  const [newCandidate, setNewCandidate] = useState({
    name: '', role: '', team: '', email: '', source: '', stage: 'Phone Screen', status: 'In Progress', interviewer: '', rating: 3,
  });

  /* filtering */
  const filtered = useMemo(() => {
    let data = [...candidates];
    if (activeTab === 'active') data = data.filter((c) => c.status === 'In Progress' || c.status === 'Pending');
    else if (activeTab === 'offers') data = data.filter((c) => c.stage === 'Offer Extended' || c.stage === 'Hired');
    else if (activeTab === 'closed') data = data.filter((c) => c.status === 'Closed');

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter((c) => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.interviewer.toLowerCase().includes(q));
    }
    if (filterStage) data = data.filter((c) => c.stage === filterStage);
    if (filterTeam) data = data.filter((c) => c.team === filterTeam);
    if (filterStatus) data = data.filter((c) => c.status === filterStatus);
    return data;
  }, [candidates, searchQuery, filterStage, filterTeam, filterStatus, activeTab]);

  /* stats */
  const stats = useMemo(() => ({
    total: candidates.length,
    active: candidates.filter((c) => c.status === 'In Progress' || c.status === 'Pending').length,
    offers: candidates.filter((c) => c.stage === 'Offer Extended').length,
    hired: candidates.filter((c) => c.stage === 'Hired').length,
  }), [candidates]);

  /* inline edit */
  const handleCellEdit = useCallback((rowIndex, columnKey, newValue) => {
    const candidate = filtered[rowIndex];
    setCandidates((prev) => prev.map((c) => (c.id === candidate.id ? { ...c, [columnKey]: newValue } : c)));
  }, [filtered]);

  /* add candidate */
  const handleAddCandidate = () => {
    if (!newCandidate.name || !newCandidate.role) return;
    const id = Math.max(...candidates.map((c) => c.id)) + 1;
    setCandidates((prev) => [...prev, { ...newCandidate, id, rating: Number(newCandidate.rating) || 3, appliedDate: new Date().toISOString().slice(0, 10), nextInterview: '' }]);
    setNewCandidate({ name: '', role: '', team: '', email: '', source: '', stage: 'Phone Screen', status: 'In Progress', interviewer: '', rating: 3 });
    setModalOpen(false);
  };

  const clearFilters = () => { setSearchQuery(''); setFilterStage(''); setFilterTeam(''); setFilterStatus(''); };
  const hasActiveFilters = searchQuery || filterStage || filterTeam || filterStatus;
  const activeFilterCount = [filterStage, filterTeam, filterStatus].filter(Boolean).length;

  /* table columns */
  const columns = [
    {
      key: 'name', header: 'Candidate', sortable: true, width: '200px',
      render: (val, row) => (
        <div>
          <div className="font-medium text-[color:var(--ds-text-primary)]">{val}</div>
          <div className="text-[length:var(--ds-text-xs)] text-[color:var(--ds-text-tertiary)]">{row.email}</div>
        </div>
      ),
    },
    { key: 'role', header: 'Role', sortable: true, width: '190px' },
    { key: 'team', header: 'Team', sortable: true, width: '140px' },
    {
      key: 'stage', header: 'Stage', sortable: true, width: '150px',
      render: (val) => <Tag color={stageTagColor(val)} size="sm">{val}</Tag>,
    },
    {
      key: 'status', header: 'Status', sortable: true, width: '120px',
      render: (val) => <span className="flex items-center gap-1.5 text-[length:var(--ds-text-sm)]">{statusIcon(val)} {val}</span>,
    },
    {
      key: 'rating', header: 'Rating', sortable: true, width: '120px',
      render: (val) => renderStars(val),
    },
    { key: 'interviewer', header: 'Interviewer', sortable: true, width: '140px' },
    { key: 'source', header: 'Source', sortable: true, width: '120px' },
    {
      key: 'appliedDate', header: 'Applied', sortable: true, width: '110px',
      render: (val) => { if (!val) return '—'; return new Date(val + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); },
    },
    {
      key: 'nextInterview', header: 'Next Interview', sortable: true, width: '130px',
      render: (val) => {
        if (!val) return <span className="text-[color:var(--ds-text-tertiary)]">—</span>;
        const d = new Date(val + 'T00:00:00');
        const today = new Date().toISOString().slice(0, 10);
        const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
        const isToday = val === today;
        let label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (isToday) label = 'Today';
        if (val === tomorrow) label = 'Tomorrow';
        return <span className={`flex items-center gap-1 ${isToday ? 'text-[color:var(--ds-text-danger)] font-medium' : ''}`}><Calendar size={13} /> {label}</span>;
      },
    },
  ];

  /* ── render ──────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[var(--ds-bg-primary)]">
      <div className="px-4 py-5 sm:px-6 md:px-8 lg:px-10 max-w-[1600px] mx-auto">

        {/* breadcrumb */}
        <Breadcrumb items={[{ label: 'Home', href: '/', icon: <Home size={14} /> }, { label: 'Recruiting' }, { label: 'Interview Pipeline' }]} />

        {/* title — stacks vertically on mobile */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4 mb-5">
          <div>
            <h1 className="text-[length:var(--ds-text-2xl)] sm:text-[length:var(--ds-text-3xl)] font-bold text-[color:var(--ds-text-primary)]">
              Interview Pipeline
            </h1>
            <p className="text-[length:var(--ds-text-sm)] text-[color:var(--ds-text-secondary)] mt-0.5">
              Track and manage candidates across every hiring stage.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="tertiary" size="sm" icon={<Download size={16} />}>
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button size="sm" icon={<UserPlus size={16} />} onClick={() => setModalOpen(true)}>
              <span className="hidden sm:inline">New Candidate</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        {/* stat cards — 2 col mobile, 4 col desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Total', value: stats.total, icon: <Users size={18} />, color: 'var(--ds-bg-brand)' },
            { label: 'Active', value: stats.active, icon: <TrendingUp size={18} />, color: 'var(--ds-bg-info)' },
            { label: 'Offers', value: stats.offers, icon: <AlertCircle size={18} />, color: 'var(--ds-bg-warning)' },
            { label: 'Hired', value: stats.hired, icon: <CheckCircle2 size={18} />, color: 'var(--ds-bg-success)' },
          ].map((s) => (
            <div key={s.label} className="rounded-[var(--ds-radius-xl)] border border-[var(--ds-border-secondary)] bg-[var(--ds-bg-secondary)] p-3 sm:p-4 flex items-center gap-3">
              <span className="flex shrink-0 items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-[var(--ds-radius-lg)] text-[color:var(--ds-text-on-brand)]" style={{ backgroundColor: s.color }}>
                {s.icon}
              </span>
              <div className="min-w-0">
                <div className="text-[length:var(--ds-text-xs)] text-[color:var(--ds-text-tertiary)] uppercase tracking-wide font-medium truncate">{s.label}</div>
                <div className="text-[length:var(--ds-text-xl)] sm:text-[length:var(--ds-text-2xl)] font-bold text-[color:var(--ds-text-primary)]">{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* tabs — horizontally scrollable on small screens */}
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <Tabs
            tabs={[
              { id: 'all', label: 'All', badge: candidates.length },
              { id: 'active', label: 'Active', badge: stats.active },
              { id: 'offers', label: 'Offers & Hired', badge: stats.offers + stats.hired },
              { id: 'closed', label: 'Closed', badge: candidates.filter((c) => c.status === 'Closed').length },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="underline"
            size="md"
          />
        </div>

        {/* search + filter toggle */}
        <div className="flex items-center gap-2 mt-4 mb-3">
          <div className="flex-1 min-w-0">
            <Search placeholder="Search candidates…" value={searchQuery} onChange={setSearchQuery} onClear={() => setSearchQuery('')} size="sm" />
          </div>
          <Button
            variant={filtersOpen || activeFilterCount > 0 ? 'secondary' : 'tertiary'}
            size="sm"
            icon={<SlidersHorizontal size={16} />}
            onClick={() => setFiltersOpen((o) => !o)}
          >
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--ds-bg-brand)] text-[color:var(--ds-text-on-brand)] text-[length:var(--ds-text-xs)] font-bold">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {/* collapsible filter panel — stacks on mobile, 3-col on sm+ */}
        {filtersOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 p-3 sm:p-4 rounded-[var(--ds-radius-lg)] border border-[var(--ds-border-secondary)] bg-[var(--ds-bg-secondary)]">
            <Select label="Stage" size="sm" options={[{ value: '', label: 'All Stages' }, ...STAGES.map((s) => ({ value: s, label: s }))]} value={filterStage} onChange={(e) => setFilterStage(e.target.value)} />
            <Select label="Team" size="sm" options={[{ value: '', label: 'All Teams' }, ...TEAMS.map((t) => ({ value: t, label: t }))]} value={filterTeam} onChange={(e) => setFilterTeam(e.target.value)} />
            <Select label="Status" size="sm" options={[{ value: '', label: 'All Statuses' }, ...STATUSES.map((s) => ({ value: s, label: s }))]} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} />
            {hasActiveFilters && (
              <div className="sm:col-span-3 flex justify-end">
                <Button variant="ghost" size="sm" icon={<X size={14} />} onClick={clearFilters}>Clear all filters</Button>
              </div>
            )}
          </div>
        )}

        {/* results count */}
        <div className="text-[length:var(--ds-text-sm)] text-[color:var(--ds-text-tertiary)] mb-3">
          Showing {filtered.length} of {candidates.length} candidates{hasActiveFilters && ' (filtered)'}
        </div>

        {/* table — scrollable on mobile with negative margin bleed */}
        <div className="overflow-x-auto -mx-4 sm:mx-0 pb-4">
          <div className="min-w-[960px] px-4 sm:px-0">
            <DataTable
              columns={columns}
              data={filtered}
              sortable
              defaultSortColumn="appliedDate"
              defaultSortDirection="desc"
              selectable
              selectedRows={selectedRows}
              onSelectionChange={setSelectedRows}
              batchActions={
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="secondary">Move Stage</Button>
                  <Button size="sm" variant="danger">Reject</Button>
                </div>
              }
              paginated
              defaultPageSize={10}
              pageSizeOptions={[5, 10, 25]}
              editableColumns={['role', 'interviewer']}
              onCellEdit={handleCellEdit}
              stickyHeader
              striped
              emptyMessage="No candidates match your filters."
            />
          </div>
        </div>
      </div>

      {/* add candidate modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add New Candidate" size="lg"
        footer={<><Button variant="tertiary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleAddCandidate}>Add Candidate</Button></>}
      >
        <Form onSubmit={(e) => { e.preventDefault(); handleAddCandidate(); }}>
          <FormGroup legend="Candidate Details">
            <FormRow>
              <TextInput label="Full Name" required placeholder="e.g. Jane Smith" value={newCandidate.name} onChange={(e) => setNewCandidate((p) => ({ ...p, name: e.target.value }))} />
              <TextInput label="Email" type="email" placeholder="jane@example.com" value={newCandidate.email} onChange={(e) => setNewCandidate((p) => ({ ...p, email: e.target.value }))} />
            </FormRow>
            <FormRow>
              <TextInput label="Role" required placeholder="e.g. Senior Frontend Engineer" value={newCandidate.role} onChange={(e) => setNewCandidate((p) => ({ ...p, role: e.target.value }))} />
              <Select label="Team" options={TEAMS.map((t) => ({ value: t, label: t }))} value={newCandidate.team} onChange={(e) => setNewCandidate((p) => ({ ...p, team: e.target.value }))} placeholder="Select team" />
            </FormRow>
          </FormGroup>
          <FormGroup legend="Interview Info">
            <FormRow>
              <Select label="Stage" options={STAGES.map((s) => ({ value: s, label: s }))} value={newCandidate.stage} onChange={(e) => setNewCandidate((p) => ({ ...p, stage: e.target.value }))} />
              <Select label="Source" options={SOURCES.map((s) => ({ value: s, label: s }))} value={newCandidate.source} onChange={(e) => setNewCandidate((p) => ({ ...p, source: e.target.value }))} placeholder="Select source" />
            </FormRow>
            <TextInput label="Interviewer" placeholder="e.g. Alex Chen" value={newCandidate.interviewer} onChange={(e) => setNewCandidate((p) => ({ ...p, interviewer: e.target.value }))} />
          </FormGroup>
        </Form>
      </Modal>
    </div>
  );
}