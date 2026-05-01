'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Play, Star } from 'lucide-react';
import { Movie, TVShow, getPosterUrl, formatRating, formatYear } from '@/lib/tmdb';

interface MovieCardProps {
  item: Movie | TVShow;
  mediaType: 'movie' | 'tv';
}

export default function MovieCard({ item, mediaType }: MovieCardProps) {
  const router = useRouter();

  const title = (item as Movie).title || (item as TVShow).name || 'Unknown';
  const dateStr = (item as Movie).release_date || (item as TVShow).first_air_date;
  const year = formatYear(dateStr);
  const rating = formatRating(item.vote_average);
  const posterUrl = getPosterUrl(item.poster_path, 'w342');
  const detailPath = mediaType === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`;
  const watchPath  = mediaType === 'tv' ? `/watch/tv/${item.id}/1/1` : `/watch/movie/${item.id}`;

  return (
    // ✅ Single root element — no nested <a> tags
    <div
      className="movie-card group relative cursor-pointer select-none"
      onClick={() => router.push(detailPath)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && router.push(detailPath)}
      aria-label={`View ${title}`}
    >
      {/* Poster */}
      <div className="relative overflow-hidden rounded-md bg-cine-surface-2 aspect-[2/3]">
        <Image
          src={posterUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 40vw, (max-width: 1024px) 20vw, 180px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        {/* Hover actions */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
          {/* Watch Now — button (NOT Link) to avoid nested <a> */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              router.push(watchPath);
            }}
            className="flex items-center justify-center gap-1.5 bg-cine-red hover:bg-cine-red-dark active:scale-95 text-white text-xs font-bold py-2 rounded-md w-full mb-2 transition-all touch-manipulation"
            aria-label={`Watch ${title}`}
          >
            <Play size={11} fill="currentColor" />
            Watch Now
          </button>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-yellow-400">
              <Star size={10} fill="currentColor" />
              <span className="text-white font-semibold">{rating}</span>
            </div>
            <span className="text-gray-400">{year}</span>
          </div>
        </div>

        {/* Rating badge */}
        <div className="absolute top-1.5 right-1.5 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded px-1.5 py-0.5">
          <Star size={9} fill="#facc15" className="text-yellow-400" />
          <span className="text-white text-xs font-bold">{rating}</span>
        </div>
      </div>

      {/* Title below */}
      <div className="mt-1.5 px-0.5">
        <p className="text-white text-xs sm:text-sm font-medium line-clamp-2 leading-tight">
          {title}
        </p>
        <p className="text-cine-muted text-xs mt-0.5">{year}</p>
      </div>
    </div>
  );
}
