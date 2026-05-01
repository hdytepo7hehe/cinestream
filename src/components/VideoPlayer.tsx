'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Maximize2, Minimize2, AlertCircle, RefreshCw, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

type SourceKey = 'vidsrc.xyz' | 'vidsrc.me' | 'vidsrc.to';

interface VideoPlayerProps {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  season?: number;
  episode?: number;
  title?: string;
  backHref?: string;  // Where X button goes
}

const SOURCES: { key: SourceKey; label: string }[] = [
  { key: 'vidsrc.xyz', label: 'Source 1' },
  { key: 'vidsrc.me',  label: 'Source 2' },
  { key: 'vidsrc.to',  label: 'Source 3' },
];

function buildUrl(src: SourceKey, id: number, type: 'movie' | 'tv', s?: number, e?: number) {
  if (type === 'movie') {
    if (src === 'vidsrc.xyz') return `https://vidsrc.xyz/embed/movie?tmdb=${id}`;
    if (src === 'vidsrc.me')  return `https://vidsrc.me/embed/movie?tmdb=${id}`;
    return `https://vidsrc.to/embed/movie/${id}`;
  }
  const season  = s ?? 1;
  const episode = e ?? 1;
  if (src === 'vidsrc.xyz') return `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
  if (src === 'vidsrc.me')  return `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
  return `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`;
}

export default function VideoPlayer({
  tmdbId, mediaType, season, episode, title, backHref,
}: VideoPlayerProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeSource, setActiveSource] = useState<SourceKey>('vidsrc.xyz');
  const [iframeError,  setIframeError]  = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey,    setIframeKey]    = useState(0); // force-remount on reload

  const embedUrl = buildUrl(activeSource, tmdbId, mediaType, season, episode);

  // ── Sync fullscreen state with browser events ──────────────────────────────
  useEffect(() => {
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFSChange);
    return () => document.removeEventListener('fullscreenchange', onFSChange);
  }, []);

  // ── Fullscreen toggle ──────────────────────────────────────────────────────
  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen({ navigationUI: 'hide' });
      } else {
        await document.exitFullscreen();
      }
    } catch {
      setIsFullscreen(prev => !prev);
    }
  }, []);

  // ── Source / reload helpers ───────────────────────────────────────────────
  const changeSource = (src: SourceKey) => {
    setActiveSource(src);
    setIframeError(false);
    setIframeKey(k => k + 1);
  };

  const reload = () => {
    setIframeError(false);
    setIframeKey(k => k + 1);
  };

  const epLabel = mediaType === 'tv' && season && episode
    ? ` S${String(season).padStart(2,'0')}E${String(episode).padStart(2,'0')}`
    : '';

  return (
    <div
      ref={containerRef}
      className={`w-full bg-black flex flex-col select-none ${
        isFullscreen ? 'fixed inset-0 z-[9999]' : ''
      }`}
    >
      {/* ══ CONTROL BAR ═══════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-[#0c0c0c] border-b border-white/8 flex-wrap sm:flex-nowrap">

        {/* ① X / Close — goes back to detail page */}
        {backHref && (
          <button
            type="button"
            onClick={() => router.push(backHref)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white/70 hover:text-white transition-all touch-manipulation flex-shrink-0"
            aria-label="Close player"
            title="Close"
          >
            <X size={15} />
          </button>
        )}

        {/* Title */}
        <span className="text-white/60 text-xs font-medium truncate flex-1 min-w-0 hidden sm:block">
          {title}{epLabel}
        </span>
        <span className="text-white/60 text-xs font-medium truncate flex-1 min-w-0 sm:hidden">
          {epLabel || title}
        </span>

        {/* ② Source buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-white/30 text-xs hidden sm:inline">Source:</span>
          {SOURCES.map((src) => (
            <button
              key={src.key}
              type="button"
              onClick={() => changeSource(src.key)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all touch-manipulation ${
                activeSource === src.key
                  ? src.key === 'vidsrc.xyz' ? 'bg-cine-red text-white shadow scale-105'
                  : src.key === 'vidsrc.me'  ? 'bg-blue-600 text-white shadow scale-105'
                  : 'bg-purple-600 text-white shadow scale-105'
                  : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white active:scale-95'
              }`}
            >
              {src.label}
            </button>
          ))}
        </div>

        {/* ③ Reload */}
        <button
          type="button"
          onClick={reload}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-white/8 hover:bg-white/18 active:scale-90 text-white/50 hover:text-white transition-all touch-manipulation flex-shrink-0"
          aria-label="Reload player"
          title="Reload"
        >
          <RefreshCw size={13} />
        </button>

        {/* ④ Fullscreen — ONLY button, no duplicate below */}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-white/8 hover:bg-white/18 active:scale-90 text-white/50 hover:text-white transition-all touch-manipulation flex-shrink-0"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>

      {/* ══ PLAYER ════════════════════════════════════════════════════════════ */}
      <div
        className="video-container"
        style={isFullscreen ? { paddingTop: 0, flex: 1, position: 'relative' } : undefined}
      >
        {iframeError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] text-center p-6">
            <AlertCircle className="text-white/20 mb-3" size={44} />
            <h3 className="text-white font-bold text-base mb-1">Source Unavailable</h3>
            <p className="text-white/40 text-sm mb-5 max-w-xs">
              This source isn't loading. Try switching to another source.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SOURCES.filter((s) => s.key !== activeSource).map((src) => (
                <button
                  key={src.key}
                  type="button"
                  onClick={() => changeSource(src.key)}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-cine-red hover:bg-cine-red-dark touch-manipulation"
                >
                  Try {src.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <iframe
            key={`${embedUrl}-${iframeKey}`}
            src={embedUrl}
            title={`${title}${epLabel}`}
            allowFullScreen
            referrerPolicy="no-referrer"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"

            className="absolute inset-0 w-full h-full border-0"
          />
        )}
      </div>
    </div>
  );
}
