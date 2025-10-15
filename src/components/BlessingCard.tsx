'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Blessing } from '@/types'
import { Share2, Heart, Copy, Check } from 'lucide-react'
import ShareButtons from './ShareButtons'

interface BlessingCardProps {
  blessing: Blessing
  showCategory?: boolean
}

export default function BlessingCard({ blessing, showCategory = true }: BlessingCardProps) {
  const [showShareModal, setShowShareModal] = useState(false)
  const [copied, setCopied] = useState(false)

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
    setShowShareModal(true)
  }

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'short':
        return 'bg-green-100 text-green-800'
      case 'long':
        return 'bg-blue-100 text-blue-800'
      case 'image':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
        href={`/blessing/${blessing.id}`}
        className="group block bg-white rounded-2xl p-6 card-shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getContentTypeColor(blessing.content_type)}`}>
              {getContentTypeLabel(blessing.content_type)}
            </span>
            {showCategory && blessing.categories && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                {blessing.categories.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              title="Copy blessing"
            >
              {copied ? (
                <Check size={16} className="text-green-600" />
              ) : (
                <Copy size={16} className="text-gray-500" />
              )}
            </button>
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              title="Share blessing"
            >
              <Share2 size={16} className="text-gray-500" />
            </button>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-3 group-hover:text-primary transition-colors duration-300">
          {blessing.title}
        </h3>

        <div className="blessing-content mb-4">
          <p className="text-gray-600 leading-relaxed font-crimson">
            &ldquo;{truncatedContent}&rdquo;
          </p>
          {blessing.author && (
            <cite className="block mt-2 text-sm text-gray-500 not-italic">
              — {blessing.author}
            </cite>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
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
            <span className="text-xs text-gray-400">
              {blessing.subcategories.name}
            </span>
          )}
        </div>
      </Link>

      {showShareModal && (
        <ShareButtons
          blessing={blessing}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </>
  )
}