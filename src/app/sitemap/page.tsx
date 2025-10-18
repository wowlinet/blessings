import type { Metadata } from 'next'
import { Map, Home, Search, Heart, User, Info, Mail, Shield, FileText, Cookie, Calendar, Star, Book, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sitemap - Navigate BlessYou.Today',
  description: 'Complete sitemap of BlessYou.Today with all pages, categories, and features. Find exactly what you\'re looking for.',
  keywords: 'sitemap, site navigation, blessing categories, website map, page directory',
  openGraph: {
    title: 'Sitemap - Navigate BlessYou.Today',
    description: 'Complete sitemap of BlessYou.Today with all pages, categories, and features. Find exactly what you\'re looking for.',
    url: 'https://blessyou.today/sitemap',
  },
  twitter: {
    title: 'Sitemap - Navigate BlessYou.Today',
    description: 'Complete sitemap of BlessYou.Today with all pages, categories, and features. Find exactly what you\'re looking for.',
  },
}

export default function SitemapPage() {
  const mainPages = [
    {
      icon: Home,
      title: 'Home',
      url: '/',
      description: 'Welcome page with featured blessings and categories'
    },
    {
      icon: Search,
      title: 'Search',
      url: '/search',
      description: 'Search for specific blessings and content'
    },
    {
      icon: Info,
      title: 'About Us',
      url: '/about',
      description: 'Learn about our mission and story'
    },
    {
      icon: Mail,
      title: 'Contact',
      url: '/contact',
      description: 'Get in touch with our team'
    }
  ]

  const legalPages = [
    {
      icon: Shield,
      title: 'Privacy Policy',
      url: '/privacy',
      description: 'How we protect your privacy and data'
    },
    {
      icon: FileText,
      title: 'Terms of Service',
      url: '/terms',
      description: 'Terms and conditions for using our service'
    },
    {
      icon: Cookie,
      title: 'Cookie Policy',
      url: '/cookies',
      description: 'Information about cookies and tracking'
    },
    {
      icon: Map,
      title: 'Sitemap',
      url: '/sitemap',
      description: 'Complete navigation guide (current page)'
    }
  ]

  const categories = [
    {
      title: 'Daily Blessings',
      slug: 'daily-blessings',
      icon: Calendar,
      description: 'Start and end your day with meaningful blessings',
      subcategories: [
        { name: 'Morning Blessings', slug: 'morning' },
        { name: 'Evening Blessings', slug: 'evening' },
        { name: 'Today\'s Blessing', slug: 'today' }
      ]
    },
    {
      title: 'Birthday Blessings',
      slug: 'birthday-blessings',
      icon: Star,
      description: 'Heartfelt birthday wishes and blessings',
      subcategories: [
        { name: 'For Friends', slug: 'friends' },
        { name: 'For Family', slug: 'family' },
        { name: 'For Kids', slug: 'kids' },
        { name: 'Milestone Ages', slug: 'milestone' }
      ]
    },
    {
      title: 'Wedding & Anniversary Blessings',
      slug: 'wedding-anniversary-blessings',
      icon: Heart,
      description: 'Beautiful blessings for love and commitment',
      subcategories: [
        { name: 'For Bride', slug: 'bride' },
        { name: 'For Groom', slug: 'groom' },
        { name: 'For Parents', slug: 'parents' },
        { name: 'Toast Blessings', slug: 'toast' }
      ]
    },
    {
      title: 'Religious Blessings',
      slug: 'religious-blessings',
      icon: Book,
      description: 'Spiritual blessings from various faith traditions',
      subcategories: [
        { name: 'Christian', slug: 'christian' },
        { name: 'Islamic', slug: 'islamic' },
        { name: 'Jewish', slug: 'jewish' },
        { name: 'Interfaith', slug: 'interfaith' }
      ]
    },
    {
      title: 'Life Events',
      slug: 'life-events',
      icon: User,
      description: 'Blessings for major life milestones',
      subcategories: [
        { name: 'New Baby', slug: 'new-baby' },
        { name: 'Graduation', slug: 'graduation' },
        { name: 'New Job', slug: 'new-job' },
        { name: 'Recovery', slug: 'recovery' }
      ]
    },
    {
      title: 'Holiday Blessings',
      slug: 'holiday-blessings',
      icon: Globe,
      description: 'Seasonal and holiday celebrations',
      subcategories: [
        { name: 'Christmas', slug: 'christmas' },
        { name: 'Easter', slug: 'easter' },
        { name: 'Thanksgiving', slug: 'thanksgiving' },
        { name: 'New Year', slug: 'new-year' }
      ]
    },
    {
      title: 'Sympathy & Healing',
      slug: 'sympathy-healing',
      icon: Heart,
      description: 'Comforting blessings for difficult times',
      subcategories: [
        { name: 'Condolences', slug: 'condolences' },
        { name: 'Illness', slug: 'illness' },
        { name: 'Strength', slug: 'strength' }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="hero-gradient text-amber-900 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-amber-100/30 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Map className="w-8 h-8 text-amber-800" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-crimson mb-6">
            Sitemap
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed opacity-90">
            Navigate through all pages and discover the complete structure of BlessYou.Today
          </p>
        </div>
      </section>

      {/* Main Pages */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold font-crimson text-gray-900 mb-12 text-center">
            Main Pages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mainPages.map((page, index) => {
              const IconComponent = page.icon
              return (
                <a
                  key={index}
                  href={page.url}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-amber-300 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                      <IconComponent className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                      {page.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{page.description}</p>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* Blessing Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold font-crimson text-gray-900 mb-12 text-center">
            Blessing Categories
          </h2>
          <div className="space-y-8">
            {categories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <a
                          href={`/categories/${category.slug}`}
                          className="text-2xl font-bold font-crimson text-gray-900 hover:text-amber-600 transition-colors"
                        >
                          {category.title}
                        </a>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          /{category.slug}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-6">{category.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {category.subcategories.map((sub, subIndex) => (
                          <a
                            key={subIndex}
                            href={`/categories/${category.slug}?subcategory=${sub.slug}`}
                            className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-amber-50 hover:text-amber-700 transition-colors group"
                          >
                            <div className="w-2 h-2 bg-amber-400 rounded-full group-hover:bg-amber-500" />
                            <span className="text-sm font-medium">{sub.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Legal Pages */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold font-crimson text-gray-900 mb-12 text-center">
            Legal & Information Pages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {legalPages.map((page, index) => {
              const IconComponent = page.icon
              return (
                <a
                  key={index}
                  href={page.url}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {page.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{page.description}</p>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-br from-amber-50 to-blue-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold font-crimson text-gray-900 mb-6 text-center">
              How to Navigate Our Site
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Finding Blessings</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                    <span>Browse by category from the homepage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                    <span>Use the search function to find specific content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                    <span>Filter by subcategory within each main category</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                    <span>Check featured blessings on the homepage</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Site Features</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    <span>Share blessings on social media</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    <span>Save favorites to your account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    <span>Copy blessings to clipboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    <span>Mobile-responsive design</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-crimson text-gray-900 mb-6">
            Start Exploring
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Now that you know your way around, discover the perfect blessing for any occasion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Go to Homepage
            </a>
            <a
              href="/search"
              className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-amber-400 hover:text-amber-600 transition-colors"
            >
              Search Blessings
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}