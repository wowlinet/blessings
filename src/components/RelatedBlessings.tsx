import { getBlessings } from '@/lib/supabase'
import BlessingCard from './BlessingCard'

interface RelatedBlessingsProps {
  currentBlessingId: string
  categorySlug?: string
  subcategorySlug?: string
}

export default async function RelatedBlessings({ 
  currentBlessingId, 
  categorySlug, 
  subcategorySlug 
}: RelatedBlessingsProps) {
  try {
    // First try to get blessings from the same subcategory
    let relatedBlessings: any[] = []
    
    if (subcategorySlug) {
      const subcategoryResults = await getBlessings({
        subcategory_id: subcategorySlug,
        limit: 4
      })
      relatedBlessings = Array.isArray(subcategoryResults) 
        ? subcategoryResults.filter(b => b.id !== currentBlessingId)
        : []
    }
    
    // If we don't have enough from subcategory, get from category
    if (relatedBlessings.length < 3 && categorySlug) {
      const categoryResults = await getBlessings({
        category_id: categorySlug,
        limit: 6
      })
      const categoryBlessings = Array.isArray(categoryResults)
        ? categoryResults.filter(b => 
            b.id !== currentBlessingId && 
            !relatedBlessings.some(rb => rb.id === b.id)
          )
        : []
      relatedBlessings = [...relatedBlessings, ...categoryBlessings].slice(0, 3)
    }
    
    // If still not enough, get featured blessings
    if (relatedBlessings.length < 3) {
      const featuredResults = await getBlessings({
        is_featured: true,
        limit: 6
      })
      const featuredBlessings = Array.isArray(featuredResults)
        ? featuredResults.filter(b => 
            b.id !== currentBlessingId && 
            !relatedBlessings.some(rb => rb.id === b.id)
          )
        : []
      relatedBlessings = [...relatedBlessings, ...featuredBlessings].slice(0, 3)
    }

    if (relatedBlessings.length === 0) {
      return null
    }

    return (
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold font-crimson text-gray-800 mb-6">
          Related Blessings
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedBlessings.map((blessing) => (
            <BlessingCard key={blessing.id} blessing={blessing} />
          ))}
        </div>
        
        {categorySlug && (
          <div className="mt-6 text-center">
            <a
              href={`/categories/${categorySlug}`}
              className="inline-flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              View All in This Category
            </a>
          </div>
        )}
      </section>
    )
  } catch (error) {
    console.error('Error loading related blessings:', error)
    return null
  }
}