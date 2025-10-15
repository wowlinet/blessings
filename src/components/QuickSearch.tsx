'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Sparkles } from 'lucide-react'

export default function QuickSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const popularSearches = [
    'morning blessings',
    'birthday wishes',
    'wedding prayers',
    'healing blessings',
    'Christmas blessings'
  ]

  return (
    <section className="py-12 px-4 bg-gradient-to-r from-secondary/5 to-primary/5 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary dark:text-amber-400" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white font-crimson">
              Find Your Perfect Blessing
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Search through thousands of heartfelt blessings for any occasion
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for blessings, prayers, or occasions..."
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-amber-400/30 focus:border-primary dark:focus:border-amber-400 transition-all duration-300 bg-white dark:bg-gray-800 dark:text-white shadow-sm placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 pr-2 flex items-center"
            >
              <div className="bg-primary hover:bg-primary/90 dark:bg-amber-500 dark:hover:bg-amber-600 text-white px-6 py-2 rounded-full font-medium transition-colors duration-300">
                Search
              </div>
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Popular searches:</span>
          {popularSearches.map((search) => (
            <button
              key={search}
              onClick={() => {
                setSearchQuery(search)
                router.push(`/search?q=${encodeURIComponent(search)}`)
              }}
              className="text-sm bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-600 transition-colors duration-200"
            >
              {search}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}