'use client';

import { useState, useRef, useCallback } from 'react';
import { Maximize2, Minimize2, AlertCircle, RefreshCw } from 'lucide-react';

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
  activeClass: string;
}

const SOURCES: Source[] = [
  { key: 'vidsrc.xyz', label: 'Source 1', activeClass: 'bg-cine-red text-white' },
  { key: 'vidsrc.me',  label: 'Source 2', activeClass: 'bg-blue-600 text-white' },
  { key: 'vidsrc.to',  label: 'Source 3', activeClass: 'bg-purple-600 text-white' },
];

function buildEmbedUrl(
  source: SourceKey,
  tmdbId: number,
  mediaType: 'movie' | 'tv',
  season?: number,
  episode?: number
): string {
  if (mediaType === 'movie') {
    if (source === 'vidsrc.xyz') return `https://vidsrc.xyz/embed/movie?tmdb=${tmdbId}`;
    if (source === 'vidsrc.me')  return `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`;
    return `https://vidsrc.to/embed/movie/${tmdbId}`;
  }
  const s = season ?? 1;
  const e = episode ?? 1;
  if (source === 'vidsrc.xyz') return `https://vidsrc.xyz/embed/tv?tmdb=${tmdbId}&season=${s}&episode=${e}`;
  if (source === 'vidsrc.me')  return `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${s}&episode=${e}`;
  return `https://vidsrc.to/embed/tv/${tmdbId}/${s}/${e}`;
}

export default function VideoPlayer({
  tmdbId,
  mediaType,
  season,
  episode,
  title,
}: VideoPlayerProps) {
  const [activeSource, setActiveSource] = useState<SourceKey>('vidsrc.xyz');
  const [iframeError, setIframeError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const embedUrl = buildEmbedUrl(activeSource, tmdbId, mediaType, season, episode);

  const handleSourceChange = (source: SourceKey) => {
    setActiveSource(source);
    setIframeError(false);
  };

  // ✅ Real browser fullscreen API — single, works on mobile too
  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;

    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Fallback: toggle CSS fullscreen for browsers that block API
      setIsFullscreen((prev) => !prev);
    }
  }, []);

  // Sync state when user presses Escape
  if (typeof window !== 'undefined') {
    document.onfullscreenchange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
  }

  const episodeLabel =
    mediaType === 'tv' && season && episode
      ? ` — S${String(season).padStart(2, '0')}E${String(episode).padStart(2, '0')}`
      : '';

  return (
    <div
      ref={containerRef}
      className={`w-full bg-black flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      {/* ── Source bar ── */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-[#0d0d0d] border-b border-white/10 flex-wrap">
        {/* Title */}
        <span className="text-white/70 text-xs font-medium truncate max-w-[200px] sm:max-w-xs hidden sm:block">
          {title}{episodeLabel}
        </span>

        <div className="flex items-center gap-1.5 ml-auto flex-wrap">
          <span className="text-white/40 text-xs mr-1">Source:</span>
          {SOURCES.map((src) => (
            <button
              key={src.key}
              type="button"
              onClick={() => handleSourceChange(src.key)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all touch-manipulation ${
                activeSource === src.key
                  ? src.activeClass + ' shadow-md scale-105'
                  : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white active:scale-95'
              }`}
            >
              {src.label}
            </button>
          ))}

          {/* ✅ Single fullscreen button — bottom right of bar */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="ml-1 p-1.5 rounded-md bg-white/10 hover:bg-white/20 active:scale-95 text-white/70 hover:text-white transition-all touch-manipulation"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* ── Player area ── */}
      <div
        className="video-container"
        style={isFullscreen ? { paddingTop: 0, flex: 1, position: 'relative' } : undefined}
      >
        {iframeError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-cine-bg text-center p-6">
            <AlertCircle className="text-cine-muted mb-3" size={40} />
            <h3 className="text-white font-bold text-base mb-1">Source Unavailable</h3>
            <p className="text-cine-muted text-sm mb-5">Try another source below.</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SOURCES.filter((s) => s.key !== activeSource).map((src) => (
                <button
                  key={src.key}
                  type="button"
                  onClick={() => handleSourceChange(src.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold text-white ${src.activeClass} touch-manipulation`}
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
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            className="absolute inset-0 w-full h-full border-0"
            style={{ display: 'block' }}
          />
        )}
      </div>

      {/* ── Retry / disclaimer bar ── */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#0d0d0d] border-t border-white/10 gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => { setIframeError(false); handleSourceChange(activeSource); }}
          className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs transition-colors touch-manipulation"
        >
          <RefreshCw size={12} />
          Reload
        </button>
        <p className="text-white/30 text-xs text-center flex-1">
          If ads appear, install uBlock Origin · Try another source if playback fails
        </p>
      </div>
    </div>
  );
}
