# 🎬 CineStream

[![PWA][pwa-badge]][pwa-url] [![License: MIT][license-badge]][license-url]

A premium, Netflix-style movie and TV series streaming platform built with **Next.js 14**, powered by **TMDb** metadata and delivered as a Progressive Web App.

> **No database required** • **Vercel-ready** • **Installable on mobile & desktop**

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.2.35-black?logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Tailwind-v3.4-38B2AC?logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TMDb-API-032541?logo=movies&color=01ADBB" alt="TMDb" />
</p>

---

## 🌟 Overview

CineStream delivers a **premium, app-like streaming experience** on every device.

- 🎬 **Thousands of titles** — movies, series, originals, all sourced from TMDb.
- 🖼️ **Cinematic UI** — hero banners, smooth transitions, dark-first design.
- 📱 **PWA-first** — install on home screen, offline-ready shell, push-ready architecture.
- 🔍 **Deep search** — instant results with genre, title, and keyword lookup.
- ⚡ **Instant playback** — native vidsrc embeds with source fallback and quality selection.

---

## 📸 Screenshot

<div align="center">
  <sub>Dark cinematic UI, hero banners, genre rows, and native PWA install prompt.</sub>
</div>

---

## 🛠️ Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
# Clone the repo
git clone https://github.com/hdytepo7hehe/cinestream.git
cd cinestream

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

Edit `.env.local` and add your [TMDb API key](https://www.themoviedb.org/settings/api):

```env
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p
```

> 🔒 Never commit `.env.local` — it is gitignored by default.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app is live.

### Production Build

```bash
npm run build
npm start
```

---

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hdytepo7hehe/cinestream)

1. Click **Deploy with Vercel** or import the repo manually.
2. Add `NEXT_PUBLIC_TMDB_API_KEY` in **Environment Variables**.
3. Click **Deploy**.

Your PWA will be live, installable, and served via CDN.

### Manual (Docker)

```bash
docker build -t cinestream .
docker run -p 3000:3000 cinestream
```

---

## 🌐 Features

### For Users

- **Home** — Cinematic hero banner with random featured title.
- **Genre Browse** — Explore movies & TV by genre (15+ movie, 11+ TV genres).
- **Detail Pages** — Cast, genres, trailers, and recommendations.
- **Trailer Modal** — YouTube embeds without leaving the site.
- **Player** — 3 source fallbacks, quality switching, fullscreen support.
- **Search** — Instant, debounced search across titles.
- **Installable** — PWA install prompt on Chrome/Edge/Safari.

### For Developers

- **Next.js 14 App Router** with SSR, ISR, and typed routes.
- **Tailwind CSS** + custom design system (Cine colors).
- **Type-safe TMDb client** with caching (1 hour).
- **Responsive-first** (mobile, tablet, desktop).
- **Service worker** with offline cache and auto-update.
- **No backend required** — everything is edge-ready.

---

## 🗂️ Architecture

```
src/
├── app/                          # Next.js App Router
│   ├── (main)/                   # Main pages
│   │   ├── page.tsx              # Home (hero + rows)
│   │   ├── movie/[id]/           # Movie detail
│   │   ├── tv/[id]/              # TV show detail
│   │   ├── watch/                # Video player pages
│   │   ├── genre/                # Genre browse pages
│   │   ├── search/               # Search results
│   │   └── layout.tsx            # Root layout + Navbar + Footer
│   └── components/
│       ├── Navbar.tsx            # Fixed nav with genre dropdowns
│       ├── Hero.tsx              # Hero banner (client)
│       ├── MovieCard.tsx         # Poster card with hover
│       ├── MovieRow.tsx          # Horizontal scroll row
│       ├── VideoPlayer.tsx       # Player with 3-source fallback
│       ├── TrailerModal.tsx      # YouTube modal (client)
│       ├── EpisodeSelector.tsx   # TV season/episode picker
│       └── ...
├── lib/
│   ├── tmdb.ts                   # TMDb SDK with types
│   └── genres.ts                 # Static genre maps
└── public/
    ├── icons/                    # PWA icons
    ├── manifest.json             # PWA manifest
    └── sw.js                     # Service worker
```

---

## 🎨 Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| **Cine Red** | `#e50914` | Primary actions, accents |
| **Cine BG** | `#0a0a0a` | Body background |
| **Cine Surface** | `#141414` | Cards, surfaces |
| **Cine Surface-2** | `#1a1a1a` | Hover states |
| **Cine Border** | `#2a2a2a` | Borders, dividers |
| **Cine Muted** | `#808080` | Secondary text |

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add: amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 🙏 Acknowledgements

- [TMDb](https://www.themoviedb.org) — for movie/TV metadata & images
- [Next.js](https://nextjs.org) — React framework
- [Tailwind CSS](https://tailwindcss.com) — utility-first CSS
- [vidsrc](https://vidsrc.me) — video embeds (third-party)
- [YouTube Data API](https://developers.google.com/youtube) — trailers

---

<p align="center">
  Built with ❤️ using CineStream
</p>

[pwa-badge]: https://img.shields.io/badge/PWA-Ready-000000?logo=appveyor&labelColor=2a2a2a
[pwa-url]: #pwa-features
[license-badge]: https://img.shields.io/badge/License-MIT-yellow.svg
[license-url]: https://opensource.org/licenses/MIT
