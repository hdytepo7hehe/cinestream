import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Play, Star, Calendar, Tv, ArrowLeft, ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';
import {
  getTVDetails,
  getPosterUrl,
  getBackdropUrl,
  getProfileUrl,
  formatRating,
  formatYear,
} from '@/lib/tmdb';
import MovieRow from '@/components/MovieRow';

export const revalidate = 3600;

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const show = await getTVDetails(Number(params.id));
    return {
      title: show.name,
      description: show.overview?.slice(0, 160),
      openGraph: {
        images: show.backdrop_path ? [getBackdropUrl(show.backdrop_path, 'w780')] : [],
      },
    };
  } catch {
    return { title: 'Show Not Found' };
  }
}

export default async function TVDetailPage({ params }: PageProps) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  let show;
  try {
    show = await getTVDetails(id);
  } catch {
    notFound();
  }

  const backdropUrl = getBackdropUrl(show.backdrop_path, 'original');
  const posterUrl = getPosterUrl(show.poster_path, 'w500');
  const topCast = show.credits?.cast?.slice(0, 12) || [];
  const trailer = show.videos?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  );
  const similar =
    show.recommendations?.results?.slice(0, 12) ||
    show.similar?.results?.slice(0, 12) ||
    [];
  const seasons = show.seasons?.filter((s) => s.season_number > 0) || [];

  return (
    <div className="min-h-screen bg-cine-bg animate-fade-in">
      {/* Backdrop */}
      <div className="relative h-[60vh] sm:h-[70vh] overflow-hidden">
        {show.backdrop_path && (
          <Image
            src={backdropUrl}
            alt={show.name}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-cine-bg via-cine-bg/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cine-bg/60 to-transparent" />

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
                alt={show.name}
                fill
                sizes="(max-width: 640px) 192px, 256px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {show.genres?.map((g) => (
                <span
                  key={g.id}
                  className="text-xs px-2.5 py-1 bg-cine-surface border border-cine-border rounded-full text-cine-muted"
                >
                  {g.name}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-2">
              {show.name}
            </h1>

            {show.tagline && (
              <p className="text-cine-muted text-lg italic mb-4">"{show.tagline}"</p>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              <div className="flex items-center gap-1.5 text-yellow-400">
                <Star size={16} fill="currentColor" />
                <span className="text-white font-bold text-base">{formatRating(show.vote_average)}</span>
                <span className="text-cine-muted">/ 10</span>
              </div>
              {show.first_air_date && (
                <div className="flex items-center gap-1.5 text-cine-muted">
                  <Calendar size={14} />
                  <span>{formatYear(show.first_air_date)}</span>
                </div>
              )}
              {show.number_of_seasons && (
                <div className="flex items-center gap-1.5 text-cine-muted">
                  <Tv size={14} />
                  <span>
                    {show.number_of_seasons} Season{show.number_of_seasons > 1 ? 's' : ''} ·{' '}
                    {show.number_of_episodes} Episodes
                  </span>
                </div>
              )}
              {show.status && (
                <span
                  className={`px-2.5 py-0.5 text-xs rounded-full font-medium border ${
                    show.status === 'Returning Series'
                      ? 'bg-green-900/40 border-green-700/40 text-green-400'
                      : 'bg-cine-surface border-cine-border text-cine-muted'
                  }`}
                >
                  {show.status}
                </span>
              )}
            </div>

            <p className="text-cine-text/90 text-base leading-relaxed mb-6 max-w-2xl">
              {show.overview}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/watch/tv/${show.id}/1/1`}
                className="flex items-center gap-2 bg-cine-red hover:bg-cine-red-dark text-white font-bold px-8 py-3 rounded-lg transition-colors shadow-lg shadow-cine-red/25 text-sm sm:text-base"
              >
                <Play size={20} fill="currentColor" />
                Watch S1E1
              </Link>
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-cine-surface hover:bg-cine-surface-2 text-white font-semibold px-6 py-3 rounded-lg border border-cine-border transition-colors text-sm sm:text-base"
                >
                  <ExternalLink size={18} />
                  Trailer
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Seasons */}
        {seasons.length > 0 && (
          <section className="mt-12">
            <h2 className="text-white text-2xl font-bold mb-5">Seasons</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {seasons.map((season) => (
                <Link
                  key={season.id}
                  href={`/watch/tv/${show.id}/${season.season_number}/1`}
                  className="group bg-cine-surface rounded-lg overflow-hidden border border-cine-border hover:border-cine-red transition-all"
                >
                  <div className="relative aspect-[2/3] bg-cine-surface-2">
                    {season.poster_path ? (
                      <Image
                        src={getPosterUrl(season.poster_path, 'w342')}
                        alt={season.name}
                        fill
                        sizes="180px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Tv size={32} className="text-cine-muted" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <Play
                        size={32}
                        className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        fill="currentColor"
                      />
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-white text-xs font-semibold truncate">{season.name}</p>
                    <p className="text-cine-muted text-xs">{season.episode_count} eps</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

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

        {/* Recommendations */}
        {similar.length > 0 && (
          <div className="mt-12 -mx-4 sm:-mx-6 lg:-mx-8">
            <MovieRow title="More Like This" items={similar} mediaType="tv" />
          </div>
        )}
      </div>
    </div>
  );
}
