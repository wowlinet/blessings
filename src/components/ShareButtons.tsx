'use client'

import { useState } from 'react'
import { Blessing } from '@/types'
import { 
  X, 
  Facebook, 
  Twitter, 
  MessageCircle, 
  Linkedin, 
  Copy, 
  Check,
  ExternalLink,
  Share2
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ShareButtonsProps {
  blessing: Blessing
  onClose: () => void
}

export default function ShareButtons({ blessing, onClose }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const blessingUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://blessyou.today'}/blessings/${blessing.id}`
  const shareText = `"${blessing.content}" - ${blessing.author || 'BlessYou.Today'}`
  const hashtags = blessing.categories ? `#blessings #${blessing.categories.slug.replace('-', '')}` : '#blessings'

  const trackShare = async (platform: string) => {
    try {
      await supabase.from('share_analytics').insert({
        blessing_id: blessing.id,
        platform,
        shared_at: new Date().toISOString(),
      })

      // Update share count
      const { data: currentBlessing } = await supabase
        .from('blessings')
        .select('share_count')
        .eq('id', blessing.id)
        .single()

      if (currentBlessing) {
        await supabase
          .from('blessings')
          .update({ share_count: (currentBlessing.share_count || 0) + 1 })
          .eq('id', blessing.id)
      }
    } catch (error) {
      console.error('Error tracking share:', error)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(blessingUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      trackShare('copy_link')
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blessingUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(blessingUrl)}&hashtags=${encodeURIComponent(hashtags.replace('#', ''))}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${blessingUrl}`)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(blessingUrl)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(blessingUrl)}&description=${encodeURIComponent(shareText)}&media=${encodeURIComponent(blessing.pinterest_image_url || blessing.og_image_url || '')}`
  }

  const handleShare = (platform: keyof typeof shareUrls) => {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    trackShare(platform)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 max-w-md w-full max-h-[90vh] overflow-y-auto transform animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Header with gradient background */}
        <div className="relative -m-8 mb-6 p-6 pb-8 bg-gradient-to-br from-primary/5 via-amber-50/50 to-orange-50/30 dark:from-gray-700/30 dark:via-gray-600/20 dark:to-gray-700/30 rounded-t-3xl border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 dark:bg-amber-400/20 rounded-xl">
                <Share2 size={20} className="text-primary dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                Share This Blessing
              </h3>
            </div>
            <button
              onClick={onClose}
              className="group p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
            </button>
          </div>
        </div>

        {/* Content Preview with enhanced styling */}
        <div className="blessing-content relative bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-700/50 dark:to-gray-600/30 rounded-2xl p-6 mb-8 border border-gray-200/50 dark:border-gray-600/30 shadow-inner">
          <div className="absolute top-4 left-4 text-4xl text-primary/20 dark:text-amber-400/20 font-serif">"</div>
          <div className="absolute bottom-4 right-4 text-4xl text-primary/20 dark:text-amber-400/20 font-serif rotate-180">"</div>
          
          <p className="text-gray-700 dark:text-gray-200 font-crimson italic text-base leading-relaxed relative z-10 px-4">
            {blessing.content.length > 200 ? blessing.content.substring(0, 200) + '...' : blessing.content}
          </p>
          
          {blessing.author && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-600/30">
              <div className="w-1 h-4 bg-gradient-to-b from-primary to-amber-400 rounded-full"></div>
              <cite className="text-sm text-gray-600 dark:text-gray-300 not-italic font-medium">
                {blessing.author}
              </cite>
            </div>
          )}
        </div>

        {/* Share Buttons with enhanced styling */}
        <div className="space-y-3">
          <button
            onClick={() => handleShare('facebook')}
            className="group w-full flex items-center gap-4 p-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] shadow-md"
          >
            <div className="p-1 bg-white/20 rounded-lg">
              <Facebook size={20} />
            </div>
            <span className="font-medium">Share on Facebook</span>
            <ExternalLink size={16} className="ml-auto opacity-70 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={() => handleShare('twitter')}
            className="group w-full flex items-center gap-4 p-4 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] shadow-md"
          >
            <div className="p-1 bg-white/20 rounded-lg">
              <Twitter size={20} />
            </div>
            <span className="font-medium">Share on Twitter</span>
            <ExternalLink size={16} className="ml-auto opacity-70 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={() => handleShare('whatsapp')}
            className="group w-full flex items-center gap-4 p-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] shadow-md"
          >
            <div className="p-1 bg-white/20 rounded-lg">
              <MessageCircle size={20} />
            </div>
            <span className="font-medium">Share on WhatsApp</span>
            <ExternalLink size={16} className="ml-auto opacity-70 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={() => handleShare('linkedin')}
            className="group w-full flex items-center gap-4 p-4 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] shadow-md"
          >
            <div className="p-1 bg-white/20 rounded-lg">
              <Linkedin size={20} />
            </div>
            <span className="font-medium">Share on LinkedIn</span>
            <ExternalLink size={16} className="ml-auto opacity-70 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={() => handleShare('pinterest')}
            className="group w-full flex items-center gap-4 p-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] shadow-md"
          >
            <div className="p-1 bg-white/20 rounded-lg">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.372 0 12s5.373 12 12 12c6.628 0 12-5.372 12-12S18.628 0 12 0zm0 19c-.721 0-1.418-.109-2.073-.312.286-.465.713-1.227.87-1.835l.437-1.664c.229.436.895.803 1.604.803 2.111 0 3.633-1.941 3.633-4.354 0-2.312-1.888-4.042-4.316-4.042-3.021 0-4.625 2.003-4.625 4.137 0 .695.366 1.56.949 1.836.095.045.146.025.168-.067.017-.063.058-.229.076-.298.025-.093.015-.126-.052-.207-.18-.22-.295-.502-.295-.903 0-1.167.896-2.025 2.067-2.025 1.118 0 1.935.749 1.935 1.816 0 1.194-.528 2.018-1.188 2.018-.364 0-.635-.302-.548-.673.104-.442.307-.92.307-1.24 0-.287-.157-.527-.482-.527-.383 0-.691.387-.691.906 0 .331.115.555.115.555s-.384 1.593-.452 1.879c-.09.38-.057.778-.034 1.126C5.867 18.287 4 15.388 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
              </svg>
            </div>
            <span className="font-medium">Pin on Pinterest</span>
            <ExternalLink size={16} className="ml-auto opacity-70 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={handleCopyLink}
            className={`group w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md ${
              copied 
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white' 
                : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white hover:shadow-lg'
            }`}
          >
            <div className="p-1 bg-white/20 rounded-lg">
              {copied ? (
                <Check size={20} className="text-white" />
              ) : (
                <Copy size={20} />
              )}
            </div>
            <span className="font-medium">{copied ? 'Link Copied!' : 'Copy Link'}</span>
            {copied && (
              <div className="ml-auto flex items-center gap-1">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-white/20 rounded-full animate-pulse delay-150"></div>
              </div>
            )}
          </button>
        </div>

        {/* Enhanced bottom tip */}
        <div className="mt-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-amber-50/50 to-orange-50/30 dark:from-gray-700/20 dark:via-gray-600/10 dark:to-gray-700/20 rounded-2xl"></div>
          <div className="relative p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-1 h-1 bg-primary/40 dark:bg-amber-400/40 rounded-full"></div>
              <div className="w-2 h-1 bg-primary/60 dark:bg-amber-400/60 rounded-full"></div>
              <div className="w-1 h-1 bg-primary/40 dark:bg-amber-400/40 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              Share this blessing to spread joy and inspiration with others
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}