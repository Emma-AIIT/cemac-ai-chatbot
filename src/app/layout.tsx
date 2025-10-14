/**
 * Root Layout Component
 *
 * The root layout component for the CEMAC Doors AI Assistant application.
 * This component wraps all pages and provides the HTML structure, fonts, and metadata.
 */
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../global.css';

// Configure the Inter font for the application
const inter = Inter({ subsets: ['latin'] });

// SEO metadata for the application
export const metadata: Metadata = {
  title: 'CEMAC Doors AI Assistant',
  description: 'Professional door contracting services with AI-powered assistance. Get instant answers about doors, frames, hardware, and project management solutions.',
  keywords: 'CEMAC, doors, hardware, frames, construction, building, AI assistant, door seals, acoustic doors, fire doors',
  authors: [{ name: 'CEMAC Doors' }],
  creator: 'CEMAC Doors',
  publisher: 'CEMAC Doors',
  
  // Open Graph metadata (for Facebook, WhatsApp, LinkedIn, etc.)
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://cemac-ai-chatbot.vercel.app/',
    title: 'CEMAC Doors AI Assistant',
    description: 'Professional door contracting services with AI-powered assistance. Get instant answers about doors, frames, hardware, and project management solutions.',
    siteName: 'CEMAC Doors AI Assistant',
    images: [
      {
        url: '/og-image.png', // You'll need to create this image (1200x630px recommended)
        width: 1200,
        height: 630,
        alt: 'CEMAC Doors AI Assistant',
        type: 'image/png',
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: 'CEMAC Doors AI Assistant',
    description: 'Professional door contracting services with AI-powered assistance. Serving the building industry since the 1950s.',
    images: ['/og-image.png'], // Same image as Open Graph
    creator: '@cemac_doors', // Add your Twitter handle if you have one
  },

  // Additional metadata
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

  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },

  // Manifest for PWA
  manifest: '/site.webmanifest',

  // Verification (add if you have these)
  // verification: {
  //   google: 'your-google-verification-code',
  //   yandex: 'your-yandex-verification-code',
  // },
};

/**
 * Root layout component that provides the HTML structure for all pages
 * @param children - React nodes to be rendered inside the layout
 * @returns JSX element with HTML structure and font styling
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Additional meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#FF6B35" />
        <link rel="canonical" href="https://cemac-ai-chatbot.vercel.app/" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}