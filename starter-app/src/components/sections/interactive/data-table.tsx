'use client'

import * as React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { EnhancedCard } from '@/components/ui/enhanced-card'

export interface DataTableColumn<T = any> {
  /** Column header label */
  header: string
  /** Key to access data in row object */
  accessorKey: string
  /** Custom cell renderer */
  cell?: (row: T) => React.ReactNode
  /** Enable sorting for this column */
  sortable?: boolean
}

export interface DataTableProps<T = any> {
  /** Table title */
  title?: string
  /** Column definitions */
  columns: DataTableColumn<T>[]
  /** Data rows */
  data: T[]
  /** Enable row selection */
  selectable?: boolean
  /** Items per page for pagination */
  pageSize?: number
  /** Show pagination controls */
  showPagination?: boolean
  /** Callback when selection changes */
  onSelectionChange?: (selectedRows: T[]) => void
}

/**
 * DataTable - Sortable table with pagination and row selection
 *
 * @example
 * ```tsx
 * <DataTable
 *   title="Users"
 *   columns={[
 *     { header: 'Name', accessorKey: 'name', sortable: true },
 *     { header: 'Email', accessorKey: 'email' }
 *   ]}
 *   data={users}
 *   selectable
 *   showPagination
 * />
 * ```
 */
export function DataTable<T extends Record<string, any>>({
  title,
  columns,
  data,
  selectable = false,
  pageSize = 10,
  showPagination = true,
  onSelectionChange,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc')
  const [selectedRows, setSelectedRows] = React.useState<Set<number>>(new Set())
  const [currentPage, setCurrentPage] = React.useState(1)

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data

    return [...data].sort((a, b) => {
      const aVal = a[sortColumn]
      const bVal = b[sortColumn]

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
      }

      return 0
    })
  }, [data, sortColumn, sortDirection])

  // Paginate data
  const paginatedData = React.useMemo(() => {
    if (!showPagination) return sortedData
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize, showPagination])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIndexes = new Set(paginatedData.map((_, idx) => idx))
      setSelectedRows(allIndexes)
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (index: number, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(index)
    } else {
      newSelected.delete(index)
    }
    setSelectedRows(newSelected)
  }

  React.useEffect(() => {
    if (onSelectionChange) {
      const selected = paginatedData.filter((_, idx) => selectedRows.has(idx))
      onSelectionChange(selected)
    }
  }, [selectedRows, paginatedData, onSelectionChange])

  const allSelected = paginatedData.length > 0 && selectedRows.size === paginatedData.length

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="overflow-hidden">
      {title && (
        <div className="p-6 border-b border-border">
          <h3 className="text-xl font-heading">{title}</h3>
          {selectedRows.size > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {selectedRows.size} row{selectedRows.size !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all rows"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead key={column.accessorKey}>
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.accessorKey)}
                      className="flex items-center gap-2 hover:text-foreground transition-colors"
                    >
                      {column.header}
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="text-center text-muted-foreground py-8"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, idx) => (
                <TableRow
                  key={idx}
                  data-state={selectedRows.has(idx) ? 'selected' : undefined}
                >
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(idx)}
                        onCheckedChange={(checked) => handleSelectRow(idx, checked as boolean)}
                        aria-label={`Select row ${idx + 1}`}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey}>
                      {column.cell ? column.cell(row) : row[column.accessorKey]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </EnhancedCard>
  )
}
