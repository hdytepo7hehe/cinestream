'use client';

import { useWatch } from '@/context/WatchContext';
import { useState } from 'react';
import Link from 'next/link';
import { Play, X } from 'lucide-react';
import Image from 'next/image';
import { getPosterUrl } from '@/lib/tmdb';

export default function ContinueWatchingRow() {
  const { continueWatching, removeFromContinueWatching } = useWatch();
  const [removingId, setRemovingId] = useState<number | null>(null);

  if (continueWatching.length === 0) return null;

  const handleRemove = (id: number, mediaType: 'movie' | 'tv') => {
    setRemovingId(id);
    setTimeout(() => {
      removeFromContinueWatching(id, mediaType);
      setRemovingId(null);
    }, 200);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-4">
        <h2 className="text-white text-xl sm:text-2xl font-bold flex items-center gap-2">
          <span className="row-title-emoji">▶️</span>
          <span>Continue Watching</span>
        </h2>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        {continueWatching.map((item) => {
          const href = item.mediaType === 'movie'
            ? `/watch/movie/${item.id}`
            : `/watch/tv/${item.id}/${item.season}/${item.episode}`;

          return (
            <div
              key={`${item.mediaType}-${item.id}`}
              className={`relative flex-shrink-0 w-36 sm:w-40 group transition-all duration-200 ${
                removingId === item.id ? 'scale-95 opacity-50' : ''
              }`}
            >
              <Link href={href} className="block">
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-cine-surface">
                  <Image
                    src={getPosterUrl(item.poster_path, 'w342')}
                    alt={item.title}
                    fill
                    sizes="160px"
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove(item.id, item.mediaType);
                    }}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    title="Remove"
                  >
                    <X size={12} className="text-white" />
                  </button>
                  {item.mediaType === 'tv' && item.season && item.episode && (
                    <div className="absolute bottom-1.5 left-1.5 text-white text-xs font-semibold bg-black/60 px-1.5 py-0.5 rounded">
                      S{item.season} E{item.episode}
                    </div>
                  )}
                </div>
                <p className="text-white text-xs font-medium mt-1.5 line-clamp-1">{item.title}</p>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}