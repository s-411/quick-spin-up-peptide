'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Badge } from '@/components/ui/badge'
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react'

export interface FilterOption {
  label: string
  value: string
  count?: number
}

export interface FilterGroup {
  id: string
  label: string
  type: 'checkbox' | 'range' | 'select'
  options?: FilterOption[]
  min?: number
  max?: number
  defaultExpanded?: boolean
}

export interface FilterPanelProps {
  /** Panel title */
  title?: string
  /** Filter groups */
  groups: FilterGroup[]
  /** Callback when filters change */
  onChange?: (filters: Record<string, any>) => void
  /** Show clear all button */
  showClearAll?: boolean
}

/**
 * FilterPanel - Multi-criteria filtering sidebar
 *
 * @example
 * ```tsx
 * <FilterPanel
 *   title="Filters"
 *   groups={[
 *     { id: 'category', label: 'Category', type: 'checkbox', options: [...] },
 *     { id: 'price', label: 'Price Range', type: 'range', min: 0, max: 1000 }
 *   ]}
 *   onChange={handleFilterChange}
 * />
 * ```
 */
export function FilterPanel({
  title = 'Filters',
  groups,
  onChange,
  showClearAll = true,
}: FilterPanelProps) {
  const [filters, setFilters] = React.useState<Record<string, any>>({})
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(
    new Set(groups.filter((g) => g.defaultExpanded !== false).map((g) => g.id))
  )

  React.useEffect(() => {
    if (onChange) {
      onChange(filters)
    }
  }, [filters, onChange])

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(groupId)) {
        next.delete(groupId)
      } else {
        next.add(groupId)
      }
      return next
    })
  }

  const handleCheckboxChange = (groupId: string, value: string, checked: boolean) => {
    setFilters((prev) => {
      const groupValues = (prev[groupId] as string[]) || []
      const updated = checked
        ? [...groupValues, value]
        : groupValues.filter((v) => v !== value)

      return {
        ...prev,
        [groupId]: updated.length > 0 ? updated : undefined,
      }
    })
  }

  const handleRangeChange = (groupId: string, value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      [groupId]: value,
    }))
  }

  const handleSelectChange = (groupId: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [groupId]: value || undefined,
    }))
  }

  const clearAllFilters = () => {
    setFilters({})
  }

  const clearGroupFilter = (groupId: string) => {
    setFilters((prev) => {
      const next = { ...prev }
      delete next[groupId]
      return next
    })
  }

  const getActiveFilterCount = () => {
    return Object.values(filters).filter((v) => {
      if (Array.isArray(v)) return v.length > 0
      return v !== undefined && v !== null
    }).length
  }

  const activeCount = getActiveFilterCount()

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="h-fit">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <h3 className="font-heading text-lg">{title}</h3>
            {activeCount > 0 && (
              <Badge variant="default" className="ml-1">
                {activeCount}
              </Badge>
            )}
          </div>
          {showClearAll && activeCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Filter Groups */}
      <div className="divide-y divide-border">
        {groups.map((group) => {
          const isExpanded = expandedGroups.has(group.id)
          const hasActiveFilter = filters[group.id] !== undefined

          return (
            <div key={group.id} className="p-4">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between mb-3 hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{group.label}</span>
                  {hasActiveFilter && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        clearGroupFilter(group.id)
                      }}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {/* Group Content */}
              {isExpanded && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                  {/* Checkbox Filters */}
                  {group.type === 'checkbox' && group.options && (
                    <div className="space-y-2">
                      {group.options.map((option) => {
                        const checked = ((filters[group.id] as string[]) || []).includes(
                          option.value
                        )
                        return (
                          <div key={option.value} className="flex items-center gap-2">
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(isChecked) =>
                                handleCheckboxChange(group.id, option.value, isChecked as boolean)
                              }
                              id={`${group.id}-${option.value}`}
                            />
                            <label
                              htmlFor={`${group.id}-${option.value}`}
                              className="flex-1 text-sm cursor-pointer flex items-center justify-between"
                            >
                              <span>{option.label}</span>
                              {option.count !== undefined && (
                                <span className="text-muted-foreground text-xs">
                                  ({option.count})
                                </span>
                              )}
                            </label>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Range Filter */}
                  {group.type === 'range' && group.min !== undefined && group.max !== undefined && (
                    <div className="space-y-3">
                      <Slider
                        min={group.min}
                        max={group.max}
                        step={1}
                        value={(filters[group.id] as number[]) || [group.min, group.max]}
                        onValueChange={(value) => handleRangeChange(group.id, value)}
                        className="w-full"
                      />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                          ${((filters[group.id] as number[])?.[0] || group.min).toLocaleString()}
                        </span>
                        <span>
                          ${((filters[group.id] as number[])?.[1] || group.max).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Select Filter */}
                  {group.type === 'select' && group.options && (
                    <select
                      value={(filters[group.id] as string) || ''}
                      onChange={(e) => handleSelectChange(group.id, e.target.value)}
                      className="select-mm w-full"
                    >
                      <option value="">All</option>
                      {group.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                          {option.count !== undefined && ` (${option.count})`}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </EnhancedCard>
  )
}
