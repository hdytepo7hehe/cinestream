import Link from 'next/link';
import { MOVIE_GENRES, TV_GENRES } from '@/lib/genres';

export default function Footer() {
  return (
    <footer className="bg-[#0d0d0d] border-t border-white/5 pt-12 pb-8 mt-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/">
              <span className="text-cine-red font-black text-xl tracking-tight">
                CINE<span className="text-white">STREAM</span>
              </span>
            </Link>
            <p className="text-white/30 text-xs leading-relaxed mt-3 max-w-xs">
              Free streaming destination for movies & TV shows.
              Movie data by TMDb. Video by third-party embed services.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-3">Navigate</h4>
            <ul className="space-y-2 text-xs text-white/40">
              {[
                { href: '/',       label: 'Home' },
                { href: '/movies', label: 'Movies' },
                { href: '/tv',     label: 'TV Shows' },
                { href: '/search', label: 'Search' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Movie Genres */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-3">Movie Genres</h4>
            <ul className="space-y-1.5 text-xs text-white/40">
              {MOVIE_GENRES.slice(0, 8).map((g) => (
                <li key={g.id}>
                  <Link
                    href={`/genre/movie/${g.id}?name=${encodeURIComponent(g.name)}`}
                    className="hover:text-white transition-colors"
                  >
                    {g.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* TV Genres */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-3">TV Genres</h4>
            <ul className="space-y-1.5 text-xs text-white/40">
              {TV_GENRES.slice(0, 8).map((g) => (
                <li key={g.id}>
                  <Link
                    href={`/genre/tv/${g.id}?name=${encodeURIComponent(g.name)}`}
                    className="hover:text-white transition-colors"
                  >
                    {g.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-3">Legal</h4>
            <p className="text-white/25 text-xs leading-relaxed">
              This product uses the TMDb API but is not endorsed or certified by TMDb.
              Video content is embedded from third-party sources for educational purposes only.
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} CineStream. For educational purposes only.
          </p>
          <p className="text-white/15 text-xs">
            Powered by <span className="text-white/30">TMDb</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
