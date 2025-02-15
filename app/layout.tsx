import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { SupabaseProvider } from '@/components/providers/supabase-provider';
import AnimationWrapper from '@/components/AnimationWrapper';
import ErrorBoundary from '@/components/ErrorBoundary';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://xhap.co.za'),
  title: {
    default: 'eSpazza - Xhosa Hip Hop Spaza Shop',
    template: '%s | eSpazza',
  },
  description: 'Iplatform yabaRhepi baseKhaya - The home of Xhosa Hip Hop',
  keywords: [
    'Xhosa Hip Hop',
    'South African Music',
    'Hip Hop',
    'Rap',
    'Music Platform',
  ],
  authors: [{ name: 'eSpazza Team' }],
  creator: 'eSpazza',
  publisher: 'eSpazza',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://xhap.co.za',
    title: 'eSpazza - Xhosa Hip Hop Spaza Shop',
    description: 'The home of Xhosa Hip Hop',
    siteName: 'eSpazza',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'eSpazza - Xhosa Hip Hop Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'eSpazza - Xhosa Hip Hop Spaza Shop',
    description: 'The home of Xhosa Hip Hop',
    images: ['/logo.jpg'],
    creator: '@xhap',
  },
  manifest: '/manifest.json',
  themeColor: '#dc2626',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
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
    google: 'your-google-site-verification',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='xh' className='dark'>
      <head>
        <Script
          id='structured-data'
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'eSpazza',
              url: 'https://xhap.co.za',
              description: 'The home of Xhosa Hip Hop',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://xhap.co.za/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <a href='#main-content' className='skip-to-content'>
            Skip to main content
          </a>
          <SupabaseProvider>
            <div className='flex flex-col min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800'>
              <SiteHeader />
              <main id='main-content' className='flex-1'>
                <AnimationWrapper>{children}</AnimationWrapper>
                <Analytics />
              </main>
              <SiteFooter />
            </div>
            <Toaster />
          </SupabaseProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
