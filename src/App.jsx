import React, { useState, useEffect } from 'react';
import { searchBooks, getPopularBooks } from './services/api';
import { EyeIcon, HeartIcon, BookmarkIcon, EllipsisHorizontalIcon, ClockIcon, StarIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { EyeIcon as EyeSolid, HeartIcon as HeartSolid, BookmarkIcon as BookmarkSolid, ClockIcon as ClockSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import Bookmarks from './pages/Bookmarks';
import Readlist from './pages/Readlist';
import Journal from './pages/Journal';
import Books from './pages/Books';
import Sidebar from './components/Sidebar';
import BookModal from './components/BookModal';

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
      <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 40px' }}>
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div onClick={() => setCurrentPage('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="Logo" className="logo" />
            <h1 className="brand-name rakkas-regular">myArkived</h1>
          </div>
        </div>
        <nav className="header-nav inter-bold" style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setCurrentPage('bookmarks'); }}>Bookmarks</a>
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setCurrentPage('readlist'); }}>Readlist</a>
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setCurrentPage('journal'); }}>Journal</a>
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setCurrentPage('books'); }}>Books</a>
          </div>

          <form className="search-container" onSubmit={handleSearch} style={{ margin: 0, height: '36px', display: 'flex', position: 'relative', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search myArkived"
              className="search-input inter-regular"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '0 35px 0 15px', height: '100%', fontSize: '14px', width: '240px', borderRadius: '4px', border: 'none', outline: 'none' }}
            />
            <button type="submit" style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: '#64748b' }}>
              <MagnifyingGlassIcon style={{ width: '18px' }} />
            </button>
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
          {currentPage === 'books' && <Books />}
        </div>

        <Sidebar isLoading={isLoading} />
      </main>

      {selectedBook && <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />}

      {isLogModalOpen && <LogModal onClose={() => setIsLogModalOpen(false)} />}
    </div>
  );
}

export default App;
