/**
 * Document Upload Component
 * Handles file upload with progress indication
 */

'use client'

import { useState, useRef } from 'react'
import { cn } from '@/lib/utils/cn'

export interface DocumentUploadProps {
  onUpload: (file: File, title?: string) => Promise<void>
  progress?: number | null
  isUploading?: boolean
  className?: string
}

export function DocumentUpload({
  onUpload,
  progress,
  isUploading,
  className,
}: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [title, setTitle] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Validate file type (text files only)
    const validTypes = ['text/plain', 'text/markdown', 'application/pdf']
    if (!validTypes.includes(file.type) && !file.name.endsWith('.md')) {
      alert('Please upload a text file (.txt, .md, or .pdf)')
      return
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    setSelectedFile(file)
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      return
    }

    try {
      await onUpload(selectedFile, title || undefined)
      // Reset form
      setSelectedFile(null)
      setTitle('')
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    } catch (error) {
      console.error('Upload error:', error)
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drag and drop area */}
      <form onDragEnter={handleDrag} onSubmit={handleSubmit}>
        <div
          className={cn(
            'relative rounded-lg border-2 border-dashed p-8 text-center transition-colors',
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-border bg-card hover:border-primary/50',
            isUploading && 'pointer-events-none opacity-50'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".txt,.md,.pdf,text/plain,text/markdown,application/pdf"
            onChange={handleChange}
            disabled={isUploading}
          />

          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <svg
                className="h-8 w-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground">
                {selectedFile ? selectedFile.name : 'Drop your document here'}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                or{' '}
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="text-primary hover:underline"
                >
                  browse files
                </button>
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Supports: .txt, .md, .pdf (max 10MB)
              </p>
            </div>

            {/* Progress bar */}
            {isUploading && progress !== null && (
              <div className="mx-auto w-full max-w-xs space-y-2">
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {progress < 30 ? 'Uploading...' : progress < 100 ? 'Processing...' : 'Complete!'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Title input and upload button */}
        {selectedFile && !isUploading && (
          <div className="mt-4 space-y-3">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground">
                Document Title (optional)
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter a title for this document"
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Upload & Process
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null)
                  setTitle('')
                  if (inputRef.current) {
                    inputRef.current.value = ''
                  }
                }}
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
