'use client';
import { useState } from 'react';
import {
  Button, TextInput, Select, Dropdown, Checkbox, Toggle,
  Form, FormGroup, FormRow, FormActions, Notification, Tag, Spinner
} from '@/components';
import { User, Briefcase, Shield, CheckCircle, ChevronRight, ChevronLeft, Upload, Building2, Phone, Globe, MapPin, Calendar, AlertCircle } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Personal Info',   icon: User,       description: 'Basic details about you' },
  { id: 2, label: 'Role & Team',     icon: Briefcase,  description: 'Your position and department' },
  { id: 3, label: 'Access & Tools',  icon: Shield,     description: 'Systems and permissions' },
  { id: 4, label: 'Review',          icon: CheckCircle,description: 'Confirm your information' },
];

const DEPARTMENTS = [
  { value: 'engineering',  label: 'Engineering' },
  { value: 'design',       label: 'Design' },
  { value: 'product',      label: 'Product' },
  { value: 'marketing',    label: 'Marketing' },
  { value: 'sales',        label: 'Sales' },
  { value: 'hr',           label: 'Human Resources' },
  { value: 'finance',      label: 'Finance' },
  { value: 'legal',        label: 'Legal' },
  { value: 'operations',   label: 'Operations' },
];

const EMPLOYMENT_TYPES = [
  { value: 'full-time',   label: 'Full-Time' },
  { value: 'part-time',   label: 'Part-Time' },
  { value: 'contract',    label: 'Contract' },
  { value: 'intern',      label: 'Internship' },
];

const LOCATIONS = [
  { value: 'hq-sf',       label: 'HQ — San Francisco' },
  { value: 'office-ny',   label: 'Office — New York' },
  { value: 'office-ldn',  label: 'Office — London' },
  { value: 'remote',      label: 'Remote' },
  { value: 'hybrid',      label: 'Hybrid' },
];

const TOOLS = [
  { id: 'slack',    label: 'Slack',           category: 'Communication' },
  { id: 'notion',   label: 'Notion',          category: 'Documentation' },
  { id: 'github',   label: 'GitHub',          category: 'Development' },
  { id: 'figma',    label: 'Figma',           category: 'Design' },
  { id: 'jira',     label: 'Jira',            category: 'Project Management' },
  { id: 'gsuite',   label: 'Google Workspace',category: 'Productivity' },
  { id: 'zoom',     label: 'Zoom',            category: 'Communication' },
  { id: 'linear',   label: 'Linear',          category: 'Project Management' },
  { id: 'aws',      label: 'AWS Console',     category: 'Infrastructure' },
];

const ACCESS_LEVELS = [
  { value: 'read',      label: 'Read Only — View access to most systems' },
  { value: 'standard',  label: 'Standard — Default employee access' },
  { value: 'elevated',  label: 'Elevated — Access to sensitive data' },
  { value: 'admin',     label: 'Admin — Full system administration' },
];

function StepIndicator({ currentStep }) {
  return (
    <div className="relative flex items-start justify-between w-full px-2 mb-10">
      {/* Connecting line */}
      <div
        className="absolute top-5 left-0 right-0 h-px mx-[calc(100%/8)]"
        style={{ background: 'var(--ds-border-primary)' }}
      />
      {/* Progress fill */}
      <div
        className="absolute top-5 left-0 h-px mx-[calc(100%/8)] transition-all"
        style={{
          background: 'var(--ds-bg-brand)',
          width: `calc(${((currentStep - 1) / (STEPS.length - 1)) * 100}% - (100% / 4))`,
          transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
        }}
      />
      {STEPS.map((step) => {
        const Icon = step.icon;
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;
        return (
          <div key={step.id} className="flex flex-col items-center gap-2 z-10 w-1/4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2"
              style={{
                background: isActive ? 'var(--ds-bg-brand)' : isCompleted ? 'var(--ds-bg-brand)' : 'var(--ds-bg-primary)',
                borderColor: isActive || isCompleted ? 'var(--ds-bg-brand)' : 'var(--ds-border-primary)',
                boxShadow: isActive ? '0 0 0 4px color-mix(in srgb, var(--ds-bg-brand) 15%, transparent)' : 'none',
              }}
            >
              {isCompleted ? (
                <CheckCircle size={18} style={{ color: 'var(--ds-text-on-brand)' }} />
              ) : (
                <Icon size={18} style={{ color: isActive ? 'var(--ds-text-on-brand)' : 'var(--ds-icon-secondary)' }} />
              )}
            </div>
            <div className="text-center">
              <p
                className="text-[length:var(--ds-text-sm)] font-medium leading-tight"
                style={{ color: isActive ? 'var(--ds-text-brand)' : isCompleted ? 'var(--ds-text-primary)' : 'var(--ds-text-tertiary)' }}
              >
                {step.label}
              </p>
              <p className="text-[length:var(--ds-text-xs)] hidden sm:block" style={{ color: 'var(--ds-text-tertiary)' }}>
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AvatarUpload({ name }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?';
  return (
    <div className="flex items-center gap-5 mb-2">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-[length:var(--ds-text-2xl)] font-bold flex-shrink-0 border-2"
        style={{
          background: 'var(--ds-bg-brand)',
          color: 'var(--ds-text-on-brand)',
          borderColor: 'var(--ds-border-brand)',
        }}
      >
        {initials}
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[length:var(--ds-text-sm)] font-medium" style={{ color: 'var(--ds-text-primary)' }}>Profile Photo</p>
        <p className="text-[length:var(--ds-text-xs)]" style={{ color: 'var(--ds-text-secondary)' }}>Upload a photo or we'll use your initials.</p>
        <Button variant="secondary" size="sm" icon={<Upload size={14} />}>Upload Photo</Button>
      </div>
    </div>
  );
}

function ToolsGrid({ selected, onToggle }) {
  const categories = [...new Set(TOOLS.map(t => t.category))];
  return (
    <div className="flex flex-col gap-5">
      {categories.map(cat => (
        <div key={cat}>
          <p className="text-[length:var(--ds-text-xs)] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--ds-text-tertiary)' }}>{cat}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TOOLS.filter(t => t.category === cat).map(tool => {
              const isSelected = selected.includes(tool.id);
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => onToggle(tool.id)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all duration-200"
                  style={{
                    background: isSelected ? 'var(--ds-bg-selected)' : 'var(--ds-bg-secondary)',
                    borderColor: isSelected ? 'var(--ds-border-brand)' : 'var(--ds-border-primary)',
                    color: isSelected ? 'var(--ds-text-brand)' : 'var(--ds-text-primary)',
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-sm border-2 flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      borderColor: isSelected ? 'var(--ds-border-brand)' : 'var(--ds-border-primary)',
                      background: isSelected ? 'var(--ds-bg-brand)' : 'transparent',
                    }}
                  >
                    {isSelected && <CheckCircle size={10} style={{ color: 'var(--ds-text-on-brand)' }} />}
                  </div>
                  <span className="text-[length:var(--ds-text-sm)] font-medium">{tool.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function ReviewSection({ label, children }) {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--ds-border-primary)' }}>
      <div className="px-5 py-3 border-b" style={{ background: 'var(--ds-bg-secondary)', borderColor: 'var(--ds-border-primary)' }}>
        <p className="text-[length:var(--ds-text-sm)] font-semibold" style={{ color: 'var(--ds-text-primary)' }}>{label}</p>
      </div>
      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3" style={{ background: 'var(--ds-bg-primary)' }}>
        {children}
      </div>
    </div>
  );
}

function ReviewField({ label, value }) {
  return (
    <div>
      <p className="text-[length:var(--ds-text-xs)] uppercase tracking-wide font-medium mb-0.5" style={{ color: 'var(--ds-text-tertiary)' }}>{label}</p>
      <p className="text-[length:var(--ds-text-sm)]" style={{ color: value ? 'var(--ds-text-primary)' : 'var(--ds-text-tertiary)' }}>
        {value || '—'}
      </p>
    </div>
  );
}

export default function OnboardingForm() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    // Step 1
    firstName: '', lastName: '', email: '', phone: '',
    pronouns: '', linkedIn: '', startDate: '', location: '',
    // Step 2
    jobTitle: '', department: '', employmentType: '', manager: '',
    teamDescription: '', remoteWork: false,
    // Step 3
    tools: [], accessLevel: '', laptopPref: '', agreeTerms: false, agreePrivacy: false,
  });

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => { const n = { ...e }; delete n[field]; return n; });
  };

  const validateStep = () => {
    const errs = {};
    if (step === 1) {
      if (!form.firstName.trim()) errs.firstName = 'First name is required';
      if (!form.lastName.trim()) errs.lastName = 'Last name is required';
      if (!form.email.trim()) errs.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address';
      if (!form.startDate) errs.startDate = 'Start date is required';
      if (!form.location) errs.location = 'Location is required';
    }
    if (step === 2) {
      if (!form.jobTitle.trim()) errs.jobTitle = 'Job title is required';
      if (!form.department) errs.department = 'Department is required';
      if (!form.employmentType) errs.employmentType = 'Employment type is required';
    }
    if (step === 3) {
      if (!form.accessLevel) errs.accessLevel = 'Access level is required';
      if (!form.agreeTerms) errs.agreeTerms = 'You must accept the terms';
      if (!form.agreePrivacy) errs.agreePrivacy = 'You must accept the privacy policy';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => { if (validateStep()) setStep(s => Math.min(s + 1, 4)); };
  const back = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1800));
    setSubmitting(false);
    setSubmitted(true);
  };

  const fullName = [form.firstName, form.lastName].filter(Boolean).join(' ');

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--ds-bg-secondary)' }}>
        <div
          className="w-full max-w-lg rounded-2xl p-10 text-center shadow-[var(--ds-shadow-xl)] border"
          style={{ background: 'var(--ds-bg-primary)', borderColor: 'var(--ds-border-primary)' }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'var(--ds-bg-success)' }}
          >
            <CheckCircle size={40} style={{ color: 'var(--ds-icon-success)' }} />
          </div>
          <h2 className="text-[length:var(--ds-text-3xl)] font-bold mb-3" style={{ color: 'var(--ds-text-primary)' }}>
            Welcome aboard, {form.firstName}! 🎉
          </h2>
          <p className="text-[length:var(--ds-text-md)] mb-6" style={{ color: 'var(--ds-text-secondary)' }}>
            Your onboarding form has been submitted. Your IT team will set up your accounts and tools before your start date on{' '}
            <strong style={{ color: 'var(--ds-text-primary)' }}>{form.startDate || 'your first day'}</strong>.
          </p>
          <div className="rounded-xl p-5 mb-8 text-left" style={{ background: 'var(--ds-bg-secondary)', border: '1px solid var(--ds-border-primary)' }}>
            <p className="text-[length:var(--ds-text-sm)] font-semibold mb-3" style={{ color: 'var(--ds-text-primary)' }}>What happens next</p>
            {[
              'IT will configure your laptop and accounts within 2 business days',
              `An invite will be sent to ${form.email}`,
              `Your manager ${form.manager || 'will reach out'} will schedule an intro meeting`,
              'Your welcome kit will be shipped to your address',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 mb-2 last:mb-0">
                <div
                  className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[length:var(--ds-text-xs)] font-bold mt-0.5"
                  style={{ background: 'var(--ds-bg-brand)', color: 'var(--ds-text-on-brand)' }}
                >
                  {i + 1}
                </div>
                <p className="text-[length:var(--ds-text-sm)]" style={{ color: 'var(--ds-text-secondary)' }}>{item}</p>
              </div>
            ))}
          </div>
          {form.tools.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {form.tools.map(id => {
                const tool = TOOLS.find(t => t.id === id);
                return <Tag key={id} color="brand" size="sm">{tool?.label}</Tag>;
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6" style={{ background: 'var(--ds-bg-secondary)' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--ds-bg-brand)' }}
            >
              <Building2 size={16} style={{ color: 'var(--ds-text-on-brand)' }} />
            </div>
            <span className="text-[length:var(--ds-text-lg)] font-bold" style={{ color: 'var(--ds-text-primary)' }}>Acme Corp</span>
          </div>
          <h1 className="text-[length:var(--ds-text-3xl)] font-bold mb-2" style={{ color: 'var(--ds-text-primary)' }}>
            Employee Onboarding
          </h1>
          <p className="text-[length:var(--ds-text-md)]" style={{ color: 'var(--ds-text-secondary)' }}>
            Complete all steps to get set up before your first day.
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border shadow-[var(--ds-shadow-lg)] overflow-hidden"
          style={{ background: 'var(--ds-bg-primary)', borderColor: 'var(--ds-border-primary)' }}
        >
          {/* Step header */}
          <div className="px-8 pt-8 pb-6 border-b" style={{ borderColor: 'var(--ds-border-primary)' }}>
            <StepIndicator currentStep={step} />
          </div>

          {/* Form body */}
          <div className="px-8 py-7">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <Form>
                <AvatarUpload name={fullName} />
                <FormGroup legend="Personal Details">
                  <FormRow>
                    <TextInput
                      label="First Name" required
                      value={form.firstName} onChange={e => set('firstName', e.target.value)}
                      errorText={errors.firstName} placeholder="Jane"
                    />
                    <TextInput
                      label="Last Name" required
                      value={form.lastName} onChange={e => set('lastName', e.target.value)}
                      errorText={errors.lastName} placeholder="Smith"
                    />
                  </FormRow>
                  <TextInput
                    label="Work Email" required type="email"
                    value={form.email} onChange={e => set('email', e.target.value)}
                    errorText={errors.email} placeholder="jane.smith@acmecorp.com"
                    icon={<Globe size={16} />}
                  />
                  <FormRow>
                    <TextInput
                      label="Phone Number" type="tel"
                      value={form.phone} onChange={e => set('phone', e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      icon={<Phone size={16} />}
                    />
                    <Select
                      label="Pronouns"
                      options={['He/Him', 'She/Her', 'They/Them', 'Prefer not to say', 'Other']}
                      value={form.pronouns} onChange={e => set('pronouns', e.target.value)}
                      placeholder="Select pronouns"
                    />
                  </FormRow>
                </FormGroup>

                <FormGroup legend="Start Details">
                  <FormRow>
                    <TextInput
                      label="Start Date" required type="date"
                      value={form.startDate} onChange={e => set('startDate', e.target.value)}
                      errorText={errors.startDate}
                      icon={<Calendar size={16} />}
                    />
                    <Dropdown
                      label="Office Location" required
                      options={LOCATIONS}
                      value={form.location} onChange={v => set('location', v)}
                      errorText={errors.location}
                      placeholder="Select location"
                      icon={<MapPin size={16} />}
                    />
                  </FormRow>
                  <TextInput
                    label="LinkedIn Profile"
                    value={form.linkedIn} onChange={e => set('linkedIn', e.target.value)}
                    placeholder="https://linkedin.com/in/janesmith"
                  />
                </FormGroup>
              </Form>
            )}

            {/* Step 2: Role & Team */}
            {step === 2 && (
              <Form>
                <FormGroup legend="Position">
                  <TextInput
                    label="Job Title" required
                    value={form.jobTitle} onChange={e => set('jobTitle', e.target.value)}
                    errorText={errors.jobTitle} placeholder="Senior Product Designer"
                    icon={<Briefcase size={16} />}
                  />
                  <FormRow>
                    <Dropdown
                      label="Department" required
                      options={DEPARTMENTS}
                      value={form.department} onChange={v => set('department', v)}
                      errorText={errors.department}
                      placeholder="Select department"
                    />
                    <Dropdown
                      label="Employment Type" required
                      options={EMPLOYMENT_TYPES}
                      value={form.employmentType} onChange={v => set('employmentType', v)}
                      errorText={errors.employmentType}
                      placeholder="Select type"
                    />
                  </FormRow>
                </FormGroup>

                <FormGroup legend="Team">
                  <TextInput
                    label="Direct Manager"
                    value={form.manager} onChange={e => set('manager', e.target.value)}
                    placeholder="Alex Johnson"
                    icon={<User size={16} />}
                  />
                  <TextInput
                    label="Team Description"
                    value={form.teamDescription} onChange={e => set('teamDescription', e.target.value)}
                    placeholder="e.g. Core Platform team working on developer tools"
                  />
                  <div className="mt-2">
                    <Toggle
                      label="This role is primarily remote"
                      checked={form.remoteWork}
                      onChange={e => set('remoteWork', e.target.checked)}
                    />
                  </div>
                </FormGroup>

                {form.department && (
                  <Notification type="info" title={`${DEPARTMENTS.find(d => d.value === form.department)?.label} Team`}>
                    A welcome email will be sent to your department head and HR contact to confirm your details.
                  </Notification>
                )}
              </Form>
            )}

            {/* Step 3: Access & Tools */}
            {step === 3 && (
              <Form>
                <FormGroup legend="System Access">
                  <Dropdown
                    label="Access Level" required
                    options={ACCESS_LEVELS}
                    value={form.accessLevel} onChange={v => set('accessLevel', v)}
                    errorText={errors.accessLevel}
                    placeholder="Select access level"
                  />
                  {form.accessLevel === 'elevated' || form.accessLevel === 'admin' ? (
                    <Notification type="warning" title="Elevated Access Requires Approval">
                      Access requests above Standard level are reviewed by the Security team within 2 business days.
                    </Notification>
                  ) : null}
                  <Select
                    label="Laptop Preference"
                    options={['MacBook Pro 14"', 'MacBook Pro 16"', 'Dell XPS 13', 'Dell XPS 15', 'ThinkPad X1 Carbon']}
                    value={form.laptopPref} onChange={e => set('laptopPref', e.target.value)}
                    placeholder="Select a laptop"
                    helperText="Subject to availability. IT will confirm your allocation."
                  />
                </FormGroup>

                <FormGroup legend="Tools & Applications">
                  <p className="text-[length:var(--ds-text-sm)] mb-4" style={{ color: 'var(--ds-text-secondary)' }}>
                    Select the tools you'll need access to. These will be provisioned by IT before your start date.
                  </p>
                  <ToolsGrid selected={form.tools} onToggle={id => {
                    set('tools', form.tools.includes(id)
                      ? form.tools.filter(t => t !== id)
                      : [...form.tools, id]);
                  }} />
                </FormGroup>

                <FormGroup legend="Agreements">
                  <div className="flex flex-col gap-3">
                    <Checkbox
                      label="I agree to the Employee Terms & Conditions and Code of Conduct"
                      checked={form.agreeTerms}
                      onChange={e => set('agreeTerms', e.target.checked)}
                    />
                    {errors.agreeTerms && (
                      <p className="flex items-center gap-1.5 text-[length:var(--ds-text-xs)]" style={{ color: 'var(--ds-text-danger)' }}>
                        <AlertCircle size={12} /> {errors.agreeTerms}
                      </p>
                    )}
                    <Checkbox
                      label="I acknowledge the Privacy Policy and Data Handling practices"
                      checked={form.agreePrivacy}
                      onChange={e => set('agreePrivacy', e.target.checked)}
                    />
                    {errors.agreePrivacy && (
                      <p className="flex items-center gap-1.5 text-[length:var(--ds-text-xs)]" style={{ color: 'var(--ds-text-danger)' }}>
                        <AlertCircle size={12} /> {errors.agreePrivacy}
                      </p>
                    )}
                  </div>
                </FormGroup>
              </Form>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="flex flex-col gap-5">
                <Notification type="info" title="Review your details">
                  Please confirm everything looks correct. You can go back to make changes before submitting.
                </Notification>

                <ReviewSection label="Personal Information">
                  <ReviewField label="Full Name" value={fullName} />
                  <ReviewField label="Email" value={form.email} />
                  <ReviewField label="Phone" value={form.phone} />
                  <ReviewField label="Pronouns" value={form.pronouns} />
                  <ReviewField label="Start Date" value={form.startDate} />
                  <ReviewField label="Location" value={LOCATIONS.find(l => l.value === form.location)?.label} />
                  <ReviewField label="LinkedIn" value={form.linkedIn} />
                </ReviewSection>

                <ReviewSection label="Role & Team">
                  <ReviewField label="Job Title" value={form.jobTitle} />
                  <ReviewField label="Department" value={DEPARTMENTS.find(d => d.value === form.department)?.label} />
                  <ReviewField label="Employment Type" value={EMPLOYMENT_TYPES.find(e => e.value === form.employmentType)?.label} />
                  <ReviewField label="Manager" value={form.manager} />
                  <ReviewField label="Team Description" value={form.teamDescription} />
                  <ReviewField label="Remote Work" value={form.remoteWork ? 'Yes' : 'No'} />
                </ReviewSection>

                <ReviewSection label="Access & Tools">
                  <ReviewField label="Access Level" value={ACCESS_LEVELS.find(a => a.value === form.accessLevel)?.label?.split('—')[0].trim()} />
                  <ReviewField label="Laptop" value={form.laptopPref} />
                  <div className="sm:col-span-2">
                    <p className="text-[length:var(--ds-text-xs)] uppercase tracking-wide font-medium mb-2" style={{ color: 'var(--ds-text-tertiary)' }}>Tools Requested</p>
                    {form.tools.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {form.tools.map(id => {
                          const tool = TOOLS.find(t => t.id === id);
                          return <Tag key={id} color="brand" size="sm">{tool?.label}</Tag>;
                        })}
                      </div>
                    ) : (
                      <p className="text-[length:var(--ds-text-sm)]" style={{ color: 'var(--ds-text-tertiary)' }}>No tools selected</p>
                    )}
                  </div>
                </ReviewSection>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div
            className="px-8 py-5 border-t flex items-center justify-between"
            style={{ background: 'var(--ds-bg-secondary)', borderColor: 'var(--ds-border-primary)' }}
          >
            <div className="flex items-center gap-2">
              {step > 1 && (
                <Button variant="tertiary" icon={<ChevronLeft size={16} />} iconPosition="left" onClick={back} disabled={submitting}>
                  Back
                </Button>
              )}
              <span className="text-[length:var(--ds-text-sm)]" style={{ color: 'var(--ds-text-tertiary)' }}>
                Step {step} of {STEPS.length}
              </span>
            </div>
            {step < 4 ? (
              <Button icon={<ChevronRight size={16} />} iconPosition="right" onClick={next}>
                Continue
              </Button>
            ) : (
              <Button onClick={handleSubmit} loading={submitting} disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Onboarding'}
              </Button>
            )}
          </div>
        </div>

        <p className="text-center text-[length:var(--ds-text-xs)] mt-6" style={{ color: 'var(--ds-text-tertiary)' }}>
          Questions? Contact HR at <span style={{ color: 'var(--ds-text-brand)' }}>hr@acmecorp.com</span>
        </p>
      </div>
    </div>
  );
}