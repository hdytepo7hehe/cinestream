'use client';

import { useState, useEffect } from 'react';
import Hero from './Hero';
import { Movie } from '@/lib/tmdb';

interface HeroWrapperProps {
  items: Movie[];
}

export default function HeroWrapper({ items }: HeroWrapperProps) {
  // Always start with index 0 — matches server render exactly
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // After hydration, pick a random item (client-only, no SSR mismatch)
    if (items.length > 1) {
      setIndex(Math.floor(Math.random() * items.length));
    }
  }, [items.length]);

  if (!items || items.length === 0) return null;
  return <Hero movie={items[index]} />;
}
