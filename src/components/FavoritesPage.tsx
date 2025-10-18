'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { UserFavorite, Blessing, Category } from '@/types'
import { Heart, Search, Filter, Grid, List, Trash2, CheckSquare, Square, ArrowUpDown, Calendar, X, Loader2 } from 'lucide-react'

interface FavoriteWithBlessing extends UserFavorite {
  blessings: Blessing & {
    categories: Category
    subcategories?: { name: string; slug: string }
  }
}

type SortOption = 'newest' | 'oldest' | 'alphabetical'
type ViewMode = 'grid' | 'list'

export default function FavoritesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // State management
  const [favorites, setFavorites] = useState<FavoriteWithBlessing[]>([])
  const [filteredFavorites, setFilteredFavorites] = useState<FavoriteWithBlessing[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  
  // Filter and search state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  
  // Batch operations state
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [batchMode, setBatchMode] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
        return
      }
      setUser(user)
    }
    checkAuth()
  }, [router])

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order')
        
        if (error) throw error
        setCategories(data || [])
      } catch (err) {
        console.error('Error loading categories:', err)
      }
    }
    loadCategories()
  }, [])

  // Load favorites
  const loadFavorites = useCallback(async () => {
    if (!user) return
    
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          id,
          user_id,
          blessing_id,
          created_at,
          blessings (
            id,
            title,
            content,
            content_type,
            author,
            categories (name, slug),
            subcategories (name, slug)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      const favoritesWithBlessings = (data || []).filter(fav => fav.blessings) as unknown as FavoriteWithBlessing[]
      setFavorites(favoritesWithBlessings)
    } catch (err) {
      console.error('Error loading favorites:', err)
      setError('Failed to load favorites, please try again later')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadFavorites()
    }
  }, [user, loadFavorites])

  // Filter and sort favorites
  useEffect(() => {
    let filtered = [...favorites]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(fav => 
        fav.blessings.title.toLowerCase().includes(query) ||
        fav.blessings.content.toLowerCase().includes(query)
      )
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(fav => 
        fav.blessings.categories.slug === selectedCategory
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'alphabetical':
          return a.blessings.title.localeCompare(b.blessings.title)
        default:
          return 0
      }
    })

    setFilteredFavorites(filtered)
  }, [favorites, searchQuery, selectedCategory, sortBy])

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const params = new URLSearchParams(searchParams)
    if (query) {
      params.set('search', query)
    } else {
      params.delete('search')
    }
    router.push(`/favorites?${params.toString()}`)
  }

  // Handle category filter
  const handleCategoryFilter = (categorySlug: string) => {
    setSelectedCategory(categorySlug)
    const params = new URLSearchParams(searchParams)
    if (categorySlug) {
      params.set('category', categorySlug)
    } else {
      params.delete('category')
    }
    router.push(`/favorites?${params.toString()}`)
  }

  // Handle remove favorite
  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', favoriteId)
        .eq('user_id', user.id)
      
      if (error) throw error
      
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId))
      setSelectedItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(favoriteId)
        return newSet
      })
    } catch (err) {
      console.error('Error removing favorite:', err)
      setError('Failed to remove favorite, please try again later')
    }
  }

  // Handle batch delete
  const handleBatchDelete = async () => {
    if (selectedItems.size === 0) return
    
    setDeleting(true)
    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .in('id', Array.from(selectedItems))
      
      if (error) throw error
      
      setFavorites(prev => prev.filter(fav => !selectedItems.has(fav.id)))
      setSelectedItems(new Set())
      setBatchMode(false)
    } catch (err) {
      console.error('Error batch deleting favorites:', err)
      setError('Batch delete failed, please try again later')
    } finally {
      setDeleting(false)
    }
  }

  // Handle item selection
  const handleItemSelect = (favoriteId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(favoriteId)) {
        newSet.delete(favoriteId)
      } else {
        newSet.add(favoriteId)
      }
      return newSet
    })
  }

  // Handle select all
  const handleSelectAll = () => {
    if (selectedItems.size === filteredFavorites.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(filteredFavorites.map(fav => fav.id)))
    }
  }

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border animate-pulse">
          <div className="p-6">
            <div className="h-4 bg-gray-200 rounded mb-3"></div>
            <div className="h-3 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-4"></div>
            <div className="flex justify-between items-center">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
              <div className="h-8 bg-gray-200 rounded w-8"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  // Empty state
  const EmptyState = () => (
    <div className="text-center py-16">
      <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">
        {searchQuery || selectedCategory ? 'No matching favorites found' : 'No blessings favorited yet'}
      </h3>
      <p className="text-gray-500 mb-6">
        {searchQuery || selectedCategory 
          ? 'Try adjusting your search terms or filters' 
          : 'Start favoriting blessings you love and manage them here'
        }
      </p>
      {!searchQuery && !selectedCategory && (
        <button
          onClick={() => router.push('/')}
          className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Browse Blessings
        </button>
      )}
    </div>
  )

  // Blessing card component
  const BlessingCard = ({ favorite }: { favorite: FavoriteWithBlessing }) => {
    const isSelected = selectedItems.has(favorite.id)
    
    // Helper functions for content type styling (matching homepage)
    const getContentTypeColor = (type: string) => {
      switch (type) {
        case 'short':
          return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
        case 'long':
          return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
        case 'image':
          return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      }
    }

    const getContentTypeLabel = (type: string) => {
      switch (type) {
        case 'short':
          return 'Quick Blessing'
        case 'long':
          return 'Prayer/Letter'
        case 'image':
          return 'Shareable Image'
        default:
          return 'Blessing'
      }
    }

    const truncatedContent = favorite.blessings.content.length > 150 
      ? favorite.blessings.content.substring(0, 150) + '...'
      : favorite.blessings.content
    
    return (
      <div className={`group bg-white dark:bg-gray-800 rounded-2xl p-6 card-shadow hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-1 ${
        isSelected ? 'ring-2 ring-purple-500' : ''
      }`}>
        {/* Batch selection checkbox */}
        {batchMode && (
          <div className="flex items-center mb-4">
            <button
              onClick={() => handleItemSelect(favorite.id)}
              className="text-purple-600 hover:text-purple-700 transition-colors duration-200"
            >
              {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
            </button>
          </div>
        )}

        {/* Content type and category badges */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getContentTypeColor(favorite.blessings.content_type)}`}>
            {getContentTypeLabel(favorite.blessings.content_type)}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            {favorite.blessings.categories.name}
          </span>
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 group-hover:text-primary dark:group-hover:text-amber-400 transition-colors duration-300 line-clamp-2">
          {favorite.blessings.title}
        </h3>
        
        {/* Content with quotes and author */}
        <div className="blessing-content mb-4">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-crimson line-clamp-3">
            &ldquo;{truncatedContent}&rdquo;
          </p>
          {favorite.blessings.author && (
            <cite className="block mt-2 text-sm text-gray-500 dark:text-gray-400 not-italic">
              — {favorite.blessings.author}
            </cite>
          )}
        </div>
        
        {/* Footer with date and actions */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <span className="text-xs">
              Favorited {new Date(favorite.created_at).toLocaleDateString('en-US')}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/blessings/${favorite.blessings.id}`)}
              className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 text-sm font-medium transition-colors duration-200"
            >
              View Details
            </button>
            
            {!batchMode && (
              <button
                onClick={() => handleRemoveFavorite(favorite.id)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                title="Remove from favorites"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="hero-gradient text-amber-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heart className="w-12 h-12 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
            <p className="text-amber-800 opacity-80">
              {favorites.length} blessing{favorites.length !== 1 ? 's' : ''} favorited
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search your favorite blessings..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                {searchQuery && (
                  <button
                    onClick={() => handleSearch('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-48">
              <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="lg:w-40">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="newest">Recently Favorited</option>
                <option value="oldest">Oldest Favorites</option>
                <option value="alphabetical">Sort by Title</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Batch Operations */}
          {filteredFavorites.length > 0 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setBatchMode(!batchMode)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    batchMode 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {batchMode ? 'Cancel Batch' : 'Batch Actions'}
                </button>
                
                {batchMode && (
                  <>
                    <button
                      onClick={handleSelectAll}
                      className="text-purple-600 hover:text-purple-700 text-sm"
                    >
                      {selectedItems.size === filteredFavorites.length ? 'Deselect All' : 'Select All'}
                    </button>
                    
                    {selectedItems.size > 0 && (
                      <button
                        onClick={handleBatchDelete}
                        disabled={deleting}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
                      >
                        {deleting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Delete Selected ({selectedItems.size})
                      </button>
                    )}
                  </>
                )}
              </div>
              
              <div className="text-sm text-gray-500">
                Showing {filteredFavorites.length} of {favorites.length} favorites
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : filteredFavorites.length === 0 ? (
          <EmptyState />
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredFavorites.map(favorite => (
              <BlessingCard key={favorite.id} favorite={favorite} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}