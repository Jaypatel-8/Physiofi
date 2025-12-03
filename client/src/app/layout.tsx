import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import dynamic from 'next/dynamic'

// Import Toaster normally - it's already lightweight
import { Toaster } from 'react-hot-toast'

// Import the loader wrapper component dynamically to avoid SSR issues
const LoaderWrapper = dynamic(
  () => import('@/components/ui/LoaderWrapper'),
  { ssr: false }
)

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'PhysioFi - Get Better at Home | Physiotherapy & Teleconsultation',
  description: 'Professional physiotherapy services at your doorstep in Ahmedabad. Expert therapists, home visits, and teleconsultations for your recovery journey.',
  keywords: 'physiotherapy, home physiotherapy, teleconsultation, Ahmedabad, physiotherapist, rehabilitation, physical therapy',
  authors: [{ name: 'PhysioFi Team' }],
  creator: 'PhysioFi',
  publisher: 'PhysioFi',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://physiofi.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'PhysioFi - Get Better at Home',
    description: 'Professional physiotherapy services at your doorstep in Ahmedabad. Expert therapists, home visits, and teleconsultations.',
    url: 'https://physiofi.com',
    siteName: 'PhysioFi',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PhysioFi - Get Better at Home',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PhysioFi - Get Better at Home',
    description: 'Professional physiotherapy services at your doorstep in Ahmedabad.',
    images: ['/images/og-image.jpg'],
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "PhysioFi",
    "description": "Professional physiotherapy services at your doorstep in Ahmedabad. Expert therapists, home visits, and teleconsultations for your recovery journey.",
    "url": "https://physiofi.com",
    "logo": "https://physiofi.com/images/logo.png",
    "image": "https://physiofi.com/images/og-image.jpg",
    "telephone": "+91 9998103191",
    "email": "info@physiofi.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Science City Road",
      "addressLocality": "Ahmedabad",
      "addressRegion": "Gujarat",
      "postalCode": "380060",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "23.0225",
      "longitude": "72.5714"
    },
    "openingHours": "Mo-Sa 09:00-18:00",
    "priceRange": "₹800-₹2000",
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "23.0225",
        "longitude": "72.5714"
      },
      "geoRadius": "50000"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Physiotherapy Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "MedicalProcedure",
            "name": "Home Physiotherapy",
            "description": "Professional physiotherapy services at your doorstep"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "MedicalProcedure",
            "name": "Online Consultation",
            "description": "Teleconsultation with certified physiotherapists"
          }
        }
      ]
    }
  };

  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="canonical" href="https://physiofi.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1C1F4A" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        <Providers>
          <LoaderWrapper>
            {children}
          </LoaderWrapper>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#84cc16',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}


