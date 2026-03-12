'use client';

import { forwardRef, useState, useId } from 'react';

const Tabs = forwardRef(function Tabs(
  {
    tabs = [],
    defaultActiveTab,
    activeTab: controlledActiveTab,
    onChange,
    variant = 'underline',
    size = 'md',
    fullWidth = false,
    className = '',
    ...props
  },
  ref
) {
  const baseId = useId();
  const [internalTab, setInternalTab] = useState(defaultActiveTab || tabs[0]?.id);
  const activeTab = controlledActiveTab ?? internalTab;

  const handleTabClick = (tabId) => {
    setInternalTab(tabId);
    onChange?.(tabId);
  };

  const sizeClasses = {
    sm: 'text-[length:var(--ds-text-xs)] px-3 py-1.5',
    md: 'text-[length:var(--ds-text-sm)] px-4 py-2',
    lg: 'text-[length:var(--ds-text-md)] px-5 py-2.5',
  };

  const activeContent = tabs.find((t) => t.id === activeTab);

  return (
    <div ref={ref} className={className} {...props}>
      {/* Tab list */}
      <div
        role="tablist"
        className={[
          'flex',
          variant === 'underline' ? 'border-b border-[var(--ds-border-primary)]' : 'gap-1 p-1 bg-[var(--ds-bg-tertiary)] rounded-[var(--ds-radius-lg)]',
        ].join(' ')}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${tab.id}`}
              disabled={tab.disabled}
              onClick={() => handleTabClick(tab.id)}
              className={[
                'ds-focus-ring font-medium transition-all duration-[var(--ds-duration-normal)] whitespace-nowrap cursor-pointer',
                sizeClasses[size],
                fullWidth ? 'flex-1' : '',
                tab.disabled ? 'opacity-40 cursor-not-allowed' : '',
                variant === 'underline'
                  ? [
                      '-mb-px border-b-2',
                      isActive
                        ? 'border-[var(--ds-border-brand)] text-[var(--ds-text-brand)]'
                        : 'border-transparent text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)] hover:border-[var(--ds-border-secondary)]',
                    ].join(' ')
                  : [
                      'rounded-[var(--ds-radius-md)]',
                      isActive
                        ? 'bg-[var(--ds-bg-primary)] text-[var(--ds-text-primary)] shadow-[var(--ds-shadow-xs)]'
                        : 'text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)]',
                    ].join(' '),
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {tab.icon && <span className="mr-1.5 inline-flex align-text-bottom">{tab.icon}</span>}
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className="ml-2 text-[length:var(--ds-text-xs)] px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: isActive ? 'var(--ds-bg-brand)' : 'var(--ds-bg-tertiary)',
                    color: isActive ? 'var(--ds-text-on-brand)' : 'var(--ds-text-secondary)',
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab panel */}
      {activeContent && (
        <div
          role="tabpanel"
          id={`${baseId}-panel-${activeContent.id}`}
          aria-labelledby={`${baseId}-tab-${activeContent.id}`}
          className="pt-4"
        >
          {activeContent.content}
        </div>
      )}
    </div>
  );
});

Tabs.displayName = 'Tabs';
export default Tabs;
