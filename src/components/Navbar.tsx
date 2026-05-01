'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, X, Film, Tv, Menu, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Auto-focus search input when opened
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = searchQuery.trim();
      if (q) {
        router.push(`/search?q=${encodeURIComponent(q)}`);
        setSearchOpen(false);
        setSearchQuery('');
      }
    },
    [searchQuery, router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/movies', label: 'Movies', icon: Film },
    { href: '/tv', label: 'TV Shows', icon: Tv },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-cine-bg/95 navbar-blur shadow-2xl border-b border-cine-border/50'
          : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            <span className="text-cine-red font-extrabold text-2xl tracking-tight group-hover:opacity-90 transition-opacity">
              CINE<span className="text-white">STREAM</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === href
                    ? 'text-white bg-white/10'
                    : 'text-cine-muted hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search form */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="flex items-center bg-cine-surface border border-cine-border rounded-full overflow-hidden pr-2">
                  <Search className="ml-3 text-cine-muted flex-shrink-0" size={16} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search movies, TV shows..."
                    className="bg-transparent text-white placeholder-cine-muted text-sm px-3 py-2 focus:outline-none w-52 sm:w-72"
                  />
                  <button
                    type="button"
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    className="text-cine-muted hover:text-white transition-colors ml-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-cine-muted hover:text-white transition-colors rounded-md hover:bg-white/5"
                aria-label="Open search"
              >
                <Search size={20} />
              </button>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-cine-muted hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-cine-surface/95 navbar-blur border-t border-cine-border rounded-b-xl overflow-hidden animate-fade-in">
            <div className="px-2 py-3 space-y-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === href
                      ? 'text-white bg-cine-red/20 text-cine-red'
                      : 'text-cine-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  {Icon && <Icon size={16} />}
                  {label}
                </Link>
              ))}
              {/* Mobile search */}
              <form
                onSubmit={handleSearch}
                className="px-4 py-2"
              >
                <div className="flex items-center bg-cine-bg border border-cine-border rounded-lg overflow-hidden">
                  <Search className="ml-3 text-cine-muted flex-shrink-0" size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="bg-transparent text-white placeholder-cine-muted text-sm px-3 py-2.5 focus:outline-none flex-1"
                  />
                  {searchQuery && (
                    <button type="submit" className="px-3 text-cine-red text-xs font-semibold">
                      Go
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
