'use client';

import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

interface TrailerModalProps {
  trailerKey: string;
  title: string;
  onClose: () => void;
}

export default function TrailerModal({ trailerKey, title, onClose }: TrailerModalProps) {
  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden'; // prevent background scroll
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold text-sm sm:text-base truncate pr-4">
            🎬 {title} — Official Trailer
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all active:scale-90 touch-manipulation"
            aria-label="Close trailer"
          >
            <X size={18} />
          </button>
        </div>

        {/* YouTube embed — 16:9 */}
        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full rounded-xl"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
            title={`${title} Trailer`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>

        {/* Hint */}
        <p className="text-white/25 text-xs text-center mt-3">
          Press Esc or click outside to close
        </p>
      </div>
    </div>
  );
}
