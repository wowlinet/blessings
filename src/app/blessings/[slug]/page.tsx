import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBlessingBySlug } from '@/lib/supabase'
import BlessingDetail from '@/components/BlessingDetail'
import RelatedBlessings from '@/components/RelatedBlessings'

interface BlessingPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BlessingPageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const blessing = await getBlessingBySlug(slug)
    
    if (!blessing) {
      return {
        title: 'Blessing Not Found - BlessYou.Today',
        description: 'The blessing you are looking for could not be found.',
      }
    }

    const description = blessing.meta_description || 
      `${blessing.content.substring(0, 150)}...`

    return {
      title: blessing.meta_title || `${blessing.title} - BlessYou.Today`,
      description,
      keywords: blessing.meta_keywords,
      openGraph: {
        title: blessing.title,
        description,
        type: 'article',
        publishedTime: blessing.created_at,
        authors: blessing.author ? [blessing.author] : undefined,
        tags: blessing.meta_keywords?.split(',').map((k: string) => k.trim()),
      },
      twitter: {
        card: 'summary_large_image',
        title: blessing.title,
        description,
      },
      alternates: {
        canonical: `/blessings/${blessing.slug}`,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Blessing - BlessYou.Today',
      description: 'A heartfelt blessing from BlessYou.Today',
    }
  }
}

export default async function BlessingPage({ params }: BlessingPageProps) {
  try {
    const { slug } = await params
    const blessing = await getBlessingBySlug(slug)
    
    if (!blessing) {
      notFound()
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-4xl mx-auto px-4 py-8">
          <BlessingDetail blessing={blessing} />
          <div className="mt-12">
            <RelatedBlessings 
              currentBlessingId={blessing.id}
              categorySlug={blessing.category?.slug}
              subcategorySlug={blessing.subcategory?.slug}
            />
          </div>
        </main>
      </div>
    )
  } catch (error) {
    console.error('Error loading blessing:', error)
    notFound()
  }
}