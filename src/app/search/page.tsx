import { Metadata } from 'next'
import { searchBlessings } from '@/lib/supabase'
import SearchResults from '@/components/SearchResults'
import SearchHeader from '@/components/SearchHeader'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    content_type?: string
    sort?: string
    order?: string
    page?: string
  }>
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams
  const query = resolvedSearchParams.q || ''
  
  if (!query) {
    return {
      title: 'Search Blessings - BlessYou.Today',
      description: 'Search through thousands of heartfelt blessings, prayers, and inspirational messages for every occasion.',
      openGraph: {
        title: 'Search Blessings - BlessYou.Today',
        description: 'Find the perfect blessing for any moment in life.',
        type: 'website',
      },
    }
  }

  return {
    title: `Search results for "${query}" - BlessYou.Today`,
    description: `Find blessings related to "${query}". Browse through our collection of heartfelt messages and prayers.`,
    openGraph: {
      title: `Search results for "${query}" - BlessYou.Today`,
      description: `Discover meaningful blessings about ${query}`,
      type: 'website',
    },
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams
  const query = resolvedSearchParams.q || ''
  const category = resolvedSearchParams.category
  const contentType = resolvedSearchParams.content_type
  const sort = resolvedSearchParams.sort || 'created_at'
  const order = resolvedSearchParams.order || 'desc'
  const page = parseInt(resolvedSearchParams.page || '1')
  const limit = 12

  let searchResults: {
    blessings: any[]
    total: number
    totalPages: number
  } = {
    blessings: [],
    total: 0,
    totalPages: 0
  }

  if (query.trim()) {
    try {
      searchResults = await searchBlessings({
        query: query.trim(),
        category,
        contentType,
        sort,
        order: order as 'asc' | 'desc',
        page,
        limit
      })
    } catch (error) {
      console.error('Search error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SearchHeader 
        initialQuery={query}
        totalResults={searchResults.total}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-8 bg-transparent dark:bg-gray-900">
        <SearchResults
          query={query}
          blessings={searchResults.blessings}
          currentPage={page}
          totalPages={searchResults.totalPages}
          totalCount={searchResults.total}
          filters={{
            category,
            contentType,
            sort,
            order
          }}
        />
      </main>
    </div>
  )
}