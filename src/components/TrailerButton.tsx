'use client';

import { useState } from 'react';
import { Youtube } from 'lucide-react';
import TrailerModal from './TrailerModal';

interface TrailerButtonProps {
  trailerKey: string;
  title: string;
}

export default function TrailerButton({ trailerKey, title }: TrailerButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-cine-surface hover:bg-cine-surface-2 text-white font-semibold px-6 py-3 rounded-lg border border-cine-border hover:border-white/30 transition-all text-sm sm:text-base touch-manipulation"
      >
        <Youtube size={18} className="text-red-500" />
        Trailer
      </button>

      {open && (
        <TrailerModal
          trailerKey={trailerKey}
          title={title}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
