'use client';

import { useState } from 'react';
import { Check, ChevronRight, ChevronLeft, UserPlus } from 'lucide-react';
import {
  Button,
  TextInput,
  Select,
  Checkbox,
  Toggle,
  DatePicker,
  Tag,
  Notification,
  Form,
  FormGroup,
  FormRow,
  FormActions,
} from '@/components';

const STEPS = [
  { label: 'Personal Info' },
  { label: 'Employment' },
  { label: 'IT & Access' },
  { label: 'Review' },
];

const DEPARTMENTS = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'design', label: 'Design' },
  { value: 'product', label: 'Product' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
  { value: 'operations', label: 'Operations' },
];

const EMPLOYMENT_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'intern', label: 'Intern' },
];

const LOCATIONS = [
  { value: 'new-york', label: 'New York' },
  { value: 'san-francisco', label: 'San Francisco' },
  { value: 'london', label: 'London' },
  { value: 'remote', label: 'Remote' },
];

const LAPTOP_OPTIONS = [
  { value: 'macbook-pro', label: 'MacBook Pro' },
  { value: 'macbook-air', label: 'MacBook Air' },
  { value: 'thinkpad', label: 'ThinkPad' },
  { value: 'dell-xps', label: 'Dell XPS' },
];

const SOFTWARE_OPTIONS = ['Slack', 'Jira', 'Figma', 'GitHub', 'Google Workspace', 'AWS Console'];
const DISTRO_OPTIONS = ['engineering-all', 'design-all', 'product-all', 'company-all'];

const INITIAL_FORM_DATA = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  address: '',
  department: '',
  jobTitle: '',
  employmentType: '',
  startDate: '',
  manager: '',
  location: '',
  needsLaptop: true,
  laptopPreference: '',
  needsPhone: false,
  vpnAccess: false,
  software: [],
  distros: [],
  agreedToPolicy: false,
};

function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getLabelForValue(options, value) {
  const opt = options.find((o) => o.value === value);
  return opt ? opt.label : value;
}

// -- Step Indicator ----------------------------------------------------------

function StepIndicator({ steps, currentStep }) {
  return (
    <div className="flex items-center w-full mb-8">
      {steps.map((step, i) => {
        const isCompleted = i < currentStep;
        const isActive = i === currentStep;
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="flex items-center justify-center rounded-full shrink-0 transition-all duration-[var(--ds-duration-normal)]"
                style={{
                  width: 32,
                  height: 32,
                  fontSize: 'var(--ds-text-sm)',
                  fontWeight: isActive ? 'var(--ds-font-semibold)' : 'var(--ds-font-medium)',
                  ...(isCompleted
                    ? {
                        backgroundColor: 'var(--ds-bg-brand)',
                        color: 'var(--ds-text-on-brand)',
                      }
                    : isActive
                      ? {
                          border: '2px solid var(--ds-bg-brand)',
                          color: 'var(--ds-text-brand)',
                          backgroundColor: 'var(--ds-bg-primary)',
                        }
                      : {
                          border: '2px solid var(--ds-border-primary)',
                          color: 'var(--ds-text-secondary)',
                          backgroundColor: 'var(--ds-bg-primary)',
                        }),
                }}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : i + 1}
              </div>
              <span
                className="text-center whitespace-nowrap"
                style={{
                  fontSize: 'var(--ds-text-xs)',
                  fontWeight: isActive ? 'var(--ds-font-semibold)' : 'var(--ds-font-regular)',
                  color: isActive ? 'var(--ds-text-brand)' : 'var(--ds-text-secondary)',
                }}
              >
                {step.label}
              </span>
            </div>
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                className="flex-1 mx-2 mt-[-20px]"
                style={{
                  height: 2,
                  backgroundColor: i < currentStep ? 'var(--ds-bg-brand)' : 'var(--ds-border-primary)',
                  transition: 'background-color var(--ds-duration-normal)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// -- Step Components ---------------------------------------------------------

function PersonalInfoStep({ formData, updateField, errors }) {
  return (
    <FormGroup legend="Personal Information">
      <FormRow>
        <TextInput
          label="First Name"
          required
          placeholder="John"
          value={formData.firstName}
          onChange={(e) => updateField('firstName', e.target.value)}
          errorText={errors.firstName}
        />
        <TextInput
          label="Last Name"
          required
          placeholder="Doe"
          value={formData.lastName}
          onChange={(e) => updateField('lastName', e.target.value)}
          errorText={errors.lastName}
        />
      </FormRow>
      <FormRow>
        <TextInput
          label="Email Address"
          required
          type="email"
          placeholder="john.doe@company.com"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          errorText={errors.email}
        />
        <TextInput
          label="Phone Number"
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
        />
      </FormRow>
      <FormRow>
        <DatePicker
          label="Date of Birth"
          required
          value={formData.dateOfBirth}
          onChange={(val) => updateField('dateOfBirth', val)}
          placeholder="Select date of birth"
          errorText={errors.dateOfBirth}
        />
        <TextInput
          label="Address"
          placeholder="123 Main St, City, State"
          value={formData.address}
          onChange={(e) => updateField('address', e.target.value)}
        />
      </FormRow>
    </FormGroup>
  );
}

function EmploymentStep({ formData, updateField, errors }) {
  return (
    <FormGroup legend="Employment Details">
      <Select
        label="Department"
        required
        options={DEPARTMENTS}
        placeholder="Select department"
        value={formData.department}
        onChange={(e) => updateField('department', e.target.value)}
        errorText={errors.department}
      />
      <FormRow>
        <TextInput
          label="Job Title"
          required
          placeholder="Software Engineer"
          value={formData.jobTitle}
          onChange={(e) => updateField('jobTitle', e.target.value)}
          errorText={errors.jobTitle}
        />
        <Select
          label="Employment Type"
          required
          options={EMPLOYMENT_TYPES}
          placeholder="Select type"
          value={formData.employmentType}
          onChange={(e) => updateField('employmentType', e.target.value)}
          errorText={errors.employmentType}
        />
      </FormRow>
      <FormRow>
        <DatePicker
          label="Start Date"
          required
          value={formData.startDate}
          onChange={(val) => updateField('startDate', val)}
          placeholder="Select start date"
          min={getToday()}
          errorText={errors.startDate}
        />
        <TextInput
          label="Reporting Manager"
          required
          placeholder="Jane Smith"
          value={formData.manager}
          onChange={(e) => updateField('manager', e.target.value)}
          errorText={errors.manager}
        />
      </FormRow>
      <Select
        label="Office Location"
        required
        options={LOCATIONS}
        placeholder="Select location"
        value={formData.location}
        onChange={(e) => updateField('location', e.target.value)}
        errorText={errors.location}
      />
    </FormGroup>
  );
}

function ITAccessStep({ formData, updateField, toggleArrayField }) {
  return (
    <>
      <FormGroup legend="Equipment">
        <div className="flex flex-col gap-4">
          <Toggle
            label="Laptop required"
            checked={formData.needsLaptop}
            onChange={(e) => updateField('needsLaptop', e.target.checked)}
          />
          {formData.needsLaptop && (
            <Select
              label="Laptop Preference"
              options={LAPTOP_OPTIONS}
              placeholder="Select laptop"
              value={formData.laptopPreference}
              onChange={(e) => updateField('laptopPreference', e.target.value)}
            />
          )}
          <Toggle
            label="Company phone required"
            checked={formData.needsPhone}
            onChange={(e) => updateField('needsPhone', e.target.checked)}
          />
          <Toggle
            label="VPN access"
            checked={formData.vpnAccess}
            onChange={(e) => updateField('vpnAccess', e.target.checked)}
          />
        </div>
      </FormGroup>

      <FormGroup legend="Software Licenses">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SOFTWARE_OPTIONS.map((sw) => (
            <Checkbox
              key={sw}
              label={sw}
              checked={formData.software.includes(sw)}
              onChange={() => toggleArrayField('software', sw)}
            />
          ))}
        </div>
      </FormGroup>

      <FormGroup legend="Email Distribution Lists">
        <div className="grid grid-cols-2 gap-3">
          {DISTRO_OPTIONS.map((dl) => (
            <Checkbox
              key={dl}
              label={dl}
              checked={formData.distros.includes(dl)}
              onChange={() => toggleArrayField('distros', dl)}
            />
          ))}
        </div>
      </FormGroup>
    </>
  );
}

function ReviewField({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        style={{
          fontSize: 'var(--ds-text-xs)',
          color: 'var(--ds-text-secondary)',
          fontWeight: 'var(--ds-font-medium)',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 'var(--ds-text-sm)',
          color: value ? 'var(--ds-text-primary)' : 'var(--ds-text-tertiary)',
        }}
      >
        {value || 'Not provided'}
      </span>
    </div>
  );
}

function ReviewStep({ formData, updateField, errors }) {
  return (
    <>
      <Notification type="info" title="Review your information" dismissible={false}>
        Please review all details before submitting. You can go back to any step to make changes.
      </Notification>

      <FormGroup legend="Personal Information">
        <div className="grid grid-cols-2 gap-4">
          <ReviewField label="First Name" value={formData.firstName} />
          <ReviewField label="Last Name" value={formData.lastName} />
          <ReviewField label="Email" value={formData.email} />
          <ReviewField label="Phone" value={formData.phone} />
          <ReviewField label="Date of Birth" value={formData.dateOfBirth} />
          <ReviewField label="Address" value={formData.address} />
        </div>
      </FormGroup>

      <FormGroup legend="Employment Details">
        <div className="grid grid-cols-2 gap-4">
          <ReviewField label="Department" value={getLabelForValue(DEPARTMENTS, formData.department)} />
          <ReviewField label="Job Title" value={formData.jobTitle} />
          <ReviewField label="Employment Type" value={getLabelForValue(EMPLOYMENT_TYPES, formData.employmentType)} />
          <ReviewField label="Start Date" value={formData.startDate} />
          <ReviewField label="Manager" value={formData.manager} />
          <ReviewField label="Location" value={getLabelForValue(LOCATIONS, formData.location)} />
        </div>
      </FormGroup>

      <FormGroup legend="IT & Access">
        <div className="grid grid-cols-2 gap-4">
          <ReviewField label="Laptop" value={formData.needsLaptop ? (getLabelForValue(LAPTOP_OPTIONS, formData.laptopPreference) || 'Yes (no preference)') : 'No'} />
          <ReviewField label="Company Phone" value={formData.needsPhone ? 'Yes' : 'No'} />
          <ReviewField label="VPN Access" value={formData.vpnAccess ? 'Yes' : 'No'} />
        </div>
        {formData.software.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            <span style={{ fontSize: 'var(--ds-text-xs)', color: 'var(--ds-text-secondary)', fontWeight: 'var(--ds-font-medium)' }}>
              Software Licenses
            </span>
            <div className="flex flex-wrap gap-2">
              {formData.software.map((sw) => (
                <Tag key={sw} color="brand">{sw}</Tag>
              ))}
            </div>
          </div>
        )}
        {formData.distros.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            <span style={{ fontSize: 'var(--ds-text-xs)', color: 'var(--ds-text-secondary)', fontWeight: 'var(--ds-font-medium)' }}>
              Distribution Lists
            </span>
            <div className="flex flex-wrap gap-2">
              {formData.distros.map((dl) => (
                <Tag key={dl} color="info">{dl}</Tag>
              ))}
            </div>
          </div>
        )}
      </FormGroup>

      <div className="pt-2">
        <Checkbox
          label="I confirm that all the information provided is accurate"
          checked={formData.agreedToPolicy}
          onChange={(e) => updateField('agreedToPolicy', e.target.checked)}
        />
        {errors.agreedToPolicy && (
          <p className="mt-1" style={{ fontSize: 'var(--ds-text-xs)', color: 'var(--ds-text-danger)' }}>
            {errors.agreedToPolicy}
          </p>
        )}
      </div>
    </>
  );
}

function SuccessState({ formData, onReset }) {
  return (
    <div className="flex flex-col gap-6">
      <Notification type="success" title="Onboarding Complete!" dismissible={false}>
        The onboarding request for {formData.firstName} {formData.lastName} has been submitted successfully.
      </Notification>

      <div
        className="rounded-[var(--ds-radius-lg)] p-6 flex flex-col gap-3"
        style={{
          backgroundColor: 'var(--ds-bg-secondary)',
          border: '1px solid var(--ds-border-primary)',
        }}
      >
        <h3
          style={{
            fontSize: 'var(--ds-text-lg)',
            fontWeight: 'var(--ds-font-semibold)',
            color: 'var(--ds-text-primary)',
          }}
        >
          {formData.firstName} {formData.lastName}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <ReviewField label="Department" value={getLabelForValue(DEPARTMENTS, formData.department)} />
          <ReviewField label="Job Title" value={formData.jobTitle} />
          <ReviewField label="Start Date" value={formData.startDate} />
          <ReviewField label="Location" value={getLabelForValue(LOCATIONS, formData.location)} />
        </div>
      </div>

      <Button icon={<UserPlus size={16} />} onClick={onReset}>
        Start New Onboarding
      </Button>
    </div>
  );
}

// -- Main Component ----------------------------------------------------------

export default function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const toggleArrayField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const validateStep = (stepIndex) => {
    const newErrors = {};

    if (stepIndex === 0) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Enter a valid email address';
      }
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (stepIndex === 1) {
      if (!formData.department) newErrors.department = 'Department is required';
      if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
      if (!formData.employmentType) newErrors.employmentType = 'Employment type is required';
      if (!formData.startDate) newErrors.startDate = 'Start date is required';
      if (!formData.manager.trim()) newErrors.manager = 'Manager is required';
      if (!formData.location) newErrors.location = 'Location is required';
    }

    if (stepIndex === 3) {
      if (!formData.agreedToPolicy) newErrors.agreedToPolicy = 'You must confirm the information is accurate';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((s) => s - 1);
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep(0);
    setErrors({});
    setSubmitted(false);
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--ds-bg-primary)' }}
    >
      <div className="max-w-[720px] mx-auto" style={{ padding: 'var(--ds-spacing-8)' }}>
        <h1
          style={{
            fontSize: 'var(--ds-text-2xl)',
            fontWeight: 'var(--ds-font-bold)',
            color: 'var(--ds-text-primary)',
            marginBottom: 'var(--ds-spacing-2)',
          }}
        >
          Employee Onboarding
        </h1>
        <p
          style={{
            fontSize: 'var(--ds-text-sm)',
            color: 'var(--ds-text-secondary)',
            marginBottom: 'var(--ds-spacing-6)',
          }}
        >
          Complete the following steps to onboard a new employee.
        </p>

        <StepIndicator steps={STEPS} currentStep={submitted ? STEPS.length : currentStep} />

        {submitted ? (
          <SuccessState formData={formData} onReset={handleReset} />
        ) : (
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              if (currentStep === STEPS.length - 1) {
                handleSubmit();
              } else {
                handleNext();
              }
            }}
          >
            {currentStep === 0 && (
              <PersonalInfoStep formData={formData} updateField={updateField} errors={errors} />
            )}
            {currentStep === 1 && (
              <EmploymentStep formData={formData} updateField={updateField} errors={errors} />
            )}
            {currentStep === 2 && (
              <ITAccessStep formData={formData} updateField={updateField} toggleArrayField={toggleArrayField} />
            )}
            {currentStep === 3 && (
              <ReviewStep formData={formData} updateField={updateField} errors={errors} />
            )}

            <FormActions align="between">
              {currentStep > 0 ? (
                <Button
                  variant="tertiary"
                  type="button"
                  icon={<ChevronLeft size={16} />}
                  onClick={handleBack}
                >
                  Back
                </Button>
              ) : (
                <div />
              )}
              {currentStep < STEPS.length - 1 ? (
                <Button
                  type="button"
                  icon={<ChevronRight size={16} />}
                  iconPosition="right"
                  onClick={handleNext}
                >
                  Next
                </Button>
              ) : (
                <Button type="button" onClick={handleSubmit}>
                  Submit Onboarding
                </Button>
              )}
            </FormActions>
          </Form>
        )}
      </div>
    </div>
  );
}
