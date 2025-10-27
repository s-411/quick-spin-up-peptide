'use client'

import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Download, Mail, FileText, CheckCircle, Clock, XCircle } from 'lucide-react'

/**
 * Represents an invoice
 */
export interface Invoice {
  /** Unique identifier */
  id: string
  /** Invoice number */
  number: string
  /** Invoice date */
  date: string
  /** Amount in dollars */
  amount: number
  /** Payment status */
  status: 'paid' | 'pending' | 'failed'
  /** PDF download URL (optional) */
  pdfUrl?: string
}

/**
 * Props for the InvoiceHistory component
 */
export interface InvoiceHistoryProps {
  /** Array of invoices */
  invoices: Invoice[]
  /** Callback when download is clicked */
  onDownload?: (id: string) => void
  /** Callback when email is clicked */
  onEmail?: (id: string) => void
  /** Callback when filter is applied */
  onFilter?: (dateRange: [Date, Date]) => void
}

const statusConfig = {
  paid: {
    icon: CheckCircle,
    label: 'Paid',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary',
  },
  pending: {
    icon: Clock,
    label: 'Pending',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    border: 'border-secondary',
  },
  failed: {
    icon: XCircle,
    label: 'Failed',
    color: 'text-destructive',
    bg: 'bg-destructive/10',
    border: 'border-destructive',
  },
}

/**
 * InvoiceHistory component displays past invoices with download capabilities.
 * Allows filtering by date and emailing invoices.
 */
export function InvoiceHistory({ invoices, onDownload, onEmail, onFilter }: InvoiceHistoryProps) {
  return (
    <EnhancedCard tilt={false} glowEffect={false} className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Invoice History
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            View and download past invoices
          </p>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                Invoice
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                Date
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                Amount
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                Status
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => {
              const StatusIcon = statusConfig[invoice.status].icon
              return (
                <tr
                  key={invoice.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {invoice.number}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {new Date(invoice.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-foreground">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig[invoice.status].bg} ${statusConfig[invoice.status].color} border ${statusConfig[invoice.status].border}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig[invoice.status].label}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      {onDownload && invoice.pdfUrl && (
                        <button
                          onClick={() => onDownload(invoice.id)}
                          className="p-2 text-muted-foreground hover:text-primary transition-colors"
                          aria-label="Download invoice"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      {onEmail && (
                        <button
                          onClick={() => onEmail(invoice.id)}
                          className="p-2 text-muted-foreground hover:text-primary transition-colors"
                          aria-label="Email invoice"
                          title="Email Invoice"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {invoices.map((invoice) => {
          const StatusIcon = statusConfig[invoice.status].icon
          return (
            <div
              key={invoice.id}
              className="bg-card border border-border rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {invoice.number}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(invoice.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig[invoice.status].bg} ${statusConfig[invoice.status].color} border ${statusConfig[invoice.status].border}`}
                >
                  <StatusIcon className="w-3 h-3" />
                  {statusConfig[invoice.status].label}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <p className="text-lg font-bold text-foreground">
                  ${invoice.amount.toFixed(2)}
                </p>
                <div className="flex gap-2">
                  {onDownload && invoice.pdfUrl && (
                    <button
                      onClick={() => onDownload(invoice.id)}
                      className="btn-secondary p-2"
                      aria-label="Download invoice"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  {onEmail && (
                    <button
                      onClick={() => onEmail(invoice.id)}
                      className="btn-secondary p-2"
                      aria-label="Email invoice"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {invoices.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-muted-foreground">No invoices found</p>
        </div>
      )}
    </EnhancedCard>
  )
}
