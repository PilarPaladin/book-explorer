import { useState, useEffect } from 'react';
import { EyeIcon, HeartIcon, BookmarkIcon, ClockIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { EyeIcon as EyeSolid, HeartIcon as HeartSolid, BookmarkIcon as BookmarkSolid, ClockIcon as ClockSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { Book } from '../components/BookCard';
import { useBookActivity } from '../hooks/useBookActivity';
import AddBookmarkModal from '../components/AddBookmarkModal';
import FinishedModal from '../components/FinishedModal';
import StarRating from '../components/StarRating';
import { getBookDetails } from '../services/api';

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
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);
  const [synopsis, setSynopsis] = useState<string | null>(null);
  const [isLoadingSynopsis, setIsLoadingSynopsis] = useState(false);

  useEffect(() => {
    setImgLoaded(false);
    setSynopsis(null);
    setIsSynopsisExpanded(false);
    const fetchSynopsis = async () => {
      if (!book.key) return;
      setIsLoadingSynopsis(true);
      try {
        const details = await getBookDetails(book.key);
        if (details.description) {
          const desc = typeof details.description === 'string' ? details.description : details.description.value;
          setSynopsis(desc);
        } else {
          setSynopsis("No synopsis available for this book.");
        }
      } catch (e) {
        console.error("Failed to fetch synopsis", e);
        setSynopsis("Failed to load synopsis.");
      }
      setIsLoadingSynopsis(false);
    };
    fetchSynopsis();
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

      <div className="fic-container">
        {/* Left Side: Cover Image & Stats */}
        <div className="fic-left">
          <div className="fic-cover-block" style={{ width: '100%' }}>
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
          </div>
          {/* Stats Row */}
          <div className="inter-regular fic-stats-block" style={{ display: 'flex', justifyContent: 'space-around', width: '100%', padding: '0 10px', color: '#000', fontSize: '18px' }}>
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
        <div className="fic-right">

          {/* Top Section: Title & Details */}
          <div className="fic-title-block" style={{ paddingRight: '20px' }}>
            <h2 className="rakkas-regular" style={{ color: 'var(--color-red)', fontSize: '40px', marginTop: 0, marginBottom: '20px', lineHeight: '1.1' }}>
              {book.title}
            </h2>
            <div className="inter-regular fic-details-grid">
              <div><strong>Author:</strong> {book.author_name?.join(', ') || 'Unknown'}</div>
              <div><strong>Editions:</strong> {book.edition_count || 1}</div>
              <div><strong>First Published:</strong> {book.first_publish_year || 'Unknown'}</div>
              <div><strong>Link to book:</strong> samplelink.com</div>
              <div><strong>Reading time:</strong> 8hrs, 22mins</div>
            </div>
          </div>

          {/* Synopsis */}
          <div className="fic-synopsis-block" style={{ marginTop: '25px', paddingRight: '20px', whiteSpace: 'pre-wrap' }}>
            <h3 className="inter-bold" style={{ fontSize: '16px', marginBottom: '10px' }}>Synopsis:</h3>
            <p className="inter-regular" style={{ fontSize: '16px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
              {(() => {
                if (isLoadingSynopsis) return "Loading synopsis...";
                const synopsisText = synopsis || "No synopsis available for this book.";
                const isLongSynopsis = synopsisText.length > 250;
                const displaySynopsis = (isSynopsisExpanded || !isLongSynopsis) ? synopsisText : `${synopsisText.slice(0, 250)}...`;
                return (
                  <>
                    {displaySynopsis}
                    {isLongSynopsis && (
                      <button
                        onClick={() => setIsSynopsisExpanded(!isSynopsisExpanded)}
                        className="inter-regular"
                        style={{ background: 'none', border: 'none', color: 'var(--color-red)', cursor: 'pointer', padding: 0, marginLeft: '8px', fontSize: '15px', textDecoration: 'underline' }}
                      >
                        {isSynopsisExpanded ? 'Show less' : 'More...'}
                      </button>
                    )}
                  </>
                );
              })()}
            </p>
          </div>

          {/* Bottom Section: Rating & Actions */}
          <div className="fic-actions-block" style={{ marginTop: 'auto', paddingTop: '30px', display: 'flex', flexDirection: 'column', gap: '25px' }}>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span className="inter-regular" style={{ fontSize: '20px', color: 'var(--color-dark)' }}>Rated</span>
              <StarRating rating={rating} setRating={(r) => updateActivity({ rating: r })} />
            </div>

            {/* Actions 2x2 Grid */}
            <div className="fic-actions-grid">
              <button onClick={() => updateActivity({ isLoved: !isLoved })} className="inter-regular fic-action-btn">
                {isLoved ? <HeartSolid style={{ width: '28px', color: '#990000' }} /> : <HeartIcon style={{ width: '28px' }} />}
                {isLoved ? 'Loved' : 'Love'}
              </button>
              <button
                onClick={() => setIsBookmarkModalOpen(true)}
                className="inter-regular fic-action-btn"
              >
                {isBookmarked ? <BookmarkSolid style={{ width: '28px', color: '#d4af37' }} /> : <BookmarkIcon style={{ width: '28px' }} />}
                Add bookmark
              </button>
              <button onClick={() => setIsFinishedModalOpen(true)} className="inter-regular fic-action-btn">
                {isRead ? <EyeSolid style={{ width: '28px', color: '#3a9d46' }} /> : (startedOnDate ? <EyeSolid style={{ width: '28px', color: '#eab308' }} /> : <EyeIcon style={{ width: '28px' }} />)}
                {isRead ? 'Finished' : (startedOnDate ? 'In Progress' : 'Unfinished')}
              </button>
              <button
                onClick={() => updateActivity({ inReadlist: !inReadlist })}
                onMouseEnter={() => setHoverReadlist(true)}
                onMouseLeave={() => setHoverReadlist(false)}
                className="inter-regular fic-action-btn"
              >
                {inReadlist ? <ClockSolid style={{ width: '28px', color: '#3f7dbe' }} /> : <ClockIcon style={{ width: '28px' }} />}
                {inReadlist ? (hoverReadlist ? 'Remove' : 'Readlist') : 'Readlist'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isBookmarkModalOpen && (
        <AddBookmarkModal
          onClose={() => setIsBookmarkModalOpen(false)}
          onSave={(chapter, page, notes) => {
            const currentBookmarks = activity.bookmarks || [];
            updateActivity({
              isBookmarked: true,
              bookmarks: [...currentBookmarks, { 
                id: Date.now().toString(),
                chapter, 
                page, 
                notes,
                date: new Date().toISOString().split('T')[0] // 'YYYY-MM-DD'
              }]
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
