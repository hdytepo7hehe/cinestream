import Image from 'next/image';
import Link from 'next/link';
import { Search, Star, Tv, Film } from 'lucide-react';
import type { Metadata } from 'next';
import {
  searchMulti,
  getPosterUrl,
  formatRating,
  formatYear,
  getDisplayTitle,
  getDisplayDate,
} from '@/lib/tmdb';

interface PageProps {
  searchParams: { q?: string };
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  return {
    title: searchParams.q
      ? `Search: "${searchParams.q}" - CineStream`
      : 'Search - CineStream',
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const query = searchParams.q?.trim() || '';

  let results: Awaited<ReturnType<typeof searchMulti>>['results'] = [];
  if (query) {
    try {
      const data = await searchMulti(query);
      results = data.results.filter(
        (r) => r.media_type === 'movie' || r.media_type === 'tv'
      );
    } catch {
      results = [];
    }
  }

  return (
    <div className="min-h-screen bg-cine-bg pt-20 px-4 sm:px-6 lg:px-8 pb-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white text-2xl sm:text-3xl font-bold mb-5 flex items-center gap-3">
            <Search size={26} className="text-cine-red" />
            Search
          </h1>
          <form method="GET" action="/search" className="relative max-w-2xl">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search movies and TV shows..."
              autoFocus
              className="w-full bg-cine-surface border border-cine-border text-white placeholder-cine-muted rounded-xl px-5 py-3.5 pr-14 text-sm sm:text-base focus:outline-none focus:border-cine-red focus:ring-1 focus:ring-cine-red transition-colors"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-cine-muted hover:text-white transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* Results */}
        {query ? (
          <>
            <p className="text-cine-muted text-sm mb-5">
              {results.length > 0
                ? <>{results.length} results for <span className="text-white font-semibold">"{query}"</span></>
                : <>No results for <span className="text-white font-semibold">"{query}"</span></>
              }
            </p>

            {results.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4">
                {results.map((item) => {
                  const title = getDisplayTitle(item);
                  const year = formatYear(getDisplayDate(item));
                  const isTV = item.media_type === 'tv';
                  const href = isTV ? `/tv/${item.id}` : `/movie/${item.id}`;

                  return (
                    // ✅ Single Link — NO nested <a> inside
                    <Link
                      key={`${item.media_type}-${item.id}`}
                      href={href}
                      className="group block"
                    >
                      <div className="relative aspect-[2/3] bg-cine-surface-2 rounded-lg overflow-hidden">
                        {item.poster_path ? (
                          <Image
                            src={getPosterUrl(item.poster_path, 'w342')}
                            alt={title}
                            fill
                            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 14vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-cine-muted gap-2">
                            {isTV ? <Tv size={28} /> : <Film size={28} />}
                          </div>
                        )}

                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200" />

                        {/* Type badge */}
                        <div className="absolute top-1.5 left-1.5">
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                            isTV ? 'bg-blue-600 text-white' : 'bg-cine-red text-white'
                          }`}>
                            {isTV ? 'TV' : 'Movie'}
                          </span>
                        </div>

                        {/* Rating badge */}
                        {(item.vote_average ?? 0) > 0 && (
                          <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/70 rounded px-1.5 py-0.5">
                            <Star size={9} fill="#facc15" className="text-yellow-400" />
                            <span className="text-white text-xs font-bold">
                              {formatRating(item.vote_average ?? 0)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-1.5 px-0.5">
                        <p className="text-white text-xs font-semibold line-clamp-2 leading-tight group-hover:text-gray-300 transition-colors">
                          {title}
                        </p>
                        <p className="text-cine-muted text-xs mt-0.5">{year}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Search size={56} className="text-cine-border mb-4" />
                <h3 className="text-white text-lg font-bold mb-2">No results found</h3>
                <p className="text-cine-muted text-sm max-w-xs">
                  We couldn't find anything for "{query}". Try a different search term.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search size={56} className="text-cine-border mb-4" />
            <h3 className="text-white text-lg font-bold mb-2">Start searching</h3>
            <p className="text-cine-muted text-sm">
              Type a movie or TV show title to find it
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
