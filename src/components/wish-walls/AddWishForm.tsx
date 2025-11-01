'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Send, Sparkles, User } from 'lucide-react'
import { createWallWish } from '@/lib/wish-walls'
import { supabase } from '@/lib/supabase'
import type { WallWish, WallTheme } from '@/types/wish-walls'

interface AddWishFormProps {
  wallId: string
  onWishAdded: (wish: WallWish) => void
  theme: WallTheme
}

const themeColors = {
  flower: 'from-pink-500 to-rose-500',
  star: 'from-blue-600 to-purple-600',
  gift: 'from-amber-500 to-orange-500'
}

const suggestedWishes = [
  'Wishing you all the happiness in the world! 🌟',
  'May all your dreams come true! ✨',
  'Sending you love and warm wishes! 💖',
  'Hope your day is filled with joy! 🎉',
  'You deserve all the best things in life! 🌈',
  'May this special day bring you endless blessings! 🙏'
]

export default function AddWishForm({ wallId, onWishAdded, theme }: AddWishFormProps) {
  const [content, setContent] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [emoji, setEmoji] = useState('💖')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user?.user_metadata?.full_name) {
        setAuthorName(user.user_metadata.full_name)
      }
    })
  }, [])

  const handleSuggestedWish = () => {
    const randomWish = suggestedWishes[Math.floor(Math.random() * suggestedWishes.length)]
    setContent(randomWish)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast.error('Please write a wish message')
      return
    }

    if (!isAnonymous && !authorName.trim()) {
      toast.error('Please enter your name or choose to post anonymously')
      return
    }

    setLoading(true)

    try {
      const wish = await createWallWish({
        wall_id: wallId,
        author_name: isAnonymous ? 'Anonymous' : authorName.trim(),
        content: content.trim(),
        emoji,
        is_anonymous: isAnonymous,
        user_id: user?.id
      })

      // Clear form
      setContent('')
      if (!user) {
        setAuthorName('')
      }
      setEmoji('💖')

      onWishAdded(wish)
    } catch (error) {
      console.error('Error adding wish:', error)
      toast.error('Failed to add wish. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const gradientClass = themeColors[theme]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${gradientClass} flex items-center justify-center`}>
          <Sparkles className="text-white" size={20} />
        </div>
        <h3 className="text-xl font-bold font-crimson text-gray-900 dark:text-gray-100">
          Send Your Wish
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Name {!isAnonymous && <span className="text-red-500">*</span>}
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                disabled={isAnonymous}
                placeholder="Enter your name"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                required={!isAnonymous}
              />
            </div>
            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isAnonymous
                  ? 'bg-gray-800 dark:bg-gray-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Anonymous
            </button>
          </div>
        </div>

        {/* Wish Message */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Your Wish <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={handleSuggestedWish}
              className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium flex items-center gap-1"
            >
              <Sparkles size={12} />
              Suggest a wish
            </button>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="Write your heartfelt wish here..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all resize-none"
            required
          />
        </div>

        {/* Emoji Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Choose an Emoji
          </label>
          <div className="flex gap-2 flex-wrap">
            {['💖', '🌟', '🎉', '🌈', '✨', '🙏', '🎂', '🎁', '💐', '🦋'].map((emojiOption) => (
              <button
                key={emojiOption}
                type="button"
                onClick={() => setEmoji(emojiOption)}
                className={`text-2xl p-2 rounded-lg transition-all ${
                  emoji === emojiOption
                    ? 'bg-amber-100 dark:bg-amber-900/30 scale-110'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {emojiOption}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-gradient-to-r ${gradientClass} hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={18} />
              Send Wish
            </>
          )}
        </button>
      </form>
    </div>
  )
}
