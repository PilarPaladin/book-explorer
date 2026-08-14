import React, { useState, useEffect } from 'react';
import { searchBooks, getPopularBooks } from './services/api';
import toast, { Toaster } from 'react-hot-toast';
import { EyeIcon, HeartIcon, BookmarkIcon, EllipsisHorizontalIcon, ClockIcon, StarIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { EyeIcon as EyeSolid, HeartIcon as HeartSolid, BookmarkIcon as BookmarkSolid, ClockIcon as ClockSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import Bookmarks from './pages/Bookmarks';
import Readlist from './pages/Readlist';
import Journal from './pages/Journal';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Activity from './pages/Activity';
import Sidebar from './components/Sidebar';
import BookCard, { Book } from './components/BookCard';
import SearchModal from './components/SearchModal';
import Header from './components/Header';
import LoadingGrid from './components/LoadingGrid';
import Fic from './pages/Fic';



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulated auth state
  const [currentPage, setCurrentPage] = useState('home');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedQuery, setDisplayedQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    const fetchInitial = async () => {
      setIsLoading(true);
      try {
        const results = await getPopularBooks();
        setBooks(results || []);
      } catch (err) {
        console.error("Failed to fetch initial books", err);
        toast.error("Failed to fetch initial books");
      }
      setIsLoading(false);
    };
    fetchInitial();
  }, []);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
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
      toast.error("Search failed");
    }
    setIsLoading(false);
  };

  return (
    <div className="app-container">
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#990000',
            color: '#ffffff',
            fontFamily: 'Inter, sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#ffffff',
              secondary: '#990000',
            },
          },
          error: {
            iconTheme: {
              primary: '#ffffff',
              secondary: '#990000',
            },
          },
        }}
      />
      <Header
        setCurrentPage={setCurrentPage}
        handleSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setIsLogModalOpen={setIsLogModalOpen}
      />

      {!isLoggedIn ? (
        <Welcome setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <main className="main-content">
          <div className="left-column">
            {currentPage === 'home' && (
                <Home
                  displayedQuery={displayedQuery}
                  isLoading={isLoading}
                  books={books}
                  setSelectedBook={(book) => { setSelectedBook(book); setCurrentPage('fic'); }}
                />
            )}

            {currentPage === 'bookmarks' && <Bookmarks />}
            {currentPage === 'readlist' && <Readlist />}
            {currentPage === 'journal' && <Journal />}
            {currentPage === 'activity' && <Activity />}
            {currentPage === 'fic' && selectedBook && <Fic book={selectedBook} onBack={() => { setCurrentPage('home'); setSelectedBook(null); }} />}
          </div>

          <Sidebar isLoading={isLoading} setCurrentPage={setCurrentPage} onBookSelect={(book) => { setSelectedBook(book); setCurrentPage('fic'); }} />
        </main>
      )}

      {isLogModalOpen && <SearchModal onClose={() => setIsLogModalOpen(false)} />}
    </div>
  );
}

export default App;
