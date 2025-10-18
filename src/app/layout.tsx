import type { Metadata } from 'next'
import { Inter, Crimson_Text } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const crimsonText = Crimson_Text({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-crimson',
  display: 'swap'
})

export const metadata: Metadata = {
  title: {
    default: 'BlessYou.Today - Heartfelt Blessings for Every Moment',
    template: '%s | BlessYou.Today'
  },
  description: 'Discover thousands of heartfelt blessings, prayers, and inspirational messages for every occasion. From daily blessings to special celebrations, find the perfect words to share love and positivity.',
  keywords: 'blessings, prayers, inspirational messages, daily blessings, birthday blessings, wedding prayers, religious blessings, holiday blessings, sympathy messages, healing prayers',
  authors: [{ name: 'BlessYou.Today' }],
  creator: 'BlessYou.Today',
  publisher: 'BlessYou.Today',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://blessyou.today'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://blessyou.today',
    siteName: 'BlessYou.Today',
    title: 'BlessYou.Today - Heartfelt Blessings for Every Moment',
    description: 'Discover thousands of heartfelt blessings, prayers, and inspirational messages for every occasion.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BlessYou.Today - Heartfelt Blessings',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlessYou.Today - Heartfelt Blessings for Every Moment',
    description: 'Discover thousands of heartfelt blessings, prayers, and inspirational messages for every occasion.',
    images: ['/og-image.jpg'],
    creator: '@blessyoutoday',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${crimsonText.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8B5CF6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BlessYou.Today" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#8B5CF6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        {modal}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'white',
              color: '#374151',
              border: '1px solid #E5E7EB',
            },
          }}
        />
      </body>
    </html>
  )
}