'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Blessing } from '@/types'
import { Share2, Heart, Copy, Check } from 'lucide-react'
import ShareButtons from './ShareButtons'
import { supabase } from '@/lib/supabase'

interface BlessingCardProps {
  blessing: Blessing
  showCategory?: boolean
}

export default function BlessingCard({ blessing, showCategory = false }: BlessingCardProps) {
  const [showShareButtons, setShowShareButtons] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      await navigator.clipboard.writeText(blessing.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowShareButtons(!showShareButtons)
  }

  // Check user authentication status and favorite status
  useEffect(() => {
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
            .eq('blessing_id', blessing.id)
            .single()

          if (!error && data) {
            setIsFavorited(true)
          }
        } else {
          // Check localStorage for non-authenticated users
          const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
          setIsFavorited(localFavorites.includes(blessing.id))
        }
      } catch (error) {
        console.error('Error checking favorites:', error)
      }
    }

    checkUserAndFavorites()
  }, [blessing.id])

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isLoading) return
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
            .eq('blessing_id', blessing.id)

          if (error) throw error
          setIsFavorited(false)
        } else {
          // Add to favorites
          const { error } = await supabase
            .from('user_favorites')
            .insert({
              user_id: user.id,
              blessing_id: blessing.id
            })

          if (error) throw error
          setIsFavorited(true)
        }
      } else {
        // Non-authenticated user - use localStorage
        const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
        
        if (isFavorited) {
          // Remove from favorites
          const updatedFavorites = localFavorites.filter((id: string) => id !== blessing.id)
          localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
          setIsFavorited(false)
        } else {
          // Add to favorites
          const updatedFavorites = [...localFavorites, blessing.id]
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

  const truncatedContent = blessing.content.length > 150 
    ? blessing.content.substring(0, 150) + '...'
    : blessing.content

  return (
    <>
      <Link
        href={`/blessings/${blessing.slug}`}
        className="group block bg-white dark:bg-gray-800 rounded-2xl p-6 card-shadow hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-1"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getContentTypeColor(blessing.content_type)}`}>
              {getContentTypeLabel(blessing.content_type)}
            </span>
            {showCategory && blessing.categories && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {blessing.categories.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
              title="Copy blessing"
            >
              {copied ? (
                <Check size={16} className="text-green-600 dark:text-green-400" />
              ) : (
                <Copy size={16} className="text-gray-500 dark:text-gray-400" />
              )}
            </button>
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
              title="Share blessing"
            >
              <Share2 size={16} className="text-gray-500 dark:text-gray-400" />
            </button>
            <button
              onClick={handleFavorite}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
              title={isFavorited ? "Remove from favorites" : "Add to favorites"}
              disabled={isLoading}
            >
              <Heart 
                size={16} 
                className={`${
                  isFavorited 
                    ? 'text-red-500 dark:text-red-400 fill-current' 
                    : 'text-gray-500 dark:text-gray-400'
                } ${isLoading ? 'opacity-50' : ''}`}
              />
            </button>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 group-hover:text-primary dark:group-hover:text-amber-400 transition-colors duration-300">
          {blessing.title}
        </h3>

        <div className="blessing-content mb-4">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-crimson">
            &ldquo;{truncatedContent}&rdquo;
          </p>
          {blessing.author && (
            <cite className="block mt-2 text-sm text-gray-500 dark:text-gray-400 not-italic">
              — {blessing.author}
            </cite>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Share2 size={14} />
              <span>{blessing.share_count || 0}</span>
            </div>
            {blessing.view_count && (
              <div className="flex items-center gap-1">
                <Heart size={14} />
                <span>{blessing.view_count}</span>
              </div>
            )}
          </div>
          {blessing.subcategories && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {blessing.subcategories.name}
            </span>
          )}
        </div>
      </Link>

      {showShareButtons && (
        <ShareButtons
          blessing={blessing}
          onClose={() => setShowShareButtons(false)}
        />
      )}
    </>
  )
}