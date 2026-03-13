'use client';
import { useState, useCallback, useRef } from 'react';
import {
  Header, SideNav, Button, TextInput, Select, Dropdown, Toggle, Checkbox,
  Tabs, Modal, Tag, Notification, Toast, Form, FormGroup, FormRow, FormActions,
  Breadcrumb, Search, KpiCard,
} from '@/components';
import {
  Home, Mail, Send, Inbox, Archive, Settings, Shield, Bell, UserCircle,
  Palette, Globe, Clock, Lock, Eye, EyeOff, Key, AlertTriangle, Check,
  ChevronRight, Trash2, Plus, Link, Unplug, RefreshCw, HardDrive, Users,
  Zap, FileText, AtSign, Sparkles, PenLine, MailOpen,
} from 'lucide-react';

/* ─── helpers ─── */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validate = (fields, rules) => {
  const errors = {};
  for (const [key, fns] of Object.entries(rules)) {
    for (const fn of fns) {
      const msg = fn(fields[key], fields);
      if (msg) { errors[key] = msg; break; }
    }
  }
  return errors;
};
const required = (v) => (!v || !v.toString().trim() ? 'This field is required' : null);
const isEmail = (v) => (v && !emailRegex.test(v) ? 'Enter a valid email address' : null);
const minLen = (n) => (v) => (v && v.length < n ? `Must be at least ${n} characters` : null);
const mustMatch = (field, label) => (v, all) =>
  v !== all[field] ? `Must match ${label}` : null;

/* ─── data ─── */
const SIGNATURE_TEMPLATES = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'professional', label: 'Professional' },
  { value: 'creative', label: 'Creative' },
  { value: 'custom', label: 'Custom HTML' },
];

const TIMEZONE_OPTIONS = [
  { value: 'America/New_York', label: '(UTC-05:00) Eastern Time' },
  { value: 'America/Chicago', label: '(UTC-06:00) Central Time' },
  { value: 'America/Denver', label: '(UTC-07:00) Mountain Time' },
  { value: 'America/Los_Angeles', label: '(UTC-08:00) Pacific Time' },
  { value: 'Europe/London', label: '(UTC+00:00) London' },
  { value: 'Europe/Paris', label: '(UTC+01:00) Paris' },
  { value: 'Asia/Tokyo', label: '(UTC+09:00) Tokyo' },
  { value: 'Asia/Kolkata', label: '(UTC+05:30) Mumbai' },
];

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ja', label: '日本語' },
  { value: 'pt', label: 'Português' },
];

const FONT_OPTIONS = [
  { value: 'system', label: 'System Default' },
  { value: 'serif', label: 'Serif' },
  { value: 'sans', label: 'Sans-serif' },
  { value: 'mono', label: 'Monospace' },
];

const CONNECTED_ACCOUNTS = [
  { provider: 'Google', email: 'alex@gmail.com', connected: true },
  { provider: 'Outlook', email: 'alex@outlook.com', connected: true },
  { provider: 'Yahoo', email: '', connected: false },
];

/* ═══════════════════════════════════════════════════════════════
   TAB: General Settings
   ═══════════════════════════════════════════════════════════════ */
function GeneralTab() {
  const [fields, setFields] = useState({
    displayName: 'Alex Morgan',
    email: 'alex.morgan@company.io',
    replyTo: '',
    timezone: 'America/New_York',
    language: 'en',
    dateFormat: '12h',
    messagesPerPage: '25',
    defaultFolder: 'inbox',
    undoSendDelay: '10',
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const set = (k) => (e) => {
    const v = typeof e === 'string' ? e : e?.target?.value ?? e;
    setFields((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: null }));
  };

  const handleSave = () => {
    const errs = validate(fields, {
      displayName: [required],
      email: [required, isEmail],
      replyTo: [(v) => (v ? isEmail(v) : null)],
    });
    setErrors(errs);
    if (!Object.keys(errs).length) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    }
  };

  return (
    <div className="space-y-8">
      <Toast type="success" title="Settings saved" visible={saved} onClose={() => setSaved(false)} duration={3500} />

      <Form>
        <FormGroup legend="Profile">
          <FormRow>
            <TextInput
              label="Display Name"
              value={fields.displayName}
              onChange={set('displayName')}
              errorText={errors.displayName}
              required
              icon={<UserCircle size={16} />}
            />
            <TextInput
              label="Email Address"
              value={fields.email}
              onChange={set('email')}
              errorText={errors.email}
              required
              type="email"
              icon={<AtSign size={16} />}
            />
          </FormRow>
          <FormRow>
            <TextInput
              label="Reply-To Address"
              value={fields.replyTo}
              onChange={set('replyTo')}
              errorText={errors.replyTo}
              placeholder="Leave blank to use primary email"
              helperText="Replies to your emails will go to this address"
              icon={<Mail size={16} />}
            />
            <div />
          </FormRow>
        </FormGroup>

        <FormGroup legend="Regional">
          <FormRow>
            <Dropdown
              label="Timezone"
              options={TIMEZONE_OPTIONS}
              value={fields.timezone}
              onChange={set('timezone')}
            />
            <Dropdown
              label="Language"
              options={LANGUAGE_OPTIONS}
              value={fields.language}
              onChange={set('language')}
            />
          </FormRow>
          <FormRow>
            <Select
              label="Time Format"
              options={[
                { value: '12h', label: '12-hour (2:30 PM)' },
                { value: '24h', label: '24-hour (14:30)' },
              ]}
              value={fields.dateFormat}
              onChange={set('dateFormat')}
            />
            <Select
              label="Messages Per Page"
              options={['10', '25', '50', '100']}
              value={fields.messagesPerPage}
              onChange={set('messagesPerPage')}
            />
          </FormRow>
        </FormGroup>

        <FormGroup legend="Sending">
          <FormRow>
            <Select
              label="Default Folder View"
              options={[
                { value: 'inbox', label: 'Inbox' },
                { value: 'priority', label: 'Priority Inbox' },
                { value: 'unread', label: 'Unread First' },
              ]}
              value={fields.defaultFolder}
              onChange={set('defaultFolder')}
            />
            <Select
              label="Undo Send Delay"
              options={[
                { value: '5', label: '5 seconds' },
                { value: '10', label: '10 seconds' },
                { value: '20', label: '20 seconds' },
                { value: '30', label: '30 seconds' },
              ]}
              value={fields.undoSendDelay}
              onChange={set('undoSendDelay')}
              helperText="Time window to cancel a sent email"
            />
          </FormRow>
        </FormGroup>

        <FormActions align="right">
          <Button variant="tertiary">Reset to Defaults</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </FormActions>
      </Form>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB: Compose & Signatures
   ═══════════════════════════════════════════════════════════════ */
function ComposeTab() {
  const [fields, setFields] = useState({
    signatureTemplate: 'professional',
    signatureName: 'Alex Morgan',
    signatureTitle: 'Product Designer',
    signatureCompany: 'Acme Inc.',
    signaturePhone: '+1 (555) 012-3456',
    font: 'system',
    autoCorrect: true,
    spellCheck: true,
    smartCompose: true,
    defaultCc: '',
    defaultBcc: '',
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const set = (k) => (e) => {
    const v = typeof e === 'object' && e !== null && 'target' in e ? e.target.value : e;
    setFields((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: null }));
  };
  const toggle = (k) => () => setFields((p) => ({ ...p, [k]: !p[k] }));

  const handleSave = () => {
    const errs = validate(fields, {
      signatureName: [required],
      defaultCc: [(v) => (v ? isEmail(v) : null)],
      defaultBcc: [(v) => (v ? isEmail(v) : null)],
    });
    setErrors(errs);
    if (!Object.keys(errs).length) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    }
  };

  return (
    <div className="space-y-8">
      <Toast type="success" title="Compose settings saved" visible={saved} onClose={() => setSaved(false)} duration={3500} />

      <Form>
        <FormGroup legend="Email Signature">
          <FormRow>
            <Dropdown
              label="Signature Template"
              options={SIGNATURE_TEMPLATES}
              value={fields.signatureTemplate}
              onChange={set('signatureTemplate')}
            />
            <Dropdown
              label="Compose Font"
              options={FONT_OPTIONS}
              value={fields.font}
              onChange={set('font')}
            />
          </FormRow>
          <FormRow>
            <TextInput
              label="Full Name"
              value={fields.signatureName}
              onChange={set('signatureName')}
              errorText={errors.signatureName}
              required
            />
            <TextInput
              label="Job Title"
              value={fields.signatureTitle}
              onChange={set('signatureTitle')}
            />
          </FormRow>
          <FormRow>
            <TextInput
              label="Company"
              value={fields.signatureCompany}
              onChange={set('signatureCompany')}
            />
            <TextInput
              label="Phone"
              value={fields.signaturePhone}
              onChange={set('signaturePhone')}
            />
          </FormRow>

          {/* Signature preview */}
          <div
            className="rounded-[var(--ds-radius-lg)] border p-5 mt-2"
            style={{
              borderColor: 'var(--ds-border-secondary)',
              background: 'var(--ds-bg-secondary)',
            }}
          >
            <p
              className="text-[length:var(--ds-text-xs)] uppercase tracking-wider mb-2 font-semibold"
              style={{ color: 'var(--ds-text-tertiary)' }}
            >
              Signature Preview
            </p>
            <div className="flex items-start gap-3">
              <div
                className="w-1 self-stretch rounded-full"
                style={{ background: 'var(--ds-bg-brand)' }}
              />
              <div>
                <p className="font-semibold" style={{ color: 'var(--ds-text-primary)' }}>
                  {fields.signatureName || 'Your Name'}
                </p>
                {fields.signatureTitle && (
                  <p className="text-[length:var(--ds-text-sm)]" style={{ color: 'var(--ds-text-secondary)' }}>
                    {fields.signatureTitle}
                    {fields.signatureCompany && ` · ${fields.signatureCompany}`}
                  </p>
                )}
                {fields.signaturePhone && (
                  <p className="text-[length:var(--ds-text-sm)] mt-1" style={{ color: 'var(--ds-text-tertiary)' }}>
                    {fields.signaturePhone}
                  </p>
                )}
              </div>
            </div>
          </div>
        </FormGroup>

        <FormGroup legend="Compose Behavior">
          <div className="space-y-4">
            <Toggle label="Auto-correct" checked={fields.autoCorrect} onChange={toggle('autoCorrect')} />
            <Toggle label="Spell check" checked={fields.spellCheck} onChange={toggle('spellCheck')} />
            <Toggle label="Smart compose suggestions" checked={fields.smartCompose} onChange={toggle('smartCompose')} />
          </div>
        </FormGroup>

        <FormGroup legend="Default Recipients">
          <FormRow>
            <TextInput
              label="Default CC"
              value={fields.defaultCc}
              onChange={set('defaultCc')}
              errorText={errors.defaultCc}
              placeholder="email@example.com"
              helperText="Automatically CC this address on all outgoing mail"
            />
            <TextInput
              label="Default BCC"
              value={fields.defaultBcc}
              onChange={set('defaultBcc')}
              errorText={errors.defaultBcc}
              placeholder="email@example.com"
              helperText="Automatically BCC this address on all outgoing mail"
            />
          </FormRow>
        </FormGroup>

        <FormActions align="right">
          <Button variant="tertiary">Reset</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </FormActions>
      </Form>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB: Notifications
   ═══════════════════════════════════════════════════════════════ */
function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    desktopNotifs: true,
    soundNotifs: false,
    badgeCount: true,
    digestEmail: true,
    digestFrequency: 'daily',
    notifyNewEmail: true,
    notifyCalendar: true,
    notifyMentions: true,
    notifyMarketing: false,
    quietStart: '22:00',
    quietEnd: '07:00',
    quietEnabled: true,
  });
  const [saved, setSaved] = useState(false);

  const toggle = (k) => () => setPrefs((p) => ({ ...p, [k]: !p[k] }));
  const set = (k) => (e) => {
    const v = typeof e === 'string' ? e : e?.target?.value ?? e;
    setPrefs((p) => ({ ...p, [k]: v }));
  };

  return (
    <div className="space-y-8">
      <Toast type="success" title="Notification preferences saved" visible={saved} onClose={() => setSaved(false)} duration={3500} />

      <Form>
        <FormGroup legend="Delivery Channels">
          <div className="space-y-4">
            <Toggle label="Desktop notifications" checked={prefs.desktopNotifs} onChange={toggle('desktopNotifs')} />
            <Toggle label="Sound alerts" checked={prefs.soundNotifs} onChange={toggle('soundNotifs')} />
            <Toggle label="Unread badge count" checked={prefs.badgeCount} onChange={toggle('badgeCount')} />
          </div>
        </FormGroup>

        <FormGroup legend="Email Digest">
          <Toggle label="Receive email digest" checked={prefs.digestEmail} onChange={toggle('digestEmail')} />
          {prefs.digestEmail && (
            <div className="mt-4 ml-1">
              <Select
                label="Frequency"
                options={[
                  { value: 'realtime', label: 'Real-time' },
                  { value: 'hourly', label: 'Hourly' },
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                ]}
                value={prefs.digestFrequency}
                onChange={set('digestFrequency')}
              />
            </div>
          )}
        </FormGroup>

        <FormGroup legend="Notify Me About">
          <div className="space-y-4">
            <Checkbox label="New email received" checked={prefs.notifyNewEmail} onChange={toggle('notifyNewEmail')} />
            <Checkbox label="Calendar invites and reminders" checked={prefs.notifyCalendar} onChange={toggle('notifyCalendar')} />
            <Checkbox label="Mentions and replies" checked={prefs.notifyMentions} onChange={toggle('notifyMentions')} />
            <Checkbox label="Promotional and marketing" checked={prefs.notifyMarketing} onChange={toggle('notifyMarketing')} />
          </div>
        </FormGroup>

        <FormGroup legend="Quiet Hours">
          <Toggle label="Enable quiet hours" checked={prefs.quietEnabled} onChange={toggle('quietEnabled')} />
          {prefs.quietEnabled && (
            <FormRow>
              <TextInput
                label="Start Time"
                type="time"
                value={prefs.quietStart}
                onChange={set('quietStart')}
                icon={<Clock size={16} />}
              />
              <TextInput
                label="End Time"
                type="time"
                value={prefs.quietEnd}
                onChange={set('quietEnd')}
                icon={<Clock size={16} />}
              />
            </FormRow>
          )}
          <Notification type="info" title="Quiet hours">
            During quiet hours, notifications are silenced. Urgent emails from starred contacts will still come through.
          </Notification>
        </FormGroup>

        <FormActions align="right">
          <Button variant="tertiary">Reset to Defaults</Button>
          <Button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3500); }}>
            Save Changes
          </Button>
        </FormActions>
      </Form>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB: Security & Privacy
   ═══════════════════════════════════════════════════════════════ */
function SecurityTab() {
  const [passwordModal, setPasswordModal] = useState(false);
  const [pwFields, setPwFields] = useState({ current: '', newPw: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [blockTrackers, setBlockTrackers] = useState(true);
  const [readReceipts, setReadReceipts] = useState(false);
  const [autoLoadImages, setAutoLoadImages] = useState(false);
  const [saved, setSaved] = useState(false);

  const setPw = (k) => (e) => {
    setPwFields((p) => ({ ...p, [k]: e.target.value }));
    setPwErrors((p) => ({ ...p, [k]: null }));
  };
  const toggleShow = (k) => () => setShowPw((p) => ({ ...p, [k]: !p[k] }));

  const handlePasswordChange = () => {
    const errs = validate(pwFields, {
      current: [required],
      newPw: [required, minLen(8)],
      confirm: [required, mustMatch('newPw', 'new password')],
    });
    setPwErrors(errs);
    if (!Object.keys(errs).length) {
      setPasswordModal(false);
      setPwFields({ current: '', newPw: '', confirm: '' });
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    }
  };

  const TogglePwIcon = ({ field }) => (
    <button
      type="button"
      onClick={toggleShow(field)}
      className="ds-focus-ring rounded-[var(--ds-radius-sm)]"
      style={{ color: 'var(--ds-icon-secondary)' }}
    >
      {showPw[field] ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );

  return (
    <div className="space-y-8">
      <Toast type="success" title="Password changed successfully" visible={saved} onClose={() => setSaved(false)} duration={3500} />

      <Form>
        <FormGroup legend="Authentication">
          <div
            className="flex items-center justify-between p-4 rounded-[var(--ds-radius-lg)] border"
            style={{ borderColor: 'var(--ds-border-secondary)', background: 'var(--ds-bg-secondary)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-[var(--ds-radius-lg)] flex items-center justify-center"
                style={{ background: 'var(--ds-bg-brand)', color: 'var(--ds-text-on-brand)' }}
              >
                <Key size={18} />
              </div>
              <div>
                <p className="font-semibold text-[length:var(--ds-text-sm)]" style={{ color: 'var(--ds-text-primary)' }}>
                  Password
                </p>
                <p className="text-[length:var(--ds-text-xs)]" style={{ color: 'var(--ds-text-tertiary)' }}>
                  Last changed 14 days ago
                </p>
              </div>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setPasswordModal(true)}>
              Change Password
            </Button>
          </div>

          <div className="mt-4 space-y-4">
            <Toggle label="Two-factor authentication (2FA)" checked={twoFactor} onChange={() => setTwoFactor((p) => !p)} />
            {twoFactor && (
              <Notification type="success" title="2FA is active">
                Your account is protected with an authenticator app.
              </Notification>
            )}
          </div>

          <div className="mt-4">
            <Select
              label="Auto-Lock Session After"
              options={[
                { value: '15', label: '15 minutes' },
                { value: '30', label: '30 minutes' },
                { value: '60', label: '1 hour' },
                { value: '120', label: '2 hours' },
                { value: 'never', label: 'Never' },
              ]}
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(typeof e === 'string' ? e : e.target.value)}
              helperText="How long before your session is automatically locked"
            />
          </div>
        </FormGroup>

        <FormGroup legend="Privacy">
          <div className="space-y-4">
            <Toggle label="Block email tracking pixels" checked={blockTrackers} onChange={() => setBlockTrackers((p) => !p)} />
            <Toggle label="Send read receipts" checked={readReceipts} onChange={() => setReadReceipts((p) => !p)} />
            <Toggle label="Auto-load remote images" checked={autoLoadImages} onChange={() => setAutoLoadImages((p) => !p)} />
          </div>
          {!autoLoadImages && (
            <Notification type="warning" title="Remote images disabled" className="mt-4">
              Images in emails won't load automatically. You can load them individually per email.
            </Notification>
          )}
        </FormGroup>

        <FormGroup legend="Connected Accounts">
          <div className="space-y-3">
            {CONNECTED_ACCOUNTS.map((acct) => (
              <div
                key={acct.provider}
                className="flex items-center justify-between p-3 rounded-[var(--ds-radius-lg)] border"
                style={{ borderColor: 'var(--ds-border-secondary)', background: 'var(--ds-bg-primary)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-[var(--ds-radius-md)] flex items-center justify-center"
                    style={{
                      background: acct.connected ? 'var(--ds-bg-success)' : 'var(--ds-bg-tertiary)',
                      color: acct.connected ? 'var(--ds-text-success)' : 'var(--ds-text-tertiary)',
                    }}
                  >
                    {acct.connected ? <Link size={14} /> : <Unplug size={14} />}
                  </div>
                  <div>
                    <p className="font-medium text-[length:var(--ds-text-sm)]" style={{ color: 'var(--ds-text-primary)' }}>
                      {acct.provider}
                    </p>
                    {acct.email && (
                      <p className="text-[length:var(--ds-text-xs)]" style={{ color: 'var(--ds-text-tertiary)' }}>
                        {acct.email}
                      </p>
                    )}
                  </div>
                </div>
                {acct.connected ? (
                  <Button size="sm" variant="ghost" icon={<Trash2 size={14} />}>
                    Disconnect
                  </Button>
                ) : (
                  <Button size="sm" variant="secondary" icon={<Plus size={14} />}>
                    Connect
                  </Button>
                )}
              </div>
            ))}
          </div>
        </FormGroup>

        <FormActions align="right">
          <Button variant="tertiary">Cancel</Button>
          <Button>Save Changes</Button>
        </FormActions>
      </Form>

      {/* Password Change Modal */}
      <Modal
        open={passwordModal}
        onClose={() => { setPasswordModal(false); setPwErrors({}); }}
        title="Change Password"
        size="sm"
        footer={
          <>
            <Button variant="tertiary" onClick={() => { setPasswordModal(false); setPwErrors({}); }}>
              Cancel
            </Button>
            <Button onClick={handlePasswordChange}>Update Password</Button>
          </>
        }
      >
        <div className="space-y-4">
          <TextInput
            label="Current Password"
            type={showPw.current ? 'text' : 'password'}
            value={pwFields.current}
            onChange={setPw('current')}
            errorText={pwErrors.current}
            required
            icon={<Lock size={16} />}
          />
          <TextInput
            label="New Password"
            type={showPw.newPw ? 'text' : 'password'}
            value={pwFields.newPw}
            onChange={setPw('newPw')}
            errorText={pwErrors.newPw}
            required
            helperText="Minimum 8 characters"
            icon={<Lock size={16} />}
          />
          <TextInput
            label="Confirm New Password"
            type={showPw.confirm ? 'text' : 'password'}
            value={pwFields.confirm}
            onChange={setPw('confirm')}
            errorText={pwErrors.confirm}
            required
            icon={<Lock size={16} />}
          />
        </div>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB: Appearance
   ═══════════════════════════════════════════════════════════════ */
function AppearanceTab() {
  const [theme, setTheme] = useState('light');
  const [density, setDensity] = useState('comfortable');
  const [previewPane, setPreviewPane] = useState('right');
  const [threadView, setThreadView] = useState(true);
  const [showAvatars, setShowAvatars] = useState(true);
  const [showSnippets, setShowSnippets] = useState(true);
  const [swipeActions, setSwipeActions] = useState(true);
  const [saved, setSaved] = useState(false);

  const themes = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'high-contrast', label: 'High Contrast', icon: '👁️' },
  ];

  return (
    <div className="space-y-8">
      <Toast type="success" title="Appearance updated" visible={saved} onClose={() => setSaved(false)} duration={3500} />

      <Form>
        <FormGroup legend="Theme">
          <div className="grid grid-cols-3 gap-3">
            {themes.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTheme(t.value)}
                className="ds-focus-ring flex flex-col items-center gap-2 p-4 rounded-[var(--ds-radius-lg)] border-2 transition-all duration-[var(--ds-duration-normal)]"
                style={{
                  borderColor: theme === t.value ? 'var(--ds-border-brand)' : 'var(--ds-border-secondary)',
                  background: theme === t.value ? 'var(--ds-bg-selected)' : 'var(--ds-bg-primary)',
                }}
              >
                <span className="text-2xl">{t.icon}</span>
                <span
                  className="font-medium text-[length:var(--ds-text-sm)]"
                  style={{ color: 'var(--ds-text-primary)' }}
                >
                  {t.label}
                </span>
                {theme === t.value && <Tag color="brand" size="sm">Active</Tag>}
              </button>
            ))}
          </div>
        </FormGroup>

        <FormGroup legend="Layout">
          <FormRow>
            <Select
              label="Display Density"
              options={[
                { value: 'compact', label: 'Compact' },
                { value: 'comfortable', label: 'Comfortable' },
                { value: 'spacious', label: 'Spacious' },
              ]}
              value={density}
              onChange={(e) => setDensity(typeof e === 'string' ? e : e.target.value)}
            />
            <Select
              label="Preview Pane"
              options={[
                { value: 'right', label: 'Right side' },
                { value: 'bottom', label: 'Bottom' },
                { value: 'off', label: 'Off' },
              ]}
              value={previewPane}
              onChange={(e) => setPreviewPane(typeof e === 'string' ? e : e.target.value)}
            />
          </FormRow>
        </FormGroup>

        <FormGroup legend="Inbox Display">
          <div className="space-y-4">
            <Toggle label="Conversation / thread view" checked={threadView} onChange={() => setThreadView((p) => !p)} />
            <Toggle label="Show sender avatars" checked={showAvatars} onChange={() => setShowAvatars((p) => !p)} />
            <Toggle label="Show message snippets" checked={showSnippets} onChange={() => setShowSnippets((p) => !p)} />
            <Toggle label="Swipe actions on mobile" checked={swipeActions} onChange={() => setSwipeActions((p) => !p)} />
          </div>
        </FormGroup>

        <FormActions align="right">
          <Button variant="tertiary">Reset to Defaults</Button>
          <Button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3500); }}>
            Save Changes
          </Button>
        </FormActions>
      </Form>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN: Settings Page
   ═══════════════════════════════════════════════════════════════ */
export default function SettingsPage() {
  const [sideNavCollapsed, setSideNavCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col" style={{ background: 'var(--ds-bg-primary)' }}>
      {/* Top Header */}
      <Header
        productName="Mailstream"
        navItems={[
          { label: 'Inbox', href: '/inbox', icon: <Inbox size={16} /> },
          { label: 'Sent', href: '/sent', icon: <Send size={16} /> },
          { label: 'Archive', href: '/archive', icon: <Archive size={16} /> },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" icon={<Bell size={16} />} />
            <Button size="sm" variant="ghost" icon={<UserCircle size={16} />} />
          </div>
        }
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <SideNav
          collapsed={sideNavCollapsed}
          items={[
            { label: 'Inbox', icon: <Inbox size={18} />, href: '/inbox', badge: '12' },
            { label: 'Starred', icon: <Sparkles size={18} />, href: '/starred' },
            { label: 'Sent', icon: <Send size={18} />, href: '/sent' },
            { label: 'Drafts', icon: <PenLine size={18} />, href: '/drafts', badge: '3' },
            { label: 'Archive', icon: <Archive size={18} />, href: '/archive' },
            { label: 'Trash', icon: <Trash2 size={18} />, href: '/trash' },
            { divider: true, label: 'Manage' },
            { label: 'Settings', icon: <Settings size={18} />, href: '/settings', active: true },
          ]}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Breadcrumb */}
            <Breadcrumb
              items={[
                { label: 'Inbox', href: '/', icon: <Inbox size={14} /> },
                { label: 'Settings' },
              ]}
            />

            {/* Page Title */}
            <div className="mt-4 mb-8">
              <h1
                className="text-[length:var(--ds-text-3xl)] font-bold"
                style={{ color: 'var(--ds-text-primary)' }}
              >
                Settings
              </h1>
              <p
                className="mt-1 text-[length:var(--ds-text-md)]"
                style={{ color: 'var(--ds-text-secondary)' }}
              >
                Manage your email preferences, security, and account settings.
              </p>
            </div>

            {/* Tabbed Content */}
            <Tabs
              variant="underline"
              size="md"
              tabs={[
                {
                  id: 'general',
                  label: 'General',
                  icon: <Settings size={16} />,
                  content: <div className="pt-6"><GeneralTab /></div>,
                },
                {
                  id: 'compose',
                  label: 'Compose',
                  icon: <PenLine size={16} />,
                  content: <div className="pt-6"><ComposeTab /></div>,
                },
                {
                  id: 'notifications',
                  label: 'Notifications',
                  icon: <Bell size={16} />,
                  content: <div className="pt-6"><NotificationsTab /></div>,
                },
                {
                  id: 'security',
                  label: 'Security',
                  icon: <Shield size={16} />,
                  content: <div className="pt-6"><SecurityTab /></div>,
                },
                {
                  id: 'appearance',
                  label: 'Appearance',
                  icon: <Palette size={16} />,
                  content: <div className="pt-6"><AppearanceTab /></div>,
                },
              ]}
              defaultActiveTab="general"
            />
          </div>
        </main>
      </div>
    </div>
  );
}