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
  Tag
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface BlessingDetailProps {
  blessing: Blessing
}

export default function BlessingDetail({ blessing }: BlessingDetailProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Increment view count when component mounts
    // This would typically be done server-side or with an API call
    // For now, we'll just track it locally
  }, [blessing.id])

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(blessing.content)
      toast.success('Blessing copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy blessing')
    }
  }

  const handleFavorite = () => {
    // This would typically involve API calls to manage user favorites
    setIsFavorited(!isFavorited)
    toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites')
  }

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'short': return 'Quick Blessing'
      case 'long': return 'Prayer & Letter'
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

  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getContentTypeColor(blessing.content_type)}`}>
              {getContentTypeLabel(blessing.content_type)}
            </span>
            {blessing.is_featured && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                Featured
              </span>
            )}
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold font-crimson mb-4">
          {blessing.title}
        </h1>

        {/* Breadcrumb */}
        <nav className="text-sm opacity-90">
          <ol className="flex items-center gap-2">
            <li>
              <a href="/" className="hover:text-white/80 transition-colors">
                Home
              </a>
            </li>
            <li>/</li>
            <li>
              <a 
                href={`/categories/${blessing.categories?.slug}`}
                className="hover:text-white/80 transition-colors"
              >
                {blessing.categories?.name}
              </a>
            </li>
            {blessing.subcategories && (
              <>
                <li>/</li>
                <li>
                  <a 
                    href={`/categories/${blessing.categories?.slug}?subcategory=${blessing.subcategories.slug}`}
                    className="hover:text-white/80 transition-colors"
                  >
                    {blessing.subcategories.name}
                  </a>
                </li>
              </>
            )}
          </ol>
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
          {blessing.author && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>By {blessing.author}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(blessing.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{blessing.view_count || 0} views</span>
          </div>
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            <span>{blessing.share_count || 0} shares</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none mb-8">
          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {blessing.content}
          </div>
        </div>

        {/* Tags */}
        {blessing.meta_keywords && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {blessing.meta_keywords.split(',').map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                  onClick={() => router.push(`/search?q=${encodeURIComponent(keyword.trim())}`)}
                >
                  {keyword.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-gray-200">
          <button
            onClick={handleCopyContent}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copy Text
          </button>
          
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>

          <button
            onClick={handleFavorite}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isFavorited
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            {isFavorited ? 'Favorited' : 'Add to Favorites'}
          </button>
        </div>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <ShareButtons
          blessing={blessing}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </article>
  )
}