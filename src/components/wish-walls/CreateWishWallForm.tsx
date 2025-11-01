'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Cake, Star, Gift, Globe, Lock, Link as LinkIcon, Upload, Sparkles } from 'lucide-react'
import { createWishWall, generateUniqueSlug, slugify } from '@/lib/wish-walls'
import { supabase } from '@/lib/supabase'
import type { WallTheme, WallPrivacy } from '@/types/wish-walls'

const themes = [
  { value: 'flower' as WallTheme, label: 'Flowers', icon: '🎂', color: 'from-pink-500 to-rose-500' },
  { value: 'star' as WallTheme, label: 'Starry Night', icon: '🌌', color: 'from-blue-600 to-purple-600' },
  { value: 'gift' as WallTheme, label: 'Gift Box', icon: '🎁', color: 'from-amber-500 to-orange-500' }
]

const privacyOptions = [
  { value: 'public' as WallPrivacy, label: 'Public', description: 'Anyone can find and view', icon: Globe },
  { value: 'link_only' as WallPrivacy, label: 'Link Only', description: 'Only people with the link can view', icon: LinkIcon },
  { value: 'private' as WallPrivacy, label: 'Private', description: 'Only you can view', icon: Lock }
]

export default function CreateWishWallForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [theme, setTheme] = useState<WallTheme>('flower')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [openingMessage, setOpeningMessage] = useState('Send me your warmest wishes and blessings! 💖')
  const [privacy, setPrivacy] = useState<WallPrivacy>('link_only')
  const [creatorName, setCreatorName] = useState('')
  const [creatorSignature, setCreatorSignature] = useState('')

  // Check user authentication
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user?.user_metadata?.full_name) {
        setCreatorName(user.user_metadata.full_name)
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('Please enter a title for your wish wall')
      return
    }

    if (!creatorName.trim()) {
      toast.error('Please enter your name')
      return
    }

    setLoading(true)

    try {
      // Generate slug from title
      const baseSlug = slugify(title)
      const uniqueSlug = await generateUniqueSlug(baseSlug)

      console.log('Creating wish wall with data:', {
        title: title.trim(),
        slug: uniqueSlug,
        theme,
        cover_image_url: coverImageUrl || undefined,
        opening_message: openingMessage.trim(),
        privacy,
        creator_name: creatorName.trim(),
        creator_signature: creatorSignature.trim() || undefined,
        user_id: user?.id
      })

      // Create wish wall
      const wall = await createWishWall({
        title: title.trim(),
        slug: uniqueSlug,
        theme,
        cover_image_url: coverImageUrl || undefined,
        opening_message: openingMessage.trim(),
        privacy,
        creator_name: creatorName.trim(),
        creator_signature: creatorSignature.trim() || undefined,
        user_id: user?.id
      })

      toast.success('Wish wall created successfully! 🎉')
      router.push(`/wish/${wall.slug}`)
    } catch (error: any) {
      console.error('Error creating wish wall:', error)
      const errorMessage = error?.message || error?.toString() || 'Failed to create wish wall. Please try again.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
      {/* Title */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Wish Wall Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Happy Birthday Mom! or Congratulations Sarah!"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all"
          required
        />
      </div>

      {/* Theme Selection */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Choose a Theme <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((themeOption) => (
            <button
              key={themeOption.value}
              type="button"
              onClick={() => setTheme(themeOption.value)}
              className={`relative p-6 rounded-xl border-2 transition-all ${
                theme === themeOption.value
                  ? 'border-amber-500 dark:border-amber-400 bg-amber-50 dark:bg-amber-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="text-4xl mb-2">{themeOption.icon}</div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">{themeOption.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Cover Image (Optional) */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Cover Image URL (Optional)
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all"
          />
          <button
            type="button"
            className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Upload image"
          >
            <Upload size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Opening Message */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Opening Message <span className="text-red-500">*</span>
        </label>
        <textarea
          value={openingMessage}
          onChange={(e) => setOpeningMessage(e.target.value)}
          rows={3}
          placeholder="Write a welcoming message for your visitors..."
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all resize-none"
          required
        />
      </div>

      {/* Privacy Settings */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Privacy Settings <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          {privacyOptions.map((option) => {
            const IconComponent = option.icon
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setPrivacy(option.value)}
                className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                  privacy === option.value
                    ? 'border-amber-500 dark:border-amber-400 bg-amber-50 dark:bg-amber-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className={`mt-0.5 ${privacy === option.value ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400 dark:text-gray-500'}`}>
                  <IconComponent size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{option.label}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{option.description}</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  privacy === option.value
                    ? 'border-amber-500 dark:border-amber-400 bg-amber-500 dark:bg-amber-400'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {privacy === option.value && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Creator Info */}
      <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Your Information</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Signature (Optional)
            </label>
            <input
              type="text"
              value={creatorSignature}
              onChange={(e) => setCreatorSignature(e.target.value)}
              placeholder="A short message or quote"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Creating Your Wish Wall...
          </>
        ) : (
          <>
            <Sparkles size={20} />
            Create Wish Wall
          </>
        )}
      </button>

      {/* Info Text */}
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
        After creating, you&apos;ll receive a unique link to share with friends and family
      </p>
    </form>
  )
}
