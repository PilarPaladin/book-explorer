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
import SignUpModal from './components/SignUpModal';
import LogInModal from './components/LogInModal';

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
  const [previousPage, setPreviousPage] = useState('home');

  const navigate = (page: string) => {
    if (page !== currentPage) {
      setPreviousPage(currentPage);
      setCurrentPage(page);
    }
  };
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedQuery, setDisplayedQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedBookToLog, setSelectedBookToLog] = useState<Book | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<'register' | 'login'>('register');

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
            setSelectedBook={(book) => { setSelectedBook(book); navigate('fic'); }}
          />
        );
      case 'bookmarks':
        return <Bookmarks />;
      case 'readlist':
        return <Readlist />;
      case 'journal':
        return <Journal onBookSelect={(book) => { setSelectedBook(book); navigate('fic'); }} />;
      case 'activity':
        return <Activity onBookSelect={(book) => { setSelectedBook(book); navigate('fic'); }} />;
      case 'fic':
        return selectedBook ? (
          <Fic book={selectedBook} onBack={() => { navigate(previousPage); setSelectedBook(null); }} />
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
        isLoggedIn={isLoggedIn}
        onLoginClick={() => { setAuthModalType('login'); setIsAuthModalOpen(true); }}
        onRegisterClick={() => { setAuthModalType('register'); setIsAuthModalOpen(true); }}
        setCurrentPage={navigate}
        handleSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setIsLogModalOpen={setIsLogModalOpen}
      />

      {!isLoggedIn ? (
        <Welcome 
          onGetStarted={() => { setAuthModalType('register'); setIsAuthModalOpen(true); }} 
        />
      ) : (
        <main className="main-content">
          <div className="left-column">
            {renderPage()}
          </div>

          <Sidebar isLoading={isLoading} setCurrentPage={navigate} onBookSelect={(book) => { setSelectedBook(book); navigate('fic'); }} />
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

      {isAuthModalOpen && authModalType === 'register' && (
        <SignUpModal
          onClose={() => setIsAuthModalOpen(false)}
          onSwitchToLogin={() => setAuthModalType('login')}
        />
      )}
      
      {isAuthModalOpen && authModalType === 'login' && (
        <LogInModal
          onClose={() => setIsAuthModalOpen(false)}
          onSwitchToRegister={() => setAuthModalType('register')}
          onLoginSuccess={() => setIsLoggedIn(true)}
        />
      )}
    </div>
  );
}

export default App;
