'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Upload, X, File, FileText, Image as ImageIcon, CheckCircle2 } from 'lucide-react'

export interface FormWithUploadProps {
  /** Form title */
  title?: string
  /** Form description */
  description?: string
  /** Accepted file types */
  acceptedTypes?: string
  /** Maximum file size in MB */
  maxSize?: number
  /** Maximum number of files */
  maxFiles?: number
  /** Submit callback */
  onSubmit?: (data: FormWithUploadData) => void | Promise<void>
}

export interface FormWithUploadData {
  title: string
  description: string
  files: File[]
}

interface UploadedFile {
  file: File
  preview?: string
}

/**
 * FormWithUpload - File upload with drag-drop support
 *
 * @example
 * ```tsx
 * <FormWithUpload
 *   title="Upload Document"
 *   acceptedTypes="image/*,.pdf,.doc,.docx"
 *   maxSize={10}
 *   maxFiles={5}
 *   onSubmit={handleSubmit}
 * />
 * ```
 */
export function FormWithUpload({
  title = 'Upload Files',
  description = 'Drag and drop files or click to browse',
  acceptedTypes = 'image/*,.pdf,.doc,.docx',
  maxSize = 10,
  maxFiles = 5,
  onSubmit,
}: FormWithUploadProps) {
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
  })
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = React.useState(false)
  const [errors, setErrors] = React.useState<{ title?: string; description?: string; files?: string }>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="w-5 h-5" />
    if (file.type.includes('pdf')) return <FileText className="w-5 h-5" />
    return <File className="w-5 h-5" />
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const processFiles = (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const newErrors: any = {}

    // Check max files
    if (uploadedFiles.length + fileArray.length > maxFiles) {
      newErrors.files = `Maximum ${maxFiles} files allowed`
      setErrors(newErrors)
      return
    }

    // Check file sizes and create previews
    const validFiles: UploadedFile[] = []
    fileArray.forEach((file) => {
      if (file.size > maxSize * 1024 * 1024) {
        newErrors.files = `File "${file.name}" exceeds ${maxSize}MB limit`
        return
      }

      const uploadedFile: UploadedFile = { file }

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          uploadedFile.preview = reader.result as string
          setUploadedFiles((prev) => [...prev, uploadedFile])
        }
        reader.readAsDataURL(file)
      } else {
        validFiles.push(uploadedFile)
      }
    })

    if (validFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...validFiles])
    }

    setErrors(newErrors)
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    processFiles(e.dataTransfer.files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, idx) => idx !== index))
    setErrors((prev) => ({ ...prev, files: undefined }))
  }

  const validate = (): boolean => {
    const newErrors: any = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (uploadedFiles.length === 0) {
      newErrors.files = 'Please upload at least one file'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)

    try {
      const submitData: FormWithUploadData = {
        ...formData,
        files: uploadedFiles.map((f) => f.file),
      }

      if (onSubmit) {
        await onSubmit(submitData)
      } else {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))
        console.log('Form submitted:', {
          ...submitData,
          files: submitData.files.map((f) => ({ name: f.name, size: f.size })),
        })
        alert('Files uploaded successfully!')
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <EnhancedCard tilt={false} glowEffect={false}>
      <div className="p-6 border-b border-border">
        <h3 className="text-xl font-heading">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Title Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Title <span className="text-destructive">*</span>
          </label>
          <Input
            type="text"
            placeholder="Enter a title"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            className={errors.title ? 'border-destructive' : ''}
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Description <span className="text-destructive">*</span>
          </label>
          <Textarea
            placeholder="Provide a description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className={`min-h-[100px] ${errors.description ? 'border-destructive' : ''}`}
          />
          {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
        </div>

        {/* File Upload Area */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Files <span className="text-destructive">*</span>
          </label>
          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : errors.files
                ? 'border-destructive'
                : 'border-border hover:border-primary hover:bg-muted/20'
            }`}
          >
            <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
            <p className="text-sm font-medium mb-1">
              {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-muted-foreground">
              Supported formats: Images, PDF, DOC • Max {maxSize}MB per file • Max {maxFiles} files
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes}
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
          {errors.files && <p className="text-sm text-destructive">{errors.files}</p>}
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Uploaded Files ({uploadedFiles.length}/{maxFiles})
            </p>
            <div className="space-y-2">
              {uploadedFiles.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/20"
                >
                  {item.preview ? (
                    <div className="w-12 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
                      <img src={item.preview} alt={item.file.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded bg-muted flex items-center justify-center flex-shrink-0">
                      {getFileIcon(item.file)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(item.file.size)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" disabled={isSubmitting} className="btn-mm w-full">
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </>
          )}
        </button>
      </form>
    </EnhancedCard>
  )
}
