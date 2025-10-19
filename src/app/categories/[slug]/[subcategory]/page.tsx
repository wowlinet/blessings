import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Category, Subcategory, Blessing } from '@/types'
import CategoryHeader from '@/components/CategoryHeader'
import SubcategoryTabs from '@/components/SubcategoryTabs'
import BlessingGrid from '@/components/BlessingGrid'
import FilterSidebar from '@/components/FilterSidebar'

interface SubcategoryPageProps {
  params: Promise<{ slug: string; subcategory: string }>
  searchParams: Promise<{ 
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

async function getSubcategoryBySlug(categoryId: string, subcategorySlug: string): Promise<Subcategory | null> {
  const { data: subcategory, error } = await supabase
    .from('subcategories')
    .select('*')
    .eq('slug', subcategorySlug)
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching subcategory:', error)
    return null
  }

  return subcategory
}

async function getBlessingsBySubcategory(
  categoryId: string,
  subcategoryId: string,
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
    .eq('subcategory_id', subcategoryId)
    .eq('is_active', true)

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

export async function generateMetadata({ params, searchParams }: SubcategoryPageProps): Promise<Metadata> {
  const { slug, subcategory: subcategorySlug } = await params
  const category = await getCategoryBySlug(slug)
  
  if (!category) {
    return {
      title: 'Category Not Found | BlessYou.Today',
      description: 'The requested category could not be found.',
    }
  }

  const subcategory = await getSubcategoryBySlug(category.id, subcategorySlug)
  
  if (!subcategory) {
    return {
      title: 'Subcategory Not Found | BlessYou.Today',
      description: 'The requested subcategory could not be found.',
    }
  }

  // 优先使用 seo_title，回退到原有逻辑
  const title = `${subcategory.seo_title} - BlessYou.Today` || `${subcategory.name} ${category.name} - BlessYou.Today`
  
  // 优先使用 seo_description，回退到原有逻辑
  const description = subcategory.seo_description || `Find heartfelt ${subcategory.name.toLowerCase()} ${category.name.toLowerCase()} blessings. ${subcategory.description || ''}`

  return {
    title,
    description,
    keywords: `${category.seo_keywords}, ${subcategory.seo_keywords || ''}`,
    openGraph: {
      title,
      description,
      url: `https://blessyou.today/categories/${category.slug}/${subcategory.slug}`,
      siteName: 'BlessYou.Today',
      images: [
        {
          url: `/api/og-image/category/${category.slug}/${subcategory.slug}`,
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
      images: [`/api/og-image/category/${category.slug}/${subcategory.slug}`],
    },
  }
}

export default async function SubcategoryPage({ params, searchParams }: SubcategoryPageProps) {
  const { slug, subcategory: subcategorySlug } = await params
  const resolvedSearchParams = await searchParams
  const category = await getCategoryBySlug(slug)
  
  if (!category) {
    notFound()
  }

  const subcategory = await getSubcategoryBySlug(category.id, subcategorySlug)
  
  if (!subcategory) {
    notFound()
  }

  const page = parseInt(resolvedSearchParams.page || '1', 10)
  const { blessings, totalCount } = await getBlessingsBySubcategory(
    category.id,
    subcategory.id,
    resolvedSearchParams.content_type,
    page
  )

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CategoryHeader 
        category={category} 
        selectedSubcategory={subcategory}
        totalCount={totalCount}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8 bg-transparent dark:bg-gray-900">
        <SubcategoryTabs 
          category={category}
          selectedSubcategory={subcategory.slug}
          selectedContentType={resolvedSearchParams.content_type}
        />
        
        <div className="flex gap-8 mt-8">
          <FilterSidebar 
            categorySlug={category.slug}
            subcategorySlug={subcategory.slug}
          />
          
          <div className="flex-1 bg-transparent dark:bg-gray-900">
            <BlessingGrid 
              blessings={blessings}
              totalCount={totalCount}
              currentPage={page}
              totalPages={Math.ceil(totalCount / 12)}
              categorySlug={category.slug}
              subcategorySlug={subcategory.slug}
            />
          </div>
        </div>
      </div>
    </main>
  )
}