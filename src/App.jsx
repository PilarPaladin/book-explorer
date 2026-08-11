import React, { useState, useEffect } from 'react';
import { searchBooks, getPopularBooks } from './services/api';

// Props demonstration: BookCard component
function BookCard({ book, onClick }) {
  // Open Library API returns cover_i, title, author_name, first_publish_year
  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : 'https://via.placeholder.com/150x220?text=No+Cover';

  const author = book.author_name ? `by ${book.author_name[0]}` : 'Unknown Author';

  return (
    <div className="book-card" onClick={() => onClick(book)} style={{ cursor: 'pointer' }}>
      <img src={coverUrl} alt={book.title} className="book-cover" />
      <div className="book-info">
        <h3 className="book-title inter-bold">{book.title}</h3>
        <p className="book-author inter-regular">{author}</p>
        <p className="book-year inter-regular">{book.first_publish_year}</p>
      </div>
    </div>
  );
}

// Props demonstration: BookModal component
function BookModal({ book, onClose }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    setImgLoaded(false);
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
        backgroundColor: 'var(--color-white)', padding: '30px', borderRadius: '8px',
        display: 'flex', gap: '30px', maxWidth: '800px', width: '90%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ width: '220px', flexShrink: 0 }}>
          {!imgLoaded && (
            <img src="/tempCover.png" alt="Loading..." style={{ width: '220px', objectFit: 'contain', borderRadius: '4px', border: '1px solid var(--color-gray)', opacity: 0.6 }} />
          )}
          <img 
            src={coverUrl} 
            alt={book.title} 
            onLoad={() => setImgLoaded(true)} 
            style={{ 
              width: '220px', 
              objectFit: 'cover', 
              borderRadius: '4px', 
              border: '1px solid var(--color-gray)', 
              display: imgLoaded ? 'block' : 'none' 
            }} 
          />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h2 className="rakkas-regular" style={{ color: 'var(--color-red)', fontSize: '36px', marginTop: 0, marginBottom: '10px' }}>{book.title}</h2>

          <div className="inter-regular" style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px' }}>
            <p style={{ margin: 0 }}><strong>Author:</strong> {book.author_name?.join(', ') || 'Unknown'}</p>
            <p style={{ margin: 0 }}><strong>First Published:</strong> {book.first_publish_year || 'Unknown'}</p>
            <p style={{ margin: 0 }}><strong>Editions:</strong> {book.edition_count || 1}</p>
            {book.subject && (
              <div style={{ marginTop: '10px' }}>
                <strong style={{ display: 'block', marginBottom: '5px' }}>Tags:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {book.subject.slice(0, 8).map((sub, i) => (
                    <span key={i} style={{
                      backgroundColor: '#f3f4f6', padding: '4px 8px',
                      borderRadius: '4px', fontSize: '12px', color: 'var(--color-dark)'
                    }}>{sub}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button className="inter-bold" style={{
            marginTop: 'auto', alignSelf: 'flex-start', padding: '10px 24px',
            backgroundColor: 'var(--color-red)', color: 'white',
            border: 'none', borderRadius: '4px', cursor: 'pointer',
            fontSize: '14px'
          }} onClick={onClose}>Close</button>
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
          <a href="#" className="nav-link">Genres</a>
          <a href="#" className="nav-link">Browse</a>
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
