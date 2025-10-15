import Link from 'next/link'
import { Blessing } from '@/types'
import { Share2, Heart, Eye } from 'lucide-react'
import BlessingCard from './BlessingCard'

interface TrendingBlessingsProps {
  blessings: Blessing[]
}

export default function TrendingBlessings({ blessings }: TrendingBlessingsProps) {
  if (!blessings.length) {
    return null
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-crimson">
            Trending Blessings
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the most loved and shared blessings from our community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {blessings.map((blessing) => (
            <BlessingCard key={blessing.id} blessing={blessing} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-medium transition-colors duration-300"
          >
            Explore All Blessings
          </Link>
        </div>
      </div>
    </section>
  )
}