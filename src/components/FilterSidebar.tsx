'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, X } from 'lucide-react'
import { useState } from 'react'

interface FilterSidebarProps {
  categorySlug: string
}

export default function FilterSidebar({ categorySlug }: FilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const currentSort = searchParams.get('sort') || 'created_at'
  const currentOrder = searchParams.get('order') || 'desc'

  const handleSortChange = (sort: string, order: string = 'desc') => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sort)
    params.set('order', order)
    params.delete('page') // Reset to first page
    
    const queryString = params.toString()
    const url = `/categories/${categorySlug}${queryString ? `?${queryString}` : ''}`
    router.push(url)
  }

  const clearFilters = () => {
    const params = new URLSearchParams()
    // Keep only category and subcategory
    const subcategory = searchParams.get('subcategory')
    if (subcategory) {
      params.set('subcategory', subcategory)
    }
    
    const queryString = params.toString()
    const url = `/categories/${categorySlug}${queryString ? `?${queryString}` : ''}`
    router.push(url)
  }

  const sortOptions = [
    { value: 'created_at', order: 'desc', label: 'Newest First' },
    { value: 'created_at', order: 'asc', label: 'Oldest First' },
    { value: 'title', order: 'asc', label: 'A to Z' },
    { value: 'title', order: 'desc', label: 'Z to A' },
    { value: 'share_count', order: 'desc', label: 'Most Shared' },
    { value: 'view_count', order: 'desc', label: 'Most Viewed' },
  ]

  const hasActiveFilters = !!(searchParams.get('sort') || searchParams.get('content_type'))

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Filters & Sort</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-primary-400 rounded-full"></span>
          )}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <FilterContent 
          sortOptions={sortOptions}
          currentSort={currentSort}
          currentOrder={currentOrder}
          onSortChange={handleSortChange}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Filters & Sort</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterContent 
                sortOptions={sortOptions}
                currentSort={currentSort}
                currentOrder={currentOrder}
                onSortChange={handleSortChange}
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
  sortOptions: Array<{ value: string; order: string; label: string }>
  currentSort: string
  currentOrder: string
  onSortChange: (sort: string, order: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
  onClose?: () => void
}

function FilterContent({ 
  sortOptions, 
  currentSort, 
  currentOrder, 
  onSortChange, 
  onClearFilters, 
  hasActiveFilters,
  onClose 
}: FilterContentProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Sort & Filter</h3>
        {hasActiveFilters && (
          <button
            onClick={() => {
              onClearFilters()
              onClose?.()
            }}
            className="text-sm text-primary-400 hover:text-primary-500 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Sort Options */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">Sort by</h4>
        {sortOptions.map((option) => (
          <label key={`${option.value}-${option.order}`} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="sort"
              checked={currentSort === option.value && currentOrder === option.order}
              onChange={() => {
                onSortChange(option.value, option.order)
                onClose?.()
              }}
              className="w-4 h-4 text-primary-400 border-gray-300 focus:ring-primary-400"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>

      {/* Additional Filters */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-700 mb-3">Quick Filters</h4>
        <div className="space-y-2">
          <button 
            onClick={() => {
              onSortChange('is_featured', 'desc')
              onClose?.()
            }}
            className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
          >
            Featured Only
          </button>
          <button 
            onClick={() => {
              onSortChange('share_count', 'desc')
              onClose?.()
            }}
            className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
          >
            Most Popular
          </button>
        </div>
      </div>
    </div>
  )
}