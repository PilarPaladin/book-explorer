import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { EyeIcon, HeartIcon, BookmarkIcon, ClockIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { EyeIcon as EyeSolid, HeartIcon as HeartSolid, BookmarkIcon as BookmarkSolid, ClockIcon as ClockSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { Book } from '../components/BookCard';
import { useBookActivity } from '../hooks/useBookActivity';
import AddBookmarkModal from '../components/AddBookmarkModal';
import AddReviewModal from '../components/AddReviewModal';
import StarRating from '../components/StarRating';
import { getBookDetails } from '../services/api';
import { getFicStats } from '../services/dbService';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return num.toString();
}

export default function Fic() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [book, setBook] = useState<Book | null>(location.state?.book || null);
  const [isLoading, setIsLoading] = useState(!book);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!book && id) {
      const fetchBook = async () => {
        setIsLoading(true);
        try {
          // Reconstruct the full key since our router just uses the ID part
          const fullKey = `/works/${id}`;
          const fetchedBook = await getBookDetails(fullKey);
          setBook(fetchedBook);
        } catch (err) {
          console.error("Failed to fetch book details", err);
          setError("Failed to load book details.");
        }
        setIsLoading(false);
      };
      fetchBook();
    }
  }, [id, book]);

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>Loading...</div>;
  }

  if (error || !book) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '50px', color: 'var(--color-dark)' }}>{error || "Book not found."}</div>;
  }

  return <FicContent book={book} onBack={() => navigate(-1)} />;
}

function FicContent({ book, onBack }: { book: Book, onBack: () => void }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const { activity, updateActivity } = useBookActivity(book);
  const { profile } = useAuth();
  const { isRead, isLoved, isBookmarked, inReadlist, rating, startedOnDate } = activity;
  const [hoverReadlist, setHoverReadlist] = useState(false);
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const [isFinishedModalOpen, setIsFinishedModalOpen] = useState(false);
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);
  const [synopsis, setSynopsis] = useState<string | null>(null);
  const [isLoadingSynopsis, setIsLoadingSynopsis] = useState(false);
  const [ficStats, setFicStats] = useState<{
    avg_rating?: number;
    rating_count?: number;
    readlist_count?: number;
    loves_count?: number;
  } | null>(null);

  useEffect(() => {
    setImgLoaded(false);
    setSynopsis(null);
    setIsSynopsisExpanded(false);
    
    const loadStats = async () => {
      const key = book.key ? book.key.replace('/works/', '') : null;
      if (key) {
        const stats = await getFicStats(key);
        setFicStats(stats);
      }
    };
    loadStats();
    const loadSynopsis = async () => {
      // Prioritize fanfic synopsis from the database
      if (book.synopsis) {
        // Strip out HTML tags since AO3 synopses often come with them and we render text
        const cleanSynopsis = book.synopsis.replace(/<[^>]*>?/gm, '');
        setSynopsis(cleanSynopsis);
        return;
      }

      // Fallback for OpenLibrary books
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
    loadSynopsis();
  }, [book]);

  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : '/tempCover.png';

  return (
    <div style={{ width: '100%', padding: '0px 0px 40px 0px' }}>
      <SEO 
        title={book.title || 'Fanfic'} 
        description={synopsis ? synopsis.slice(0, 150) : `Read ${book.title} on myArkived.`} 
      />

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }} title={`${ficStats?.rating_count || 0} total ratings`}>
              <StarSolid style={{ width: '22px', color: '#0f172a' }} /> {ficStats?.avg_rating || 0} ({formatNumber(ficStats?.rating_count || 0)})
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }} title={`${ficStats?.readlist_count || 0} users added to readlist`}>
              <ClockSolid style={{ width: '22px', color: '#3f7dbe' }} /> {formatNumber(ficStats?.readlist_count || 0)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }} title={`${ficStats?.loves_count || 0} total loves`}>
              <HeartSolid style={{ width: '22px', color: '#990000' }} /> {formatNumber(ficStats?.loves_count || 0)}
            </div>
          </div>
        </div>

        {/* Right Side: Details & Actions */}
        <div className="fic-right">

          {/* Top Section: Title & Details */}
          <div className="fic-title-block" style={{ paddingRight: '20px' }}>
            <h2 className="rakkas-regular" style={{ color: 'var(--color-red)', fontSize: '40px', marginTop: 0, marginBottom: '10px', lineHeight: '1.1' }}>
              {book.title}
            </h2>
            
            <div className="inter-regular" style={{ fontSize: '18px', color: '#475569', marginBottom: '25px' }}>
              by <span className="inter-bold" style={{ color: 'var(--color-dark)' }}>{book.author_name?.join(', ') || book.authors?.join(', ') || 'Unknown'}</span>
            </div>

            <div className="inter-regular fic-details-grid" style={{ gridTemplateColumns: '1fr', gap: '15px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                {book.rating && <div><strong>Rating:</strong> {book.rating}</div>}
                {book.word_count != null && <div><strong>Words:</strong> {book.word_count.toLocaleString()}</div>}
                {book.chapters_published != null && <div><strong>Chapters:</strong> {book.chapters_published}{book.chapters_total ? `/${book.chapters_total}` : ''}</div>}
                {book.kudos != null && <div><strong>Kudos:</strong> {book.kudos.toLocaleString()}</div>}
                {book.updated_date && <div><strong>Updated:</strong> {new Date(book.updated_date).toLocaleDateString()}</div>}
                {book.published_date && <div><strong>Published:</strong> {new Date(book.published_date).toLocaleDateString()}</div>}
              </div>

              {(() => {
                if (book.word_count == null) return null;
                const wpm = profile?.words_per_minute || 250;
                const totalMinutes = Math.ceil(book.word_count / wpm);
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;
                let timeString = '';
                if (hours > 0) timeString += `${hours} hr${hours > 1 ? 's' : ''} `;
                if (minutes > 0 || hours === 0) timeString += `${minutes} min${minutes !== 1 ? 's' : ''}`;
                return (
                  <div className="fic-detail-row">
                    <span className="fic-detail-label">Est. Reading Time:</span> {timeString} <span style={{fontSize: '14px', color: '#64748b'}}>(@ {wpm} wpm)</span>
                  </div>
                );
              })()}

              {book.url && (
                <div className="fic-detail-row">
                  <span className="fic-detail-label">Link:</span> <a href={book.url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-red)', fontWeight: 500 }}>Read on AO3</a>
                </div>
              )}

              {book.archive_warnings && book.archive_warnings.length > 0 && (
                <div className="fic-detail-row">
                  <span className="fic-detail-label">Warnings:</span>
                  <div className="fic-tags-container">
                    {book.archive_warnings.map((tag: string) => <span key={tag} className="fic-tag-pill warning">{tag}</span>)}
                  </div>
                </div>
              )}

              {book.fandoms && book.fandoms.length > 0 && (
                <div className="fic-detail-row">
                  <span className="fic-detail-label">Fandoms:</span>
                  <div className="fic-tags-container">
                    {book.fandoms.map((tag: string) => <span key={tag} className="fic-tag-pill fandom">{tag}</span>)}
                  </div>
                </div>
              )}

              {book.relationships && book.relationships.length > 0 && (
                <div className="fic-detail-row">
                  <span className="fic-detail-label">Relationships:</span>
                  <div className="fic-tags-container">
                    {book.relationships.map((tag: string) => <span key={tag} className="fic-tag-pill relationship">{tag}</span>)}
                  </div>
                </div>
              )}

              {book.additional_tags && book.additional_tags.length > 0 && (
                <div className="fic-detail-row">
                  <span className="fic-detail-label">Tags:</span>
                  <div className="fic-tags-container">
                    {book.additional_tags.map((tag: string) => <span key={tag} className="fic-tag-pill">{tag}</span>)}
                  </div>
                </div>
              )}
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
                onClick={() => {
                  if (isRead || startedOnDate) return;
                  updateActivity({ inReadlist: !inReadlist })
                }}
                onMouseEnter={() => setHoverReadlist(true)}
                onMouseLeave={() => setHoverReadlist(false)}
                className="inter-regular fic-action-btn"
                title={(isRead || startedOnDate) ? "Cannot add to readlist (already started or finished)" : undefined}
                style={{
                  color: inReadlist ? '#3f7dbe' : ((isRead || startedOnDate) ? '#9ca3af' : undefined),
                  cursor: (isRead || startedOnDate) ? 'not-allowed' : 'pointer',
                  borderColor: (isRead || startedOnDate) ? '#e5e7eb' : undefined
                }}
                disabled={!!(isRead || startedOnDate)}
              >
                {inReadlist ? <ClockSolid style={{ width: '28px', color: '#3f7dbe' }} /> : <ClockIcon style={{ width: '28px', color: (isRead || startedOnDate) ? '#9ca3af' : undefined }} />}
                {inReadlist ? (hoverReadlist && !(isRead || startedOnDate) ? 'Remove' : 'Readlist') : 'Readlist'}
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
        <AddReviewModal
          book={book}
          activity={activity}
          onClose={() => setIsFinishedModalOpen(false)}
          onSave={updateActivity}
        />
      )}
    </div>
  );
}
