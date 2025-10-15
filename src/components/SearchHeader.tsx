'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, X } from 'lucide-react'

interface SearchHeaderProps {
  initialQuery: string
  totalResults: number
}

export default function SearchHeader({ initialQuery, totalResults }: SearchHeaderProps) {
  const [query, setQuery] = useState(initialQuery)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleClearSearch = () => {
    setQuery('')
    router.push('/search')
  }

  return (
    <section className="hero-gradient text-amber-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-crimson mb-4">
            Search Blessings
          </h1>
          <p className="text-lg text-amber-700">
            Find the perfect blessing for any moment in life
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="relative mb-6">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for blessings, prayers, or keywords..."
              className="w-full px-6 py-4 pr-24 text-gray-800 bg-white rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-amber-200/50 text-lg"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {query && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button
                type="submit"
                className="bg-amber-600 text-white p-3 rounded-full hover:bg-amber-700 transition-colors shadow-lg"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>

        {/* Search Results Summary */}
        {initialQuery && (
          <div className="text-center">
            <p className="text-lg text-amber-700">
              {totalResults > 0 ? (
                <>
                  Found <span className="font-semibold text-amber-800">{totalResults}</span> results for{' '}
                  <span className="font-semibold text-amber-800">"{initialQuery}"</span>
                </>
              ) : (
                <>
                  No results found for <span className="font-semibold text-amber-800">"{initialQuery}"</span>
                </>
              )}
            </p>
          </div>
        )}

        {/* Popular Searches */}
        {!initialQuery && (
          <div className="text-center">
            <p className="text-sm text-amber-700 mb-3">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                'morning blessings',
                'birthday wishes',
                'wedding prayers',
                'healing prayers',
                'Christmas blessings',
                'new baby',
                'graduation'
              ].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term)
                    router.push(`/search?q=${encodeURIComponent(term)}`)
                  }}
                  className="px-3 py-1 bg-amber-100/50 backdrop-blur-sm rounded-full text-sm hover:bg-amber-100/70 transition-colors border border-amber-200/40 text-amber-800"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}