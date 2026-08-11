import React, { useState, useEffect } from 'react';
import { searchBooks, getPopularBooks } from './services/api';
import { EyeIcon, HeartIcon, BookmarkIcon, EllipsisHorizontalIcon, ClockIcon, StarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { EyeIcon as EyeSolid, HeartIcon as HeartSolid, BookmarkIcon as BookmarkSolid, ClockIcon as ClockSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import Bookmarks from './pages/Bookmarks';
import Readlist from './pages/Readlist';
import Journal from './pages/Journal';
import About from './pages/About';
import Sidebar from './components/Sidebar';

// Props demonstration: BookCard component
function BookCard({ book, onClick }) {
  const [isRead, setIsRead] = useState(false);
  const [isLoved, setIsLoved] = useState(false);
  const [inReadlist, setInReadlist] = useState(false);
  // Open Library API returns cover_i, title, author_name, first_publish_year
  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : '/tempCover.png';

  const author = book.author_name ? `by ${book.author_name[0]}` : 'Unknown Author';

  return (
    <div className="book-card" onClick={() => onClick(book)} style={{ cursor: 'pointer' }}>
      <div className="book-cover-container">
        <img
          src={coverUrl}
          alt={book.title}
          className="book-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = '/tempCover.png'; }}
        />

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
          position: 'absolute', right: '100%', marginRight: '10px'
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

        {/* Left Side: Cover Image */}
        <div style={{ width: '320px', flexShrink: 0, display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'center', marginTop: '50px', gap: '30px' }}>

            {/* Actions 2x2 Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px 60px', justifyItems: 'start' }}>
              <button onClick={() => setIsLoved(!isLoved)} className="inter-regular" style={{ width: '180px', justifyContent: 'flex-start', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: 'var(--color-dark)', padding: 0 }}>
                {isLoved ? <HeartSolid style={{ width: '32px', color: '#990000' }} /> : <HeartIcon style={{ width: '32px' }} />}
                {isLoved ? 'Loved' : 'Love'}
              </button>
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                onMouseEnter={() => setHoverBookmark(true)}
                onMouseLeave={() => setHoverBookmark(false)}
                className="inter-regular"
                style={{ width: '180px', justifyContent: 'flex-start', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: 'var(--color-dark)', padding: 0 }}
              >
                {isBookmarked ? <BookmarkSolid style={{ width: '32px', color: '#d4af37' }} /> : <BookmarkIcon style={{ width: '32px' }} />}
                {isBookmarked ? (hoverBookmark ? 'Remove' : 'Bookmarked') : 'Bookmark'}
              </button>
              <button onClick={() => setIsRead(!isRead)} className="inter-regular" style={{ width: '180px', justifyContent: 'flex-start', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: 'var(--color-dark)', padding: 0 }}>
                {isRead ? <EyeSolid style={{ width: '32px', color: '#3a9d46' }} /> : <EyeIcon style={{ width: '32px' }} />}
                {isRead ? 'Finished' : 'Unfinished'}
              </button>
              <button
                onClick={() => setInReadlist(!inReadlist)}
                onMouseEnter={() => setHoverReadlist(true)}
                onMouseLeave={() => setHoverReadlist(false)}
                className="inter-regular"
                style={{ width: '180px', justifyContent: 'flex-start', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: 'var(--color-dark)', padding: 0 }}
              >
                {inReadlist ? <ClockSolid style={{ width: '32px', color: '#3f7dbe' }} /> : <ClockIcon style={{ width: '32px' }} />}
                {inReadlist ? (hoverReadlist ? 'Remove' : 'Readlist') : 'Readlist'}
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

function LogModal({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

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
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    const fetchResults = async () => {
      setIsSearching(true);
      try {
        const data = await searchBooks(query);
        setResults(data || []);
      } catch (e) {
        setResults([]);
      }
      setIsSearching(false);
    };

    const delayDebounceFn = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 2000
    }} onClick={onClose}>
      <div style={{
        backgroundColor: 'var(--color-white)', borderRadius: '6px', width: '600px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '15px 20px', borderBottom: '1px solid var(--color-gray)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f3f4f6', borderTopLeftRadius: '6px', borderTopRightRadius: '6px' }}>
          <h3 className="inter-bold" style={{ margin: 0, color: 'var(--color-dark)', fontSize: '16px' }}>Add to your books...</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <XMarkIcon style={{ width: '20px', color: 'var(--color-dark)' }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '60px 40px', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-white)', borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search for book..."
              className="inter-regular"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ boxSizing: 'border-box', width: '100%', padding: '12px 15px', fontSize: '16px', borderRadius: '4px', border: '1px solid var(--color-gray)', outline: 'none' }}
            />
            {/* Dropdown Results */}
            {(results.length > 0 || isSearching) && query.trim() !== '' && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                backgroundColor: 'var(--color-white)', border: '1px solid var(--color-gray)',
                borderTop: 'none', borderRadius: '0 0 4px 4px', zIndex: 10,
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                maxHeight: '300px', overflowY: 'auto'
              }}>
                {isSearching && results.length === 0 ? (
                  <div style={{ padding: '10px 15px', color: 'var(--color-gray)', fontSize: '14px' }}>Searching...</div>
                ) : (
                  results.map((book) => (
                    <div key={book.key} className="log-search-item inter-regular" onClick={() => onClose()}>
                      <strong>{book.title}</strong>
                      {book.first_publish_year && <span style={{ opacity: 0.8, marginLeft: '6px' }}>({book.first_publish_year})</span>}
                      {book.author_name && <span style={{ opacity: 0.6, marginLeft: '6px' }}>by {book.author_name[0]}</span>}
                    </div>
                  ))
                )}
                {!isSearching && results.length === 0 && (
                  <div style={{ padding: '10px 15px', color: 'var(--color-gray)', fontSize: '14px' }}>No matches found.</div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedQuery, setDisplayedQuery] = useState('');
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
    setDisplayedQuery(searchQuery);
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
        <div className="header-left" onClick={() => setCurrentPage('home')} style={{ cursor: 'pointer' }}>
          <img src="/logo.png" alt="Logo" className="logo" />
          <h1 className="brand-name rakkas-regular">myArkived</h1>
        </div>
        <nav className="header-nav inter-bold" style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setCurrentPage('bookmarks'); }}>Bookmarks</a>
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setCurrentPage('readlist'); }}>Readlist</a>
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setCurrentPage('journal'); }}>Journal</a>
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setCurrentPage('about'); }}>About</a>
          </div>

          <form className="search-container" onSubmit={handleSearch} style={{ margin: 0, height: '36px', display: 'flex' }}>
            <input
              type="text"
              placeholder="Search books..."
              className="search-input inter-regular"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '0 15px', height: '100%', fontSize: '14px', width: '200px' }}
            />
            <button type="submit" className="search-button inter-bold" style={{ padding: '0 15px', height: '100%', fontSize: '14px' }}>Search</button>
          </form>

          <button className="inter-bold" onClick={() => setIsLogModalOpen(true)} style={{
            backgroundColor: '#3f7dbe', color: 'white', border: 'none',
            borderRadius: '4px', padding: '8px 16px', fontSize: '15px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '5px'
          }}>
            + LOG
          </button>
        </nav>
      </header>

      <main className="main-content">
        <div className="left-column">
          {currentPage === 'home' && (
            <>
              <h2 className="welcome-text inter-regular">
                {displayedQuery ? `Showing matches for "${displayedQuery}"` : "Welcome back, PilarPaladin. Here's whats been popular"}
              </h2>


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
            </>
          )}

          {currentPage === 'bookmarks' && <Bookmarks />}
          {currentPage === 'readlist' && <Readlist />}
          {currentPage === 'journal' && <Journal />}
          {currentPage === 'about' && <About />}
        </div>

        <Sidebar isLoading={isLoading} />
      </main>

      {selectedBook && <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />}

      {isLogModalOpen && <LogModal onClose={() => setIsLogModalOpen(false)} />}
    </div>
  );
}

export default App;
