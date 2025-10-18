import type { Metadata } from 'next'
import { Cookie, Shield, Settings, Eye, Clock, Globe, Info, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cookie Policy - BlessYou.Today',
  description: 'Learn about how BlessYou.Today uses cookies to enhance your browsing experience and protect your privacy.',
  keywords: 'cookie policy, cookies, privacy, tracking, website functionality, user experience',
  openGraph: {
    title: 'Cookie Policy - BlessYou.Today',
    description: 'Learn about how BlessYou.Today uses cookies to enhance your browsing experience and protect your privacy.',
    url: 'https://blessyou.today/cookies',
  },
  twitter: {
    title: 'Cookie Policy - BlessYou.Today',
    description: 'Learn about how BlessYou.Today uses cookies to enhance your browsing experience and protect your privacy.',
  },
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="hero-gradient text-amber-900 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-amber-100/30 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Cookie className="w-8 h-8 text-amber-800" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-crimson mb-6">
            Cookie Policy
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed opacity-90">
            Understanding how we use cookies to enhance your experience on BlessYou.Today
          </p>
        </div>
      </section>

      {/* Last Updated */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Last updated: January 15, 2024</span>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold font-crimson text-gray-900 mb-6">
              What Are Cookies?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              Cookies are small text files that are stored on your device when you visit our website. 
              They help us provide you with a better browsing experience by remembering your preferences, 
              analyzing how you use our site, and enabling certain features to work properly.
            </p>
            
            <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg mb-8">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-2">Important Note</h3>
                  <p className="text-amber-700">
                    By continuing to use BlessYou.Today, you consent to our use of cookies as described in this policy. 
                    You can manage your cookie preferences at any time through your browser settings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Types of Cookies */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold font-crimson text-gray-900 mb-12 text-center">
            Types of Cookies We Use
          </h2>
          
          <div className="space-y-8">
            {/* Essential Cookies */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Essential Cookies</h3>
                  <p className="text-gray-700 mb-4">
                    These cookies are necessary for the website to function properly. They enable core functionality 
                    such as security, network management, and accessibility.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Examples:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Session management and user authentication</li>
                      <li>• Security and fraud prevention</li>
                      <li>• Load balancing and site performance</li>
                      <li>• Accessibility features and preferences</li>
                    </ul>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    <strong>Can be disabled:</strong> No - These are required for the site to work
                  </p>
                </div>
              </div>
            </div>

            {/* Functional Cookies */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Settings className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Functional Cookies</h3>
                  <p className="text-gray-700 mb-4">
                    These cookies enable enhanced functionality and personalization. They remember your choices 
                    and preferences to provide a more personalized experience.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Examples:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Language and region preferences</li>
                      <li>• Theme and display settings</li>
                      <li>• Saved favorites and bookmarks</li>
                      <li>• Form data and user preferences</li>
                    </ul>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    <strong>Can be disabled:</strong> Yes - Site will still work but with reduced functionality
                  </p>
                </div>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Analytics Cookies</h3>
                  <p className="text-gray-700 mb-4">
                    These cookies help us understand how visitors interact with our website by collecting 
                    and reporting information anonymously.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Examples:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Page views and user journey tracking</li>
                      <li>• Popular content and search terms</li>
                      <li>• Site performance and error monitoring</li>
                      <li>• Traffic sources and referral data</li>
                    </ul>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    <strong>Can be disabled:</strong> Yes - No impact on site functionality
                  </p>
                </div>
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Marketing Cookies</h3>
                  <p className="text-gray-700 mb-4">
                    These cookies are used to deliver relevant advertisements and track the effectiveness 
                    of our marketing campaigns.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Examples:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Targeted advertising and retargeting</li>
                      <li>• Social media integration</li>
                      <li>• Campaign performance tracking</li>
                      <li>• Cross-site behavioral tracking</li>
                    </ul>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    <strong>Can be disabled:</strong> Yes - You may see less relevant advertisements
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cookie Management */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold font-crimson text-gray-900 mb-8 text-center">
            Managing Your Cookie Preferences
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Browser Settings</h3>
              <p className="text-gray-700 mb-4">
                You can control cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                  <span>View and delete existing cookies</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Block cookies from specific sites</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Block third-party cookies</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Clear cookies when you close your browser</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Opt-Out Tools</h3>
              <p className="text-gray-700 mb-4">
                You can also use these tools to manage tracking cookies:
              </p>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Google Analytics Opt-out Browser Add-on</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Network Advertising Initiative opt-out</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Digital Advertising Alliance opt-out</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Your browser's "Do Not Track" setting</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">Important Considerations</h3>
                <p className="text-yellow-700">
                  Please note that disabling certain cookies may affect the functionality of our website. 
                  Essential cookies cannot be disabled as they are necessary for the site to work properly. 
                  If you disable functional cookies, you may lose access to personalized features and preferences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Third-Party Cookies */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold font-crimson text-gray-900 mb-8 text-center">
            Third-Party Cookies
          </h2>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <p className="text-gray-700 mb-6">
              Our website may contain content from third-party services that may set their own cookies. 
              These include:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Social Media Platforms</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Facebook</li>
                  <li>• Twitter</li>
                  <li>• Instagram</li>
                  <li>• Pinterest</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Analytics & Advertising</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Google Analytics</li>
                  <li>• Google Ads</li>
                  <li>• Facebook Pixel</li>
                  <li>• Other advertising networks</li>
                </ul>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm">
              We do not control these third-party cookies. Please refer to the respective third-party 
              privacy policies for more information about their cookie practices.
            </p>
          </div>
        </div>
      </section>

      {/* Updates to Policy */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold font-crimson text-gray-900 mb-8 text-center">
            Updates to This Policy
          </h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              We may update this Cookie Policy from time to time to reflect changes in our practices, 
              technology, legal requirements, or other factors. When we make changes, we will update 
              the "Last Updated" date at the top of this policy.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-8">
              We encourage you to review this policy periodically to stay informed about how we use cookies. 
              Your continued use of our website after any changes indicates your acceptance of the updated policy.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-br from-amber-50 to-blue-50 rounded-2xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Mail className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold font-crimson text-gray-900 mb-4">
              Questions About Our Cookie Policy?
            </h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              If you have any questions about this Cookie Policy or how we use cookies, 
              please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="border-2 border-gray-300 bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Contact Us
              </a>
              <a
                href="/privacy"
                className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-amber-400 hover:text-amber-600 transition-colors"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}