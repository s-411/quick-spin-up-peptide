'use client'

import * as React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X, Filter } from 'lucide-react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Badge } from '@/components/ui/badge'

export interface TableFilter {
  /** Filter label */
  label: string
  /** Column key to filter */
  key: string
  /** Filter type */
  type: 'text' | 'select'
  /** Options for select filter */
  options?: string[]
}

export interface TableWithFiltersColumn<T = any> {
  /** Column header label */
  header: string
  /** Key to access data in row object */
  accessorKey: string
  /** Custom cell renderer */
  cell?: (row: T) => React.ReactNode
  /** Enable filtering for this column */
  filterable?: boolean
}

export interface TableWithFiltersProps<T = any> {
  /** Table title */
  title?: string
  /** Column definitions */
  columns: TableWithFiltersColumn<T>[]
  /** Data rows */
  data: T[]
  /** Filter configurations */
  filters?: TableFilter[]
  /** Show global search */
  showSearch?: boolean
  /** Search placeholder */
  searchPlaceholder?: string
}

/**
 * TableWithFilters - Integrated column filters and search
 *
 * @example
 * ```tsx
 * <TableWithFilters
 *   title="Products"
 *   columns={columns}
 *   data={products}
 *   showSearch
 *   filters={[
 *     { label: 'Category', key: 'category', type: 'select', options: ['Electronics', 'Clothing'] }
 *   ]}
 * />
 * ```
 */
export function TableWithFilters<T extends Record<string, any>>({
  title,
  columns,
  data,
  filters = [],
  showSearch = true,
  searchPlaceholder = 'Search...',
}: TableWithFiltersProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string>>({})
  const [showFilterPanel, setShowFilterPanel] = React.useState(false)

  // Filter data
  const filteredData = React.useMemo(() => {
    let result = data

    // Apply search
    if (searchQuery) {
      result = result.filter((row) => {
        return Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      })
    }

    // Apply column filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((row) => {
          const rowValue = String(row[key]).toLowerCase()
          return rowValue.includes(value.toLowerCase())
        })
      }
    })

    return result
  }, [data, searchQuery, activeFilters])

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const clearFilter = (key: string) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev }
      delete newFilters[key]
      return newFilters
    })
  }

  const clearAllFilters = () => {
    setActiveFilters({})
    setSearchQuery('')
  }

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length + (searchQuery ? 1 : 0)

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border space-y-4">
        <div className="flex items-center justify-between">
          {title && <h3 className="text-xl font-heading">{title}</h3>}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="ml-auto"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="default" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startIcon={<Search className="w-4 h-4" />}
            clearable
            onClear={() => setSearchQuery('')}
          />
        )}

        {/* Filter Panel */}
        {showFilterPanel && filters.length > 0 && (
          <div className="p-4 bg-muted/20 rounded-lg space-y-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Active Filters</p>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  Clear All
                </Button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filters.map((filter) => (
                <div key={filter.key} className="space-y-1">
                  <label className="text-sm text-muted-foreground">{filter.label}</label>
                  {filter.type === 'select' ? (
                    <select
                      value={activeFilters[filter.key] || ''}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      className="select-mm w-full"
                    >
                      <option value="">All</option>
                      {filter.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      type="text"
                      value={activeFilters[filter.key] || ''}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      placeholder={`Filter by ${filter.label.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Filter Tags */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery('')} className="hover:text-foreground">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {Object.entries(activeFilters).map(
              ([key, value]) =>
                value && (
                  <Badge key={key} variant="secondary" className="flex items-center gap-1">
                    {filters.find((f) => f.key === key)?.label}: {value}
                    <button onClick={() => clearFilter(key)} className="hover:text-foreground">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-muted-foreground py-8">
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, idx) => (
                <TableRow key={idx}>
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

      {/* Results Count */}
      <div className="px-6 py-3 border-t border-border text-sm text-muted-foreground">
        Showing {filteredData.length} of {data.length} results
      </div>
    </EnhancedCard>
  )
}
