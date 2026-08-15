import React, { useState, useEffect } from 'react';
import { searchBooks, getPopularBooks } from './services/api';
import toast, { Toaster } from 'react-hot-toast';
import Bookmarks from './pages/Bookmarks';
import Readlist from './pages/Readlist';
import Journal from './pages/Journal';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Activity from './pages/ActivityFeed';
import Sidebar from './components/Sidebar';
import { Book } from './components/BookCard';
import SearchModal from './components/SearchModal';
import Header from './components/Header';
import Fic from './pages/Fic';
import FinishedModal from './components/FinishedModal';
import { useBookActivity } from './hooks/useBookActivity';

function LogModalWrapper({ book, onClose }: { book: Book, onClose: () => void }) {
  const { activity, updateActivity } = useBookActivity(book);
  return (
    <FinishedModal
      book={book}
      activity={activity}
      onClose={onClose}
      onSave={updateActivity}
    />
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulated auth state
  const [currentPage, setCurrentPage] = useState('home');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedQuery, setDisplayedQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedBookToLog, setSelectedBookToLog] = useState<Book | null>(null);

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

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            displayedQuery={displayedQuery}
            isLoading={isLoading}
            books={books}
            setSelectedBook={(book) => { setSelectedBook(book); setCurrentPage('fic'); }}
          />
        );
      case 'bookmarks':
        return <Bookmarks />;
      case 'readlist':
        return <Readlist />;
      case 'journal':
        return <Journal />;
      case 'activity':
        return <Activity />;
      case 'fic':
        return selectedBook ? (
          <Fic book={selectedBook} onBack={() => { setCurrentPage('home'); setSelectedBook(null); }} />
        ) : null;
      default:
        return null;
    }
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
            {renderPage()}
          </div>

          <Sidebar isLoading={isLoading} setCurrentPage={setCurrentPage} onBookSelect={(book) => { setSelectedBook(book); setCurrentPage('fic'); }} />
        </main>
      )}

      {isLogModalOpen && (
        <SearchModal 
          onClose={() => setIsLogModalOpen(false)} 
          onSelectBook={(book) => setSelectedBookToLog(book)}
        />
      )}
      
      {selectedBookToLog && (
        <LogModalWrapper 
          book={selectedBookToLog} 
          onClose={() => setSelectedBookToLog(null)} 
        />
      )}
    </div>
  );
}

export default App;
