'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Share2, Copy, Check, Eye, MessageCircle, Sparkles, Send } from 'lucide-react'
import type { WishWall, WallWish } from '@/types/wish-walls'
import { getWallWishes, incrementWallViewCount } from '@/lib/wish-walls'
import { supabase } from '@/lib/supabase'
import WishItem from './WishItem'
import AddWishModal from './AddWishModal'
import ShareWallButtons from './ShareWallButtons'

interface WishWallViewProps {
  wall: WishWall
}

const themeBackgrounds = {
  flower: 'bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 dark:from-pink-900/20 dark:via-rose-900/20 dark:to-pink-800/20',
  star: 'bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-indigo-800/20',
  gift: 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-800/20'
}

const themeAccents = {
  flower: 'text-pink-600 dark:text-pink-400',
  star: 'text-blue-600 dark:text-blue-400',
  gift: 'text-amber-600 dark:text-amber-400'
}

const themeGradients = {
  flower: 'from-pink-500 to-rose-500',
  star: 'from-blue-600 to-purple-600',
  gift: 'from-amber-500 to-orange-500'
}

const themeDecorations = {
  flower: '🌸',
  star: '⭐',
  gift: '🎁'
}

export default function WishWallView({ wall }: WishWallViewProps) {
  const [wishes, setWishes] = useState<WallWish[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showAddWishModal, setShowAddWishModal] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Check user authentication
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Increment view count
    incrementWallViewCount(wall.id)

    // Load wishes
    loadWishes()
  }, [wall.id])

  const loadWishes = async () => {
    try {
      const data = await getWallWishes(wall.id, user?.id)
      setWishes(data)
    } catch (error) {
      console.error('Error loading wishes:', error)
      toast.error('Failed to load wishes')
    } finally {
      setLoading(false)
    }
  }

  const handleWishAdded = (newWish: WallWish) => {
    setWishes([newWish, ...wishes])
    setShowAddWishModal(false)
    toast.success('Your wish has been added! 🎉')
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/wish/${wall.slug}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('Link copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const bgClass = themeBackgrounds[wall.theme]
  const accentClass = themeAccents[wall.theme]
  const gradientClass = themeGradients[wall.theme]
  const decoration = themeDecorations[wall.theme]

  return (
    <div className={`min-h-screen ${bgClass} py-8 md:py-12 relative`}>
      <div className="max-w-6xl mx-auto px-4 pb-24">
        {/* Hero Header Section */}
        <div className="text-center mb-12 relative">
          {/* Decorative elements */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-6xl opacity-20 animate-pulse">
            {decoration}
          </div>

          <h1 className={`text-5xl md:text-7xl font-bold font-crimson mb-6 ${accentClass} relative z-10`}>
            {wall.title}
          </h1>

          <div className="max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 italic font-crimson leading-relaxed">
              &ldquo;{wall.opening_message}&rdquo;
            </p>
          </div>

          {/* Creator Badge */}
          <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className={`w-10 h-10 bg-gradient-to-br ${gradientClass} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
              {wall.creator_name[0].toUpperCase()}
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                {wall.creator_name}
              </div>
              {wall.creator_signature && (
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {wall.creator_signature}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Wishes Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className={`h-px flex-1 bg-gradient-to-r ${gradientClass} opacity-30`} />
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-md">
              <Sparkles className={accentClass} size={20} />
              <h2 className="text-xl font-bold font-crimson text-gray-900 dark:text-gray-100">
                Wishes & Blessings
              </h2>
            </div>
            <div className={`h-px flex-1 bg-gradient-to-l ${gradientClass} opacity-30`} />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className={`w-12 h-12 border-4 border-gray-300 dark:border-gray-600 rounded-full animate-spin`}
                   style={{ borderTopColor: wall.theme === 'flower' ? '#ec4899' : wall.theme === 'star' ? '#3b82f6' : '#f59e0b' }} />
            </div>
          ) : wishes.length === 0 ? (
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-16 text-center">
              <div className="text-7xl mb-6 animate-bounce">{decoration}</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                No wishes yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Be the first to send a heartfelt wish!
              </p>
              <button
                onClick={() => setShowAddWishModal(true)}
                className={`bg-gradient-to-r ${gradientClass} text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-all inline-flex items-center gap-2`}
              >
                <Send size={18} />
                Send First Wish
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishes.map((wish) => (
                <WishItem
                  key={wish.id}
                  wish={wish}
                  theme={wall.theme}
                  onUpdate={loadWishes}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-row gap-3 z-40">
        {/* Send Wish Button - Always expanded */}
        <button
          onClick={() => setShowAddWishModal(true)}
          className={`group bg-gradient-to-r ${gradientClass} text-white shadow-2xl hover:shadow-3xl transition-all duration-500 ease-out flex items-center gap-3 font-semibold text-lg rounded-full px-6 py-4 cursor-pointer`}
        >
          <Send size={24} className="flex-shrink-0 group-hover:rotate-12 transition-transform duration-500" />
          <span className="whitespace-nowrap">
            Send Your Wish
          </span>
        </button>

        {/* Share Wall Button - Expands on hover */}
        <button
          onClick={() => setShowShareModal(true)}
          className={`group bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-2xl hover:shadow-3xl transition-all duration-500 ease-out flex items-center gap-3 font-semibold text-lg rounded-full overflow-hidden w-14 hover:w-auto px-4 py-4 cursor-pointer`}
        >
          <Share2 size={24} className="flex-shrink-0 transition-transform duration-500" />
          <span className="whitespace-nowrap max-w-0 group-hover:max-w-xs transition-all duration-500 ease-out opacity-0 group-hover:opacity-100">
            Share Wall
          </span>
        </button>
      </div>

      {/* Add Wish Modal */}
      {showAddWishModal && (
        <AddWishModal
          wallId={wall.id}
          theme={wall.theme}
          onWishAdded={handleWishAdded}
          onClose={() => setShowAddWishModal(false)}
        />
      )}

      {/* Share Modal */}
      {showShareModal && (
        <ShareWallButtons
          wall={wall}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  )
}
