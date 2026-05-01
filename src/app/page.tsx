import HeroWrapper from '@/components/HeroWrapper';
import MovieRow from '@/components/MovieRow';
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getTrendingTV,
  getPopularTV,
} from '@/lib/tmdb';

export const revalidate = 3600;

export default async function HomePage() {
  const [
    trendingMovies,
    popularMovies,
    topRatedMovies,
    nowPlaying,
    trendingTV,
    popularTV,
  ] = await Promise.all([
    getTrendingMovies('week'),
    getPopularMovies(),
    getTopRatedMovies(),
    getNowPlayingMovies(),
    getTrendingTV('week'),
    getPopularTV(),
  ]);

  // Pass all hero candidates to the client wrapper which picks randomly after mount
  // This avoids SSR/client Math.random() hydration mismatch
  const heroItems = trendingMovies.results
    .filter((m) => m.backdrop_path && m.overview)
    .slice(0, 8);

  return (
    <div className="bg-cine-bg">
      {/* HeroWrapper is a client component — randomises after hydration */}
      <HeroWrapper items={heroItems} />

      <div className="relative z-10 -mt-24 sm:-mt-32 pb-16 space-y-6 sm:space-y-8">
        <MovieRow title="🔥 Trending This Week"  items={trendingMovies.results} mediaType="movie" />
        <MovieRow title="▶️ Now Playing"          items={nowPlaying.results}     mediaType="movie" />
        <MovieRow title="⭐ Popular Movies"       items={popularMovies.results}  mediaType="movie" />
        <MovieRow title="🏆 Top Rated Movies"    items={topRatedMovies.results} mediaType="movie" />
        <MovieRow title="📺 Trending TV Shows"   items={trendingTV.results}     mediaType="tv"    />
        <MovieRow title="📺 Popular TV Shows"    items={popularTV.results}      mediaType="tv"    />
      </div>
    </div>
  );
}
