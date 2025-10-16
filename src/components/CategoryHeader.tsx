import { Category, Subcategory } from '@/types'
import { 
  Sun, 
  Gift, 
  Heart, 
  Users, 
  Calendar, 
  Sparkles, 
  Baby, 
  GraduationCap,
  Briefcase,
  Home as HomeIcon,
  Plane,
  Utensils
} from 'lucide-react'

const categoryIcons = {
  'daily-blessings': Sun,
  'special-occasions': Gift,
  'love-relationships': Heart,
  'family-friends': Users,
  'seasonal-holidays': Calendar,
  'spiritual-religious': Sparkles,
  'life-milestones': Baby,
  'education-career': GraduationCap,
  'work-business': Briefcase,
  'home-family': HomeIcon,
  'travel-adventure': Plane,
  'food-gratitude': Utensils,
}

interface CategoryHeaderProps {
  category: Category
  selectedSubcategory?: Subcategory | null
  totalCount: number
}

export default function CategoryHeader({ category, selectedSubcategory, totalCount }: CategoryHeaderProps) {
  const IconComponent = categoryIcons[category.slug as keyof typeof categoryIcons] || Sun

  return (
    <section className="hero-gradient text-amber-900 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-amber-100/30 backdrop-blur-sm rounded-full flex items-center justify-center">
            <IconComponent className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-crimson">
              {selectedSubcategory ? selectedSubcategory.name : category.name}
            </h1>
            <p className="text-lg opacity-80 mt-2">
              {selectedSubcategory ? selectedSubcategory.description : category.description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6 text-sm opacity-70">
          <span>{totalCount} blessings available</span>
          <span>•</span>
          <span>{category.subcategories?.length || 0} subcategories</span>
          <span>•</span>
          <span>3 content types</span>
        </div>

        <nav className="mt-6 text-sm">
          <ol className="flex items-center gap-2 opacity-70">
            <li>
              <a href="/" className="hover:opacity-60 transition-opacity">
                Home
              </a>
            </li>
            <li>/</li>
            <li>
              <a href="/categories" className="hover:opacity-60 transition-opacity">
                Categories
              </a>
            </li>
            <li>/</li>
            <li>
              {selectedSubcategory ? (
                <>
                  <a 
                    href={`/categories/${category.slug}`} 
                    className="hover:opacity-60 transition-opacity"
                  >
                    {category.name}
                  </a>
                  <span className="mx-2">/</span>
                  <span className="text-amber-800 font-medium">{selectedSubcategory.name}</span>
                </>
              ) : (
                <span className="text-amber-800 font-medium">{category.name}</span>
              )}
            </li>
          </ol>
        </nav>
      </div>
    </section>
  )
}