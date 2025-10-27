/**
 * Source Citations Component
 * Displays document sources used in RAG responses
 */

'use client'

import { cn } from '@/lib/utils/cn'

export interface SourceCitation {
  documentId: string
  chunkIndex: number
  similarity: number
}

export interface SourceCitationsProps {
  sources: SourceCitation[]
  className?: string
}

export function SourceCitations({ sources, className }: SourceCitationsProps) {
  if (!sources || sources.length === 0) {
    return null
  }

  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-xs font-medium text-muted-foreground">Sources:</p>
      <div className="flex flex-wrap gap-2">
        {sources.map((source, index) => (
          <div
            key={`${source.documentId}-${source.chunkIndex}`}
            className="flex items-center gap-2 rounded-md bg-muted/50 px-2 py-1 text-xs"
          >
            <span className="font-medium text-foreground">[{index + 1}]</span>
            <span className="text-muted-foreground">Chunk {source.chunkIndex + 1}</span>
            <span className="text-muted-foreground">
              {Math.round(source.similarity * 100)}% match
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
