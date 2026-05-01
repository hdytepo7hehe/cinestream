import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Play, Star, Clock, Calendar, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import {
  getMovieDetails,
  getPosterUrl,
  getBackdropUrl,
  getProfileUrl,
  formatRating,
  formatYear,
  formatRuntime,
} from '@/lib/tmdb';
import MovieRow from '@/components/MovieRow';
import TrailerButton from '@/components/TrailerButton';

export const revalidate = 3600;

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const movie = await getMovieDetails(Number(params.id));
    return {
      title: movie.title,
      description: movie.overview?.slice(0, 160),
      openGraph: {
        images: movie.backdrop_path ? [getBackdropUrl(movie.backdrop_path, 'w780')] : [],
      },
    };
  } catch {
    return { title: 'Movie Not Found' };
  }
}

export default async function MovieDetailPage({ params }: PageProps) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  let movie;
  try {
    movie = await getMovieDetails(id);
  } catch {
    notFound();
  }

  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'original');
  const posterUrl = getPosterUrl(movie.poster_path, 'w500');
  const director = movie.credits?.crew?.find((c) => c.job === 'Director');
  const topCast = movie.credits?.cast?.slice(0, 12) || [];
  const trailer = movie.videos?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  );
  const similar = movie.recommendations?.results?.slice(0, 12) || movie.similar?.results?.slice(0, 12) || [];

  return (
    <div className="min-h-screen bg-cine-bg animate-fade-in">
      {/* Backdrop */}
      <div className="relative h-[60vh] sm:h-[70vh] overflow-hidden">
        {movie.backdrop_path && (
          <Image
            src={backdropUrl}
            alt={movie.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-cine-bg via-cine-bg/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cine-bg/60 to-transparent" />

        {/* Back button */}
        <div className="absolute top-20 left-4 sm:left-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-sm transition-all"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-10">
        <div className="flex flex-col sm:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 mx-auto sm:mx-0">
            <div className="relative w-48 sm:w-64 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <Image
                src={posterUrl}
                alt={movie.title}
                fill
                sizes="(max-width: 640px) 192px, 256px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-4">
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-3">
              {movie.genres?.map((g) => (
                <span
                  key={g.id}
                  className="text-xs px-2.5 py-1 bg-cine-surface border border-cine-border rounded-full text-cine-muted"
                >
                  {g.name}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-2">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-cine-muted text-lg italic mb-4">"{movie.tagline}"</p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              <div className="flex items-center gap-1.5 text-yellow-400">
                <Star size={16} fill="currentColor" />
                <span className="text-white font-bold text-base">{formatRating(movie.vote_average)}</span>
                <span className="text-cine-muted">/ 10</span>
                <span className="text-cine-muted text-xs">({movie.vote_count?.toLocaleString()} votes)</span>
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
                  <span>{new Date(movie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              )}
              {movie.status && (
                <span className="px-2.5 py-0.5 bg-green-900/40 border border-green-700/40 text-green-400 text-xs rounded-full font-medium">
                  {movie.status}
                </span>
              )}
            </div>

            {/* Overview */}
            <p className="text-cine-text/90 text-base leading-relaxed mb-6 max-w-2xl">
              {movie.overview}
            </p>

            {/* Director */}
            {director && (
              <p className="text-cine-muted text-sm mb-6">
                <span className="text-white font-semibold">Director:</span>{' '}
                {director.name}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/watch/movie/${movie.id}`}
                className="flex items-center gap-2 bg-cine-red hover:bg-cine-red-dark text-white font-bold px-8 py-3 rounded-lg transition-colors shadow-lg shadow-cine-red/25 text-sm sm:text-base"
              >
                <Play size={20} fill="currentColor" />
                Watch Now
              </Link>
              {trailer && (
                <TrailerButton trailerKey={trailer.key} title={movie.title} />
              )}
            </div>
          </div>
        </div>

        {/* Cast */}
        {topCast.length > 0 && (
          <section className="mt-12">
            <h2 className="text-white text-2xl font-bold mb-5">Cast</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-3">
              {topCast.map((actor) => (
                <div key={actor.id} className="text-center group">
                  <div className="relative w-full aspect-square rounded-full overflow-hidden bg-cine-surface-2 mx-auto mb-2 ring-2 ring-cine-border group-hover:ring-cine-red transition-all">
                    <Image
                      src={getProfileUrl(actor.profile_path, 'w185')}
                      alt={actor.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <p className="text-white text-xs font-medium leading-tight line-clamp-2">{actor.name}</p>
                  <p className="text-cine-muted text-xs leading-tight line-clamp-1 mt-0.5">{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar / Recommendations */}
        {similar.length > 0 && (
          <div className="mt-12 -mx-4 sm:-mx-6 lg:-mx-8">
            <MovieRow
              title="More Like This"
              items={similar}
              mediaType="movie"
            />
          </div>
        )}
      </div>
    </div>
  );
}
