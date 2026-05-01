# 🎬 CineStream

A Netflix-style movie & TV streaming site built with **Next.js 14**, powered by **TMDb** for metadata and free embed providers for video playback. No database required.

---

## ✨ Features

- 🎬 **Movies & TV Shows** — full metadata (title, description, cast, genres, ratings, runtime)
- 🖼️ **High-quality banners & posters** via TMDb CDN
- ▶️ **Fullscreen video player** with 3 free sources (vidsrc.xyz, vidsrc.me, vidsrc.to)
- 🔄 **Source switcher** — try another if one fails
- 📺 **TV episode selector** — browse seasons and episodes
- 🔍 **Search** across movies and TV shows
- 🌟 **Trending, Popular, Top Rated** rows with horizontal scroll
- 🎭 **Cast grid** with actor photos and characters
- 📱 **Fully responsive** — mobile, tablet, desktop
- ⚡ **Fast** — Next.js caching with 1-hour revalidation
- 🚀 **Vercel-ready** — deploy in one click

---

## 🚀 Quick Start

### 1. Get a free TMDb API key
Register at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) — it's free and takes 2 minutes.

### 2. Configure environment
```bash
cp .env.example .env.local
```
Edit `.env.local` and add your key:
```env
NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p
```

### 3. Install & run
```bash
npm install
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) 🎉

---

## 🌐 Deploy to Vercel

1. Push your project to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo
3. Add environment variable: `NEXT_PUBLIC_TMDB_API_KEY` = your key
4. Click **Deploy** — done!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                          # Home (hero + rows)
│   ├── layout.tsx                        # Root layout + Navbar
│   ├── loading.tsx                       # Skeleton loader
│   ├── globals.css                       # Global styles
│   ├── movies/page.tsx                   # Movies listing
│   ├── movie/[id]/page.tsx               # Movie detail
│   ├── tv/page.tsx                       # TV shows listing
│   ├── tv/[id]/page.tsx                  # TV show detail
│   ├── watch/movie/[id]/page.tsx         # Movie player
│   ├── watch/tv/[id]/[season]/[episode]/ # TV player
│   └── search/page.tsx                  # Search results
├── components/
│   ├── Navbar.tsx                        # Fixed nav + search
│   ├── Hero.tsx                          # Full-viewport hero banner
│   ├── MovieCard.tsx                     # Poster card with hover
│   ├── MovieRow.tsx                      # Horizontal scroll row
│   ├── VideoPlayer.tsx                   # iframe player + source switcher
│   └── EpisodeSelector.tsx              # Season/episode picker
└── lib/
    └── tmdb.ts                           # TMDb API client + types
```

---

## 🎥 Video Sources

| Source | Movie URL | TV URL |
|--------|-----------|--------|
| vidsrc.xyz | `vidsrc.xyz/embed/movie?tmdb={id}` | `vidsrc.xyz/embed/tv?tmdb={id}&season={s}&episode={e}` |
| vidsrc.me | `vidsrc.me/embed/movie?tmdb={id}` | `vidsrc.me/embed/tv?tmdb={id}&season={s}&episode={e}` |
| vidsrc.to | `vidsrc.to/embed/movie/{id}` | `vidsrc.to/embed/tv/{id}/{s}/{e}` |

> **Tip:** Install uBlock Origin for the best viewing experience with embed sources.

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 14 | Framework (App Router, SSR) |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| TMDb API | Movie/TV metadata |
| vidsrc embeds | Video playback |
| Lucide React | Icons |
| Vercel | Hosting |

---

## ⚠️ Legal Notice

This project uses third-party embed services for video content. The site itself does not host any video files. Use responsibly and in accordance with your local laws.

---

Made with ❤️ using CineStream
