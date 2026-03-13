'use client';

import { forwardRef, useState, useMemo, useCallback } from 'react';
import {
  Info, AlertTriangle, AlertCircle, CheckCircle2,
  ChevronUp, ChevronDown, ChevronsUpDown,
} from 'lucide-react';

/* ========== ACTIVITY FEED ========== */
export const ActivityFeed = forwardRef(function ActivityFeed(
  { items = [], maxHeight, className = '', ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={['flex flex-col divide-y', className].join(' ')}
      style={{
        borderColor: 'var(--ds-border-primary)',
        maxHeight,
        overflowY: maxHeight ? 'auto' : undefined,
        '--tw-divide-color': 'var(--ds-border-primary)',
      }}
      {...props}
    >
      {items.map((item, i) => (
        <div key={item.id ?? i} className="flex gap-3 py-3 px-2">
          {/* Timeline dot */}
          <div className="shrink-0 mt-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.color || 'var(--ds-text-brand)' }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-[length:var(--ds-text-sm)]"
              style={{ color: 'var(--ds-text-primary)' }}
            >
              {item.content}
            </p>
            {item.timestamp && (
              <p
                className="text-[length:var(--ds-text-xs)] mt-0.5"
                style={{ color: 'var(--ds-text-tertiary)' }}
              >
                {item.timestamp}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

/* ========== NOTIFICATION LIST ========== */
const severityConfig = {
  info: { icon: Info, color: 'var(--ds-icon-info)', bg: 'var(--ds-bg-info)' },
  warning: { icon: AlertTriangle, color: 'var(--ds-icon-warning)', bg: 'var(--ds-bg-warning)' },
  error: { icon: AlertCircle, color: 'var(--ds-icon-danger)', bg: 'var(--ds-bg-error)' },
  success: { icon: CheckCircle2, color: 'var(--ds-icon-success)', bg: 'var(--ds-bg-success)' },
};

export const NotificationList = forwardRef(function NotificationList(
  { items = [], maxHeight, onItemClick, className = '', ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={['flex flex-col divide-y', className].join(' ')}
      style={{
        maxHeight,
        overflowY: maxHeight ? 'auto' : undefined,
        '--tw-divide-color': 'var(--ds-border-primary)',
      }}
      {...props}
    >
      {items.map((item, i) => {
        const sev = severityConfig[item.severity || 'info'];
        const Icon = sev.icon;
        return (
          <div
            key={item.id ?? i}
            className={[
              'flex gap-3 py-3 px-3 transition-colors',
              onItemClick ? 'cursor-pointer hover:bg-[var(--ds-bg-hover)]' : '',
              item.unread ? 'bg-[var(--ds-bg-selected)]' : '',
            ].join(' ')}
            onClick={() => onItemClick?.(item, i)}
            role={onItemClick ? 'button' : undefined}
            tabIndex={onItemClick ? 0 : undefined}
          >
            <div
              className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5"
              style={{ backgroundColor: sev.bg }}
            >
              <Icon size={14} style={{ color: sev.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={[
                  'text-[length:var(--ds-text-sm)]',
                  item.unread ? 'font-semibold' : '',
                ].join(' ')}
                style={{ color: 'var(--ds-text-primary)' }}
              >
                {item.title}
              </p>
              {item.description && (
                <p
                  className="text-[length:var(--ds-text-xs)] mt-0.5 line-clamp-2"
                  style={{ color: 'var(--ds-text-secondary)' }}
                >
                  {item.description}
                </p>
              )}
              {item.timestamp && (
                <p
                  className="text-[length:var(--ds-text-xs)] mt-1"
                  style={{ color: 'var(--ds-text-tertiary)' }}
                >
                  {item.timestamp}
                </p>
              )}
            </div>
            {item.unread && (
              <div className="shrink-0 mt-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--ds-text-brand)' }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});

/* ========== RANKED LIST ========== */
export const RankedList = forwardRef(function RankedList(
  { items = [], valueLabel, className = '', ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={['flex flex-col divide-y', className].join(' ')}
      style={{ '--tw-divide-color': 'var(--ds-border-primary)' }}
      {...props}
    >
      {items.map((item, i) => (
        <div key={item.id ?? i} className="flex items-center gap-3 py-2.5 px-2">
          <span
            className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[length:var(--ds-text-xs)] font-bold"
            style={{
              backgroundColor: i < 3 ? 'var(--ds-bg-selected)' : 'var(--ds-bg-tertiary)',
              color: i < 3 ? 'var(--ds-text-brand)' : 'var(--ds-text-secondary)',
            }}
          >
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p
              className="text-[length:var(--ds-text-sm)] font-medium truncate"
              style={{ color: 'var(--ds-text-primary)' }}
            >
              {item.label}
            </p>
            {item.sublabel && (
              <p
                className="text-[length:var(--ds-text-xs)] truncate"
                style={{ color: 'var(--ds-text-tertiary)' }}
              >
                {item.sublabel}
              </p>
            )}
          </div>
          {item.value != null && (
            <span
              className="shrink-0 text-[length:var(--ds-text-sm)] font-semibold tabular-nums"
              style={{ color: 'var(--ds-text-primary)' }}
            >
              {item.value}
            </span>
          )}
        </div>
      ))}
    </div>
  );
});

/* ========== AVATAR LIST ========== */
export const AvatarList = forwardRef(function AvatarList(
  { items = [], onItemClick, className = '', ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={['flex flex-col divide-y', className].join(' ')}
      style={{ '--tw-divide-color': 'var(--ds-border-primary)' }}
      {...props}
    >
      {items.map((item, i) => (
        <div
          key={item.id ?? i}
          className={[
            'flex items-center gap-3 py-2.5 px-2 transition-colors',
            onItemClick ? 'cursor-pointer hover:bg-[var(--ds-bg-hover)]' : '',
          ].join(' ')}
          onClick={() => onItemClick?.(item, i)}
          role={onItemClick ? 'button' : undefined}
          tabIndex={onItemClick ? 0 : undefined}
        >
          {/* Avatar */}
          {item.avatar ? (
            <img
              src={item.avatar}
              alt={item.name || ''}
              className="shrink-0 w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[length:var(--ds-text-xs)] font-bold uppercase"
              style={{
                backgroundColor: 'var(--ds-bg-selected)',
                color: 'var(--ds-text-brand)',
              }}
            >
              {(item.name || '?').slice(0, 2)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p
              className="text-[length:var(--ds-text-sm)] font-medium truncate"
              style={{ color: 'var(--ds-text-primary)' }}
            >
              {item.name}
            </p>
            {item.description && (
              <p
                className="text-[length:var(--ds-text-xs)] truncate"
                style={{ color: 'var(--ds-text-secondary)' }}
              >
                {item.description}
              </p>
            )}
          </div>
          {item.meta && (
            <span
              className="shrink-0 text-[length:var(--ds-text-xs)]"
              style={{ color: 'var(--ds-text-tertiary)' }}
            >
              {item.meta}
            </span>
          )}
        </div>
      ))}
    </div>
  );
});

/* ========== TABLE LIST (with-table) ========== */
export const TableList = forwardRef(function TableList(
  {
    columns = [],
    data = [],
    sortable = false,
    defaultSortColumn,
    defaultSortDirection = 'asc',
    actions,
    onFilter,
    className = '',
    ...props
  },
  ref
) {
  const [sortCol, setSortCol] = useState(defaultSortColumn || null);
  const [sortDir, setSortDir] = useState(defaultSortDirection);

  const handleSort = useCallback((key) => {
    if (!sortable) return;
    if (sortCol === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(key);
      setSortDir('asc');
    }
  }, [sortCol, sortable]);

  const sortedData = useMemo(() => {
    if (!sortCol) return data;
    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortCol];
      const bVal = b[sortCol];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') return aVal - bVal;
      return String(aVal).localeCompare(String(bVal));
    });
    return sortDir === 'desc' ? sorted.reverse() : sorted;
  }, [data, sortCol, sortDir]);

  const SortIcon = ({ colKey }) => {
    if (!sortable) return null;
    if (sortCol !== colKey) return <ChevronsUpDown size={12} style={{ color: 'var(--ds-icon-secondary)', opacity: 0.5 }} />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} style={{ color: 'var(--ds-text-brand)' }} />
      : <ChevronDown size={12} style={{ color: 'var(--ds-text-brand)' }} />;
  };

  return (
    <div ref={ref} className={className} {...props}>
      {/* Filter actions toolbar */}
      {actions && (
        <div
          className="flex items-center gap-2 flex-wrap pb-3 mb-3 border-b"
          style={{ borderColor: 'var(--ds-border-primary)' }}
        >
          {actions}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr
              className="border-b"
              style={{ borderColor: 'var(--ds-border-primary)' }}
            >
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={[
                    'py-2 px-3 text-[length:var(--ds-text-xs)] font-semibold uppercase tracking-wider whitespace-nowrap',
                    sortable ? 'cursor-pointer select-none hover:bg-[var(--ds-bg-hover)]' : '',
                  ].join(' ')}
                  style={{
                    color: 'var(--ds-text-secondary)',
                    width: col.width,
                    minWidth: col.minWidth,
                  }}
                  onClick={() => handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.icon && <span className="shrink-0">{col.icon}</span>}
                    {col.header}
                    <SortIcon colKey={col.key} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, ri) => (
              <tr
                key={row.id ?? ri}
                className="border-b last:border-b-0 transition-colors hover:bg-[var(--ds-bg-hover)]"
                style={{ borderColor: 'var(--ds-border-primary)' }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="py-2 px-3 text-[length:var(--ds-text-sm)]"
                    style={{ color: 'var(--ds-text-primary)' }}
                  >
                    {col.render ? col.render(row[col.key], row, ri) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
            {sortedData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-8 text-center text-[length:var(--ds-text-sm)]"
                  style={{ color: 'var(--ds-text-tertiary)' }}
                >
                  No items
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});

/* ========== Convenience wrapper ========== */
const List = forwardRef(function List(
  { variant = 'activity-feed', ...props },
  ref
) {
  switch (variant) {
    case 'activity-feed':
      return <ActivityFeed ref={ref} {...props} />;
    case 'notification':
      return <NotificationList ref={ref} {...props} />;
    case 'ranked':
      return <RankedList ref={ref} {...props} />;
    case 'with-avatar':
      return <AvatarList ref={ref} {...props} />;
    case 'with-table':
      return <TableList ref={ref} {...props} />;
    default:
      return <ActivityFeed ref={ref} {...props} />;
  }
});

ActivityFeed.displayName = 'ActivityFeed';
NotificationList.displayName = 'NotificationList';
RankedList.displayName = 'RankedList';
AvatarList.displayName = 'AvatarList';
TableList.displayName = 'TableList';
List.displayName = 'List';

export default List;
