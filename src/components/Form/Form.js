'use client';

import { forwardRef } from 'react';

/** Form — structured layout wrapper for data entry with validation */
const Form = forwardRef(function Form(
  { children, onSubmit, className = '', ...props },
  ref
) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <form
      ref={ref}
      onSubmit={handleSubmit}
      className={['flex flex-col gap-5', className].join(' ')}
      noValidate
      {...props}
    >
      {children}
    </form>
  );
});

/** FormGroup — groups related form fields with a section label */
export function FormGroup({ legend, children, className = '' }) {
  return (
    <fieldset className={['flex flex-col gap-4', className].join(' ')}>
      {legend && (
        <legend className="text-[length:var(--ds-text-md)] font-semibold text-[var(--ds-text-primary)] mb-1">
          {legend}
        </legend>
      )}
      {children}
    </fieldset>
  );
}

/** FormRow — horizontal layout for side-by-side fields */
export function FormRow({ children, className = '' }) {
  return (
    <div className={['grid grid-cols-1 md:grid-cols-2 gap-4', className].join(' ')}>
      {children}
    </div>
  );
}

/** FormActions — footer area for form submit/cancel buttons */
export function FormActions({ children, align = 'right', className = '' }) {
  const alignClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div
      className={[
        'flex items-center gap-3 pt-4 border-t border-[var(--ds-border-primary)]',
        alignClass[align],
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}

Form.displayName = 'Form';
FormGroup.displayName = 'FormGroup';
FormRow.displayName = 'FormRow';
FormActions.displayName = 'FormActions';
export default Form;
