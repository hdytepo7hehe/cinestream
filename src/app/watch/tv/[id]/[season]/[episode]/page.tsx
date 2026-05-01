import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Star } from 'lucide-react';
import { getTVDetails, getTVSeasonDetails, formatRating } from '@/lib/tmdb';
import VideoPlayer from '@/components/VideoPlayer';
import EpisodeSelector from '@/components/EpisodeSelector';
import MovieRow from '@/components/MovieRow';

export const revalidate = 3600;

interface PageProps { params: { id: string; season: string; episode: string } }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const show = await getTVDetails(Number(params.id));
    return { title: `Watch ${show.name} S${params.season}E${params.episode} - CineStream` };
  } catch { return { title: 'Watch - CineStream' }; }
}

export default async function WatchTVPage({ params }: PageProps) {
  const id      = Number(params.id);
  const season  = Number(params.season);
  const episode = Number(params.episode);
  if (isNaN(id) || isNaN(season) || isNaN(episode)) notFound();

  let show, seasonData;
  try {
    [show, seasonData] = await Promise.all([
      getTVDetails(id),
      getTVSeasonDetails(id, season),
    ]);
  } catch { notFound(); }

  const currentEp = seasonData.episodes?.find((e) => e.episode_number === episode);
  const similar   = show.recommendations?.results?.slice(0, 12)
    || show.similar?.results?.slice(0, 12) || [];
  const seasons   = show.seasons?.filter((s) => s.season_number > 0) || [];

  return (
    <div className="min-h-screen bg-cine-bg">
      <div className="w-full bg-black pt-14 sm:pt-16">
        <div className="max-w-[1400px] mx-auto">
          <VideoPlayer
            tmdbId={show.id}
            mediaType="tv"
            season={season}
            episode={episode}
            title={`${show.name}`}
            backHref={`/tv/${show.id}`}
          />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        {/* Current episode info */}
        {currentEp && (
          <div className="max-w-4xl mb-8 pb-8 border-b border-white/8">
            <h1 className="text-white text-xl sm:text-2xl font-extrabold mb-1">{show.name}</h1>
            <h2 className="text-white/70 text-base font-semibold mb-2">
              S{String(season).padStart(2,'0')}E{String(episode).padStart(2,'0')} — {currentEp.name}
            </h2>
            <div className="flex items-center gap-3 text-xs text-white/40 mb-3">
              {currentEp.air_date && <span>{currentEp.air_date}</span>}
              {currentEp.runtime  && <span>{currentEp.runtime}m</span>}
              {currentEp.vote_average > 0 && (
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star size={10} fill="currentColor" />
                  {formatRating(currentEp.vote_average)}
                </span>
              )}
            </div>
            {currentEp.overview && (
              <p className="text-white/60 text-sm leading-relaxed">{currentEp.overview}</p>
            )}
          </div>
        )}

        <EpisodeSelector
          tvId={show.id}
          seasons={seasons}
          currentSeason={season}
          currentEpisode={episode}
        />

        {similar.length > 0 && (
          <div className="mt-12 -mx-4 sm:-mx-6 lg:-mx-10">
            <MovieRow title="More Like This" items={similar} mediaType="tv" />
          </div>
        )}
      </div>
    </div>
  );
}
