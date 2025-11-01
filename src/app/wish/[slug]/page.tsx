import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getWishWallBySlug } from '@/lib/wish-walls'
import WishWallView from '@/components/wish-walls/WishWallView'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const wall = await getWishWallBySlug(slug)

    return {
      title: `${wall.title} - Wish Wall`,
      description: wall.opening_message,
      openGraph: {
        title: wall.title,
        description: wall.opening_message,
        images: wall.cover_image_url ? [wall.cover_image_url] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: wall.title,
        description: wall.opening_message,
        images: wall.cover_image_url ? [wall.cover_image_url] : [],
      },
    }
  } catch (error) {
    return {
      title: 'Wish Wall Not Found',
      description: 'This wish wall could not be found.',
    }
  }
}

export default async function WishWallPage({ params }: PageProps) {
  const { slug } = await params

  try {
    const wall = await getWishWallBySlug(slug)
    return <WishWallView wall={wall} />
  } catch (error) {
    notFound()
  }
}
