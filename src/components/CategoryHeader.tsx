import { Category, Subcategory } from '@/types'
import { 
  Sun, 
  Gift, 
  Heart, 
  Cross, 
  GraduationCap, 
  TreePine, 
  Flower2 
} from 'lucide-react'

interface CategoryHeaderProps {
  category: Category
  selectedSubcategory?: Subcategory | null
  totalCount: number
}

const categoryIcons = {
  'daily-blessings': Sun,
  'birthday-blessings': Gift,
  'wedding-anniversary-blessings': Heart,
  'religious-blessings': Cross,
  'life-events': GraduationCap,
  'holiday-blessings': TreePine,
  'sympathy-healing': Flower2,
}

export default function CategoryHeader({ category, selectedSubcategory, totalCount }: CategoryHeaderProps) {
  const IconComponent = categoryIcons[category.slug as keyof typeof categoryIcons] || Sun

  return (
    <section className="bg-gradient-to-r from-amber-400 to-blue-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <IconComponent className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Crimson Text', serif" }}>
              {selectedSubcategory ? selectedSubcategory.name : category.name}
            </h1>
            <p className="text-lg opacity-90 mt-2">
              {selectedSubcategory ? selectedSubcategory.description : category.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm opacity-80">
          <span>{totalCount} blessings available</span>
          <span>•</span>
          <span>{category.subcategories?.length || 0} subcategories</span>
          <span>•</span>
          <span>3 content types</span>
        </div>

        {/* Breadcrumb */}
        <nav className="mt-6 text-sm">
          <ol className="flex items-center gap-2 opacity-80">
            <li>
              <a href="/" className="hover:text-white/80 transition-colors">
                Home
              </a>
            </li>
            <li>/</li>
            <li>
              <a href="/categories" className="hover:text-white/80 transition-colors">
                Categories
              </a>
            </li>
            <li>/</li>
            <li>
              {selectedSubcategory ? (
                <>
                  <a 
                    href={`/categories/${category.slug}`} 
                    className="hover:text-white/80 transition-colors"
                  >
                    {category.name}
                  </a>
                  <span className="mx-2">/</span>
                  <span className="text-white font-medium">{selectedSubcategory.name}</span>
                </>
              ) : (
                <span className="text-white font-medium">{category.name}</span>
              )}
            </li>
          </ol>
        </nav>
      </div>
    </section>
  )
}