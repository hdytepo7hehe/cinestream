import type { Metadata } from 'next';
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
} from '@/lib/tmdb';
import MovieRow from '@/components/MovieRow';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Movies - CineStream',
  description: 'Browse trending, popular, and top rated movies.',
};

export default async function MoviesPage() {
  const [trending, popular, topRated, nowPlaying, upcoming] = await Promise.all([
    getTrendingMovies('week'),
    getPopularMovies(),
    getTopRatedMovies(),
    getNowPlayingMovies(),
    getUpcomingMovies(),
  ]);

  return (
    <div className="min-h-screen bg-cine-bg pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h1 className="text-white text-4xl font-extrabold">
          <span className="border-l-4 border-cine-red pl-4">Movies</span>
        </h1>
        <p className="text-cine-muted mt-2">
          Browse the latest trending, popular, and top rated films
        </p>
      </div>

      <MovieRow title="🔥 Trending This Week" items={trending.results} mediaType="movie" />
      <MovieRow title="▶ Now Playing" items={nowPlaying.results} mediaType="movie" />
      <MovieRow title="⭐ Top Rated" items={topRated.results} mediaType="movie" />
      <MovieRow title="🎬 Popular" items={popular.results} mediaType="movie" />
      <MovieRow title="🗓 Coming Soon" items={upcoming.results} mediaType="movie" />
    </div>
  );
}
