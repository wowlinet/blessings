'use client'

import { useRouter } from 'next/navigation'
import { Filter, X } from 'lucide-react'
import { useState } from 'react'

interface SearchFiltersProps {
  query: string
  filters: {
    category?: string
    contentType?: string
    sort?: string
    order?: string
  }
}

export default function SearchFilters({ query, filters }: SearchFiltersProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    
    // Set all current filters
    Object.entries(filters).forEach(([filterKey, filterValue]) => {
      if (filterKey === key) {
        if (value) params.set(filterKey, value)
      } else if (filterValue) {
        params.set(filterKey, filterValue)
      }
    })
    
    // Set the new filter value
    if (key !== 'sort' && key !== 'order' && value) {
      params.set(key, value)
    } else if (key === 'sort') {
      params.set('sort', value)
      if (!params.get('order')) {
        params.set('order', 'desc')
      }
    }
    
    // Reset page when changing filters
    params.delete('page')
    
    const queryString = params.toString()
    router.push(`/search${queryString ? `?${queryString}` : ''}`)
  }

  const clearFilters = () => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    router.push(`/search${query ? `?q=${encodeURIComponent(query)}` : ''}`)
  }

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'daily-blessings', label: 'Daily Blessings' },
    { value: 'birthday-blessings', label: 'Birthday Blessings' },
    { value: 'wedding-anniversary-blessings', label: 'Wedding & Anniversary' },
    { value: 'religious-blessings', label: 'Religious Blessings' },
    { value: 'life-events', label: 'Life Events' },
    { value: 'holiday-blessings', label: 'Holiday Blessings' },
    { value: 'sympathy-healing', label: 'Sympathy & Healing' },
  ]

  const contentTypes = [
    { value: '', label: 'All Types' },
    { value: 'short', label: 'Quick Blessings' },
    { value: 'long', label: 'Prayers & Letters' },
    { value: 'image', label: 'Shareable Images' }
  ]

  const sortOptions = [
    { value: 'created_at', order: 'desc', label: 'Newest First' },
    { value: 'created_at', order: 'asc', label: 'Oldest First' },
    { value: 'title', order: 'asc', label: 'A to Z' },
    { value: 'title', order: 'desc', label: 'Z to A' },
    { value: 'share_count', order: 'desc', label: 'Most Shared' },
    { value: 'view_count', order: 'desc', label: 'Most Viewed' },
  ]

  const hasActiveFilters = !!(filters.category || filters.contentType || filters.sort)

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full justify-center text-gray-900 dark:text-gray-100 cursor-pointer"
        >
          <Filter className="w-4 h-4" />
          <span>Filters & Sort</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-primary rounded-full"></span>
          )}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <FilterContent 
          categories={categories}
          contentTypes={contentTypes}
          sortOptions={sortOptions}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filters & Sort</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterContent 
                categories={categories}
                contentTypes={contentTypes}
                sortOptions={sortOptions}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
                onClose={() => setIsOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

interface FilterContentProps {
  categories: Array<{ value: string; label: string }>
  contentTypes: Array<{ value: string; label: string }>
  sortOptions: Array<{ value: string; order: string; label: string }>
  filters: {
    category?: string
    contentType?: string
    sort?: string
    order?: string
  }
  onFilterChange: (key: string, value: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
  onClose?: () => void
}

function FilterContent({ 
  categories,
  contentTypes,
  sortOptions,
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  onClose 
}: FilterContentProps) {
  return (
    <div className="space-y-6">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Filters</h3>
          <button
            onClick={() => {
              onClearFilters()
              onClose?.()
            }}
            className="text-sm text-primary hover:text-primary-dark transition-colors"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Category Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category.value}
                checked={filters.category === category.value || (!filters.category && category.value === '')}
                onChange={(e) => {
                  onFilterChange('category', e.target.value)
                  onClose?.()
                }}
                className="w-4 h-4 text-primary border-gray-300 dark:border-gray-600 focus:ring-primary dark:focus:ring-amber-400 dark:bg-gray-700"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Content Type Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-3">Content Type</h4>
        <div className="space-y-2">
          {contentTypes.map((type) => (
            <label key={type.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="contentType"
                value={type.value}
                checked={filters.contentType === type.value || (!filters.contentType && type.value === '')}
                onChange={(e) => {
                  onFilterChange('content_type', e.target.value)
                  onClose?.()
                }}
                className="w-4 h-4 text-primary border-gray-300 dark:border-gray-600 focus:ring-primary dark:focus:ring-amber-400 dark:bg-gray-700"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-3">Sort by</h4>
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <label key={`${option.value}-${option.order}`} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="sort"
                checked={
                  (filters.sort === option.value && filters.order === option.order) ||
                  (!filters.sort && option.value === 'created_at' && option.order === 'desc')
                }
                onChange={() => {
                  onFilterChange('sort', option.value)
                  onFilterChange('order', option.order)
                  onClose?.()
                }}
                className="w-4 h-4 text-primary border-gray-300 dark:border-gray-600 focus:ring-primary dark:focus:ring-amber-400 dark:bg-gray-700"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}