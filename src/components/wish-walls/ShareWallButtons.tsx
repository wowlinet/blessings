'use client'

import { useState } from 'react'
import { X, Facebook, Twitter, MessageCircle, Linkedin, Copy, Check, Share2 } from 'lucide-react'
import type { WishWall } from '@/types/wish-walls'

interface ShareWallButtonsProps {
  wall: WishWall
  onClose: () => void
}

export default function ShareWallButtons({ wall, onClose }: ShareWallButtonsProps) {
  const [copied, setCopied] = useState(false)

  const wallUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://blessyou.today'}/wish/${wall.slug}`

  // 不同平台的分享文案，突出祝福墙主题
  const shareTexts = {
    default: `🎉 ${wall.title}\n\n${wall.opening_message}\n\nSend your wishes and blessings here! 💖`,
    twitter: `🎉 ${wall.title}\n\n${wall.opening_message}\n\nSend your wishes! 💖`,
    facebook: `${wall.title}\n\n${wall.opening_message}`,
    whatsapp: `🎉 *${wall.title}*\n\n${wall.opening_message}\n\nSend your wishes and blessings! 💖`,
    linkedin: `${wall.title} - ${wall.opening_message}`,
    pinterest: `${wall.title} - ${wall.opening_message} | Send your wishes and blessings! 💖`
  }

  const handleCopyLink = async () => {
    try {
      // 复制链接时也复制分享文案
      const textToCopy = `${shareTexts.default}\n\n${wallUrl}`
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(wallUrl)}&quote=${encodeURIComponent(shareTexts.facebook)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareTexts.twitter}\n\n${wallUrl}`)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareTexts.whatsapp}\n\n${wallUrl}`)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(wallUrl)}&summary=${encodeURIComponent(shareTexts.linkedin)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(wallUrl)}&description=${encodeURIComponent(shareTexts.pinterest)}&media=${encodeURIComponent(wall.cover_image_url || 'https://blessyou.today/og-image.jpg')}`
  }

  const handleShare = (platform: keyof typeof shareUrls) => {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 max-w-md w-full max-h-[90vh] overflow-y-auto transform animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="relative -m-8 mb-6 p-6 pb-8 bg-gradient-to-br from-amber-50 via-orange-50/50 to-yellow-50/30 dark:from-gray-700/30 dark:via-gray-600/20 dark:to-gray-700/30 rounded-t-3xl border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 dark:bg-amber-400/20 rounded-xl">
                <Share2 size={20} className="text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Share Your Wish Wall
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

        {/* Share Preview */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-700/50 dark:to-gray-600/30 rounded-2xl p-6 mb-8 border border-gray-200/50 dark:border-gray-600/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="text-2xl">🎉</div>
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Share Preview
            </div>
          </div>
          <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">{wall.title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">{wall.opening_message}</p>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
            Send your wishes and blessings! 💖
          </p>
        </div>

        {/* Share Buttons */}
        <div className="flex flex-row gap-2 justify-center overflow-hidden mb-6">
          <button
            onClick={() => handleShare('facebook')}
            className="group w-12 hover:w-36 flex items-center justify-start overflow-hidden px-3 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] active:w-36 shadow-md"
          >
            <div className="p-1 bg-white/20 rounded-lg flex-shrink-0">
              <Facebook size={18} />
            </div>
            <span className="font-medium text-sm scale-0 group-hover:scale-100 group-active:scale-100 ml-2 whitespace-nowrap transition-all duration-300 ease-in-out origin-left">Facebook</span>
          </button>

          <button
            onClick={() => handleShare('twitter')}
            className="group w-12 hover:w-36 flex items-center justify-start overflow-hidden px-3 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-2xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] active:w-36 shadow-md"
          >
            <div className="p-1 bg-white/20 rounded-lg flex-shrink-0">
              <Twitter size={18} />
            </div>
            <span className="font-medium text-sm scale-0 group-hover:scale-100 group-active:scale-100 ml-2 whitespace-nowrap transition-all duration-300 ease-in-out origin-left">Twitter</span>
          </button>

          <button
            onClick={() => handleShare('whatsapp')}
            className="group w-12 hover:w-36 flex items-center justify-start overflow-hidden px-3 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-2xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] active:w-36 shadow-md"
          >
            <div className="p-1 bg-white/20 rounded-lg flex-shrink-0">
              <MessageCircle size={18} />
            </div>
            <span className="font-medium text-sm scale-0 group-hover:scale-100 group-active:scale-100 ml-2 whitespace-nowrap transition-all duration-300 ease-in-out origin-left">WhatsApp</span>
          </button>

          <button
            onClick={() => handleShare('linkedin')}
            className="group w-12 hover:w-36 flex items-center justify-start overflow-hidden px-3 py-3 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white rounded-2xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] active:w-36 shadow-md"
          >
            <div className="p-1 bg-white/20 rounded-lg flex-shrink-0">
              <Linkedin size={18} />
            </div>
            <span className="font-medium text-sm scale-0 group-hover:scale-100 group-active:scale-100 ml-2 whitespace-nowrap transition-all duration-300 ease-in-out origin-left">LinkedIn</span>
          </button>
        </div>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className={`w-full p-4 rounded-xl border-2 transition-all ${
            copied
              ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-500 bg-gray-50 dark:bg-gray-700/50'
          }`}
        >
          <div className="flex items-center gap-3">
            {copied ? (
              <Check size={20} className="text-green-600 dark:text-green-400" />
            ) : (
              <Copy size={20} className="text-gray-600 dark:text-gray-400" />
            )}
            <div className="flex-1 text-left">
              <div className={`font-semibold ${copied ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'}`}>
                {copied ? 'Link Copied!' : 'Copy Link'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {wallUrl}
              </div>
            </div>
          </div>
        </button>

        {/* Bottom Tip */}
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/30">
          <p className="text-sm text-amber-800 dark:text-amber-300 text-center">
            💡 Share this link with friends and family to collect their wishes!
          </p>
        </div>
      </div>
    </div>
  )
}
