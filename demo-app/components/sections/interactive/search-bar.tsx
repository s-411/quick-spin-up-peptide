'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Search, X, TrendingUp, Clock, ArrowRight } from 'lucide-react'

export interface SearchSuggestion {
  /** Suggestion text */
  text: string
  /** Suggestion category */
  category?: string
  /** Is this a recent search */
  isRecent?: boolean
  /** Is this a trending search */
  isTrending?: boolean
}

export interface SearchBarProps {
  /** Search placeholder */
  placeholder?: string
  /** Initial suggestions to show */
  suggestions?: SearchSuggestion[]
  /** Search callback */
  onSearch?: (query: string) => void
  /** Show recent searches */
  showRecent?: boolean
  /** Show trending searches */
  showTrending?: boolean
  /** Auto-focus on mount */
  autoFocus?: boolean
}

/**
 * SearchBar - Global search with suggestions
 *
 * @example
 * ```tsx
 * <SearchBar
 *   placeholder="Search for products, articles, or help..."
 *   suggestions={suggestions}
 *   onSearch={handleSearch}
 *   showRecent
 *   showTrending
 * />
 * ```
 */
export function SearchBar({
  placeholder = 'Search...',
  suggestions = [],
  onSearch,
  showRecent = true,
  showTrending = true,
  autoFocus = false,
}: SearchBarProps) {
  const [query, setQuery] = React.useState('')
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [recentSearches, setRecentSearches] = React.useState<string[]>([
    'Next.js documentation',
    'TypeScript types',
    'React hooks',
  ])
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  // Close suggestions when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredSuggestions = React.useMemo(() => {
    if (!query) return suggestions

    return suggestions.filter((s) => s.text.toLowerCase().includes(query.toLowerCase()))
  }, [query, suggestions])

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return

    // Add to recent searches
    setRecentSearches((prev) => {
      const updated = [searchQuery, ...prev.filter((s) => s !== searchQuery)]
      return updated.slice(0, 5)
    })

    if (onSearch) {
      onSearch(searchQuery)
    }

    setShowSuggestions(false)
    setQuery(searchQuery)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const clearSearch = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  const recentSuggestions = recentSearches.filter((s) => s.toLowerCase().includes(query.toLowerCase()))

  const trendingSuggestions = suggestions.filter((s) => s.isTrending)

  return (
    <div ref={containerRef} className="relative w-full">
      <EnhancedCard tilt={false} glowEffect={false} className="p-0 overflow-visible">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          startIcon={<Search className="w-5 h-5" />}
          clearable
          onClear={clearSearch}
          className="h-14 text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50">
            <EnhancedCard tilt={false} glowEffect={false} className="p-2 max-h-96 overflow-y-auto">
              {/* Recent Searches */}
              {showRecent && recentSuggestions.length > 0 && (
                <div className="mb-4">
                  <div className="px-3 py-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    Recent Searches
                  </div>
                  {recentSuggestions.map((recent, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearch(recent)}
                      className="w-full px-3 py-2 text-left rounded-md hover:bg-muted transition-colors flex items-center justify-between group"
                    >
                      <span className="text-sm">{recent}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}

              {/* Filtered Suggestions */}
              {filteredSuggestions.length > 0 && (
                <div className="mb-4">
                  {query && (
                    <div className="px-3 py-2 text-xs font-medium text-muted-foreground">Suggestions</div>
                  )}
                  {filteredSuggestions.slice(0, 5).map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearch(suggestion.text)}
                      className="w-full px-3 py-2 text-left rounded-md hover:bg-muted transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm">{suggestion.text}</p>
                          {suggestion.category && (
                            <p className="text-xs text-muted-foreground">{suggestion.category}</p>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}

              {/* Trending Searches */}
              {showTrending && !query && trendingSuggestions.length > 0 && (
                <div>
                  <div className="px-3 py-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <TrendingUp className="w-3 h-3" />
                    Trending
                  </div>
                  {trendingSuggestions.slice(0, 5).map((trending, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearch(trending.text)}
                      className="w-full px-3 py-2 text-left rounded-md hover:bg-muted transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <p className="text-sm">{trending.text}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {query &&
                filteredSuggestions.length === 0 &&
                recentSuggestions.length === 0 && (
                  <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                    No suggestions found for "{query}"
                  </div>
                )}
            </EnhancedCard>
          </div>
        )}
      </EnhancedCard>
    </div>
  )
}
