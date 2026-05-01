/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
  },

  async headers() {
    return [
      // ── Global security headers ──────────────────────────────────────────
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          { key: 'X-DNS-Prefetch-Control',  value: 'on' },
          { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
        ],
      },

      // ── Watch pages: strict CSP that blocks ad popups & redirects ────────
      // The iframe sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
      // already prevents popups at the iframe level.
      // This CSP header blocks any top-level navigation attempts from escaping.
      {
        source: '/watch/(.*)',
        headers: [
          // Allow iframes from known player domains only
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https://image.tmdb.org https://img.youtube.com",
              "media-src *",
              // Only allow iframes from our known player sources
              "frame-src https://vidsrc.xyz https://vidsrc.me https://vidsrc.to https://player.vidsrc.co https://vidsrc.cc https://www.youtube.com",
              // Block all new top-level navigation from embedded frames
              "navigate-to 'self'",
              "frame-ancestors 'self'",
            ].join('; '),
          },
          // Allow iframe embedding but no sniffing
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
