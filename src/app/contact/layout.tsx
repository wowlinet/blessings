import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - Get in Touch',
  description: 'Contact BlessYou.Today for questions, suggestions, or support. We\'re here to help and respond within 24 hours.',
  keywords: 'contact, support, help, questions, feedback, customer service',
  openGraph: {
    title: 'Contact Us - Get in Touch',
    description: 'Contact BlessYou.Today for questions, suggestions, or support. We\'re here to help and respond within 24 hours.',
    url: 'https://blessyou.today/contact',
  },
  twitter: {
    title: 'Contact Us - Get in Touch',
    description: 'Contact BlessYou.Today for questions, suggestions, or support. We\'re here to help and respond within 24 hours.',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}