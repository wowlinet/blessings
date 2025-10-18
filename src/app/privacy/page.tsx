import type { Metadata } from 'next'
import { Shield, Eye, Lock, Database, Users, Globe, Mail, Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy - Your Privacy Matters',
  description: 'Learn how BlessYou.Today protects your privacy and handles your personal information. Read our comprehensive privacy policy.',
  keywords: 'privacy policy, data protection, personal information, cookies, user privacy',
  openGraph: {
    title: 'Privacy Policy - Your Privacy Matters',
    description: 'Learn how BlessYou.Today protects your privacy and handles your personal information. Read our comprehensive privacy policy.',
    url: 'https://blessyou.today/privacy',
  },
  twitter: {
    title: 'Privacy Policy - Your Privacy Matters',
    description: 'Learn how BlessYou.Today protects your privacy and handles your personal information. Read our comprehensive privacy policy.',
  },
}

export default function PrivacyPage() {
  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: [
        'Personal Information: When you create an account, we collect your name, email address, and any profile information you choose to provide.',
        'Usage Data: We collect information about how you use our service, including pages visited, blessings viewed, and search queries.',
        'Device Information: We may collect information about your device, including IP address, browser type, and operating system.',
        'Cookies and Tracking: We use cookies and similar technologies to enhance your experience and analyze site usage.'
      ]
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: [
        'Service Provision: To provide, maintain, and improve our blessing platform and services.',
        'Personalization: To personalize your experience and recommend relevant blessings based on your interests.',
        'Communication: To send you important updates, newsletters, and respond to your inquiries.',
        'Analytics: To understand how our service is used and to improve our content and features.',
        'Legal Compliance: To comply with legal obligations and protect our rights and the rights of our users.'
      ]
    },
    {
      icon: Users,
      title: 'Information Sharing',
      content: [
        'We do not sell, trade, or rent your personal information to third parties.',
        'Service Providers: We may share information with trusted service providers who help us operate our platform.',
        'Legal Requirements: We may disclose information when required by law or to protect our rights and safety.',
        'Business Transfers: In the event of a merger or acquisition, user information may be transferred as part of the business assets.',
        'Consent: We may share information with your explicit consent for specific purposes.'
      ]
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: [
        'Encryption: We use industry-standard encryption to protect your data in transit and at rest.',
        'Access Controls: We implement strict access controls to limit who can access your personal information.',
        'Regular Audits: We regularly review and update our security practices to ensure your data remains protected.',
        'Incident Response: We have procedures in place to respond quickly to any security incidents.',
        'Third-Party Security: We ensure our service providers maintain appropriate security standards.'
      ]
    },
    {
      icon: Shield,
      title: 'Your Rights',
      content: [
        'Access: You have the right to access the personal information we hold about you.',
        'Correction: You can request corrections to any inaccurate or incomplete information.',
        'Deletion: You can request deletion of your personal information, subject to legal requirements.',
        'Portability: You can request a copy of your data in a portable format.',
        'Opt-out: You can opt out of marketing communications at any time.',
        'Account Control: You can update your account settings and privacy preferences at any time.'
      ]
    },
    {
      icon: Globe,
      title: 'International Transfers',
      content: [
        'Global Service: Our service is available globally, and your information may be processed in different countries.',
        'Adequate Protection: We ensure appropriate safeguards are in place when transferring data internationally.',
        'Legal Frameworks: We comply with applicable international data transfer regulations.',
        'User Consent: By using our service, you consent to the international transfer of your information as described.'
      ]
    }
  ]

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      content: 'privacy@blessyou.today',
      description: 'For privacy-related questions'
    },
    {
      icon: Calendar,
      title: 'Response Time',
      content: 'Within 30 days',
      description: 'We respond to privacy requests promptly'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="hero-gradient text-amber-900 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-amber-100/30 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-amber-800" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-crimson mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed opacity-90">
            Your privacy is important to us. Learn how we protect and handle your personal information.
          </p>
        </div>
      </section>

      {/* Last Updated */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span>Last updated: January 15, 2024</span>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              At BlessYou.Today, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using our service, you agree to the collection and use of information in accordance with this policy. 
              We will not use or share your information with anyone except as described in this Privacy Policy.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Sections */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-16">
            {sections.map((section, index) => {
              const IconComponent = section.icon
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold font-crimson text-gray-900 mb-6">
                        {section.title}
                      </h2>
                      <ul className="space-y-4">
                        {section.content.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-700 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Cookies Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-br from-amber-50 to-blue-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold font-crimson text-gray-900 mb-6">
              Cookies and Tracking Technologies
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We use cookies and similar tracking technologies to enhance your experience on our website. 
                Cookies are small data files stored on your device that help us remember your preferences and improve our service.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                  <p className="text-sm">Required for the website to function properly and cannot be disabled.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Analytics Cookies</h3>
                  <p className="text-sm">Help us understand how visitors interact with our website.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Preference Cookies</h3>
                  <p className="text-sm">Remember your settings and preferences for a better experience.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Marketing Cookies</h3>
                  <p className="text-sm">Used to deliver relevant advertisements and track campaign effectiveness.</p>
                </div>
              </div>
              <p className="mt-6">
                You can control cookie settings through your browser preferences. However, disabling certain cookies may affect website functionality.
                For more detailed information, please see our <a href="/cookies" className="text-amber-600 hover:text-amber-700 font-medium">Cookie Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Children's Privacy */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-blue-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold font-crimson text-gray-900 mb-4">
              Children's Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our service is not intended for children under the age of 13. We do not knowingly collect personal information 
              from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, 
              please contact us immediately. If we discover we have collected personal information from a child under 13 without 
              parental consent, we will take steps to remove that information from our servers.
            </p>
          </div>
        </div>
      </section>

      {/* Changes to Policy */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold font-crimson text-gray-900 mb-6 text-center">
            Changes to This Privacy Policy
          </h2>
          <div className="prose prose-lg max-w-none text-center">
            <p className="text-gray-700 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy 
              periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-crimson text-gray-900 mb-6">
              Questions About Privacy?
            </h2>
            <p className="text-xl text-gray-600">
              If you have any questions about this Privacy Policy or our data practices, please don't hesitate to contact us.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon
              return (
                <div key={index} className="text-center bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                  <p className="text-gray-900 font-medium mb-1">{info.content}</p>
                  <p className="text-gray-600 text-sm">{info.description}</p>
                </div>
              )
            })}
          </div>

          <div className="text-center">
            <a
              href="/contact"
              className="bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 inline-flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Contact Our Privacy Team
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}