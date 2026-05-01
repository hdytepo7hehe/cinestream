import type { Metadata } from 'next';
import {
  getTrendingTV,
  getPopularTV,
  getTopRatedTV,
  getAiringTodayTV,
} from '@/lib/tmdb';
import MovieRow from '@/components/MovieRow';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'TV Shows',
  description: 'Browse trending, popular, and top rated TV shows on CineStream.',
};

export default async function TVPage() {
  const [trending, popular, topRated, airingToday] = await Promise.all([
    getTrendingTV('week'),
    getPopularTV(),
    getTopRatedTV(),
    getAiringTodayTV(),
  ]);

  // Pick a random backdrop show for the hero banner
  const featuredShows = trending.results.filter((s) => s.backdrop_path && s.overview);
  const featured = featuredShows[Math.floor(Math.random() * Math.min(5, featuredShows.length))];

  return (
    <div className="min-h-screen bg-cine-bg">
      {/* Page hero */}
      <div className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {featured?.backdrop_path && (
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/w1280${featured.backdrop_path})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-cine-bg/20 via-cine-bg/70 to-cine-bg" />
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">
            TV Shows
          </h1>
          <p className="text-cine-muted text-lg">
            Discover trending series, binge-worthy shows, and critically acclaimed TV.
          </p>
        </div>
      </div>

      {/* Rows */}
      <div className="pb-16 space-y-8 -mt-4">
        <MovieRow
          title="🔥 Trending This Week"
          items={trending.results}
          mediaType="tv"
        />
        <MovieRow
          title="📺 Airing Today"
          items={airingToday.results}
          mediaType="tv"
        />
        <MovieRow
          title="⭐ Popular TV Shows"
          items={popular.results}
          mediaType="tv"
        />
        <MovieRow
          title="🏆 Top Rated"
          items={topRated.results}
          mediaType="tv"
        />
      </div>
    </div>
  );
}
