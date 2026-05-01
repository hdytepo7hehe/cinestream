import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: {
    default: 'CineStream — Watch Movies & TV Shows Free',
    template: '%s | CineStream',
  },
  description:
    'CineStream — Stream the latest movies and TV shows for free. Powered by TMDb.',
  keywords: ['movies', 'tv shows', 'streaming', 'watch free', 'cinestream'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cinestream.vercel.app',
    siteName: 'CineStream',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CineStream',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CineStream — Watch Movies & TV Shows Free',
    description: 'Stream the latest movies and TV shows for free.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-cine-bg text-cine-text antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <footer className="bg-cine-surface border-t border-cine-border py-10 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-cine-red font-bold text-xl mb-3">CineStream</h3>
                <p className="text-cine-muted text-sm leading-relaxed">
                  Your free streaming destination for movies and TV shows. Movie data provided by TMDb.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Explore</h4>
                <ul className="space-y-2 text-sm text-cine-muted">
                  <li><a href="/movies" className="hover:text-white transition-colors">Movies</a></li>
                  <li><a href="/tv" className="hover:text-white transition-colors">TV Shows</a></li>
                  <li><a href="/search" className="hover:text-white transition-colors">Search</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Legal</h4>
                <p className="text-cine-muted text-xs leading-relaxed">
                  This product uses the TMDb API but is not endorsed or certified by TMDb.
                  Video content is embedded from third-party sources.
                </p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-cine-border text-center text-cine-muted text-xs">
              © {new Date().getFullYear()} CineStream. For educational purposes only.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
