import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Star, Clock, Calendar } from 'lucide-react';
import { getMovieDetails, formatRating, formatRuntime, formatYear } from '@/lib/tmdb';
import VideoPlayer from '@/components/VideoPlayer';
import MovieRow from '@/components/MovieRow';

export const revalidate = 3600;

interface PageProps { params: { id: string } }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const movie = await getMovieDetails(Number(params.id));
    return { title: `Watch ${movie.title} - CineStream`, description: movie.overview?.slice(0, 160) };
  } catch { return { title: 'Watch - CineStream' }; }
}

export default async function WatchMoviePage({ params }: PageProps) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  let movie;
  try { movie = await getMovieDetails(id); }
  catch { notFound(); }

  const similar = movie.recommendations?.results?.slice(0, 12)
    || movie.similar?.results?.slice(0, 12) || [];

  return (
    <div className="min-h-screen bg-cine-bg">
      {/* Full-width player, no top bar — X button is inside VideoPlayer */}
      <div className="w-full bg-black pt-14 sm:pt-16">
        <div className="max-w-[1400px] mx-auto">
          <VideoPlayer
            tmdbId={movie.id}
            mediaType="movie"
            title={movie.title}
            backHref={`/movie/${movie.id}`}
          />
        </div>
      </div>

      {/* Info */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <div className="max-w-4xl">
          <h1 className="text-white text-2xl sm:text-3xl font-extrabold mb-3">{movie.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-1.5 text-yellow-400">
              <Star size={14} fill="currentColor" />
              <span className="text-white font-bold">{formatRating(movie.vote_average)}</span>
              <span className="text-white/40">/ 10</span>
            </div>
            {movie.runtime && (
              <div className="flex items-center gap-1.5 text-white/50">
                <Clock size={13} /><span>{formatRuntime(movie.runtime)}</span>
              </div>
            )}
            {movie.release_date && (
              <div className="flex items-center gap-1.5 text-white/50">
                <Calendar size={13} /><span>{formatYear(movie.release_date)}</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres?.map((g) => (
              <span key={g.id} className="text-xs px-2.5 py-1 bg-white/8 border border-white/10 rounded-full text-white/60">
                {g.name}
              </span>
            ))}
          </div>
          <p className="text-white/70 text-sm leading-relaxed">{movie.overview}</p>
        </div>

        {similar.length > 0 && (
          <div className="mt-12 -mx-4 sm:-mx-6 lg:-mx-10">
            <MovieRow title="More Like This" items={similar} mediaType="movie" />
          </div>
        )}
      </div>
    </div>
  );
}
