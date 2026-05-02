'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, Info, Star } from 'lucide-react';
import { Movie, getBackdropUrl, getPosterUrl, formatRating, formatYear } from '@/lib/tmdb';

interface HeroProps {
  movie: Movie;
  isActive?: boolean;
}

export default function Hero({ movie, isActive = true }: HeroProps) {
  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'original');
  const mediaType = (movie as { media_type?: string }).media_type || 'movie';
  const title = movie.title || movie.name || 'Unknown';
  const year = formatYear(movie.release_date || movie.first_air_date);
  const rating = formatRating(movie.vote_average);
  const detailPath = mediaType === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`;
  const watchPath =
    mediaType === 'tv'
      ? `/watch/tv/${movie.id}/1/1`
      : `/watch/movie/${movie.id}`;

  return (
    <div className="relative w-full h-[85vh] min-h-[500px] overflow-hidden bg-cine-bg">
      {/* Backdrop image with fade transition */}
      {movie.backdrop_path && (
        <Image
          src={backdropUrl}
          alt={title}
          fill
          priority
          sizes="100vw"
          className={`object-cover object-center opacity-60 transition-opacity duration-1000 ${isActive ? 'opacity-60' : 'opacity-0'}`}
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 hero-gradient" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-cine-bg to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className={`max-w-2xl transition-all duration-1000 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="bg-cine-red text-white text-xs font-bold px-2.5 py-1 rounded uppercase tracking-widest animate-pulse-red">
                {mediaType === 'tv' ? 'TV Show' : 'Movie'}
              </span>
              <div className="flex items-center gap-1 text-yellow-400">
                <Star size={14} fill="currentColor" className="animate-star-glow" />
                <span className="text-sm font-semibold text-white">{rating}</span>
              </div>
              <span className="text-cine-muted text-sm">{year}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-2xl bg-gradient-to-r from-white via-cine-red to-white bg-clip-text text-transparent animate-gradient">
              {title}
            </h1>

            {/* Overview */}
            <p className="text-cine-text/90 text-base sm:text-lg leading-relaxed line-clamp-3 mb-8 max-w-xl">
              {movie.overview}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                href={watchPath}
                className="flex items-center gap-2 bg-white text-black font-bold px-8 py-3 rounded-lg hover:bg-gray-200 transition-all text-sm sm:text-base shadow-lg hover:scale-105"
              >
                <Play size={20} fill="currentColor" />
                Play Now
              </Link>
              <Link
                href={detailPath}
                className="flex items-center gap-2 bg-white/20 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm text-sm sm:text-base border border-white/20 hover:scale-105"
              >
                <Info size={20} />
                More Info
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}