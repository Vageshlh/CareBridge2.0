import React from 'react';

interface Column<T> {
  header: React.ReactNode;
  accessor: keyof T | ((data: T) => React.ReactNode);
  cell?: (value: any, row: T, index: number) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T, index: number) => string;
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: (item: T, index: number) => string;
  cellClassName?: string;
  emptyMessage?: React.ReactNode;
  isLoading?: boolean;
  loadingRows?: number;
  onRowClick?: (item: T, index: number) => void;
  stickyHeader?: boolean;
  striped?: boolean;
  bordered?: boolean;
  compact?: boolean;
  hover?: boolean;
}

export function Table<T>({ 
  data, 
  columns, 
  keyExtractor,
  className = '',
  tableClassName = '',
  headerClassName = '',
  bodyClassName = '',
  rowClassName = () => '',
  cellClassName = '',
  emptyMessage = 'No data available',
  isLoading = false,
  loadingRows = 5,
  onRowClick,
  stickyHeader = false,
  striped = true,
  bordered = false,
  compact = false,
  hover = true
}: TableProps<T>) {
  // Generate skeleton rows for loading state
  const loadingRowsArray = Array.from({ length: loadingRows }, (_, index) => index);

  // Table style classes
  const tableStyles = [
    'min-w-full divide-y divide-gray-200',
    bordered ? 'border border-gray-200' : '',
    tableClassName
  ].filter(Boolean).join(' ');

  // Header style classes
  const headerStyles = [
    'bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
    stickyHeader ? 'sticky top-0 z-10' : '',
    compact ? 'px-3 py-2' : 'px-6 py-3',
    headerClassName
  ].filter(Boolean).join(' ');

  // Cell style classes
  const cellStyles = [
    'text-sm text-gray-500',
    compact ? 'px-3 py-2' : 'px-6 py-4',
    cellClassName
  ].filter(Boolean).join(' ');

  // Get value from data using accessor
  const getCellValue = (item: T, accessor: Column<T>['accessor']) => {
    if (typeof accessor === 'function') {
      return accessor(item);
    }
    return item[accessor];
  };

  // Render cell content
  const renderCell = (item: T, column: Column<T>, index: number): React.ReactNode => {
    const value = getCellValue(item, column.accessor);
    if (column.cell) {
      return column.cell(value, item, index);
    }
    // Ensure the value is rendered as a ReactNode
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return value;
    }
    if (React.isValidElement(value)) {
      return value;
    }
    // For other types, convert to string
    return String(value);
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className={tableStyles}>
        <thead className={headerClassName}>
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index} 
                scope="col" 
                className={`${headerStyles} ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y divide-gray-200 ${bodyClassName}`}>
          {isLoading ? (
            // Loading skeleton
            loadingRowsArray.map((index) => (
              <tr key={`loading-${index}`}>
                {columns.map((_, colIndex) => (
                  <td key={`loading-cell-${colIndex}`} className={cellStyles}>
                    <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : data.length > 0 ? (
            // Data rows
            data.map((item, index) => (
              <tr 
                key={keyExtractor(item, index)}
                className={`
                  ${striped && index % 2 === 1 ? 'bg-gray-50' : ''}
                  ${hover ? 'hover:bg-gray-100' : ''}
                  ${onRowClick ? 'cursor-pointer' : ''}
                  ${rowClassName(item, index)}
                `}
                onClick={() => onRowClick && onRowClick(item, index)}
              >
                {columns.map((column, colIndex) => (
                  <td 
                    key={`${keyExtractor(item, index)}-${colIndex}`} 
                    className={`${cellStyles} ${column.className || ''}`}
                  >
                    {renderCell(item, column, index)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            // Empty state
            <tr>
              <td 
                colSpan={columns.length} 
                className="px-6 py-8 text-center text-sm text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;