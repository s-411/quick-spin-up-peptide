'use client'

import * as React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { Edit, Trash2, Eye, MoreVertical } from 'lucide-react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Badge } from '@/components/ui/badge'

export interface TableAction<T = any> {
  /** Action label */
  label: string
  /** Action icon */
  icon?: React.ReactNode
  /** Action callback */
  onClick: (row: T) => void
  /** Variant style */
  variant?: 'default' | 'destructive'
  /** Show in dropdown menu instead of inline */
  dropdown?: boolean
}

export interface TableWithActionsColumn<T = any> {
  /** Column header label */
  header: string
  /** Key to access data in row object */
  accessorKey: string
  /** Custom cell renderer */
  cell?: (row: T) => React.ReactNode
}

export interface TableWithActionsProps<T = any> {
  /** Table title */
  title?: string
  /** Description */
  description?: string
  /** Column definitions */
  columns: TableWithActionsColumn<T>[]
  /** Data rows */
  data: T[]
  /** Action buttons for each row */
  actions?: TableAction<T>[]
  /** Show status badge */
  showStatus?: boolean
  /** Status accessor key */
  statusKey?: string
}

/**
 * TableWithActions - Action buttons per row (edit, delete, view)
 *
 * @example
 * ```tsx
 * <TableWithActions
 *   title="User Management"
 *   columns={columns}
 *   data={users}
 *   actions={[
 *     { label: 'Edit', icon: <Edit />, onClick: handleEdit },
 *     { label: 'Delete', icon: <Trash2 />, onClick: handleDelete, variant: 'destructive' }
 *   ]}
 * />
 * ```
 */
export function TableWithActions<T extends Record<string, any>>({
  title,
  description,
  columns,
  data,
  actions = [],
  showStatus = false,
  statusKey = 'status',
}: TableWithActionsProps<T>) {
  const inlineActions = actions.filter((action) => !action.dropdown)
  const dropdownActions = actions.filter((action) => action.dropdown)

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    const lowerStatus = status.toLowerCase()
    if (lowerStatus === 'active' || lowerStatus === 'approved') return 'default'
    if (lowerStatus === 'pending' || lowerStatus === 'review') return 'secondary'
    if (lowerStatus === 'inactive' || lowerStatus === 'rejected') return 'destructive'
    return 'outline'
  }

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="overflow-hidden">
      {(title || description) && (
        <div className="p-6 border-b border-border">
          {title && <h3 className="text-xl font-heading">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey}>{column.header}</TableHead>
              ))}
              {showStatus && <TableHead>Status</TableHead>}
              {actions.length > 0 && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (showStatus ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                  className="text-center text-muted-foreground py-8"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => (
                <TableRow key={idx}>
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey}>
                      {column.cell ? column.cell(row) : row[column.accessorKey]}
                    </TableCell>
                  ))}
                  {showStatus && (
                    <TableCell>
                      <Badge variant={getStatusVariant(row[statusKey])}>{row[statusKey]}</Badge>
                    </TableCell>
                  )}
                  {actions.length > 0 && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {inlineActions.map((action, actionIdx) => (
                          <Button
                            key={actionIdx}
                            variant={action.variant === 'destructive' ? 'destructive' : 'ghost'}
                            size="sm"
                            onClick={() => action.onClick(row)}
                            className="h-8 px-2"
                          >
                            {action.icon}
                            <span className="ml-1 hidden sm:inline">{action.label}</span>
                          </Button>
                        ))}
                        {dropdownActions.length > 0 && (
                          <DropdownMenu>
                            <button className="h-8 w-8 rounded-md hover:bg-muted flex items-center justify-center">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            <div className="dropdown-content">
                              {dropdownActions.map((action, actionIdx) => (
                                <button
                                  key={actionIdx}
                                  onClick={() => action.onClick(row)}
                                  className="dropdown-item"
                                >
                                  {action.icon}
                                  <span>{action.label}</span>
                                </button>
                              ))}
                            </div>
                          </DropdownMenu>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </EnhancedCard>
  )
}

// Default action helpers
export const defaultActions = {
  view: <Eye className="w-4 h-4" />,
  edit: <Edit className="w-4 h-4" />,
  delete: <Trash2 className="w-4 h-4" />,
}
