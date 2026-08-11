import React, { useState, useEffect } from 'react';
import { searchBooks, getPopularBooks } from './services/api';
import { EyeIcon, HeartIcon, BookmarkIcon, EllipsisHorizontalIcon, ClockIcon, StarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { EyeIcon as EyeSolid, HeartIcon as HeartSolid, BookmarkIcon as BookmarkSolid, ClockIcon as ClockSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';

// Props demonstration: BookCard component
function BookCard({ book, onClick }) {
  const [isRead, setIsRead] = useState(false);
  const [isLoved, setIsLoved] = useState(false);
  const [inReadlist, setInReadlist] = useState(false);
  // Open Library API returns cover_i, title, author_name, first_publish_year
  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : 'https://via.placeholder.com/150x220?text=No+Cover';

  const author = book.author_name ? `by ${book.author_name[0]}` : 'Unknown Author';

  return (
    <div className="book-card" onClick={() => onClick(book)} style={{ cursor: 'pointer' }}>
      <div className="book-cover-container">
        <img src={coverUrl} alt={book.title} className="book-cover" />

        <div className="book-ribbon" onClick={(e) => e.stopPropagation()}>
          <span className="action-icon dark-icon" title="More options" onClick={() => onClick(book)} style={{ marginBottom: '-7px' }} >
            <EllipsisHorizontalIcon style={{ width: '28px', height: '28px' }} strokeWidth={2} />
          </span>
          <span
            className="action-icon dark-icon eye"
            title="Toggle read"
            onClick={() => setIsRead(!isRead)}
            style={{ color: isRead ? '#3a9d46' : undefined }}
          >
            {isRead ? <EyeSolid style={{ width: '28px', height: '28px' }} /> : <EyeIcon style={{ width: '28px', height: '28px' }} strokeWidth={2} />}
          </span>
          <span
            className="action-icon dark-icon heart"
            title="Love this book"
            onClick={() => setIsLoved(!isLoved)}
            style={{ color: isLoved ? '#990000' : undefined }}
          >
            {isLoved ? <HeartSolid style={{ width: '28px', height: '28px' }} /> : <HeartIcon style={{ width: '28px', height: '28px' }} strokeWidth={2} />}
          </span>
          <span
            className="action-icon dark-icon readlist"
            title="Readlist"
            onClick={() => setInReadlist(!inReadlist)}
            style={{ color: inReadlist ? '#3f7dbe' : undefined }}
          >
            {inReadlist ? <ClockSolid style={{ width: '28px', height: '28px' }} /> : <ClockIcon style={{ width: '28px', height: '28px' }} strokeWidth={2} />}
          </span>
        </div>
      </div>
      <div className="book-info">
        <h3 className="book-title inter-bold">{book.title}</h3>
        <p className="book-author inter-regular">{author}</p>
        <p className="book-year inter-regular">{book.first_publish_year}</p>
      </div>
    </div>
  );
}

function StarRating({ rating, setRating }) {
  const [hoverValue, setHoverValue] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  const displayValue = hoverValue !== null ? hoverValue : rating;

  const handleMouseMove = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    setHoverValue(index - (isHalf ? 0.5 : 0));
  };

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => { setIsHovering(false); setHoverValue(null); }}
    >
      <button
        onClick={() => setRating(0)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          opacity: isHovering ? 1 : 0, transition: 'opacity 0.2s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
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

// Props demonstration: BookModal component
function BookModal({ book, onClose }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isRead, setIsRead] = useState(false);
  const [isLoved, setIsLoved] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [inReadlist, setInReadlist] = useState(false);
  const [rating, setRating] = useState(0);

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
    : 'https://via.placeholder.com/300x450?text=No+Cover';

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

        {/* Left Side: Cover Image */}
        <div style={{ width: '320px', flexShrink: 0, display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
          {!imgLoaded && (
            <img src="/tempCover.png" alt="Loading..." style={{ width: '100%', objectFit: 'contain', objectPosition: 'top left', borderRadius: '8px', opacity: 0.6 }} />
          )}
          <img
            src={coverUrl}
            alt={book.title}
            onLoad={() => setImgLoaded(true)}
            style={{
              width: '100%',
              objectFit: 'contain',
              objectPosition: 'top left',
              borderRadius: '8px',
              display: imgLoaded ? 'block' : 'none'
            }}
          />
        </div>

        {/* Right Side: Details & Actions */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '10px 0' }}>

          {/* Top Section: Title & Details */}
          <div style={{ paddingRight: '20px' }}>
            <h2 className="rakkas-regular" style={{ color: 'var(--color-red)', fontSize: '48px', marginTop: 0, marginBottom: '20px', lineHeight: '1.1' }}>
              {book.title}
            </h2>
            <div className="inter-regular" style={{ fontSize: '18px', color: 'var(--color-dark)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ margin: 0 }}><strong>Author:</strong> {book.author_name?.join(', ') || 'Unknown'}</p>
              <p style={{ margin: 0 }}><strong>First Published:</strong> {book.first_publish_year || 'Unknown'}</p>
              <p style={{ margin: 0 }}><strong>Editions:</strong> {book.edition_count || 1}</p>
              <p style={{ margin: 0 }}><strong>Reading time:</strong> 8hrs, 22mins</p>
            </div>
          </div>

          {/* Center Section: Actions Grid & Rating */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'flex-start', marginTop: '50px', gap: '30px' }}>

            {/* Actions 2x2 Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px 60px', justifyItems: 'start' }}>
              <button onClick={() => setIsLoved(!isLoved)} className="inter-regular" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: 'var(--color-dark)', padding: 0 }}>
                {isLoved ? <HeartSolid style={{ width: '32px', color: '#990000' }} /> : <HeartIcon style={{ width: '32px' }} />}
                Love
              </button>
              <button onClick={() => setIsBookmarked(!isBookmarked)} className="inter-regular" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: 'var(--color-dark)', padding: 0 }}>
                {isBookmarked ? <BookmarkSolid style={{ width: '32px', color: '#d4af37' }} /> : <BookmarkIcon style={{ width: '32px' }} />}
                Bookmark
              </button>
              <button onClick={() => setIsRead(!isRead)} className="inter-regular" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: 'var(--color-dark)', padding: 0 }}>
                {isRead ? <EyeSolid style={{ width: '32px', color: '#3a9d46' }} /> : <EyeIcon style={{ width: '32px' }} />}
                {isRead ? 'Finished' : 'Unfinished'}
              </button>
              <button onClick={() => setInReadlist(!inReadlist)} className="inter-regular" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: 'var(--color-dark)', padding: 0 }}>
                {inReadlist ? <ClockSolid style={{ width: '32px', color: '#3f7dbe' }} /> : <ClockIcon style={{ width: '32px' }} />}
                Readlist
              </button>
            </div>

            {/* Stars & Rated Text */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
              <StarRating rating={rating} setRating={setRating} />
              <span className="inter-regular" style={{ fontSize: '24px', color: 'var(--color-dark)' }}>Rated</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const fetchInitial = async () => {
      setIsLoading(true);
      try {
        const results = await getPopularBooks();
        setBooks(results || []);
      } catch (err) {
        console.error("Failed to fetch initial books", err);
      }
      setIsLoading(false);
    };
    fetchInitial();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const results = await searchBooks(searchQuery);
      setBooks(results || []);
    } catch (err) {
      console.error("Search failed", err);
      setBooks([]);
    }
    setIsLoading(false);
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-left">
          <img src="/logo.png" alt="Logo" className="logo" />
          <h1 className="brand-name rakkas-regular">myArkived</h1>
        </div>
        <nav className="header-nav inter-bold">
          <a href="#" className="nav-link">Bookmarks</a>
          <a href="#" className="nav-link">Readlists</a>
          <a href="#" className="nav-link">About</a>
        </nav>
      </header>

      <main className="main-content">
        <div className="left-column">
          <h2 className="welcome-text inter-regular">Welcome back, Guest User. Here's whats been popular</h2>

          <form className="search-container" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for books by title, author..."
              className="search-input inter-regular"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button inter-bold">Search</button>
          </form>

          {isLoading ? (
            <div className="book-grid">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="book-card" style={{ opacity: 0.6 }}>
                  <img src="/tempCover.png" alt="Loading..." className="book-cover" />
                  <div className="book-info">
                    <h3 className="book-title inter-bold" style={{ backgroundColor: '#e5e7eb', color: 'transparent', borderRadius: '4px', width: '80%' }}>Loading</h3>
                    <p className="book-author inter-regular" style={{ backgroundColor: '#e5e7eb', color: 'transparent', borderRadius: '4px', width: '60%', marginTop: '5px' }}>Author</p>
                    <p className="book-year inter-regular" style={{ backgroundColor: '#e5e7eb', color: 'transparent', borderRadius: '4px', width: '30%', marginTop: 'auto' }}>Year</p>
                  </div>
                </div>
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="inter-regular" style={{ textAlign: 'center', padding: '60px 20px', fontSize: '18px', color: 'var(--color-dark)' }}>
              No books found. Try a different search term.
            </div>
          ) : (
            <div className="book-grid">
              {books.map((book, index) => (
                <BookCard key={book.key || index} book={book} onClick={setSelectedBook} />
              ))}
            </div>
          )}
        </div>

        <div className="right-column">
          <div className="profile-section">
            <div className="avatar inter-bold">👤</div>
            <h3 className="profile-name inter-bold">Guest User <span className="pro-badge inter-bold">PRO</span></h3>
          </div>

          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-value inter-bold">0</span>
              <span className="stat-label inter-regular uppercase">BOOKS</span>
            </div>
            <div className="stat-item">
              <span className="stat-value inter-bold">0</span>
              <span className="stat-label inter-regular uppercase">BOOKMARKS</span>
            </div>
            <div className="stat-item">
              <span className="stat-value inter-bold">0</span>
              <span className="stat-label inter-regular uppercase">READLIST</span>
            </div>
          </div>

          <h4 className="section-title inter-bold uppercase">FAVOURITE READS</h4>
          <div className="fav-reads-grid">
            {isLoading ? (
              <>
                <img src="/tempCover.png" alt="Loading..." className="fav-book-cover" style={{ opacity: 0.6 }} />
                <img src="/tempCover.png" alt="Loading..." className="fav-book-cover" style={{ opacity: 0.6 }} />
                <img src="/tempCover.png" alt="Loading..." className="fav-book-cover" style={{ opacity: 0.6 }} />
              </>
            ) : (
              <>
                <img src="https://covers.openlibrary.org/b/id/8406786-M.jpg" alt="Fav 1" className="fav-book-cover" />
                <img src="https://covers.openlibrary.org/b/id/9251896-M.jpg" alt="Fav 2" className="fav-book-cover" />
                <img src="https://covers.openlibrary.org/b/id/9251897-M.jpg" alt="Fav 3" className="fav-book-cover" />
              </>
            )}
          </div>

          <h4 className="section-title inter-bold uppercase">RECENT ACTIVITY</h4>
          <div className="activity-list">
            <div className="activity-item inter-regular">
              You added <span className="activity-title inter-bold">"Dune"</span> to your readlist 2d
            </div>
            <div className="activity-item inter-regular">
              You reviewed <span className="activity-title inter-bold">"Tempest"</span> to your readlist 2d
            </div>
            <div className="activity-item inter-regular">
              You bookmarked <span className="activity-title inter-bold">"Ultraviolence"</span> 2d
            </div>
            <div className="activity-item inter-regular">
              You added <span className="activity-title inter-bold">"Dune"</span> to your readlist 2d
            </div>
            <div className="activity-item inter-regular">
              You added <span className="activity-title inter-bold">"Dune"</span> to your readlist 2d
            </div>
            <div className="activity-item inter-regular">
              You added <span className="activity-title inter-bold">"Dune"</span> to your readlist 2d
            </div>
          </div>
        </div>
      </main>

      <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
    </div>
  );
}

export default App;
