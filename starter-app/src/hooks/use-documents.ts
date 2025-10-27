/**
 * useDocuments Hook
 * Manages document state and operations
 */

'use client'

import { useState, useEffect, useCallback } from 'react'

export interface Document {
  id: string
  title: string
  fileName: string
  fileSize: number
  fileType: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  errorMessage: string | null
  chunkCount: number
  totalTokens: number
  createdAt: string
  updatedAt: string
  processedAt: string | null
}

export interface UseDocumentsReturn {
  documents: Document[]
  loading: boolean
  error: string | null
  uploadDocument: (file: File, title?: string) => Promise<void>
  deleteDocument: (documentId: string) => Promise<void>
  refreshDocuments: () => Promise<void>
  uploadProgress: number | null
  isUploading: boolean
}

/**
 * Hook for managing documents
 */
export function useDocuments(): UseDocumentsReturn {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Fetch documents
  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/documents')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch documents')
      }

      setDocuments(data.documents || [])
    } catch (err) {
      console.error('Error fetching documents:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch documents')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  // Upload document
  const uploadDocument = useCallback(
    async (file: File, title?: string) => {
      try {
        setIsUploading(true)
        setUploadProgress(0)
        setError(null)

        // Read file content
        const content = await readFileAsText(file)

        setUploadProgress(30)

        // Upload document
        const response = await fetch('/api/documents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: title || file.name,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            storagePath: `documents/${Date.now()}-${file.name}`,
            content,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to upload document')
        }

        setUploadProgress(100)

        // Refresh documents list
        await fetchDocuments()
      } catch (err) {
        console.error('Error uploading document:', err)
        setError(err instanceof Error ? err.message : 'Failed to upload document')
        throw err
      } finally {
        setIsUploading(false)
        setTimeout(() => setUploadProgress(null), 1000)
      }
    },
    [fetchDocuments]
  )

  // Delete document
  const deleteDocument = useCallback(async (documentId: string) => {
    try {
      setError(null)

      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete document')
      }

      // Remove from local state
      setDocuments(prev => prev.filter(doc => doc.id !== documentId))
    } catch (err) {
      console.error('Error deleting document:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete document')
      throw err
    }
  }, [])

  return {
    documents,
    loading,
    error,
    uploadDocument,
    deleteDocument,
    refreshDocuments: fetchDocuments,
    uploadProgress,
    isUploading,
  }
}

/**
 * Read file content as text
 */
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      resolve(reader.result as string)
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsText(file)
  })
}
