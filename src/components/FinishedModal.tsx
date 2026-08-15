import React, { useState } from 'react';
import { XMarkIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { Book } from './BookCard';
import { BookActivity } from '../hooks/useBookActivity';
import StarRating from './StarRating';

interface FinishedModalProps {
  book: Book;
  activity?: BookActivity;
  onClose: () => void;
  onSave?: (updates: any) => void;
  isEditMode?: boolean;
}

export default function FinishedModal({ book, activity = {} as BookActivity, onClose, onSave, isEditMode }: FinishedModalProps) {
  const [readOnDate, setReadOnDate] = useState(activity.readOnDate || new Date().toISOString().split('T')[0]);
  const [readOnChecked, setReadOnChecked] = useState(!!activity.readOnDate || activity.isRead);
  const [startedOnDate, setStartedOnDate] = useState(activity.startedOnDate || new Date().toISOString().split('T')[0]);
  const [startedOnChecked, setStartedOnChecked] = useState(!!activity.startedOnDate);
  const [readBefore, setReadBefore] = useState(activity.readBefore || false);
  const [review, setReview] = useState(activity.review || '');
  const [rating, setRating] = useState(activity.rating || 0);
  const [isLoved, setIsLoved] = useState(activity.isLoved || false);

  const handleSave = () => {
    if (onSave) {
      onSave({
        isRead: readOnChecked || readBefore,
        readOnDate: readOnChecked ? readOnDate : undefined,
        startedOnDate: startedOnChecked ? startedOnDate : undefined,
        readBefore,
        review,
        rating,
        isLoved
      });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ backgroundColor: 'var(--color-white)', borderRadius: '12px', width: '900px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>

        {/* Header */}
        <div style={{ padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-gray)' }}>
          <h2 className="rakkas-regular" style={{ color: 'var(--color-red)', fontSize: '32px', margin: 0 }}>
            {isEditMode ? 'Edit activity...' : 'I finished reading...'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <XMarkIcon style={{ width: '24px', color: 'var(--color-dark)' }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', padding: '30px', gap: '30px' }}>

          {/* Left: Cover */}
          <div style={{ width: '200px', flexShrink: 0 }}>
            <img src={book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : '/tempCover.png'} alt="Cover" style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', aspectRatio: '2/3', objectFit: 'cover' }} />
          </div>

          {/* Right: Form */}
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Title & Author */}
            <div>
              <h3 className="rakkas-regular" style={{ color: 'var(--color-red)', fontSize: '32px', margin: 0, lineHeight: 1.1 }}>{book.title}</h3>
              <p className="inter-regular" style={{ color: 'var(--color-dark)', fontSize: '18px', margin: '5px 0 0 0' }}>
                {book.author_name?.join(', ') || 'Unknown Author'}
              </p>
            </div>

            {/* Checkboxes */}
            <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label className="inter-regular" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-dark)', cursor: 'pointer', userSelect: 'none' }}>
                  <input type="checkbox" checked={startedOnChecked} onChange={(e) => setStartedOnChecked(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  Started On
                </label>
                <input type="date" value={startedOnDate} onChange={e => setStartedOnDate(e.target.value)} className="inter-regular" style={{ backgroundColor: '#f3f4f6', border: '1px solid var(--color-gray)', borderRadius: '4px', padding: '4px 8px', color: '#374151', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label className="inter-regular" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-dark)', cursor: 'pointer', userSelect: 'none' }}>
                  <input type="checkbox" checked={readOnChecked} onChange={(e) => setReadOnChecked(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  Finished on
                </label>
                <input type="date" value={readOnDate} onChange={e => setReadOnDate(e.target.value)} className="inter-regular" style={{ backgroundColor: '#f3f4f6', border: '1px solid var(--color-gray)', borderRadius: '4px', padding: '4px 8px', color: '#374151', outline: 'none' }} />
              </div>
            </div>

            <label className="inter-regular" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-dark)', cursor: 'pointer', userSelect: 'none' }}>
              <input type="checkbox" checked={readBefore} onChange={(e) => setReadBefore(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              I've read this before
            </label>

            {/* Review */}
            <textarea
              placeholder="Add a thought..."
              value={review}
              onChange={e => setReview(e.target.value)}
              className="inter-regular"
              style={{ width: '100%', height: '130px', backgroundColor: '#f3f4f6', border: '1px solid var(--color-gray)', borderRadius: '6px', padding: '15px', color: '#374151', fontSize: '16px', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
            />

            {/* Bottom row: Rating, Like */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '60px', alignItems: 'flex-start', marginTop: 'auto' }}>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                <span className="inter-bold" style={{ fontSize: '12px', color: 'var(--color-dark)', textTransform: 'uppercase' }}>Rating</span>
                <StarRating rating={rating} setRating={setRating} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                <span className="inter-bold" style={{ fontSize: '12px', color: 'var(--color-dark)', textTransform: 'uppercase' }}>Like</span>
                <button onClick={() => setIsLoved(!isLoved)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  {isLoved ? <HeartSolid style={{ width: '28px', color: '#990000' }} /> : <HeartIcon style={{ width: '28px', color: 'var(--color-dark)' }} />}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ backgroundColor: '#f9fafb', borderTop: '1px solid var(--color-gray)', padding: '15px 30px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handleSave} className="inter-bold" style={{ backgroundColor: '#990000', color: 'white', border: 'none', borderRadius: '4px', padding: '10px 25px', fontSize: '16px', cursor: 'pointer' }}>
            Save
          </button>
        </div>

      </div>
    </div>
  );
}
