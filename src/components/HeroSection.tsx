'use client'

import { useState, useEffect } from 'react'
import { Blessing } from '@/types'
import { Heart, Share2 } from 'lucide-react'
import ShareButtons from './ShareButtons'

interface HeroSectionProps {
  featuredBlessings: Blessing[]
}

export default function HeroSection({ featuredBlessings }: HeroSectionProps) {
  const [currentBlessingIndex, setCurrentBlessingIndex] = useState(0)
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    if (featuredBlessings.length > 1) {
      const interval = setInterval(() => {
        setCurrentBlessingIndex((prev) => (prev + 1) % featuredBlessings.length)
      }, 8000) // Change blessing every 8 seconds

      return () => clearInterval(interval)
    }
  }, [featuredBlessings.length])

  if (!featuredBlessings.length) {
    return (
      <section className="hero-gradient min-h-[60vh] flex items-center justify-center text-amber-900">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-crimson">
            Welcome to BlessYou.Today
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
            Discover beautiful blessings for every moment of life
          </p>
        </div>
      </section>
    )
  }

  const currentBlessing = featuredBlessings[currentBlessingIndex]

  return (
    <section className="hero-gradient min-h-[70vh] flex items-center justify-center text-amber-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF7E0]/30 via-[#FFE6B3]/20 to-[#FFD89B]/10"></div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-8">
          <span className="inline-block bg-amber-100/60 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4 text-amber-800">
            Today&apos;s Featured Blessing
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 font-crimson leading-tight">
            {currentBlessing.title}
          </h1>
        </div>

        <div className="blessing-content bg-amber-50/40 backdrop-blur-sm rounded-2xl p-8 md:p-12 mb-8 border border-amber-200/30">
          <blockquote className="text-lg md:text-xl leading-relaxed font-crimson italic">
            &ldquo;{currentBlessing.content}&rdquo;
          </blockquote>
          {currentBlessing.author && (
            <cite className="block mt-4 text-sm opacity-70 not-italic text-amber-700">
              — {currentBlessing.author}
            </cite>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={() => setShowShareModal(true)}
            className="cursor-pointer flex items-center gap-2 bg-amber-100/50 hover:bg-amber-100/70 backdrop-blur-sm px-6 py-3 rounded-full transition-all duration-300 border border-amber-200/40 text-amber-800"
          >
            <Share2 size={18} />
            Share This Blessing
          </button>
          
          <div className="flex items-center gap-2 text-sm opacity-70 text-amber-700">
            <Heart size={16} />
            <span>{currentBlessing.share_count || 0} shares</span>
          </div>
        </div>

        {featuredBlessings.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {featuredBlessings.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBlessingIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentBlessingIndex
                    ? 'bg-amber-800'
                    : 'bg-amber-600/60 hover:bg-amber-700/80'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {showShareModal && (
        <ShareButtons
          blessing={currentBlessing}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </section>
  )
}