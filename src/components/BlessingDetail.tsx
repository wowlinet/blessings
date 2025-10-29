'use client'

import { useState, useEffect } from 'react'
import { Blessing } from '@/types'
import ShareButtons from './ShareButtons'
import { 
  Calendar, 
  User, 
  Eye, 
  Share2, 
  Copy, 
  Heart,
  ArrowLeft,
  Tag,
  Check
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface BlessingDetailProps {
  blessing?: Blessing
  id?: string
  isModal?: boolean
}

export default function BlessingDetail({ blessing, id, isModal = false }: BlessingDetailProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [currentBlessing, setCurrentBlessing] = useState<Blessing | null>(blessing || null)
  const router = useRouter()

  // Fetch blessing data if only id is provided (for modal mode)
  useEffect(() => {
    if (id && !blessing) {
      const fetchBlessing = async () => {
        try {
          const response = await fetch(`/api/blessings/${id}`)
          if (response.ok) {
            const data = await response.json()
            setCurrentBlessing(data)
          }
        } catch (error) {
          console.error('Error fetching blessing:', error)
        }
      }
      fetchBlessing()
    }
  }, [id, blessing])

  // Check user authentication status and favorite status
  useEffect(() => {
    if (!currentBlessing) return

    const checkUserAndFavorites = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          // Check if blessing is favorited in database
          const { data, error } = await supabase
            .from('user_favorites')
            .select('id')
            .eq('user_id', user.id)
            .eq('blessing_id', currentBlessing.id)
            .single()

          if (!error && data) {
            setIsFavorited(true)
          }
        } else {
          // Check localStorage for non-authenticated users
          const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
          setIsFavorited(localFavorites.includes(currentBlessing.id))
        }
      } catch (error) {
        console.error('Error checking favorites:', error)
      }
    }

    checkUserAndFavorites()
  }, [currentBlessing?.id])

  const handleCopyContent = async () => {
    if (!currentBlessing) return
    try {
      await navigator.clipboard.writeText(currentBlessing.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  const handleFavorite = async () => {
    if (isLoading || !currentBlessing) return
    setIsLoading(true)

    try {
      if (user) {
        // Authenticated user - use database
        if (isFavorited) {
          // Remove from favorites
          const { error } = await supabase
            .from('user_favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('blessing_id', currentBlessing.id)

          if (error) throw error
          setIsFavorited(false)
        } else {
          // Add to favorites
          const { error } = await supabase
            .from('user_favorites')
            .insert({
              user_id: user.id,
              blessing_id: currentBlessing.id
            })

          if (error) throw error
          setIsFavorited(true)
        }
      } else {
        // Non-authenticated user - use localStorage
        const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
        
        if (isFavorited) {
          // Remove from favorites
          const updatedFavorites = localFavorites.filter((id: string) => id !== currentBlessing.id)
          localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
          setIsFavorited(false)
        } else {
          // Add to favorites
          const updatedFavorites = [...localFavorites, currentBlessing.id]
          localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
          setIsFavorited(true)
        }
      }
    } catch (error) {
      console.error('Error updating favorites:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'short': return 'Quick Blessing'
      case 'long': return 'Prayer/Letter'
      case 'image': return 'Shareable Image'
      default: return 'Blessing'
    }
  }

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'short': return 'bg-green-100 text-green-800'
      case 'long': return 'bg-blue-100 text-blue-800'
      case 'image': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!currentBlessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blessing...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={isModal ? "" : "min-h-screen text-white p-8"}>
      <div className={isModal ? "" : "container mx-auto px-4 py-8"}>
        <article className={isModal ? "" : "max-w-4xl mx-auto"}>
          {/* Header with background */}
          <div className={`relative hero-gradient text-amber-900 ${isModal ? "p-6" : "rounded-t-2xl p-8"} mb-0`}>
            <div className="flex items-center justify-between mb-6">
              {!isModal && (
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-amber-800/20 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getContentTypeColor(currentBlessing.content_type)}`}>
                  {getContentTypeLabel(currentBlessing.content_type)}
                </span>
                {currentBlessing.is_featured && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                    Featured
                  </span>
                )}
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              {currentBlessing.title}
            </h1>

            {/* Breadcrumb */}
            <nav className="text-sm opacity-90">
              <ol className="flex items-center gap-2 flex-wrap">
                <li>
                  <a href="/" className="hover:text-amber-700 transition-colors">
                    Home
                  </a>
                </li>
                <li>/</li>
                <li>
                  <a 
                    href={`/categories/${currentBlessing.categories?.slug}`}
                    className="hover:text-amber-700 transition-colors"
                  >
                    {currentBlessing.categories?.name}
                  </a>
                </li>
                {currentBlessing.subcategories && (
                  <>
                    <li>/</li>
                    <li>
                      <a 
                        href={`/categories/${currentBlessing.categories?.slug}/${currentBlessing.subcategories.slug}`}
                        className="hover:text-amber-700 transition-colors"
                      >
                        {currentBlessing.subcategories.name}
                      </a>
                    </li>
                  </>
                )}
              </ol>
            </nav>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                {currentBlessing.author && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>By {currentBlessing.author}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(currentBlessing.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyContent}
                  className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                  title="Copy blessing"
                >
                  {copied ? (
                    <Check size={16} className="text-green-600" />
                  ) : (
                    <Copy size={16} />
                  )}
                  <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                
                <button
                  onClick={() => setIsShareModalOpen(!isShareModalOpen)}
                  className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                  title="Share blessing"
                >
                  <Share2 size={16} />
                  <span className="text-sm">Share</span>
                </button>
                
                <button
                  onClick={handleFavorite}
                  className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                  title={isFavorited ? "Remove from favorites" : "Add to favorites"}
                  disabled={isLoading}
                >
                  <Heart 
                    size={16} 
                    className={`transition-colors duration-200 ${
                      isFavorited 
                        ? 'text-red-500 fill-red-500' 
                        : 'text-gray-500'
                    } ${isLoading ? 'opacity-50' : ''}`}
                  />
                  <span className="text-sm">{isFavorited ? 'Favorited' : 'Favorite'}</span>
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="prose prose-lg max-w-none">
              {/* Quote styling for blessing content */}
              <blockquote className="relative bg-gray-50 rounded-xl p-8 mb-8 border-l-4 border-amber-500">
                <div className="text-2xl text-amber-500 mb-4">"</div>
                <div className="text-xl leading-relaxed text-gray-800 whitespace-pre-wrap font-medium">
                  {currentBlessing.content}
                </div>
                <div className="text-2xl text-amber-500 text-right mt-4">"</div>
                {currentBlessing.author && (
                  <cite className="block mt-6 text-right text-gray-600 not-italic">
                    — {currentBlessing.author}
                  </cite>
                )}
              </blockquote>
            </div>

            {/* Tags */}
            {currentBlessing.meta_keywords && (
              <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5 text-amber-500" />
                  <span className="text-lg font-semibold text-gray-800">Related Tags</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {currentBlessing.meta_keywords.split(',').map((keyword, index) => (
                    <button
                      key={index}
                      className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm hover:bg-amber-50 hover:text-amber-700 transition-colors cursor-pointer border border-gray-200"
                      onClick={() => router.push(`/search?q=${encodeURIComponent(keyword.trim())}`)}
                    >
                      {keyword.trim()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Statistics */}
            <div className="flex items-center gap-6 mb-8 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 text-gray-600">
                <Eye className="w-5 h-5" />
                <span className="font-medium">{currentBlessing?.view_count || 0} views</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Share2 className="w-5 h-5" />
                <span className="font-medium">{currentBlessing?.share_count || 0} shares</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-gray-200">
              <button
                onClick={handleCopyContent}
                disabled={isLoading}
                className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
              >
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
              
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors shadow-sm"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>

              <button
                onClick={handleFavorite}
                disabled={isLoading}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-colors shadow-sm ${
                  isFavorited
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                    : 'cursor-pointer bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                {isFavorited ? 'Favorited' : 'Add to Favorites'}
              </button>
            </div>
          </div>
        </article>

        {/* Share Modal */}
        {isShareModalOpen && (
          <ShareButtons
            blessing={currentBlessing}
            onClose={() => setIsShareModalOpen(false)}
          />
        )}
      </div>
    </div>
  )
}