import { Metadata } from 'next'
import CreateWishWallForm from '@/components/wish-walls/CreateWishWallForm'

export const metadata: Metadata = {
  title: 'Create Wish Wall - BlessYou.Today',
  description: 'Create a beautiful wish wall to collect heartfelt blessings from friends and family for any special occasion.',
  openGraph: {
    title: 'Create Wish Wall - BlessYou.Today',
    description: 'Create a beautiful wish wall to collect heartfelt blessings from friends and family for any special occasion.',
  },
}

export default function CreateWishWallPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50/30 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-crimson text-gray-900 dark:text-gray-100 mb-4">
            Create Your Wish Wall
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Collect heartfelt blessings and wishes from your loved ones for any special occasion.
            Share the wall link and watch the love pour in! 💌
          </p>
        </div>

        {/* Form */}
        <CreateWishWallForm />
      </div>
    </div>
  )
}
