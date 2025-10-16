import type { Metadata } from 'next'
import { FileText, Users, Shield, AlertTriangle, Scale, Globe, Mail, Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service - Usage Guidelines',
  description: 'Read BlessYou.Today\'s terms of service to understand your rights and responsibilities when using our platform.',
  keywords: 'terms of service, user agreement, terms and conditions, usage guidelines, legal terms',
  openGraph: {
    title: 'Terms of Service - Usage Guidelines',
    description: 'Read BlessYou.Today\'s terms of service to understand your rights and responsibilities when using our platform.',
    url: 'https://blessyou.today/terms',
  },
  twitter: {
    title: 'Terms of Service - Usage Guidelines',
    description: 'Read BlessYou.Today\'s terms of service to understand your rights and responsibilities when using our platform.',
  },
}

export default function TermsPage() {
  const sections = [
    {
      icon: Users,
      title: 'Acceptance of Terms',
      content: [
        'By accessing and using BlessYou.Today, you accept and agree to be bound by the terms and provision of this agreement.',
        'If you do not agree to abide by the above, please do not use this service.',
        'These terms apply to all visitors, users, and others who access or use the service.',
        'We reserve the right to update these terms at any time without prior notice.',
        'Your continued use of the service after any changes constitutes acceptance of the new terms.'
      ]
    },
    {
      icon: FileText,
      title: 'Use License',
      content: [
        'Permission is granted to temporarily access and use BlessYou.Today for personal, non-commercial transitory viewing only.',
        'You may share individual blessings for personal use, with proper attribution to BlessYou.Today.',
        'This license shall automatically terminate if you violate any of these restrictions.',
        'Commercial use of our content requires explicit written permission.',
        'You may not modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any information obtained from this website.'
      ]
    },
    {
      icon: Shield,
      title: 'User Accounts',
      content: [
        'You are responsible for safeguarding the password and for all activities that occur under your account.',
        'You must provide accurate and complete information when creating an account.',
        'You must promptly update your account information if it changes.',
        'You may not use another person\'s account without permission.',
        'We reserve the right to suspend or terminate accounts that violate these terms.',
        'You are responsible for maintaining the confidentiality of your account credentials.'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'Prohibited Uses',
      content: [
        'You may not use our service for any unlawful purpose or to solicit others to perform unlawful acts.',
        'You may not violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances.',
        'You may not transmit any worms, viruses, or any code of a destructive nature.',
        'You may not infringe upon or violate our intellectual property rights or the intellectual property rights of others.',
        'You may not harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate.',
        'You may not submit false or misleading information.',
        'You may not upload or transmit viruses or any other type of malicious code.',
        'You may not spam, phish, pharm, pretext, spider, crawl, or scrape.'
      ]
    },
    {
      icon: Scale,
      title: 'Content and Intellectual Property',
      content: [
        'All content on BlessYou.Today, including text, graphics, logos, and software, is our property or the property of our content suppliers.',
        'Our content is protected by copyright, trademark, and other intellectual property laws.',
        'You may not reproduce, distribute, modify, or create derivative works of our content without permission.',
        'User-generated content remains the property of the user, but you grant us a license to use it.',
        'We respect the intellectual property rights of others and expect users to do the same.',
        'If you believe your copyright has been infringed, please contact us with details.'
      ]
    },
    {
      icon: Globe,
      title: 'Service Availability',
      content: [
        'We strive to maintain continuous service availability but cannot guarantee uninterrupted access.',
        'We may temporarily suspend service for maintenance, updates, or technical issues.',
        'We reserve the right to modify, suspend, or discontinue any part of our service at any time.',
        'We are not liable for any interruption of service or loss of data.',
        'Service availability may vary by geographic location.',
        'We may impose usage limits or restrictions on certain features.'
      ]
    }
  ]

  const disclaimers = [
    {
      title: 'No Warranties',
      content: 'The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, we exclude all representations, warranties, and conditions relating to our website and the use of this website.'
    },
    {
      title: 'Limitation of Liability',
      content: 'In no event shall BlessYou.Today or its suppliers be liable for any damages arising out of the use or inability to use the materials on our website, even if we have been notified of the possibility of such damage.'
    },
    {
      title: 'Accuracy of Materials',
      content: 'The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials are accurate, complete, or current.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="hero-gradient text-amber-900 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-amber-100/30 backdrop-blur-sm rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-amber-800" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-crimson mb-6">
            Terms of Service
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed opacity-90">
            Please read these terms carefully before using our service. They govern your use of BlessYou.Today.
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
              Welcome to BlessYou.Today. These Terms of Service ("Terms") govern your use of our website and services. 
              By accessing or using our service, you agree to be bound by these Terms.
            </p>
            <p className="text-gray-700 leading-relaxed">
              These Terms constitute a legally binding agreement between you and BlessYou.Today. 
              If you disagree with any part of these terms, then you may not access the service.
            </p>
          </div>
        </div>
      </section>

      {/* Terms Sections */}
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

      {/* Privacy and Data */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-br from-blue-50 to-amber-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold font-crimson text-gray-900 mb-6">
              Privacy and Data Protection
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, 
                which is incorporated into these Terms by reference.
              </p>
              <p>
                By using our service, you consent to the collection and use of your information as outlined in our Privacy Policy. 
                We are committed to protecting your personal data and maintaining transparency about our data practices.
              </p>
              <p>
                For detailed information about how we handle your data, please review our 
                <a href="/privacy" className="text-amber-600 hover:text-amber-700 font-medium ml-1">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimers */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold font-crimson text-gray-900 mb-12 text-center">
            Important Disclaimers
          </h2>
          <div className="space-y-8">
            {disclaimers.map((disclaimer, index) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-900 mb-4">{disclaimer.title}</h3>
                <p className="text-red-800 leading-relaxed">{disclaimer.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Governing Law */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold font-crimson text-gray-900 mb-6">
              Governing Law and Jurisdiction
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be interpreted and governed by the laws of the jurisdiction in which BlessYou.Today operates, 
                without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the service 
                shall be subject to the exclusive jurisdiction of the courts in that jurisdiction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Severability */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gray-100 rounded-2xl p-8">
            <h2 className="text-2xl font-bold font-crimson text-gray-900 mb-4">
              Severability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated 
              to the minimum extent necessary so that these Terms will otherwise remain in full force and effect and enforceable.
            </p>
          </div>
        </div>
      </section>

      {/* Changes to Terms */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold font-crimson text-gray-900 mb-6 text-center">
            Changes to These Terms
          </h2>
          <div className="prose prose-lg max-w-none text-center">
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide 
              at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined 
              at our sole discretion. By continuing to access or use our service after those revisions become effective, 
              you agree to be bound by the revised terms.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-crimson text-gray-900 mb-6">
              Questions About These Terms?
            </h2>
            <p className="text-xl text-gray-600">
              If you have any questions about these Terms of Service, please contact us.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="text-center bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-900 font-medium mb-1">legal@blessyou.today</p>
              <p className="text-gray-600 text-sm">For legal and terms questions</p>
            </div>
            
            <div className="text-center bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Response Time</h3>
              <p className="text-gray-900 font-medium mb-1">Within 5 business days</p>
              <p className="text-gray-600 text-sm">We respond to legal inquiries promptly</p>
            </div>
          </div>

          <div className="text-center">
            <a
              href="/contact"
              className="bg-gradient-to-r from-amber-400 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-amber-500 hover:to-blue-700 transition-all duration-200 inline-flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Contact Our Legal Team
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}