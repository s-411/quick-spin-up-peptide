'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Search, X, SlidersHorizontal, Grid, List } from 'lucide-react'

export interface SearchResult {
  id: string
  title: string
  description: string
  category: string
  tags?: string[]
  image?: string
  price?: number
}

export interface SearchResultsProps {
  /** Results to display */
  results: SearchResult[]
  /** Available categories for filtering */
  categories?: string[]
  /** Available tags for filtering */
  tags?: string[]
  /** Initial search query */
  initialQuery?: string
  /** Callback when search changes */
  onSearch?: (query: string) => void
  /** Show category filters */
  showCategories?: boolean
  /** Show tag filters */
  showTags?: boolean
  /** Show view toggle (grid/list) */
  showViewToggle?: boolean
}

/**
 * SearchResults - Results grid with faceted filters
 *
 * @example
 * ```tsx
 * <SearchResults
 *   results={searchResults}
 *   categories={['All', 'Articles', 'Products', 'Docs']}
 *   tags={['featured', 'new', 'popular']}
 *   showCategories
 *   showTags
 * />
 * ```
 */
export function SearchResults({
  results,
  categories = [],
  tags = [],
  initialQuery = '',
  onSearch,
  showCategories = true,
  showTags = true,
  showViewToggle = true,
}: SearchResultsProps) {
  const [query, setQuery] = React.useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All')
  const [selectedTags, setSelectedTags] = React.useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = React.useState(true)

  const filteredResults = React.useMemo(() => {
    let filtered = results

    // Filter by query
    if (query) {
      filtered = filtered.filter(
        (result) =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.description.toLowerCase().includes(query.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter((result) => result.category === selectedCategory)
    }

    // Filter by tags
    if (selectedTags.size > 0) {
      filtered = filtered.filter((result) =>
        result.tags?.some((tag) => selectedTags.has(tag))
      )
    }

    return filtered
  }, [results, query, selectedCategory, selectedTags])

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    if (onSearch) {
      onSearch(searchQuery)
    }
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev)
      if (next.has(tag)) {
        next.delete(tag)
      } else {
        next.add(tag)
      }
      return next
    })
  }

  const clearFilters = () => {
    setSelectedCategory('All')
    setSelectedTags(new Set())
  }

  const activeFilterCount = (selectedCategory !== 'All' ? 1 : 0) + selectedTags.size

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <EnhancedCard tilt={false} glowEffect={false} className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              startIcon={<Search className="w-5 h-5" />}
              clearable
              onClear={() => handleSearch('')}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex-shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="default" className="ml-2">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            {showViewToggle && (
              <div className="flex border border-border rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-muted' : 'hover:bg-muted/50'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 border-l border-border ${viewMode === 'list' ? 'bg-muted' : 'hover:bg-muted/50'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </EnhancedCard>

      {/* Filters */}
      {showFilters && (showCategories || showTags) && (
        <EnhancedCard tilt={false} glowEffect={false} className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Filters</h3>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            )}
          </div>

          {/* Category Filters */}
          {showCategories && categories.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                {['All', ...categories].map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tag Filters */}
          {showTags && tags.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.has(tag) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </EnhancedCard>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Results Grid/List */}
      {filteredResults.length === 0 ? (
        <EnhancedCard tilt={false} glowEffect={false} className="p-12 text-center">
          <p className="text-muted-foreground">No results found. Try adjusting your filters.</p>
        </EnhancedCard>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
              : 'space-y-4'
          }
        >
          {filteredResults.map((result) => (
            <EnhancedCard key={result.id} className={viewMode === 'list' ? 'p-0' : ''}>
              <div className={viewMode === 'list' ? 'flex gap-4 p-4' : ''}>
                {result.image && (
                  <div
                    className={
                      viewMode === 'list'
                        ? 'w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0'
                        : 'w-full aspect-video rounded-t-lg overflow-hidden bg-muted'
                    }
                  >
                    <img src={result.image} alt={result.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className={viewMode === 'grid' ? 'p-4' : 'flex-1 min-w-0'}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-heading text-lg">{result.title}</h3>
                    {result.price !== undefined && (
                      <p className="font-bold text-primary flex-shrink-0">
                        ${result.price}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {result.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {result.category}
                    </Badge>
                    {result.tags?.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </EnhancedCard>
          ))}
        </div>
      )}
    </div>
  )
}
