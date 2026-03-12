'use client';
import { forwardRef, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

function NavItem({ item, collapsed, depth = 0 }) {
  const [expanded, setExpanded] = useState(item.defaultExpanded || false);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = (e) => {
    if (hasChildren) {
      e.preventDefault();
      setExpanded(!expanded);
    }
    item.onClick?.(e);
  };

  return (
    <li>
      <a
        href={item.href || '#'}
        onClick={handleClick}
        title={collapsed ? item.label : undefined}
        className={[
          'ds-focus-ring flex items-center gap-3 px-3 py-2 rounded-[var(--ds-radius-md)] text-[length:var(--ds-text-sm)]',
          'transition-colors duration-[var(--ds-duration-normal)] cursor-pointer',
          item.active
            ? 'bg-[var(--ds-sidebar-active)] text-[color:var(--ds-sidebar-text-active)] font-medium'
            : 'text-[color:var(--ds-sidebar-text)] hover:bg-[var(--ds-sidebar-hover)] hover:text-[color:var(--ds-sidebar-text-active)]',
        ].join(' ')}
        style={{ paddingLeft: collapsed ? undefined : `${12 + depth * 12}px` }}
      >
        {item.icon && (
          <span className="shrink-0 w-5 h-5 flex items-center justify-center">
            {item.icon}
          </span>
        )}
        {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
        {!collapsed && item.badge && (
          <span
            className="text-[length:var(--ds-text-xs)] px-1.5 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: 'var(--ds-bg-brand)',
              color: 'var(--ds-text-on-brand)',
            }}
          >
            {item.badge}
          </span>
        )}
        {!collapsed && hasChildren && (
          <span className="shrink-0">
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        )}
      </a>
      {!collapsed && hasChildren && expanded && (
        <ul className="mt-0.5">
          {item.children.map((child) => (
            <NavItem key={child.label} item={child} collapsed={collapsed} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

const SideNav = forwardRef(function SideNav(
  {
    items = [],
    header,
    footer,
    collapsed = false,
    className = '',
    ...props
  },
  ref
) {
  return (
    <aside
      ref={ref}
      className={[
        'flex flex-col h-full shrink-0 bg-[var(--ds-sidebar-bg)] ds-scrollbar overflow-y-auto',
        'transition-[width] duration-[var(--ds-duration-slow)]',
        collapsed ? 'w-16' : 'w-60',
        className,
      ].join(' ')}
      {...props}
    >
      {header && (
        <div className="p-3 border-b border-white/10 shrink-0">
          {header}
        </div>
      )}
      <nav className="flex-1 p-2">
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => {
            if (item.divider) {
              return (
                <li key={item.label || 'divider'} className="my-2">
                  {!collapsed && item.label && (
                    <span className="px-3 text-[length:11px] font-semibold uppercase tracking-[var(--ds-tracking-widest)] text-[color:var(--ds-sidebar-text)] opacity-80">
                      {item.label}
                    </span>
                  )}
                  <div className="mt-1 border-t border-white/10" />
                </li>
              );
            }
            return <NavItem key={item.label} item={item} collapsed={collapsed} />;
          })}
        </ul>
      </nav>
      {footer && (
        <div className="p-3 border-t border-white/10 shrink-0">
          {footer}
        </div>
      )}
    </aside>
  );
});

SideNav.displayName = 'SideNav';
export default SideNav;