import Link from 'next/link'
import { Category } from '@/types'
import { 
  Sun, 
  Gift, 
  Heart, 
  Cross, 
  GraduationCap, 
  TreePine, 
  Flower2 
} from 'lucide-react'

interface CategoryNavigationProps {
  categories: Category[]
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

export default function CategoryNavigation({ categories }: CategoryNavigationProps) {
  return (
    <section className="py-16 px-4 bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-crimson">
            Explore Blessing Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect blessing for every occasion and moment in life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = categoryIcons[category.slug as keyof typeof categoryIcons] || Sun
            const subcategoryCount = category.subcategories?.length || 0
            
            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group bg-white rounded-2xl p-6 card-shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors duration-300">
                    {category.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-auto">
                    <span>{subcategoryCount} subcategories</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}