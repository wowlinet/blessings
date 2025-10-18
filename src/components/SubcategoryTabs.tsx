'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Category } from '@/types'

interface SubcategoryTabsProps {
  category: Category
  selectedSubcategory?: string
  selectedContentType?: string
}

export default function SubcategoryTabs({ 
  category, 
  selectedSubcategory, 
  selectedContentType 
}: SubcategoryTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSubcategoryChange = (subcategorySlug?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Reset to first page when changing subcategory
    params.delete('page')
    
    const queryString = params.toString()
    
    if (subcategorySlug) {
      // Navigate to subcategory route
      const url = `/categories/${category.slug}/${subcategorySlug}${queryString ? `?${queryString}` : ''}`
      router.push(url)
    } else {
      // Navigate back to category route (all subcategories)
      const url = `/categories/${category.slug}${queryString ? `?${queryString}` : ''}`
      router.push(url)
    }
  }

  const handleContentTypeChange = (contentType?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (contentType) {
      params.set('content_type', contentType)
    } else {
      params.delete('content_type')
    }
    
    // Reset to first page when changing content type
    params.delete('page')
    
    const queryString = params.toString()
    const url = `/categories/${category.slug}${queryString ? `?${queryString}` : ''}`
    router.push(url)
  }

  const contentTypes = [
    { value: '', label: 'All Types' },
    { value: 'short', label: 'Quick Blessings' },
    { value: 'long', label: 'Prayers & Letters' },
    { value: 'image', label: 'Shareable Images' }
  ]

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Subcategory Tabs */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Browse by Subcategory</h3>
        <div className="flex flex-wrap gap-2 justify-start">
          <button
            onClick={() => handleSubcategoryChange()}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              !selectedSubcategory
                ? 'bg-amber-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            All {category.name}
          </button>
          
          {category.subcategories?.map((subcategory) => (
            <button
              key={subcategory.id}
              onClick={() => handleSubcategoryChange(subcategory.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedSubcategory === subcategory.slug
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {subcategory.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content Type Filter */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Filter by Content Type</h3>
        <div className="flex flex-wrap gap-2 justify-start">
          {contentTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => handleContentTypeChange(type.value || undefined)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedContentType === type.value || (!selectedContentType && type.value === '')
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}