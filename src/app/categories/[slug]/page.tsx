import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Category, Subcategory, Blessing } from '@/types'
import CategoryHeader from '@/components/CategoryHeader'
import SubcategoryTabs from '@/components/SubcategoryTabs'
import BlessingGrid from '@/components/BlessingGrid'
import FilterSidebar from '@/components/FilterSidebar'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ 
    subcategory?: string
    content_type?: string
    page?: string
  }>
}

async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data: category, error } = await supabase
    .from('categories')
    .select(`
      *,
      subcategories (*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching category:', error)
    return null
  }

  return category
}

async function getBlessingsByCategory(
  categoryId: string,
  subcategorySlug?: string,
  contentType?: string,
  page: number = 1,
  limit: number = 12
): Promise<{ blessings: Blessing[], totalCount: number }> {
  let query = supabase
    .from('blessings')
    .select(`
      *,
      categories (name, slug),
      subcategories (name, slug)
    `, { count: 'exact' })
    .eq('category_id', categoryId)
    .eq('is_active', true)

  if (subcategorySlug) {
    const { data: subcategory } = await supabase
      .from('subcategories')
      .select('id')
      .eq('slug', subcategorySlug)
      .eq('category_id', categoryId)
      .single()

    if (subcategory) {
      query = query.eq('subcategory_id', subcategory.id)
    }
  }

  if (contentType && ['short', 'long', 'image'].includes(contentType)) {
    query = query.eq('content_type', contentType)
  }

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data: blessings, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching blessings:', error)
    return { blessings: [], totalCount: 0 }
  }

  return { 
    blessings: blessings || [], 
    totalCount: count || 0 
  }
}

export async function generateMetadata({ params, searchParams }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  
  if (!category) {
    return {
      title: 'Category Not Found | BlessYou.Today',
      description: 'The requested category could not be found.',
    }
  }

  const resolvedSearchParams = await searchParams
  const subcategory = resolvedSearchParams.subcategory 
    ? category.subcategories?.find(sub => sub.slug === resolvedSearchParams.subcategory)
    : null

  const title = subcategory 
    ? `${subcategory.name} ${category.name} | BlessYou.Today`
    : `${category.name} | BlessYou.Today`
  
  const description = subcategory
    ? `Find heartfelt ${subcategory.name.toLowerCase()} ${category.name.toLowerCase()} blessings. ${subcategory.description}`
    : `Discover beautiful ${category.name.toLowerCase()} for every occasion. ${category.description}`

  return {
    title,
    description,
    keywords: `${category.seo_keywords}${subcategory ? `, ${subcategory.seo_keywords}` : ''}`,
    openGraph: {
      title,
      description,
      url: subcategory 
        ? `https://blessyou.today/categories/${category.slug}?subcategory=${subcategory.slug}`
        : `https://blessyou.today/categories/${category.slug}`,
      siteName: 'BlessYou.Today',
      images: [
        {
          url: `/api/og-image/category/${category.slug}${subcategory ? `/${subcategory.slug}` : ''}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og-image/category/${category.slug}${subcategory ? `/${subcategory.slug}` : ''}`],
    },
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const category = await getCategoryBySlug(slug)
  
  if (!category) {
    notFound()
  }

  const page = parseInt(resolvedSearchParams.page || '1', 10)
  const { blessings, totalCount } = await getBlessingsByCategory(
    category.id,
    resolvedSearchParams.subcategory,
    resolvedSearchParams.content_type,
    page
  )

  const selectedSubcategory = resolvedSearchParams.subcategory 
    ? category.subcategories?.find(sub => sub.slug === resolvedSearchParams.subcategory)
    : null

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CategoryHeader 
        category={category} 
        selectedSubcategory={selectedSubcategory}
        totalCount={totalCount}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8 bg-transparent dark:bg-gray-900">
        <SubcategoryTabs 
          category={category}
          selectedSubcategory={resolvedSearchParams.subcategory}
          selectedContentType={resolvedSearchParams.content_type}
        />
        
        <div className="flex gap-8 mt-8">
          <FilterSidebar 
            categorySlug={category.slug}
          />
          
          <div className="flex-1 bg-transparent dark:bg-gray-900">
            <BlessingGrid 
              blessings={blessings}
              totalCount={totalCount}
              currentPage={page}
              totalPages={Math.ceil(totalCount / 12)}
              categorySlug={category.slug}
            />
          </div>
        </div>
      </div>
    </main>
  )
}