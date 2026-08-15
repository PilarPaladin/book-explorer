import React, { useState } from 'react';
import { XMarkIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

export interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
}

export default function StarRating({ rating, setRating }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const displayValue = hoverValue !== null ? hoverValue : rating;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    setHoverValue(index - (isHalf ? 0.5 : 0));
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => { setIsHovering(false); setHoverValue(null); }}>
      <button onClick={() => setRating(0)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, opacity: isHovering ? 1 : 0, transition: 'opacity 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', left: '100%', marginLeft: '2px' }} title="Clear rating"><XMarkIcon style={{ width: '16px', color: '#9ca3af' }} /></button>
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((index) => {
          const isFull = displayValue >= index;
          const isHalf = displayValue >= index - 0.5 && displayValue < index;

          return (
            <div
              key={index}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onClick={() => setRating(displayValue)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <div style={{ position: 'relative', width: '28px', height: '28px' }}>
                <StarIcon style={{ position: 'absolute', top: 0, left: 0, width: '28px', color: '#9ca3af' }} />
                <div style={{
                  position: 'absolute', top: 0, left: 0,
                  width: isFull ? '100%' : isHalf ? '50%' : '0%', overflow: 'hidden', color: '#374151'
                }}>
                  <StarSolid style={{ width: '28px' }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
