import Image from 'next/image';
import Link from 'next/link';
import { Search, Play, Star, Tv, Film } from 'lucide-react';
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
    <div className="min-h-screen bg-cine-bg pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Search header */}
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold mb-6 flex items-center gap-3">
            <Search size={28} className="text-cine-red" />
            Search
          </h1>
          <form method="GET" action="/search" className="relative max-w-2xl">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search movies and TV shows..."
              autoFocus
              className="w-full bg-cine-surface border border-cine-border text-white placeholder-cine-muted rounded-xl px-5 py-4 pr-14 text-base focus:outline-none focus:border-cine-red focus:ring-1 focus:ring-cine-red transition-colors"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-cine-muted hover:text-white transition-colors"
            >
              <Search size={20} />
            </button>
          </form>
        </div>

        {/* Results */}
        {query ? (
          <>
            <div className="mb-6 flex items-center gap-2">
              <h2 className="text-cine-muted text-sm">
                {results.length > 0
                  ? `Found ${results.length} results for `
                  : `No results found for `}
                <span className="text-white font-semibold">"{query}"</span>
              </h2>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {results.map((item) => {
                  const title = getDisplayTitle(item);
                  const year = formatYear(getDisplayDate(item));
                  const isTV = item.media_type === 'tv';
                  const href = isTV ? `/tv/${item.id}` : `/movie/${item.id}`;
                  const watchHref = isTV ? `/watch/tv/${item.id}/1/1` : `/watch/movie/${item.id}`;

                  return (
                    <div key={`${item.media_type}-${item.id}`} className="group relative">
                      <Link href={href} className="block">
                        <div className="relative aspect-[2/3] bg-cine-surface-2 rounded-lg overflow-hidden">
                          {item.poster_path ? (
                            <Image
                              src={getPosterUrl(item.poster_path, 'w342')}
                              alt={title}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-cine-muted">
                              {isTV ? <Tv size={32} /> : <Film size={32} />}
                              <span className="text-xs mt-2 text-center px-2">{title}</span>
                            </div>
                          )}

                          {/* Type badge */}
                          <div className="absolute top-2 left-2">
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                isTV
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-cine-red text-white'
                              }`}
                            >
                              {isTV ? 'TV' : 'Movie'}
                            </span>
                          </div>

                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Link
                              href={watchHref}
                              onClick={(e) => e.stopPropagation()}
                              className="bg-white rounded-full p-3 hover:scale-110 transition-transform"
                            >
                              <Play size={18} className="text-black" fill="black" />
                            </Link>
                          </div>
                        </div>

                        <div className="mt-2 px-1">
                          <p className="text-white text-xs font-semibold line-clamp-2 leading-tight">
                            {title}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-cine-muted text-xs">{year}</span>
                            {(item.vote_average ?? 0) > 0 && (
                              <span className="flex items-center gap-0.5 text-yellow-400 text-xs">
                                <Star size={10} fill="currentColor" />
                                {formatRating(item.vote_average ?? 0)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Search size={64} className="text-cine-border mb-4" />
                <h3 className="text-white text-xl font-bold mb-2">No results found</h3>
                <p className="text-cine-muted text-sm max-w-sm">
                  We couldn't find anything matching "{query}". Try a different search term.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search size={64} className="text-cine-border mb-4" />
            <h3 className="text-white text-xl font-bold mb-2">Start searching</h3>
            <p className="text-cine-muted text-sm">
              Type a movie or TV show title to find it
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
