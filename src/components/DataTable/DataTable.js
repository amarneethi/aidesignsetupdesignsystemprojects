'use client';

import { forwardRef, useState, useMemo, useCallback } from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown, Check, X as XIcon } from 'lucide-react';
import Checkbox from '../Checkbox/Checkbox';
import Pagination from '../Pagination/Pagination';

const DataTable = forwardRef(function DataTable(
  {
    columns = [],
    data = [],
    // Sorting
    sortable = true,
    defaultSortColumn,
    defaultSortDirection = 'asc',
    onSort,
    // Selection
    selectable = false,
    selectedRows = [],
    onSelectionChange,
    // Pagination
    paginated = false,
    pageSize: controlledPageSize,
    defaultPageSize = 10,
    pageSizeOptions = [10, 25, 50, 100],
    // Inline editing
    editableColumns = [],
    onCellEdit,
    // Batch actions
    batchActions,
    // Filtering
    filterValue,
    onFilterChange,
    // State
    loading = false,
    emptyMessage = 'No data available',
    stickyHeader = false,
    compact = false,
    striped = false,
    className = '',
    ...props
  },
  ref
) {
  // Sorting state
  const [sortColumn, setSortColumn] = useState(defaultSortColumn || null);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(controlledPageSize || defaultPageSize);

  // Editing state
  const [editingCell, setEditingCell] = useState(null); // { rowIndex, columnKey }
  const [editValue, setEditValue] = useState('');

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return data;
    const col = columns.find((c) => c.key === sortColumn);
    const sortFn = col?.sortFn || ((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') return aVal - bVal;
      return String(aVal).localeCompare(String(bVal));
    });
    const sorted = [...data].sort(sortFn);
    return sortDirection === 'desc' ? sorted.reverse() : sorted;
  }, [data, sortColumn, sortDirection, columns]);

  // Paginate
  const totalPages = paginated ? Math.ceil(sortedData.length / pageSize) : 1;
  const paginatedData = paginated
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData;

  const handleSort = useCallback(
    (columnKey) => {
      if (!sortable) return;
      const newDir = sortColumn === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
      setSortColumn(columnKey);
      setSortDirection(newDir);
      onSort?.(columnKey, newDir);
    },
    [sortable, sortColumn, sortDirection, onSort]
  );

  // Selection
  const allSelected = paginatedData.length > 0 && paginatedData.every((_, i) => {
    const idx = paginated ? (currentPage - 1) * pageSize + i : i;
    return selectedRows.includes(idx);
  });

  const someSelected = !allSelected && paginatedData.some((_, i) => {
    const idx = paginated ? (currentPage - 1) * pageSize + i : i;
    return selectedRows.includes(idx);
  });

  const handleSelectAll = () => {
    const pageIndices = paginatedData.map((_, i) =>
      paginated ? (currentPage - 1) * pageSize + i : i
    );
    if (allSelected) {
      onSelectionChange?.(selectedRows.filter((i) => !pageIndices.includes(i)));
    } else {
      onSelectionChange?.([...new Set([...selectedRows, ...pageIndices])]);
    }
  };

  const handleSelectRow = (globalIndex) => {
    if (selectedRows.includes(globalIndex)) {
      onSelectionChange?.(selectedRows.filter((i) => i !== globalIndex));
    } else {
      onSelectionChange?.([...selectedRows, globalIndex]);
    }
  };

  // Inline editing
  const startEditing = (rowIndex, columnKey, currentValue) => {
    setEditingCell({ rowIndex, columnKey });
    setEditValue(currentValue ?? '');
  };

  const commitEdit = () => {
    if (editingCell) {
      onCellEdit?.(editingCell.rowIndex, editingCell.columnKey, editValue);
      setEditingCell(null);
    }
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const cellPadding = compact ? 'px-3 py-1.5' : 'px-4 py-3';
  const textSize = compact ? 'text-[length:var(--ds-text-xs)]' : 'text-[length:var(--ds-text-sm)]';

  return (
    <div
      ref={ref}
      className={[
        'w-full rounded-[var(--ds-radius-lg)] border overflow-hidden',
        'bg-[var(--ds-bg-primary)] border-[var(--ds-table-border)]',
        className,
      ].join(' ')}
      {...props}
    >
      {/* Batch actions toolbar */}
      {selectable && selectedRows.length > 0 && batchActions && (
        <div
          className="flex items-center gap-3 px-4 py-2 border-b"
          style={{
            backgroundColor: 'var(--ds-bg-selected)',
            borderColor: 'var(--ds-table-border)',
          }}
        >
          <span className="text-[length:var(--ds-text-sm)] font-medium text-[var(--ds-text-brand)]">
            {selectedRows.length} selected
          </span>
          <div className="flex items-center gap-2">
            {batchActions}
          </div>
          <button
            type="button"
            onClick={() => onSelectionChange?.([])}
            className="ml-auto text-[length:var(--ds-text-sm)] text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)] cursor-pointer"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto ds-scrollbar">
        <table className="w-full border-collapse">
          <thead
            className={stickyHeader ? 'sticky top-0' : ''}
            style={{ zIndex: stickyHeader ? 10 : undefined }}
          >
            <tr style={{ backgroundColor: 'var(--ds-table-header-bg)' }}>
              {selectable && (
                <th className={`${cellPadding} w-12`}>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={handleSelectAll}
                    size="sm"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={[
                    cellPadding,
                    textSize,
                    'text-left font-semibold text-[var(--ds-text-secondary)] whitespace-nowrap',
                    sortable && col.sortable !== false ? 'cursor-pointer select-none' : '',
                  ].join(' ')}
                  style={{
                    width: col.width,
                    minWidth: col.minWidth,
                    borderBottom: `1px solid var(--ds-table-border)`,
                  }}
                  onClick={() => sortable && col.sortable !== false && handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.header}
                    {sortable && col.sortable !== false && (
                      <span className="inline-flex">
                        {sortColumn === col.key ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp size={14} />
                          ) : (
                            <ArrowDown size={14} />
                          )
                        ) : (
                          <ArrowUpDown size={14} className="opacity-30" />
                        )}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-12 text-center text-[length:var(--ds-text-sm)] text-[var(--ds-text-tertiary)]"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
            {paginatedData.map((row, rowIdx) => {
              const globalIndex = paginated ? (currentPage - 1) * pageSize + rowIdx : rowIdx;
              const isSelected = selectedRows.includes(globalIndex);

              return (
                <tr
                  key={row.id || globalIndex}
                  className="transition-colors"
                  style={{
                    backgroundColor: isSelected
                      ? 'var(--ds-table-row-selected)'
                      : striped && rowIdx % 2 === 1
                        ? 'var(--ds-bg-secondary)'
                        : undefined,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--ds-table-row-hover)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor =
                        striped && rowIdx % 2 === 1 ? 'var(--ds-bg-secondary)' : '';
                    }
                  }}
                >
                  {selectable && (
                    <td
                      className={cellPadding}
                      style={{ borderBottom: '1px solid var(--ds-table-border)' }}
                    >
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectRow(globalIndex)}
                        size="sm"
                      />
                    </td>
                  )}
                  {columns.map((col) => {
                    const cellValue = row[col.key];
                    const isEditing =
                      editingCell?.rowIndex === globalIndex && editingCell?.columnKey === col.key;
                    const isEditable = editableColumns.includes(col.key);

                    return (
                      <td
                        key={col.key}
                        className={[
                          cellPadding,
                          textSize,
                          'text-[var(--ds-text-primary)]',
                        ].join(' ')}
                        style={{ borderBottom: '1px solid var(--ds-table-border)' }}
                        onDoubleClick={() => {
                          if (isEditable) startEditing(globalIndex, col.key, cellValue);
                        }}
                      >
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') commitEdit();
                                if (e.key === 'Escape') cancelEdit();
                              }}
                              className="w-full px-2 py-1 text-[length:var(--ds-text-sm)] rounded border bg-[var(--ds-input-bg)] text-[var(--ds-text-primary)]"
                              style={{ borderColor: 'var(--ds-border-focus)' }}
                              autoFocus
                            />
                            <button type="button" onClick={commitEdit} className="p-0.5 text-[var(--ds-icon-success)] cursor-pointer">
                              <Check size={14} />
                            </button>
                            <button type="button" onClick={cancelEdit} className="p-0.5 text-[var(--ds-icon-danger)] cursor-pointer">
                              <XIcon size={14} />
                            </button>
                          </div>
                        ) : col.render ? (
                          col.render(cellValue, row, globalIndex)
                        ) : (
                          <span>{cellValue}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {paginated && (
        <div
          className="px-4 py-3 border-t"
          style={{ borderColor: 'var(--ds-table-border)' }}
        >
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sortedData.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            pageSizeOptions={pageSizeOptions}
            showPageSizeSelector
            showItemCount
          />
        </div>
      )}
    </div>
  );
});

DataTable.displayName = 'DataTable';
export default DataTable;
