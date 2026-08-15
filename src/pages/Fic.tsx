import { useState, useEffect } from 'react';
import { EyeIcon, HeartIcon, BookmarkIcon, ClockIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { EyeIcon as EyeSolid, HeartIcon as HeartSolid, BookmarkIcon as BookmarkSolid, ClockIcon as ClockSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { Book } from '../components/BookCard';
import { useBookActivity } from '../hooks/useBookActivity';
import BookmarkModal from '../components/BookmarkModal';
import FinishedModal from '../components/FinishedModal';
import StarRating from '../components/StarRating';

interface FicProps {
  book: Book;
  onBack: () => void;
}

export default function Fic({ book, onBack }: FicProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const { activity, updateActivity } = useBookActivity(book);
  const { isRead, isLoved, isBookmarked, inReadlist, rating, startedOnDate } = activity;
  const [hoverReadlist, setHoverReadlist] = useState(false);
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const [isFinishedModalOpen, setIsFinishedModalOpen] = useState(false);

  useEffect(() => {
    setImgLoaded(false);
  }, [book]);

  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : '/tempCover.png';

  return (
    <div style={{ width: '100%', padding: '0px 0px 40px 0px' }}>
      
      <button 
        onClick={onBack}
        className="inter-bold"
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--color-dark)', marginBottom: '20px', fontSize: '15px' }}
      >
        <ArrowLeftIcon style={{ width: '20px' }} />
        Back
      </button>

      <div style={{
        display: 'flex', gap: '40px', width: '100%', position: 'relative'
      }}>
        {/* Left Side: Cover Image & Stats */}
        <div style={{ width: '320px', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          {!imgLoaded && (
            <img src="/tempCover.png" alt="Loading..." style={{ width: '100%', objectFit: 'contain', objectPosition: 'top left', borderRadius: '8px', opacity: 0.6 }} />
          )}
          <img
            src={coverUrl}
            alt={book.title}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => { (e.target as HTMLImageElement).onerror = null; (e.target as HTMLImageElement).src = '/tempCover.png'; setImgLoaded(true); }}
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
              <StarRating rating={rating} setRating={(r) => updateActivity({ rating: r })} />
            </div>

            {/* Actions 2x2 Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 40px', justifyItems: 'start' }}>
              <button onClick={() => updateActivity({ isLoved: !isLoved })} className="inter-regular" style={{ width: '200px', justifyContent: 'flex-start', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--color-dark)', padding: 0 }}>
                {isLoved ? <HeartSolid style={{ width: '28px', color: '#990000' }} /> : <HeartIcon style={{ width: '28px' }} />}
                {isLoved ? 'Loved' : 'Love'}
              </button>
              <button
                onClick={() => setIsBookmarkModalOpen(true)}
                className="inter-regular"
                style={{ width: '200px', justifyContent: 'flex-start', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--color-dark)', padding: 0 }}
              >
                {isBookmarked ? <BookmarkSolid style={{ width: '28px', color: '#d4af37' }} /> : <BookmarkIcon style={{ width: '28px' }} />}
                Add bookmark
              </button>
              <button onClick={() => setIsFinishedModalOpen(true)} className="inter-regular" style={{ width: '200px', justifyContent: 'flex-start', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--color-dark)', padding: 0 }}>
                {isRead ? <EyeSolid style={{ width: '28px', color: '#3a9d46' }} /> : (startedOnDate ? <EyeSolid style={{ width: '28px', color: '#eab308' }} /> : <EyeIcon style={{ width: '28px' }} />)}
                {isRead ? 'Finished' : (startedOnDate ? 'In Progress' : 'Unfinished')}
              </button>
              <button
                onClick={() => updateActivity({ inReadlist: !inReadlist })}
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

      {isBookmarkModalOpen && (
        <BookmarkModal
          onClose={() => setIsBookmarkModalOpen(false)}
          onSave={(chapter, page, notes) => {
            const currentBookmarks = activity.bookmarks || [];
            updateActivity({
              isBookmarked: true,
              bookmarks: [...currentBookmarks, { chapter, page, notes }]
            });
            setIsBookmarkModalOpen(false);
          }}
        />
      )}

      {isFinishedModalOpen && (
        <FinishedModal
          book={book}
          activity={activity}
          onClose={() => setIsFinishedModalOpen(false)}
          onSave={updateActivity}
        />
      )}
    </div>
  );
}
