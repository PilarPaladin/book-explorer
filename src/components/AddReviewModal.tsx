import { useState } from 'react';
import { XMarkIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { Book } from './BookCard';
import { BookActivity } from '../hooks/useBookActivity';
import StarRating from './StarRating';

interface AddReviewModalProps {
  book: Book;
  activity?: BookActivity;
  onClose: () => void;
  onSave?: (updates: any) => void;
}

export default function AddReviewModal({ book, activity = {} as BookActivity, onClose, onSave }: AddReviewModalProps) {
  const [readOnDate, setReadOnDate] = useState(new Date().toISOString().split('T')[0]);
  const [readOnChecked, setReadOnChecked] = useState(true);
  const [startedOnDate, setStartedOnDate] = useState(new Date().toISOString().split('T')[0]);
  const [startedOnChecked, setStartedOnChecked] = useState(false);
  const [readBefore, setReadBefore] = useState(activity.isRead || false);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [isLoved, setIsLoved] = useState(activity.isLoved || false);

  const handleSave = () => {
    if (onSave) {
      onSave({
        isRead: readOnChecked || readBefore,
        readOnDate: readOnChecked ? readOnDate : null,
        startedOnDate: startedOnChecked ? startedOnDate : null,
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
      <div className="finished-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="finished-modal-header">
          <h2 className="rakkas-regular finished-modal-title">
            I finished reading...
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <XMarkIcon style={{ width: '24px', color: 'var(--color-dark)' }} />
          </button>
        </div>

        {/* Body */}
        <div className="finished-modal-body">

          {/* Left: Cover */}
          <div className="finished-modal-cover">
            <img src={book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : '/tempCover.png'} alt="Cover" style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', aspectRatio: '2/3', objectFit: 'cover' }} />
          </div>

          {/* Right: Info */}
          <div className="finished-modal-book-info">
            <h3 className="rakkas-regular finished-modal-book-title">{book.title}</h3>
            <p className="inter-regular finished-modal-book-author">
              {book.author_name?.join(', ') || 'Unknown Author'}
            </p>
          </div>

          {/* Controls */}
          <div className="finished-modal-controls">


            {/* Checkboxes */}
            <div className="finished-form-row">

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label className="inter-regular finished-modal-label">
                  <input type="checkbox" checked={startedOnChecked} onChange={(e) => setStartedOnChecked(e.target.checked)} className="finished-modal-checkbox" />
                  Started On
                </label>
                <input type="date" value={startedOnDate} onChange={e => { setStartedOnDate(e.target.value); setStartedOnChecked(true); }} className="inter-regular finished-modal-date" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label className="inter-regular finished-modal-label">
                  <input type="checkbox" checked={readOnChecked} onChange={(e) => setReadOnChecked(e.target.checked)} className="finished-modal-checkbox" />
                  Finished on
                </label>
                <input type="date" value={readOnDate} onChange={e => { setReadOnDate(e.target.value); setReadOnChecked(true); }} className="inter-regular finished-modal-date" />
              </div>
            </div>

            <label className="inter-regular finished-modal-label">
              <input type="checkbox" checked={readBefore} onChange={(e) => setReadBefore(e.target.checked)} className="finished-modal-checkbox" />
              I've read this before
            </label>

            {/* Review */}
            <textarea
              placeholder="Add a thought..."
              value={review}
              onChange={e => setReview(e.target.value)}
              className="inter-regular finished-modal-review"
            />

            {/* Bottom row: Rating, Like */}
            <div className="finished-rating-row">

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
        <div className="finished-modal-footer">
          <button onClick={handleSave} className="inter-bold finished-modal-submit">
            Save
          </button>
        </div>

      </div>
    </div>
  );
}
