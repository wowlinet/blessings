'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
  Heart, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Mail,
  Sun,
  Gift,
  Cross,
  GraduationCap,
  TreePine,
  Flower2,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  // Newsletter subscription state
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Handle newsletter subscription
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset error state
    setError('')
    
    // Validate email
    if (!email.trim()) {
      setError('Please enter your email address')
      toast.error('Please enter your email address')
      return
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      toast.error('Please enter a valid email address')
      return
    }
    
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Success
      setIsSubmitted(true)
      setEmail('')
      toast.success('Successfully subscribed! Thank you for your interest. We will regularly send you beautiful blessings.')
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 3000)
      
    } catch (error) {
      setError('Subscription failed, please try again later')
      toast.error('Subscription failed, please try again later')
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [
    { name: 'Daily Blessings', slug: 'daily-blessings', icon: Sun },
    { name: 'Birthday Blessings', slug: 'birthday-blessings', icon: Gift },
    { name: 'Wedding & Anniversary', slug: 'wedding-anniversary-blessings', icon: Heart },
    { name: 'Religious Blessings', slug: 'religious-blessings', icon: Cross },
    { name: 'Life Events', slug: 'life-events', icon: GraduationCap },
    { name: 'Holiday Blessings', slug: 'holiday-blessings', icon: TreePine },
    { name: 'Sympathy & Healing', slug: 'sympathy-healing', icon: Flower2 },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-current" />
              </div>
              <span className="text-xl font-bold font-crimson">
                BlessYou.Today
              </span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Spreading love, hope, and positivity through heartfelt blessings for every moment in life.
            </p>
            
            {/* Social Media */}
            <div className="flex items-center gap-4">
              <a 
                href="https://facebook.com/blessyoutoday" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com/blessyoutoday" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com/blessyoutoday" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com/blessyoutoday" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-primary transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.slice(0, 4).map((category) => (
                <li key={category.slug}>
                  <Link 
                    href={`/categories/${category.slug}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">More Categories</h3>
            <ul className="space-y-2">
              {categories.slice(4).map((category) => (
                <li key={category.slug}>
                  <Link 
                    href={`/categories/${category.slug}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  href="/search"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Search All Blessings
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="/sitemap"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold mb-2 text-white">Stay Blessed</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Get daily blessings and inspirational messages delivered to your inbox.
            </p>
            
            {isSubmitted ? (
              <div className="flex items-center justify-center gap-3 p-4 bg-green-900/30 border border-green-700/50 rounded-xl backdrop-blur-sm">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-300 font-medium">Successfully subscribed! Thank you for your interest</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSubscribe(e)
                        }
                      }}
                      placeholder="Enter your email address"
                      disabled={isLoading}
                      className={`w-full px-4 py-3 bg-gray-800/80 backdrop-blur-sm border rounded-xl 
                        text-white placeholder-gray-400 transition-all duration-300
                        focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
                        focus:bg-gray-800 focus:shadow-lg focus:shadow-primary/10
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${error ? 'border-red-500/50 bg-red-900/20' : 'border-gray-700/50 hover:border-gray-600/50'}
                      `}
                    />
                    {error && (
                      <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-red-400 text-sm">
                        <AlertCircle className="w-3 h-3" />
                        <span>{error}</span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading || !email.trim()}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 
                      flex items-center justify-center gap-2 min-w-[120px] shadow-lg border
                      ${isLoading || !email.trim()
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed border-gray-600'
                        : 'cursor-pointer bg-gradient-to-r from-primary to-secondary text-white border-primary hover:from-primary-dark hover:to-secondary-dark hover:shadow-xl hover:shadow-primary/20 hover:scale-105 active:scale-95 active:border-primary'
                      }
                    `}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        <span>Subscribe</span>
                      </>
                    )}
                  </button>
                </div>
                
                {error && <div className="h-6"></div>}
              </form>
            )}
            
            <p className="text-xs text-gray-500 mt-4">
              We promise to protect your privacy and will not share your email address with third parties
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} BlessYou.Today. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}