import Link from 'next/link';
import { ArrowLeft, Star, Clock, Calendar } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getMovieDetails,
  formatRating,
  formatRuntime,
  formatYear,
} from '@/lib/tmdb';
import VideoPlayer from '@/components/VideoPlayer';
import MovieRow from '@/components/MovieRow';

export const revalidate = 3600;

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const movie = await getMovieDetails(Number(params.id));
    return {
      title: `Watch ${movie.title} - CineStream`,
      description: movie.overview?.slice(0, 160),
    };
  } catch {
    return { title: 'Watch - CineStream' };
  }
}

export default async function WatchMoviePage({ params }: PageProps) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  let movie;
  try {
    movie = await getMovieDetails(id);
  } catch {
    notFound();
  }

  const similar =
    movie.recommendations?.results?.slice(0, 12) ||
    movie.similar?.results?.slice(0, 12) ||
    [];

  return (
    <div className="min-h-screen bg-cine-bg">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-cine-bg/95 backdrop-blur-sm border-b border-cine-border px-4 py-3 flex items-center gap-4">
        <Link
          href={`/movie/${movie.id}`}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Back to Details</span>
        </Link>
        <h1 className="text-white font-bold truncate flex-1 text-sm sm:text-base">
          {movie.title}
          {movie.release_date && (
            <span className="text-cine-muted font-normal ml-2">
              ({formatYear(movie.release_date)})
            </span>
          )}
        </h1>
      </div>

      {/* Player */}
      <div className="w-full bg-black">
        <div className="max-w-6xl mx-auto">
          <VideoPlayer
            tmdbId={movie.id}
            mediaType="movie"
            title={movie.title}
          />
        </div>
      </div>

      {/* Movie info below player */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-white text-2xl sm:text-3xl font-extrabold mb-2">
              {movie.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
              <div className="flex items-center gap-1.5 text-yellow-400">
                <Star size={14} fill="currentColor" />
                <span className="text-white font-semibold">{formatRating(movie.vote_average)}</span>
                <span className="text-cine-muted">/ 10</span>
              </div>
              {movie.runtime && (
                <div className="flex items-center gap-1.5 text-cine-muted">
                  <Clock size={14} />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}
              {movie.release_date && (
                <div className="flex items-center gap-1.5 text-cine-muted">
                  <Calendar size={14} />
                  <span>{formatYear(movie.release_date)}</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres?.map((g) => (
                <span
                  key={g.id}
                  className="text-xs px-2.5 py-1 bg-cine-surface border border-cine-border rounded-full text-cine-muted"
                >
                  {g.name}
                </span>
              ))}
            </div>
            <p className="text-cine-text/80 text-sm leading-relaxed max-w-2xl">
              {movie.overview}
            </p>
          </div>
        </div>

        {/* Recommendations */}
        {similar.length > 0 && (
          <div className="mt-10 -mx-4 sm:-mx-6">
            <MovieRow title="You Might Also Like" items={similar} mediaType="movie" />
          </div>
        )}
      </div>
    </div>
  );
}
