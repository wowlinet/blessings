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

const categoryColors = {
  'daily-blessings': { 
    bg: 'bg-blue-100', 
    text: 'text-blue-600', 
    hover: 'group-hover:bg-blue-200',
    darkBg: 'dark:bg-blue-900/30',
    darkText: 'dark:text-blue-400',
    darkHover: 'dark:group-hover:bg-blue-900/50'
  },
  'birthday-blessings': { 
    bg: 'bg-blue-100', 
    text: 'text-blue-600', 
    hover: 'group-hover:bg-blue-200',
    darkBg: 'dark:bg-blue-900/30',
    darkText: 'dark:text-blue-400',
    darkHover: 'dark:group-hover:bg-blue-900/50'
  },
  'wedding-anniversary-blessings': { 
    bg: 'bg-green-100', 
    text: 'text-green-600', 
    hover: 'group-hover:bg-green-200',
    darkBg: 'dark:bg-green-900/30',
    darkText: 'dark:text-green-400',
    darkHover: 'dark:group-hover:bg-green-900/50'
  },
  'holiday-blessings': { 
    bg: 'bg-orange-100', 
    text: 'text-orange-600', 
    hover: 'group-hover:bg-orange-200',
    darkBg: 'dark:bg-orange-900/30',
    darkText: 'dark:text-orange-400',
    darkHover: 'dark:group-hover:bg-orange-900/50'
  },
  'sympathy-healing': { 
    bg: 'bg-gray-100', 
    text: 'text-gray-600', 
    hover: 'group-hover:bg-gray-200',
    darkBg: 'dark:bg-gray-700/30',
    darkText: 'dark:text-gray-400',
    darkHover: 'dark:group-hover:bg-gray-700/50'
  },
  'life-events': { 
    bg: 'bg-yellow-100', 
    text: 'text-yellow-600', 
    hover: 'group-hover:bg-yellow-200',
    darkBg: 'dark:bg-yellow-900/30',
    darkText: 'dark:text-yellow-400',
    darkHover: 'dark:group-hover:bg-yellow-900/50'
  },
  'religious-blessings': { 
    bg: 'bg-emerald-100', 
    text: 'text-emerald-600', 
    hover: 'group-hover:bg-emerald-200',
    darkBg: 'dark:bg-emerald-900/30',
    darkText: 'dark:text-emerald-400',
    darkHover: 'dark:group-hover:bg-emerald-900/50'
  },
  'love-romance': { 
    bg: 'bg-pink-100', 
    text: 'text-pink-600', 
    hover: 'group-hover:bg-pink-200',
    darkBg: 'dark:bg-pink-900/30',
    darkText: 'dark:text-pink-400',
    darkHover: 'dark:group-hover:bg-pink-900/50'
  },
  'motivational': { 
    bg: 'bg-indigo-100', 
    text: 'text-indigo-600', 
    hover: 'group-hover:bg-indigo-200',
    darkBg: 'dark:bg-indigo-900/30',
    darkText: 'dark:text-indigo-400',
    darkHover: 'dark:group-hover:bg-indigo-900/50'
  },
}

export default function CategoryNavigation({ categories }: CategoryNavigationProps) {
  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-white mb-4 font-crimson">
            Explore Blessing Categories
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find the perfect blessing for every occasion and moment in life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = categoryIcons[category.slug as keyof typeof categoryIcons] || Sun
            const colors = categoryColors[category.slug as keyof typeof categoryColors] || categoryColors['daily-blessings']
            const subcategoryCount = category.subcategories?.length || 0
            
            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 card-shadow hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-gray-700/20 transition-all duration-300 hover:-translate-y-1 border border-transparent dark:border-gray-700 dark:hover:border-gray-600"
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 ${colors.bg} ${colors.darkBg} rounded-full flex items-center justify-center mb-4 ${colors.hover} ${colors.darkHover} transition-colors duration-300`}>
                    <IconComponent className={`w-8 h-8 ${colors.text} ${colors.darkText}`} />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-amber-400 transition-colors duration-300">
                    {category.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-auto">
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