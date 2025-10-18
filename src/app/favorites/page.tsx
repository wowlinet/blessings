import { Metadata } from 'next'
import { Suspense } from 'react'
import FavoritesPage from '@/components/FavoritesPage'

export const metadata: Metadata = {
  title: 'My Favorites - BlessYou.Today',
  description: 'Manage and browse your favorite blessings, quickly find content you love',
  keywords: 'favorites, blessings, personal collection, blessing management',
}

export default function Favorites() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FavoritesPage />
    </Suspense>
  )
}