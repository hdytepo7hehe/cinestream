'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, Star, Calendar } from 'lucide-react';
import { Movie, TVShow, getPosterUrl, formatRating, formatYear } from '@/lib/tmdb';

interface MovieCardProps {
  item: Movie | TVShow;
  mediaType: 'movie' | 'tv';
}

export default function MovieCard({ item, mediaType }: MovieCardProps) {
  const title = (item as Movie).title || (item as TVShow).name || 'Unknown';
  const dateStr = (item as Movie).release_date || (item as TVShow).first_air_date;
  const year = formatYear(dateStr);
  const rating = formatRating(item.vote_average);
  const posterUrl = getPosterUrl(item.poster_path, 'w342');
  const detailPath = mediaType === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`;
  const watchPath =
    mediaType === 'tv'
      ? `/watch/tv/${item.id}/1/1`
      : `/watch/movie/${item.id}`;

  return (
    <div className="movie-card group relative">
      <Link href={detailPath} className="block">
        <div className="relative overflow-hidden rounded-md bg-cine-surface-2 aspect-[2/3]">
          {/* Poster */}
          <Image
            src={posterUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 40vw, (max-width: 1024px) 20vw, 180px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

          {/* Bottom info on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
            {/* Play button */}
            <Link
              href={watchPath}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-2 bg-cine-red hover:bg-cine-red-dark text-white text-xs font-bold py-2 rounded-md w-full mb-2 transition-colors"
            >
              <Play size={12} fill="currentColor" />
              Watch Now
            </Link>

            {/* Meta */}
            <div className="flex items-center justify-between text-xs text-gray-300">
              <div className="flex items-center gap-1 text-yellow-400">
                <Star size={11} fill="currentColor" />
                <span className="text-white font-semibold">{rating}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Calendar size={11} />
                <span>{year}</span>
              </div>
            </div>
          </div>

          {/* Rating badge always visible */}
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded px-1.5 py-0.5">
            <Star size={10} fill="#facc15" className="text-yellow-400" />
            <span className="text-white text-xs font-bold">{rating}</span>
          </div>
        </div>

        {/* Title below card */}
        <div className="mt-2 px-0.5">
          <p className="text-white text-sm font-medium line-clamp-2 leading-tight group-hover:text-gray-200">
            {title}
          </p>
          <p className="text-cine-muted text-xs mt-0.5">{year}</p>
        </div>
      </Link>
    </div>
  );
}
