import Link from 'next/link';
import { ArrowLeft, Star } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getTVDetails,
  getTVSeasonDetails,
  formatRating,
} from '@/lib/tmdb';
import VideoPlayer from '@/components/VideoPlayer';
import EpisodeSelector from '@/components/EpisodeSelector';
import MovieRow from '@/components/MovieRow';

export const revalidate = 3600;

interface PageProps {
  params: { id: string; season: string; episode: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const show = await getTVDetails(Number(params.id));
    return {
      title: `Watch ${show.name} S${params.season}E${params.episode} - CineStream`,
      description: show.overview?.slice(0, 160),
    };
  } catch {
    return { title: 'Watch - CineStream' };
  }
}

export default async function WatchTVPage({ params }: PageProps) {
  const id = Number(params.id);
  const season = Number(params.season);
  const episode = Number(params.episode);

  if (isNaN(id) || isNaN(season) || isNaN(episode)) notFound();

  let show;
  let seasonData;
  try {
    [show, seasonData] = await Promise.all([
      getTVDetails(id),
      getTVSeasonDetails(id, season),
    ]);
  } catch {
    notFound();
  }

  const currentEpisode = seasonData.episodes?.find(
    (e) => e.episode_number === episode
  );

  const similar =
    show.recommendations?.results?.slice(0, 12) ||
    show.similar?.results?.slice(0, 12) ||
    [];

  const seasons = show.seasons?.filter((s) => s.season_number > 0) || [];

  return (
    <div className="min-h-screen bg-cine-bg">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-cine-bg/95 backdrop-blur-sm border-b border-cine-border px-4 py-3 flex items-center gap-4">
        <Link
          href={`/tv/${show.id}`}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm flex-shrink-0"
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Back to {show.name}</span>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-white font-bold truncate text-sm sm:text-base">
            {show.name}
          </h1>
          <p className="text-cine-muted text-xs truncate">
            Season {season}, Episode {episode}
            {currentEpisode?.name ? ` — ${currentEpisode.name}` : ''}
          </p>
        </div>
      </div>

      {/* Player */}
      <div className="w-full bg-black">
        <div className="max-w-6xl mx-auto">
          <VideoPlayer
            tmdbId={show.id}
            mediaType="tv"
            season={season}
            episode={episode}
            title={`${show.name} S${String(season).padStart(2, '0')}E${String(episode).padStart(2, '0')}`}
          />
        </div>
      </div>

      {/* Info + Episode Selector */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Current episode info */}
        {currentEpisode && (
          <div className="mb-8 pb-8 border-b border-cine-border">
            <h2 className="text-white text-xl font-bold mb-1">
              {currentEpisode.name}
            </h2>
            <div className="flex items-center gap-3 mb-3 text-sm text-cine-muted">
              <span>S{String(season).padStart(2,'0')}E{String(episode).padStart(2,'0')}</span>
              {currentEpisode.air_date && <span>{currentEpisode.air_date}</span>}
              {currentEpisode.runtime && <span>{currentEpisode.runtime}m</span>}
              {currentEpisode.vote_average > 0 && (
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star size={12} fill="currentColor" />
                  {formatRating(currentEpisode.vote_average)}
                </span>
              )}
            </div>
            {currentEpisode.overview && (
              <p className="text-cine-text/80 text-sm leading-relaxed max-w-2xl">
                {currentEpisode.overview}
              </p>
            )}
          </div>
        )}

        {/* Episode Selector */}
        <EpisodeSelector
          tvId={show.id}
          seasons={seasons}
          currentSeason={season}
          currentEpisode={episode}
        />

        {/* Recommendations */}
        {similar.length > 0 && (
          <div className="mt-10 -mx-4 sm:-mx-6">
            <MovieRow title="More Like This" items={similar} mediaType="tv" />
          </div>
        )}
      </div>
    </div>
  );
}
