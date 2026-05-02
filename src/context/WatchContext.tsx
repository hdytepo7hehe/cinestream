'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface WatchItem {
  id: number;
  mediaType: 'movie' | 'tv';
  title: string;
  poster_path: string | null;
  season?: number;
  episode?: number;
  progress?: number;
  timestamp: number;
}

interface WatchContextValue {
  continueWatching: WatchItem[];
  addToContinueWatching: (item: WatchItem) => void;
  removeFromContinueWatching: (id: number, mediaType: 'movie' | 'tv') => void;
}

const WatchContext = createContext<WatchContextValue>({
  continueWatching: [],
  addToContinueWatching: () => {},
  removeFromContinueWatching: () => {},
});

export function WatchProvider({ children }: { children: React.ReactNode }) {
  const [continueWatching, setContinueWatching] = useState<WatchItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('continueWatching');
    if (saved) {
      setContinueWatching(JSON.parse(saved));
    }
  }, []);

  const addToContinueWatching = (item: WatchItem) => {
    setContinueWatching(prev => {
      const filtered = prev.filter(
        i => !(i.id === item.id && i.mediaType === item.mediaType)
      );
      const newItem = { ...item, timestamp: Date.now() };
      const updated = [newItem, ...filtered].slice(0, 50);
      localStorage.setItem('continueWatching', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromContinueWatching = (id: number, mediaType: 'movie' | 'tv') => {
    setContinueWatching(prev => {
      const updated = prev.filter(item => 
        !(item.id === id && item.mediaType === mediaType)
      );
      localStorage.setItem('continueWatching', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <WatchContext.Provider value={{ continueWatching, addToContinueWatching, removeFromContinueWatching }}>
      {children}
    </WatchContext.Provider>
  );
}

export function useWatch() {
  return useContext(WatchContext);
}