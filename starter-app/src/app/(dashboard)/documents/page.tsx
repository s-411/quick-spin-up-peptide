/**
 * Documents Page
 * Manage and upload documents for RAG
 */

'use client'

import { Container } from '@/components/layout/container'
import { DocumentUpload } from '@/components/chat/document-upload'
import { useDocuments } from '@/hooks/use-documents'
import Link from 'next/link'

export default function DocumentsPage() {
  const { documents, loading, error, uploadDocument, deleteDocument, uploadProgress, isUploading } =
    useDocuments()

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    }

    return (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${styles[status as keyof typeof styles] || ''}`}
      >
        {status}
      </span>
    )
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Container size="xl" className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Documents</h1>
        <p className="mt-2 text-muted-foreground">
          Upload and manage documents for your AI assistant
        </p>
      </div>

      {/* Upload section */}
      <div className="mb-8">
        <DocumentUpload
          onUpload={uploadDocument}
          progress={uploadProgress}
          isUploading={isUploading}
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Documents list */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Your Documents</h2>
          <Link href="/chat" className="text-sm text-primary hover:underline">
            Go to Chat →
          </Link>
        </div>

        {loading && documents.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : documents.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <svg
                className="h-8 w-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-foreground">No documents yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Upload your first document to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map(doc => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-foreground">{doc.title}</h3>
                    {getStatusBadge(doc.status)}
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{doc.fileName}</span>
                    <span>{formatFileSize(doc.fileSize)}</span>
                    {doc.status === 'completed' && (
                      <>
                        <span>{doc.chunkCount} chunks</span>
                        <span>{doc.totalTokens} tokens</span>
                      </>
                    )}
                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                  </div>
                  {doc.status === 'failed' && doc.errorMessage && (
                    <p className="mt-1 text-xs text-destructive">{doc.errorMessage}</p>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this document?')) {
                      deleteDocument(doc.id)
                    }
                  }}
                  className="ml-4 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Delete document"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}
