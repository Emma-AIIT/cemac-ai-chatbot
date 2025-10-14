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
  description: 'Professional door contracting services with AI-powered assistance',
  keywords: 'CEMAC, doors, hardware, frames, construction, building, AI assistant',
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
      <body className={inter.className}>{children}</body>
    </html>
  );
}