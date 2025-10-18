import type { Metadata } from 'next'
import { Heart, Users, Globe, Star, Award, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us - Our Mission to Spread Blessings',
  description: 'Learn about BlessYou.Today\'s mission to spread love, hope, and positivity through heartfelt blessings for every moment in life. Discover our story and values.',
  keywords: 'about us, mission, blessings, inspirational messages, company story, values',
  openGraph: {
    title: 'About Us - Our Mission to Spread Blessings',
    description: 'Learn about BlessYou.Today\'s mission to spread love, hope, and positivity through heartfelt blessings for every moment in life.',
    url: 'https://blessyou.today/about',
  },
  twitter: {
    title: 'About Us - Our Mission to Spread Blessings',
    description: 'Learn about BlessYou.Today\'s mission to spread love, hope, and positivity through heartfelt blessings for every moment in life.',
  },
}

export default function AboutPage() {
  const stats = [
    { icon: Heart, label: 'Blessings Shared', value: '50,000+' },
    { icon: Users, label: 'Happy Users', value: '25,000+' },
    { icon: Globe, label: 'Countries Reached', value: '150+' },
    { icon: Star, label: 'User Rating', value: '4.9/5' },
  ]

  const values = [
    {
      icon: Heart,
      title: 'Love & Compassion',
      description: 'We believe in the power of love to heal, inspire, and transform lives. Every blessing we share comes from a place of genuine care and compassion.'
    },
    {
      icon: Shield,
      title: 'Authenticity',
      description: 'Our blessings are carefully crafted to be genuine, meaningful, and respectful of all cultures and beliefs. We maintain the highest standards of quality.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We foster a global community of people who believe in spreading positivity and supporting one another through life\'s journey.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from the quality of our content to the user experience we provide.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="hero-gradient text-amber-900 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-amber-100/30 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-amber-800 fill-current" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-crimson mb-6">
            About BlessYou.Today
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed opacity-90">
            Spreading love, hope, and positivity through heartfelt blessings for every moment in life
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-crimson text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  BlessYou.Today was born from a simple yet powerful belief: that words have the power to heal, inspire, and transform lives. In a world that often feels divided and challenging, we recognized the need for a platform dedicated to spreading positivity and hope.
                </p>
                <p>
                  Founded in 2023, our platform began as a small collection of heartfelt blessings and has grown into a comprehensive resource serving thousands of people worldwide. We've carefully curated blessings for every occasion, from daily inspiration to life's most significant moments.
                </p>
                <p>
                  What started as a personal mission to share positivity has evolved into a global community of people who believe in the power of kind words and meaningful connections. Every day, we're honored to be part of your journey, providing the perfect words when you need them most.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-amber-100 to-blue-100 rounded-2xl p-8 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-amber-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-12 h-12 text-white fill-current" />
                </div>
                <h3 className="text-2xl font-bold font-crimson text-gray-900 mb-4">
                  Our Mission
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  To create a world where everyone has access to meaningful, heartfelt blessings that inspire hope, spread love, and bring people together across all cultures and beliefs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-crimson text-gray-900 mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do and shape the way we serve our community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <div key={index} className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-crimson text-gray-900 mb-6">
              Our Commitment
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to maintaining the highest quality standards and continuously improving our platform to better serve you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quality Assurance</h3>
              <p className="text-gray-700">
                Every blessing is carefully reviewed and curated to ensure it meets our high standards for quality, authenticity, and respect.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Community Focus</h3>
              <p className="text-gray-700">
                We listen to our community and continuously evolve based on your feedback and needs, ensuring we serve you better every day.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Global Reach</h3>
              <p className="text-gray-700">
                We're proud to serve people from all walks of life, cultures, and beliefs, creating a truly inclusive platform for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-gray-900 dark:bg-gray-900 dark:text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-crimson mb-6">
            Join Our Community
          </h2>
          <p className="text-xl mb-8 leading-relaxed">
            Become part of our growing community of people who believe in spreading love, hope, and positivity through meaningful blessings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/search"
              className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
            >
              Explore Blessings
            </a>
            <a
              href="/contact"
              className="border-2 border-gray-300 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-amber-600 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}