'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, X, Menu, ChevronDown } from 'lucide-react';
import { MOVIE_GENRES, TV_GENRES } from '@/lib/genres';

export default function Navbar() {
  const [scrolled,        setScrolled]        = useState(false);
  const [searchOpen,      setSearchOpen]       = useState(false);
  const [searchQuery,     setSearchQuery]      = useState('');
  const [mobileOpen,      setMobileOpen]       = useState(false);
  const [movieDropdown,   setMovieDropdown]    = useState(false);
  const [tvDropdown,      setTVDropdown]       = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 60);
  }, [searchOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setMovieDropdown(false);
    setTVDropdown(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  }, [searchQuery, router]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0a]/95 backdrop-blur-md shadow-xl border-b border-white/5'
          : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center h-14 sm:h-16 gap-6">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <span className="text-cine-red font-black text-xl sm:text-2xl tracking-tight">
                CINE<span className="text-white">STREAM</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1 flex-1">
              <Link href="/"
                className={`px-3 py-2 text-sm font-medium rounded transition-colors ${pathname === '/' ? 'text-white' : 'text-white/60 hover:text-white'}`}>
                Home
              </Link>

              {/* Movies dropdown */}
              <div className="relative"
                onMouseEnter={() => setMovieDropdown(true)}
                onMouseLeave={() => setMovieDropdown(false)}>
                <Link href="/movies"
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded transition-colors ${pathname.startsWith('/movie') ? 'text-white' : 'text-white/60 hover:text-white'}`}>
                  Movies <ChevronDown size={13} className={`transition-transform ${movieDropdown ? 'rotate-180' : ''}`} />
                </Link>
                {movieDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-[#141414] border border-white/10 rounded-xl shadow-2xl p-2 grid grid-cols-2 gap-0.5 animate-fade-in">
                    {MOVIE_GENRES.map((g) => (
                      <Link key={g.id} href={`/genre/movie/${g.id}?name=${encodeURIComponent(g.name)}`}
                        className="text-white/60 hover:text-white hover:bg-white/5 text-xs px-2.5 py-1.5 rounded-lg transition-colors truncate">
                        {g.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* TV dropdown */}
              <div className="relative"
                onMouseEnter={() => setTVDropdown(true)}
                onMouseLeave={() => setTVDropdown(false)}>
                <Link href="/tv"
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded transition-colors ${pathname.startsWith('/tv') ? 'text-white' : 'text-white/60 hover:text-white'}`}>
                  TV Shows <ChevronDown size={13} className={`transition-transform ${tvDropdown ? 'rotate-180' : ''}`} />
                </Link>
                {tvDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-[#141414] border border-white/10 rounded-xl shadow-2xl p-2 grid grid-cols-2 gap-0.5 animate-fade-in">
                    {TV_GENRES.map((g) => (
                      <Link key={g.id} href={`/genre/tv/${g.id}?name=${encodeURIComponent(g.name)}`}
                        className="text-white/60 hover:text-white hover:bg-white/5 text-xs px-2.5 py-1.5 rounded-lg transition-colors truncate">
                        {g.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/search"
                className={`px-3 py-2 text-sm font-medium rounded transition-colors ${pathname === '/search' ? 'text-white' : 'text-white/60 hover:text-white'}`}>
                Search
              </Link>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 ml-auto">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <div className="flex items-center bg-[#1a1a1a] border border-white/15 rounded-full overflow-hidden pr-2">
                    <Search className="ml-3 text-white/40 flex-shrink-0" size={15} />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
                      placeholder="Titles, movies, TV shows…"
                      className="bg-transparent text-white placeholder-white/30 text-sm px-3 py-2 focus:outline-none w-44 sm:w-64"
                    />
                    <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                      className="text-white/40 hover:text-white transition-colors">
                      <X size={15} />
                    </button>
                  </div>
                </form>
              ) : (
                <button onClick={() => setSearchOpen(true)}
                  className="p-2 text-white/60 hover:text-white transition-colors rounded-md hover:bg-white/5"
                  aria-label="Search">
                  <Search size={19} />
                </button>
              )}

              {/* Mobile hamburger */}
              <button className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[#0d0d0d]/98 backdrop-blur-md border-t border-white/8 animate-fade-in max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-3 space-y-1">
              {[
                { href: '/',       label: 'Home' },
                { href: '/movies', label: 'Movies' },
                { href: '/tv',     label: 'TV Shows' },
                { href: '/search', label: 'Search' },
              ].map(({ href, label }) => (
                <Link key={href} href={href}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === href ? 'bg-cine-red/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}>
                  {label}
                </Link>
              ))}

              <div className="pt-2 pb-1 px-4">
                <p className="text-white/30 text-xs uppercase tracking-widest font-semibold mb-2">Movie Genres</p>
                <div className="grid grid-cols-3 gap-1">
                  {MOVIE_GENRES.map((g) => (
                    <Link key={g.id} href={`/genre/movie/${g.id}?name=${encodeURIComponent(g.name)}`}
                      className="text-white/50 hover:text-white text-xs py-1.5 px-2 rounded-md hover:bg-white/5 transition-colors truncate">
                      {g.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-2 pb-2 px-4">
                <p className="text-white/30 text-xs uppercase tracking-widest font-semibold mb-2">TV Genres</p>
                <div className="grid grid-cols-3 gap-1">
                  {TV_GENRES.map((g) => (
                    <Link key={g.id} href={`/genre/tv/${g.id}?name=${encodeURIComponent(g.name)}`}
                      className="text-white/50 hover:text-white text-xs py-1.5 px-2 rounded-md hover:bg-white/5 transition-colors truncate">
                      {g.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile search */}
              <form onSubmit={handleSearch} className="px-4 py-2">
                <div className="flex items-center bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden">
                  <Search className="ml-3 text-white/40 flex-shrink-0" size={15} />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search…"
                    className="bg-transparent text-white placeholder-white/30 text-sm px-3 py-3 focus:outline-none flex-1" />
                  {searchQuery && (
                    <button type="submit" className="px-3 text-cine-red text-xs font-bold">Go</button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
