'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Send, Sparkles, User, X } from 'lucide-react'
import { createWallWish } from '@/lib/wish-walls'
import { supabase } from '@/lib/supabase'
import type { WallWish, WallTheme } from '@/types/wish-walls'

interface AddWishModalProps {
  wallId: string
  theme: WallTheme
  onWishAdded: (wish: WallWish) => void
  onClose: () => void
}

const themeGradients = {
  flower: 'from-pink-500 to-rose-500',
  star: 'from-blue-600 to-purple-600',
  gift: 'from-amber-500 to-orange-500'
}

const themeBackgrounds = {
  flower: 'from-pink-50/50 to-rose-50/50',
  star: 'from-blue-50/50 to-purple-50/50',
  gift: 'from-amber-50/50 to-orange-50/50'
}

const themeRingColors = {
  flower: '#ec4899',
  star: '#3b82f6',
  gift: '#f59e0b'
}

const suggestedWishes = [
  'Wishing you all the happiness in the world! 🌟',
  'May all your dreams come true! ✨',
  'Sending you love and warm wishes! 💖',
  'Hope your day is filled with joy! 🎉',
  'You deserve all the best things in life! 🌈',
  'May this special day bring you endless blessings! 🙏'
]

export default function AddWishModal({ wallId, theme, onWishAdded, onClose }: AddWishModalProps) {
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

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
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

      onWishAdded(wish)
    } catch (error) {
      console.error('Error adding wish:', error)
      toast.error('Failed to add wish. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const gradientClass = themeGradients[theme]
  const bgGradient = themeBackgrounds[theme]
  const ringColor = themeRingColors[theme]

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className={`relative -m-px p-8 pb-10 bg-gradient-to-br ${bgGradient} dark:from-gray-700/30 dark:via-gray-600/20 dark:to-gray-700/30 rounded-t-3xl border-b border-gray-200 dark:border-gray-700`}>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-full transition-all"
          >
            <X size={24} className="text-gray-600 dark:text-gray-400" />
          </button>

          <div className="flex items-center gap-4 mb-3">
            <div className={`p-3 bg-gradient-to-r ${gradientClass} rounded-xl shadow-lg`}>
              <Sparkles className="text-white" size={28} />
            </div>
            <h3 className="text-3xl font-bold font-crimson text-gray-900 dark:text-gray-100">
              Send Your Wish
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 ml-16">
            Share your heartfelt blessings and warm wishes 💖
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Your Name {!isAnonymous && <span className="text-red-500">*</span>}
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  disabled={isAnonymous}
                  placeholder="Enter your name"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    '--tw-ring-color': ringColor,
                  } as React.CSSProperties}
                  required={!isAnonymous}
                />
              </div>
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`px-6 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                  isAnonymous
                    ? `bg-gradient-to-r ${gradientClass} text-white shadow-lg`
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Anonymous
              </button>
            </div>
          </div>

          {/* Wish Message */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Your Wish <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleSuggestedWish}
                className={`text-xs font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${gradientClass} text-white hover:opacity-90 transition-opacity`}
              >
                <Sparkles size={14} />
                Suggest a wish
              </button>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              placeholder="Write your heartfelt wish here..."
              className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none font-crimson text-lg leading-relaxed"
              style={{
                '--tw-ring-color': ringColor,
              } as React.CSSProperties}
              required
            />
          </div>

          {/* Emoji Picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Choose an Emoji
            </label>
            <div className="flex gap-2 flex-wrap">
              {['💖', '🌟', '🎉', '🌈', '✨', '🙏', '🎂', '🎁', '💐', '🦋', '🌸', '⭐', '🎊', '💝', '🌺', '🎈'].map((emojiOption) => (
                <button
                  key={emojiOption}
                  type="button"
                  onClick={() => setEmoji(emojiOption)}
                  className={`text-3xl p-3 rounded-xl transition-all ${
                    emoji === emojiOption
                      ? `bg-gradient-to-br ${bgGradient} scale-110 shadow-lg ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800`
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'
                  }`}
                  style={emoji === emojiOption ? {
                    '--tw-ring-color': ringColor,
                  } as React.CSSProperties : undefined}
                >
                  {emojiOption}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 bg-gradient-to-r ${gradientClass} hover:opacity-90 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 shadow-lg`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Send Wish
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
