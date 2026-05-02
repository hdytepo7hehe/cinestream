'use client';

import { useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import { Movie, TVShow } from '@/lib/tmdb';

interface MovieRowProps {
  title: string;
  items: (Movie | TVShow)[];
  mediaType: 'movie' | 'tv';
}

// Map specific titles to animated emojis
const titleEmojis: Record<string, string[]> = {
  'Trending This Week': ['🔥', '🔥', '🔥'],
  'Now Playing': ['▶️', '▶️', '▶️'],
  'Popular Movies': ['⭐', '⭐', '⭐'],
  'Top Rated Movies': ['🏆', '🏆', '🏆'],
  'Trending TV Shows': ['📺', '📺', '📺'],
  'Popular TV Shows': ['📺', '📺', '📺'],
};

export default function MovieRow({ title, items, mediaType }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  const scroll = useCallback((direction: 'left' | 'right') => {
    const el = rowRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    setTimeout(updateScrollState, 400);
  }, [updateScrollState]);

  if (!items || items.length === 0) return null;

  // Check if title has emojis
  const emojis = titleEmojis[title];
  const displayTitle = emojis 
    ? emojis.map((e, i) => (
        <span key={i} className="row-title-emoji">{e}</span>
      ))
    : title;

  return (
    <div className="px-4 sm:px-6 lg:px-8 group/row">
      {/* Row title */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white text-xl sm:text-2xl font-bold flex items-center gap-1">
          {displayTitle}
          <span>{title.replace(/^[🔥▶️⭐🏆📺]+/, '')}</span>
        </h2>
        <span className="text-cine-muted text-sm">{items.length} titles</span>
      </div>

      {/* Scrollable container with arrows */}
      <div className="relative">
        {/* Left arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-20 w-10 h-10 bg-cine-bg/90 hover:bg-cine-surface text-white rounded-full flex items-center justify-center shadow-xl border border-cine-border hover:border-white/30 transition-all opacity-0 group-hover/row:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Right arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-20 w-10 h-10 bg-cine-bg/90 hover:bg-cine-surface text-white rounded-full flex items-center justify-center shadow-xl border border-cine-border hover:border-white/30 transition-all opacity-0 group-hover/row:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Left fade */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-cine-bg to-transparent z-10 pointer-events-none" />
        )}
        {/* Right fade */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-cine-bg to-transparent z-10 pointer-events-none" />
        )}

        {/* Cards */}
        <div
          ref={rowRef}
          className="movie-row-scroll"
          onScroll={updateScrollState}
          style={{ scrollbarWidth: 'none' }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0"
              style={{ width: 'clamp(130px, 14vw, 190px)' }}
            >
              <MovieCard item={item} mediaType={mediaType} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}