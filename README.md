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

## 🖥️ Prerequisites

Before you begin, make sure you have the following installed on your machine:

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | v18+ | [nodejs.org](https://nodejs.org) |
| **npm** | v9+ (comes with Node.js) | — |
| **Git** | Latest | [git-scm.com](https://git-scm.com) |
| **Git Bash** | Latest (Windows) | [gitforwindows.org](https://gitforwindows.org) |

> 💡 **Windows users:** All commands below work in **Git Bash**. Open it by right-clicking any folder → *"Git Bash Here"*.

---

## 🚀 Installation (Git Bash / macOS Terminal / Linux)

### Step 1 — Check Node.js is installed
```bash
node -v
# Should print v18.x.x or higher

npm -v
# Should print 9.x.x or higher
```

> If Node.js is not installed, download it from [nodejs.org](https://nodejs.org) (choose the LTS version), install it, then reopen Git Bash.

---

### Step 2 — Clone the repository
```bash
git clone https://github.com/Mebot1x/cinestream.git
```

---

### Step 3 — Navigate into the project folder
```bash
cd cinestream
```

---

### Step 4 — Install dependencies
```bash
npm install
```

> This downloads all required packages into a `node_modules/` folder. May take 1–2 minutes on first run.

---

### Step 5 — Run the development server
```bash
npm run dev
```

You should see:
```
▲ Next.js 14.2.3
- Local:        http://localhost:3000
- Ready in Xs
```

Open your browser and go to **[http://localhost:3000](http://localhost:3000)** 🎉

---

## 🔑 Environment / API Keys

The TMDb API key is already included in `.env` for testing. If you ever need to update it:

```bash
# Open .env in any text editor (Git Bash example using notepad)
notepad .env

# Or use nano/vim on Linux/macOS
nano .env
```

Update these values:
```env
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p
```

Get a free TMDb key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).

---

## 📦 Available Scripts

Run these inside the project folder in Git Bash:

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm start

# Run TypeScript type checker
npx tsc --noEmit

# Lint code
npm run lint
```

---

## 🌐 Deploy to Vercel

### Option A — One-click deploy (recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Mebot1x/cinestream)

### Option B — Via Git Bash + Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel (opens browser)
vercel login

# Deploy from project folder
cd cinestream
vercel

# Follow the prompts — done!
```

### Option C — Via Vercel Dashboard
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select **`Mebot1x/cinestream`**
4. Click **Deploy** — Vercel auto-reads the `.env` file

---

## 🛠️ Common Issues (Git Bash / Windows)

### `npm: command not found`
Node.js is not installed. Download from [nodejs.org](https://nodejs.org) and reopen Git Bash.

### `EACCES: permission denied`
```bash
# Run Git Bash as Administrator, or prefix with:
npx --yes next dev
```

### `Port 3000 already in use`
```bash
# Run on a different port
npm run dev -- -p 3001
```

### `node_modules not found` after cloning
```bash
# Re-run install
npm install
```

### Line ending warnings on Windows
```bash
# Configure Git to handle line endings automatically
git config --global core.autocrlf true
```

---

## 📁 Project Structure

```
cinestream/
├── .env                              # API keys (included for testing)
├── .env.example                      # Template for your own keys
├── next.config.ts                    # Next.js config
├── tailwind.config.ts                # Tailwind theme
├── package.json                      # Dependencies & scripts
└── src/
    ├── app/
    │   ├── page.tsx                  # Home (hero + rows)
    │   ├── layout.tsx                # Root layout + Navbar
    │   ├── loading.tsx               # Skeleton loader
    │   ├── globals.css               # Global styles
    │   ├── movies/page.tsx           # Movies listing
    │   ├── movie/[id]/page.tsx       # Movie detail
    │   ├── tv/page.tsx               # TV shows listing
    │   ├── tv/[id]/page.tsx          # TV show detail
    │   ├── watch/movie/[id]/         # Movie player
    │   ├── watch/tv/[id]/[s]/[e]/    # TV player
    │   └── search/page.tsx           # Search results
    ├── components/
    │   ├── Navbar.tsx                # Fixed nav + search
    │   ├── Hero.tsx                  # Full-viewport hero banner
    │   ├── MovieCard.tsx             # Poster card with hover
    │   ├── MovieRow.tsx              # Horizontal scroll row
    │   ├── VideoPlayer.tsx           # iframe player + source switcher
    │   └── EpisodeSelector.tsx       # Season/episode picker
    └── lib/
        └── tmdb.ts                   # TMDb API client + TypeScript types
```

---

## 🎥 Video Sources

| Source | Movie | TV Show |
|--------|-------|---------|
| **Source 1** — vidsrc.xyz | `vidsrc.xyz/embed/movie?tmdb={id}` | `vidsrc.xyz/embed/tv?tmdb={id}&season={s}&episode={e}` |
| **Source 2** — vidsrc.me | `vidsrc.me/embed/movie?tmdb={id}` | `vidsrc.me/embed/tv?tmdb={id}&season={s}&episode={e}` |
| **Source 3** — vidsrc.to | `vidsrc.to/embed/movie/{id}` | `vidsrc.to/embed/tv/{id}/{s}/{e}` |

> 💡 **Tip:** Install [uBlock Origin](https://ublockorigin.com) for the best ad-free experience with embed sources.

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
