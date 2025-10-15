'use client'

import { Blessing } from '@/types'
import BlessingCard from './BlessingCard'
import SearchFilters from './SearchFilters'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SearchResultsProps {
  query: string
  blessings: Blessing[]
  currentPage: number
  totalPages: number
  totalCount: number
  filters: {
    category?: string
    contentType?: string
    sort?: string
    order?: string
  }
}

export default function SearchResults({
  query,
  blessings,
  currentPage,
  totalPages,
  totalCount,
  filters
}: SearchResultsProps) {
  const router = useRouter()

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (filters.category) params.set('category', filters.category)
    if (filters.contentType) params.set('content_type', filters.contentType)
    if (filters.sort) params.set('sort', filters.sort)
    if (filters.order) params.set('order', filters.order)
    if (page > 1) params.set('page', page.toString())
    
    const queryString = params.toString()
    router.push(`/search${queryString ? `?${queryString}` : ''}`)
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  if (!query.trim()) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <span className="text-2xl text-gray-400 dark:text-gray-500">🔍</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Start your search</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Enter keywords to find the perfect blessing for any occasion.
        </p>
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 dark:text-gray-200">Try searching for:</h4>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'birthday blessings',
              'wedding prayers',
              'morning blessings',
              'healing prayers',
              'Christmas wishes',
              'new baby blessings',
              'graduation prayers'
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => router.push(`/search?q=${encodeURIComponent(suggestion)}`)}
                className="px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (blessings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <span className="text-2xl text-gray-400 dark:text-gray-500">😔</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">No results found</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We couldn't find any blessings matching your search. Try different keywords or browse our categories.
        </p>
        <div className="space-y-4">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => router.push('/search')}
              className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              New Search
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Browse Categories
            </button>
          </div>
          
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-amber-50 dark:from-blue-900/20 dark:to-amber-900/20 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
              <span className="text-blue-500 mr-2">💡</span>
              Search Tips:
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Try broader keywords</strong> - Use "birthday" instead of "21st birthday"
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Check your spelling</strong> - Make sure all words are spelled correctly
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Use synonyms</strong> - Try "prayer" instead of "blessing"
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Browse categories</strong> - Explore our organized collections for inspiration
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Filters Sidebar */}
      <div className="lg:w-64 flex-shrink-0">
        <SearchFilters query={query} filters={filters} />
      </div>

      {/* Results */}
      <div className="flex-1">
        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Showing {((currentPage - 1) * 12) + 1} - {Math.min(currentPage * 12, totalCount)} of {totalCount} results
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {/* Blessing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {blessings.map((blessing) => (
            <BlessingCard key={blessing.id} blessing={blessing} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => (
                <div key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-2 text-gray-400">...</span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(page as number)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-amber-500 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}