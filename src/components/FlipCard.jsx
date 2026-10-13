import React, { useState } from 'react';
import { RotateCw } from 'lucide-react';

// A flashcard: click, tap or press Enter to flip between front and back.
const FlipCard = ({ front, back, label, height = 'h-72', frontClass = '', backClass = '' }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      aria-label={`${label}: ${flipped ? 'showing details, click to flip back' : 'click to see details'}`}
      className={`flip-card group block w-full text-left ${height} focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-2xl`}
    >
      <div className={`flip-inner relative w-full h-full ${flipped ? 'is-flipped' : ''}`}>
        <div className={`flip-face absolute inset-0 rounded-2xl p-6 flex flex-col ${frontClass}`} aria-hidden={flipped}>
          {front}
          <span className="mt-auto pt-3 inline-flex items-center gap-1.5 text-xs font-semibold opacity-70 group-hover:opacity-100">
            <RotateCw className="w-3.5 h-3.5" /> Flip for details
          </span>
        </div>
        <div className={`flip-face flip-back absolute inset-0 rounded-2xl p-6 flex flex-col overflow-y-auto ${backClass}`} aria-hidden={!flipped}>
          {back}
        </div>
      </div>
    </button>
  );
};

export default FlipCard;
