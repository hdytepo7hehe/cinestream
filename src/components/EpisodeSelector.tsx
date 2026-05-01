'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Play, Star, Clock } from 'lucide-react';
import { Season, SeasonDetails, Episode, getTVSeasonDetails, getPosterUrl } from '@/lib/tmdb';

interface EpisodeSelectorProps {
  tvId: number;
  seasons: Season[];
  currentSeason: number;
  currentEpisode: number;
}

export default function EpisodeSelector({
  tvId,
  seasons,
  currentSeason,
  currentEpisode,
}: EpisodeSelectorProps) {
  const [selectedSeason, setSelectedSeason] = useState(currentSeason);
  const [seasonDetails, setSeasonDetails] = useState<SeasonDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false);

  // Filter out "specials" (season 0) unless it's the only option
  const regularSeasons = seasons.filter((s) => s.season_number > 0);

  useEffect(() => {
    async function fetchSeason() {
      setLoading(true);
      try {
        const data = await getTVSeasonDetails(tvId, selectedSeason);
        setSeasonDetails(data);
      } catch (err) {
        console.error('Failed to fetch season details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSeason();
  }, [tvId, selectedSeason]);

  const currentSeasonInfo = seasons.find((s) => s.season_number === selectedSeason);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-xl font-bold">Episodes</h3>

        {/* Season selector */}
        <div className="relative">
          <button
            onClick={() => setSeasonDropdownOpen(!seasonDropdownOpen)}
            className="flex items-center gap-2 bg-cine-surface border border-cine-border text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cine-surface-2 transition-colors"
          >
            Season {selectedSeason}
            <ChevronDown
              size={16}
              className={`transition-transform ${seasonDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {seasonDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-cine-surface border border-cine-border rounded-xl shadow-2xl z-20 overflow-hidden animate-fade-in">
              {regularSeasons.map((season) => (
                <button
                  key={season.season_number}
                  onClick={() => {
                    setSelectedSeason(season.season_number);
                    setSeasonDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    season.season_number === selectedSeason
                      ? 'bg-cine-red text-white font-semibold'
                      : 'text-cine-text hover:bg-cine-surface-2'
                  }`}
                >
                  Season {season.season_number}
                  {season.episode_count > 0 && (
                    <span className="text-xs text-cine-muted ml-1">
                      ({season.episode_count} eps)
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Season overview */}
      {currentSeasonInfo?.overview && (
        <p className="text-cine-muted text-sm mb-4 leading-relaxed line-clamp-2">
          {currentSeasonInfo.overview}
        </p>
      )}

      {/* Episodes grid */}
      {loading ? (
        <div className="grid gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3">
          {(seasonDetails?.episodes || []).map((episode: Episode) => {
            const isCurrentEp =
              episode.season_number === currentSeason &&
              episode.episode_number === currentEpisode &&
              selectedSeason === currentSeason;

            return (
              <Link
                key={episode.id}
                href={`/watch/tv/${tvId}/${episode.season_number}/${episode.episode_number}`}
                className={`flex gap-3 rounded-xl overflow-hidden transition-all hover:scale-[1.01] ${
                  isCurrentEp
                    ? 'bg-cine-red/20 border border-cine-red/40'
                    : 'bg-cine-surface hover:bg-cine-surface-2 border border-transparent hover:border-cine-border'
                }`}
              >
                {/* Still image */}
                <div className="relative flex-shrink-0 w-32 h-20 bg-cine-surface-2">
                  {episode.still_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                      alt={episode.name}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-cine-surface-2">
                      <Play size={20} className="text-cine-muted" />
                    </div>
                  )}
                  {/* Episode number badge */}
                  <div className="absolute top-1 left-1 bg-black/80 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                    E{episode.episode_number}
                  </div>
                  {isCurrentEp && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <Play size={24} fill="white" className="text-white" />
                    </div>
                  )}
                </div>

                {/* Episode info */}
                <div className="flex-1 p-3 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`font-semibold text-sm leading-tight line-clamp-1 ${isCurrentEp ? 'text-cine-red' : 'text-white'}`}>
                      {episode.name}
                    </h4>
                    <div className="flex items-center gap-3 flex-shrink-0 text-xs text-cine-muted">
                      {episode.vote_average > 0 && (
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star size={10} fill="currentColor" />
                          <span className="text-white">{episode.vote_average.toFixed(1)}</span>
                        </div>
                      )}
                      {episode.runtime && (
                        <div className="flex items-center gap-1">
                          <Clock size={10} />
                          <span>{episode.runtime}m</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-cine-muted text-xs mt-1 line-clamp-2 leading-relaxed">
                    {episode.overview || 'No description available.'}
                  </p>
                  {episode.air_date && (
                    <p className="text-cine-muted text-xs mt-1">
                      {new Date(episode.air_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
