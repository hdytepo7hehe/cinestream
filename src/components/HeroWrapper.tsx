'use client';

import { useState, useEffect, useCallback } from 'react';
import Hero from './Hero';
import { Movie } from '@/lib/tmdb';

interface HeroWrapperProps {
  items: Movie[];
}

export default function HeroWrapper({ items }: HeroWrapperProps) {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (items.length <= 1) return;

    const interval = setInterval(() => {
      if (!isHovered) {
        setIndex((prev) => {
          const next = prev + 1;
          return next >= items.length ? 0 : next;
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [items.length, isHovered]);

  // Pick random start after hydration (single run)
  useEffect(() => {
    if (items.length > 1) {
      setIndex(Math.floor(Math.random() * items.length));
    }
  }, [items.length]);

  if (!items || items.length === 0) return null;

  return (
    <div 
      className="transition-all duration-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Hero movie={items[index]} isActive={true} />
      {/* Progress indicators */}
      {items.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === index ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}