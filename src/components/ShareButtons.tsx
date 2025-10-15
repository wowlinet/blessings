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
  ExternalLink
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ShareButtonsProps {
  blessing: Blessing
  onClose: () => void
}

export default function ShareButtons({ blessing, onClose }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const blessingUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://blessyou.today'}/blessing/${blessing.id}`
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Share This Blessing</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="blessing-content bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-gray-700 font-crimson italic text-sm leading-relaxed">
            &ldquo;{blessing.content.length > 200 ? blessing.content.substring(0, 200) + '...' : blessing.content}&rdquo;
          </p>
          {blessing.author && (
            <cite className="block mt-2 text-xs text-gray-500 not-italic">
              — {blessing.author}
            </cite>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleShare('facebook')}
            className="w-full flex items-center gap-3 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            <Facebook size={20} />
            <span>Share on Facebook</span>
            <ExternalLink size={16} className="ml-auto" />
          </button>

          <button
            onClick={() => handleShare('twitter')}
            className="w-full flex items-center gap-3 p-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors duration-200"
          >
            <Twitter size={20} />
            <span>Share on Twitter</span>
            <ExternalLink size={16} className="ml-auto" />
          </button>

          <button
            onClick={() => handleShare('whatsapp')}
            className="w-full flex items-center gap-3 p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
          >
            <MessageCircle size={20} />
            <span>Share on WhatsApp</span>
            <ExternalLink size={16} className="ml-auto" />
          </button>

          <button
            onClick={() => handleShare('linkedin')}
            className="w-full flex items-center gap-3 p-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors duration-200"
          >
            <Linkedin size={20} />
            <span>Share on LinkedIn</span>
            <ExternalLink size={16} className="ml-auto" />
          </button>

          <button
            onClick={() => handleShare('pinterest')}
            className="w-full flex items-center gap-3 p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.372 0 12s5.373 12 12 12c6.628 0 12-5.372 12-12S18.628 0 12 0zm0 19c-.721 0-1.418-.109-2.073-.312.286-.465.713-1.227.87-1.835l.437-1.664c.229.436.895.803 1.604.803 2.111 0 3.633-1.941 3.633-4.354 0-2.312-1.888-4.042-4.316-4.042-3.021 0-4.625 2.003-4.625 4.137 0 .695.366 1.56.949 1.836.095.045.146.025.168-.067.017-.063.058-.229.076-.298.025-.093.015-.126-.052-.207-.18-.22-.295-.502-.295-.903 0-1.167.896-2.025 2.067-2.025 1.118 0 1.935.749 1.935 1.816 0 1.194-.528 2.018-1.188 2.018-.364 0-.635-.302-.548-.673.104-.442.307-.92.307-1.24 0-.287-.157-.527-.482-.527-.383 0-.691.387-.691.906 0 .331.115.555.115.555s-.384 1.593-.452 1.879c-.09.38-.057.778-.034 1.126C5.867 18.287 4 15.388 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
            </svg>
            <span>Pin on Pinterest</span>
            <ExternalLink size={16} className="ml-auto" />
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
          >
            {copied ? (
              <Check size={20} className="text-green-400" />
            ) : (
              <Copy size={20} />
            )}
            <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
          </button>
        </div>

        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            Share this blessing to spread joy and inspiration with others
          </p>
        </div>
      </div>
    </div>
  )
}