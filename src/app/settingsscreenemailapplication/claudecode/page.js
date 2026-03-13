'use client';

import { useState, useCallback } from 'react';
import {
  Tabs,
  Breadcrumb,
  Button,
  TextInput,
  Select,
  Toggle,
  Checkbox,
  Dropdown,
  Form,
  FormGroup,
  FormRow,
  FormActions,
  Toast,
  Notification,
  Tag,
  Modal,
} from '@/components';
import {
  Home,
  Mail,
  Bell,
  Shield,
  FileText,
  User,
} from 'lucide-react';

// ─── Validation helpers ───────────────────────────────────────────────
function validateEmail(email) {
  if (!email) return 'Email address is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address';
  return '';
}

function validateRequired(value, fieldName) {
  if (!value || !value.trim()) return `${fieldName} is required`;
  return '';
}

function validatePassword(password) {
  if (!password) return 'Current password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  return '';
}

function validateNewPassword(password) {
  if (!password) return 'New password is required';
  if (password.length < 8) return 'Must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Must contain an uppercase letter';
  if (!/[0-9]/.test(password)) return 'Must contain a number';
  return '';
}

function validateConfirmPassword(confirm, newPass) {
  if (!confirm) return 'Please confirm your new password';
  if (confirm !== newPass) return 'Passwords do not match';
  return '';
}

// ─── Tab: Account ─────────────────────────────────────────────────────
function AccountTab({ onSave }) {
  const [form, setForm] = useState({
    displayName: 'Jane Cooper',
    email: 'jane.cooper@acme.com',
    replyTo: '',
    language: 'en',
    timezone: 'utc-8',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const blur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = {};
    if (field === 'displayName') err.displayName = validateRequired(form.displayName, 'Display name');
    if (field === 'email') err.email = validateEmail(form.email);
    if (field === 'replyTo' && form.replyTo) err.replyTo = validateEmail(form.replyTo) ? 'Enter a valid email' : '';
    setErrors((prev) => ({ ...prev, ...err }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {
      displayName: validateRequired(form.displayName, 'Display name'),
      email: validateEmail(form.email),
      replyTo: form.replyTo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.replyTo) ? 'Enter a valid email' : '',
    };
    setErrors(newErrors);
    setTouched({ displayName: true, email: true, replyTo: true });
    if (Object.values(newErrors).some(Boolean)) return;
    onSave('Account settings saved successfully');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup legend="Profile">
        <FormRow>
          <TextInput
            label="Display Name"
            value={form.displayName}
            onChange={(e) => update('displayName', e.target.value)}
            onBlur={() => blur('displayName')}
            errorText={touched.displayName ? errors.displayName : ''}
            required
            icon={<User size={16} />}
          />
          <TextInput
            label="Email Address"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            onBlur={() => blur('email')}
            errorText={touched.email ? errors.email : ''}
            required
            icon={<Mail size={16} />}
          />
        </FormRow>
        <TextInput
          label="Reply-To Address"
          type="email"
          value={form.replyTo}
          onChange={(e) => update('replyTo', e.target.value)}
          onBlur={() => blur('replyTo')}
          errorText={touched.replyTo ? errors.replyTo : ''}
          helperText="Leave blank to use your primary email address"
          placeholder="optional-reply@acme.com"
          icon={<Mail size={16} />}
        />
      </FormGroup>

      <FormGroup legend="Regional">
        <FormRow>
          <Select
            label="Language"
            value={form.language}
            onChange={(e) => update('language', e.target.value)}
            options={[
              { value: 'en', label: 'English' },
              { value: 'es', label: 'Spanish' },
              { value: 'fr', label: 'French' },
              { value: 'de', label: 'German' },
              { value: 'ja', label: 'Japanese' },
            ]}
          />
          <Dropdown
            label="Timezone"
            value={form.timezone}
            onChange={(value) => update('timezone', value)}
            options={[
              { value: 'utc-8', label: '(UTC-08:00) Pacific Time' },
              { value: 'utc-5', label: '(UTC-05:00) Eastern Time' },
              { value: 'utc+0', label: '(UTC+00:00) London' },
              { value: 'utc+1', label: '(UTC+01:00) Central Europe' },
              { value: 'utc+5.5', label: '(UTC+05:30) India' },
              { value: 'utc+9', label: '(UTC+09:00) Tokyo' },
            ]}
          />
        </FormRow>
      </FormGroup>

      <FormActions align="right">
        <Button variant="tertiary" type="reset">Cancel</Button>
        <Button type="submit">Save Changes</Button>
      </FormActions>
    </Form>
  );
}

// ─── Tab: Mail ────────────────────────────────────────────────────────
function MailTab({ onSave }) {
  const [form, setForm] = useState({
    messagesPerPage: '25',
    defaultView: 'inbox',
    threadConversations: true,
    showSnippets: true,
    autoAdvance: 'next',
    undoSendDelay: '10',
    markAsReadDelay: 'immediately',
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave('Mail preferences saved');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup legend="Reading">
        <FormRow>
          <Select
            label="Messages Per Page"
            value={form.messagesPerPage}
            onChange={(e) => update('messagesPerPage', e.target.value)}
            options={['10', '25', '50', '100']}
          />
          <Select
            label="Default View"
            value={form.defaultView}
            onChange={(e) => update('defaultView', e.target.value)}
            options={[
              { value: 'inbox', label: 'Inbox' },
              { value: 'unread', label: 'Unread' },
              { value: 'starred', label: 'Starred' },
              { value: 'all', label: 'All Mail' },
            ]}
          />
        </FormRow>
        <div className="flex flex-col gap-4 mt-2">
          <Toggle
            label="Group emails into conversations"
            checked={form.threadConversations}
            onChange={(e) => update('threadConversations', e.target.checked)}
          />
          <Toggle
            label="Show message snippets in list"
            checked={form.showSnippets}
            onChange={(e) => update('showSnippets', e.target.checked)}
          />
        </div>
      </FormGroup>

      <FormGroup legend="Sending">
        <FormRow>
          <Select
            label="Undo Send Delay"
            value={form.undoSendDelay}
            onChange={(e) => update('undoSendDelay', e.target.value)}
            options={[
              { value: '5', label: '5 seconds' },
              { value: '10', label: '10 seconds' },
              { value: '20', label: '20 seconds' },
              { value: '30', label: '30 seconds' },
            ]}
            helperText="Time window to cancel a sent message"
          />
          <Select
            label="After Archiving / Deleting"
            value={form.autoAdvance}
            onChange={(e) => update('autoAdvance', e.target.value)}
            options={[
              { value: 'next', label: 'Go to next message' },
              { value: 'previous', label: 'Go to previous message' },
              { value: 'list', label: 'Return to message list' },
            ]}
          />
        </FormRow>
        <Select
          label="Mark as Read"
          value={form.markAsReadDelay}
          onChange={(e) => update('markAsReadDelay', e.target.value)}
          options={[
            { value: 'immediately', label: 'Immediately when opened' },
            { value: '2', label: 'After 2 seconds' },
            { value: '5', label: 'After 5 seconds' },
            { value: 'never', label: 'Never (mark manually)' },
          ]}
          wrapperClassName="max-w-sm"
        />
      </FormGroup>

      <FormActions align="right">
        <Button variant="tertiary" type="reset">Cancel</Button>
        <Button type="submit">Save Changes</Button>
      </FormActions>
    </Form>
  );
}

// ─── Tab: Notifications ───────────────────────────────────────────────
function NotificationsTab({ onSave }) {
  const [form, setForm] = useState({
    emailNotifications: true,
    desktopNotifications: true,
    soundAlerts: false,
    newMail: true,
    mentions: true,
    replies: true,
    newsletters: false,
    promotions: false,
    digestFrequency: 'daily',
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave('Notification preferences saved');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup legend="Channels">
        <div className="flex flex-col gap-4">
          <Toggle
            label="Email notifications"
            checked={form.emailNotifications}
            onChange={(e) => update('emailNotifications', e.target.checked)}
          />
          <Toggle
            label="Desktop push notifications"
            checked={form.desktopNotifications}
            onChange={(e) => update('desktopNotifications', e.target.checked)}
          />
          <Toggle
            label="Sound alerts"
            checked={form.soundAlerts}
            onChange={(e) => update('soundAlerts', e.target.checked)}
          />
        </div>
      </FormGroup>

      <FormGroup legend="Notify me about">
        <div className="flex flex-col gap-3">
          <Checkbox
            label="New incoming mail"
            checked={form.newMail}
            onChange={(e) => update('newMail', e.target.checked)}
          />
          <Checkbox
            label="Mentions (@me)"
            checked={form.mentions}
            onChange={(e) => update('mentions', e.target.checked)}
          />
          <Checkbox
            label="Replies to my messages"
            checked={form.replies}
            onChange={(e) => update('replies', e.target.checked)}
          />
          <Checkbox
            label="Newsletters"
            checked={form.newsletters}
            onChange={(e) => update('newsletters', e.target.checked)}
          />
          <Checkbox
            label="Promotions and offers"
            checked={form.promotions}
            onChange={(e) => update('promotions', e.target.checked)}
          />
        </div>
      </FormGroup>

      <FormGroup legend="Digest">
        <Select
          label="Summary email frequency"
          value={form.digestFrequency}
          onChange={(e) => update('digestFrequency', e.target.value)}
          options={[
            { value: 'realtime', label: 'Real-time' },
            { value: 'hourly', label: 'Hourly' },
            { value: 'daily', label: 'Daily digest' },
            { value: 'weekly', label: 'Weekly digest' },
            { value: 'never', label: 'Never' },
          ]}
          helperText="How often you receive a summary of unread notifications"
          wrapperClassName="max-w-sm"
        />
      </FormGroup>

      <FormActions align="right">
        <Button variant="tertiary" type="reset">Cancel</Button>
        <Button type="submit">Save Changes</Button>
      </FormActions>
    </Form>
  );
}

// ─── Tab: Signature ───────────────────────────────────────────────────
function SignatureTab({ onSave }) {
  const [form, setForm] = useState({
    signatureEnabled: true,
    signatureText: 'Best regards,\nJane Cooper\nProduct Manager at Acme Inc.\njane.cooper@acme.com',
    includeOnReply: true,
    includeOnForward: true,
    placement: 'bottom',
  });
  const [errors, setErrors] = useState({});

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.signatureEnabled && !form.signatureText.trim()) {
      setErrors({ signatureText: 'Signature text is required when enabled' });
      return;
    }
    setErrors({});
    onSave('Signature saved');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup legend="Email Signature">
        <Toggle
          label="Enable email signature"
          checked={form.signatureEnabled}
          onChange={(e) => update('signatureEnabled', e.target.checked)}
        />

        {form.signatureEnabled && (
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[length:var(--ds-text-sm)] font-[var(--ds-font-medium)] text-[color:var(--ds-text-primary)]">
                Signature Text
              </label>
              <textarea
                value={form.signatureText}
                onChange={(e) => {
                  update('signatureText', e.target.value);
                  if (errors.signatureText) setErrors({});
                }}
                rows={5}
                className={`w-full rounded-[var(--ds-radius-md)] border px-3 py-2
                  bg-[var(--ds-input-bg)] text-[color:var(--ds-text-primary)]
                  text-[length:var(--ds-text-sm)] font-[family-name:var(--ds-font-sans)]
                  transition-all duration-[var(--ds-duration-normal)]
                  ds-focus-ring resize-y
                  ${errors.signatureText
                    ? 'border-[var(--ds-border-error)]'
                    : 'border-[var(--ds-input-border)] hover:border-[var(--ds-input-border-hover)]'
                  }`}
              />
              {errors.signatureText && (
                <p className="text-[length:var(--ds-text-xs)] text-[color:var(--ds-text-danger)] mt-1">
                  {errors.signatureText}
                </p>
              )}
            </div>

            <div className="p-4 rounded-[var(--ds-radius-lg)] border border-[var(--ds-border-secondary)] bg-[var(--ds-bg-secondary)]">
              <p className="text-[length:var(--ds-text-xs)] text-[color:var(--ds-text-secondary)] mb-2 font-[var(--ds-font-medium)]">
                Preview
              </p>
              <div className="text-[length:var(--ds-text-sm)] text-[color:var(--ds-text-primary)] whitespace-pre-line">
                {form.signatureText}
              </div>
            </div>

            <FormRow>
              <Checkbox
                label="Include on replies"
                checked={form.includeOnReply}
                onChange={(e) => update('includeOnReply', e.target.checked)}
              />
              <Checkbox
                label="Include on forwards"
                checked={form.includeOnForward}
                onChange={(e) => update('includeOnForward', e.target.checked)}
              />
            </FormRow>

            <Select
              label="Signature Placement"
              value={form.placement}
              onChange={(e) => update('placement', e.target.value)}
              options={[
                { value: 'bottom', label: 'Below quoted text' },
                { value: 'above', label: 'Above quoted text' },
              ]}
              wrapperClassName="max-w-sm"
            />
          </div>
        )}
      </FormGroup>

      <FormActions align="right">
        <Button variant="tertiary" type="reset">Cancel</Button>
        <Button type="submit">Save Changes</Button>
      </FormActions>
    </Form>
  );
}

// ─── Tab: Security ────────────────────────────────────────────────────
function SecurityTab({ onSave }) {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    sessionTimeout: '30',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const blur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = {};
    if (field === 'currentPassword') err.currentPassword = validatePassword(form.currentPassword);
    if (field === 'newPassword') err.newPassword = validateNewPassword(form.newPassword);
    if (field === 'confirmPassword') err.confirmPassword = validateConfirmPassword(form.confirmPassword, form.newPassword);
    setErrors((prev) => ({ ...prev, ...err }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const hasPasswordFields = form.currentPassword || form.newPassword || form.confirmPassword;

    if (hasPasswordFields) {
      const newErrors = {
        currentPassword: validatePassword(form.currentPassword),
        newPassword: validateNewPassword(form.newPassword),
        confirmPassword: validateConfirmPassword(form.confirmPassword, form.newPassword),
      };
      setErrors(newErrors);
      setTouched({ currentPassword: true, newPassword: true, confirmPassword: true });
      if (Object.values(newErrors).some(Boolean)) return;
    }

    setConfirmModalOpen(true);
  };

  const confirmSave = () => {
    setConfirmModalOpen(false);
    setForm((prev) => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    setTouched({});
    setErrors({});
    onSave('Security settings updated');
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <FormGroup legend="Change Password">
          <Notification type="info" title="Password requirements">
            Minimum 8 characters, at least one uppercase letter and one number.
          </Notification>
          <div className="mt-4 flex flex-col gap-0">
            <TextInput
              label="Current Password"
              type={showPassword ? 'text' : 'password'}
              value={form.currentPassword}
              onChange={(e) => update('currentPassword', e.target.value)}
              onBlur={() => blur('currentPassword')}
              errorText={touched.currentPassword ? errors.currentPassword : ''}
              icon={<Shield size={16} />}
            />
            <FormRow>
              <TextInput
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={form.newPassword}
                onChange={(e) => update('newPassword', e.target.value)}
                onBlur={() => blur('newPassword')}
                errorText={touched.newPassword ? errors.newPassword : ''}
              />
              <TextInput
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={(e) => update('confirmPassword', e.target.value)}
                onBlur={() => blur('confirmPassword')}
                errorText={touched.confirmPassword ? errors.confirmPassword : ''}
              />
            </FormRow>
            <div className="mt-1">
              <Checkbox
                label="Show passwords"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                size="sm"
              />
            </div>
          </div>
        </FormGroup>

        <FormGroup legend="Two-Factor Authentication">
          <div className="flex items-center gap-4">
            <Toggle
              label="Enable two-factor authentication"
              checked={form.twoFactorEnabled}
              onChange={(e) => update('twoFactorEnabled', e.target.checked)}
            />
            {form.twoFactorEnabled && (
              <Tag color="success" size="sm">Active</Tag>
            )}
          </div>
          {form.twoFactorEnabled && (
            <p className="text-[length:var(--ds-text-sm)] text-[color:var(--ds-text-secondary)] mt-2">
              You will be prompted for a verification code when signing in from a new device.
            </p>
          )}
        </FormGroup>

        <FormGroup legend="Session">
          <Select
            label="Auto-lock after inactivity"
            value={form.sessionTimeout}
            onChange={(e) => update('sessionTimeout', e.target.value)}
            options={[
              { value: '5', label: '5 minutes' },
              { value: '15', label: '15 minutes' },
              { value: '30', label: '30 minutes' },
              { value: '60', label: '1 hour' },
              { value: 'never', label: 'Never' },
            ]}
            helperText="Automatically lock your account after a period of inactivity"
            wrapperClassName="max-w-sm"
          />
        </FormGroup>

        <FormActions align="right">
          <Button variant="tertiary" type="reset">Cancel</Button>
          <Button type="submit" variant="primary">Update Security</Button>
        </FormActions>
      </Form>

      <Modal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirm Security Changes"
        size="sm"
        footer={
          <>
            <Button variant="tertiary" onClick={() => setConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSave}>Confirm</Button>
          </>
        }
      >
        <p className="text-[length:var(--ds-text-sm)] text-[color:var(--ds-text-primary)]">
          Are you sure you want to update your security settings? You may need to sign in again.
        </p>
      </Modal>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function EmailSettingsPage() {
  const [toast, setToast] = useState({ visible: false, message: '' });

  const handleSave = useCallback((message) => {
    setToast({ visible: true, message });
  }, []);

  const tabs = [
    {
      id: 'account',
      label: 'Account',
      icon: <User size={16} />,
      content: <AccountTab onSave={handleSave} />,
    },
    {
      id: 'mail',
      label: 'Mail',
      icon: <Mail size={16} />,
      content: <MailTab onSave={handleSave} />,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell size={16} />,
      content: <NotificationsTab onSave={handleSave} />,
    },
    {
      id: 'signature',
      label: 'Signature',
      icon: <FileText size={16} />,
      content: <SignatureTab onSave={handleSave} />,
    },
    {
      id: 'security',
      label: 'Security',
      icon: <Shield size={16} />,
      content: <SecurityTab onSave={handleSave} />,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--ds-bg-primary)]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/', icon: <Home size={14} /> },
            { label: 'Mail', href: '/mail', icon: <Mail size={14} /> },
            { label: 'Settings' },
          ]}
        />

        <div className="mt-6 mb-8">
          <h1 className="text-[length:var(--ds-text-3xl)] font-bold text-[color:var(--ds-text-primary)]">
            Settings
          </h1>
          <p className="text-[length:var(--ds-text-md)] text-[color:var(--ds-text-secondary)] mt-1">
            Manage your email preferences, notifications, and security.
          </p>
        </div>

        <Tabs
          tabs={tabs}
          defaultActiveTab="account"
          variant="underline"
          size="md"
        />
      </div>

      <Toast
        type="success"
        title="Saved"
        visible={toast.visible}
        duration={3000}
        onClose={() => setToast({ visible: false, message: '' })}
      >
        {toast.message}
      </Toast>
    </div>
  );
}
