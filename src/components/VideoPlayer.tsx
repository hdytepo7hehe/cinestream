'use client';

import { useState } from 'react';
import { Maximize2, ExternalLink, AlertCircle } from 'lucide-react';

type SourceKey = 'vidsrc.xyz' | 'vidsrc.me' | 'vidsrc.to';

interface VideoPlayerProps {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  season?: number;
  episode?: number;
  title?: string;
}

interface Source {
  key: SourceKey;
  label: string;
  color: string;
}

const SOURCES: Source[] = [
  { key: 'vidsrc.xyz', label: 'Source 1', color: 'bg-cine-red hover:bg-cine-red-dark' },
  { key: 'vidsrc.me',  label: 'Source 2', color: 'bg-blue-600 hover:bg-blue-700' },
  { key: 'vidsrc.to',  label: 'Source 3', color: 'bg-purple-600 hover:bg-purple-700' },
];

function buildEmbedUrl(source: SourceKey, tmdbId: number, mediaType: 'movie' | 'tv', season?: number, episode?: number): string {
  if (mediaType === 'movie') {
    switch (source) {
      case 'vidsrc.xyz': return `https://vidsrc.xyz/embed/movie?tmdb=${tmdbId}`;
      case 'vidsrc.me':  return `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`;
      case 'vidsrc.to':  return `https://vidsrc.to/embed/movie/${tmdbId}`;
    }
  } else {
    const s = season ?? 1;
    const e = episode ?? 1;
    switch (source) {
      case 'vidsrc.xyz': return `https://vidsrc.xyz/embed/tv?tmdb=${tmdbId}&season=${s}&episode=${e}`;
      case 'vidsrc.me':  return `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${s}&episode=${e}`;
      case 'vidsrc.to':  return `https://vidsrc.to/embed/tv/${tmdbId}/${s}/${e}`;
    }
  }
}

export default function VideoPlayer({ tmdbId, mediaType, season, episode, title }: VideoPlayerProps) {
  const [activeSource, setActiveSource] = useState<SourceKey>('vidsrc.xyz');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  const embedUrl = buildEmbedUrl(activeSource, tmdbId, mediaType, season, episode);

  const handleSourceChange = (source: SourceKey) => {
    setActiveSource(source);
    setIframeError(false);
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'w-full'}`}>
      {/* Player header */}
      <div className="flex items-center justify-between bg-cine-surface px-4 py-3 border-b border-cine-border">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-white font-semibold text-sm truncate max-w-xs">
            {title || 'Now Playing'}
            {mediaType === 'tv' && season && episode && (
              <span className="text-cine-muted ml-2">S{String(season).padStart(2,'0')}E{String(episode).padStart(2,'0')}</span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-cine-muted hover:text-white transition-colors"
            title="Open in new tab"
          >
            <ExternalLink size={16} />
          </a>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-cine-muted hover:text-white transition-colors"
            title="Toggle fullscreen"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* Source selector */}
      <div className="flex items-center gap-2 px-4 py-3 bg-cine-surface/80 border-b border-cine-border flex-wrap">
        <span className="text-cine-muted text-xs font-medium mr-1">Sources:</span>
        {SOURCES.map((src) => (
          <button
            key={src.key}
            onClick={() => handleSourceChange(src.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold text-white transition-all ${
              activeSource === src.key
                ? src.color + ' ring-2 ring-white/30 shadow-lg scale-105'
                : 'bg-cine-border hover:bg-cine-surface-2 text-cine-muted hover:text-white'
            }`}
          >
            {src.label}
          </button>
        ))}
        <span className="text-cine-muted text-xs ml-2 hidden sm:inline">
          Try another source if playback fails
        </span>
      </div>

      {/* Iframe container */}
      <div className={`video-container ${isFullscreen ? 'h-[calc(100vh-112px)]' : ''}`}>
        {iframeError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-cine-bg text-center p-8">
            <AlertCircle className="text-cine-muted mb-4" size={48} />
            <h3 className="text-white font-bold text-lg mb-2">Playback Error</h3>
            <p className="text-cine-muted text-sm mb-6">
              This source is unavailable. Please try another source above.
            </p>
            <div className="flex gap-3">
              {SOURCES.filter((s) => s.key !== activeSource).map((src) => (
                <button
                  key={src.key}
                  onClick={() => handleSourceChange(src.key)}
                  className={`px-5 py-2 rounded-lg text-sm font-bold text-white ${src.color} transition-colors`}
                >
                  Try {src.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <iframe
            key={embedUrl}
            src={embedUrl}
            title={title || 'Video Player'}
            allowFullScreen
            referrerPolicy="no-referrer"
            allow="autoplay; fullscreen; picture-in-picture"
            className="absolute inset-0 w-full h-full border-0"
          />
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-cine-surface px-4 py-2 text-center">
        <p className="text-cine-muted text-xs">
          Video content is provided by third-party embed services. Use an ad blocker for the best experience.
        </p>
      </div>
    </div>
  );
}
