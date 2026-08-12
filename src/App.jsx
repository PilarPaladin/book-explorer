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
import BookCard from './components/BookCard';
import LogModal from './components/LogModal';
import Header from './components/Header';
import LoadingGrid from './components/LoadingGrid';



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
      <Header 
        setCurrentPage={setCurrentPage}
        handleSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setIsLogModalOpen={setIsLogModalOpen}
      />

      <main className="main-content">
        <div className="left-column">
          {currentPage === 'home' && (
            <>
              <h2 className="welcome-text inter-regular">
                {displayedQuery ? `Showing matches for "${displayedQuery}"` : "Welcome back, PilarPaladin. Here's whats been popular"}
              </h2>


              {isLoading ? (
                <LoadingGrid count={8} />
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
