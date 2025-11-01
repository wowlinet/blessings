'use client'

import { useState, useEffect } from 'react'
import { Heart, MessageCircle, Send } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import type { WallWish, WallTheme } from '@/types/wish-walls'
import { toggleWishLike, createWallWishReply } from '@/lib/wish-walls'
import { supabase } from '@/lib/supabase'

interface WishItemProps {
  wish: WallWish
  theme: WallTheme
  onUpdate: () => void
}

const themeStyles = {
  flower: {
    card: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-2 border-pink-200 dark:border-pink-900/30 shadow-lg hover:shadow-pink-200/50 dark:hover:shadow-pink-900/30',
    accent: 'text-pink-600 dark:text-pink-400',
    button: 'hover:bg-pink-50 dark:hover:bg-pink-900/20',
    gradient: 'from-pink-500 to-rose-500',
    decoration: '🌸'
  },
  star: {
    card: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-2 border-blue-200 dark:border-blue-900/30 shadow-lg hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30',
    accent: 'text-blue-600 dark:text-blue-400',
    button: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
    gradient: 'from-blue-600 to-purple-600',
    decoration: '⭐'
  },
  gift: {
    card: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-2 border-amber-200 dark:border-amber-900/30 shadow-lg hover:shadow-amber-200/50 dark:hover:shadow-amber-900/30',
    accent: 'text-amber-600 dark:text-amber-400',
    button: 'hover:bg-amber-50 dark:hover:bg-amber-900/20',
    gradient: 'from-amber-500 to-orange-500',
    decoration: '🎁'
  }
}

export default function WishItem({ wish, theme, onUpdate }: WishItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [replyName, setReplyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user?.user_metadata?.full_name) {
        setReplyName(user.user_metadata.full_name)
      }
    })
  }, [])

  const handleLike = async () => {
    try {
      const ipAddress = user?.id ? undefined : 'guest'
      await toggleWishLike(wish.id, user?.id, ipAddress)
      onUpdate()
    } catch (error) {
      console.error('Error toggling like:', error)
      toast.error('Failed to like wish')
    }
  }

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!replyContent.trim() || !replyName.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)

    try {
      await createWallWishReply({
        wish_id: wish.id,
        author_name: replyName.trim(),
        content: replyContent.trim(),
        user_id: user?.id
      })

      setReplyContent('')
      setShowReplyForm(false)
      onUpdate()
      toast.success('Reply added!')
    } catch (error) {
      console.error('Error adding reply:', error)
      toast.error('Failed to add reply')
    } finally {
      setLoading(false)
    }
  }

  const style = themeStyles[theme]
  const timeAgo = formatDistanceToNow(new Date(wish.created_at), { addSuffix: true })

  return (
    <div className={`${style.card} rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden group`}>
      {/* Decorative corner */}
      <div className={`absolute -top-2 -right-2 text-4xl opacity-20 group-hover:scale-110 transition-transform`}>
        {style.decoration}
      </div>

      {/* Wish Content - Redesigned for vertical layout */}
      <div className="relative z-10">
        {/* Header with Emoji and Author */}
        <div className="flex items-center gap-3 mb-4">
          {/* Compact Emoji */}
          <div className={`relative flex-shrink-0`}>
            <div className={`w-10 h-10 bg-gradient-to-br ${style.gradient} rounded-xl flex items-center justify-center text-2xl shadow-md transform group-hover:rotate-12 transition-transform`}>
              {wish.emoji || '💖'}
            </div>
            {/* Floating animation effect */}
            {theme === 'flower' && (
              <div className="absolute -top-1 -right-1 text-sm animate-bounce">🌺</div>
            )}
            {theme === 'star' && (
              <div className="absolute -top-1 -right-1 text-sm animate-pulse">✨</div>
            )}
            {theme === 'gift' && (
              <div className="absolute -top-1 -right-1 text-sm animate-bounce">🎀</div>
            )}
          </div>

          {/* Author Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                {wish.author_name}
              </span>
              {wish.is_anonymous && (
                <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full font-medium">
                  Anonymous
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{timeAgo}</span>
          </div>
        </div>

        {/* Main Content - Highlighted */}
        <div className="relative mb-4">
          <p className="text-gray-900 dark:text-gray-100 leading-relaxed text-lg font-crimson whitespace-pre-wrap min-h-[80px]">
            {wish.content}
          </p>
        </div>

        {/* Image if present */}
        {wish.image_url && (
          <img
            src={wish.image_url}
            alt="Wish attachment"
            className="mt-3 rounded-xl w-full object-cover shadow-md max-h-48"
          />
        )}
      </div>

      {/* Actions - Hidden by default, shown on hover */}
      <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm ${
            wish.is_liked
              ? `${style.accent} bg-opacity-10`
              : `text-gray-600 dark:text-gray-400 ${style.button}`
          }`}
        >
          <Heart
            size={16}
            className={wish.is_liked ? 'fill-current' : ''}
          />
          <span className="text-xs font-semibold">{wish.like_count || 0}</span>
        </button>

        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-400 ${style.button} transition-all text-sm`}
        >
          <MessageCircle size={16} />
          <span className="text-xs font-semibold">{wish.reply_count || 0}</span>
        </button>
      </div>

      {/* Replies */}
      {wish.replies && wish.replies.length > 0 && (
        <div className="mt-6 space-y-3 pt-4 border-t border-gray-200/50 dark:border-gray-600/50">
          {wish.replies.map((reply) => (
            <div key={reply.id} className="bg-gray-50/80 dark:bg-gray-700/50 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 dark:border-gray-600/50">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                  {reply.author_name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{reply.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Reply Form */}
      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="mt-6 space-y-3 pt-4 border-t border-gray-200/50 dark:border-gray-600/50">
          <input
            type="text"
            value={replyName}
            onChange={(e) => setReplyName(e.target.value)}
            placeholder="Your name"
            className="w-full px-3 py-2 text-sm rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:border-transparent transition-all"
            required
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 px-3 py-2 text-sm rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:border-transparent transition-all"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-lg bg-gradient-to-r ${style.gradient} text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 shadow-md`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
