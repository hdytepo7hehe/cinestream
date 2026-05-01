import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PWAScript from './PWAScript';

export const metadata: Metadata = {
  title: {
    default: 'CineStream — Watch Movies & TV Shows Free',
    template: '%s | CineStream',
  },
  description: 'CineStream — Stream the latest movies and TV shows for free. Powered by TMDb.',
  keywords: ['movies', 'tv shows', 'streaming', 'watch free', 'cinestream'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'CineStream',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CineStream — Watch Movies & TV Shows Free',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-192.png" />
        <meta name="theme-color" content="#e50914" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-cine-bg text-cine-text antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <PWAScript />
      </body>
    </html>
  );
}
