'use client'

import * as React from 'react'
import {
  Download,
  Upload,
  FileText,
  File,
  AlertCircle,
  CheckCircle,
  Trash2,
  Clock,
} from 'lucide-react'
import { EnhancedCard } from '@/components/ui/enhanced-card'

export interface ExportRecord {
  /** Unique export ID */
  id: string
  /** Export format */
  format: 'json' | 'csv' | 'xml'
  /** Creation timestamp */
  createdAt: string
  /** File size in bytes */
  fileSize: number
  /** Download URL */
  downloadUrl: string
  /** Expiration timestamp */
  expiresAt: string
}

export interface ImportResult {
  /** Was import successful */
  success: boolean
  /** Number of records processed */
  recordsProcessed: number
  /** Number of records imported */
  recordsImported: number
  /** Import errors */
  errors?: Array<{ line: number; message: string }>
}

export interface ExportImportProps {
  /** Export history */
  exportHistory?: ExportRecord[]
  /** Export callback */
  onExport?: (format: 'json' | 'csv' | 'xml', options?: any) => void
  /** Import callback */
  onImport?: (file: File) => Promise<ImportResult>
  /** Download export callback */
  onDownloadExport?: (id: string) => void
  /** Delete export callback */
  onDeleteExport?: (id: string) => void
  /** Is exporting */
  isExporting?: boolean
  /** Is importing */
  isImporting?: boolean
}

/**
 * ExportImport - Export and import data
 *
 * @example
 * ```tsx
 * <ExportImport
 *   exportHistory={exports}
 *   onExport={(format) => exportData(format)}
 *   onImport={(file) => importData(file)}
 * />
 * ```
 */
export function ExportImport({
  exportHistory = [],
  onExport,
  onImport,
  onDownloadExport,
  onDeleteExport,
  isExporting = false,
  isImporting = false,
}: ExportImportProps) {
  const [selectedFormat, setSelectedFormat] = React.useState<'json' | 'csv' | 'xml'>('json')
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [importResult, setImportResult] = React.useState<ImportResult | null>(null)
  const [dragActive, setDragActive] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleExport = () => {
    onExport?.(selectedFormat)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setImportResult(null)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
      setImportResult(null)
    }
  }

  const handleImport = async () => {
    if (selectedFile && onImport) {
      const result = await onImport(selectedFile)
      setImportResult(result)
      if (result.success) {
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  const getFormatIcon = (format: string) => {
    return <FileText className="w-4 h-4" />
  }

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'json':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'csv':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'xml':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Export Section */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex items-center gap-3 mb-6">
          <Download className="w-5 h-5 text-primary dark:text-primary/80" />
          <h3 className="text-lg font-heading font-bold">Export Data</h3>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Export your data in various formats for backup or migration purposes
          </p>

          <div>
            <label className="block text-sm font-medium mb-3">Select Format</label>
            <div className="grid grid-cols-3 gap-4">
              {(['json', 'csv', 'xml'] as const).map((format) => (
                <button
                  key={format}
                  onClick={() => setSelectedFormat(format)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedFormat === format
                      ? 'border-primary bg-primary/10 dark:bg-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-center">
                    <FileText className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-medium uppercase">{format}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleExport} className="btn-mm w-full" disabled={isExporting}>
            {isExporting ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export as {selectedFormat.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </EnhancedCard>

      {/* Export History */}
      {exportHistory.length > 0 && (
        <EnhancedCard tilt={false} glowEffect={false}>
          <h4 className="text-lg font-heading font-bold mb-4">Export History</h4>

          <div className="space-y-2">
            {exportHistory.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium uppercase ${getFormatColor(
                      record.format
                    )}`}
                  >
                    {record.format}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Export from {formatDate(record.createdAt)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(record.fileSize)} •{' '}
                      {isExpired(record.expiresAt) ? (
                        <span className="text-red-500">Expired</span>
                      ) : (
                        <>Expires {formatDate(record.expiresAt)}</>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!isExpired(record.expiresAt) && (
                    <button
                      onClick={() => onDownloadExport?.(record.id)}
                      className="btn-secondary text-sm py-1"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteExport?.(record.id)}
                    className="btn-secondary text-sm py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </EnhancedCard>
      )}

      {/* Import Section */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex items-center gap-3 mb-6">
          <Upload className="w-5 h-5 text-primary dark:text-primary/80" />
          <h3 className="text-lg font-heading font-bold">Import Data</h3>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Import data from JSON, CSV, or XML files. Maximum file size: 10MB
          </p>

          {/* File Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/10 dark:bg-primary/20'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.csv,.xml"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />

            {selectedFile ? (
              <div className="space-y-3">
                <File className="w-12 h-12 text-primary mx-auto" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedFile(null)
                      setImportResult(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                      }
                    }}
                    className="btn-secondary text-sm"
                  >
                    Remove
                  </button>
                  <button onClick={handleImport} className="btn-mm text-sm" disabled={isImporting}>
                    {isImporting ? 'Importing...' : 'Import File'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="font-medium mb-1">Drop your file here, or browse</p>
                  <p className="text-sm text-muted-foreground">
                    Supports JSON, CSV, and XML files up to 10MB
                  </p>
                </div>
                <label htmlFor="file-upload" className="btn-mm inline-flex cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Select File
                </label>
              </div>
            )}
          </div>

          {/* Import Result */}
          {importResult && (
            <div
              className={`p-4 rounded-lg border-2 ${
                importResult.success
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}
            >
              <div className="flex items-start gap-3">
                {importResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="font-medium mb-2">
                    {importResult.success ? 'Import Successful' : 'Import Failed'}
                  </h4>
                  <div className="text-sm space-y-1">
                    <p>Records processed: {importResult.recordsProcessed}</p>
                    <p>Records imported: {importResult.recordsImported}</p>
                    {importResult.errors && importResult.errors.length > 0 && (
                      <div className="mt-3">
                        <p className="font-medium mb-2">Errors:</p>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {importResult.errors.map((error, idx) => (
                            <p key={idx} className="text-xs">
                              Line {error.line}: {error.message}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Format Info */}
          <div className="p-4 rounded-lg bg-muted/30">
            <h5 className="text-sm font-medium mb-2">Format Requirements</h5>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• JSON: Must be a valid JSON array or object</li>
              <li>• CSV: First row should contain column headers</li>
              <li>• XML: Must be well-formed with proper encoding</li>
              <li>• All files must be UTF-8 encoded</li>
            </ul>
          </div>
        </div>
      </EnhancedCard>
    </div>
  )
}
