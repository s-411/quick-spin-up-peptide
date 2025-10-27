'use client'

import * as React from 'react'
import { Search, X } from 'lucide-react'
import { EnhancedCard } from '@/components/ui/enhanced-card'

export interface SearchSuggestion {
  /** Suggestion label */
  label: string
  /** Suggestion value */
  value: string
}

export interface EmptyStateSearchProps {
  /** Search query that returned no results */
  query: string
  /** Search suggestions */
  suggestions?: SearchSuggestion[]
  /** Clear search callback */
  onClearSearch?: () => void
  /** Suggestion click callback */
  onSuggestionClick?: (suggestion: SearchSuggestion) => void
  /** Show suggestions */
  showSuggestions?: boolean
  /** Custom message */
  message?: string
}

/**
 * EmptyStateSearch - No results/search empty state
 *
 * @example
 * ```tsx
 * <EmptyStateSearch
 *   query="react native"
 *   suggestions={[
 *     { label: 'React', value: 'react' },
 *     { label: 'Next.js', value: 'nextjs' }
 *   ]}
 *   onClearSearch={() => setQuery('')}
 *   onSuggestionClick={(s) => setQuery(s.value)}
 *   showSuggestions
 * />
 * ```
 */
export function EmptyStateSearch({
  query,
  suggestions = [],
  onClearSearch,
  onSuggestionClick,
  showSuggestions = true,
  message = 'No results found',
}: EmptyStateSearchProps) {
  return (
    <EnhancedCard tilt={false} glowEffect={false} className="w-full">
      <div className="flex flex-col items-center justify-center text-center py-12 px-6">
        {/* Icon */}
        <div className="mb-6 text-muted-foreground/40">
          <Search className="w-16 h-16" strokeWidth={1.5} />
        </div>

        {/* Content */}
        <div className="max-w-md space-y-3 mb-6">
          <h3 className="text-2xl font-heading font-bold">{message}</h3>
          <p className="text-muted-foreground">
            We couldn't find any results for{' '}
            <span className="font-medium text-foreground">"{query}"</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filter to find what you're looking for
          </p>
        </div>

        {/* Clear Button */}
        {onClearSearch && (
          <button
            onClick={onClearSearch}
            className="btn-mm mb-8"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Search
          </button>
        )}

        {/* Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="w-full max-w-md">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Try searching for:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => onSuggestionClick?.(suggestion)}
                  className="px-4 py-2 rounded-full bg-muted hover:bg-muted/70 text-sm font-medium transition-colors"
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </EnhancedCard>
  )
}
