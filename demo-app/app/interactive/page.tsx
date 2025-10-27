'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, Eye } from 'lucide-react'
import { ThemeToggle } from '@/design-system/lib/theme-toggle'
import { DataTable } from '@/components/sections/interactive/data-table'
import { TableWithActions } from '@/components/sections/interactive/table-with-actions'
import { TableWithFilters } from '@/components/sections/interactive/table-with-filters'
import { ContactForm } from '@/components/sections/interactive/contact-form'
import { SignupFormInteractive } from '@/components/sections'
import { MultiStepForm } from '@/components/sections/interactive/multi-step-form'
import { FormWithUpload } from '@/components/sections/interactive/form-with-upload'
import { SearchBar } from '@/components/sections/interactive/search-bar'
import { FilterPanel } from '@/components/sections/interactive/filter-panel'
import { SearchResults } from '@/components/sections/interactive/search-results'
import { Badge } from '@/components/ui/badge'

export default function InteractivePage() {
  // Sample data for DataTable
  const userData = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', joined: '2024-01-15' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User', joined: '2024-02-20' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Editor', joined: '2024-03-10' },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'Admin', joined: '2024-01-05' },
    { id: 5, name: 'Edward Norton', email: 'edward@example.com', role: 'User', joined: '2024-04-12' },
    { id: 6, name: 'Fiona Apple', email: 'fiona@example.com', role: 'Editor', joined: '2024-02-28' },
    { id: 7, name: 'George Lucas', email: 'george@example.com', role: 'User', joined: '2024-03-15' },
    { id: 8, name: 'Hannah Montana', email: 'hannah@example.com', role: 'Admin', joined: '2024-01-20' },
    { id: 9, name: 'Ivan Drago', email: 'ivan@example.com', role: 'User', joined: '2024-04-01' },
    { id: 10, name: 'Julia Roberts', email: 'julia@example.com', role: 'Editor', joined: '2024-02-14' },
  ]

  const userColumns = [
    { header: 'Name', accessorKey: 'name', sortable: true },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Role', accessorKey: 'role', cell: (row: any) => <Badge variant="secondary">{row.role}</Badge> },
    { header: 'Joined', accessorKey: 'joined', sortable: true },
  ]

  // Sample data for TableWithActions
  const projectsData = [
    { id: 1, name: 'Website Redesign', owner: 'Alice Johnson', status: 'Active', progress: 75 },
    { id: 2, name: 'Mobile App', owner: 'Bob Smith', status: 'Pending', progress: 30 },
    { id: 3, name: 'API Integration', owner: 'Charlie Brown', status: 'Active', progress: 90 },
    { id: 4, name: 'Marketing Campaign', owner: 'Diana Prince', status: 'Inactive', progress: 0 },
  ]

  const projectColumns = [
    { header: 'Project Name', accessorKey: 'name' },
    { header: 'Owner', accessorKey: 'owner' },
    { header: 'Progress', accessorKey: 'progress', cell: (row: any) => `${row.progress}%` },
  ]

  const projectActions = [
    { label: 'View', icon: <Eye className="w-4 h-4" />, onClick: (row: any) => console.log('View', row) },
    { label: 'Edit', icon: <Edit className="w-4 h-4" />, onClick: (row: any) => console.log('Edit', row) },
    { label: 'Delete', icon: <Trash2 className="w-4 h-4" />, onClick: (row: any) => console.log('Delete', row), variant: 'destructive' as const },
  ]

  // Sample data for TableWithFilters
  const productsData = [
    { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 1299, stock: 45 },
    { id: 2, name: 'Desk Chair', category: 'Furniture', price: 299, stock: 120 },
    { id: 3, name: 'Wireless Mouse', category: 'Electronics', price: 49, stock: 200 },
    { id: 4, name: 'Standing Desk', category: 'Furniture', price: 599, stock: 30 },
    { id: 5, name: 'Monitor 4K', category: 'Electronics', price: 499, stock: 75 },
    { id: 6, name: 'Office Lamp', category: 'Furniture', price: 79, stock: 150 },
  ]

  const productColumns = [
    { header: 'Product', accessorKey: 'name' },
    { header: 'Category', accessorKey: 'category' },
    { header: 'Price', accessorKey: 'price', cell: (row: any) => `$${row.price}` },
    { header: 'Stock', accessorKey: 'stock' },
  ]

  const productFilters = [
    { label: 'Category', key: 'category', type: 'select' as const, options: ['Electronics', 'Furniture'] },
  ]

  // Sample data for SearchBar
  const searchSuggestions = [
    { text: 'Next.js documentation', category: 'Docs', isTrending: true },
    { text: 'TypeScript best practices', category: 'Guides', isTrending: true },
    { text: 'React performance optimization', category: 'Tutorials' },
    { text: 'Tailwind CSS utilities', category: 'Docs' },
    { text: 'Design system tokens', category: 'Reference', isTrending: true },
  ]

  // Sample data for FilterPanel
  const filterGroups = [
    {
      id: 'category',
      label: 'Category',
      type: 'checkbox' as const,
      options: [
        { label: 'Articles', value: 'articles', count: 24 },
        { label: 'Products', value: 'products', count: 15 },
        { label: 'Documentation', value: 'docs', count: 48 },
      ],
    },
    {
      id: 'price',
      label: 'Price Range',
      type: 'range' as const,
      min: 0,
      max: 1000,
    },
    {
      id: 'rating',
      label: 'Rating',
      type: 'select' as const,
      options: [
        { label: '5 Stars', value: '5' },
        { label: '4+ Stars', value: '4' },
        { label: '3+ Stars', value: '3' },
      ],
    },
  ]

  // Sample data for SearchResults
  const searchResultsData = [
    {
      id: '1',
      title: 'Getting Started with Next.js',
      description: 'Learn how to build modern web applications with Next.js 14 and React.',
      category: 'Articles',
      tags: ['featured', 'beginner'],
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
      price: 0,
    },
    {
      id: '2',
      title: 'Advanced TypeScript Patterns',
      description: 'Master advanced TypeScript patterns for type-safe applications.',
      category: 'Articles',
      tags: ['advanced', 'popular'],
      image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop',
      price: 0,
    },
    {
      id: '3',
      title: 'Premium Design System',
      description: 'Complete design system with components and documentation.',
      category: 'Products',
      tags: ['featured', 'new'],
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
      price: 199,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-start justify-between mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <ThemeToggle />
          </div>
          <h1 className="text-4xl font-heading mb-2">Tier 4: Interactive Sections</h1>
          <p className="text-muted-foreground">Tables, forms, and search/filter components</p>
        </div>
      </div>

      {/* Table Sections */}
      <div className="bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-heading mb-2 text-primary">Table Sections</h2>
          <p className="text-muted-foreground mb-8">Interactive data tables with sorting, actions, and filtering</p>

          <div className="space-y-12">
            {/* DataTable */}
            <div>
              <h3 className="text-xl font-heading mb-2">1. DataTable</h3>
              <p className="text-sm text-muted-foreground mb-4">Sortable table with pagination and row selection</p>
              <DataTable
                title="User Management"
                columns={userColumns}
                data={userData}
                selectable
                showPagination
                pageSize={5}
              />
            </div>

            {/* TableWithActions */}
            <div>
              <h3 className="text-xl font-heading mb-2">2. TableWithActions</h3>
              <p className="text-sm text-muted-foreground mb-4">Action buttons per row (view, edit, delete)</p>
              <TableWithActions
                title="Project Dashboard"
                description="Manage your active projects"
                columns={projectColumns}
                data={projectsData}
                actions={projectActions}
                showStatus
              />
            </div>

            {/* TableWithFilters */}
            <div>
              <h3 className="text-xl font-heading mb-2">3. TableWithFilters</h3>
              <p className="text-sm text-muted-foreground mb-4">Integrated column filters and search</p>
              <TableWithFilters
                title="Product Catalog"
                columns={productColumns}
                data={productsData}
                filters={productFilters}
                showSearch
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form Sections */}
      <div>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-heading mb-2 text-primary">Form Sections</h2>
          <p className="text-muted-foreground mb-8">Advanced forms with validation and interactive features</p>

          <div className="space-y-12">
            {/* ContactForm */}
            <div>
              <h3 className="text-xl font-heading mb-2">4. ContactForm</h3>
              <p className="text-sm text-muted-foreground mb-4">Multi-field contact form with validation</p>
              <ContactForm />
            </div>

            {/* SignupForm */}
            <div>
              <h3 className="text-xl font-heading mb-2">5. SignupForm</h3>
              <p className="text-sm text-muted-foreground mb-4">User registration with password strength indicator</p>
              <SignupFormInteractive />
            </div>

            {/* MultiStepForm */}
            <div>
              <h3 className="text-xl font-heading mb-2">6. MultiStepForm</h3>
              <p className="text-sm text-muted-foreground mb-4">Wizard-style form with progress indicator</p>
              <MultiStepForm />
            </div>

            {/* FormWithUpload */}
            <div>
              <h3 className="text-xl font-heading mb-2">7. FormWithUpload</h3>
              <p className="text-sm text-muted-foreground mb-4">File upload with drag-drop support</p>
              <FormWithUpload />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Sections */}
      <div className="bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-heading mb-2 text-primary">Search & Filter Sections</h2>
          <p className="text-muted-foreground mb-8">Advanced search and filtering capabilities</p>

          <div className="space-y-12">
            {/* SearchBar */}
            <div>
              <h3 className="text-xl font-heading mb-2">8. SearchBar</h3>
              <p className="text-sm text-muted-foreground mb-4">Global search with suggestions and recent searches</p>
              <SearchBar
                placeholder="Search for documentation, tutorials, or guides..."
                suggestions={searchSuggestions}
                showRecent
                showTrending
              />
            </div>

            {/* FilterPanel + SearchResults */}
            <div>
              <h3 className="text-xl font-heading mb-2">9. FilterPanel</h3>
              <p className="text-sm text-muted-foreground mb-4">Multi-criteria filtering sidebar</p>
              <div className="grid lg:grid-cols-[300px_1fr] gap-6">
                <FilterPanel groups={filterGroups} onChange={(filters) => console.log('Filters:', filters)} />
                <div>
                  <h3 className="text-xl font-heading mb-2">10. SearchResults</h3>
                  <p className="text-sm text-muted-foreground mb-4">Results grid with faceted filters</p>
                  <SearchResults
                    results={searchResultsData}
                    categories={['Articles', 'Products', 'Documentation']}
                    tags={['featured', 'new', 'popular', 'beginner', 'advanced']}
                    showCategories
                    showTags
                    showViewToggle
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
