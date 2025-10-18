import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { Category, Blessing } from '@/types'
import HeroSection from '@/components/HeroSection'
import CategoryNavigation from '@/components/CategoryNavigation'
import TrendingBlessings from '@/components/TrendingBlessings'

export const metadata: Metadata = {
  title: 'BlessYou.Today - Beautiful Blessings for Every Occasion',
  description: 'Discover heartfelt blessings, prayers, and inspirational messages for daily life, birthdays, weddings, holidays, and special moments. Share meaningful blessings with loved ones.',
  keywords: 'blessings, prayers, inspirational messages, daily blessings, birthday blessings, wedding blessings, holiday blessings, religious blessings',
  openGraph: {
    title: 'BlessYou.Today - Beautiful Blessings for Every Occasion',
    description: 'Discover heartfelt blessings, prayers, and inspirational messages for daily life, birthdays, weddings, holidays, and special moments.',
    url: 'https://blessyou.today',
    siteName: 'BlessYou.Today',
    images: [
      {
        url: '/api/og-image/home',
        width: 1200,
        height: 630,
        alt: 'BlessYou.Today - Beautiful Blessings for Every Occasion',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlessYou.Today - Beautiful Blessings for Every Occasion',
    description: 'Discover heartfelt blessings, prayers, and inspirational messages for daily life, birthdays, weddings, holidays, and special moments.',
    images: ['/api/og-image/home'],
  },
}

async function getCategories(): Promise<Category[]> {
  const { data: categories, error } = await supabase
    .from('categories')
    .select(`
      *,
      subcategories (*)
    `)
    .eq('is_active', true)
    .order('sort_order')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return categories || []
}

async function getFeaturedBlessings(): Promise<Blessing[]> {
  const { data: blessings, error } = await supabase
    .from('blessings')
    .select(`
      *,
      categories (name, slug),
      subcategories (name, slug)
    `)
    .eq('is_featured', true)
    .eq('is_active', true)
    .limit(3)

  if (error) {
    console.error('Error fetching featured blessings:', error)
    return []
  }

  return blessings || []
}

async function getTrendingBlessings(): Promise<Blessing[]> {
  const { data: blessings, error } = await supabase
    .from('blessings')
    .select(`
      *,
      categories (name, slug),
      subcategories (name, slug)
    `)
    .eq('is_active', true)
    .order('share_count', { ascending: false })
    .limit(6)

  if (error) {
    console.error('Error fetching trending blessings:', error)
    return []
  }

  return blessings || []
}

export default async function HomePage() {
  const [categories, featuredBlessings, trendingBlessings] = await Promise.all([
    getCategories(),
    getFeaturedBlessings(),
    getTrendingBlessings(),
  ])

  return (
    <main className="min-h-screen">
      <HeroSection featuredBlessings={featuredBlessings} />
      <TrendingBlessings blessings={trendingBlessings} />
      <CategoryNavigation categories={categories} />
    </main>
  )
}