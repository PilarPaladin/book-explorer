import React, { useState, useEffect } from 'react';
import { EyeIcon, HeartIcon, BookmarkIcon, ClockIcon, StarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { EyeIcon as EyeSolid, HeartIcon as HeartSolid, BookmarkIcon as BookmarkSolid, ClockIcon as ClockSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { Book } from './BookCard';

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
}

function StarRating({ rating, setRating }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  const displayValue = hoverValue !== null ? hoverValue : rating;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    setHoverValue(index - (isHalf ? 0.5 : 0));
  };

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => { setIsHovering(false); setHoverValue(null); }}
    >
      <button
        onClick={() => setRating(0)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          opacity: isHovering ? 1 : 0, transition: 'opacity 0.2s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'absolute', left: '100%', marginLeft: '2px'
        }}
        title="Clear rating"
      >
        <XMarkIcon style={{ width: '28px', color: '#94a3b8' }} />
      </button>

      <div style={{ display: 'flex', gap: '8px' }}>
        {[1, 2, 3, 4, 5].map((star) => {
          let fillPercentage = 0;
          if (displayValue >= star) fillPercentage = 100;
          else if (displayValue === star - 0.5) fillPercentage = 50;

          return (
            <div
              key={star}
              onMouseMove={(e) => handleMouseMove(e, star)}
              onClick={() => setRating(hoverValue !== null ? hoverValue : star)}
              style={{ position: 'relative', width: '40px', height: '40px', cursor: 'pointer', color: '#0f172a' }}
            >
              <StarIcon style={{ width: '40px', position: 'absolute', top: 0, left: 0 }} />
              <div style={{
                position: 'absolute', top: 0, left: 0,
                width: `${fillPercentage}%`, overflow: 'hidden',
                transition: 'width 0.15s ease-out', height: '100%'
              }}>
                <StarSolid style={{ width: '40px' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface BookModalProps {
  book: Book | null;
  onClose: () => void;
}

export default function BookModal({ book, onClose }: BookModalProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isRead, setIsRead] = useState(false);
  const [isLoved, setIsLoved] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [inReadlist, setInReadlist] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverBookmark, setHoverBookmark] = useState(false);
  const [hoverReadlist, setHoverReadlist] = useState(false);

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, []);

  useEffect(() => {
    setImgLoaded(false);
    // Reset state for new book
    setIsRead(false);
    setIsLoved(false);
    setIsBookmarked(false);
    setInReadlist(false);
    setRating(0);
  }, [book]);

  if (!book) return null;

  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : '/tempCover.png';

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }} onClick={onClose}>
      <div style={{
        backgroundColor: 'var(--color-white)', padding: '40px', borderRadius: '12px',
        display: 'flex', gap: '40px', width: 'fit-content', maxWidth: '1000px',
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)', position: 'relative'
      }} onClick={e => e.stopPropagation()}>

        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}
          title="Close"
        >
          <XMarkIcon style={{ width: '32px', color: 'var(--color-dark)' }} />
        </button>

        {/* Left Side: Cover Image & Stats */}
        <div style={{ width: '320px', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          {!imgLoaded && (
            <img src="/tempCover.png" alt="Loading..." style={{ width: '100%', objectFit: 'contain', objectPosition: 'top left', borderRadius: '8px', opacity: 0.6 }} />
          )}
          <img
            src={coverUrl}
            alt={book.title}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => { e.target.onerror = null; e.target.src = '/tempCover.png'; setImgLoaded(true); }}
            style={{
              width: '100%',
              objectFit: 'contain',
              objectPosition: 'top center',
              borderRadius: '8px',
              display: imgLoaded ? 'block' : 'none'
            }}
          />
          {/* Stats Row */}
          <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', padding: '0 10px', color: '#000', fontSize: '18px' }} className="inter-regular">
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <StarSolid style={{ width: '22px', color: '#0f172a' }} /> 3.5 (1.2k)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <ClockSolid style={{ width: '22px', color: '#3f7dbe' }} /> 240
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <HeartSolid style={{ width: '22px', color: '#990000' }} /> 635
            </div>
          </div>
        </div>

        {/* Right Side: Details & Actions */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '10px 0' }}>

          {/* Top Section: Title & Details */}
          <div style={{ paddingRight: '20px' }}>
            <h2 className="rakkas-regular" style={{ color: 'var(--color-red)', fontSize: '40px', marginTop: 0, marginBottom: '20px', lineHeight: '1.1' }}>
              {book.title}
            </h2>
            <div className="inter-regular" style={{ fontSize: '16px', color: 'var(--color-dark)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div><strong>Author:</strong> {book.author_name?.join(', ') || 'Unknown'}</div>
              <div><strong>Editions:</strong> {book.edition_count || 1}</div>
              <div><strong>First Published:</strong> {book.first_publish_year || 'Unknown'}</div>
              <div><strong>Link to book:</strong> samplelink.com</div>
              <div><strong>Reading time:</strong> 8hrs, 22mins</div>
            </div>
          </div>

          {/* Synopsis */}
          <div style={{ marginTop: '25px', paddingRight: '20px' }}>
            <h3 className="inter-bold" style={{ fontSize: '16px', marginBottom: '10px' }}>Synopsis:</h3>
            <p className="inter-regular" style={{ fontSize: '16px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
              Lorem ipsum dolor Lorem ipsum dolorLorem ipsum dolor<br />
              Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor<br />
              Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor
            </p>
          </div>

          {/* Bottom Section: Rating & Actions */}
          <div style={{ marginTop: 'auto', paddingTop: '30px', display: 'flex', flexDirection: 'column', gap: '25px' }}>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span className="inter-regular" style={{ fontSize: '20px', color: 'var(--color-dark)' }}>Rated</span>
              <StarRating rating={rating} setRating={setRating} />
            </div>

            {/* Actions 2x2 Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 40px', justifyItems: 'start' }}>
              <button onClick={() => setIsLoved(!isLoved)} className="inter-regular" style={{ width: '200px', justifyContent: 'flex-start', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--color-dark)', padding: 0 }}>
                {isLoved ? <HeartSolid style={{ width: '28px', color: '#990000' }} /> : <HeartIcon style={{ width: '28px' }} />}
                {isLoved ? 'Loved' : 'Love'}
              </button>
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                onMouseEnter={() => setHoverBookmark(true)}
                onMouseLeave={() => setHoverBookmark(false)}
                className="inter-regular"
                style={{ width: '200px', justifyContent: 'flex-start', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--color-dark)', padding: 0 }}
              >
                {isBookmarked ? <BookmarkSolid style={{ width: '28px', color: '#d4af37' }} /> : <BookmarkIcon style={{ width: '28px' }} />}
                {isBookmarked ? (hoverBookmark ? 'Remove' : 'Bookmark') : 'Bookmark'}
              </button>
              <button onClick={() => setIsRead(!isRead)} className="inter-regular" style={{ width: '200px', justifyContent: 'flex-start', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--color-dark)', padding: 0 }}>
                {isRead ? <EyeSolid style={{ width: '28px', color: '#3a9d46' }} /> : <EyeIcon style={{ width: '28px' }} />}
                {isRead ? 'Finished' : 'Unfinished'}
              </button>
              <button
                onClick={() => setInReadlist(!inReadlist)}
                onMouseEnter={() => setHoverReadlist(true)}
                onMouseLeave={() => setHoverReadlist(false)}
                className="inter-regular"
                style={{ width: '200px', justifyContent: 'flex-start', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--color-dark)', padding: 0 }}
              >
                {inReadlist ? <ClockSolid style={{ width: '28px', color: '#3f7dbe' }} /> : <ClockIcon style={{ width: '28px' }} />}
                {inReadlist ? (hoverReadlist ? 'Remove' : 'Readlist') : 'Readlist'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
